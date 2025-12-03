import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../services/auth";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function Register() {
  const nav = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!firstName || !lastName) return setError("Please provide first and last name");
    if (!email || !password) return setError("Please provide email and password");
    setLoading(true);
    try {
      await register({ firstName, lastName, email, password });
      nav('/login');
    } catch (err) {
      setError(err?.response?.data?.error || 'Registration failed');
    } finally { setLoading(false) }
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <h2 className="text-2xl font-bold mb-4 text-center">Create account</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">Start tracking your habits and goals</p>
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex items-center justify-between">
            <Link to="/login" className="text-sm text-gray-500 hover:text-primary">Already have an account?</Link>
            <Button type="submit" disabled={loading}>{loading? 'Creating...' : 'Sign up'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
