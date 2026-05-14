// ── Map Configuration Constants ──────────────────────────────────────────────

export const FALLBACK_LOCATION = {
  id: "fallback",
  name: "Ghana",
  slug: "ghana",
  coords: [7.9465, -1.0232], // Ghana center
  incidents: 0,
  color: "#00cc66",
  type: "country",
  status: "operational",
};

export const DEFAULT_LAYERS = {
  infrastructure: true,
  communities: true,
  incidents: true,
  fieldWorkers: true,
  geofences: true,
};

export const PANEL_TYPES = {
  INCIDENTS: "incidents",
  TRACKING: "tracking",
};

export const ROLE_COLORS = {
  admin: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  district_officer: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  operator: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  response_team: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  ngo: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  visitor: { bg: "bg-stone-50", text: "text-stone-600", border: "border-stone-200" },
};

export const INCIDENT_SEVERITY_CONFIG = {
  high: {
    dot: "#ff4444",
    bg: "rgba(255,68,68,0.08)",
    border: "rgba(255,68,68,0.25)",
    label: "HIGH",
    lc: "#ff4444",
  },
  medium: {
    dot: "#ffaa00",
    bg: "rgba(255,170,0,0.08)",
    border: "rgba(255,170,0,0.25)",
    label: "MED",
    lc: "#ffaa00",
  },
  low: {
    dot: "#00cc66",
    bg: "rgba(0,204,102,0.08)",
    border: "rgba(0,204,102,0.25)",
    label: "LOW",
    lc: "#00cc66",
  },
};
