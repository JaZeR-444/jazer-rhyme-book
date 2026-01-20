import React from "react";
import { motion } from "framer-motion";
import "./ResponsiveCard.css";

export const ResponsiveCard = ({ 
  children, 
  variant = "default",
  size = "auto",
  onClick,
  className = "",
  ...props 
}) => {
  return (
    <motion.div 
      className={`responsive-card responsive-card--${variant} responsive-card--${size} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};
