import { motion } from "framer-motion";
import "./PremiumSectionHeader.css";

function PremiumSectionHeader({ kicker, title, subtitle, align = "left" }) {
  return (
    <motion.div
      className={`premium-section-header premium-section-header--${align}`}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {kicker && <p className="premium-section-kicker">{kicker}</p>}
      <h2>{title}</h2>
      {subtitle && <p className="premium-section-subtitle">{subtitle}</p>}
    </motion.div>
  );
}

export default PremiumSectionHeader;