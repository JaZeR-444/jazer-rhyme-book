# Sprint 4: Workspace Evolution 🔗

**Goal:** Transform the workspace into an interactive, visual knowledge graph with drag-and-drop and connection visualization.

**Estimated Time:** 11 hours  
**Priority:** High  
**Dependencies:** d3-force, react-beautiful-dnd (or similar)

---

## 🎯 Objectives

### Core Features:
1. **Drag-and-Drop Interface** - Add items to workspace via drag
2. **Visual Graph** - Force-directed graph showing connections
3. **Item Cards** - Enhanced workspace item cards
4. **Connection Lines** - Visual links between related items
5. **Export/Import** - Save and restore workspace state

---

## 📦 Components to Build

### 1. WorkspaceGraph (Force-Directed Visualization)
**File:** `web/src/components/workspace/WorkspaceGraph.jsx`

**Features:**
- D3 force-directed graph layout
- Nodes for words, entities, domains
- Dynamic edges based on relationships
- Interactive pan/zoom
- Node click to focus
- Color-coded by type
- Smooth animations

**API:**
```jsx
<WorkspaceGraph
  items={workspaceItems}
  onNodeClick={handleNodeClick}
  onNodeRemove={handleNodeRemove}
  width={600}
  height={400}
/>
```

---

### 2. DraggableItem (Drag Source)
**File:** `web/src/components/workspace/DraggableItem.jsx`

**Features:**
- Drag handle indicator
- Preview while dragging
- Snap-back animation if dropped outside
- Visual feedback on drag start
- Touch support for mobile

**API:**
```jsx
<DraggableItem
  type="word"
  data={wordData}
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
>
  <WordCard word={wordData} />
</DraggableItem>
```

---

### 3. WorkspaceDropZone (Drop Target)
**File:** `web/src/components/workspace/WorkspaceDropZone.jsx`

**Features:**
- Visual highlight on drag-over
- Accepts multiple item types
- Prevents duplicates (optional)
- Drop animation
- Accessible

**API:**
```jsx
<WorkspaceDropZone
  onDrop={handleAddToWorkspace}
  acceptTypes={['word', 'entity', 'domain']}
  showPreview
>
  {children}
</WorkspaceDropZone>
```

---

### 4. WorkspaceItemCard (Enhanced Item Display)
**File:** `web/src/components/workspace/WorkspaceItemCard.jsx`

**Features:**
- Compact card design
- Type indicator (icon + color)
- Quick actions (remove, pin, export)
- Connection count badge
- Hover preview
- Glassmorphism styling

**API:**
```jsx
<WorkspaceItemCard
  item={workspaceItem}
  connections={relatedItems}
  onRemove={handleRemove}
  onPin={handlePin}
  isPinned={isPinned}
/>
```

---

### 5. WorkspaceDrawer (Enhanced Drawer)
**File:** `web/src/components/workspace/WorkspaceDrawer.jsx` (Enhance existing)

**Features:**
- Toggle between list/graph view
- Drag-to-reorder items
- Group by type
- Export workspace (JSON)
- Import workspace
- Clear all with confirmation
- Search/filter items

**API:**
```jsx
<WorkspaceDrawer
  isOpen={isOpen}
  onClose={handleClose}
  items={workspaceItems}
  viewMode="graph" // or "list"
  onViewModeChange={setViewMode}
/>
```

---

### 6. ConnectionsPanel (Relationships Display)
**File:** `web/src/components/workspace/ConnectionsPanel.jsx`

**Features:**
- Show related items for selected node
- Connection strength indicator
- Quick navigation
- Add new connections manually
- Relationship type labels

**API:**
```jsx
<ConnectionsPanel
  selectedItem={currentItem}
  connections={relatedItems}
  onConnectionClick={handleConnectionClick}
  onAddConnection={handleAddConnection}
/>
```

---

## 🎨 Visual Design

