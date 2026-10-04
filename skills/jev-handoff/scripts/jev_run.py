#!/usr/bin/env python3
"""Run a typed Jev form over JSONL/CSV records. Prints summary only; requires Python 3.10+.

Space Age fork of the original jev-handoff runner (Jack Roberts). Adds:
  --provider {openrouter,typesafe}   swap decision backend without editing the script
  --retries / --retry-base-delay     bounded, jittered retry on transient (429/5xx/network) errors only
  --resume                            continue an interrupted run instead of refusing the output dir
  review.csv                          human-triage export alongside results.jsonl / summary.json
Everything else — the no-silent-retry-on-ambiguous-errors default, the 20-row/4-worker
calibration defaults, the strict answer validation — is unchanged from upstream by design.
"""
import argparse, concurrent.futures, csv, json, math, os, random, statistics, sys, time
import urllib.error, urllib.request
from pathlib import Path

PROVIDERS = {
    'openrouter': {
        'url': 'https://openrouter.ai/api/alpha/decisions',
        'default_model': 'typesafe/jev-1.13',
        'env_key': 'OPENROUTER_API_KEY',
    },
    'typesafe': {
        'url': 'https://api.typesafe.ai/v1/systemone',
        'default_model': 'jev-latest',
        'env_key': 'TYPESAFE_API_KEY',
    },
}

# HTTP statuses worth a bounded retry: rate limiting and transient server failure.
# 4xx other than 429 means the request itself is wrong — retrying wastes paid calls.
RETRYABLE_STATUSES = {429, 500, 502, 503, 504}

def validate_form(form):
    if not isinstance(form, dict):
        raise ValueError('The form must be a JSON object.')
    questions = form.get('questions', form)
    if not isinstance(questions, dict) or not questions:
        raise ValueError('The form must contain a nonempty questions object.')
    for name, q in questions.items():
        if not isinstance(q, dict) or q.get('type') not in ('noul', 'choice', 'score'):
            raise ValueError(f'{name}: type must be noul, choice or score.')
        if not str(q.get('instructions', '')).strip():
            raise ValueError(f'{name}: write explicit instructions.')
        criteria = q.get('criteria')
        if q['type'] == 'choice' and (not isinstance(criteria, dict) or not 2 <= len(criteria) <= 255):
            raise ValueError(f'{name}: choice needs 2–255 named options.')
        if q['type'] == 'score' and (not isinstance(criteria, list) or not 2 <= len(criteria) <= 10):
            raise ValueError(f'{name}: score needs 2–10 ordered levels.')
    return questions

def read_rows(path):
    with path.open(encoding='utf-8-sig') as f:
        if path.suffix.lower() == '.csv':
            return list(csv.DictReader(f))
        return [json.loads(line) for line in f if line.strip()]

def read_completed_ids(results_path):
    """Row IDs that already have a non-error result, for --resume."""
    done = set()
    if not results_path.exists():
        return done
    with results_path.open() as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                record = json.loads(line)
            except json.JSONDecodeError:
                continue
            if 'error' not in record and 'row_id' in record:
                done.add(record['row_id'])
    return done

def certainty(answer):
    if answer.get('type') == 'noul':
        return abs(float(answer['noul']) - .5) * 2
    return answer.get('confidence')

