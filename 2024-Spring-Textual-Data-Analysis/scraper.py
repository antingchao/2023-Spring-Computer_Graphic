# Bahamut Game Community Web Scraper

# Reference: https://gist.github.com/it-jia/2631658ae0676e11ba5928e607ff1433

import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time

# Connect to an individual post page and scrape the post data
def getData(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36',
    } 
    r = requests.get(url, headers=headers) 
    if r.status_code == 200: 
        soup = BeautifulSoup(r.text, 'html.parser') 
        title = soup.find('h1', class_='c-post__header__title') 
        if title: 
            title = title.get_text(strip=True) 
            file.write('title: '+title+ "\n") 
        else:
            print("didn't find title") 
        author = soup.find('a', class_='username') 
        if author:
            author = author.get_text(strip=True) 
            file.write('author: '+author+ "\n") 
        else:
            print("didn't find author") 

        # Extract the article content, the webpage structure is as follows:
        # <article class="c-article FM-P2" id="___">
        # <div class="c-article__content">
        # <div>content</div>...
        # </div></article>
        article = soup.find('article', class_='c-article FM-P2') 
        if article: 
            content_div = article.find('div', class_='c-article__content') 
            if content_div: 
                file.write("---article---"+ "\n")
                for div in content_div.find_all('div', recursive=False): 
                    file.write(div.get_text(strip=True)+ "\n") 

        file.write("---comments---"+ "\n")
        comments = soup.find_all('a', class_='reply-content__user') 
        for i in range(len(comments)): 
            file.write("Comment "+str(i+1)+": " + comments[i].get_text(strip=True)+ "\n") 
    else:
        
        print(f'Request failed: {r.status_code}')    
        print(url) 

file=open("output.txt",mode="w",encoding="utf-8") 

# Part 1: Scrape the URLs of each post page from the homepage
oriURL = 'https://forum.gamer.com.tw/' 

# Use Selenium (because the content on Bahamut's website is dynamically loaded via JavaScript)
# Initialize Chrome browser
options = webdriver.ChromeOptions()
options.add_argument('--headless') 
driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=options) 
driver.get(oriURL) 

scroll_pause_time = 1  # Time to wait after each scroll
max_scrolls = 1  # # Maximum number of scrolls (the Bahamut homepage needs to scroll down to load more pages)
scrolls = 0 # Record the number of scrolls

last_height = driver.execute_script("return document.body.scrollHeight") 
while scrolls < max_scrolls:
    driver.execute_script("window.scrollTo(0, document.body.scrollHeight);") 
    time.sleep(scroll_pause_time) 
    new_height = driver.execute_script("return document.body.scrollHeight") 
    if new_height == last_height: 
        break
    last_height = new_height 
    scrolls += 1 
html = driver.page_source 
driver.quit() 

# Process the homepage HTML, saving the post links as a list (pages_url)
soupMulti = BeautifulSoup(html, 'html.parser') 
pages_tag = soupMulti.find_all('a', {'data-gtm-link-click':'點擊文章'}) 
pages_url = [] 
for one_page_tag in pages_tag:  
    href_value = one_page_tag.get('href') 
    pages_url.append(href_value) 
print("Number of pages scraped: ", len(pages_url)) 

# Part 2: Scrape each post page's URL from the homepage
rootURL = "https://forum.gamer.com.tw/"
for page_count in range(len(pages_url)): 
    file.write("page" + str(page_count+1) + "\n") 
    getData(rootURL+pages_url[page_count]) 
    file.write("\n")
    time.sleep(scroll_pause_time) 

file.close() 