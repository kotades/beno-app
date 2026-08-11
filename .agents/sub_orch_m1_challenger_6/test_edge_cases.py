import sys
sys.path.append('.')
from scripts.scrape_yachts import get_ext, create_placeholder, get_slug
import os
import requests
from unittest.mock import Mock

def test_get_ext():
    # Test case 1: Missing content-type and missing extension
    mock_resp = Mock()
    mock_resp.headers = {}
    ext = get_ext("https://example.com/api/image", mock_resp)
    print(f"Missing headers, no ext in URL -> {ext}")
    
    # Test case 2: content type is video/mp4 but URL has no extension
    mock_resp = Mock()
    mock_resp.headers = {'content-type': 'video/mp4'}
    ext = get_ext("https://example.com/api/video", mock_resp)
    print(f"Video content type -> {ext}")

def test_create_placeholder():
    # Simulate a network failure for create_placeholder
    print("Testing create_placeholder with non-existent URL by mocking requests...")
    import requests
    original_get = requests.get
    
    def mock_get(*args, **kwargs):
        raise requests.exceptions.ConnectionError("Mocked ConnectionError")
        
    requests.get = mock_get
    
    try:
        if os.path.exists('test_placeholder.jpg'):
            os.remove('test_placeholder.jpg')
        create_placeholder('test_placeholder', is_video=False)
        if not os.path.exists('test_placeholder.jpg'):
            print("Bug confirmed: create_placeholder does not create any file when network fails.")
    finally:
        requests.get = original_get

if __name__ == "__main__":
    test_get_ext()
    test_create_placeholder()
