import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { useWorkspace } from '../../lib/WorkspaceContext';
import { WorkspaceItemCard } from './WorkspaceItemCard';

/**
 * WorkspaceDndProvider - Provides drag-and-drop context for workspace
 */
export function WorkspaceDndProvider({ children }) {
  const { addItem } = useWorkspace();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8 // 8px movement before drag starts
      }
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Only handle drops on the workspace drop zone
    if (over && over.id === 'workspace-drop-zone') {
      const itemData = active.data.current;
      
      // Add to workspace
      addItem({
        id: itemData.id,
        type: itemData.type,
        title: itemData.title || itemData.word || itemData.name,
        subtitle: itemData.subtitle || itemData.description,
        link: itemData.link || `/${itemData.type}/${itemData.id}`
      });
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {children}
      <DragOverlay>
        {/* Optional: Show preview while dragging */}
      </DragOverlay>
    </DndContext>
  );
}