def validate_answers(questions, answers):
    if not isinstance(answers, dict):
        raise ValueError('No answers object returned.')
    for name, q in questions.items():
        a = answers.get(name, {})
        if not isinstance(a, dict):
            raise ValueError(f'{name}: answer must be an object.')
        if a.get('type') != q['type']:
            raise ValueError(f'{name}: invalid answer type.')
        if q['type'] == 'noul':
            p = a.get('noul')
            if type(p) not in (int, float) or not math.isfinite(p) or not 0 <= p <= 1:
                raise ValueError(f'{name}: invalid probability.')
        elif q['type'] == 'choice' and a.get('choice') not in q['criteria']:
            raise ValueError(f'{name}: unexpected choice.')
        elif q['type'] == 'score':
            v = a.get('score')
            if type(v) not in (int, float) or not math.isfinite(v) or not 0 <= v <= len(q['criteria']) - 1:
                raise ValueError(f'{name}: score outside rubric.')
        if q['type'] != 'noul':
            confidence = a.get('confidence')
            if confidence is not None and (type(confidence) not in (int, float) or not math.isfinite(confidence) or not 0 <= confidence <= 1):
                raise ValueError(f'{name}: invalid confidence.')
            options = list(q['criteria']) if q['type'] == 'choice' else [str(i) for i in range(len(q['criteria']))]
            probabilities = a.get('probabilities')
            if not isinstance(probabilities, dict):
                raise ValueError(f'{name}: missing probabilities.')
            values = [probabilities.get(k) for k in options]
            if any(type(p) not in (int, float) or not math.isfinite(p) or not 0 <= p <= 1 for p in values) or abs(sum(values) - 1) > .025:
                raise ValueError(f'{name}: invalid probability distribution.')
    return answers

def backoff_delay(attempt, base_delay):
    """Exponential backoff with full jitter, attempt is 0-indexed."""
    return random.uniform(0, base_delay * (2 ** attempt))

def request(row, questions, model, key, timeout, url, retries, retry_base_delay):
    body = json.dumps({'model': model, 'state': row, 'questions': questions}).encode()
    attempts = 0
    while True:
        req = urllib.request.Request(url, data=body,
            headers={'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json'}, method='POST')
        start = time.monotonic()
        try:
            with urllib.request.urlopen(req, timeout=timeout) as response:
                data = json.load(response)
            break
        except urllib.error.HTTPError as e:
            if e.code in RETRYABLE_STATUSES and attempts < retries:
                time.sleep(backoff_delay(attempts, retry_base_delay))
                attempts += 1
                continue
            raise RuntimeError(f'Provider HTTP {e.code}. Check access, rate limits and the request schema.') from None
        except urllib.error.URLError:
            if attempts < retries:
                time.sleep(backoff_delay(attempts, retry_base_delay))
                attempts += 1
                continue
            raise RuntimeError('Provider connection failed or timed out.') from None
    if data.get('error'):
        raise RuntimeError('Provider returned an error. Check access and schema.')
    return {'model': data.get('model', model), 'answers': validate_answers(questions, data.get('answers')),
            'usage': data.get('usage', {}), 'latency_s': time.monotonic() - start, 'attempts': attempts + 1}

