# 📍 Location History Tracking System

## Overview

The system now tracks **complete location history** for all field workers. Every GPS position is saved, allowing you to:

- ✅ See where someone traveled from (e.g., Bolga → Tamale)
- ✅ Track complete journey history
- ✅ Calculate distance traveled
- ✅ Analyze movement patterns
- ✅ Generate reports on field worker activities

## How It Works

### 1. **Two Tables System**

#### `user_locations` (Current Position)
- Stores **only the latest position** for each user
- Updated every 6 seconds while tracking
- Used for **real-time map display**
- Shows who is currently active

#### `location_history` (Complete History)
- Stores **every GPS position** ever recorded
- Never deleted (unless you run cleanup)
- Used for **historical analysis and reports**
- Grows continuously over time

### 2. **Automatic Saving**

When a user shares their location:

```
1. GPS captures position every 6 seconds
   ↓
2. Position saved to user_locations (current)
   ↓
3. Database trigger automatically copies to location_history
   ↓
4. Both tables updated simultaneously
```

### 3. **Example Scenario**

**Field Worker Journey:**
```
Time: 8:00 AM - Location: Bolga (home base)
Time: 9:30 AM - Location: On road to Tamale
Time: 11:00 AM - Location: Tamale (incident site)
Time: 2:00 PM - Location: Returning to Bolga
Time: 4:00 PM - Location: Back in Bolga
```

**What's Stored:**
- `user_locations`: Shows current position (4:00 PM - Bolga)
- `location_history`: Has ALL positions from 8:00 AM to 4:00 PM

## Database Setup

### Step 1: Run Initial Schema
```sql
-- Run this in Supabase SQL Editor
-- File: database/tracking_tables.sql
```

### Step 2: Add User Info to History
```sql
-- Run this migration
-- File: database/add_user_info_to_history.sql
```

This adds `user_name` and `user_role` columns to track who was where.

## Using the API

### Fetch User's Location History

```javascript
import { fetchUserLocationHistory } from '@/lib/trackingService';

// Get last 100 positions for a user
const history = await fetchUserLocationHistory(userId);

// Get positions from last 24 hours
const today = new Date();
today.setHours(0, 0, 0, 0);
const todayHistory = await fetchUserLocationHistory(userId, {
  startDate: today,
  limit: 1000
});

// Get positions between specific dates
const history = await fetchUserLocationHistory(userId, {
  startDate: new Date('2026-05-01'),
  endDate: new Date('2026-05-14'),
  limit: 5000
});
```

### Fetch All Users' History

```javascript
import { fetchAllLocationHistory } from '@/lib/trackingService';

// Get all positions from last 7 days
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);

const allHistory = await fetchAllLocationHistory({
  startDate: weekAgo,
  limit: 10000
});
```

### Get User Statistics

```javascript
import { getUserLocationStats } from '@/lib/trackingService';

// Get stats for today
const today = new Date();
today.setHours(0, 0, 0, 0);

const stats = await getUserLocationStats(userId, today);

console.log(stats);
// {
//   totalPoints: 450,
//   distanceTraveled: 125.5, // km
//   averageSpeed: 45.2, // km/h
//   maxSpeed: 80.0, // km/h
//   duration: 180, // minutes
//   firstLocation: { coords: [9.5, -0.8], timestamp: '...' },
//   lastLocation: { coords: [9.4, -0.9], timestamp: '...' }
// }
```

## Data Structure

### location_history Table

```sql
{
  id: UUID,
  user_id: TEXT,
  user_name: TEXT,
  user_role: TEXT,
  latitude: DOUBLE,
  longitude: DOUBLE,
  accuracy: DOUBLE,
  heading: DOUBLE,
  speed: DOUBLE,
  timestamp: TIMESTAMP,
  created_at: TIMESTAMP
}
```

### Example Record

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "user_id": "user_abc123",
  "user_name": "John Doe",
  "user_role": "operator",
  "latitude": 9.4034,
  "longitude": -0.8424,
  "accuracy": 15.5,
  "heading": 180.0,
  "speed": 12.5,
  "timestamp": "2026-05-14T10:30:00Z",
  "created_at": "2026-05-14T10:30:00Z"
}
```

## Use Cases

### 1. **Track Field Worker Movements**
```javascript
// See where a worker went today
const history = await fetchUserLocationHistory(workerId, {
  startDate: new Date().setHours(0,0,0,0)
});

// Display on map as a route/trail
```

### 2. **Verify Incident Response**
```javascript
// Check if worker actually went to incident location
const incidentTime = new Date('2026-05-14T10:00:00Z');
const history = await fetchUserLocationHistory(workerId, {
  startDate: new Date(incidentTime - 3600000), // 1 hour before
  endDate: new Date(incidentTime + 3600000)    // 1 hour after
});

// Check if any position is near incident coordinates
```

### 3. **Generate Daily Reports**
```javascript
// Get stats for all workers today
const workers = await fetchFieldWorkers();
const reports = await Promise.all(
  workers.map(w => getUserLocationStats(w.id, new Date().setHours(0,0,0,0)))
);

// Show: distance traveled, time active, areas covered
```

### 4. **Analyze Coverage**
```javascript
// See which areas were visited this week
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);

const allHistory = await fetchAllLocationHistory({
  startDate: weekAgo
});

// Create heatmap of visited locations
```

## Performance Considerations

### Indexes
The following indexes are created for fast queries:
- `idx_location_history_user_id` - Fast user lookups
- `idx_location_history_timestamp` - Fast date range queries
- `idx_location_history_user_name` - Fast name searches

### Data Retention
By default, history is kept forever. To clean up old data:

```sql
-- Delete history older than 30 days
SELECT cleanup_old_location_history();

-- Or manually:
DELETE FROM location_history 
WHERE timestamp < NOW() - INTERVAL '30 days';
```

### Storage Estimates
- Each position: ~200 bytes
- 1 user, 8 hours/day, 6-second intervals: ~4,800 records/day
- 10 users, 30 days: ~1.4 million records (~280 MB)

## Privacy & Security

### Row Level Security (RLS)
- ✅ Everyone can view all location history
- ✅ Anyone can insert their own positions
- ✅ No one can delete history (audit trail)

### Data Access
```javascript
// All queries respect RLS policies
// Authenticated users can see all history
// Anonymous users can see all history
// Only admins can delete records (via SQL)
```

## Troubleshooting

### History Not Saving?
1. Check if table exists:
   ```sql
   SELECT * FROM location_history LIMIT 1;
   ```

2. Check if trigger is active:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'trigger_save_location_history';
   ```

3. Check console logs:
   ```
   ✅ Location saved to database (current + history)
   ```

### Slow Queries?
1. Ensure indexes exist
2. Limit date ranges
3. Use pagination for large results

## Next Steps

1. **Run the migration**: `add_user_info_to_history.sql`
2. **Test tracking**: Share location and check history table
3. **Build features**: Route replay, daily reports, coverage maps
4. **Set up cleanup**: Schedule old data deletion if needed

---

**Your location history system is now ready!** 🎉

Every GPS position is automatically saved and can be queried for analysis, reports, and historical tracking.
