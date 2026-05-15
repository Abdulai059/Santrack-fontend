import { useState, useRef } from "react";
import { startTracking } from "@/lib/trackingService";

/**
 * useGPSTracking — manages GPS tracking lifecycle.
 *
 * Exposes `latestPosition` so other hooks (e.g. useUserRoute) can react
 * to new GPS fixes immediately without waiting for a DB round-trip.
 *
 * @param {Object} profile - Authenticated user profile
 * @returns {{ isTracking, latestPosition, handleStartTracking, handleStopTracking }}
 */
export function useGPSTracking(profile) {
  const [isTracking, setIsTracking]       = useState(false);
  const [latestPosition, setLatestPosition] = useState(null);
  const trackerRef = useRef(null);

  const handleStartTracking = () => {
    if (!profile?.id) {
      alert("Please log in to share your location.");
      return;
    }

    trackerRef.current = startTracking(profile.id, {
      userName: profile.full_name || "Unknown User",
      userRole: profile.role || "operator",

      // Called on every GPS fix — update state immediately
      onUpdate: (position) => {
        setLatestPosition(position);
      },

      onError: (err) => {
        console.error("GPS Error:", err);
        alert(
          "Location permission denied or GPS unavailable. Please enable location services."
        );
      },
    });

    setIsTracking(true);
  };

  const handleStopTracking = () => {
    trackerRef.current?.stop();
    trackerRef.current = null;
    setIsTracking(false);
    setLatestPosition(null);
  };

  return {
    isTracking,
    latestPosition,
    handleStartTracking,
    handleStopTracking,
  };
}