def write_review_csv(path, review_rows):
    with path.open('w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['row_id', 'questions_needing_review'])
        for r in review_rows:
            writer.writerow([r['row_id'], '; '.join(r['questions'])])

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--form', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True, help='Output directory. Existing directories are refused unless --resume.')
    parser.add_argument('--workers', type=int, default=4, choices=range(1, 21), metavar='1–20')
    parser.add_argument('--limit', type=int, default=20, help='Maximum rows per run; default 20 for initial calibration.')
    parser.add_argument('--provider', choices=sorted(PROVIDERS), default='openrouter')
    parser.add_argument('--model', default=None, help='Overrides the provider default model.')
    parser.add_argument('--timeout', type=int, default=60)
    parser.add_argument('--retries', type=int, default=0, choices=range(0, 6), metavar='0–5',
        help='Bounded retries on 429/5xx/connection errors only. Default 0 preserves original no-retry behavior.')
    parser.add_argument('--retry-base-delay', type=float, default=1.0, help='Base seconds for exponential backoff with jitter.')
    parser.add_argument('--resume', action='store_true', help='Continue into an existing --output dir, skipping row IDs already answered.')
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    if args.limit < 1 or not 1 <= args.timeout <= 300:
        parser.error('Use a positive row limit and a timeout of 1–300 seconds.')
    provider = PROVIDERS[args.provider]
    model = args.model or provider['default_model']
    form = json.loads(args.form.read_text())
    questions = validate_form(form)
    review = form.get('review', {}) if 'questions' in form else {}
    if not isinstance(review, dict):
        raise ValueError('Review must be an object keyed by question ID.')
    for name, threshold in review.items():
        if name not in questions or not isinstance(threshold, (int, float)) or not 0 <= threshold <= 1:
            raise ValueError('Review thresholds must name existing questions and be between 0 and 1.')
    rows = read_rows(args.input)[:args.limit]
    if not rows:
        raise ValueError('No records found in the input.')
    if args.dry_run:
        print(json.dumps({'dry_run': True, 'rows': len(rows), 'questions': list(questions),
                          'workers': args.workers, 'provider': args.provider, 'model': model,
                          'retries': args.retries, 'paid_requests': 0}, indent=2))
        return
    results_path = args.output / 'results.jsonl'
    if args.resume:
        if not args.output.exists():
            raise ValueError('--resume requires an existing --output directory from a prior run.')
    key = os.environ.get(provider['env_key'])
    if not key:
        raise ValueError(f"Set {provider['env_key']} in your environment. Do not paste it into a prompt.")
    if args.resume:
        already_done = read_completed_ids(results_path)
    else:
        args.output.mkdir(parents=True, exist_ok=False)
        already_done = set()
    pending = [(i, row) for i, row in enumerate(rows)
               if (row.get('id', str(i + 1)) if isinstance(row, dict) else str(i + 1)) not in already_done]
    start = time.monotonic()
    new_results = []
    def run(item):
        i, row = item
        result = {'row_id': row.get('id', str(i + 1)) if isinstance(row, dict) else str(i + 1), 'index': i}
        try:
            result.update(request(row, questions, model, key, args.timeout,
                                   provider['url'], args.retries, args.retry_base_delay))
            result['review_questions'] = [name for name, threshold in review.items()
                if certainty(result['answers'][name]) is None or certainty(result['answers'][name]) < threshold]
        except Exception as e:
            result['error'] = str(e)
        return result
    mode = 'a' if args.resume else 'w'
    with results_path.open(mode) as f:
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
            for result in pool.map(run, pending):
                new_results.append(result)
                f.write(json.dumps(result) + '\n')
                f.flush()
    all_results = new_results
    if args.resume:
        with results_path.open() as f:
            all_results = [json.loads(line) for line in f if line.strip()]
    good = [r for r in all_results if 'error' not in r]
    priced = [r['usage']['cost'] for r in good if isinstance(r.get('usage', {}).get('cost'), (int, float))]
    review_rows = [{'row_id': r['row_id'], 'questions': r['review_questions']} for r in good if r.get('review_questions')]
    summary = {'provider': args.provider, 'model': model, 'rows': len(rows), 'answered': len(good),
        'errors': len(all_results) - len(good), 'skipped_already_done': len(already_done),
        'wall_time_s': round(time.monotonic() - start, 3), 'workers': args.workers, 'retries_allowed': args.retries,
        'reported_cost_usd': sum(priced) if priced else None, 'unpriced_successes': len(good) - len(priced),
        'median_latency_s': round(statistics.median(r['latency_s'] for r in good), 3) if good else None,
        'review_rows': review_rows,
        'results_file': str(results_path.resolve())}
    (args.output / 'summary.json').write_text(json.dumps(summary, indent=2) + '\n')
    if review_rows:
        write_review_csv(args.output / 'review.csv', review_rows)
        summary['review_file'] = str((args.output / 'review.csv').resolve())
    print(json.dumps(summary, indent=2))
    if summary['errors']:
        sys.exit(2)

if __name__ == '__main__':
    try:
        main()
    except (ValueError, FileExistsError, OSError, json.JSONDecodeError) as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        sys.exit(1)
