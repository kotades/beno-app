import unittest
from unittest.mock import patch, MagicMock
import os
import requests
import sys

# Add the parent directory to sys.path so we can import scripts
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from scripts import scrape_yachts

class TestScrapeYachts(unittest.TestCase):
    @patch('scripts.scrape_yachts.requests.get')
    def test_partial_download_cleanup(self, mock_get):
        mock_response = MagicMock()
        mock_response.headers = {'content-type': 'image/jpeg'}
        
        def iter_content_mock(chunk_size=8192):
            yield b'some data'
            raise requests.exceptions.ChunkedEncodingError("Connection broken")
        
        mock_response.iter_content = iter_content_mock
        mock_get.return_value = mock_response
        
        base_path = 'test_partial_file'
        success, filepath = scrape_yachts.download_file('http://example.com/img.jpg', base_path)
        
        self.assertFalse(success)
        expected_filepath = base_path + '.jpg'
        self.assertFalse(os.path.exists(expected_filepath), "Partial file was not deleted!")
        if os.path.exists(expected_filepath):
            os.remove(expected_filepath)

if __name__ == '__main__':
    unittest.main()
