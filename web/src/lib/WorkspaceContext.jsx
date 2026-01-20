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

  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem('jazer_workspace_sections');
    return saved ? JSON.parse(saved) : [
      { id: 'general', name: 'General', color: '#6366f1' },
      { id: 'verse-1', name: 'Verse 1', color: '#8b5cf6' },
      { id: 'hook', name: 'Hook', color: '#ec4899' },
      { id: 'verse-2', name: 'Verse 2', color: '#f97316' },
      { id: 'bridge', name: 'Bridge', color: '#14b8a6' }
    ];
  });

  const [isOpen, setIsOpen] = useState(false);

  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('jazer_recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('jazer_workspace_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('jazer_recent_searches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('jazer_workspace_sections', JSON.stringify(sections));
  }, [sections]);

  const addItem = (item, sectionId = 'general') => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id && i.type === item.type)) {
        return prev;
      }
      return [...prev, {
        ...item,
        addedAt: Date.now(),
        sectionId,
        notes: ''
      }];
    });
    setIsOpen(true);
  };

  const removeItem = (id, type) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.type === type)));
  };

  const updateItemSection = (id, type, newSectionId) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.type === type
          ? { ...i, sectionId: newSectionId }
          : i
      )
    );
  };

  const updateItemNotes = (id, type, notes) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.type === type
          ? { ...i, notes }
          : i
      )
    );
  };

  const clearWorkspace = () => {
    setItems([]);
  };

  const clearSection = (sectionId) => {
    setItems((prev) => prev.filter((i) => i.sectionId !== sectionId));
  };

  const addSection = (name, color = '#6366f1') => {
    const id = name.toLowerCase().replace(/\s+/g, '-');
    setSections((prev) => [...prev, { id, name, color }]);
  };

  const removeSection = (sectionId) => {
    if (sectionId === 'general') return; // Can't remove general
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    // Move items from deleted section to general
    setItems((prev) =>
      prev.map((i) =>
        i.sectionId === sectionId
          ? { ...i, sectionId: 'general' }
          : i
      )
    );
  };

  const toggleWorkspace = () => {
    setIsOpen(!isOpen);
  };

  const isPinned = (id, type) => {
    return items.some((i) => i.id === id && i.type === type);
  };

  const addToRecent = (searchItem) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => !(item.id === searchItem.id && item.type === searchItem.type)
      );
      return [searchItem, ...filtered].slice(0, 20);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const exportWorkspace = () => {
    let text = '# JaZeR Verse Board Export\n\n';

    sections.forEach((section) => {
      const sectionItems = items.filter((i) => i.sectionId === section.id);
      if (sectionItems.length === 0) return;

      text += `## ${section.name}\n\n`;

      sectionItems.forEach((item) => {
        text += `### ${item.title}\n`;
        if (item.subtitle) text += `*${item.subtitle}*\n\n`;
        if (item.notes) text += `**Notes:** ${item.notes}\n\n`;
        text += `[View](${item.link})\n\n`;
        text += '---\n\n';
      });
    });

    return text;
  };

  return (
    <WorkspaceContext.Provider
      value={{
        items,
        sections,
        addItem,
        removeItem,
        updateItemSection,
        updateItemNotes,
        clearWorkspace,
        clearSection,
        addSection,
        removeSection,
        isOpen,
        toggleWorkspace,
        isPinned,
        exportWorkspace,
        recentSearches,
        addToRecent,
        clearRecentSearches
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
