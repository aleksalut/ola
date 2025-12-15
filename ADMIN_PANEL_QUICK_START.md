# ?? Admin Panel - Quick Start Guide

## ? Get Started in 3 Steps

### Step 1: Start the Application
```bash
# Make sure both backend and frontend are running

# Backend (from project root)
cd ola
dotnet run

# Frontend (in a new terminal)
cd ola/client
npm start
```

---

### Step 2: Login as Admin
1. Open [OPEN_ADMIN_PANEL.html](OPEN_ADMIN_PANEL.html) in your browser
2. Click **"Login Page"** button
3. Use demo admin credentials:
   - **Email:** `demo@example.com`
   - **Password:** `Demo123!`

---

### Step 3: Access Admin Panel
After logging in, you'll see **"Admin"** link in the navigation bar (only visible to admins).

**Direct Link:** http://localhost:5173/admin/users

---

## ?? What You'll See

### Admin Users Table
| ID | Email | Username | First Name | Last Name |
|----|-------|----------|------------|-----------|
| User data from database... |

- **Loading State:** "Loading users..." message while fetching
- **Error State:** Error message with retry button if request fails
- **Empty State:** "No users found" if no users exist
- **User Count:** Total users displayed below table

---

## ?? Security Features

### Role-Based Access Control
? **Admin users:** Can access `/admin/users` and see admin link in navbar  
? **Regular users:** Cannot access admin panel (redirected to home)  
? **Non-authenticated:** Redirected to login page

### How It Works
1. **Login** ? JWT token with roles issued
2. **Token Decoded** ? Roles extracted and stored in localStorage
3. **Route Protection** ? `ProtectedRoute` checks `requiredRole="Admin"`
4. **UI Elements** ? Navbar conditionally shows admin link

---

## ?? Testing Scenarios

### Test 1: Admin Access ?
1. Login as `demo@example.com`
2. Should see "Admin" link in navbar
3. Click "Admin" ? Should load user table
4. Table should display all users

### Test 2: Non-Admin Access ?
1. Register a new user (no admin role)
2. Login with new user
3. Should NOT see "Admin" link in navbar
4. Navigate to `/admin/users` directly
5. Should redirect to home page (`/`)

### Test 3: Unauthenticated Access ?
1. Logout if logged in
2. Navigate to `/admin/users` directly
3. Should redirect to login page

### Test 4: Role Persistence ?
1. Login as admin
2. Navigate to admin panel
3. Refresh the page
4. Should remain on admin panel
5. Admin link should still be visible

---

## ?? Implementation Files

### Frontend Files Created/Modified
```
ola/client/src/
??? pages/
?   ??? Admin/
?       ??? AdminUsers.jsx          ? NEW: Admin user management page
??? components/
?   ??? ProtectedRoute.jsx          ? MODIFIED: Added role checking
?   ??? Navbar.jsx                  ? MODIFIED: Added admin link
??? services/
?   ??? auth.js                     ? MODIFIED: Added JWT decoding & roles
??? App.jsx                         ? MODIFIED: Added admin route
```

### Backend Files (Already Existing)
```
ola/
??? Controllers/
    ??? AdminController.cs          ? Provides GET /api/admin/users
```

---

## ?? UI Components Used

### AdminUsers Page Structure
```
Container (py-8)
  ??? Heading: "Admin Panel – User Management"
  ??? Card
      ??? Table (responsive, alternating rows)
      ?   ??? Header: ID, Email, Username, First Name, Last Name
      ?   ??? Body: User rows
      ??? Footer: Total users count
```

### Styling Features
- ? Tailwind CSS for all styling
- ? Responsive table with horizontal scroll
- ? Alternating row colors (white/gray-50)
- ? Hover effects on rows
- ? Professional table headers
- ? Loading spinner/message
- ? Error message styling
- ? Card component for consistent UI

---

## ?? Developer Guide

### Adding More Admin Features

#### 1. Create New Admin Page
```jsx
// ola/client/src/pages/Admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import api from "../../services/api";
import Card from "../../components/Card";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    const res = await api.get("/api/admin/dashboard");
    setData(res.data);
  };
  
  return (
    <div className="container py-8">
      <h1>Admin Dashboard</h1>
      {/* Your admin content */}
    </div>
  );
}
```

#### 2. Add Route with Protection
```jsx
// In App.jsx
import AdminDashboard from "./pages/Admin/AdminDashboard";

<Route path="/admin/dashboard" element={
  <ProtectedRoute requiredRole="Admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

#### 3. Add Navigation Link
```jsx
// In Navbar.jsx
{user?.roles?.includes("Admin") && (
  <>
    <NavLink to="/admin/users">Users</NavLink>
    <NavLink to="/admin/dashboard">Dashboard</NavLink>
  </>
)}
```

---

## ?? Troubleshooting

### Admin Link Not Showing
**Problem:** Logged in as admin but no "Admin" link  
**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Logout and login again
3. Check browser console for errors
4. Verify JWT token has admin role

### Cannot Access Admin Panel
**Problem:** Accessing `/admin/users` redirects to home  
**Solution:**
1. Check if user has "Admin" role
2. Verify `localStorage.getItem('user')` contains roles
3. Check backend: User should have "Admin" role in database
4. Verify JWT token includes role claim

### Users Not Loading
**Problem:** "Failed to load users" error  
**Solution:**
1. Check backend is running (port 5257)
2. Verify `/api/admin/users` endpoint works in Swagger
3. Check browser console for CORS errors
4. Verify user is authenticated (has valid token)
5. Check user has "Admin" role

### 401 Unauthorized Error
**Problem:** API returns 401 when accessing admin endpoint  
**Solution:**
1. Login again (token may have expired)
2. Check token is in localStorage
3. Verify token is sent in Authorization header
4. Check backend logs for authentication errors

---

## ?? API Endpoint

### GET /api/admin/users
**Authorization:** Required (Admin role)  
**Description:** Returns list of all users

**Response:**
```json
[
  {
    "id": "user-id-123",
    "email": "demo@example.com",
    "userName": "demo@example.com",
    "firstName": "Demo",
    "lastName": "User",
    "fullName": "Demo User",
    "emailConfirmed": false
  }
]
```

---

## ? Verification Checklist

Before testing, ensure:

- [ ] Backend is running on port 5257
- [ ] Frontend is running on port 5173
- [ ] Database has users (run demo seed if needed)
- [ ] Demo user has "Admin" role assigned
- [ ] No compilation errors in terminal
- [ ] Browser console shows no errors

---

## ?? Success Indicators

You'll know it's working when:

1. ? Login as admin ? See "Admin" link in navbar
2. ? Click "Admin" ? Navigate to `/admin/users`
3. ? Table loads with user data
4. ? All columns display correctly
5. ? Alternating row colors visible
6. ? User count shows at bottom
7. ? Login as regular user ? No "Admin" link
8. ? Regular user tries `/admin/users` ? Redirects to home

---

## ?? Need Help?

Check these resources:
1. **Full Documentation:** [ADMIN_PANEL_COMPLETE.md](ADMIN_PANEL_COMPLETE.md)
2. **Quick Access:** [OPEN_ADMIN_PANEL.html](OPEN_ADMIN_PANEL.html)
3. **Backend API:** http://localhost:5257/swagger (when running)
4. **Frontend:** http://localhost:5173

---

## ?? You're All Set!

The Admin Panel is fully implemented and ready to use. Enjoy managing your users! ??
