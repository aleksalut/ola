import { Navigate } from "react-router-dom";
import { isAuthenticated, hasRole } from "../services/auth";

export default function ProtectedRoute({ children, requiredRole }) {
  if (!isAuthenticated()) return <Navigate to="/login" />;
  
  // If a specific role is required, check if user has it
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" />;
  }
  
  return children;
}
