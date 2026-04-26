import { useState, useEffect } from 'react';

const FALLBACK_LOCATION = [20.5937, 78.9629]; // India fallback

export default function useLocation() {
  const [location, setLocation] = useState(FALLBACK_LOCATION);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const success = (position) => {
      setLocation([position.coords.latitude, position.coords.longitude]);
      setLoading(false);
      setError(null);
    };

    const fail = (err) => {
      setError(err.message);
      // Fallback already set
      setLoading(false);
    };

    const watchId = navigator.geolocation.watchPosition(success, fail, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error, loading };
}
