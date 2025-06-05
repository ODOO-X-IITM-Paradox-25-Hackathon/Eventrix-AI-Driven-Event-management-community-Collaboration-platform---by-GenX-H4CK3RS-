import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, Car } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

interface EnhancedEventMapProps {
  eventLocation: string;
  eventName: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface DistanceInfo {
  distance: string;
  duration: string;
  durationValue: number;
}

const EnhancedEventMap: React.FC<EnhancedEventMapProps> = ({ eventLocation, eventName }) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [eventCoordinates, setEventCoordinates] = useState<Coordinates | null>(null);
  const [distanceInfo, setDistanceInfo] = useState<DistanceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBfd1bm_3mxeU8VhNwt2GE9-h0BtMT2Sv4&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    script.onerror = () => {
      setError("Failed to load Google Maps API");
      setIsLoading(false);
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPosition);
          geocodeEventLocation();
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description: "Using Chennai as default location. Please allow location access for accurate directions.",
            variant: "destructive"
          });
          // Use Chennai as default location
          const chennaiLocation = { lat: 13.0827, lng: 80.2707 };
          setUserLocation(chennaiLocation);
          geocodeEventLocation();
        }
      );
    } else {
      const chennaiLocation = { lat: 13.0827, lng: 80.2707 };
      setUserLocation(chennaiLocation);
      geocodeEventLocation();
    }
  };

  const geocodeEventLocation = () => {
    if (!window.google) {
      setError("Google Maps API not loaded properly");
      setIsLoading(false);
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: eventLocation }, (results, status) => {
      if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
        const eventPosition = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng()
        };
        setEventCoordinates(eventPosition);
      } else {
        console.error("Geocode was not successful:", status);
        // Use IIT Madras as fallback
        const iitMadras = { lat: 12.9916, lng: 80.2336 };
        setEventCoordinates(iitMadras);
      }
    });
  };

  const findNearbyPlaces = (coordinates: Coordinates) => {
    if (!window.google || !mapInstanceRef.current) return;

    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);
    const allPlaces: any[] = [];
    
    // Define place types to search for
    const placeTypes = ['restaurant', 'gas_station', 'hospital', 'atm'];
    let completedRequests = 0;

    placeTypes.forEach(placeType => {
      const request = {
        location: coordinates,
        radius: 1000,
        type: placeType
      };

      service.nearbySearch(request, (results, status) => {
        completedRequests++;
        
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          allPlaces.push(...results.slice(0, 2)); // Take 2 from each type
        }
        
        // Update state when all requests are complete
        if (completedRequests === placeTypes.length) {
          setNearbyPlaces(allPlaces.slice(0, 8)); // Limit to 8 total places
        }
      });
    });
  };

  useEffect(() => {
    if (userLocation && eventCoordinates && mapRef.current && window.google) {
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: eventCoordinates,
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });
        
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: '#4F46E5',
            strokeWeight: 5
          }
        });
        
        directionsRendererRef.current.setMap(mapInstanceRef.current);

        // Add custom marker for event location
        new window.google.maps.Marker({
          position: eventCoordinates,
          map: mapInstanceRef.current,
          title: eventName,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          }
        });

        // Find nearby places
        findNearbyPlaces(eventCoordinates);
      }

      // Get directions with multiple travel modes
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: eventCoordinates,
          travelMode: window.google.maps.TravelMode.DRIVING,
          avoidHighways: false,
          avoidTolls: false
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result);
            
            const route = result.routes[0];
            if (route && route.legs && route.legs[0]) {
              setDistanceInfo({
                distance: route.legs[0].distance?.text || '',
                duration: route.legs[0].duration?.text || '',
                durationValue: route.legs[0].duration?.value || 0
              });
            }
            
            setIsLoading(false);
          } else {
            console.error("Directions request failed:", status);
            setError("Could not calculate directions");
            setIsLoading(false);
          }
        }
      );
    }
  }, [userLocation, eventCoordinates, eventName]);

  const openGoogleMaps = () => {
    if (userLocation && eventCoordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(eventLocation)}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  const getTrafficSuggestion = () => {
    if (!distanceInfo) return "";
    
    const durationMinutes = distanceInfo.durationValue / 60;
    if (durationMinutes > 60) {
      return "🚨 Long journey ahead! Consider leaving early or using public transport.";
    } else if (durationMinutes > 30) {
      return "⚠️ Moderate travel time. Check traffic before leaving.";
    } else {
      return "✅ Quick journey! Perfect timing.";
    }
  };

  if (isLoading) {
    return (
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-eventrix" />
            <span>Loading Map & Directions...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventrix"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-eventrix" />
            <span>Event Location</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-2">{error}</p>
          <p className="dark:text-gray-300">Event is located at: {eventLocation}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-eventrix" />
          <span>Event Location & Directions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Travel Information */}
        {distanceInfo && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium dark:text-white">Distance</p>
                <p className="text-lg font-bold text-blue-600">{distanceInfo.distance}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium dark:text-white">Travel Time</p>
                <p className="text-lg font-bold text-green-600">{distanceInfo.duration}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Navigation className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium dark:text-white">Mode</p>
                <p className="text-lg font-bold text-purple-600">Driving</p>
              </div>
            </div>
          </div>
        )}

        {/* Traffic Suggestion */}
        {distanceInfo && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {getTrafficSuggestion()}
            </p>
          </div>
        )}
        
        {/* Map */}
        <div 
          ref={mapRef} 
          className="h-[400px] w-full rounded-md overflow-hidden shadow-md" 
        />

        {/* Nearby Places */}
        {nearbyPlaces.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2 dark:text-white">Nearby Places</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {nearbyPlaces.map((place, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <span className="dark:text-gray-300">{place.name}</span>
                  {place.rating && (
                    <span className="text-yellow-500">★ {place.rating.toFixed(1)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={openGoogleMaps} 
            className="flex items-center bg-eventrix hover:bg-eventrix-hover"
          >
            <Navigation className="mr-2 h-4 w-4" />
            Open in Google Maps
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              if (eventCoordinates) {
                const url = `https://www.google.com/maps/search/parking+near+${eventCoordinates.lat},${eventCoordinates.lng}`;
                window.open(url, "_blank");
              }
            }}
          >
            Find Parking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedEventMap;
