import urllib.request
import urllib.error
import time

def check_url(url, retries=5):
    for i in range(retries):
        try:
            response = urllib.request.urlopen(url)
            if response.status == 200:
                print(f"SUCCESS: {url} is up and running.")
                return True
            else:
                print(f"FAILED: {url} returned status {response.status}")
        except urllib.error.URLError as e:
            print(f"Attempt {i+1} failed: {url} is not reachable yet ({e.reason}). Retrying in 2 seconds...")
            time.sleep(2)
    print(f"ERROR: {url} could not be reached after {retries} attempts.")
    return False

if __name__ == "__main__":
    print("Auto-checking local host endpoints...")
    # Check if the frontend serves correctly
    frontend_ok = check_url("http://localhost:8000")
    # Check if backend API works
    api_ok = check_url("http://localhost:8000/api/match/metlife")
    
    if frontend_ok and api_ok:
        print("ALL CHECKS PASSED. The server is working perfectly.")
    else:
        print("SOME CHECKS FAILED.")