### Graph Styling:
- **Nodes:**
  - Words: Cyan circle (#00CED1)
  - Entities: Purple circle (#5D3FD3)
  - Domains: Magenta circle (#FF00FF)
  - Radius based on importance/connections
  - Glow effect on hover
  - Label below node

- **Edges:**
  - Thin white lines (opacity 0.2)
  - Thicker on hover (opacity 0.6)
  - Animated flow effect (optional)
  - Curved paths for readability

### Drag States:
- **Dragging:** Semi-transparent clone follows cursor
- **Valid Drop:** Green border glow on drop zone
- **Invalid Drop:** Red border pulse
- **Drop Success:** Scale-in animation

---

## 📊 Data Structure

### Workspace Item:
```typescript
interface WorkspaceItem {
  id: string;
  type: 'word' | 'entity' | 'domain';
  data: any; // Original word/entity/domain data
  addedAt: timestamp;
  isPinned: boolean;
  position?: { x: number, y: number }; // For graph
  connections: string[]; // IDs of related items
}
```

### Graph Node:
```typescript
interface GraphNode {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  vx: number; // Velocity for physics
  vy: number;
  connections: number; // Count for sizing
}
```

### Graph Edge:
```typescript
interface GraphEdge {
  source: string; // Node ID
  target: string; // Node ID
  strength: number; // 0-1
  type?: string; // Relationship type
}
```

---

## 🔧 Implementation Plan

### Phase 1: Drag & Drop (3 hours)
1. Install/setup drag-and-drop library (react-dnd or native)
2. Create `DraggableItem` component
3. Create `WorkspaceDropZone` component
4. Integrate with existing workspace context
5. Add visual feedback states
6. Test with word cards

### Phase 2: Graph Visualization (4 hours)
1. Install d3-force
2. Create `WorkspaceGraph` component
3. Build force simulation logic
4. Add node rendering with SVG
5. Add edge rendering
6. Implement pan/zoom
7. Add click interactions
8. Style nodes by type

### Phase 3: Enhanced UI (2 hours)
1. Build `WorkspaceItemCard` component
2. Build `ConnectionsPanel` component
3. Enhance `WorkspaceDrawer` with view toggle
4. Add export/import functionality
5. Add search/filter

### Phase 4: Polish & Integration (2 hours)
1. Add animations
2. Mobile optimization
3. Accessibility improvements
4. Error handling
5. Performance optimization
6. Documentation

---

## 🚀 Dependencies

### New Packages:
```json
{
  "d3-force": "^3.0.0",
  "d3-selection": "^3.0.0",
  "d3-drag": "^3.0.0",
  "d3-zoom": "^3.0.0"
}
```

### Optional (for easier DnD):
```json
{
  "@dnd-kit/core": "^6.0.0",
  "@dnd-kit/utilities": "^3.2.0"
}
```

---

## ✅ Acceptance Criteria

1. ✅ Users can drag word/entity/domain cards to workspace
2. ✅ Workspace shows both list and graph views
3. ✅ Graph displays connections between related items
4. ✅ Nodes are color-coded by type
5. ✅ Graph is interactive (pan, zoom, click)
6. ✅ Items can be removed from workspace
7. ✅ Workspace state persists in localStorage
8. ✅ Export/import workspace as JSON
9. ✅ Mobile-friendly with touch support
10. ✅ Accessible keyboard navigation

---

## 🧪 Testing Strategy

### Unit Tests:
- Drag-and-drop event handling
- Graph node calculations
- Connection detection
- Export/import functions

### Integration Tests:
- Add item to workspace via drag
- Graph updates when items added/removed
- View toggle switches correctly
- Persistence works across sessions

### Visual Tests:
- Graph renders correctly
- Animations are smooth
- Responsive on mobile
- Accessibility keyboard nav

---

## 📈 Success Metrics

- **Interaction Time:** Users spend 30%+ more time in workspace
- **Item Count:** Average workspace has 5+ items
- **Graph Usage:** 60%+ of users toggle to graph view
- **Return Rate:** 70%+ of users return to saved workspace
- **Performance:** Graph renders in <100ms for 20 nodes

---

## 🔮 Future Enhancements

- Auto-suggest related items to add
- Collaborative workspaces (multi-user)
- Workspace templates
- AI-generated connections
- Export to mind-map formats
- Share workspace via URL
- 3D graph view
- Timeline view of workspace history

---

## 📝 Notes

### Graph Layout Algorithm:
Using D3's force-directed layout with:
- **Charge:** Repulsion between nodes (-300)
- **Link:** Attraction between connected nodes (1)
- **Center:** Pull toward canvas center (0.5)
- **Collision:** Prevent node overlap

### Performance Optimization:
- Limit graph to 50 nodes max
- Use canvas for large graphs (>30 nodes)
- Debounce force simulation
- Lazy-load graph view
- Memoize node calculations

### Accessibility:
- Keyboard shortcuts for add/remove
- Screen reader announces workspace changes
- Focus management in graph
- ARIA labels for nodes/edges
- High contrast mode support

---

**Sprint 4 Start:** 2026-01-20  
**Target Completion:** 11 hours  
**Status:** 🚀 STARTING
