import React from 'react';
import { Scooter } from '../types';
import { Battery, Zap } from 'lucide-react';

interface ScooterListProps {
  scooters: Scooter[];
  onScooterSelect: (scooter: Scooter) => void;
}

const ScooterList: React.FC<ScooterListProps> = ({ scooters, onScooterSelect }) => {
  return (
    <div className="bg-white rounded-t-3xl -mt-6 relative z-10 p-4 h-[40vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Nearby Scooters</h2>
      <div className="space-y-4">
        {scooters.map((scooter) => (
          <div
            key={scooter.s_id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <h3 className="font-medium">Scooter {scooter.s_id}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="mx-2">•</span>
                <span>Status: {scooter.status}</span>
              </div>
            </div>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium"
              onClick={() => onScooterSelect(scooter)}
            >
              Ride
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScooterList;