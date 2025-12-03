import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/auth";
import Card from "../../components/Card";
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
      // login service stores token
      nav("/habits");
    } catch (err) {
      setError(err?.response?.data?.error || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome back</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">Sign in to continue tracking your habits</p>
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex items-center justify-between">
            <Link to="/register" className="text-sm text-gray-500 hover:text-primary">Don't have an account?</Link>
            <Button type="submit" className="ml-2" disabled={loading}>{loading? 'Loading...' : 'Sign in'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
