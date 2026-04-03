import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Sparkles, UserPlus, ArrowRight } from "lucide-react";
import { getCsrf, registerUser } from "../services/authApi";
import "./Auth.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
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
      await registerUser(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
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
          <span className="auth-badge">Create your identity</span>
          <h1>Join the AutoIntel race garage</h1>
          <p>
            Register your account to unlock a personalized automotive experience,
            protected tools, AI-based features, and a scalable full-stack profile.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <UserPlus size={18} />
              <div>
                <strong>Create your profile</strong>
                <span>Build your identity inside your full-stack car platform.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <ShieldCheck size={18} />
              <div>
                <strong>Protected access</strong>
                <span>Only authenticated users can enter advanced user tools.</span>
              </div>
            </div>

            <div className="auth-feature-item">
              <Sparkles size={18} />
              <div>
                <strong>Scalable foundation</strong>
                <span>Ready for favorites, reviews, personal garage tools, and more.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-card">
          <div className="auth-form-head">
            <p className="auth-form-kicker">Authentication</p>
            <h2>Register</h2>
            <p>Create your account to start your premium garage journey.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label>Username</label>
              <input
                name="username"
                type="text"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="auth-input-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="auth-input-group">
              <label>Confirm Password</label>
              <input
                name="confirm_password"
                type="password"
                placeholder="Confirm your password"
                value={form.confirm_password}
                onChange={handleChange}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating account..." : "Register"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;