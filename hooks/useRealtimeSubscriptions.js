import { useEffect } from "react";
import {
  fetchLocations,
  fetchRecentIncidents,
  subscribeToReports,
} from "@/lib/mapService";
import { subscribeToFieldWorkers } from "@/lib/trackingService";

/**
 * Custom hook to manage realtime Supabase subscriptions
 * @param {Function} setLocations - State setter for locations
 * @param {Function} setRecentIncidents - State setter for incidents
 * @param {Function} setFieldWorkers - State setter for field workers
 */
export function useRealtimeSubscriptions(
  setLocations,
  setRecentIncidents,
  setFieldWorkers,
) {
  useEffect(() => {
    // Subscribe to sanitation reports
    const reportsSub = subscribeToReports(async () => {
      const [locs, incidents] = await Promise.all([
        fetchLocations(),
        fetchRecentIncidents(),
      ]);
      if (locs.length > 0) setLocations(locs);
      setRecentIncidents(incidents);
    });

    // Subscribe to field workers
    const workersSub = subscribeToFieldWorkers((workers) => {
      setFieldWorkers(workers);
    });

    // Cleanup subscriptions on unmount
    return () => {
      reportsSub.unsubscribe();
      workersSub.unsubscribe();
    };
  }, [setLocations, setRecentIncidents, setFieldWorkers]);
}
