"""Unit tests for jev_run.py's pure functions. No network calls — run with:

    python3 -m pytest tests/test_jev_run.py

(pytest is not a runtime dependency of the skill itself; it's only needed to run these tests.)
"""
import importlib.util
import json
import sys
from pathlib import Path

import pytest

SCRIPT = Path(__file__).resolve().parent.parent / 'scripts' / 'jev_run.py'
spec = importlib.util.spec_from_file_location('jev_run', SCRIPT)
jev_run = importlib.util.module_from_spec(spec)
sys.modules['jev_run'] = jev_run
spec.loader.exec_module(jev_run)


NOUL_Q = {'spam': {'type': 'noul', 'instructions': 'Is this spam?'}}
CHOICE_Q = {'owner': {'type': 'choice', 'instructions': 'Who owns it?',
                       'criteria': {'a': 'Team A', 'b': 'Team B'}}}
SCORE_Q = {'urgency': {'type': 'score', 'instructions': 'How urgent?',
                        'criteria': ['low', 'medium', 'high']}}


# --- validate_form ---------------------------------------------------------

def test_validate_form_accepts_bare_questions_dict():
    assert jev_run.validate_form(dict(NOUL_Q)) == NOUL_Q

def test_validate_form_accepts_wrapped_questions():
    form = {'questions': dict(NOUL_Q), 'review': {'spam': 0.5}}
    assert jev_run.validate_form(form) == NOUL_Q

def test_validate_form_rejects_non_dict():
    with pytest.raises(ValueError):
        jev_run.validate_form(['not', 'a', 'dict'])

def test_validate_form_rejects_empty_questions():
    with pytest.raises(ValueError):
        jev_run.validate_form({})

def test_validate_form_rejects_bad_type():
    with pytest.raises(ValueError):
        jev_run.validate_form({'q': {'type': 'essay', 'instructions': 'x'}})

def test_validate_form_rejects_missing_instructions():
    with pytest.raises(ValueError):
        jev_run.validate_form({'q': {'type': 'noul', 'instructions': '   '}})

def test_validate_form_rejects_choice_with_one_option():
    with pytest.raises(ValueError):
        jev_run.validate_form({'q': {'type': 'choice', 'instructions': 'x', 'criteria': {'a': 'A'}}})

def test_validate_form_rejects_score_with_one_level():
    with pytest.raises(ValueError):
        jev_run.validate_form({'q': {'type': 'score', 'instructions': 'x', 'criteria': ['only']}})

def test_validate_form_accepts_score_with_ten_levels():
    q = {'q': {'type': 'score', 'instructions': 'x', 'criteria': list(range(10))}}
    assert jev_run.validate_form(q) == q

def test_validate_form_rejects_score_with_eleven_levels():
    with pytest.raises(ValueError):
        jev_run.validate_form({'q': {'type': 'score', 'instructions': 'x', 'criteria': list(range(11))}})


# --- validate_answers -------------------------------------------------------

def test_validate_answers_noul_ok():
    answers = {'spam': {'type': 'noul', 'noul': 0.9}}
    assert jev_run.validate_answers(NOUL_Q, answers) == answers

def test_validate_answers_noul_out_of_range():
    with pytest.raises(ValueError):
        jev_run.validate_answers(NOUL_Q, {'spam': {'type': 'noul', 'noul': 1.5}})

def test_validate_answers_noul_wrong_type_field():
    with pytest.raises(ValueError):
        jev_run.validate_answers(NOUL_Q, {'spam': {'type': 'choice', 'noul': 0.5}})

def test_validate_answers_not_a_dict():
    with pytest.raises(ValueError):
        jev_run.validate_answers(NOUL_Q, None)

def test_validate_answers_choice_ok_with_valid_distribution():
    answers = {'owner': {'type': 'choice', 'choice': 'a', 'confidence': 0.8,
                          'probabilities': {'a': 0.8, 'b': 0.2}}}
    assert jev_run.validate_answers(CHOICE_Q, answers) == answers

