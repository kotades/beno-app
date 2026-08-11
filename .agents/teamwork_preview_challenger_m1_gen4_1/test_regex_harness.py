import sqlite3
import re
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))
from scripts.scrape_yachts import process_data

def test_process_data_regex_bug():
    # Setup in-memory DB matching the schema
    conn = sqlite3.connect(':memory:')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE yachts (
            id TEXT PRIMARY KEY,
            name TEXT, href TEXT, hero_image TEXT, guests INTEGER, cabins INTEGER, 
            length INTEGER, price INTEGER, original_price INTEGER, discount TEXT, 
            description TEXT, route_details TEXT, minimum_hours INTEGER
        )
    ''')
    
    # Mock cards_data that should trigger the regex extractions
    cards_data = [{
        'href': '/yachts/test1',
        'imgSrc': 'test.jpg',
        'fullText': ['12 Guests', '4 Cabins', '50 ft Length', '15% off', 'AED 5,000 / hour']
    }]
    
    # Run process_data
    process_data(conn, cards_data, solana_data=None)
    
    # Fetch result
    c.execute("SELECT guests, cabins, length FROM yachts WHERE id='test1'")
    row = c.fetchone()
    
    print("--- Test Results ---")
    print(f"Guests Extracted: {row[0]} (Expected: 12)")
    print(f"Cabins Extracted: {row[1]} (Expected: 4)")
    print(f"Length Extracted: {row[2]} (Expected: 50)")
    
    if row[0] == 0 and row[1] == 0:
        print("BUG FOUND: 'guests' and 'cabins' were parsed as 0 because of literal '\\\\d+' in regex.")
    else:
        print("REGEX is working fine.")

if __name__ == '__main__':
    test_process_data_regex_bug()
