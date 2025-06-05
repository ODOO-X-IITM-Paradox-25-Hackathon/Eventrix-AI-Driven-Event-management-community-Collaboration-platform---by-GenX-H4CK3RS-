
import React, { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, Car, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllStoredEvents } from "../lib/eventStorage";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface EventMarker {
  id: string;
  name: string;
  location: string;
  coordinates: Coordinates;
  date: string;
  category: string;
}

const IITMEventsMap: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [eventMarkers, setEventMarkers] = useState<EventMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  
  const { toast } = useToast();

  // IIT Madras coordinates
  const IITM_LOCATION = { lat: 12.9916, lng: 80.2336 };
  const SEARCH_RADIUS = 5000; // 5km in meters

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
    // Get user's current location, default to IIT Madras
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPosition);
          createMap();
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUserLocation(IITM_LOCATION);
          createMap();
          toast({
            title: "Location Access",
            description: "Using IIT Madras as default location. Enable location access for better experience.",
            variant: "destructive"
          });
        }
      );
    } else {
      setUserLocation(IITM_LOCATION);
      createMap();
    }
  };

  const createMap = () => {
    if (!mapRef.current || !window.google) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: IITM_LOCATION,
      zoom: 14,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      styles: [
        {
          featureType: "poi.school",
          stylers: [{ visibility: "on" }, { color: "#ff6b6b" }]
        }
      ]
    });

    // Add circle showing 5km radius around IIT Madras
    new window.google.maps.Circle({
      strokeColor: '#4F46E5',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#4F46E5',
      fillOpacity: 0.1,
      map: mapInstanceRef.current,
      center: IITM_LOCATION,
      radius: SEARCH_RADIUS,
    });

    // Add IIT Madras marker
    new window.google.maps.Marker({
      position: IITM_LOCATION,
      map: mapInstanceRef.current,
      title: "IIT Madras",
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40)
      }
    });

    loadNearbyEvents();
  };

  const loadNearbyEvents = () => {
    const allEvents = getAllStoredEvents();
    const geocoder = new window.google.maps.Geocoder();
    
    // Filter events and geocode their locations
    const eventPromises = allEvents
      .filter(event => {
        // Filter events that are likely within 5km of IIT Madras
        const location = event.location.toLowerCase();
        return location.includes('chennai') || 
               location.includes('adyar') || 
               location.includes('iit') ||
               location.includes('velachery') ||
               location.includes('guindy');
      })
      .slice(0, 10) // Limit to 10 events for performance
      .map(event => {
        return new Promise<EventMarker | null>((resolve) => {
          geocoder.geocode({ address: event.location }, (results, status) => {
            if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
              const coords = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
              };
              
              // Check if within 5km radius using distance calculation
              const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                new window.google.maps.LatLng(IITM_LOCATION.lat, IITM_LOCATION.lng),
                new window.google.maps.LatLng(coords.lat, coords.lng)
              );
              
              if (distance <= SEARCH_RADIUS) {
                resolve({
                  id: event.id,
                  name: event.name,
                  location: event.location,
                  coordinates: coords,
                  date: event.startTime,
                  category: event.category
                });
              } else {
                resolve(null);
              }
            } else {
              resolve(null);
            }
          });
        });
      });

    Promise.all(eventPromises).then(results => {
      const validEvents = results.filter(Boolean) as EventMarker[];
      setEventMarkers(validEvents);
      addEventMarkersToMap(validEvents);
      setIsLoading(false);
    });
  };

  const addEventMarkersToMap = (events: EventMarker[]) => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    events.forEach(event => {
      const marker = new window.google.maps.Marker({
        position: event.coordinates,
        map: mapInstanceRef.current,
        title: event.name,
        icon: {
          url: getCategoryIcon(event.category),
          scaledSize: new window.google.maps.Size(32, 32)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${event.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Location:</strong> ${event.location}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px;"><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p style="margin: 0 0 8px 0; font-size: 12px;"><strong>Category:</strong> ${event.category}</p>
            <a href="/events/${event.id}" style="color: #4F46E5; text-decoration: none; font-size: 12px;">View Details →</a>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      technology: 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png',
      music: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
      cultural: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
      sports: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      education: 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png',
      business: 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png'
    };
    return icons[category as keyof typeof icons] || 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
  };

  if (isLoading) {
    return (
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-eventrix" />
            <span>Loading Events Near IIT Madras...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center rounded-md">
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
            <span>Events Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-2">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-eventrix" />
          <span>Events Near IIT Madras (5km radius)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Event Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium dark:text-white">Events Found</p>
              <p className="text-lg font-bold text-blue-600">{eventMarkers.length}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium dark:text-white">Search Radius</p>
              <p className="text-lg font-bold text-green-600">5 km</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium dark:text-white">Center</p>
              <p className="text-lg font-bold text-purple-600">IIT Madras</p>
            </div>
          </div>
        </div>
        
        {/* Map */}
        <div 
          ref={mapRef} 
          className="h-[500px] w-full rounded-md overflow-hidden shadow-md" 
        />

        {/* Legend */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-medium mb-2 dark:text-white">Map Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { category: 'technology', color: 'purple', label: 'Tech Events' },
              { category: 'music', color: 'green', label: 'Music Events' },
              { category: 'cultural', color: 'orange', label: 'Cultural Events' },
              { category: 'sports', color: 'yellow', label: 'Sports Events' },
              { category: 'education', color: 'lightblue', label: 'Education' },
              { category: 'business', color: 'pink', label: 'Business' }
            ].map((item) => (
              <div key={item.category} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                <span className="text-sm dark:text-gray-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IITMEventsMap;
