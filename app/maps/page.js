"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/context/AuthContext";

// Custom Hooks
import { useMapData } from "@/hooks/useMapData";
import { useRealtimeSubscriptions } from "@/hooks/useRealtimeSubscriptions";
import { useGPSTracking } from "@/hooks/useGPSTracking";
import { useMapsUI } from "@/hooks/useMapsUI";

// Components
import MapHeader from "@/components/maps/MapHeader";
import MobileControls from "@/components/maps/MobileControls";
import MobileLocationsOverlay from "@/components/maps/MobileLocationsOverlay";
import MobileIncidentsOverlay from "@/components/maps/MobileIncidentsOverlay";
import MobileWorkersOverlay from "@/components/maps/MobileWorkersOverlay";
import LocationSlugs from "@/components/maps/LocationSlugs";
import IncidentsPanel from "@/components/maps/IncidentsPanel";
import LiveTrackingPanel from "@/components/maps/LiveTrackingPanel";
import MapFooter from "@/components/maps/MapFooter";
import WorkersFab from "@/components/maps/WorkersFab";

// Constants
import { PANEL_TYPES } from "@/lib/mapConstants";

// Leaflet must be client-only
const MapView = dynamic(() => import("@/components/maps/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-stone-50 text-emerald-500 font-mono text-xs tracking-widest animate-pulse">
      LOADING MAP...
    </div>
  ),
});

export default function MapsPage() {
  const { profile } = useAuth();

  // Custom hooks for data management
  const {
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
  } = useMapData();

  // Realtime subscriptions
  useRealtimeSubscriptions(setLocations, setRecentIncidents, setFieldWorkers);

  // GPS tracking
  const { isTracking, handleStartTracking, handleStopTracking } = useGPSTracking(profile);

  // UI state management
  const {
    activeLayers,
    handleToggleLayer,
    rightPanel,
    setRightPanel,
    showLocations,
    setShowLocations,
    showIncidents,
    setShowIncidents,
    showWorkers,
    setShowWorkers,
  } = useMapsUI();

  // Worker selection handler
  const handleSelectWorker = (worker) => {
    setActiveLocation({
      id: worker.id,
      name: worker.name,
      coords: worker.coords,
      color: "#10b981",
    });
  };

  // Loading screen
  if (loading || !activeLocation) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-stone-400">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900 font-['Syne',sans-serif] overflow-hidden">
      {/* Header */}
      <MapHeader
        rightPanel={rightPanel}
        setRightPanel={setRightPanel}
        fieldWorkers={fieldWorkers}
      />

      {/* Mobile Controls */}
      <MobileControls
        locations={locations}
        recentIncidents={recentIncidents}
        fieldWorkers={fieldWorkers}
        activeLocation={activeLocation}
        showLocations={showLocations}
        setShowLocations={setShowLocations}
        showIncidents={showIncidents}
        setShowIncidents={setShowIncidents}
        isTracking={isTracking}
        onStartTracking={handleStartTracking}
        onStopTracking={handleStopTracking}
        profile={profile}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop left sidebar — locations */}
        <div className="hidden lg:flex">
          <LocationSlugs
            locations={locations}
            activeLocation={activeLocation}
            onSelect={setActiveLocation}
          />
        </div>

        {/* Mobile Overlays */}
        <MobileLocationsOverlay
          isVisible={showLocations}
          locations={locations}
          activeLocation={activeLocation}
          onSelectLocation={(loc) => {
            setActiveLocation(loc);
            setShowLocations(false);
          }}
          onClose={() => setShowLocations(false)}
        />

        <MobileIncidentsOverlay
          isVisible={showIncidents}
          incidents={recentIncidents}
          locations={locations}
          onSelectIncident={(loc) => {
            setActiveLocation(loc);
            setShowIncidents(false);
          }}
          onClose={() => setShowIncidents(false)}
        />

        <MobileWorkersOverlay
          isVisible={showWorkers}
          workers={fieldWorkers}
          currentUserId={profile?.id}
          onSelectWorker={(worker) => {
            handleSelectWorker(worker);
            setShowWorkers(false);
          }}
          onClose={() => setShowWorkers(false)}
        />

        {/* Map */}
        <MapView
          locations={locations}
          activeLocation={activeLocation}
          onSelectLocation={setActiveLocation}
          communities={communities}
          fieldWorkers={fieldWorkers}
          onSelectWorker={handleSelectWorker}
          geofences={geofences}
          activeLayers={activeLayers}
          onToggleLayer={handleToggleLayer}
        />

        {/* Desktop right sidebar */}
        <div className="hidden lg:flex">
          {rightPanel === PANEL_TYPES.INCIDENTS ? (
            <IncidentsPanel
              incidents={recentIncidents}
              locations={locations}
              onSelectLocation={setActiveLocation}
            />
          ) : (
            <LiveTrackingPanel
              workers={fieldWorkers}
              isTracking={isTracking}
              onStartTracking={handleStartTracking}
              onStopTracking={handleStopTracking}
              onSelectWorker={handleSelectWorker}
              currentUserId={profile?.id}
            />
          )}
        </div>

        {/* Floating Action Button */}
        <WorkersFab
          fieldWorkers={fieldWorkers}
          onClick={() => setShowWorkers(true)}
          isVisible={!showWorkers && !showLocations && !showIncidents}
        />
      </div>

      {/* Footer */}
      <MapFooter activeLocation={activeLocation} />
    </div>
  );
}
