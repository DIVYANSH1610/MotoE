import { motion } from "framer-motion";
import Hero360Viewer from "./Hero360Viewer";
import "./HeroSection.css";

function HeroSection({ onExplore }) {
  return (
    <section className="motoe-hero">
      <div className="hero-overlay" />
      <div className="hero-noise" />
      <div className="hero-light light-one" />
      <div className="hero-light light-two" />

      {/* ── TOP NAV ─────────────────────────────────── */}
      <motion.div
        className="hero-topbar"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="hero-wordmark">
          Moto<span>E</span>
        </div>
        <div className="hero-nav-tag">Premium Automotive</div>
      </motion.div>

      {/* ── 360 VIEWER — fills entire section ───────── */}
      <div className="hero-visual-block">
        <div className="hero-car-glow" />
        <Hero360Viewer
          totalFrames={240}
          filePrefix="ezgif-frame-"
          fileExtension="jpg"
          autoRotate={true}
        />
      </div>

      {/* ── DRAG HINT — appears then auto-fades ─────── */}
      <div className="hero-drag-hint">
        <div className="hero-drag-circle">
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14M5 12l4-4M5 12l4 4" />
            <path d="M19 12l-4-4M19 12l-4 4" />
          </svg>
        </div>
        <span className="hero-drag-label">Drag to rotate</span>
      </div>

      {/* ── BOTTOM HUD ──────────────────────────────── */}
      <div className="hero-content-wrapper">

        {/* LEFT — title + CTA */}
        <motion.div
          className="hero-text-block"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        >
          <p className="hero-badge">Premium Automotive Experience</p>

          <h1 className="hero-title">
            The Garage of
            <span>Excellence</span>
          </h1>

          <p className="hero-description">
            Iconic machines, real performance data, and AI-powered insights — all in one cinematic garage experience.
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              className="hero-btn primary-btn"
              onClick={onExplore}
            >
              Explore Cars
            </button>
          </div>
        </motion.div>

        {/* RIGHT — stat cards */}
        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
        >
          <div className="hero-stat-card">
            <h3>Detailed Profiles</h3>
            <p>Performance, design, and legacy explored in depth.</p>
          </div>
          <div className="hero-stat-card">
            <h3>Smart Garage</h3>
            <p>Curated excellence with immersive 360° visuals.</p>
          </div>
          <div className="hero-stat-card">
            <h3>AI Insights</h3>
            <p>Ask anything about any car in the collection.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default HeroSection;