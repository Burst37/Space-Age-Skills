import json
import tempfile
import unittest
from pathlib import Path
from geofusion.core import Store,normalize,identity,import_file
from geofusion.adapters import Extractor
class TestEngine(unittest.TestCase):
    def test_dedup_observation(self):
        with tempfile.TemporaryDirectory() as d:
            s=Store(Path(d)/'store.db')
            x={'name':'North Cafe','address':'123 Main','phone':'555-1234','source':'maps','rating':'4.2'}
            a=s.upsert(x);b=s.upsert(dict(x,rating='4.8'))
            self.assertEqual(a,b);self.assertEqual(s.stats(),{'unique_businesses':1,'observations':2})
            self.assertEqual(next(s.records())['rating'],'4.8')
    def test_distinct_branches(self):
        self.assertNotEqual(identity(normalize({'name':'Acme','address':'A street'})),identity(normalize({'name':'Acme','address':'B street'})))
    def test_export_import(self):
        with tempfile.TemporaryDirectory() as d:
            s=Store(Path(d)/'s.db');s.upsert({'name':'ABC','website':'https://abc.example','social_profiles':['https://instagram.com/abc']})
            csv=Path(d)/'out.csv';self.assertEqual(s.export(csv),1)
            s2=Store(Path(d)/'new.db');import_file(csv,s2,'import')
            self.assertEqual(s2.stats()['unique_businesses'],1)
            self.assertEqual(next(s2.records())['social_profiles'],['https://instagram.com/abc'])
    def test_social_parse(self):
        p=Extractor();p.feed('<title>Test</title><a href="https://instagram.com/test">Insta</a><a href="mailto:hi@example.com">Mail</a>')
        self.assertEqual(p.title,'Test');self.assertEqual(len(p.links),2)
    def test_bad_record(self):
        with self.assertRaises(ValueError):normalize({'phone':'123'})
if __name__=='__main__':unittest.main()
