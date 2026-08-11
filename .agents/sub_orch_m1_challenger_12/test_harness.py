import os
import sys
import threading
import time
from playwright.sync_api import sync_playwright

# Add scripts directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../scripts'))
from scrape_yachts import process_yacht

def run_test():
    output_dir = os.path.join(os.path.dirname(__file__), 'test_output')
    os.makedirs(output_dir, exist_ok=True)
    
    print("Starting Playwright to test process_yacht...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        # Call process_yacht with our mock server
        # It should retry 3 times if something fails
        process_yacht(page, "http://localhost:5000/yachts/1", output_dir)
        
        browser.close()
        
    print("Test finished.")

if __name__ == '__main__':
    run_test()
