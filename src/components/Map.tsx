import React from 'react';
import Map, { Marker } from 'react-map-gl';
import { Scooter } from '../types';

interface ScooterMapProps {
  scooters: Scooter[];
  onScooterSelect: (scooter: Scooter) => void;
  userLocation?: { latitude: number; longitude: number } | null;
}

const ScooterMap: React.FC<ScooterMapProps> = ({ scooters, onScooterSelect, userLocation }) => {
  return (
    <Map
      initialViewState={{
        longitude: userLocation?.longitude || 10.3951,
        latitude: userLocation?.latitude || 63.4305,
        zoom: 14
      }}
      style={{ width: '100%', height: '80%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken="pk.eyJ1IjoiaGF2YXJoYWdlbHVuZCIsImEiOiJjbTcxdnF0cnowM2VtMmpxcjFweXIyaGQ3In0.e3m1jWy0kULPSyTr-9goOQ"
    >
      {scooters.map((scooter) => (
        <Marker
          key={scooter.s_id}
          longitude={scooter.loc[1]}
          latitude={scooter.loc[0]}
          onClick={() => onScooterSelect(scooter)}
        >
          <div 
            className={`w-4 h-4 rounded-full ${
              scooter.status === 'available' 
                ? 'bg-green-500' 
                : 'bg-gray-400'
            } border-2 border-white shadow-lg cursor-pointer`}
          />
        </Marker>
      ))}
      
      {userLocation && (
        <Marker
          longitude={userLocation.longitude}
          latitude={userLocation.latitude}
        >
          <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </Marker>
      )}
    </Map>
  );
};

export default ScooterMap;