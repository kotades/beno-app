import os
import urllib.request
import asyncio
from scripts.scrape_yachts import download_image

print("Testing download_image with file scheme")
try:
    filepath = download_image("file://" + os.path.abspath("test_target.txt"), "downloaded_file.txt")
    print(filepath)
    with open(filepath, "r") as f:
        print(f.read())
except Exception as e:
    print(e)
