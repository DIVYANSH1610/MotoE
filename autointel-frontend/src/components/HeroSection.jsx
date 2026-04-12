import { motion } from "framer-motion";
import "./HeroSection.css";

function HeroSection({ featuredCar, onExplore }) {
  return (
    <section className="motoe-hero">
      <div className="hero-overlay"></div>
      <div className="hero-noise"></div>

      <div className="hero-light light-one"></div>
      <div className="hero-light light-two"></div>
      <div className="hero-light light-three"></div>

      <div className="hero-content-wrapper">
        <motion.div
          className="hero-text-block"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="hero-badge">Premium Automotive Experience</p>

          <h1 className="hero-title">
            Enter the Garage of
            <span> Automotive Excellence</span>
          </h1>

          <p className="hero-description">
            Discover iconic machines, compare legends, and unlock AI-powered
            automotive insights through a premium digital garage experience.
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

          <div className="hero-stats">
            <div className="hero-stat-card">
              <h3>Detailed Profiles</h3>
              <p>Explore performance, design, and legacy in depth.</p>
            </div>

            <div className="hero-stat-card">
              <h3>Smart Garage</h3>
              <p>Browse curated automotive excellence with immersive visuals.</p>
            </div>

            <div className="hero-stat-card">
              <h3>AI Insights</h3>
              <p>Ask intelligent questions about cars and features.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual-block"
          initial={{ opacity: 0, scale: 1.04, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="hero-car-glow"></div>

          {featuredCar?.heroImage ? (
            <img
              src={featuredCar.heroImage}
              alt={featuredCar?.car_name || "MotoE Garage featured car"}
              className="hero-car-image"
            />
          ) : (
            <div className="hero-image-placeholder">No featured image available</div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
