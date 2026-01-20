/**
 * WordCollections.jsx
 * 
 * Component for managing custom word collections (lists) with sharing functionality
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Share2, 
  Download, 
  Upload, 
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Copy,
  Check,
  Star,
  Clock,
  Tag,
  Users
} from 'lucide-react';
import { 
  getAllCollections, 
  createCollection, 
  updateCollection, 
  deleteCollection,
  addWordToCollection,
  removeWordFromCollection,
  generateShareUrl,
  searchCollections,
  getCollectionStats,
  exportCollections,
  importCollections,
  findWordInCollections
} from '../lib/collections';
import './WordCollections.css';

export default function WordCollections({ 
  currentWord = null,
  onWordSelect = null,
  showCreateButton = true,
  compact = false 
}) {
  const [collections, setCollections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [stats, setStats] = useState(null);

  // Load collections on mount
  useEffect(() => {
    loadCollections();
    loadStats();
  }, []);

  const loadCollections = () => {
    const loaded = getAllCollections();
    setCollections(loaded);
  };

  const loadStats = () => {
    const collectionStats = getCollectionStats();
    setStats(collectionStats);
  };

  const handleCreateCollection = async (formData) => {
    try {
      const newCollection = createCollection(
        formData.name,
        formData.description,
        currentWord ? [currentWord] : [],
        formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      );
      
      loadCollections();
      loadStats();
      setShowCreateDialog(false);
      setSelectedCollection(newCollection.id);
    } catch (error) {
      alert('Error creating collection: ' + error.message);
    }
  };

  const handleUpdateCollection = async (formData) => {
    try {
      updateCollection(editingCollection.id, {
        name: formData.name,
        description: formData.description,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      
      loadCollections();
      loadStats();
      setShowEditDialog(false);
      setEditingCollection(null);
    } catch (error) {
      alert('Error updating collection: ' + error.message);
    }
  };

  const handleDeleteCollection = async (collectionId) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      try {
        deleteCollection(collectionId);
        loadCollections();
        loadStats();
        if (selectedCollection === collectionId) {
          setSelectedCollection(null);
        }
      } catch (error) {
        alert('Error deleting collection: ' + error.message);
      }
    }
  };

  const handleAddWordToCollection = async (collectionId, word) => {
    try {
      addWordToCollection(collectionId, word);
      loadCollections();
    } catch (error) {
      alert('Error adding word: ' + error.message);
    }
  };

  const handleRemoveWordFromCollection = async (collectionId, word) => {
    try {
      removeWordFromCollection(collectionId, word);
      loadCollections();
    } catch (error) {
      alert('Error removing word: ' + error.message);
    }
  };

  const handleGenerateShareUrl = async (collectionId) => {
    try {
      const shareUrl = generateShareUrl(collectionId);
      await navigator.clipboard.writeText(shareUrl);
      setCopiedUrl(collectionId);
      setTimeout(() => setCopiedUrl(null), 2000);
      loadCollections(); // Refresh to show updated share status
    } catch (error) {
      alert('Error generating share URL: ' + error.message);
    }
  };

  const handleExportCollections = () => {
    try {
      const exportData = exportCollections();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `jazer-collections-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Error exporting collections: ' + error.message);
    }
  };

  const handleImportCollections = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = importCollections(e.target.result, { merge: true });
        if (result.success) {
          loadCollections();
          loadStats();
          alert(`Successfully imported ${result.importedCount} collections!`);
        } else {
          alert('Import failed: ' + result.error);
        }
      } catch (error) {
        alert('Error reading file: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const filteredCollections = searchQuery 
    ? searchCollections(searchQuery)
    : Object.values(collections);

  const currentWordCollections = currentWord 
    ? findWordInCollections(currentWord)
    : [];

  if (compact) {
    return (
      <div className="word-collections word-collections--compact">
        {currentWord && (
          <div className="current-word-collections">
            <h4>In Collections ({currentWordCollections.length})</h4>
            {currentWordCollections.length > 0 ? (
              <div className="collection-pills">
                {currentWordCollections.map(collection => (
                  <span key={collection.id} className="collection-pill">
                    <Bookmark size={12} />
                    {collection.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="no-collections">Not in any collections</p>
            )}
          </div>
        )}
        
        {showCreateButton && (
          <button
            onClick={() => setShowCreateDialog(true)}
            className="create-collection-btn create-collection-btn--compact"
          >
            <Plus size={14} />
            Add to Collection
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="word-collections">
      <div className="collections-header">
        <div className="header-title">
          <h3>Word Collections</h3>
          {stats && (
            <span className="stats-summary">
              {stats.totalCollections} collections • {stats.totalWords} words
            </span>
          )}
        </div>
        
        <div className="header-controls">
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="action-buttons">
            {showCreateButton && (
              <button
                onClick={() => setShowCreateDialog(true)}
                className="action-btn create-btn"
                title="Create new collection"
              >
                <Plus size={16} />
              </button>
            )}
            
            <button
              onClick={handleExportCollections}
              className="action-btn export-btn"
              title="Export collections"
            >
              <Download size={16} />
            </button>
            
            <label className="action-btn import-btn" title="Import collections">
              <Upload size={16} />
              <input
                type="file"
                accept=".json"
                onChange={handleImportCollections}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>
      </div>

      {currentWord && currentWordCollections.length > 0 && (
        <div className="current-word-status">
          <BookmarkCheck size={16} className="status-icon" />
          <span>"{currentWord}" is in {currentWordCollections.length} collection(s)</span>
        </div>
      )}

      <div className="collections-grid">
        {filteredCollections.map(collection => (
          <div 
            key={collection.id} 
            className={`collection-card ${selectedCollection === collection.id ? 'selected' : ''}`}
            onClick={() => setSelectedCollection(collection.id)}
          >
            <div className="collection-header">
              <div className="collection-title">
                <h4>{collection.name}</h4>
                <div className="collection-meta">
                  <span className="word-count">{collection.words.length} words</span>
                  {collection.isPublic && (
                    <span className="public-indicator" title="Public collection">
                      <Users size={12} />
                    </span>
                  )}
                </div>
              </div>
              
              <div className="collection-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCollection(collection);
                    setShowEditDialog(true);
                  }}
                  className="action-btn edit-btn"
                  title="Edit collection"
                >
                  <Edit size={14} />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateShareUrl(collection.id);
                  }}
                  className={`action-btn share-btn ${copiedUrl === collection.id ? 'copied' : ''}`}
                  title="Share collection"
                >
                  {copiedUrl === collection.id ? <Check size={14} /> : <Share2 size={14} />}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCollection(collection.id);
                  }}
                  className="action-btn delete-btn"
                  title="Delete collection"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            {collection.description && (
              <p className="collection-description">{collection.description}</p>
            )}
            
            {collection.tags.length > 0 && (
              <div className="collection-tags">
                {collection.tags.map(tag => (
                  <span key={tag} className="tag">
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="collection-words-preview">
              {collection.words.slice(0, 5).map(word => (
                <span 
                  key={word} 
                  className={`word-pill ${word === currentWord ? 'current' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onWordSelect) onWordSelect(word);
                  }}
                >
                  {word}
                </span>
              ))}
              {collection.words.length > 5 && (
                <span className="word-pill more">+{collection.words.length - 5} more</span>
              )}
            </div>
            
            <div className="collection-footer">
              <span className="last-updated">
                <Clock size={12} />
                {new Date(collection.updatedAt).toLocaleDateString()}
              </span>
              
              {currentWord && !collection.words.includes(currentWord) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddWordToCollection(collection.id, currentWord);
                  }}
                  className="add-word-btn"
                  title={`Add "${currentWord}" to this collection`}
                >
                  <Plus size={12} />
                  Add
                </button>
              )}
              
              {currentWord && collection.words.includes(currentWord) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveWordFromCollection(collection.id, currentWord);
                  }}
                  className="remove-word-btn"
                  title={`Remove "${currentWord}" from this collection`}
                >
                  <BookmarkCheck size={12} />
                  Added
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCollections.length === 0 && (
        <div className="empty-state">
          <Bookmark size={32} className="empty-icon" />
          <h4>No Collections Found</h4>
          {searchQuery ? (
            <p>No collections match "{searchQuery}"</p>
          ) : (
            <p>Create your first collection to organize words</p>
          )}
        </div>
      )}

      {/* Collection Detail View */}
      {selectedCollection && collections[selectedCollection] && (
        <CollectionDetail
          collection={collections[selectedCollection]}
          onClose={() => setSelectedCollection(null)}
          onWordSelect={onWordSelect}
          onRemoveWord={(word) => handleRemoveWordFromCollection(selectedCollection, word)}
        />
      )}

      {/* Create Collection Dialog */}
      {showCreateDialog && (
        <CollectionDialog
          title="Create New Collection"
          onSubmit={handleCreateCollection}
          onCancel={() => setShowCreateDialog(false)}
          initialData={{
            name: '',
            description: '',
            tags: ''
          }}
        />
      )}

      {/* Edit Collection Dialog */}
      {showEditDialog && editingCollection && (
        <CollectionDialog
          title="Edit Collection"
          onSubmit={handleUpdateCollection}
          onCancel={() => {
            setShowEditDialog(false);
            setEditingCollection(null);
          }}
          initialData={{
            name: editingCollection.name,
            description: editingCollection.description,
            tags: editingCollection.tags.join(', ')
          }}
        />
      )}
    </div>
  );
}

