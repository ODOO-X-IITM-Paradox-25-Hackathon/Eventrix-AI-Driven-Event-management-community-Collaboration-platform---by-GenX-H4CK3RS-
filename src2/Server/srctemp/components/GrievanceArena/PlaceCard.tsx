
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Star, Navigation } from "lucide-react";
import { Place } from './types';

interface PlaceCardProps {
  place: Place;
  index: number;
}

export const PlaceCard = ({ place, index }: PlaceCardProps) => (
  <Card className="mb-6 border-l-4 border-l-eventrix">
    <CardHeader>
      <CardTitle className="flex items-start justify-between">
        <span className="text-lg font-bold">{index}. {place.name}</span>
        <Badge variant="outline" className="ml-2">
          {place.distance_km} km
        </Badge>
      </CardTitle>
      <CardDescription className="text-sm text-gray-600">
        {place.address}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm"><strong>Full Address:</strong></p>
          <p className="text-sm text-gray-600">{place.full_address}</p>
        </div>
        <div>
          <p className="text-sm"><strong>Coordinates:</strong></p>
          <p className="text-sm text-gray-600">({place.location.lat}, {place.location.lng})</p>
        </div>
      </div>

      {/* Contact & Rating Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <div>
            <p className="text-sm font-medium">Rating</p>
            <p className="text-sm text-gray-600">{place.rating}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-blue-500" />
          <div>
            <p className="text-sm font-medium">Phone</p>
            <p className="text-sm text-gray-600">{place.phone_number}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Navigation className="h-4 w-4 text-green-500" />
          <div>
            <p className="text-sm font-medium">Distance</p>
            <p className="text-sm text-gray-600">{place.distance_km} km</p>
          </div>
        </div>
      </div>

      {/* Website & Google Maps Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-purple-500" />
          <div>
            <p className="text-sm font-medium">Website</p>
            {place.website !== 'N/A' ? (
              <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline break-all">
                {place.website}
              </a>
            ) : (
              <p className="text-sm text-gray-600">N/A</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-red-500" />
          <div>
            <p className="text-sm font-medium">Google Maps</p>
            {place.google_url !== 'N/A' ? (
              <a href={place.google_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                View on Google Maps
              </a>
            ) : (
              <p className="text-sm text-gray-600">N/A</p>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-800">Reviews:</h4>
        {place.reviews && place.reviews.length > 0 ? (
          <div className="space-y-3">
            {place.reviews.slice(0, 2).map((review, reviewIndex) => (
              <div key={reviewIndex} className="bg-gray-50 p-4 rounded-lg border-l-2 border-l-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{review.author_name || 'Anonymous'}</span>
                    <span className="text-xs text-gray-500">({review.relative_time_description || 'Unknown time'})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span className="text-sm font-medium">{review.rating || 'N/A'}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">"{review.text || 'No review text available'}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No reviews available</p>
        )}
      </div>
    </CardContent>
  </Card>
);
