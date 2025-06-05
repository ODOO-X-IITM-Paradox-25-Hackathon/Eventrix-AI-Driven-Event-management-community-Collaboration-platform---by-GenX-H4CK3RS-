
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hospital, AlertTriangle, Cross, Hotel, MapPin } from "lucide-react";
import { PlaceResults } from './types';
import { PlaceCard } from './PlaceCard';

interface PlacesDisplayProps {
  places: PlaceResults;
}

export const PlacesDisplay = ({ places }: PlacesDisplayProps) => {
  const placeTypes = [
    { key: 'hospital', title: 'Nearby Hospitals', icon: Hospital, color: 'text-red-500' },
    { key: 'police_station', title: 'Nearby Police Stations', icon: AlertTriangle, color: 'text-blue-500' },
    { key: 'fire_station', title: 'Nearby Fire Stations', icon: AlertTriangle, color: 'text-orange-500' },
    { key: 'blood_bank', title: 'Nearby Blood Banks', icon: Cross, color: 'text-red-600' },
    { key: 'pharmacy', title: 'Nearby Pharmacies', icon: Cross, color: 'text-green-600' },
    { key: 'hotel', title: 'Nearby Hotels', icon: Hotel, color: 'text-purple-500' },
    { key: 'restaurant', title: 'Nearby Restaurants', icon: MapPin, color: 'text-green-500' }
  ];

  return (
    <div className="space-y-8">
      {placeTypes.map(({ key, title, icon: Icon, color }) => (
        <div key={key}>
          <div className="flex items-center gap-3 mb-6">
            <Icon className={`h-6 w-6 ${color}`} />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
            <Badge variant="secondary" className="ml-2">
              {places[key as keyof PlaceResults]?.length || 0} found
            </Badge>
          </div>
          
          {places[key as keyof PlaceResults]?.length > 0 ? (
            <div className="space-y-4">
              {places[key as keyof PlaceResults].map((place, index) => (
                <PlaceCard key={place.place_id || index} place={place} index={index + 1} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500">No results found for this category.</p>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
};
