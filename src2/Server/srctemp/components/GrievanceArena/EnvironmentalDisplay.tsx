
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, CloudRain, Thermometer, Wind, Droplets, Mountain } from "lucide-react";
import { EnvironmentalData } from './types';

interface EnvironmentalDisplayProps {
  environmentalData: EnvironmentalData;
}

export const EnvironmentalDisplay = ({ environmentalData }: EnvironmentalDisplayProps) => {
  const { weather, rainfall, soilMoisture, terrain } = environmentalData;

  return (
    <div className="space-y-6">
      {/* Weather Data */}
      {weather && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              Current Weather
            </CardTitle>
            <CardDescription>
              Weather conditions at ({weather.coordinates.lat.toFixed(4)}, {weather.coordinates.lng.toFixed(4)})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Temperature</p>
                  <p className="text-lg font-bold">{weather.temperature}°C</p>
                  <p className="text-xs text-gray-500">Feels like {weather.feels_like}°C</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Wind Speed</p>
                  <p className="text-lg font-bold">{weather.wind_speed} m/s</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Humidity</p>
                  <p className="text-lg font-bold">{weather.humidity}%</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Conditions</p>
                <Badge variant="outline" className="mt-1">
                  {weather.description}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rainfall Forecast */}
      {rainfall && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CloudRain className="h-5 w-5 text-blue-600" />
              5-Day Rainfall Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{rainfall.summary}</p>
            {rainfall.forecast.length > 0 ? (
              <div className="space-y-2">
                {rainfall.forecast.map((forecast, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                    <p className="text-sm">{forecast}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No significant rainfall predicted</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Soil Moisture */}
      {soilMoisture && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-green-600" />
              Soil Moisture Data
            </CardTitle>
            <CardDescription>
              Soil moisture at ({soilMoisture.coordinates.lat.toFixed(4)}, {soilMoisture.coordinates.lng.toFixed(4)})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{soilMoisture.value}</p>
                <p className="text-sm text-gray-500">{soilMoisture.unit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  This indicates the volumetric water content in the top layer of soil (0-1cm depth).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terrain Analysis */}
      {terrain && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-brown-600" />
              Terrain Analysis
            </CardTitle>
            <CardDescription>
              Topographical data for ({terrain.latitude.toFixed(4)}, {terrain.longitude.toFixed(4)})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium">Elevation</p>
                <p className="text-lg font-bold">{terrain.elevation} m</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Slope/Tilt</p>
                <p className="text-lg font-bold">{terrain.tilt.toFixed(2)}°</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Relief</p>
                <p className="text-lg font-bold">{terrain.relief} m</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Plan Curvature</p>
                <p className="text-lg font-bold">{terrain.plan_curvature.toFixed(4)}</p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Profile Curvature</p>
                <p className="text-lg font-bold">{terrain.profile_curvature.toFixed(4)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
