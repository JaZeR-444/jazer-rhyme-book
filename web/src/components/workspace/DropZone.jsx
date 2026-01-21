import { useState, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { AlertCircle } from 'lucide-react';
import './DropZone.css';

/**
 * DropZone - HTML5 drop target for draggable items
 *
 * @param {string} id - Unique identifier for the drop zone
 * @param {string[]} acceptTypes - Array of drag types to accept (e.g., ['card', 'element'])
 * @param {function} onDrop - Callback when valid item is dropped
 * @param {function} onDragEnter - Callback when drag enters zone
 * @param {function} onDragLeave - Callback when drag leaves zone
 * @param {boolean} disabled - Disable dropping
 * @param {string} label - Accessible label for screen readers
 * @param {string} className - Additional CSS classes
 * @param {ReactNode} children - Content to render
 */
export function DropZone({
  id,
  acceptTypes = ['card'],
  onDrop: onDropProp,
  onDragEnter: onDragEnterProp,
  onDragLeave: onDragLeaveProp,
  disabled = false,
  label = 'Drop zone',
  className = '',
  children,
  ...props
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCount, setDragCount] = useState(0);
  const zoneRef = useRef(null);
  const { setNodeRef, isOver } = useDroppable({
    id: id || label,
    disabled,
    data: {
      id,
      acceptTypes,
      onDrop: onDropProp,
    },
  });

  const handleDragEnter = (event) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    setDragCount(prev => prev + 1);

    // Validate drag types
    const draggedTypes = Array.from(event.dataTransfer.types);
    const hasValidType =
      draggedTypes.includes('text/plain') ||
      draggedTypes.includes('application/json');

    if (hasValidType && dragCount === 0) {
      setIsDragOver(true);
      onDragEnterProp?.({ id });
    }
  };

  const handleDragOver = (event) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    // Indicate that we can drop here
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (event) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    setDragCount(prev => {
      const newCount = Math.max(0, prev - 1);
      if (newCount === 0) {
        setIsDragOver(false);
        onDragLeaveProp?.({ id });
      }
      return newCount;
    });
  };

  const handleDrop = (event) => {
    if (disabled) return;

    event.preventDefault();
    event.stopPropagation();

    setIsDragOver(false);
    setDragCount(0);

    try {
      // Try to get JSON data first (more detailed)
      let dragData = null;

      if (event.dataTransfer.types.includes('application/json')) {
        try {
          dragData = JSON.parse(event.dataTransfer.getData('application/json'));
        } catch (e) {
          console.warn('Invalid JSON in drag data:', e);
        }
      }

      // Fall back to text data
      if (!dragData && event.dataTransfer.types.includes('text/plain')) {
        const id = event.dataTransfer.getData('text/plain');
        dragData = { id, type: 'card' };
      }

      if (!dragData) {
        console.warn('No valid drag data received');
        return;
      }

      // Validate drag type
      if (!acceptTypes.includes(dragData.type)) {
        console.warn(
          `Invalid drag type: ${dragData.type}. Accepted types: ${acceptTypes.join(', ')}`
        );
        return;
      }

      // Call handler with drag data
      onDropProp?.({ ...dragData, dropZoneId: id });
    } catch (error) {
      console.error('Drop handler error:', error);
    }
  };

  return (
    <div
      ref={(node) => {
        zoneRef.current = node;
        setNodeRef(node);
      }}
      id={id}
      className={`drop-zone ${isDragOver || isOver ? 'is-drag-over' : ''} ${
        disabled ? 'is-disabled' : ''
      } ${className}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label={label}
      aria-disabled={disabled}
      aria-dropeffect={disabled ? 'none' : 'move'}
      {...props}
    >
      {isDragOver && !disabled && (
        <div className="drop-zone__overlay" aria-hidden="true">
          <div className="drop-zone__indicator">
            <AlertCircle size={24} />
            <span>Drop here to add</span>
          </div>
        </div>
      )}
      <div className="drop-zone__content">{children}</div>
    </div>
  );
}
