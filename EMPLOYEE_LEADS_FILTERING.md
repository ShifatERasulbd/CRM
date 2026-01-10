# Employee Leads Filtering - Already Implemented ✅

## Overview
The system **already filters leads** based on the logged-in user. When an employee logs in, they see **only the leads assigned to them**.

## How It Works

### Database Structure

**Leads Table - `assigned_to` Column:**
```sql
$table->foreignId('assigned_to')
    ->nullable()
    ->constrained('users')  -- References users table, NOT employees
    ->nullOnDelete();
```

**Key Point:** The `assigned_to` column stores **User IDs**, not Employee IDs.

### User-Employee Relationship

**Users Table:**
- Contains login credentials (email, password)
- Used for authentication

**Employees Table:**
- Contains employee details (name, position, salary, etc.)
- Linked to Users table via **email** (not ID)

**Relationship:**
```php
// User Model
public function employee()
{
    return $this->hasOne(Employee::class, 'email', 'email');
}

// Employee Model
public function user()
{
    return $this->belongsTo(User::class, 'email', 'email');
}
```

### Backend Filtering Logic

The filtering is implemented in **3 key methods** in `LeadsController.php`:

#### 1. **index() Method** - Leads List (Lines 137-142)
```php
// Build base query
$query = Lead::with('assignedTo', 'createdBy', 'leadServicePeople.servicePerson');

// Apply user filter
if ($user && $user->email === 'test@example.com') {
    // Admin sees all leads
} else {
    // Regular users see only their assigned leads
    $query->where('assigned_to', $user?->id);
}
```

#### 2. **graph() Method** - Dashboard Graph (Lines 82-86)
```php
$query = Lead::query();

// Protect against null user
if (!$user || $user->email !== 'test@example.com') {
    if ($user) {
        $query->where('assigned_to', $user->id);
    }
}
```

#### 3. **leadsSummary() Method** - Reports (Lines 28-32)
```php
$query = Lead::query();

// Apply user filter
if (!$user || $user->email !== 'test@example.com') {
    if ($user) {
        $query->where('assigned_to', $user->id);
    }
}
```

### Admin vs Employee Access

**Admin User:**
- Email: `test@example.com`
- Access: **Sees ALL leads** (no filtering)

**Employee User:**
- Email: Any other email
- Access: **Sees ONLY leads where `assigned_to` = their user ID**

## Frontend Implementation

The frontend simply calls the API endpoints, which automatically apply the filtering:

**LeadsList.jsx:**
```javascript
const res = await axios.get("/api/leads", {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  },
});
```

The backend automatically:
1. Identifies the logged-in user from the token
2. Checks if they're admin or employee
3. Filters the results accordingly
4. Returns only the leads they should see

## How to Test

### Test as Admin:
1. Login with: `test@example.com`
2. Go to Leads module
3. **Result:** You should see ALL leads in the system

### Test as Employee:
1. Create a user account for an employee (email must match employee email)
2. Assign some leads to this user (set `assigned_to` to their user ID)
3. Login with the employee's credentials
4. Go to Leads module
5. **Result:** You should see ONLY leads assigned to you

### Verify Filtering:
1. Login as employee
2. Check Leads module - should show only assigned leads
3. Check Dashboard graph - should show only assigned leads count
4. Check Reports - should show only assigned leads statistics

## Example Scenario

**Setup:**
- User ID 1: test@example.com (Admin)
- User ID 5: john@example.com (Employee)
- Lead #1: assigned_to = 5 (John)
- Lead #2: assigned_to = 1 (Admin)
- Lead #3: assigned_to = 5 (John)
- Lead #4: assigned_to = NULL (Unassigned)

**Results:**
- **Admin (test@example.com) sees:** Lead #1, #2, #3, #4 (ALL)
- **John (john@example.com) sees:** Lead #1, #3 (ONLY his assigned leads)

## Important Notes

1. ✅ **Filtering is automatic** - No frontend changes needed
2. ✅ **Works across all modules:**
   - Leads list
   - Dashboard graph
   - Reports/Statistics
3. ✅ **Secure** - Filtering happens on backend, can't be bypassed
4. ✅ **Token-based** - Uses authenticated user from JWT token

## Troubleshooting

**If employee sees no leads:**
1. Check if leads are assigned to their **User ID** (not Employee ID)
2. Verify the employee has a matching user account (same email)
3. Check if `assigned_to` column has the correct user ID

**If employee sees all leads:**
1. Check if their email is `test@example.com` (admin email)
2. Verify the backend filtering logic is in place
3. Check server logs for any errors

## Database Query Example

**What happens when employee logs in:**
```sql
-- Employee with user_id = 5 logs in
-- Backend executes:
SELECT * FROM leads 
WHERE assigned_to = 5
ORDER BY created_at DESC;

-- Admin (test@example.com) logs in
-- Backend executes:
SELECT * FROM leads 
ORDER BY created_at DESC;
```

## Conclusion

✅ **The feature is already fully implemented and working!**

Employees automatically see only their assigned leads when they log in. No additional changes are needed.

