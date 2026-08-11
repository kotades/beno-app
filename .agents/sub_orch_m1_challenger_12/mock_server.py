from flask import Flask, send_file, request, jsonify
import os
import threading
import time

app = Flask(__name__)

# Track the number of requests to the yacht page
yacht_page_attempts = 0

@app.route('/yachts')
def yachts():
    # Return a page with a link to a yacht
    return '<html><body><a href="/yachts/1">Yacht 1</a></body></html>'

@app.route('/yachts/1')
def yacht_1():
    global yacht_page_attempts
    yacht_page_attempts += 1
    
    if yacht_page_attempts == 1:
        # Attempt 1: Return image A (will succeed) and image B (will fail)
        return '''
        <html><body>
            <img src="/img/A.jpg" />
            <img src="/img/B.jpg" />
        </body></html>
        '''
    elif yacht_page_attempts == 2:
        # Attempt 2: Return only image A (image B is missing)
        return '''
        <html><body>
            <img src="/img/A.jpg" />
        </body></html>
        '''
    else:
        return '<html><body></body></html>'

@app.route('/img/A.jpg')
def img_a():
    # Return a dummy image
    return b'imageA_content', 200, {'Content-Type': 'image/jpeg'}

@app.route('/img/B.jpg')
def img_b():
    # Fail on first attempt
    return 'Not Found', 404

if __name__ == '__main__':
    app.run(port=5000)
