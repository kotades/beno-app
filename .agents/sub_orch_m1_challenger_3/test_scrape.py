import sys
import os
sys.path.append("/home/sanniinuoluwadunsimi/Documents/Sanni Workspace/beno app")
from scripts.scrape_yachts import get_ext, download_file, create_placeholder

class MockResponse:
    def __init__(self, headers):
        self.headers = headers

print("Test get_ext with content-type")
print(get_ext("http://example.com/image", MockResponse({'content-type': 'image/jpeg'})))
print(get_ext("http://example.com/image", MockResponse({'content-type': 'video/mp4'})))
print("Test get_ext without content-type, but with ext")
print(get_ext("http://example.com/image.png", MockResponse({})))
print("Test get_ext without both")
print(get_ext("http://example.com/image", MockResponse({})))

print("Test failed download")
ok, path = download_file("http://invalid.invalid", "/tmp/test")
print("Failed download OK:", ok)
