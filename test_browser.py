from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

try:
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    driver = webdriver.Chrome(options=chrome_options)
    driver.get('http://localhost:8000')
    time.sleep(2)
    logs = driver.get_log('browser')
    for log in logs:
        print('LOG:', log)
    driver.execute_script('window.appContext.setMode("ops")')
    time.sleep(2)
    logs = driver.get_log('browser')
    for log in logs:
        print('LOG:', log)
    driver.quit()
except Exception as e:
    print('Error:', e)
