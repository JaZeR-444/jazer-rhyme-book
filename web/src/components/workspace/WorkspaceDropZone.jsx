import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import './WorkspaceDropZone.css';

/**
 * WorkspaceDropZone - Drop zone for adding items to workspace
 */
export function WorkspaceDropZone({ children, onDrop, acceptTypes = ['word', 'entity', 'domain'], className = '' }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'workspace-drop-zone',
    data: { accepts: acceptTypes }
  });

  return (
    <div
      ref={setNodeRef}
      className={`workspace-drop-zone ${isOver ? 'is-over' : ''} ${className}`}
    >
      {children || (
        <div className="workspace-drop-zone__placeholder">
          <Plus size={24} />
          <p>Drag items here to add to workspace</p>
        </div>
      )}
      {isOver && (
        <div className="workspace-drop-zone__overlay">
          <div className="workspace-drop-zone__indicator">
            <Plus size={32} />
            <span>Drop to add</span>
          </div>
        </div>
      )}
    </div>
  );
}
