import { createContext, useContext, useState, useEffect } from 'react';

const WorkspaceContext = createContext();

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

export function WorkspaceProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('jazer_workspace_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('jazer_workspace_items', JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id && i.type === item.type)) {
        return prev;
      }
      return [...prev, { ...item, addedAt: Date.now() }];
    });
    setIsOpen(true);
  };

  const removeItem = (id, type) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  };

  const clearWorkspace = () => {
    setItems([]);
  };

  const toggleWorkspace = () => {
    setIsOpen(!isOpen);
  };

  const isPinned = (id, type) => {
    return items.some((i) => i.id === id && i.type === type);
  };

  return (
    <WorkspaceContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearWorkspace,
        isOpen,
        toggleWorkspace,
        isPinned
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
