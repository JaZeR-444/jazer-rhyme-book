import PropTypes from 'prop-types';
import { DndContext } from '@dnd-kit/core';

/**
 * DragDropProvider - Wraps @dnd-kit/core with a simple type-aware drop router
 */
export function DragDropProvider({ children }) {
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    const dragData = active.data?.current;
    const dropData = over.data?.current;
    if (!dragData || !dropData) return;

    const { type } = dragData;
    const { acceptTypes, onDrop, id } = dropData;

    if (acceptTypes && !acceptTypes.includes(type)) {
      return;
    }

    onDrop?.({
      ...dragData,
      dropZoneId: id,
    });
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
}

DragDropProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DragDropProvider;
