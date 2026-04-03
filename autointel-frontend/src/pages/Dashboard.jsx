import { useEffect, useState } from "react";
import {
  User,
  Mail,
  CalendarDays,
  Clock3,
  Heart,
  BadgeCheck,
  CarFront,
  GitCompareArrows,
  Sparkles,
  Activity,
} from "lucide-react";
import { getDashboard } from "../services/authApi";
import TyreLoader from "../components/TyreLoader";
import "./Dashboard.css";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return (
      <div className="dashboard-loading">
        <TyreLoader label="Loading dashboard..." />
      </div>
    );
  }

  const user = data.user;
  const firstLetter = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <div className="dashboard-page">
      <div className="dashboard-bg dashboard-bg-1"></div>
      <div className="dashboard-bg dashboard-bg-2"></div>
      <div className="dashboard-bg dashboard-bg-3"></div>

      <div className="dashboard-wrapper">
        <section className="dashboard-hero">
          <div className="dashboard-avatar-wrap">
            <div className="dashboard-avatar">{firstLetter}</div>
            <div className="dashboard-avatar-ring"></div>
          </div>

          <div className="dashboard-hero-text">
            <p className="dashboard-label">Race Garage Profile Console</p>
            <h1>Welcome back, {user.username}</h1>
            <p>
              Manage your identity, review your platform activity, and stay connected
              to your premium automotive experience from one unified dashboard.
            </p>

            <div className="dashboard-hero-badges">
              <span>Premium Garage Access</span>
              <span>Secure Session Active</span>
              <span>Automotive Profile</span>
            </div>
          </div>
        </section>

        <section className="dashboard-overview-strip">
          <div className="dashboard-overview-card">
            <Heart size={18} />
            <div>
              <span>Saved Cars</span>
              <strong>{data.stats.saved_cars}</strong>
            </div>
          </div>

          <div className="dashboard-overview-card">
            <BadgeCheck size={18} />
            <div>
              <span>Favorite Brands</span>
              <strong>{data.stats.favorite_brands}</strong>
            </div>
          </div>

          <div className="dashboard-overview-card">
            <CarFront size={18} />
            <div>
              <span>Garage Items</span>
              <strong>{data.stats.garage_items}</strong>
            </div>
          </div>

          <div className="dashboard-overview-card">
            <GitCompareArrows size={18} />
            <div>
              <span>Comparisons</span>
              <strong>{data.stats.comparisons}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <h2>
                <User size={18} />
                Account Info
              </h2>
            </div>

            <div className="dashboard-info-list">
              <div className="dashboard-info-row">
                <span>
                  <User size={15} />
                  Username
                </span>
                <strong>{user.username}</strong>
              </div>

              <div className="dashboard-info-row">
                <span>
                  <Mail size={15} />
                  Email
                </span>
                <strong>{user.email}</strong>
              </div>

              <div className="dashboard-info-row">
                <span>
                  <CalendarDays size={15} />
                  Date Joined
                </span>
                <strong>{new Date(user.date_joined).toLocaleString()}</strong>
              </div>

              <div className="dashboard-info-row">
                <span>
                  <Clock3 size={15} />
                  Last Login
                </span>
                <strong>
                  {user.last_login ? new Date(user.last_login).toLocaleString() : "N/A"}
                </strong>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <h2>
                <Sparkles size={18} />
                Platform Stats
              </h2>
            </div>

            <div className="dashboard-stats-grid">
              <div className="dashboard-stat-box">
                <span>Saved Cars</span>
                <strong>{data.stats.saved_cars}</strong>
              </div>
              <div className="dashboard-stat-box">
                <span>Favorite Brands</span>
                <strong>{data.stats.favorite_brands}</strong>
              </div>
              <div className="dashboard-stat-box">
                <span>Garage Items</span>
                <strong>{data.stats.garage_items}</strong>
              </div>
              <div className="dashboard-stat-box">
                <span>Comparisons</span>
                <strong>{data.stats.comparisons}</strong>
              </div>
            </div>
          </div>

          <div className="dashboard-card dashboard-card-full">
            <div className="dashboard-card-head">
              <h2>
                <Activity size={18} />
                Recent Activity
              </h2>
            </div>

            {data.recent_activity?.length ? (
              <ul className="dashboard-activity-list">
                {data.recent_activity.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <div className="dashboard-empty-state">
                <p>No recent activity available yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;