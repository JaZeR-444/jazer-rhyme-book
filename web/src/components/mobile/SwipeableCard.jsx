import React, { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import "./SwipeableCard.css";

export const SwipeableCard = ({ 
  children, 
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 100,
  className = "",
  ...props 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    const { offset } = info;

    if (Math.abs(offset.x) > threshold) {
      if (offset.x > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (offset.x < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    if (Math.abs(offset.y) > threshold) {
      if (offset.y > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (offset.y < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }
  };

  return (
    <motion.div 
      className={`swipeable-card ${isDragging ? 'swipeable-card--dragging' : ''} ${className}`}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, opacity }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
      
      {isDragging && (
        <div className="swipeable-card__indicators">
          <motion.div 
            className="swipeable-card__indicator swipeable-card__indicator--left"
            style={{ opacity: useTransform(x, [-threshold, 0], [1, 0]) }}
          >
            ←
          </motion.div>
          <motion.div 
            className="swipeable-card__indicator swipeable-card__indicator--right"
            style={{ opacity: useTransform(x, [0, threshold], [0, 1]) }}
          >
            →
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};
