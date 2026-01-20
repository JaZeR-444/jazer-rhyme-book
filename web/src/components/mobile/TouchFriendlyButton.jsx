import React from "react";
import { motion } from "framer-motion";
import "./TouchFriendlyButton.css";

export const TouchFriendlyButton = ({ 
  children, 
  variant = "primary",
  size = "medium",
  icon,
  onClick,
  disabled = false,
  className = "",
  ...props 
}) => {
  return (
    <motion.button 
      className={`touch-friendly-btn touch-friendly-btn--${variant} touch-friendly-btn--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {icon && <span className="touch-friendly-btn__icon">{icon}</span>}
      <span className="touch-friendly-btn__text">{children}</span>
    </motion.button>
  );
};
