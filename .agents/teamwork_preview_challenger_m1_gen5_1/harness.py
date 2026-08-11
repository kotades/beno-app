import sys
import os
import sqlite3

# Add the project root to sys.path so we can import from scripts
sys.path.insert(0, os.path.abspath('.'))

from scripts.scrape_yachts import process_data, setup_db, DB_PATH, ASSETS_DIR

def test_process_data():
    conn = setup_db()
    
    cards_data = [
        {
            'href': '/yachts/solana/93GG63',
            'imgSrc': 'https://example.com/img.jpg',
            'fullText': ['Solana Yacht', '5 Guests', '3 Cabins', '50 ft', '20% off', 'AED 2,500 / hour']
        }
    ]
    solana_data = {
        'title': 'Solana',
        'texts': ['minimum rental hours 4', 'A masterpiece of the sea', 'Route Details: Dubai Marina'],
        'images': ['https://example.com/gallery1.jpg'],
        'features': ['Wifi', 'Bluetooth']
    }
    
    try:
        process_data(conn, cards_data, solana_data)
        print("Test 1 passed")
    except Exception as e:
        print(f"Test 1 failed: {e}")

if __name__ == '__main__':
    test_process_data()
