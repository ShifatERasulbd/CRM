# Reports Module Filter Fix

## Problem
The Reports module was not filtering the leads table according to the search criteria (From date, To date, and Status). The statistics were showing 0 for all values, and the table was showing all leads regardless of the filter settings.

## Root Cause
The issue had two parts:

1. **Backend API (`/api/leads`)**: The `LeadsController::index()` method didn't support filtering by date range or status. It only returned all leads or leads assigned to the user.

2. **Statistics API (`/api/reports/leads-summary`)**: The `leadsSummary()` method supported date filtering but not status filtering.

## Solution

### Backend Changes

#### 1. Updated `LeadsController::index()` method
**File**: `app/Http/Controllers/Api/LeadsController.php`

Added support for three filter parameters:
- `from` - Start date filter
- `to` - End date filter  
- `status` - Status filter

```php
public function index(Request $request)
{
    // Get filter parameters
    $from = $request->query('from');
    $to = $request->query('to');
    $status = $request->query('status');

    // Build base query
    $query = Lead::with('assignedTo', 'createdBy', 'leadServicePeople.servicePerson');

    // Apply user filter (admin vs regular user)
    if ($user && $user->email === 'test@example.com') {
        // Admin sees all leads
    } else {
        // Regular users see only their assigned leads
        $query->where('assigned_to', $user?->id);
    }

    // Apply date range filters
    if ($from) {
        $query->whereDate('created_at', '>=', $from);
    }
    if ($to) {
        $query->whereDate('created_at', '<=', $to);
    }

    // Apply status filter
    if ($status) {
        $query->where('status', $status);
    }

    $leads = $query->latest()->get();
}
```

#### 2. Updated `LeadsController::leadsSummary()` method
**File**: `app/Http/Controllers/Api/LeadsController.php`

Added status filtering support and fixed the conversion/loss logic:

```php
public function leadsSummary(Request $request)
{
    $from = $request->query('from');
    $to = $request->query('to');
    $status = $request->query('status');

    // Apply date range filters
    if ($from) {
        $query->whereDate('created_at', '>=', $from);
    }
    if ($to) {
        $query->whereDate('created_at', '<=', $to);
    }

    // Apply status filter
    if ($status) {
        $query->where('status', $status);
    }

    $total = (clone $query)->count();
    $converted = (clone $query)->where('status', 'customer')->count();
    $lost = (clone $query)->where('status', 'lost')->count();
}
```

**Key Change**: Changed from checking `is_converted` boolean to checking `status = 'customer'` for converted leads, which is more accurate.

### Frontend Changes

#### Updated `Reports.jsx`
**File**: `src/modules/Reports/Reports.jsx`

Added status parameter to the `fetchStats()` function:

```javascript
const fetchStats = async () => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  if (status) params.status = status;  // Added this line
  
  const res = await axios.get("/api/reports/leads-summary", { params });
  setStats(res.data);
};
```

Also added error logging for debugging:
```javascript
} catch (err) {
  console.error("Error fetching stats:", err);
  setError("Failed to fetch report stats.");
}
```

## How It Works Now

1. **User selects filters**: From date, To date, and/or Status
2. **User clicks "Filter" button**
3. **Frontend makes two API calls**:
   - `GET /api/reports/leads-summary?from=X&to=Y&status=Z` - Gets statistics
   - `GET /api/leads?from=X&to=Y&status=Z` - Gets filtered leads for table
4. **Backend applies filters** to both queries
5. **Results are synchronized**: Statistics match the table data

## Testing

After this fix:
1. ✅ Select a date range (From/To)
2. ✅ Select a status (or leave as "All Statuses")
3. ✅ Click "Filter"
4. ✅ Statistics update to show correct counts
5. ✅ Table shows only leads matching the filters
6. ✅ Conversion rate and loss rate calculate correctly

## Files Modified

1. **app/Http/Controllers/Api/LeadsController.php**
   - Updated `index()` method (lines 111-158)
   - Updated `leadsSummary()` method (lines 14-68)

2. **src/modules/Reports/Reports.jsx**
   - Updated `fetchStats()` function (lines 28-51)

3. **public/dashboard.html**
   - Updated build file references

## Build Process

```bash
npm run build
```

This generates new build files referenced in `public/dashboard.html`.

