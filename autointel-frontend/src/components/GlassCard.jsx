import { motion } from "framer-motion";
import "./GlassCard.css";

function GlassCard({
  children,
  className = "",
  delay = 0,
  hover = true,
  padding = "default",
}) {
  return (
    <motion.div
      className={`glass-card glass-card--${padding} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -6 } : undefined}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  );
}

export default GlassCard;