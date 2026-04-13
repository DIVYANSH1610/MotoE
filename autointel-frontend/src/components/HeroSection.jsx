import { motion } from "framer-motion";
import Hero360Viewer from "./Hero360Viewer";
import "./HeroSection.css";

function HeroSection({ onExplore }) {
  return (
    <section className="motoe-hero">

      <div className="hero-bg-glow" />
      <div className="hero-vignette" />
      <div className="hero-scanlines" />

      {/* full-bleed 360 viewer */}
      <Hero360Viewer
        totalFrames={240}
        filePrefix="ezgif-frame-"
        fileExtension="jpg"
        autoRotate={true}
      />

      {/* ── NAME — top center, glass pill ───────── */}
      <motion.div
        className="hero-name-badge"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
      </motion.div>

      {/* ── drag hint ───────────────────────────── */}
      <motion.div
        className="hero-drag-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 4.5, delay: 1.4, times: [0, 0.12, 0.75, 1] }}
      >
        <div className="hero-drag-ring">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 12h14" />
            <path d="M9 8l-4 4 4 4" />
            <path d="M15 8l4 4-4 4" />
          </svg>
        </div>
        <span className="hero-drag-label">drag to rotate</span>
      </motion.div>

      {/* ── explore button — bottom right ───────── */}
      <motion.button
        className="hero-explore-btn"
        type="button"
        onClick={onExplore}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <span>Explore Cars</span>
        <svg className="hero-explore-arrow" width="13" height="13"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.button>

      <div className="hero-bottom-bar" />

    </section>
  );
}

export default HeroSection;