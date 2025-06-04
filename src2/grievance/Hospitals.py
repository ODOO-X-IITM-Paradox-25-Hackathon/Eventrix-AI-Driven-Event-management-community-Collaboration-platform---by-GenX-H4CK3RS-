
import requests 
import os
from dotenv import load_dotenv  
load_dotenv()
def get_nearby_place_details(place_id, place_type=None):
    params = {
        'place_id': place_id,
        'fields': 'name,vicinity,types',  # Only fetch necessary fields
        'key': os.getenv('GOOGLE_MAPS_TOKEN')
    }

    response = requests.get(
        "https://maps.googleapis.com/maps/api/place/details/json", 
        params=params
    )
    data = response.json()

    if data.get('status') != 'OK':
        print(f"API error: {data.get('status')}")
        return None
    
    result = data.get('result', {})
    types = [t.lower() for t in result.get('types', [])]

    if place_type:
        place_type = place_type.lower()
        if place_type not in types:
            print(f"Not a hospital. Types found: {types}")
            return None

    return result.get('name', 'Name not available')  # Return hospital name

print(get_nearby_place_details("ChIJp1VDdT_ZzDsRku_HgBQLMDk", place_type="hospital"))
