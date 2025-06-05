import { PlaceResults, Place } from './types';

// Haversine distance calculation - exactly as in Python code
export const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in kilometers
  const phi1 = Math.PI * lat1 / 180;
  const phi2 = Math.PI * lat2 / 180;
  const dphi = Math.PI * (lat2 - lat1) / 180;
  const dlambda = Math.PI * (lon2 - lon1) / 180;
  const a = Math.sin(dphi/2) * Math.sin(dphi/2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda/2) * Math.sin(dlambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get coordinates using Flask backend
export const getCoordinates = async (address: string): Promise<{lat: number, lng: number}> => {
  try {
    const response = await fetch(`http://localhost:5000/get-coordinates?address=${encodeURIComponent(address)}`);
    const data = await response.json();
    
    if (response.ok) {
      return { lat: data.latitude, lng: data.longitude };
    } else {
      throw new Error(data.error || 'Failed to get coordinates');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// Get places using Flask backend
const getPlacesFromBackend = async (latitude: number, longitude: number, placeType: string, keyword?: string): Promise<Place[]> => {
  try {
    let url = `http://localhost:5000/get-places?lat=${latitude}&lng=${longitude}`;
    
    if (placeType) {
      url += `&type=${placeType}`;
    }
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get places');
    }
    
    return data.map((place: any, index: number) => ({
      name: place.name || 'N/A',
      address: place.address || 'N/A',
      location: place.location || { lat: latitude, lng: longitude },
      phone_number: place.phone_number || 'N/A',
      website: place.website || 'N/A',
      google_url: place.google_url || 'N/A',
      rating: place.rating || 'N/A',
      reviews: place.reviews || [],
      full_address: place.full_address || 'N/A',
      distance_km: place.distance_km || 0,
      place_id: `${placeType}_${index}`
    }));
  } catch (error) {
    console.error(`Error fetching ${placeType}:`, error);
    return [];
  }
};

// Weather and environmental data functions
export const getWeatherData = async (latitude: number, longitude: number): Promise<any> => {
  try {
    const response = await fetch(`http://localhost:5000/get-weather?lat=${latitude}&lng=${longitude}`);
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to get weather data');
    }
  } catch (error) {
    console.error('Weather data error:', error);
    throw error;
  }
};

export const getRainfallForecast = async (latitude: number, longitude: number): Promise<any> => {
  try {
    const response = await fetch(`http://localhost:5000/get-rainfall-forecast?lat=${latitude}&lng=${longitude}`);
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to get rainfall forecast');
    }
  } catch (error) {
    console.error('Rainfall forecast error:', error);
    throw error;
  }
};

export const getSoilMoisture = async (latitude: number, longitude: number): Promise<any> => {
  try {
    const response = await fetch(`http://localhost:5000/get-soil-moisture?lat=${latitude}&lng=${longitude}`);
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to get soil moisture data');
    }
  } catch (error) {
    console.error('Soil moisture error:', error);
    throw error;
  }
};

export const getTerrainAnalysis = async (latitude: number, longitude: number): Promise<any> => {
  try {
    const response = await fetch(`http://localhost:5000/get-terrain-analysis?lat=${latitude}&lng=${longitude}`);
    const data = await response.json();
    
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to get terrain analysis');
    }
  } catch (error) {
    console.error('Terrain analysis error:', error);
    throw error;
  }
};

// Find places - using real API calls via Flask backend
export const findPlaces = async (latitude: number, longitude: number): Promise<PlaceResults> => {
  console.log(`Searching places near coordinates: ${latitude}, ${longitude}`);
  
  try {
    // Define place types and their corresponding API parameters
    const placeQueries = [
      { key: 'hospital', type: 'hospital' },
      { key: 'police_station', type: 'police' },
      { key: 'fire_station', type: 'fire_station' },
      { key: 'blood_bank', keyword: 'blood bank' },
      { key: 'pharmacy', type: 'pharmacy' },
      { key: 'restaurant', type: 'restaurant' },
      { key: 'hotel', type: 'lodging' }
    ];

    // Make all API calls concurrently
    const promises = placeQueries.map(async (query) => {
      if (query.type) {
        return {
          key: query.key,
          places: await getPlacesFromBackend(latitude, longitude, query.type)
        };
      } else if (query.keyword) {
        return {
          key: query.key,
          places: await getPlacesFromBackend(latitude, longitude, '', query.keyword)
        };
      }
      return { key: query.key, places: [] };
    });

    const results = await Promise.all(promises);
    
    // Convert results to the expected format
    const placeResults: PlaceResults = {
      hospital: [],
      police_station: [],
      blood_bank: [],
      restaurant: [],
      fire_station: [],
      pharmacy: [],
      hotel: []
    };

    results.forEach(result => {
      if (result && placeResults.hasOwnProperty(result.key)) {
        placeResults[result.key as keyof PlaceResults] = result.places;
      }
    });

    console.log('Real API results:', placeResults);
    return placeResults;
  } catch (error) {
    console.error('Error in findPlaces:', error);
    throw error;
  }
};
