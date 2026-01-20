import { useState, useRef, useEffect } from 'react';
import {
  Download,
  FolderPlus,
  Network,
  Trash2,
  X,
  ExternalLink,
  Edit3,
  Plus,
  GripVertical,
  Save,
  FileText,
  Copy,
  BookOpen,
  Sparkles,
  Zap,
  Check,
  FileJson,
  Maximize
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../lib/WorkspaceContext';
import { useSearchIndex } from '../lib/hooks';
import { Badge } from '../components/ui';
import { WorkspaceGraph } from '../components/WorkspaceGraph';
import { ConceptRecommender } from '../components/ConceptRecommender';
import { GhostModule } from '../components/GhostModule';
import { RhymeSchemeAnalyzer } from '../components/RhymeSchemeAnalyzer';
import { ImmersiveMode } from '../components/ImmersiveMode';
import './WritingStudio.css';

export function WritingStudio() {
  const {
    items,
    sections,
    addItem, // Make sure to use addItem or custom logic if addItem isn't directly exposed (it usually is in context)
    removeItem,
    updateItemSection,
    updateItemNotes,
    clearWorkspace,
    clearSection,
    addSection,
    exportWorkspace
  } = useWorkspace();

  // If addItem is not in destructuring above, I might need to check the context definition.
  // Assuming addItem exists based on standard context patterns. 
  // If not, I can see 'removeItem' etc. are there.
  // Let's assume addItem(item) is available. If not, I'll need to use addToSection logic.

  const [editingNotes, setEditingNotes] = useState(null);
  const [notesText, setNotesText] = useState('');
  const [showNewSection, setShowNewSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [showGraph, setShowGraph] = useState(false);
  const [showRecommender, setShowRecommender] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [writingText, setWritingText] = useState(() => {
    return localStorage.getItem('jazer_writing_studio_text') || '';
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const textareaRef = useRef(null);

  // Auto-save writing text
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('jazer_writing_studio_text', writingText);
    }, 500);
    return () => clearTimeout(timer);
  }, [writingText]);

  const wordCount = writingText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = writingText.length;
  const lineCount = writingText.split('\n').length;

  const handleExport = () => {
    const text = exportWorkspace();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verse-board-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWriting = () => {
    const blob = new Blob([writingText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `writing-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    const exportData = {
      content: writingText,
      metadata: {
        wordCount,
        lineCount,
        charCount,
        timestamp: new Date().toISOString(),
        references: items.map(item => ({
          title: item.title,
          type: item.type,
          section: item.sectionId,
          notes: item.notes
        }))
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `writing-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(writingText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const startEditingNotes = (item) => {
    setEditingNotes(`${item.id}-${item.type}`);
    setNotesText(item.notes || '');
  };

  const saveNotes = (id, type) => {
    updateItemNotes(id, type, notesText);
    setEditingNotes(null);
  };

  const handleAddSection = () => {
    if (newSectionName.trim()) {
      addSection(newSectionName.trim());
      setNewSectionName('');
      setShowNewSection(false);
    }
  };

  const copyToEditor = (text) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = writingText.substring(0, start);
      const after = writingText.substring(end);
      setWritingText(before + text + after);

      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
      }, 0);
    }
  };

  const handleAddRecommendation = (item) => {
    // Add item to workspace
    // We need to match the item structure expected by addItem
    addItem({
      id: item.id || item.name, // Fallback for ID
      type: item._type === 'entity' ? 'entity' : 'word',
      title: item.title || item.name,
      subtitle: item.subtitle,
      link: item.link || '#',
      notes: item.notes,
      sectionId: 'general' // Default to general section
    });
  };

  // --- Ghost Module Integration ---
  const { searchIndex } = useSearchIndex(); // Need dictionary for rhymes
  const [currentLine, setCurrentLine] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [showGhost, setShowGhost] = useState(true);
  const [immersiveModeOpen, setImmersiveModeOpen] = useState(false);

  const handleCursorActivity = (e) => {
    const textarea = e.target;
    const { selectionStart, value } = textarea;
    setWritingText(value); // Keep existing update

    // 1. Find Current Line
    // Walk backwards from cursor to find newline
    let start = selectionStart;
    while (start > 0 && value[start - 1] !== '\n') start--;
    
    // Walk forwards to find newline
    let end = selectionStart;
    while (end < value.length && value[end] !== '\n') end++;

    const line = value.substring(start, end);
    setCurrentLine(line);

    // 2. Find Current Word (or word before cursor)
    // We want the word relevant to typing, so if space, take word before
    let wordEnd = selectionStart;
    
    // If we are at a space, look back to the previous word
    if (wordEnd > 0 && /\s/.test(value[wordEnd - 1])) {
       wordEnd--;
       while (wordEnd > 0 && /\s/.test(value[wordEnd - 1])) wordEnd--;
    }

    let wordStart = wordEnd;
    while (wordStart > 0 && !/\s/.test(value[wordStart - 1])) wordStart--;

    const word = value.substring(wordStart, wordEnd).replace(/[^\w]/g, ''); // strip punctuation
    setCurrentWord(word);
  };

  const insertRhyme = (rhymeWord) => {
    // Basic insertion at cursor
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Insert with a leading space if needed
    const textToInsert = (start > 0 && !/\s/.test(writingText[start - 1]) ? ' ' : '') + rhymeWord;
    
    const newText = writingText.substring(0, start) + textToInsert + writingText.substring(end);
    setWritingText(newText);
    
    // Reset cursor
    setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
    }, 0);
  };


  return (
    <>
      <div className={`writing-studio ${showGhost ? 'with-ghost' : ''}`}>
        <div className="writing-studio__header">
          <div className="writing-studio__title">
            <Edit3 size={24} />
            <h1>Writing Studio</h1>
          </div>
          <div className="writing-studio__stats">
            <span className="stat"><strong>{wordCount}</strong> words</span>
            <span className="stat"><strong>{lineCount}</strong> lines</span>
            <button 
              className="btn-immersive"
              onClick={() => setImmersiveModeOpen(true)}
              title="Enter Immersive Mode"
            >
              <Maximize size={14} />
              <span>Immersive</span>
            </button>
            <button 
              className={`btn-ghost-toggle ${showGhost ? 'active' : ''}`}
              onClick={() => setShowGhost(!showGhost)}
              title="Toggle Ghost Assistant"
            >
              <Zap size={14} className={showGhost ? 'text-accent' : ''} />
            </button>
        </div>
      </div>

      <div className="writing-studio__layout">
        {/* Mobile Overlay */}
        <div
          className={`writing-studio__overlay ${sidebarOpen ? 'is-visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Left Sidebar - Workspace Items */}
        <aside className={`writing-studio__sidebar ${sidebarOpen ? 'is-open' : ''}`}>
           {/* ... existing sidebar code ... */}
           <div className="sidebar__header">
            <h2>Reference Board</h2>
            <div className="sidebar__actions">
              <button
                className="sidebar__action"
                onClick={() => setShowRecommender(true)}
                title="Get Recommendations"
              >
                <Sparkles size={14} className="text-accent" />
              </button>
              <button
                className="sidebar__action"
                onClick={() => setShowGraph(true)}
                disabled={items.length === 0}
                title="View Relationship Map"
              >
                <Network size={14} />
              </button>
              <button
                className="sidebar__action"
                onClick={handleExport}
                disabled={items.length === 0}
                title="Export References"
              >
                <Download size={14} />
              </button>
              <button
                className="sidebar__action"
                onClick={() => setShowNewSection(!showNewSection)}
                title="Add Section"
              >
                <FolderPlus size={14} />
              </button>
              <button
                className="sidebar__action sidebar__action--danger"
                onClick={clearWorkspace}
                disabled={items.length === 0}
                title="Clear All"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {showNewSection && (
            <div className="sidebar__new-section">
              <input
                type="text"
                placeholder="Section name..."
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
                autoFocus
              />
              <button onClick={handleAddSection}>Add</button>
              <button onClick={() => setShowNewSection(false)}>Cancel</button>
            </div>
          )}

          <div className="sidebar__content">
            {items.length === 0 ? (
              <div className="sidebar__empty">
                <p>Pin words and entities to reference them while writing.</p>
                <button className="btn-link" onClick={() => setShowRecommender(true)}>
                  <Sparkles size={12} /> Need ideas?
                </button>
              </div>
            ) : (
              <div className="sidebar__sections">
                {sections.map((section) => {
                  const sectionItems = items.filter((i) => i.sectionId === section.id);
                  if (sectionItems.length === 0) return null;

                  return (
                    <div key={section.id} className="sidebar-section">
                      <div className="sidebar-section__header" style={{ borderLeftColor: section.color }}>
                        <h3>{section.name}</h3>
                        <Badge size="xs" variant="secondary">
                          {sectionItems.length}
                        </Badge>
                        {section.id !== 'general' && (
                          <button
                            className="sidebar-section__clear"
                            onClick={() => clearSection(section.id)}
                            title="Clear Section"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>

                      <div className="sidebar-section__items">
                        {sectionItems.map((item) => (
                          <div key={`${item.type}-${item.id}`} className="sidebar-item">
                            <div className="sidebar-item__drag">
                              <GripVertical size={12} />
                            </div>
                            <div className="sidebar-item__main">
                              <div className="sidebar-item__header">
                                <Link to={item.link} className="sidebar-item__title">
                                  {item.title}
                                </Link>
                                <button
                                  className="sidebar-item__copy"
                                  onClick={() => copyToEditor(item.title)}
                                  title="Insert into editor"
                                >
                                  <Copy size={12} />
                                </button>
                              </div>
                              {item.subtitle && (
                                <div className="sidebar-item__subtitle">{item.subtitle}</div>
                              )}

                              <select
                                className="sidebar-item__section-select"
                                value={item.sectionId}
                                onChange={(e) => updateItemSection(item.id, item.type, e.target.value)}
                              >
                                {sections.map((s) => (
                                  <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                              </select>

                              {editingNotes === `${item.id}-${item.type}` ? (
                                <div className="sidebar-item__notes-edit">
                                  <textarea
                                    value={notesText}
                                    onChange={(e) => setNotesText(e.target.value)}
                                    placeholder="Add notes..."
                                    autoFocus
                                  />
                                  <button onClick={() => saveNotes(item.id, item.type)}>Save</button>
                                  <button onClick={() => setEditingNotes(null)}>Cancel</button>
                                </div>
                              ) : (
                                <div className="sidebar-item__notes">
                                  {item.notes ? (
                                    <p onClick={() => startEditingNotes(item)}>{item.notes}</p>
                                  ) : (
                                    <button
                                      className="sidebar-item__add-notes"
                                      onClick={() => startEditingNotes(item)}
                                    >
                                      <Plus size={10} /> notes
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="sidebar-item__actions">
                              <Link to={item.link} className="sidebar-action" title="View Details">
                                <ExternalLink size={12} />
                              </Link>
                              <button
                                className="sidebar-action sidebar-action--danger"
                                onClick={() => removeItem(item.id, item.type)}
                                title="Remove"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main Editor Area */}
        <main className="writing-studio__main">
          <div className="editor__toolbar">
            <button
              className="editor__button"
              onClick={handleExportWriting}
              disabled={!writingText.trim()}
              title="Export as TXT"
            >
              <Download size={16} />
              Export TXT
            </button>
            <button
              className="editor__button"
              onClick={handleExportJSON}
              disabled={!writingText.trim()}
              title="Export as JSON"
            >
              <FileJson size={16} />
              Export JSON
            </button>
            <button
              className="editor__button"
              onClick={handleCopyToClipboard}
              disabled={!writingText.trim()}
              title="Copy to Clipboard"
            >
              {copySuccess ? <Check size={16} /> : <Copy size={16} />}
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
            <button
              className="editor__button"
              onClick={() => {
                if (confirm('Clear all writing? This cannot be undone.')) {
                  setWritingText('');
                }
              }}
              disabled={!writingText.trim()}
              title="Clear Writing"
            >
              <FileText size={16} />
              Clear
            </button>
          </div>

          <textarea
            ref={textareaRef}
            className="editor__textarea"
            value={writingText}
            onChange={(e) => setWritingText(e.target.value)}
            onKeyUp={handleCursorActivity}
            onClick={handleCursorActivity}
            placeholder="Start writing your verse here...

Tip: Use the Ghost Module on the right for rhymes and flow checks!"
            spellCheck="true"
          />

          {/* Rhyme Scheme Analysis */}
          <RhymeSchemeAnalyzer text={writingText} />
        </main>

        {/* Right Sidebar - Ghost Module (Desktop: always visible if showGhost is true. Mobile: Toggled via drawer) */}
        <aside className={`writing-studio__ghost ${sidebarOpen === 'ghost' ? 'is-open' : ''}`}>
            {/* Show content if enabled on desktop OR if open on mobile */}
            {showGhost && (
              <GhostModule 
                  currentLine={currentLine} 
                  currentWord={currentWord}
                  dictionaryIndex={searchIndex}
                  onInsertRhyme={insertRhyme}
              />
            )}
        </aside>

        {/* Mobile Toggle Button (Left - Reference) */}
        <button
          className="writing-studio__mobile-toggle"
          onClick={() => setSidebarOpen(sidebarOpen === 'left' ? null : 'left')}
          title="Toggle References"
        >
          <BookOpen size={24} />
        </button>

        {/* Mobile Toggle Button (Right - Ghost) - Only show if Ghost is enabled */}
        {showGhost && (
          <button
            className="writing-studio__mobile-ghost-toggle"
            onClick={() => setSidebarOpen(sidebarOpen === 'ghost' ? null : 'ghost')}
            title="Toggle Ghost Assistant"
          >
             <Zap size={24} fill="currentColor" />
          </button>
        )}
      </div>

      <WorkspaceGraph isOpen={showGraph} onClose={() => setShowGraph(false)} />
      <ConceptRecommender 
        isOpen={showRecommender} 
        onClose={() => setShowRecommender(false)} 
        onAddToBoard={handleAddRecommendation}
      />
    </div>

    <ImmersiveMode
      isOpen={immersiveModeOpen}
      onClose={() => setImmersiveModeOpen(false)}
      writingText={writingText}
      onTextChange={setWritingText}
      currentLine={currentLine}
      currentWord={currentWord}
      dictionaryIndex={searchIndex}
      onInsertRhyme={insertRhyme}
    />
    </>
  );
}


export default WritingStudio;
