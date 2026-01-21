/**
 * BottomSheet.jsx
 * Mobile bottom sheet modal component
 */

import React, { useState, useEffect, useRef, useId } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { createFocusTrap } from '../../lib/accessibility';
import { useScrollLock } from '../../contexts/ScrollLockProvider';
import './BottomSheet.css';

export default function BottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  snapPoints = ['30%', '60%', '90%'],
  initialSnap = 1,
  title = '',
  showHandle = true,
}) {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  const titleId = useId();
  const { lock, unlock } = useScrollLock();

  useEffect(() => {
    if (isOpen) {
      lock();
    } else {
      unlock();
    }

    return () => {
      if (isOpen) unlock();
    };
  }, [isOpen, lock, unlock]);

  useEffect(() => {
    if (!isOpen || !sheetRef.current) return undefined;
    const cleanup = createFocusTrap(sheetRef.current);
    sheetRef.current.focus();
    return cleanup;
  }, [isOpen]);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    currentY.current = startY.current;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    currentY.current = e.touches[0].clientY;
    const deltaY = currentY.current - startY.current;
    
    // Only allow downward dragging
    if (deltaY > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const deltaY = currentY.current - startY.current;
    
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
    }

    // If dragged down more than 100px, close
    if (deltaY > 100) {
      onClose();
    } else if (deltaY > 50 && currentSnap < snapPoints.length - 1) {
      // Snap to lower position
      setCurrentSnap(currentSnap + 1);
    } else if (deltaY < -50 && currentSnap > 0) {
      // Snap to higher position
      setCurrentSnap(currentSnap - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bottom-sheet">
      <div 
        className="bottom-sheet__backdrop" 
        onClick={onClose}
        aria-label="Close bottom sheet"
      />
      <div 
        ref={sheetRef}
        className={`bottom-sheet__content ${isDragging ? 'bottom-sheet__content--dragging' : ''}`}
        style={{ height: snapPoints[currentSnap] }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Bottom sheet'}
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        {showHandle && (
          <div className="bottom-sheet__header">
            <div className="bottom-sheet__handle" />
          </div>
        )}

        {title && (
          <div className="bottom-sheet__title-bar">
            <h2 className="bottom-sheet__title" id={titleId}>{title}</h2>
            <button 
              onClick={onClose}
              className="bottom-sheet__close"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="bottom-sheet__body">
          {children}
        </div>
      </div>
    </div>
  );
}

BottomSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  snapPoints: PropTypes.arrayOf(PropTypes.string),
  initialSnap: PropTypes.number,
  title: PropTypes.string,
  showHandle: PropTypes.bool
};
