import { useState, useEffect } from "react";
import {
  fetchLocations,
  fetchRecentIncidents,
  fetchCommunities,
  fetchGeofences,
} from "@/lib/mapService";
import { fetchFieldWorkers } from "@/lib/trackingService";
import { FALLBACK_LOCATION } from "@/lib/mapConstants";

/**
 * Custom hook to manage all map data fetching
 * @returns {Object} Map data and loading state
 */
export function useMapData() {
  const [locations, setLocations] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [geofences, setGeofences] = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [fieldWorkers, setFieldWorkers] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMapData() {
      setLoading(true);

      const [locs, incidents, comms, fences, workers] = await Promise.all([
        fetchLocations(),
        fetchRecentIncidents(),
        fetchCommunities(),
        fetchGeofences(),
        fetchFieldWorkers(),
      ]);

      const finalLocs = locs.length > 0 ? locs : [FALLBACK_LOCATION];
      setLocations(finalLocs);
      setRecentIncidents(incidents);
      setCommunities(comms);
      setGeofences(fences);
      setFieldWorkers(workers);
      setActiveLocation(finalLocs[0]);
      setLoading(false);
    }

    loadMapData();
  }, []);

  return {
    locations,
    setLocations,
    communities,
    geofences,
    recentIncidents,
    setRecentIncidents,
    fieldWorkers,
    setFieldWorkers,
    activeLocation,
    setActiveLocation,
    loading,
  };
}
