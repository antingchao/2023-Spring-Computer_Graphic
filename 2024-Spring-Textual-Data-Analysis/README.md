# Bahamut Game Community Web Scraper

This script is a web scraper designed to extract data from the Bahamut Game Community Forum. It collects post titles, authors, article content, and comments from individual forum posts and saves them into a text file. It uses `requests` for static content scraping and `Selenium` for dynamic content scraping.

## Requirements

Before running the script, you need to install the necessary Python packages:

```bash
pip3 install webdriver_manager
pip3 install selenium
```

## Execution Instructions
Run the script: 
```bash
python3 scraper.py
```

## Output (output.txt)
```bash
title: [Post Title]
author: [Post Author]
---article---
[Article Content]
---comments---
Comment 1: [User1 Comment]
Comment 2: [User2 Comment]
...
```

## Notes
You can adjust the `max_scrolls` variable to control how many times the script scrolls the homepage to load more posts.