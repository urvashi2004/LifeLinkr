import { useNavigate } from "react-router-dom";
import { useState } from "react";

import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert('All fields required');
      return;
    }
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', data.fullName); // Store full name from backend response
      navigate('/dashboard');
    } else {
      alert('Invalid login details');
    }
  };

  return (
    <div className="login-container" style={{ position: 'relative', width: '100%' }}>
      <img
        src="/vite.svg"
        alt="Logo"
        style={{ position: 'absolute', top: 24, left: 24, width: 48, height: 48 }}
      />
      <h1 style={{ marginTop: 0, marginBottom: 8, fontWeight: 700, fontSize: '2rem' }}>Login Page</h1>
      <h2 className="login-title">Admin Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="forgot-password-btn"
            onClick={() => alert('Forgot password functionality coming soon!')}
          >
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
}