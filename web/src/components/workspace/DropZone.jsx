import { useDrop } from 'react-dnd';
import { motion } from 'framer-motion';
import { useDndContext } from '../../contexts/DndContext';

const ITEM_TYPE = 'WORKSPACE_ITEM';

export const DropZone = ({ children, className = '' }) => {
  const { handleDrop } = useDndContext();

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ITEM_TYPE,
    drop: (item) => {
      handleDrop(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <motion.div
      ref={drop}
      className={`${className} ${isActive ? 'drop-active' : ''}`}
      animate={{
        borderColor: isActive ? '#00ff88' : 'rgba(255, 255, 255, 0.1)',
        backgroundColor: isActive ? 'rgba(0, 255, 136, 0.05)' : 'transparent',
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
      {isActive && (
        <motion.div
          className="drop-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            border: '2px dashed #00ff88',
            borderRadius: '12px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}
    </motion.div>
  );
};
