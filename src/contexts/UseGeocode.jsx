import { useState, useEffect } from "react";

function useGeocode(lat, lng) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCJK4xNqR28XgzEMDWDsHKcLyMPV04E6qE`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK") {
          setAddress(data.results[0].formatted_address);
        } else {
          throw new Error(data.error_message || "Geocoding request failed");
        }
      } catch (error) {
        setError(error.message || "Unable to fetch address");
      } finally {
        setLoading(false);
      }
    };

    if (lat && lng) {
      fetchAddress();
    }

    return () => {
      // Cleanup if needed
    };
  }, [lat, lng]);

  return { address, loading, error };
}

export default useGeocode;
