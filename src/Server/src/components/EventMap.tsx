import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface EventMapProps {
  eventLocation: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

const DEFAULT_LOCATION: Coordinates = {
  lat: 13.040058,
  lng: 80.2693809,
};

const EventMap: React.FC<EventMapProps> = ({ eventLocation }) => {
  const [userLocation, setUserLocation] = useState<Coordinates>(DEFAULT_LOCATION);
  const [eventCoordinates, setEventCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          toast({
            title: "Location Error",
            description: "Unable to access your current location. Using default location.",
            variant: "destructive",
          });
          setUserLocation(DEFAULT_LOCATION);
        }
      );
    }
  }, [toast]);

  useEffect(() => {
    const geocode = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            eventLocation
          )}&format=json&limit=1`
        );
        const results = await response.json();
        if (results && results.length > 0) {
          setEventCoordinates({
            lat: parseFloat(results[0].lat),
            lng: parseFloat(results[0].lon),
          });
        } else {
          setError("Could not find event location");
        }
      } catch (e) {
        console.error("Geocoding error:", e);
        setError("Could not find event location");
      }
    };
    geocode();
  }, [eventLocation]);

  const openGoogleMaps = () => {
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${encodeURIComponent(
      eventLocation
    )}`;
    window.open(url, "_blank");
  };

  return (
    <Card className="p-6 mt-8">
      <h2 className="text-xl font-semibold mb-2">
        <MapPin className="inline-block mr-2 h-5 w-5 text-eventrix" />
        Directions to Event
      </h2>

      <MapContainer
        center={eventCoordinates || DEFAULT_LOCATION}
        zoom={13}
        scrollWheelZoom={false}
        className="h-[350px] w-full rounded-md overflow-hidden mb-4"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {eventCoordinates && (
          <Marker position={eventCoordinates}>
            <Popup>
              Event Location: {eventLocation}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <Button onClick={openGoogleMaps} className="flex items-center bg-eventrix hover:bg-eventrix-hover">
        <Navigation className="mr-2 h-4 w-4" />
        Open in Google Maps
      </Button>
    </Card>
  );
};

export default EventMap;
