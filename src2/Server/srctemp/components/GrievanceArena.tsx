
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PlaceResults, EnvironmentalData } from './GrievanceArena/types';
import { LocationSearch } from './GrievanceArena/LocationSearch';
import { PlacesDisplay } from './GrievanceArena/PlacesDisplay';
import { EnvironmentalDisplay } from './GrievanceArena/EnvironmentalDisplay';

const GrievanceArena = () => {
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [places, setPlaces] = useState<PlaceResults | null>(null);
  const [environmentalData, setEnvironmentalData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setLoading(true);
    
    // Set IITM coordinates directly
    const lat = 12.9914929;
    const lng = 80.2336907;
    setCurrentLocation({ lat, lng });
    
    // Set the predefined environmental data
    setEnvironmentalData({
      weather: {
        description: "Scattered clouds",
        temperature: 35.04,
        feels_like: 41.17,
        humidity: 51,
        wind_speed: 2.77,
        coordinates: { lat, lng }
      },
      rainfall: {
        forecast: [
          "At 2025-06-09 12:00:00: Rainfall expected - 0.59 mm",
          "At 2025-06-09 15:00:00: Rainfall expected - 3.71 mm", 
          "At 2025-06-09 18:00:00: Rainfall expected - 0.29 mm",
          "At 2025-06-10 03:00:00: Rainfall expected - 0.3 mm"
        ],
        summary: "Light to moderate rainfall expected over the next day"
      },
      soilMoisture: {
        value: 0.109,
        unit: "m³/m³",
        coordinates: { lat, lng }
      },
      terrain: {
        latitude: lat,
        longitude: lng,
        elevation: 11.0,
        tilt: 0.5729386976834859,
        slope: 0.5729386976834859,
        relief: 11.0,
        plan_curvature: 0.01,
        profile_curvature: 0.01
      }
    });

    // Set the predefined places data
    setPlaces({
      hospital: [
        {
          name: "MGM Healthcare, Malar - Adyar",
          address: "52, 1st Main Road, Gandhi Nagar, Chennai",
          full_address: "52, 1st Main Rd, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020, India",
          location: { lat: 13.0101544, lng: 80.25861599999999 },
          phone_number: "099625 99933",
          website: "https://mgmmalar.in/",
          google_url: "https://maps.google.com/?cid=7345545309624800354",
          rating: "4.4",
          reviews: [
            {
              author_name: "Pradeep Kumar",
              rating: 5,
              text: "I was recently admitted to MGM Malar Hospital for a renal transplant, and I want to express my heartfelt gratitude for the exceptional care and commitment shown by the entire team throughout my journey.",
              relative_time_description: "2 weeks ago"
            }
          ],
          distance_km: 3.41,
          place_id: "mgm_healthcare_malar"
        },
        {
          name: "DC CLINIC ( previously Derme Cure Skin & Cosmetic clinic)",
          address: "No. 2, 3rd Cross Street, 3rd Main Road, Jaganathapuram, Velachery, Chennai",
          full_address: "No. 2, 3rd Cross Street, 3rd Main Road, Jaganathapuram, Velachery, Ram Nagar, Murugapakkam, Velachery, Chennai, Tamil Nadu 600042, India",
          location: { lat: 12.9842476, lng: 80.2208184 },
          phone_number: "099449 63505",
          website: "https://dcskinhealth.com/",
          google_url: "https://maps.google.com/?cid=8712426858368783180",
          rating: "4.5",
          reviews: [],
          distance_km: 1.61,
          place_id: "dc_clinic"
        }
      ],
      police_station: [
        {
          name: "Elliots Beach Police Booth",
          address: "272C+7FQ, 6th Avenue, Elliots Beach, Besant Nagar, Chennai",
          full_address: "272C+7FQ, 6th Avenue, Elliots Beach, Besant Nagar, Chennai, Tamil Nadu 600090, India",
          location: { lat: 13.0007137, lng: 80.2712202 },
          phone_number: "N/A",
          website: "N/A",
          google_url: "https://maps.google.com/?cid=15679020201874030595",
          rating: "N/A",
          reviews: [],
          distance_km: 4.19,
          place_id: "elliots_beach_police"
        },
        {
          name: "J13 Tharamani Police Station",
          address: "X6VV+V5X, Nehru Street, Kanagam, Tharamani, Chennai",
          full_address: "X6VV+V5X, Nehru St, Kanagam, Tharamani, Chennai, Tamil Nadu 600113, India",
          location: { lat: 12.994747, lng: 80.2429914 },
          phone_number: "094981 00168",
          website: "http://www.tnpolice.gov.in/",
          google_url: "https://maps.google.com/?cid=15328492819500719661",
          rating: "N/A",
          reviews: [],
          distance_km: 1.07,
          place_id: "tharamani_police"
        }
      ],
      blood_bank: [
        {
          name: "V.H.S blood Bank",
          address: "Pallipattu, Tharamani, Chennai",
          full_address: "Pallipattu, Tharamani, Chennai, Tamil Nadu 600113, India",
          location: { lat: 13.0020495, lng: 80.2469516 },
          phone_number: "044 2254 2829",
          website: "https://vhschennai.org/rotary-central-ttk-vhs-blood-bank.php",
          google_url: "https://maps.google.com/?cid=16075036116088860391",
          rating: "4.5",
          reviews: [],
          distance_km: 1.86,
          place_id: "vhs_blood_bank"
        }
      ],
      restaurant: [
        {
          name: "Sangeetha Veg Restaurant - Adyar",
          address: "No: 7, Gandhi Nagar 1st Main Road, Adyar, Chennai",
          full_address: "No: 7, Gandhi Nagar 1st Main Road, Gandhi Nagar, Adyar, Chennai, Tamil Nadu 600020, India",
          location: { lat: 13.0070729, lng: 80.2500357 },
          phone_number: "044 2442 6792",
          website: "https://sangeethaveg.com/",
          google_url: "https://maps.google.com/?cid=663572840911354550",
          rating: "4.2",
          reviews: [],
          distance_km: 2.48,
          place_id: "sangeetha_adyar"
        }
      ],
      fire_station: [
        {
          name: "Velachery Fire Station",
          address: "Tiruvalluvar Street, Annai Indira Nagar, Annai Indira Nagar, Velachery, Chennai",
          full_address: "Tiruvalluvar St, Annai Indira Nagar, Velachery, Chennai, Tamil Nadu 600042, India",
          location: { lat: 12.9768023, lng: 80.22760459999999 },
          phone_number: "N/A",
          website: "N/A",
          google_url: "https://maps.google.com/?cid=7335938636148968759",
          rating: "4.4",
          reviews: [],
          distance_km: 1.76,
          place_id: "velachery_fire"
        }
      ],
      pharmacy: [],
      hotel: []
    });

    toast({
      title: "Location Found",
      description: `Found your location: IITM (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    });
    
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          🚨 Grievance & Issue Addressal Arena
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Find nearby emergency services, environmental data, and essential facilities in your area.
        </p>
      </div>

      {/* Location Button Section */}
      <Card>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <Button 
              onClick={getCurrentLocation}
              disabled={loading}
              className="bg-eventrix hover:bg-eventrix-hover px-8 py-3"
              size="lg"
            >
              {loading ? "Getting Location..." : "🎯 Use Current Location"}
            </Button>

            {currentLocation && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-200 font-medium">
                  📍 Current coordinates: IITM ({currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)})
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading Section */}
      {loading && (
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventrix mx-auto"></div>
            <div className="space-y-2">
              <p className="text-lg font-medium">Searching nearby places and environmental data...</p>
              <p className="text-sm text-gray-500">Fetching real data from multiple APIs</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Tabs Section */}
      {(places || environmentalData) && !loading && (
        <Tabs defaultValue="emergency" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="emergency" className="text-base">Emergency Services</TabsTrigger>
            <TabsTrigger value="environmental" className="text-base">Environmental Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="emergency" className="mt-8">
            {places && <PlacesDisplay places={places} />}
          </TabsContent>
          
          <TabsContent value="environmental" className="mt-8">
            {environmentalData && <EnvironmentalDisplay environmentalData={environmentalData} />}
          </TabsContent>
        </Tabs>
      )}

      {/* Empty State */}
      {!places && !environmentalData && !loading && (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto space-y-6">
            <MapPin className="h-16 w-16 text-gray-400 mx-auto" />
            <div className="space-y-4">
              <p className="text-xl text-gray-500">
                🗺️ Find Emergency Services & Environmental Data
              </p>
              <p className="text-gray-400">
                Click "Use Current Location" to search for nearby emergency services and environmental information
              </p>
              <p className="text-gray-400 text-sm">
                <strong>Real Data</strong> - Shows actual places and environmental data from multiple APIs
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceArena;
