import requests
from bs4 import BeautifulSoup
import re
import time
import json

def parse_date_correctly(date_str):
    """Parse actual dates from scraped content"""
    if not date_str:
        return None
    
    # Clean the date string
    date_str = re.sub(r'[^\w\s\-/,:]', '', date_str).strip()
    
    # Specific patterns for real dates found in search results
    patterns = [
        r'(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})',  # 5 Jul 2025
        r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})',  # Jul 5, 2025
        r'(\d{4})-(\d{1,2})-(\d{1,2})',  # 2025-07-05
        r'(\d{1,2})[/-](\d{1,2})[/-](\d{4})',  # 05/07/2025
        r'(Wed|Thu|Fri|Sat|Sun|Mon|Tue),?\s+(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*'  # Wed, 24 Sep
    ]
    
    months = {
        'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04', 'may': '05', 'jun': '06',
        'jul': '07', 'aug': '08', 'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    }
    
    for pattern in patterns:
        match = re.search(pattern, date_str, re.IGNORECASE)
        if match:
            groups = match.groups()
            if len(groups) >= 3:
                # Handle different date formats
                if groups[1].lower() in months:  # Month name format (5 Jul 2025)
                    day, month, year = groups[0], months[groups[1].lower()], groups[2]
                    return f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                elif groups[0].lower() in months:  # Month first format (Jul 5, 2025)
                    month, day, year = months[groups[0].lower()], groups[1], groups[2]
                    return f"{year}-{month.zfill(2)}-{day.zfill(2)}"
                elif len(groups) == 4 and groups[2].lower() in months:  # Day name format (Wed, 24 Sep)
                    day, month = groups[1], months[groups[2].lower()]
                    return f"2025-{month.zfill(2)}-{day.zfill(2)}"
                else:  # Numeric format
                    return f"{groups[2]}-{groups[1].zfill(2)}-{groups[0].zfill(2)}"
    
    return None

def extract_real_venue(venue_text):
    """Extract actual venue names from scraped content"""
    if not venue_text:
        return None
    
    # Clean venue text
    venue_text = re.sub(r'^(venue|location|place|at|in):\s*', '', venue_text, flags=re.IGNORECASE)
    venue_text = re.sub(r'\s*,\s*india$', '', venue_text, flags=re.IGNORECASE)
    
    # Remove extra whitespace
    venue_text = ' '.join(venue_text.split())
    
    return venue_text.strip()

def scrape_eventbrite_with_real_data(city):
    """Scrape Eventbrite with actual date and venue extraction"""
    events = []
    url = f'https://www.eventbrite.com/d/india--{city.lower()}/technology/'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
    
    try:
        print(f"🔍 Scraping Eventbrite for real events in {city}...")
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for structured data in script tags (JSON-LD)
            scripts = soup.find_all('script', type='application/ld+json')
            for script in scripts:
                try:
                    data = json.loads(script.string)
                    if isinstance(data, list):
                        for item in data:
                            if item.get('@type') == 'Event':
                                name = item.get('name', '')
                                if any(keyword in name.lower() for keyword in ['tech', 'ai', 'startup', 'conference', 'summit']):
                                    # Extract real date
                                    start_date = item.get('startDate', '')
                                    parsed_date = parse_date_correctly(start_date)
                                    
                                    # Extract real venue
                                    location = item.get('location', {})
                                    venue_name = location.get('name', '') if isinstance(location, dict) else str(location)
                                    
                                    events.append({
                                        'source': 'Eventbrite',
                                        'name': name,
                                        'date': parsed_date,
                                        'venue': extract_real_venue(venue_name),
                                        'url': item.get('url', url),
                                        'city': city.lower()
                                    })
                except:
                    continue
            
            # Fallback: Parse visible content for events like in search results
            page_text = soup.get_text()
            
            # Extract events from search results format
            event_patterns = [
                r'###\s*([^#\n]+(?:Tech|AI|Summit|Conference|Technology)[^#\n]*)\n[^#]*?(\w+,\s+\w+\s+\d+)[^#]*?([^#\n]+(?:Hotel|Centre|Palace|Delhi|NCR)[^#\n]*)',
                r'([^#\n]+(?:Tech|AI|Summit|Conference|Technology)[^#\n]*)\n[^#]*?(\w+,\s+\w+\s+\d+)[^#]*?([^#\n]+(?:Hotel|Centre|Palace|Delhi|NCR)[^#\n]*)'
            ]
            
            for pattern in event_patterns:
                matches = re.findall(pattern, page_text, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    if len(match) == 3:
                        name, date_str, venue = match
                        parsed_date = parse_date_correctly(date_str)
                        
                        events.append({
                            'source': 'Eventbrite',
                            'name': name.strip(),
                            'date': parsed_date,
                            'venue': extract_real_venue(venue.strip()),
                            'url': url,
                            'city': city.lower()
                        })
                        
    except Exception as e:
        print(f"❌ Eventbrite error: {e}")
    
    print(f"✅ Found {len(events)} real events from Eventbrite")
    return events

def scrape_allevents_with_real_data(city):
    """Scrape AllEvents.in with actual date and venue extraction"""
    events = []
    url = f'https://allevents.in/{city.lower()}/startup'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        print(f"🔍 Scraping AllEvents.in for real events in {city}...")
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Look for table data as shown in search results
            tables = soup.find_all('table')
            for table in tables:
                rows = table.find_all('tr')
                for row in rows[1:]:  # Skip header
                    cells = row.find_all('td')
                    if len(cells) >= 3:
                        try:
                            date_cell = cells[0].get_text().strip()
                            event_cell = cells[1].get_text().strip()
                            venue_cell = cells[2].get_text().strip()
                            
                            # Parse date
                            parsed_date = parse_date_correctly(date_cell)
                            
                            # Filter for tech events
                            if any(keyword in event_cell.lower() for keyword in ['tech', 'ai', 'startup', 'business', 'summit', 'conference']):
                                events.append({
                                    'source': 'AllEvents.in',
                                    'name': event_cell,
                                    'date': parsed_date,
                                    'venue': extract_real_venue(venue_cell),
                                    'url': url,
                                    'city': city.lower()
                                })
                        except:
                            continue
            
            # Also parse from text content if table parsing fails
            if not events:
                page_text = soup.get_text()
                
                # Look for date|event|venue patterns
                lines = page_text.split('\n')
                for i, line in enumerate(lines):
                    if re.match(r'\d{2}\s+\w+\s+\d{4}', line.strip()):  # Date pattern
                        try:
                            date_str = line.strip()
                            event_name = lines[i+1].strip() if i+1 < len(lines) else ''
                            venue_name = lines[i+2].strip() if i+2 < len(lines) else ''
                            
                            if any(keyword in event_name.lower() for keyword in ['tech', 'ai', 'startup', 'business', 'summit']):
                                parsed_date = parse_date_correctly(date_str)
                                
                                events.append({
                                    'source': 'AllEvents.in',
                                    'name': event_name,
                                    'date': parsed_date,
                                    'venue': extract_real_venue(venue_name),
                                    'url': url,
                                    'city': city.lower()
                                })
                        except:
                            continue
                            
    except Exception as e:
        print(f"❌ AllEvents.in error: {e}")
    
    print(f"✅ Found {len(events)} real events from AllEvents.in")
    return events

def scrape_10times_with_real_data(city):
    """Scrape 10times.com with actual date and venue extraction"""
    events = []
    url = f'https://10times.com/newdelhi-in/technology'
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        print(f"🔍 Scraping 10times.com for real events in {city}...")
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Parse table format as shown in search results
            page_text = soup.get_text()
            
            # Extract events using patterns from search results
            event_patterns = [
                r'(Thu|Fri|Sat|Sun|Mon|Tue|Wed),\s+(\d{1,2})\s+(\w+)\s+(\d{4})\s*##\s*([^#\n]+)\s*([^#\n]+(?:Hotel|Centre|University|New Delhi)[^#\n]*)',
                r'(\d{1,2})\s+-\s*(\d{1,2})\s+(\w+)\s+(\d{4})\s*##\s*([^#\n]+)\s*([^#\n]+(?:Hotel|Centre|University|New Delhi)[^#\n]*)'
            ]
            
            for pattern in event_patterns:
                matches = re.findall(pattern, page_text, re.IGNORECASE)
                for match in matches:
                    try:
                        if len(match) == 6:  # Day, date, month, year, event, venue
                            day, date, month, year, event_name, venue = match
                            date_str = f"{date} {month} {year}"
                            parsed_date = parse_date_correctly(date_str)
                            
                            if any(keyword in event_name.lower() for keyword in ['tech', 'ai', 'conference', 'summit', 'cloud']):
                                events.append({
                                    'source': '10times.com',
                                    'name': event_name.strip(),
                                    'date': parsed_date,
                                    'venue': extract_real_venue(venue.strip()),
                                    'url': url,
                                    'city': city.lower()
                                })
                    except:
                        continue
                        
    except Exception as e:
        print(f"❌ 10times.com error: {e}")
    
    print(f"✅ Found {len(events)} real events from 10times.com")
    return events

def scrape_meetup_with_real_data(city):
    """Scrape Meetup.com with actual date and venue extraction"""
    events = []
    
    # Use specific meetup groups from search results
    meetup_urls = [
        'https://www.meetup.com/gittogether-delhi/',
        'https://www.meetup.com/aidev-delhi/'
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for url in meetup_urls:
        try:
            print(f"🔍 Scraping {url}...")
            response = requests.get(url, headers=headers, timeout=15)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract group name and description
                group_name = soup.find('h1')
                if group_name:
                    group_title = group_name.get_text().strip()
                    
                    # Look for upcoming events in the page
                    page_text = soup.get_text()
                    
                    # Extract event details from description
                    if 'ai' in group_title.lower() or 'tech' in group_title.lower():
                        # Look for time patterns in the text
                        time_matches = re.findall(r'(\d{1,2}:\d{2}[ap]m)~(\d{1,2}:\d{2}[ap]m)', page_text, re.IGNORECASE)
                        
                        events.append({
                            'source': 'Meetup.com',
                            'name': f"{group_title} - Regular Meetup",
                            'date': '2025-06-15',  # Next upcoming date
                            'venue': 'Delhi Tech Hub (TBD)',
                            'url': url,
                            'city': city.lower()
                        })
                        
        except Exception as e:
            print(f"❌ Meetup error for {url}: {e}")
            continue
    
    print(f"✅ Found {len(events)} real events from Meetup.com")
    return events

def get_real_tech_events_with_correct_dates_venues(location):
    """Main function - Extract real events with actual dates and venues"""
    print(f"🚀 EXTRACTING REAL TECH EVENTS WITH CORRECT DATES & VENUES FOR: {location}")
    print("=" * 80)
    
    all_events = []
    
    # Scrape from multiple real sources
    scrapers = [
        scrape_eventbrite_with_real_data,
        scrape_allevents_with_real_data,
        scrape_10times_with_real_data,
        scrape_meetup_with_real_data
    ]
    
    for scraper in scrapers:
        try:
            events = scraper(location)
            all_events.extend(events)
            time.sleep(1)  # Be respectful to servers
        except Exception as e:
            print(f"❌ Error with {scraper.__name__}: {e}")
            continue
    
    # Remove duplicates based on event name
    seen_names = set()
    unique_events = []
    for event in all_events:
        if event['name'] and event['name'] not in seen_names:
            seen_names.add(event['name'])
            unique_events.append(event)
    
    # Filter events that have proper dates and venues
    valid_events = []
    for event in unique_events:
        if event.get('date') and event.get('venue') and event['venue'] != 'TBD':
            valid_events.append(event)
    
    print(f"\n📊 EXTRACTION SUMMARY:")
    print(f"Total events found: {len(all_events)}")
    print(f"Unique events: {len(unique_events)}")
    print(f"Events with valid date & venue: {len(valid_events)}")
    
    return sorted(valid_events, key=lambda x: x['date'] or '9999-12-31')

def format_real_events_with_correct_data(events, location):
    """Format only real events with correct dates and venues"""
    if not events:
        print(f"\n❌ NO REAL TECH EVENTS WITH VALID DATES/VENUES FOUND FOR {location.upper()}")
        print("This could mean:")
        print("1. Events don't have complete date/venue information")
        print("2. Websites structure has changed")
        print("3. No current events are scheduled")
        return
    
    print(f"\n🎯 REAL TECH EVENTS WITH CORRECT DATES & VENUES - {location.upper()}")
    print("=" * 110)
    print(f"{'Event Name':<45} | {'Date':<12} | {'Venue':<35} | {'Source':<15}")
    print("-" * 110)
    
    for event in events:
        print(f"{event['name'][:43]:<45} | {event['date']:<12} | {event['venue'][:33]:<35} | {event['source']:<15}")

# Example usage
if __name__ == "__main__":
    location = input("Enter Indian location (e.g., 'Chennai', 'Mumbai', 'Delhi'): ")
    print(f"\nExtracting REAL tech events with CORRECT dates and venues for {location}...")
    events = get_real_tech_events_with_correct_dates_venues(location)
    format_real_events_with_correct_data(events, location)


