from geopy.geocoders import Nominatim
from geopy.distance import geodesic

# Use a unique user agent with your app name and contact email
GeoLocator = Nominatim(user_agent="odoo_paradox_app (rexjosondeva@gmail.com)")

coordinates = input("Enter Coordinates (Latitude,Longitude): ")
try:
    LocationInfo = GeoLocator.reverse(coordinates)
    print(LocationInfo.address)
except Exception as e:
    print("Error in reverse geocoding:", e)

address = input("Enter the Address: ")
try:
    loc = GeoLocator.geocode(address)
    print(loc.latitude, loc.longitude)
except Exception as e:
    print("Error in geocoding:", e)

def Calculate_Distance(loc1, loc2):
    try:
        location_info1 = GeoLocator.geocode(loc1)
        cor1 = (float(location_info1.latitude), float(location_info1.longitude))

        location_info2 = GeoLocator.geocode(loc2)
        cor2 = (float(location_info2.latitude), float(location_info2.longitude))
        print("Distance (km):", geodesic(cor1, cor2).kilometers)
    except Exception as e:
        print("Error in calculating distance:", e)

loc1 = input("Enter the first address: ")
loc2 = input("Enter the second address: ")
Calculate_Distance(loc1, loc2)