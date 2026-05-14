import { useState } from "react";
import { DEFAULT_LAYERS, PANEL_TYPES } from "@/lib/mapConstants";

/**
 * Custom hook to manage UI state for maps page
 * @returns {Object} UI state and setters
 */
export function useMapsUI() {
  const [activeLayers, setActiveLayers] = useState(DEFAULT_LAYERS);
  const [rightPanel, setRightPanel] = useState(PANEL_TYPES.INCIDENTS);
  const [showLocations, setShowLocations] = useState(false);
  const [showIncidents, setShowIncidents] = useState(false);
  const [showWorkers, setShowWorkers] = useState(false);

  const handleToggleLayer = (key) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
    
    // Sync right panel with layer toggles
    if (key === "incidents") {
      setRightPanel((prev) =>
        prev === PANEL_TYPES.INCIDENTS ? PANEL_TYPES.TRACKING : PANEL_TYPES.INCIDENTS
      );
    }
    if (key === "fieldWorkers") {
      setRightPanel((prev) =>
        prev === PANEL_TYPES.TRACKING ? PANEL_TYPES.INCIDENTS : PANEL_TYPES.TRACKING
      );
    }
  };

  return {
    activeLayers,
    setActiveLayers,
    handleToggleLayer,
    rightPanel,
    setRightPanel,
    showLocations,
    setShowLocations,
    showIncidents,
    setShowIncidents,
    showWorkers,
    setShowWorkers,
  };
}
