import { motion } from "framer-motion";
import Hero360Viewer from "./Hero360Viewer";
import "./HeroSection.css";

function HeroSection({ onExplore }) {
  return (
    <section className="motoe-hero">

      {/* ── atmosphere ─────────────────────────── */}
      <div className="hero-bg-glow" />
      <div className="hero-vignette" />
      <div className="hero-scanlines" />

      {/* ── 360 viewer — full bleed background ── */}
      <Hero360Viewer
        totalFrames={240}
        filePrefix="ezgif-frame-"
        fileExtension="jpg"
        autoRotate={true}
      />

      {/* ── wordmark top-left ───────────────────── */}
      <motion.div
        className="hero-wordmark"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        MOTO<span>E</span>
      </motion.div>

      {/* ── drag hint — center, fades out ──────── */}
      <motion.div
        className="hero-drag-hint"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: [0, 1, 1, 0], y: [6, 0, 0, -6] }}
        transition={{ duration: 4.5, delay: 1.2, times: [0, 0.12, 0.75, 1] }}
      >
        <div className="hero-drag-ring">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 12h14" />
            <path d="M9 8l-4 4 4 4" />
            <path d="M15 8l4 4-4 4" />
          </svg>
        </div>
        <span className="hero-drag-label">drag to rotate</span>
      </motion.div>

      {/* ── explore button — bottom-right corner ─ */}
      <motion.button
        className="hero-explore-btn"
        type="button"
        onClick={onExplore}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
        <span>Explore Cars</span>
        <svg className="hero-explore-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </motion.button>

      {/* ── thin bottom progress bar while loading ─ */}
      <div className="hero-bottom-bar" />

    </section>
  );
}

export default HeroSection;