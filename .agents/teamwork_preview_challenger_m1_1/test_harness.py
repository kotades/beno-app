import sqlite3
import os
import sys

# Add scripts directory to path to import scrape_yachts
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'scripts'))
import scrape_yachts

def test_price_index_bug():
    print("Running test_price_index_bug...")
    conn = scrape_yachts.setup_db()
    
    # Empty db first
    conn.execute('DELETE FROM yachts')
    conn.commit()

    cards_data = [
        {
            'href': '/yachts/test/123',
            'imgSrc': '',
            'fullText': ['1000', '2000', '/ hour']
        },
        {
            'href': '/yachts/test/456',
            'imgSrc': '',
            'fullText': ['/ hour', 'some text', '999', '888']
        }
    ]
    
    # Call process_data
    scrape_yachts.process_data(conn, cards_data, None)
    
    # Verify results
    c = conn.cursor()
    c.execute('SELECT id, price, original_price FROM yachts')
    results = c.fetchall()
    
    print("Results:", results)
    
    for row in results:
        if row[0] == '456' and row[1] == 999:
            print("Vulnerability confirmed: negative index accessed wrong values from the end of fullText list")
            
def test_guests_format_bug():
    print("Running test_guests_format_bug...")
    conn = scrape_yachts.setup_db()
    conn.execute('DELETE FROM yachts')
    conn.commit()

    cards_data = [
        {
            'href': '/yachts/test/789',
            'imgSrc': '',
            'fullText': ['Guests: 5', 'Guests 10']
        }
    ]
    scrape_yachts.process_data(conn, cards_data, None)
    c = conn.cursor()
    c.execute('SELECT id, guests FROM yachts WHERE id="789"')
    row = c.fetchone()
    print("Guests row:", row)
    if row and row[1] == 0:
        print("Vulnerability confirmed: string format like 'Guests: 5' fails to parse as int")

if __name__ == '__main__':
    test_price_index_bug()
    test_guests_format_bug()
