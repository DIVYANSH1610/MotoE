import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, User, LockKeyhole } from "lucide-react";
import { getCsrf, loginUser } from "../services/authApi";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await getCsrf();
      const res = await loginUser(form);
      console.log("Login success:", res.data);
      window.location.href = "/";
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(err.response?.data?.error || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb--one"></div>
      <div className="auth-orb auth-orb--two"></div>
      <div className="auth-orb auth-orb--three"></div>

      <div className="auth-shell">
        <div className="auth-info-card">
          <span className="auth-badge">Race Garage Access</span>
          <h1>Welcome back to AutoIntel Garage</h1>
          <p>
            Sign in to access your premium garage tools, saved activity, protected
            AI features, and your personalized automotive console.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <ShieldCheck size={18} />
              <div>
                <strong>Protected Experience</strong>
                <span>Secure session-based access to your private features.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <User size={18} />
              <div>
                <strong>Personal Dashboard</strong>
                <span>Review your stats, saved items, and recent activity.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <LockKeyhole size={18} />
              <div>
                <strong>Premium Garage Control</strong>
                <span>Access AI tools and future user-linked car experiences.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-card">
          <div className="auth-form-head">
            <p className="auth-form-kicker">Authentication</p>
            <h2>Login</h2>
            <p>Enter your credentials to continue into the garage.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Username</label>
              <input
                name="username"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;