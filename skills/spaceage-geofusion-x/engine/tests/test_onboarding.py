import json
import tempfile
import unittest
from pathlib import Path
from geofusion.onboarding import make_config, parse_csv, save_config, questionnaire

class OnboardingTests(unittest.TestCase):
    def test_public_config(self):
        config=make_config('business',['google_maps','websites'],location='Dallas')
        self.assertEqual(config['phase'],'configured_not_executed')
        self.assertEqual(config['limits']['max_records'],100)
    def test_requires_authenticated_authorization(self):
        with self.assertRaises(ValueError):
            make_config('social',['instagram'],access='authorized_session')
    def test_rejects_bad_scope(self):
        with self.assertRaises(ValueError):
            make_config('social',['not_a_platform'])
    def test_multiple_objectives_and_methods(self):
        cfg=make_config('business,social',['google_maps','instagram'],access=['public','approved_api'],authorization=True)
        self.assertEqual(cfg['goals'],['business','social'])
        self.assertEqual(cfg['access_methods'],['public','approved_api'])
    def test_expanded_platforms(self):
        cfg=make_config('social,competitive',['x','facebook','tiktok','linkedin','lemon8','pinterest','discord','threads'])
        self.assertEqual(len(cfg['platforms']),8)
        self.assertEqual(cfg['platform_readiness']['lemon8'],'planned_connector_not_wired')
    def test_custom_platform(self):
        cfg=make_config('general',['custom:niche-network'])
        self.assertEqual(cfg['platform_readiness']['custom:niche-network'],'needs_custom_connector')
    def test_rejects_bad_custom_platform(self):
        with self.assertRaises(ValueError): make_config('general',['custom:../../secrets'])
    def test_csv_parser(self):
        self.assertEqual(parse_csv('reddit, reddit, youtube'),['reddit','youtube'])
    def test_questionnaire_roundtrip(self):
        answers=iter(['business,social','google_maps,instagram','Dallas','name,phone','public,authorized_session','yes','10','5','0','json'])
        cfg=questionnaire(input_fn=lambda prompt:next(answers),output_fn=lambda msg:None)
        with tempfile.TemporaryDirectory() as d:
            p=Path(d)/'config.json'
            save_config(cfg,p)
            saved=json.loads(p.read_text())
            self.assertEqual(saved['output_format'],'json')
            self.assertEqual(saved['goals'],['business','social'])
            self.assertEqual(saved['access_methods'],['public','authorized_session'])
            with self.assertRaises(FileExistsError): save_config(cfg,p)

if __name__=='__main__':unittest.main()
