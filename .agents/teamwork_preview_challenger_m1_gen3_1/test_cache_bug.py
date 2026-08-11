import sqlite3
import os

def test_cache_bug():
    DB_PATH = 'db/cloned_beno_db.sqlite'
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    
    # We simulate download_image behavior
    ASSETS_DIR = 'public/assets/'
    os.makedirs(ASSETS_DIR, exist_ok=True)
    
    with open(os.path.join(ASSETS_DIR, '93GG63_gallery_0.jpg'), 'w') as f:
        f.write('OLD_IMAGE_DATA')
        
    # Simulate process_data
    unique_images = ['https://www.beno.com/new_image.jpg']
    for i, url in enumerate(unique_images):
        filename = f"93GG63_gallery_{i}.jpg"
        filepath = os.path.join(ASSETS_DIR, filename)
        
        # simulated download_image
        if os.path.exists(filepath):
            print(f"File {filepath} already exists! Skipping download for {url}.")
            # The bug: it skips downloading the new image and keeps OLD_IMAGE_DATA

if __name__ == '__main__':
    test_cache_bug()
