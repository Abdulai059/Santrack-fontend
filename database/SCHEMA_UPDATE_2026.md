# 🗄️ Database Schema Update - May 2026

## Schema Changes Summary

This document outlines the database schema updates and how they affect the frontend.

---

## 📊 Updated Tables

### 1. **communities** Table
```sql
CREATE TABLE public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  district character varying,
  region character varying,
  latitude double precision,
  longitude double precision,
  flood_risk_level text,
  drought_risk_level text,
  climate_status text DEFAULT 'stable',
  created_at timestamp with time zone DEFAULT now()
);
```

**New Fields**:
- `climate_status` - Climate stability status (stable, at_risk, critical)

**Frontend Impact**:
- ✅ Updated `fetchCommunities()` in `mapService.js`
- ✅ Updated community popup in `MapView.js` to show climate status
- ✅ Color-coded climate status display

---

### 2. **locations** Table
```sql
CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  type text NOT NULL,
  description text,
  community_id uuid NOT NULL REFERENCES communities(id),
  status text DEFAULT 'operational',
  climate_risk text,
  water_access boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  area_name text,
  landmark text,
  full_location_path text,
  created_at timestamp without time zone DEFAULT now()
);
```

**Schema Changes**:
- ❌ Removed: `district`, `region` (now from `communities` table via FK)
- ✅ Added: `community_id` (FK to communities) - **REQUIRED**
- ✅ Added: `climate_risk` - Climate risk assessment
- ✅ Added: `water_access` - Water availability status
- ✅ Added: `created_by` - User who created the location
- ✅ Added: `area_name` - Specific area name
- ✅ Added: `landmark` - Nearby landmark
- ✅ Added: `full_location_path` - Complete location path

**Frontend Impact**:
- ✅ Updated `fetchLocations()` to join with `communities` table
- ✅ Updated location popup to show:
  - Community name
  - District/Region (from communities)
  - Climate risk
  - Water access status
  - Area name and landmark

---

### 3. **sanitation_reports** Table
```sql
CREATE TABLE public.sanitation_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id character varying NOT NULL UNIQUE,
  issue_type character varying NOT NULL,
  severity character varying NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  health_risk boolean DEFAULT false,
  description text,
  reporter_phone character varying NOT NULL,
  status character varying DEFAULT 'Pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'resolved', 'rejected')),
  location_id uuid REFERENCES locations(id),
  reported_by uuid REFERENCES profiles(id),
  affected_people_count integer,
  community_id uuid REFERENCES communities(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**Schema Changes**:
- ❌ Removed: `community` (text field)
- ✅ Added: `community_id` (FK to communities)
- ✅ Added: `health_risk` - Boolean flag for health risks
- ✅ Added: `affected_people_count` - Number of people affected
- ✅ Changed: `severity` now has CHECK constraint

**Frontend Impact**:
- ✅ Updated `fetchRecentIncidents()` to join with `communities` table
- ✅ Updated incidents panel to show:
  - Reference ID
  - Health risk indicator
  - Affected people count
  - Community name (from FK)
  - District/Region (from communities)

---

### 4. **profiles** Table
```sql
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'operator' CHECK (role IN (
    'admin',
    'district_officer',
    'operator',
    'health_officer',
    'ngo',
    'response_team',
    'headteacher',
    'community_agent'
  )),
  community_id uuid REFERENCES communities(id),
  organization text,
  created_at timestamp with time zone DEFAULT now()
);
```

**Schema Changes**:
- ✅ Added: `community_id` - User's assigned community
- ✅ Added: `organization` - User's organization
- ✅ Updated: `role` CHECK constraint with new roles:
  - `health_officer` (new)
  - `headteacher` (new)
  - `community_agent` (new)

**Frontend Impact**:
- ⚠️ Need to update role colors in `mapConstants.js` for new roles
- ⚠️ Need to update role filters in tracking panels

---

### 5. **climate_events** Table (NEW)
```sql
CREATE TABLE public.climate_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  severity text,
  region text,
  start_date timestamp without time zone,
  end_date timestamp without time zone,
  impact_notes text,
  created_at timestamp without time zone DEFAULT now()
);
```

**New Table**:
- Tracks climate events (floods, droughts, etc.)
- Can be displayed on map as overlays

**Frontend Impact**:
- ✅ Added `fetchClimateEvents()` in `mapService.js`
- 🔄 Can be integrated into map as a new layer (optional)

---

### 6. **user_locations** Table
```sql
CREATE TABLE public.user_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES profiles(id),
  user_name text,
  user_role text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  accuracy double precision,
  heading double precision,
  speed double precision,
  timestamp timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

