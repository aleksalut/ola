# ?? Quick Start - Access Your Reports Dashboard

## Current Status
? **Frontend is RUNNING** on `http://localhost:5173`  
?? **Backend is PAUSED** (debugger active)

---

## ?? Steps to Access Reports Dashboard

### Option 1: Resume Backend (Recommended)
1. In Visual Studio, click **Continue (F5)** or the ?? play button
2. The backend will resume at `http://localhost:5257`
3. Open browser: `http://localhost:5173`
4. Login with your credentials
5. Click **"Reports"** in the navigation bar

### Option 2: Restart Backend
1. In Visual Studio, click **Stop Debugging** (Shift+F5)
2. Click **Start** (F5) to restart
3. Open browser: `http://localhost:5173`
4. Login and navigate to Reports

---

## ?? URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5257 |
| Reports Dashboard | http://localhost:5173/reports |
| API Statistics | http://localhost:5257/api/reports/my-statistics |

---

## ?? Demo User Credentials

If you have the demo user set up:
- **Email**: `demo@example.com`
- **Password**: `Demo1234!`

---

## ?? What You'll See

Once you access `/reports`, you'll get:

### 8 Statistics Cards
- ?? Total Habits
- ?? Total Goals
- ? Completed Goals
- ?? Completion Rate
- ?? In Progress Goals
- ?? Not Started Goals
- ?? Emotion Entries
- ? Average Progress

### 2 Interactive Charts
1. **Habit Progress History**
   - Line chart showing daily progress
   - Dropdown to select different habits
   
2. **Emotion Trends (Last 30 Days)**
   - Multi-line chart with 5 emotions:
     - Anxiety (Red)
     - Calmness (Green)
     - Joy (Yellow)
     - Anger (Dark Red)
     - Boredom (Gray)

### Quick Insights
- Success Rate
- Active Items
- Journal Entries

---

## ?? Troubleshooting

### "401 Unauthorized" Error
- You're not logged in
- **Solution**: Navigate to `/login` and sign in

### "No data available" in Charts
- You haven't created habits/goals/emotions yet
- **Solution**: Create some test data first:
  - Go to `/habits` ? Create a habit
  - Go to `/goals` ? Create a goal
  - Go to `/emotions` ? Create an emotion entry

### Backend Connection Failed
- Backend is not running or paused
- **Solution**: Resume or restart the debugger in Visual Studio

### Charts Not Rendering
- Check browser console (F12) for errors
- Ensure chart.js packages are installed
- **Solution**: Run `npm install` in `ola/client` folder

---

## ?? Mobile/Responsive View

The dashboard is **fully responsive**:
- Mobile: 1 column layout
- Tablet: 2 columns
- Desktop: 4 columns for stats, 2 for charts

---

## ?? Navigation

The **Reports** link appears in the navbar when you're logged in:

```
Growth | Habits | Goals | Emotion Journal | Reports | Logout
```

---

## ? Quick Action Commands

### Restart Frontend
```powershell
cd ola/client
npm run dev
```

### Restart Backend
Press **F5** in Visual Studio

### Check if Services are Running
```powershell
# Check frontend
curl http://localhost:5173

# Check backend
curl http://localhost:5257/api/habits
```

---

## ?? Test the Reports API Directly

Once backend is running, test in browser or Postman:

```
GET http://localhost:5257/api/reports/my-statistics
GET http://localhost:5257/api/reports/completion-rate
GET http://localhost:5257/api/reports/emotion-trends?days=30
GET http://localhost:5257/api/reports/habit-progress/1
```

*Note: You need to be authenticated (include JWT token in Authorization header)*

---

## ? Verification Checklist

Before accessing Reports:
- [ ] Backend is running (not paused)
- [ ] Frontend is running on port 5173
- [ ] You're logged in to the application
- [ ] You have created at least one habit/goal/emotion

---

## ?? Ready to Go!

1. **Resume the debugger** in Visual Studio (F5)
2. **Open browser**: http://localhost:5173
3. **Login**
4. **Click "Reports"** in the navbar
5. **Enjoy your dashboard!** ??

---

## ?? Need Help?

If something isn't working:
1. Check Visual Studio Output window for errors
2. Check browser console (F12) for errors
3. Verify JWT token in localStorage (Application tab)
4. Check Network tab for failed API requests

**The Reports Dashboard is ready to use!** ??
