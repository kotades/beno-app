import sys
import os
sys.path.append('.')
from scripts.scrape_yachts import process_data, setup_db, download_image

# 1. Test SSRF bypass in download_image
print("Testing SSRF bypass...")
# The check is: hostname == 'beno.com' or hostname.endswith('.beno.com')
# This means 'evil-beno.com'.endswith('.beno.com') -> False
# But 'evil.beno.com' -> True
# What about 'beno.com.attacker.com'? False.
# Wait! 'cloudfront.net' or hostname.endswith('.cloudfront.net')
# Can we bypass it?
# What if URL is 'http://beno.com\@attacker.com'?
# urlparse('http://beno.com\@attacker.com').hostname -> 'attacker.com' (Python 3.9+)

print(download_image('http://attacker.com#beno.com', 'test1.jpg')) 

# 2. Let's check regex DOS or other errors.
print("Testing regex DOS...")
import re
text = "1000 AED / hour"
price_match = re.search(r'((?:AED\s*)?[\d,]+\s*(?:AED\s*)?[\d,]*)\s*/\s*hour', text, re.IGNORECASE)
print(price_match)
