import requests
import os
from dotenv import load_dotenv

load_dotenv()

def get_nearby_places(location, place,place_type=None):
    params = {
        'location': location,
        'radius': 500,
        'keyword': place,
        'fields': 'formatted_phone_number,name,vicinity,opening_hours,rating,reviews,url,website',
        'key': os.getenv('GOOGLE_MAPS_TOKEN')
    }

    response = requests.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json", params=params)
    data = response.json()
    results = data.get('results', [])
    if place_type:
        # Filter results by type
        results = [r for r in results if place_type in r.get('types', [])]
    return results

# Example: Get only restaurants
#restaurants = get_nearby_places("13.0836939,80.270186", "restaurant", place_type="restaurant")
#for r in restaurants:
    #print(r['name'], "-", r.get('vicinity'))