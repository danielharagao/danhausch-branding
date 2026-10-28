"""Verify the imported endpoint's response contract without sending email."""
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('diagnostic', Path(__file__).resolve().parents[1] / 'backend/diagnostic/app.py')
diagnostic = importlib.util.module_from_spec(spec)
spec.loader.exec_module(diagnostic)

class DiagnosticTest(unittest.TestCase):
    def setUp(self):
        self.client = diagnostic.app.test_client()

    def test_invalid_email_does_not_generate_or_send(self):
        with patch.object(diagnostic, 'create_pdf') as pdf, patch.object(diagnostic, 'send_email') as send:
            response = self.client.post('/diagnostico', json={'email': 'invalid'})
        self.assertEqual(response.status_code, 400)
        self.assertFalse(response.json['ok'])
        pdf.assert_not_called()
        send.assert_not_called()

    def test_success_requires_email_send(self):
        with patch.object(diagnostic, 'create_pdf', return_value=Path('/tmp/synthetic.pdf')), patch.object(diagnostic, 'send_email') as send:
            response = self.client.post('/diagnostico', json={'email': 'test@example.com'})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json['ok'])
        send.assert_called_once()
        self.assertEqual(send.call_args.args[0], 'test@example.com')

    def test_email_failure_returns_unavailable(self):
        with patch.object(diagnostic, 'create_pdf', return_value=Path('/tmp/synthetic.pdf')), patch.object(diagnostic, 'send_email', side_effect=RuntimeError('synthetic failure')), patch.object(diagnostic.app.logger, 'exception'):
            response = self.client.post('/diagnostico', json={'email': 'test@example.com'})
        self.assertEqual(response.status_code, 503)
        self.assertFalse(response.json['ok'])

if __name__ == '__main__':
    unittest.main()
