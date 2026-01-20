import React from "react";
import { motion } from "framer-motion";
import "./MobileOptimizedGrid.css";

export const MobileOptimizedGrid = ({ 
  children, 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "1rem",
  className = "" 
}) => {
  return (
    <motion.div 
      className={`mobile-optimized-grid ${className}`}
      style={{
        '--grid-gap': gap,
        '--mobile-cols': columns.mobile,
        '--tablet-cols': columns.tablet,
        '--desktop-cols': columns.desktop
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};
