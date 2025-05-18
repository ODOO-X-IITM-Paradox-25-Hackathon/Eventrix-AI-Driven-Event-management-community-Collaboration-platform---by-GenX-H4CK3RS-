import scrapy
from scrapy.crawler import CrawlerProcess
from bs4 import BeautifulSoup
import csv
import re
import time
import random
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LinkedInInfluencerSpider(scrapy.Spider):
    name = "linkedin_influencer_spider"
    
    # Locations and event classes as per user request
    locations = ["Chennai", "Bangalore", "Pune"]
    event_classes = [
        "Tech Professionals",
        "Entrepreneurs",
        "Product Managers and UX Designers",
        "C-Suite Executives",
        "Students and Aspiring Techies",
        "Investors and Venture Capitalists",
        "Tech Enthusiasts and Hobbyists",
        "Academics and Researchers",
        "Tech Media and Bloggers",
        "Industry-Specific Professionals",
        "Open Source Contributors",
        "Gamers and Game Developers"
    ]
    
    # Minimum followers filter
    min_followers = 200
    
    # Store results
    results = []
    
    def __init__(self, username=None, password=None, *args, **kwargs):
        super(LinkedInInfluencerSpider, self).__init__(*args, **kwargs)
        self.username = username
        self.password = password
        
        # Setup Chrome options
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        # Initialize the driver
        self.driver = webdriver.Chrome(options=chrome_options)
        
    def start_requests(self):
        # First, log in to LinkedIn
        yield scrapy.Request(
            url="https://www.linkedin.com/login",
            callback=self.login,
            meta={"dont_redirect": True, "handle_httpstatus_list": [302]}
        )
    
    def login(self, response):
        # Login to LinkedIn
        self.driver.get("https://www.linkedin.com/login")
        
        # Wait for the page to load
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "username"))
        )
        
        # Enter username and password
        self.driver.find_element(By.ID, "username").send_keys(self.username)
        self.driver.find_element(By.ID, "password").send_keys(self.password)
        self.driver.find_element(By.XPATH, "//button[@type='submit']").click()
        
        # Wait for login to complete
        time.sleep(5)
        
        # Start searching for profiles
        for location in self.locations:
            for event_class in self.event_classes:
                search_url = f"https://www.linkedin.com/search/results/people/?keywords={event_class}&origin=GLOBAL_SEARCH_HEADER&geoUrn=%5B%22{location}%22%5D"
                yield scrapy.Request(
                    url=search_url,
                    callback=self.parse_search_results,
                    meta={"location": location, "event_class": event_class}
                )
    
    def parse_search_results(self, response):
        # Load the search page in Selenium
        self.driver.get(response.url)
        
        # Wait for the search results to load
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".reusable-search__result-container"))
        )
        
        # Scroll to load more results
        self.scroll_page()
        
        # Get the page source after scrolling
        page_source = self.driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')
        
        # Find all profile containers
        profiles = soup.find_all('li', class_='reusable-search__result-container')
        
        count = 0
        location = response.meta['location']
        event_class = response.meta['event_class']
        
        for profile in profiles:
            if count >= 5:
                break
                
            # Extract profile link
            profile_link_elem = profile.find('a', class_='app-aware-link')
            if not profile_link_elem:
                continue
                
            profile_url = profile_link_elem.get('href')
            if not profile_url or "/in/" not in profile_url:
                continue
            
            # Visit the profile to extract details
            self.driver.get(profile_url)
            time.sleep(random.uniform(2, 4))  # Random delay to avoid detection
            
            # Parse the profile page
            profile_soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Extract name
            name_elem = profile_soup.find('h1', class_='text-heading-xlarge')
            name = name_elem.get_text(strip=True) if name_elem else "N/A"
            
            # Extract followers
            followers_elem = profile_soup.find('span', string=lambda text: text and 'followers' in text.lower())
            followers_text = followers_elem.get_text(strip=True) if followers_elem else "0 followers"
            followers_count = int(re.sub(r'[^0-9]', '', followers_text)) if followers_text else 0
            
            # Extract location
            location_elem = profile_soup.find('span', class_='text-body-small inline t-black--light break-words')
            location_text = location_elem.get_text(strip=True) if location_elem else "N/A"
            
            # Extract bio
            bio_elem = profile_soup.find('div', class_='text-body-medium break-words')
            bio_text = bio_elem.get_text(strip=True) if bio_elem else "N/A"
            
            # Filter by minimum followers
            if followers_count >= self.min_followers:
                profile_data = {
                    'name': name,
                    'followers': followers_count,
                    'location': location_text,
                    'bio': bio_text,
                    'event_class': event_class,
                    'search_location': location,
                    'profile_url': profile_url
                }
                
                self.results.append(profile_data)
                count += 1
                
                # Log the extracted profile
                self.logger.info(f"Extracted profile: {name} ({followers_count} followers)")
    
    def scroll_page(self):
        # Scroll down to load more content
        for _ in range(3):
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(1)
    
    def closed(self, reason):
        # Export results to CSV when spider is closed
        self.export_to_csv()
        
        # Close the driver
        self.driver.quit()
    
    def export_to_csv(self):
        # Export results to CSV
        with open('linkedin_influencers.csv', 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['name', 'followers', 'location', 'bio', 'event_class', 'search_location', 'profile_url']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            for profile in self.results:
                writer.writerow(profile)
        
        self.logger.info(f"Exported {len(self.results)} profiles to linkedin_influencers.csv")

# To run the spider
if __name__ == "__main__":
    # Replace with your LinkedIn credentials
    username = "your_email@example.com"
    password = "your_password"
    
    process = CrawlerProcess({
        'USER_AGENT': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'ROBOTSTXT_OBEY': False,
        'DOWNLOAD_DELAY': 3,
        'RANDOMIZE_DOWNLOAD_DELAY': True,
        'LOG_LEVEL': 'INFO'
    })
    
    process.crawl(LinkedInInfluencerSpider, username=username, password=password)
    process.start()
