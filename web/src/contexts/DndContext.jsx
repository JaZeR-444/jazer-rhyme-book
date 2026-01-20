import { createContext, useContext } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useWorkspace } from '../lib/WorkspaceContext';

const DndContext = createContext(null);

export const useDndContext = () => {
  const context = useContext(DndContext);
  if (!context) {
    throw new Error('useDndContext must be used within DndContextProvider');
  }
  return context;
};

export const DndContextProvider = ({ children }) => {
  const { addToWorkspace } = useWorkspace();

  const handleDrop = (item) => {
    addToWorkspace(item);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <DndContext.Provider value={{ handleDrop }}>
        {children}
      </DndContext.Provider>
    </DndProvider>
  );
};
