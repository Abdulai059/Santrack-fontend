import { useState, useEffect } from "react";
import {
  fetchLocations,
  fetchRecentIncidents,
  fetchCommunities,
  fetchGeofences,
  subscribeToReports,
  subscribeToAlerts,
} from "../../lib/mapService";
import { fetchFieldWorkers, subscribeToFieldWorkers } from "../../lib/trackingService";
import { FALLBACK_LOCATION } from "../constants";

export function useMapsData() {
  const [locations,       setLocations]       = useState([]);
  const [communities,     setCommunities]     = useState([]);
  const [geofences,       setGeofences]       = useState([]);
  const [recentIncidents, setRecentIncidents] = useState([]);
  const [fieldWorkers,    setFieldWorkers]    = useState([]);
  const [activeLocation,  setActiveLocation]  = useState(null);
  const [loading,         setLoading]         = useState(true);

  // Initial load
  useEffect(() => {
    async function load() {
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
    load();
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    const reportsSub = subscribeToReports(async () => {
      const [locs, incidents] = await Promise.all([fetchLocations(), fetchRecentIncidents()]);
      if (locs.length > 0) setLocations(locs);
      setRecentIncidents(incidents);
    });

    const alertsSub = subscribeToAlerts(async () => {
      setRecentIncidents(await fetchRecentIncidents());
    });

    const workersSub = subscribeToFieldWorkers((workers) => {
      setFieldWorkers(workers);
    });

    return () => {
      reportsSub.unsubscribe();
      alertsSub.unsubscribe();
      workersSub.unsubscribe();
    };
  }, []);

  return {
    locations,
    communities,
    geofences,
    recentIncidents,
    fieldWorkers,
    activeLocation,
    setActiveLocation,
    loading,
  };
}