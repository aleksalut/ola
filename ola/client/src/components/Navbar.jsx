import { Link, NavLink } from "react-router-dom";
import { isAuthenticated, logout } from "../services/auth";

export default function Navbar() {
  return (
    <header className="bg-white border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-primary font-bold text-xl">Growth</Link>
        <nav className="flex items-center gap-4">
          {isAuthenticated() && (
            <>
              <NavLink to="/habits" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Habits</NavLink>
              <NavLink to="/goals" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Goals</NavLink>
              <NavLink to="/emotions" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Emotion Journal</NavLink>
              <button onClick={logout} className="btn outline">Logout</button>
            </>
          )}
          {!isAuthenticated() && (
            <>
              <NavLink to="/login" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Login</NavLink>
              <NavLink to="/register" className={({isActive})=>`hover:text-primary ${isActive?'text-primary':''}`}>Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
