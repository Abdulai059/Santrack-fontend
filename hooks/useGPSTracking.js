import { useState, useRef } from "react";
import { startTracking } from "@/lib/trackingService";

/**
 * Custom hook to manage GPS tracking functionality
 * @param {Object} profile - User profile object
 * @returns {Object} Tracking state and control functions
 */
export function useGPSTracking(profile) {
  const [isTracking, setIsTracking] = useState(false);
  const trackerRef = useRef(null);

  const handleStartTracking = () => {
    // Only logged-in users can track
    if (!profile?.id) {
      alert("Please log in to share your location.");
      return;
    }

    const userId = profile.id;
    const userName = profile.full_name || "Unknown User";
    const userRole = profile.role || "operator";

    trackerRef.current = startTracking(userId, {
      userName,
      userRole,
      onUpdate: (position) => {
        console.log(
          "📍 GPS Position:",
          position.latitude,
          position.longitude,
          "Accuracy:",
          position.accuracy,
          "m"
        );
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
  };

  return {
    isTracking,
    handleStartTracking,
    handleStopTracking,
  };
}
