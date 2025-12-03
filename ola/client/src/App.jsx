import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { validateCurrentUser } from "./services/api";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import HabitsList from "./pages/Habits/HabitsList";
import HabitCreate from "./pages/Habits/HabitCreate";
import HabitEdit from "./pages/Habits/HabitEdit";
import HabitDetails from "./pages/Habits/HabitDetails";
import GoalsList from "./pages/Goals/GoalsList";
import GoalCreate from "./pages/Goals/GoalCreate";
import GoalEdit from "./pages/Goals/GoalEdit";
import GoalDetails from "./pages/Goals/GoalDetails";
import GoalProgress from "./pages/Goals/GoalProgress";
import EmotionList from "./pages/Emotions/EmotionList";
import EmotionCreate from "./pages/Emotions/EmotionCreate";
import EmotionEdit from "./pages/Emotions/EmotionEdit";
import EmotionDetails from "./pages/Emotions/EmotionDetails";
import AddProgress from "./pages/Progress/AddProgress";
import Home from "./pages/Home";

export default function App() {
  useEffect(()=>{ validateCurrentUser(); },[]);
  return (
    <BrowserRouter>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/habits" element={<ProtectedRoute><HabitsList /></ProtectedRoute>} />
          <Route path="/habits/create" element={<ProtectedRoute><HabitCreate /></ProtectedRoute>} />
          <Route path="/habits/:id" element={<ProtectedRoute><HabitDetails /></ProtectedRoute>} />
          <Route path="/habits/:id/edit" element={<ProtectedRoute><HabitEdit /></ProtectedRoute>} />
          <Route path="/habits/:id/progress" element={<ProtectedRoute><AddProgress /></ProtectedRoute>} />

          <Route path="/goals" element={<ProtectedRoute><GoalsList /></ProtectedRoute>} />
          <Route path="/goals/create" element={<ProtectedRoute><GoalCreate /></ProtectedRoute>} />
          <Route path="/goals/:id" element={<ProtectedRoute><GoalDetails /></ProtectedRoute>} />
          <Route path="/goals/:id/edit" element={<ProtectedRoute><GoalEdit /></ProtectedRoute>} />
          <Route path="/goals/:id/progress" element={<ProtectedRoute><GoalProgress /></ProtectedRoute>} />

          <Route path="/emotions" element={<ProtectedRoute><EmotionList /></ProtectedRoute>} />
          <Route path="/emotions/create" element={<ProtectedRoute><EmotionCreate /></ProtectedRoute>} />
          <Route path="/emotions/:id" element={<ProtectedRoute><EmotionDetails /></ProtectedRoute>} />
          <Route path="/emotions/:id/edit" element={<ProtectedRoute><EmotionEdit /></ProtectedRoute>} />

          <Route path="/" element={<Home />} />
          <Route path="*" element={<div className="container">Nie znaleziono strony</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