def test_validate_answers_choice_rejects_unknown_option():
    answers = {'owner': {'type': 'choice', 'choice': 'c', 'confidence': 0.8,
                          'probabilities': {'a': 0.8, 'b': 0.2}}}
    with pytest.raises(ValueError):
        jev_run.validate_answers(CHOICE_Q, answers)

def test_validate_answers_choice_rejects_bad_probability_sum():
    answers = {'owner': {'type': 'choice', 'choice': 'a', 'confidence': 0.8,
                          'probabilities': {'a': 0.8, 'b': 0.8}}}
    with pytest.raises(ValueError):
        jev_run.validate_answers(CHOICE_Q, answers)

def test_validate_answers_choice_missing_probabilities():
    answers = {'owner': {'type': 'choice', 'choice': 'a', 'confidence': 0.8}}
    with pytest.raises(ValueError):
        jev_run.validate_answers(CHOICE_Q, answers)

def test_validate_answers_score_within_rubric():
    answers = {'urgency': {'type': 'score', 'score': 2, 'confidence': 0.7,
                            'probabilities': {'0': 0.1, '1': 0.2, '2': 0.7}}}
    assert jev_run.validate_answers(SCORE_Q, answers) == answers

def test_validate_answers_score_out_of_rubric():
    answers = {'urgency': {'type': 'score', 'score': 5, 'confidence': 0.7,
                            'probabilities': {'0': 0.1, '1': 0.2, '2': 0.7}}}
    with pytest.raises(ValueError):
        jev_run.validate_answers(SCORE_Q, answers)


# --- certainty ---------------------------------------------------------------

def test_certainty_noul_at_extremes_is_high():
    assert jev_run.certainty({'type': 'noul', 'noul': 0.0}) == pytest.approx(1.0)
    assert jev_run.certainty({'type': 'noul', 'noul': 1.0}) == pytest.approx(1.0)

def test_certainty_noul_at_half_is_zero():
    assert jev_run.certainty({'type': 'noul', 'noul': 0.5}) == pytest.approx(0.0)

def test_certainty_choice_uses_confidence_field():
    assert jev_run.certainty({'type': 'choice', 'confidence': 0.42}) == 0.42


# --- read_rows / read_completed_ids ------------------------------------------

def test_read_rows_jsonl(tmp_path):
    p = tmp_path / 'rows.jsonl'
    p.write_text('{"id": "1"}\n\n{"id": "2"}\n')
    rows = jev_run.read_rows(p)
    assert rows == [{'id': '1'}, {'id': '2'}]

def test_read_rows_csv(tmp_path):
    p = tmp_path / 'rows.csv'
    p.write_text('id,body\n1,hello\n2,world\n')
    rows = jev_run.read_rows(p)
    assert rows == [{'id': '1', 'body': 'hello'}, {'id': '2', 'body': 'world'}]

def test_read_completed_ids_skips_errors_and_missing_file(tmp_path):
    missing = tmp_path / 'nope.jsonl'
    assert jev_run.read_completed_ids(missing) == set()
    p = tmp_path / 'results.jsonl'
    p.write_text(
        json.dumps({'row_id': '1', 'answers': {}}) + '\n' +
        json.dumps({'row_id': '2', 'error': 'boom'}) + '\n' +
        json.dumps({'row_id': '3', 'answers': {}}) + '\n'
    )
    assert jev_run.read_completed_ids(p) == {'1', '3'}


# --- backoff_delay -------------------------------------------------------------

def test_backoff_delay_grows_with_attempt():
    # Full-jitter backoff is randomized, so check the upper bound scales as documented.
    samples_0 = [jev_run.backoff_delay(0, 1.0) for _ in range(200)]
    samples_3 = [jev_run.backoff_delay(3, 1.0) for _ in range(200)]
    assert max(samples_0) <= 1.0
    assert max(samples_3) <= 8.0
    assert max(samples_3) > max(samples_0)

def test_backoff_delay_never_negative():
    assert all(jev_run.backoff_delay(a, 2.0) >= 0 for a in range(5))
