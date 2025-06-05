
import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Add Google Maps type declarations
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

interface EventMapProps {
  eventLocation: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const EventMap: React.FC<EventMapProps> = ({ eventLocation }) => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [eventCoordinates, setEventCoordinates] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);
  
  const { toast } = useToast();

  // Initialize the Google Maps API
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
      // Cleanup
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPosition);
          
          // After getting user's location, geocode the event location
          geocodeEventLocation();
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description: "Unable to access your current location. Please allow location access to see directions.",
            variant: "destructive"
          });
          setError("Unable to access your location. Please enable location services.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
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
        setError("Could not find location on map");
        setIsLoading(false);
      }
    });
  };

  // Create the map and display directions when both locations are available
  useEffect(() => {
    if (userLocation && eventCoordinates && mapRef.current && window.google) {
      // Create map if it doesn't exist yet
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
          center: eventCoordinates,
          zoom: 13,
          mapTypeControl: false,
        });
        
        directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
          suppressMarkers: false,
        });
        
        directionsRendererRef.current.setMap(mapInstanceRef.current);
      }

      // Get directions
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: eventCoordinates,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            directionsRendererRef.current?.setDirections(result);
            
            // Extract distance and duration information
            const route = result.routes[0];
            if (route && route.legs && route.legs[0]) {
              setDistance(route.legs[0].distance?.text || null);
              setDuration(route.legs[0].duration?.text || null);
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
  }, [userLocation, eventCoordinates]);

  const openGoogleMaps = () => {
    if (userLocation && eventCoordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${encodeURIComponent(eventLocation)}`;
      window.open(url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">
          <MapPin className="inline-block mr-2 h-5 w-5 text-eventrix" />
          Getting Directions...
        </h2>
        <div className="h-64 w-full bg-gray-100 flex items-center justify-center rounded-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventrix"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-2">
          <MapPin className="inline-block mr-2 h-5 w-5 text-eventrix" />
          Directions
        </h2>
        <p className="text-red-500">{error}</p>
        <p className="mt-2">The event is located at: {eventLocation}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-xl font-semibold mb-2">
        <MapPin className="inline-block mr-2 h-5 w-5 text-eventrix" />
        Directions to Event
      </h2>
      
      {distance && duration && (
        <div className="mb-4 bg-gray-50 p-3 rounded-md">
          <p className="text-gray-700">
            <span className="font-medium">Distance:</span> {distance}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Estimated travel time:</span> {duration} by car
          </p>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        className="h-[350px] w-full rounded-md overflow-hidden mb-4" 
      />
      
      <Button 
        onClick={openGoogleMaps} 
        className="flex items-center bg-eventrix hover:bg-eventrix-hover"
      >
        <Navigation className="mr-2 h-4 w-4" />
        Open in Google Maps
      </Button>
    </Card>
  );
};

export default EventMap;
