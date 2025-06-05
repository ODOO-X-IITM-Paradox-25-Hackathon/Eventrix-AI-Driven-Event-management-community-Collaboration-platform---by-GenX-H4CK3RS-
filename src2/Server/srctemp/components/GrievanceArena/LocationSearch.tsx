
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface LocationSearchProps {
  location: string;
  setLocation: (location: string) => void;
  currentLocation: {lat: number, lng: number} | null;
  loading: boolean;
  onGetCurrentLocation: () => void;
  onSearchManualLocation: () => void;
}

export const LocationSearch = ({
  location,
  setLocation,
  currentLocation,
  loading,
  onGetCurrentLocation,
  onSearchManualLocation
}: LocationSearchProps) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Location Services
      </CardTitle>
      <CardDescription>
        Get your current location or enter a location manually to find nearby emergency services.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Button 
          onClick={onGetCurrentLocation}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? "Getting Location..." : "🎯 Use Current Location"}
        </Button>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Enter your location (e.g., Chennai, Mumbai, New York)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSearchManualLocation()}
            className="flex-1"
          />
          <Button 
            onClick={onSearchManualLocation}
            disabled={loading}
            size="lg"
          >
            {loading ? "Searching..." : "🔍 Search"}
          </Button>
        </div>
      </div>

      {currentLocation && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <p className="text-green-800 dark:text-green-200 font-medium">
            📍 Current coordinates: ({currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)})
          </p>
        </div>
      )}
    </CardContent>
  </Card>
);
