import sys
import os
import shutil

# Add scripts to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from scripts import scrape_yachts

class MockPage:
    def __init__(self):
        self.url_call_count = 0
        self.handlers = {}
        self.request = MagicMock()
        
    def on(self, event, handler):
        self.handlers[event] = handler
        
    def remove_listener(self, event, handler):
        if event in self.handlers:
            del self.handlers[event]
            
    def goto(self, url, timeout):
        self.url_call_count += 1
        pass
        
    def wait_for_load_state(self, state):
        pass
        
    def evaluate(self, script):
        if "window.scrollTo" in script:
            return
        
        # Simulate different DOM states based on attempt
        if self.url_call_count == 1:
            return {'imgs': ['http://test.com/img1.jpg', 'http://test.com/img2.jpg'], 'vids': []}
        else:
            return {'imgs': ['http://test.com/img1.jpg'], 'vids': []}
            
    def wait_for_timeout(self, timeout):
        pass

class MagicMock:
    pass

def test_retry_bug():
    page = MockPage()
    
    # We also need to mock download_file to fail img2.jpg on attempt 1
    original_download = scrape_yachts.download_file
    
    download_calls = []
    
    def fake_download_file(url, base_path, default_ext):
        download_calls.append(url)
        if url == 'http://test.com/img2.jpg':
            return False, None
        return True, "fake_path"
        
    scrape_yachts.download_file = fake_download_file
    
    out_dir = "/tmp/test_yachts_out"
    os.makedirs(out_dir, exist_ok=True)
    
    scrape_yachts.process_yacht(page, "http://test.com/yacht1", out_dir)
    
    print("Download calls:", download_calls)
    
    scrape_yachts.download_file = original_download

if __name__ == "__main__":
    test_retry_bug()