**No Changes** - Table structure remains the same

**Frontend Impact**:
- ✅ No changes needed - GPS tracking works as before

---

## 🔄 Migration Required

### Critical Changes

1. **locations.community_id is now REQUIRED**
   - All existing locations must be linked to a community
   - Migration script needed to assign communities to existing locations

2. **sanitation_reports.community_id added**
   - Reports should be linked to communities
   - Can be derived from location_id → location.community_id

### Migration Script (Recommended)

```sql
-- Step 1: Add community_id to existing locations based on district/region
-- (This requires manual mapping or a lookup table)

-- Step 2: Update sanitation_reports.community_id from locations
UPDATE sanitation_reports sr
SET community_id = l.community_id
FROM locations l
WHERE sr.location_id = l.id
AND sr.community_id IS NULL;

-- Step 3: Update profiles with community assignments
-- (Manual assignment based on user roles and areas)
```

---

## 📝 Frontend Files Updated

### Services
- ✅ `lib/mapService.js`
  - Updated `fetchLocations()` - joins with communities
  - Updated `fetchRecentIncidents()` - joins with communities
  - Updated `fetchCommunities()` - includes climate_status
  - Added `fetchClimateEvents()` - new function
  - Removed emergency_alerts references

### Components
- ✅ `components/maps/MapView.js`
  - Updated location popup with new fields
  - Updated community popup with climate status
  - Added climate risk indicators
  - Added water access warnings

- ✅ `components/maps/IncidentsPanel.js`
  - Added reference ID display
  - Added health risk indicator
  - Added affected people count

### Constants
- ⚠️ `lib/mapConstants.js` - **TODO**
  - Need to add new role colors:
    - `health_officer`
    - `headteacher`
    - `community_agent`

---

## 🎯 Testing Checklist

### Map Display
- [ ] Locations show correctly with community info
- [ ] Communities show with climate status
- [ ] Climate risk indicators display
- [ ] Water access warnings show when false

### Incidents
- [ ] Incidents show reference IDs
- [ ] Health risk indicators display
- [ ] Affected people count shows
- [ ] Community names display correctly

### GPS Tracking
- [ ] User tracking still works
- [ ] Location history saves correctly
- [ ] Field workers display properly

### Search
- [ ] Location search works with new schema
- [ ] Community search works
- [ ] District/region search works

---

## 🚀 Deployment Steps

1. **Backup Database**
   ```bash
   pg_dump -h your-host -U your-user -d your-db > backup.sql
   ```

2. **Run Schema Updates**
   - Apply new table structures
   - Add foreign keys
   - Update constraints

3. **Run Data Migration**
   - Link locations to communities
   - Update sanitation_reports
   - Assign users to communities

4. **Deploy Frontend**
   ```bash
   npm run build
   npm start
   ```

5. **Verify**
   - Test map display
   - Test incidents panel
   - Test GPS tracking
   - Test search functionality

---

## 📊 Schema Diagram

```
communities
├── id (PK)
├── name (UNIQUE)
├── district
├── region
├── latitude
├── longitude
├── flood_risk_level
├── drought_risk_level
└── climate_status

locations
├── id (PK)
├── name
├── latitude
├── longitude
├── type
├── community_id (FK → communities) ⚠️ REQUIRED
├── status
├── climate_risk
├── water_access
├── created_by (FK → profiles)
├── area_name
├── landmark
└── full_location_path

sanitation_reports
├── id (PK)
├── reference_id (UNIQUE)
├── issue_type
├── severity
├── health_risk
├── location_id (FK → locations)
├── reported_by (FK → profiles)
├── community_id (FK → communities)
├── affected_people_count
└── status

profiles
├── id (PK, FK → auth.users)
├── full_name
├── phone
├── role (CHECK constraint)
├── community_id (FK → communities)
└── organization

climate_events (NEW)
├── id (PK)
├── event_type
├── severity
├── region
├── start_date
├── end_date
└── impact_notes
```

---

## ✅ Summary

**Status**: ✅ Frontend Updated

**Changes Made**:
- Updated data fetching to use new schema
- Added community joins for locations and reports
- Added new field displays in popups
- Added climate risk and water access indicators
- Removed emergency_alerts references

**Pending**:
- Update role colors for new roles
- Database migration script
- Optional: Add climate events layer to map

---

**Last Updated**: May 15, 2026  
**Schema Version**: 2.0  
**Frontend Version**: Compatible
