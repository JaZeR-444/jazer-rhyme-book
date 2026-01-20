import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';

const ITEM_TYPE = 'WORKSPACE_ITEM';

export const DraggableCard = ({ item, children, className = '' }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag}
      className={className}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};