// Collection Detail Modal
function CollectionDetail({ collection, onClose, onWordSelect, onRemoveWord }) {
  return (
    <div className="collection-detail-overlay" onClick={onClose}>
      <div className="collection-detail" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <div className="detail-title">
            <h3>{collection.name}</h3>
            <button onClick={onClose} className="close-btn">×</button>
          </div>
          {collection.description && (
            <p className="detail-description">{collection.description}</p>
          )}
        </div>
        
        <div className="detail-content">
          <div className="words-list">
            {collection.words.map(word => (
              <div key={word} className="word-item">
                <span 
                  className="word-text"
                  onClick={() => onWordSelect && onWordSelect(word)}
                >
                  {word}
                </span>
                <button
                  onClick={() => onRemoveWord(word)}
                  className="remove-word-btn"
                  title="Remove word"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Collection Create/Edit Dialog
function CollectionDialog({ title, onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Collection name is required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="collection-dialog-overlay" onClick={onCancel}>
      <div className="collection-dialog" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="dialog-header">
            <h3>{title}</h3>
            <button type="button" onClick={onCancel} className="close-btn">×</button>
          </div>
          
          <div className="dialog-content">
            <div className="form-group">
              <label htmlFor="collection-name">Name *</label>
              <input
                id="collection-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter collection name..."
                maxLength={50}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="collection-description">Description</label>
              <textarea
                id="collection-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description..."
                maxLength={200}
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="collection-tags">Tags</label>
              <input
                id="collection-tags"
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Comma-separated tags..."
              />
              <small>Separate tags with commas (e.g., rap, freestyle, emotions)</small>
            </div>
          </div>
          
          <div className="dialog-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {title.includes('Create') ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}