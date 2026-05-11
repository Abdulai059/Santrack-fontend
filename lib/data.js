import { Map, ClipboardList, BarChart2, Settings } from "lucide-react";

export const REPORT_DATA = [
  {
    id: 1,
    ticket: "SNT-001",
    lat: 10.985,
    lng: -0.448,
    title: "Bawku Primary School",
    location: "Bawku Primary School",
    type: "Girls latrine collapsed",
    time: "12 mins ago",
    status: "emergency",
    locType: "school",
  },
  {
    id: 2,
    ticket: "SNT-002",
    lat: 9.62,
    lng: -2.52,
    title: "Sissala Community",
    location: "Sissala Community",
    type: "Latrine overflow",
    time: "34 mins ago",
    status: "emergency",
    locType: "community",
  },
  {
    id: 3,
    ticket: "SNT-003",
    lat: 10.52,
    lng: -0.35,
    title: "Nalerigu JHS",
    location: "Nalerigu JHS",
    type: "Water contamination",
    time: "1 hr ago",
    status: "emergency",
    locType: "school",
  },
  {
    id: 4,
    ticket: "SNT-004",
    lat: 10.06,
    lng: -2.5,
    title: "Wa North Primary",
    location: "Wa North Primary",
    type: "Latrine full",
    time: "2 hrs ago",
    status: "open",
    locType: "school",
  },
  {
    id: 5,
    ticket: "SNT-005",
    lat: 8.47,
    lng: -0.005,
    title: "Kpandai Community",
    location: "Kpandai Community",
    type: "Sludge overflow",
    time: "3 hrs ago",
    status: "open",
    locType: "community",
  },
  {
    id: 6,
    ticket: "SNT-006",
    lat: 10.78,
    lng: -1.28,
    title: "Builsa Primary",
    location: "Builsa Primary",
    type: "Latrine damaged",
    time: "3 hrs ago",
    status: "open",
    locType: "school",
  },
  {
    id: 7,
    ticket: "SNT-007",
    lat: 10.84,
    lng: -0.17,
    title: "Garu East",
    location: "Garu East",
    type: "Latrine full",
    time: "4 hrs ago",
    status: "open",
    locType: "community",
  },
  {
    id: 8,
    ticket: "SNT-008",
    lat: 9.98,
    lng: -2.92,
    title: "Jirapa Community",
    location: "Jirapa Community",
    type: "No handwashing water",
    time: "5 hrs ago",
    status: "open",
    locType: "community",
  },
  {
    id: 9,
    ticket: "SNT-009",
    lat: 9.401,
    lng: -0.839,
    title: "Tamale SHS",
    location: "Tamale SHS",
    type: "Latrine repaired",
    time: "Today 08:14",
    status: "resolved",
    locType: "school",
  },
  {
    id: 10,
    ticket: "SNT-010",
    lat: 10.9,
    lng: -1.05,
    title: "Bongo Primary",
    time: "6 hrs ago",
    status: "flood",
    locType: "community",
  },
];

export const reportsById = Object.fromEntries(
  REPORT_DATA.map((r) => [r.id, r]),
);

export const STATUS_META = {
  emergency: {
    label: "Emergency",
    textColor: "text-red-700",
    bgColor: "bg-red-100",
    dotColor: "bg-red-500",
    hex: "#EF4444",
  },
  open: {
    label: "Open",
    textColor: "text-amber-700",
    bgColor: "bg-amber-100",
    dotColor: "bg-amber-400",
    hex: "#F59E0B",
  },
  resolved: {
    label: "Resolved",
    textColor: "text-green-700",
    bgColor: "bg-green-100",
    dotColor: "bg-green-500",
    hex: "#22C55E",
  },
  flood: {
    label: "Flood",
    textColor: "text-blue-700",
    bgColor: "bg-blue-100",
    dotColor: "bg-blue-500",
    hex: "#3B82F6",
  },
};

export const STATS = [
  {
    dotColor: "bg-red-500",
    label: "Emergency",
    value: 3,
    sub: "Needs immediate action",
  },
  {
    dotColor: "bg-amber-400",
    label: "Open reports",
    value: 11,
    sub: "Awaiting response",
  },
  {
    dotColor: "bg-green-500",
    label: "Resolved today",
    value: 7,
    sub: "Avg 3.2 hrs response",
  },
  {
    dotColor: "bg-blue-500",
    label: "Active operators",
    value: 5,
    sub: "2 on jobs now",
  },
];

export const NAV_ITEMS = [
  { id: "map", label: "Map", Icon: Map },
  { id: "reports", label: "Reports", Icon: ClipboardList },
  { id: "analytics", label: "Analytics", Icon: BarChart2 },
  { id: "settings", label: "Settings", Icon: Settings },
];

export const SIDEBAR_IDS = [1, 2, 3, 4, 5, 12, 9];

// Northern Ghana center
export const MAP_CENTER = [9.8, -1.0];
export const MAP_ZOOM = 7;
