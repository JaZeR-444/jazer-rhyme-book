import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import './DraggableItem.css';

/**
 * DraggableItem - Makes any content draggable to workspace
 */
export function DraggableItem({ id, type, data, children, showHandle = true }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `draggable-${type}-${id}`,
    data: {
      type,
      id,
      ...data
    }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return (
    <div
      ref={setNodeRef}
      className={`draggable-item ${isDragging ? 'is-dragging' : ''}`}
      style={style}
    >
      {showHandle && (
        <div className="draggable-item__handle" {...listeners} {...attributes}>
          <GripVertical size={16} />
        </div>
      )}
      <div className="draggable-item__content" {...(!showHandle && { ...listeners, ...attributes })}>
        {children}
      </div>
      {isDragging && (
        <div className="draggable-item__ghost">
          Dragging to workspace...
        </div>
      )}
    </div>
  );
}
