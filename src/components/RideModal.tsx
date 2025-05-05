import React from 'react';
import { motion } from 'framer-motion';
import { Scooter } from '../types';
import { Lock, Unlock, ParkingSquare, AlertTriangle, Beer, CheckCircle } from 'lucide-react';

interface RideModalProps {
  scooter: Scooter;
  status: 'unlocking' | 'validating_alcohol' | 'high_bac' | 'riding' | 'parking' | 'locked';
  onClose: () => void;
  onFinishRide: () => void;
}

const RideModal: React.FC<RideModalProps> = ({
  scooter,
  status,
  onClose,
  onFinishRide,
}) => {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-lg"
    >
      {status === 'unlocking' && (
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mx-auto w-16 h-16 mb-4"
          >
            <Unlock className="w-16 h-16 text-green-500" />
          </motion.div>
          <h2 className="text-xl font-semibold mb-2">Unlocking Scooter</h2>
          <p className="text-gray-600">Please wait while we unlock your scooter...</p>
        </div>
      )}

      {status === 'validating_alcohol' && (
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mx-auto w-16 h-16 mb-4"
          >
            <Beer className="w-16 h-16 text-yellow-500" />
          </motion.div>
          <h2 className="text-xl font-semibold mb-2">Validating BAC</h2>
          <p className="text-gray-600">Please wait while we check your blood alcohol content...</p>
        </div>
      )}

      {status === 'high_bac' && (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mx-auto w-16 h-16 mb-4"
          >
            <AlertTriangle className="w-16 h-16 text-red-500" />
          </motion.div>
          <h2 className="text-xl font-semibold mb-2 text-red-500">High BAC Detected</h2>
          <p className="text-gray-600 mb-4">For your safety, you cannot ride at this time.</p>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium"
          >
            Return to Browsing
          </button>
        </div>
      )}

      {status === 'riding' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Scooter {scooter.s_id}</h2>
              <div className="flex items-center text-gray-600 mt-1">
                <span>Status: {scooter.status}</span>
              </div>
            </div>
            <button
              onClick={onFinishRide}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium flex items-center"
            >
              <ParkingSquare className="w-5 h-5 mr-2" />
              End Ride
            </button>
          </div>
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="text-lg font-medium">Current Ride</p>
            <div className="flex justify-between mt-2">
              <span>Time</span>
              <span className="font-medium">00:00</span>
            </div>
            <div className="flex justify-between mt-2">
              <span>Cost</span>
              <span className="font-medium">$0.00</span>
            </div>
          </div>
        </div>
      )}

      {status === 'parking' && (
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mx-auto w-16 h-16 mb-4"
          >
            <Lock className="w-16 h-16 text-red-500" />
          </motion.div>
          <h2 className="text-xl font-semibold mb-2">Parking Scooter</h2>
          <p className="text-gray-600">Please wait while we secure your scooter...</p>
        </div>
      )}

      {status === 'locked' && (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mx-auto w-16 h-16 mb-4"
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <h2 className="text-xl font-semibold mb-2 text-green-500">Ride Completed!</h2>
          <p className="text-gray-600 mb-4">Your scooter has been successfully locked.</p>
          <button
            onClick={onClose}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium"
          >
            Return to Browsing
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default RideModal;