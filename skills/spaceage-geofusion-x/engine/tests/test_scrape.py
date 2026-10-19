import io
import json
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest import mock
from geofusion import scrape as sc, social
from geofusion.router import Judge

RAW = json.dumps(json.loads((Path(__file__).parent / 'fixtures' / 'gosom_fast_mesquite.json').read_text()))  # GoSom writes one line


def jev(answers):
    """Fake TypeSafe poster: returns the given answer per question name."""
    return lambda body: {'model': 'jev-1.13.0', 'answers': {k: answers[k] for k in body['questions']}}


class TestIntent(unittest.TestCase):
    def test_code_baseline(self):
        self.assertEqual(sc.intent_baseline('reddit', 'best landscaper recommendations'), 'posts')
        self.assertEqual(sc.intent_baseline('linkedin', 'irrigation jobs'), 'jobs')
        self.assertEqual(sc.intent_baseline('youtube', 'lawn care creators'), 'channels')
        self.assertEqual(sc.intent_baseline('web', 'https://example.com/a'), 'page')
        self.assertEqual(sc.intent_baseline('maps', 'anything'), 'businesses')
        self.assertIsNone(sc.intent_baseline('reddit', 'lawn care'))  # no signal -> Jev
        self.assertIsNone(sc.intent_baseline('x', 'accounts posting complaints'))  # two signals -> Jev

    def test_no_key_falls_back_to_default_and_logs(self):
        j = Judge(mode='baseline')
        d = sc.decide(j, 'reddit', 'lawn care', 'Dallas')
        self.assertEqual((d['intent'], d['intent_by']), ('posts', 'default (none)'))
        self.assertTrue(j.log[0]['escalate'])

    def test_jev_decides_ambiguous_and_noul_hint(self):
        j = Judge(mode='jev', poster=jev({'intent': {'type': 'choice', 'choice': 'communities', 'confidence': 0.9, 'probabilities': {}},
                                          'source_fit': {'type': 'noul', 'noul': 0.1}}))
        d = sc.decide(j, 'reddit', 'lawn care', 'Dallas')
        self.assertEqual((d['intent'], d['intent_by']), ('communities', 'jev'))
        self.assertIn('unlikely', d['hint'])
        self.assertEqual(j.log[1]['confidence'], 0.8)  # Noul certainty = 2*|p-0.5|

    def test_low_confidence_escalates(self):
        j = Judge(mode='jev', poster=jev({'intent': {'choice': 'profiles', 'confidence': 0.4}, 'source_fit': {'noul': 0.55}}))
        sc.decide(j, 'x', 'lawn', '')
        self.assertTrue(all(r['escalate'] for r in j.log))


class TestPieces(unittest.TestCase):
    def test_geocode_and_grid(self):
        body = json.dumps([{'boundingbox': ['32.70', '32.86', '-96.68', '-96.50'], 'display_name': 'Mesquite, TX'}]).encode()
        bbox, name = sc.geocode('Mesquite TX', opener=lambda req, timeout: io.BytesIO(body))
        self.assertEqual(bbox, [32.70, -96.68, 32.86, -96.50])
        self.assertEqual(sc.grid(bbox), (2, 3))

    def test_from_items_and_derived_communities(self):
        out = json.dumps({'items': [{'title': 'Who mows?', 'subreddit': 'Dallas', 'url': 'u1', 'score': 5}, {'title': 'Sod?', 'subreddit': 'Dallas'},
                                    {'title': 'HOA', 'subreddit': 'texas'}]})
        run = lambda cmd, **kw: SimpleNamespace(returncode=0, stdout=out, stderr='')
        with tempfile.TemporaryDirectory() as td, mock.patch('shutil.which', return_value='/bin/x'):
            rows, errs = sc.collect_social('reddit', 'communities', 'lawn', 'Dallas', 10, Path(td), runner=run)
            self.assertTrue((Path(td) / 'reddit.txt').exists())  # raw evidence on disk
        self.assertEqual([(r['title'], r['metric']) for r in rows], [('Dallas', 2), ('texas', 1)])

    def test_auth_failure_reported_from_doctor_backend(self):
        run = lambda cmd, **kw: SimpleNamespace(returncode=1, stdout='', stderr='not logged in')
        with tempfile.TemporaryDirectory() as td, mock.patch('shutil.which', return_value='/bin/x'):
            rows, errs = sc.collect_social('x', 'posts', 'lawn', '', 5, Path(td), backend='twitter-cli', runner=run)
        self.assertEqual(rows, [])
        self.assertIn('twitter: requires_auth', errs[0])

    def test_missing_backend_is_not_an_auth_problem(self):
        rep = {'twitter': {'status': 'warn', 'message': 'Twitter CLI 未安装。安装方式：pipx install twitter-cli'},
               'instagram': {'status': 'warn', 'message': 'OpenCLI 已安装，但未检测到已连接的浏览器扩展'}}
        r = social.readiness(['x', 'instagram'], report=rep)
        self.assertEqual((r['x']['status'], r['instagram']['status']), ('configuration_missing', 'requires_auth'))


class TestScrape(unittest.TestCase):
    def test_login_source_needs_authorization(self):
        with tempfile.TemporaryDirectory() as td:
            rows, meta = sc.scrape('instagram', 'lawn care', 'Dallas', workdir=td, judge=Judge(mode='baseline'),
                                   social_ready={'instagram': {'status': 'supported', 'backend': 'OpenCLI'}})
        self.assertEqual(rows, [])
        self.assertIn('--authorized', meta['errors'][0])
        self.assertEqual(sc.compact(rows, meta)['status'], 'blocked')

    def test_web_page_defuddle_then_agent_reach(self):
        bad = mock.Mock(side_effect=RuntimeError('defuddle down'))
        with tempfile.TemporaryDirectory() as td, mock.patch.dict(sc.PAGE, {'defuddle': bad, 'agent-reach:jina': lambda u: ('Acme', 'Lawn care ' * 200)}):
            rows, meta = sc.scrape('web', 'https://acme.test/', workdir=td, judge=Judge(mode='baseline'))
            self.assertTrue((Path(meta['workdir']) / 'raw' / 'page.md').exists())
        self.assertEqual((rows[0]['collector'], meta['route'], meta['intent']), ('agent-reach:jina', 'agent-reach:jina', 'page'))
        self.assertLessEqual(len(rows[0]['text']), sc.TEXT_MAX)
        self.assertIn('defuddle down', meta['errors'][0])

    def test_web_page_unreadable_names_the_skill_to_use(self):
        bad = mock.Mock(side_effect=RuntimeError('403'))
        with tempfile.TemporaryDirectory() as td, mock.patch.dict(sc.PAGE, {'defuddle': bad, 'agent-reach:jina': bad}):
            rows, meta = sc.scrape('web', 'https://spa.test/', workdir=td, judge=Judge(mode='baseline'))
        self.assertEqual((rows, meta['route']), ([], 'none'))
        self.assertIn('firecrawl-mcp', meta['next']['js_or_spa'])

    def test_web_search(self):
        hits = [{'title': f't{i}', 'url': f'https://s{i}.test/', 'text': 'x'} for i in range(8)]
        with tempfile.TemporaryDirectory() as td, mock.patch.object(sc.social, 'exa_search', return_value={'results': hits}):
            rows, meta = sc.scrape('web', 'landscapers', 'Mesquite TX', n=5, workdir=td, judge=Judge(mode='baseline'))
        self.assertEqual((len(rows), rows[0]['website'], meta['route']), (5, 's0.test', 'agent-reach:exa'))
        self.assertEqual(len(sc.compact(rows, meta)['top']), 5)

    def test_maps_end_to_end_with_fake_gosom(self):
        def gosom(cmd, **kw):
            Path(cmd[cmd.index('-results') + 1]).write_text(RAW); return SimpleNamespace(returncode=0, stdout='', stderr='')
        with tempfile.TemporaryDirectory() as td, mock.patch.object(sc, 'geocode', return_value=([32.70, -96.68, 32.77, -96.61], 'Mesquite, TX')), \
                mock.patch('geofusion.maps.gosom_command', return_value=['gmaps-scraper']):
            rows, meta = sc.scrape('maps', 'landscaping', 'Mesquite TX', n=0, workdir=td, judge=Judge(mode='baseline'), gosom_runner=gosom)
        self.assertEqual(len(rows), meta['rows']); self.assertGreater(len(rows), 0)
        self.assertEqual((meta['tiles'], meta['route'], rows[0]['source']), (1, 'maps.gosom.fast', 'maps'))
        self.assertTrue(any(r['phone'] for r in rows))

    def test_maps_requires_where(self):
        with tempfile.TemporaryDirectory() as td, self.assertRaises(ValueError):
            sc.scrape('maps', 'plumbers', workdir=td, judge=Judge(mode='baseline'))


class TestCompare(unittest.TestCase):
    def test_blocked_without_key(self):
        self.assertEqual(sc.compare([{'source': 'x', 'what': 'a'}], judge=Judge(mode='baseline'))['status'], 'blocked')

    def test_metrics(self):
        j = Judge(mode='jev', poster=jev({'intent': {'choice': 'posts', 'confidence': 0.9}}))
        r = sc.compare([{'source': 'reddit', 'what': 'recommendations', 'expected': 'posts'}, {'source': 'reddit', 'what': 'lawn care', 'expected': 'posts'}], judge=j)
        self.assertEqual((r['code_decided'], r['agreement_when_both'], r['jev_rescued'], r['escalation_rate']), (1, 1.0, 1, 0.0))
        self.assertEqual(r['accuracy_vs_expected'], {'code': 0.5, 'jev': 1.0})


if __name__ == '__main__':
    unittest.main()
