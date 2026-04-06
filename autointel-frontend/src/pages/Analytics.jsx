import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  Zap,
  Gauge,
  ShieldCheck,
  Bot,
  Heart,
  GitCompareArrows,
  Server,
  Cpu,
  Activity,
  Globe,
  Lock,
} from "lucide-react";
import PremiumSectionHeader from "../components/PremiumSectionHeader";
import GlassCard from "../components/GlassCard";
import { getCars } from "../services/api";
import "./Analytics.css";

// ─── Mini Chart: animated horizontal bar ────────────────────────────────────
function HBar({ label, value, max, color = "#ff7a00", delay = 0 }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((value / max) * 100), 300 + delay);
    return () => clearTimeout(t);
  }, [value, max, delay]);

  return (
    <div className="an-hbar">
      <div className="an-hbar-label">{label}</div>
      <div className="an-hbar-track">
        <div
          className="an-hbar-fill"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
      <div className="an-hbar-val">{value}</div>
    </div>
  );
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ target, suffix = "", duration = 1400 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const steps = 50;
    const inc = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += inc;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

// ─── Radar-style polygon (pure SVG, no library) ─────────────────────────────
function RadarChart({ data, labels }) {
  const cx = 120,
    cy = 120,
    r = 90;
  const n = data.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const point = (val, i) => {
    const ratio = val / 10;
    return {
      x: cx + r * ratio * Math.cos(angle(i)),
      y: cy + r * ratio * Math.sin(angle(i)),
    };
  };

  const gridLevels = [2, 4, 6, 8, 10];
  const outerPoints = Array.from({ length: n }, (_, i) => point(10, i));

  const polyPts = data.map((v, i) => point(v, i));
  const polyStr = polyPts.map((p) => `${p.x},${p.y}`).join(" ");

  const outerStr = outerPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 240 240" className="an-radar-svg">
      {/* grid rings */}
      {gridLevels.map((lvl) => {
        const pts = Array.from({ length: n }, (_, i) => point(lvl, i));
        return (
          <polygon
            key={lvl}
            points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="0.5"
          />
        );
      })}
      {/* spokes */}
      {outerPoints.map((p, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={p.x}
          y2={p.y}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="0.5"
        />
      ))}
      {/* data polygon */}
      <polygon
        points={polyStr}
        fill="rgba(255,122,0,0.18)"
        stroke="#ff7a00"
        strokeWidth="1.5"
      />
      {/* data dots */}
      {polyPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#ff9b57" />
      ))}
      {/* labels */}
      {labels.map((lbl, i) => {
        const lp = point(11.5, i);
        return (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(255,255,255,0.62)"
            fontSize="9"
            fontFamily="Rajdhani, sans-serif"
          >
            {lbl}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
function Analytics() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCars()
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.cars || [];
        setCars(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── derive stats from real catalog ──────────────────────────────────────
  const fuelBreakdown = cars.reduce((acc, car) => {
    const f = car.fuel_type || "Unknown";
    acc[f] = (acc[f] || 0) + 1;
    return acc;
  }, {});

  const brandBreakdown = cars.reduce((acc, car) => {
    const b = car.company || "Other";
    acc[b] = (acc[b] || 0) + 1;
    return acc;
  }, {});

  const topBrands = Object.entries(brandBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const topFuels = Object.entries(fuelBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxBrand = topBrands[0]?.[1] || 1;
  const maxFuel = topFuels[0]?.[1] || 1;

  // ── static research metrics ──────────────────────────────────────────────
  const perfMetrics = [
    { label: "Requests/sec (SPA)", value: 275, max: 300, color: "#ff7a00" },
    {
      label: "Requests/sec (Server-rendered)",
      value: 100,
      max: 300,
      color: "#888",
    },
    { label: "Server CPU — SPA (%)", value: 65, max: 100, color: "#22c55e" },
    {
      label: "Server CPU — Baseline (%)",
      value: 95,
      max: 100,
      color: "#ef4444",
    },
    { label: "Time to Interactivity — SPA (%)", value: 37, max: 100, color: "#ff9b57" },
    { label: "Time to Interactivity — Baseline (%)", value: 100, max: 100, color: "#888" },
  ];

  const apiEndpoints = [
    { group: "Cars", method: "GET", path: "/api/cars/", auth: false, desc: "List all cars" },
    { group: "Cars", method: "GET", path: "/api/cars/<slug>/", auth: false, desc: "Car detail + Wikipedia" },
    { group: "Auth", method: "GET", path: "/api/cars/auth/csrf/", auth: false, desc: "CSRF token" },
    { group: "Auth", method: "POST", path: "/api/cars/auth/register/", auth: false, desc: "Register account" },
    { group: "Auth", method: "POST", path: "/api/cars/auth/login/", auth: false, desc: "Login" },
    { group: "Auth", method: "POST", path: "/api/cars/auth/logout/", auth: true, desc: "Logout" },
    { group: "Auth", method: "GET", path: "/api/cars/auth/session/", auth: false, desc: "Session check" },
    { group: "Auth", method: "GET", path: "/api/cars/auth/dashboard/", auth: true, desc: "User dashboard" },
    { group: "Favs", method: "GET", path: "/api/cars/favorites/", auth: true, desc: "List favourites" },
    { group: "Favs", method: "POST", path: "/api/cars/favorites/", auth: true, desc: "Add favourite" },
    { group: "Favs", method: "DEL", path: "/api/cars/favorites/<slug>/", auth: true, desc: "Remove favourite" },
    { group: "Favs", method: "GET", path: "/api/cars/favorites/status/<slug>/", auth: true, desc: "Status check" },
    { group: "AI", method: "POST", path: "/api/ai/garage/", auth: true, desc: "AI Garage Assistant" },
    { group: "AI", method: "POST", path: "/api/ai/used-car-advisor/", auth: true, desc: "Used Car Advisor" },
  ];

  const securityItems = [
    { label: "CSRF Protection", status: true, detail: "Pre-fetched token on every state-changing request via X-CSRFToken header" },
    { label: "Session Authentication", status: true, detail: "DRF SessionAuthentication — SESSION_COOKIE_HTTPONLY + SECURE in production" },
    { label: "CORS Locked", status: true, detail: "Restricted to localhost:5173 and moto-e.vercel.app with credentials enabled" },
    { label: "SameSite=None", status: true, detail: "Required for cross-origin cookie sharing between Vite dev and Django backend" },
    { label: "HTTPS Enforced", status: true, detail: "SECURE_PROXY_SSL_HEADER set for Render deployment, SSL redirect in prod" },
    { label: "Password Validation", status: true, detail: "Django built-in validators: min length, common password, numeric-only checks" },
  ];

  const radarLabels = ["Simplicity", "Caching", "Flexibility", "Speed", "Versioning", "Partial"];
  const restRadar = [9, 9, 4, 8, 4, 3];
  const gqlRadar = [5, 3, 9, 7, 9, 9];

  const techStack = [
    { icon: <Server size={16} />, label: "Django 5 + DRF", tag: "Backend" },
    { icon: <Globe size={16} />, label: "React 19 + Vite", tag: "Frontend" },
    { icon: <Cpu size={16} />, label: "Framer Motion", tag: "Animation" },
    { icon: <Bot size={16} />, label: "LLM AI Service", tag: "AI Module" },
    { icon: <Lock size={16} />, label: "Session + CSRF", tag: "Security" },
    { icon: <Activity size={16} />, label: "SQLite / Postgres", tag: "Database" },
  ];

  const groupColors = {
    Cars: "#ff7a00",
    Auth: "#f59e0b",
    Favs: "#22c55e",
    AI: "#a78bfa",
  };

  const methodColors = {
    GET: { bg: "rgba(34,197,94,0.14)", color: "#86efac" },
    POST: { bg: "rgba(59,130,246,0.14)", color: "#93c5fd" },
    DEL: { bg: "rgba(239,68,68,0.14)", color: "#fca5a5" },
  };

  return (
    <div className="analytics-page">
      <div className="analytics-bg analytics-bg-1" />
      <div className="analytics-bg analytics-bg-2" />
      <div className="analytics-bg analytics-bg-3" />

      <div className="analytics-wrapper">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <PremiumSectionHeader
            kicker="Research Paper Analytics"
            title="System Intelligence Report"
            subtitle="Live metrics, API coverage, security posture, and architectural analysis derived from the AutoIntel Garage platform — built to support IEEE research methodology."
          />
        </motion.div>

        {/* ── KPI Strip ── */}
        <motion.div
          className="an-kpi-strip"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {[
            { icon: <BarChart2 size={18} />, label: "API Endpoints", value: 14, suffix: "" },
            { icon: <Heart size={18} />, label: "DB Models", value: 1, suffix: "" },
            { icon: <Bot size={18} />, label: "AI Routes", value: 2, suffix: "" },
            { icon: <Zap size={18} />, label: "RPS Improvement", value: 175, suffix: "%" },
            { icon: <Gauge size={18} />, label: "CPU Reduction", value: 30, suffix: "pp" },
            { icon: <GitCompareArrows size={18} />, label: "Cars in Catalog", value: loading ? 0 : cars.length, suffix: "" },
          ].map((k, i) => (
            <div key={i} className="an-kpi-card">
              <div className="an-kpi-icon">{k.icon}</div>
              <div className="an-kpi-value">
                <Counter target={k.value} suffix={k.suffix} duration={1200} />
              </div>
              <div className="an-kpi-label">{k.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── Performance + Radar row ── */}
        <div className="an-row an-row--60-40">
          {/* Performance bars */}
          <GlassCard hover={false} delay={0.1}>
            <div className="an-card-head">
              <Activity size={18} />
              <h3>Performance Comparison (Paper Table 3)</h3>
            </div>
            <div className="an-perf-bars">
              {perfMetrics.map((m, i) => (
                <HBar
                  key={m.label}
                  label={m.label}
                  value={m.value}
                  max={m.max}
                  color={m.color}
                  delay={i * 80}
                />
              ))}
            </div>
            <div className="an-perf-note">
              React–Django SPA handles 2.5–3× more requests/sec vs server-rendered baseline
              (Apache JMeter, 500 concurrent users).
            </div>
          </GlassCard>

          {/* REST vs GraphQL radar */}
          <GlassCard hover={false} delay={0.15}>
            <div className="an-card-head">
              <Cpu size={18} />
              <h3>REST vs GraphQL (Paper Table 2)</h3>
            </div>
            <div className="an-radar-row">
              <div className="an-radar-block">
                <span className="an-radar-label an-radar-label--orange">REST</span>
                <RadarChart data={restRadar} labels={radarLabels} />
              </div>
              <div className="an-radar-block">
                <span className="an-radar-label an-radar-label--purple">GraphQL</span>
                <RadarChart data={gqlRadar} labels={radarLabels} />
              </div>
            </div>
            <div className="an-perf-note">
              AutoIntel uses REST — optimal for simple CRUD catalog + HTTP caching.
              GraphQL would benefit data-heavy dashboard views in future iterations.
            </div>
          </GlassCard>
        </div>

        {/* ── Live catalog stats row ── */}
        {!loading && cars.length > 0 && (
          <div className="an-row an-row--50-50">
            <GlassCard hover={false} delay={0.2}>
              <div className="an-card-head">
                <BarChart2 size={18} />
                <h3>Cars by Brand (Live Catalog)</h3>
              </div>
              <div className="an-bar-list">
                {topBrands.map(([brand, count], i) => (
                  <HBar
                    key={brand}
                    label={brand}
                    value={count}
                    max={maxBrand}
                    color={`hsl(${20 + i * 18}, 90%, 62%)`}
                    delay={i * 70}
                  />
                ))}
              </div>
            </GlassCard>

            <GlassCard hover={false} delay={0.22}>
              <div className="an-card-head">
                <Gauge size={18} />
                <h3>Cars by Fuel Type (Live Catalog)</h3>
              </div>
              <div className="an-bar-list">
                {topFuels.map(([fuel, count], i) => (
                  <HBar
                    key={fuel}
                    label={fuel}
                    value={count}
                    max={maxFuel}
                    color={i === 0 ? "#ff7a00" : i === 1 ? "#22c55e" : i === 2 ? "#a78bfa" : "#60a5fa"}
                    delay={i * 80}
                  />
                ))}
              </div>
              <div className="an-fuel-note">
                Dataset fetched live from <code>/api/cars/</code> — {cars.length} cars total.
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── API Endpoint Map ── */}
        <GlassCard hover={false} delay={0.25}>
          <div className="an-card-head">
            <Server size={18} />
            <h3>API Endpoint Coverage — {apiEndpoints.length} Endpoints</h3>
          </div>
          <div className="an-endpoint-table">
            <div className="an-ep-head">
              <span>Group</span>
              <span>Method</span>
              <span>Path</span>
              <span>Auth</span>
              <span>Description</span>
            </div>
            {apiEndpoints.map((ep, i) => (
              <motion.div
                key={i}
                className="an-ep-row"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.22, delay: i * 0.03 }}
              >
                <span
                  className="an-ep-group"
                  style={{ color: groupColors[ep.group] }}
                >
                  {ep.group}
                </span>
                <span
                  className="an-ep-method"
                  style={methodColors[ep.method]}
                >
                  {ep.method}
                </span>
                <code className="an-ep-path">{ep.path}</code>
                <span className={`an-ep-auth ${ep.auth ? "an-ep-auth--yes" : "an-ep-auth--no"}`}>
                  {ep.auth ? "Auth" : "Public"}
                </span>
                <span className="an-ep-desc">{ep.desc}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* ── Security + Tech Stack row ── */}
        <div className="an-row an-row--60-40">
          <GlassCard hover={false} delay={0.3}>
            <div className="an-card-head">
              <ShieldCheck size={18} />
              <h3>Security Posture</h3>
            </div>
            <div className="an-security-list">
              {securityItems.map((item, i) => (
                <motion.div
                  key={i}
                  className="an-security-item"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="an-security-dot an-security-dot--ok" />
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard hover={false} delay={0.32}>
            <div className="an-card-head">
              <Cpu size={18} />
              <h3>Tech Stack</h3>
            </div>
            <div className="an-tech-grid">
              {techStack.map((t, i) => (
                <div key={i} className="an-tech-card">
                  <div className="an-tech-icon">{t.icon}</div>
                  <div>
                    <strong>{t.label}</strong>
                    <span>{t.tag}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="an-arch-note">
              <div className="an-card-head" style={{ marginTop: 20 }}>
                <BarChart2 size={16} />
                <h3 style={{ fontSize: "0.96rem" }}>Data Architecture</h3>
              </div>
              <div className="an-arch-pills">
                <span className="an-pill an-pill--blue">JSON file → Car catalog</span>
                <span className="an-pill an-pill--green">SQLite/PG → Favorites only</span>
                <span className="an-pill an-pill--orange">Slug-based routing</span>
                <span className="an-pill an-pill--purple">AI as separate service layer</span>
                <span className="an-pill an-pill--red">No DB reads for catalog</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ── Framework comparison ── */}
        <GlassCard hover={false} delay={0.35}>
          <div className="an-card-head">
            <Zap size={18} />
            <h3>Frontend Framework Comparison (Paper Table 1)</h3>
          </div>
          <div className="an-fw-grid">
            {[
              {
                name: "Angular 20",
                reactivity: "Signals (zoneless)",
                perf: "~20–30% faster",
                curve: 4,
                used: false,
                use: "Enterprise / multi-team",
              },
              {
                name: "React 19.2",
                reactivity: "Virtual DOM + Compiler",
                perf: "Auto-batching, memoization",
                curve: 3,
                used: true,
                use: "General / mobile / this project",
              },
              {
                name: "Vue 3.5",
                reactivity: "Fine-grained + Vapor Mode",
                perf: "Bypasses virtual DOM",
                curve: 2,
                use: "Small–medium / rapid prototype",
                used: false,
              },
            ].map((fw, i) => (
              <div
                key={i}
                className={`an-fw-card ${fw.used ? "an-fw-card--active" : ""}`}
              >
                {fw.used && <span className="an-fw-badge">✓ Used in project</span>}
                <h4 className="an-fw-name">{fw.name}</h4>
                <div className="an-fw-row">
                  <span>Reactivity</span>
                  <strong>{fw.reactivity}</strong>
                </div>
                <div className="an-fw-row">
                  <span>Perf gain</span>
                  <strong>{fw.perf}</strong>
                </div>
                <div className="an-fw-row">
                  <span>Learning curve</span>
                  <div className="an-curve-dots">
                    {[1, 2, 3, 4, 5].map((d) => (
                      <div
                        key={d}
                        className={`an-curve-dot ${d <= fw.curve ? "an-curve-dot--on" : ""}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="an-fw-row">
                  <span>Best for</span>
                  <strong style={{ fontSize: "0.78rem" }}>{fw.use}</strong>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </div>
  );
}

export default Analytics;
