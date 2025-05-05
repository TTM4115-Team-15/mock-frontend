import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ScooterMap from './components/Map';
import ScooterList from './components/ScooterList';
import RideModal from './components/RideModal';
import { RideState, Scooter } from './types';
import { toast } from 'sonner';


const baseUrl = `http://${import.meta.env.APP_SERVER_IP}:${import.meta.env.APP_PORT}`;


async function validateAlcohol(scooter: Scooter, setRideState: (state: RideState) => void) {
  console.log("validating alcohol running")
  const response2 = await fetch(`${baseUrl}/bac`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data2 = await response2.json();
  console.log("res: ", data2)
  if (!response2.ok) {
    const errorText = await response2.text();
    console.error('Error response:', errorText);
    throw new Error(`HTTP error! status: ${response2.status}, details: ${errorText}`);
  }

  if (data2.status == 0) {
    setRideState({ status: 'high_bac', selectedScooter: scooter });
  } else if (data2.status == 1) {
    setRideState({ status: 'riding', selectedScooter: scooter });
  }
  else {
    setTimeout(() => {
      validateAlcohol(scooter, setRideState);
    }, 2000);
  }
}


function App() {


  const [rideState, setRideState] = useState<RideState>({
    status: 'browsing',
    selectedScooter: null,
  });

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [scooters, setScooters] = useState<Scooter[]>([]);

  const handleScooterSelect = async (scooter: Scooter) => {
    setRideState({ status: 'unlocking', selectedScooter: scooter });
    console.log("scooter", scooter)
    try {
      const response = await fetch(`${baseUrl}/choose_scooter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "s_id": scooter.s_id
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      console.log("response", response)

      const data = await response.json();
      console.log("res: ", data)

      setRideState({ status: 'validating_alcohol', selectedScooter: scooter });

      console.log("I am here")

      console.log("rideState", rideState)

      setTimeout(() => {
        validateAlcohol(scooter, setRideState);
      }, 500);


    } catch (error) {
      console.error('Error fetching scooters:', error);
      throw error;
    }
  };

  const handleFinishRide = async () => {
    try {
      // First show the parking animation
      setRideState({ status: 'parking', selectedScooter: rideState.selectedScooter });

      const response = await fetch(`${baseUrl}/lock`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }

      // Show the success state
      setRideState({ status: 'locked', selectedScooter: rideState.selectedScooter });

      // After 2 seconds, return to browsing
      setTimeout(() => {
        setRideState({ status: 'browsing', selectedScooter: null });
      }, 2000);
    } catch (error) {
      console.error('Error finishing ride:', error);
      toast.error('Failed to finish ride. Please try again.');
      setRideState({ status: 'browsing', selectedScooter: null });
    }
  };

  const handleGetScooters = async (userId: string, location: { latitude: number; longitude: number }) => {
    try {
      console.log("userId", userId, "location", location)
      const response = await fetch(`${baseUrl}/available`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "user_id": parseInt(userId, 10),
          "location": [location.latitude, location.longitude]
        }),
      });
      console.log("response", response)

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
      }
      console.log("response", response)

      const data = await response.json();
      console.log("res: ", data)

      const scooters = data.map((scooter: any) => ({
        s_id: scooter.s_id,
        loc: [scooter.loc[0], scooter.loc[1]],
        status: "available"
      }));

      console.log("scooters", scooters)
      setScooters(scooters);
      return scooters;
    } catch (error) {
      console.error('Error fetching scooters:', error);
      throw error;
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        setLocationError(null);
        // Fetch scooters with the user's actual location
        handleGetScooters('1', { latitude, longitude });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        if (error.code === 1) {
          errorMessage = 'Location access denied. Please enable location services.';
        } else if (error.code === 2) {
          errorMessage = 'Location information unavailable';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out';
        }
        setLocationError(errorMessage);
        toast.error(errorMessage);
        // Fallback to default location
        handleGetScooters('1', { latitude: 0, longitude: 0 });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 relative">
        <ScooterMap
          scooters={scooters}
          onScooterSelect={handleScooterSelect}
          userLocation={userLocation}
        />
        {rideState.status === 'browsing' && (
          <ScooterList
            scooters={scooters}
            onScooterSelect={handleScooterSelect}
          />
        )}
        <AnimatePresence mode="wait">
          {rideState.status !== 'browsing' && rideState.selectedScooter && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <RideModal
                scooter={rideState.selectedScooter}
                status={rideState.status}
                onClose={() => setRideState({ status: 'browsing', selectedScooter: null })}
                onFinishRide={handleFinishRide}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;