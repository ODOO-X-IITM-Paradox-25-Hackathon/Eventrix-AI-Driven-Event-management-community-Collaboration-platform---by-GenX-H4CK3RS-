export interface PlaceLocation {
  lat: number;
  lng: number;
}

export interface PlaceReview {
  author_name?: string;
  rating?: number;
  text?: string;
  relative_time_description?: string;
}

export interface Place {
  name: string;
  address: string;
  location: PlaceLocation;
  phone_number: string;
  website: string;
  google_url: string;
  rating: number | string;
  reviews: PlaceReview[];
  full_address: string;
  distance_km: number;
  place_id: string;
}

export interface PlaceResults {
  hospital: Place[];
  police_station: Place[];
  blood_bank: Place[];
  restaurant: Place[];
  fire_station: Place[];
  pharmacy: Place[];
  hotel: Place[];
}

export interface WeatherData {
  description: string;
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface RainfallForecast {
  forecast: string[];
  summary: string;
}

export interface SoilMoisture {
  value: number;
  unit: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface TerrainAnalysis {
  latitude: number;
  longitude: number;
  elevation: number;
  tilt: number;
  slope: number;
  relief: number;
  plan_curvature: number;
  profile_curvature: number;
}

export interface EnvironmentalData {
  weather?: WeatherData;
  rainfall?: RainfallForecast;
  soilMoisture?: SoilMoisture;
  terrain?: TerrainAnalysis;
}
