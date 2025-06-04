import streamlit as st
from streamlit_js_eval import get_geolocation
import requests
import math

GEOCODING_API_KEY = 'AIzaSyBlJfGgpP2kN06cTUkpcY1VZLsflD2_ux0'
PLACES_API_KEY = 'AIzaSyBfd1bm_3mxeU8VhNwt2GE9-h0BtMT2Sv4'

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def get_place_details(place_id, api_key):
    details_url = (
        f"https://maps.googleapis.com/maps/api/place/details/json?"
        f"place_id={place_id}&fields=name,formatted_phone_number,website,url,rating,review,formatted_address&key={api_key}"
    )
    response = requests.get(details_url)
    data = response.json()
    if data.get('status') == 'OK':
        result = data['result']
        return {
            'phone_number': result.get('formatted_phone_number', 'N/A'),
            'website': result.get('website', 'N/A'),
            'google_url': result.get('url', 'N/A'),
            'rating': result.get('rating', 'N/A'),
            'reviews': result.get('reviews', []),
            'full_address': result.get('formatted_address', 'N/A')
        }
    return {
        'phone_number': 'N/A',
        'website': 'N/A',
        'google_url': 'N/A',
        'rating': 'N/A',
        'reviews': [],
        'full_address': 'N/A'
    }

def find_places(latitude, longitude, api_key):
    radius = 5000
    place_types = {
        'hospital': {'type': 'hospital'},
        'police_station': {'type': 'police'},
        'blood_bank': {'keyword': 'blood bank'},
        'restaurant': {'type': 'restaurant'},
        'fire_station': {'type': 'fire_station'}
    }
    results = {}
    for place_type, params in place_types.items():
        url = (
            f"https://maps.googleapis.com/maps/api/place/nearbysearch/json?"
            f"location={latitude},{longitude}&radius={radius}&key={api_key}"
        )
        if 'type' in params:
            url += f"&type={params['type']}"
        if 'keyword' in params:
            url += f"&keyword={params['keyword']}"
        response = requests.get(url)
        data = response.json()
        places_list = []
        for place in data.get('results', [])[:5]:
            name = place.get('name', 'N/A')
            address = place.get('vicinity', 'N/A')
            location = place['geometry']['location']
            place_id = place.get('place_id')
            details = get_place_details(place_id, api_key) if place_id else {}
            dist_km = haversine(latitude, longitude, location['lat'], location['lng'])
            dist_km = round(dist_km, 2)
            places_list.append({
                'name': name,
                'address': address,
                'location': location,
                'phone_number': details.get('phone_number', 'N/A'),
                'website': details.get('website', 'N/A'),
                'google_url': details.get('google_url', 'N/A'),
                'rating': details.get('rating', 'N/A'),
                'reviews': details.get('reviews', []),
                'full_address': details.get('full_address', 'N/A'),
                'distance_km': dist_km
            })
        results[place_type] = places_list
    return results

def print_attractive_results(results):
    for place_type, places in results.items():
        st.subheader(f"Nearby {place_type.replace('_', ' ').title()}s:")
        if not places:
            st.write("No results found.")
        else:
            for i, place in enumerate(places, 1):
                st.markdown(f"**{i}. {place['name']}**")
                st.write(f"Address: {place['address']}")
                st.write(f"Full Address: {place['full_address']}")
                st.write(f"Coordinates: ({place['location']['lat']}, {place['location']['lng']})")
                st.write(f"Distance: {place['distance_km']} km")
                st.write(f"Rating: {place['rating']}")
                st.write(f"Phone: {place['phone_number']}")
                st.write(f"Website: {place['website']}")
                st.write(f"[Google Places URL]({place['google_url']})")
                if place['reviews']:
                    st.write("Reviews:")
                    for review in place['reviews'][:2]:
                        author = review.get('author_name', 'Anonymous')
                        rating = review.get('rating', 'N/A')
                        text = review.get('text', '')
                        time_desc = review.get('relative_time_description', '')
                        st.write(f"- {author} ({time_desc}) - Rating: {rating}")
                        st.write(f"  \"{text}\"")
                else:
                    st.write("Reviews: None")
                st.markdown("---")

# --- Streamlit App ---
st.title("Find Nearby Emergency Places Using Your Location")

st.write("Click the button below to allow the app to access your current location.")

loc = get_geolocation()

if loc and loc.get("coords"):
    latitude = loc["coords"]["latitude"]
    longitude = loc["coords"]["longitude"]
    st.success(f"Your coordinates: ({latitude}, {longitude})")
    with st.spinner('Searching for nearby places...'):
        results = find_places(latitude, longitude, PLACES_API_KEY)
        print_attractive_results(results)
elif loc and loc.get("error"):
    st.error(f"Location error: {loc['error']}")
else:
    st.info("Please click the button above and allow location access to find nearby places.")

st.markdown("""
---
**Note:**  
- Your location is only used to search for nearby places and is not stored.
- If you see a location permission prompt, please allow it for best results.
""")
