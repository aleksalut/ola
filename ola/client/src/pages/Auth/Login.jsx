import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/auth";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please provide email and password");
    setLoading(true);
    try {
      const res = await login(email, password);
      window.location.href = "/habits";
    } catch (err) {
      setError(err?.response?.data?.error || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 pt-16 pb-8">
      {/* Logo & Brand - Higher and Bigger */}
      <div className="text-center mb-4">
        <h1 className="text-7xl font-black text-pink-500 tracking-tight mb-2">
          Growth
        </h1>
        <p className="text-gray-400 text-lg">Personal Development Tracker</p>
      </div>
      
      {/* Inspirational Quote */}
      <div className="text-center mb-8 max-w-md">
        <p className="text-xl text-gray-600 font-light">
          No one else can do it for you.
        </p>
        <p className="text-xl text-blue-500 font-semibold">
          Only you can change your life.
        </p>
      </div>
      
      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Welcome back</h2>
        <p className="text-gray-500 text-center mb-6">Sign in to continue your journey</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-pink-500 font-semibold hover:text-pink-600">
              Create one
            </Link>
          </p>
        </div>
      </div>
      
      {/* Features at the bottom */}
      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm mb-4">What you'll find in the app</p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
          <span className="text-gray-500 font-medium">Habit Tracking</span>
          <span className="text-pink-300">•</span>
          <span className="text-gray-500 font-medium">Goal Setting</span>
          <span className="text-pink-300">•</span>
          <span className="text-gray-500 font-medium">Emotion Journal</span>
          <span className="text-pink-300">•</span>
          <span className="text-gray-500 font-medium">Progress Reports</span>
        </div>
      </div>
    </div>
  );
}
