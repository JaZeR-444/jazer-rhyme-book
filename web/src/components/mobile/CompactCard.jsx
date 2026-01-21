import React from "react";
import { motion } from "framer-motion";
import "./CompactCard.css";

export function CompactCard({ 
  title, 
  subtitle, 
  icon, 
  onClick, 
  badge,
  className = "",
  ariaLabel
}) {
  const isInteractive = typeof onClick === "function";

  const handleKeyDown = (event) => {
    if (!isInteractive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick(event);
    }
  };

  return (
    <motion.div
      className={`compact-card ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={isInteractive ? "button" : "group"}
      aria-label={ariaLabel || title}
      tabIndex={isInteractive ? 0 : undefined}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {badge && (
        <div className="compact-card-badge">
          {badge}
        </div>
      )}
      
      {icon && (
        <div className="compact-card-icon">
          {icon}
        </div>
      )}

      <div className="compact-card-content">
        <h3 className="compact-card-title">{title}</h3>
        {subtitle && (
          <p className="compact-card-subtitle">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
