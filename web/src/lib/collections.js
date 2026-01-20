/**
 * collections.js
 * 
 * Library for managing word collections (custom lists, shareable via URL)
 */

// Collection storage key
const COLLECTIONS_KEY = 'jazer_word_collections';
const MAX_COLLECTIONS = 20;
const MAX_COLLECTION_SIZE = 100;

/**
 * Get all collections from localStorage
 */
export function getAllCollections() {
  try {
    const collections = localStorage.getItem(COLLECTIONS_KEY);
    return collections ? JSON.parse(collections) : {};
  } catch (error) {
    console.error('Error loading collections:', error);
    return {};
  }
}

/**
 * Save collections to localStorage
 */
function saveCollections(collections) {
  try {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
    return true;
  } catch (error) {
    console.error('Error saving collections:', error);
    return false;
  }
}

/**
 * Generate a unique collection ID
 */
function generateCollectionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Create a new collection
 */
export function createCollection(name, description = '', words = [], tags = []) {
  const collections = getAllCollections();
  
  // Check limits
  if (Object.keys(collections).length >= MAX_COLLECTIONS) {
    throw new Error(`Maximum ${MAX_COLLECTIONS} collections allowed`);
  }
  
  if (words.length > MAX_COLLECTION_SIZE) {
    throw new Error(`Maximum ${MAX_COLLECTION_SIZE} words per collection`);
  }
  
  const id = generateCollectionId();
  const collection = {
    id,
    name: name.trim(),
    description: description.trim(),
    words: [...new Set(words)], // Remove duplicates
    tags: [...new Set(tags)],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isPublic: false,
    shareUrl: null
  };
  
  collections[id] = collection;
  
  if (saveCollections(collections)) {
    return collection;
  } else {
    throw new Error('Failed to save collection');
  }
}

/**
 * Update an existing collection
 */
export function updateCollection(id, updates) {
  const collections = getAllCollections();
  
  if (!collections[id]) {
    throw new Error('Collection not found');
  }
  
  // Validate updates
  if (updates.words && updates.words.length > MAX_COLLECTION_SIZE) {
    throw new Error(`Maximum ${MAX_COLLECTION_SIZE} words per collection`);
  }
  
  const updatedCollection = {
    ...collections[id],
    ...updates,
    id, // Ensure ID can't be changed
    updatedAt: new Date().toISOString()
  };
  
  // Remove duplicates from words if updated
  if (updates.words) {
    updatedCollection.words = [...new Set(updates.words)];
  }
  
  if (updates.tags) {
    updatedCollection.tags = [...new Set(updates.tags)];
  }
  
  collections[id] = updatedCollection;
  
  if (saveCollections(collections)) {
    return updatedCollection;
  } else {
    throw new Error('Failed to update collection');
  }
}

/**
 * Delete a collection
 */
export function deleteCollection(id) {
  const collections = getAllCollections();
  
  if (!collections[id]) {
    throw new Error('Collection not found');
  }
  
  delete collections[id];
  return saveCollections(collections);
}

/**
 * Get a specific collection
 */
export function getCollection(id) {
  const collections = getAllCollections();
  return collections[id] || null;
}

/**
 * Add a word to a collection
 */
export function addWordToCollection(collectionId, word) {
  const collection = getCollection(collectionId);
  
  if (!collection) {
    throw new Error('Collection not found');
  }
  
  if (collection.words.includes(word)) {
    return collection; // Word already in collection
  }
  
  if (collection.words.length >= MAX_COLLECTION_SIZE) {
    throw new Error(`Collection is full (${MAX_COLLECTION_SIZE} words max)`);
  }
  
  const updatedWords = [...collection.words, word];
  return updateCollection(collectionId, { words: updatedWords });
}

/**
 * Remove a word from a collection
 */
export function removeWordFromCollection(collectionId, word) {
  const collection = getCollection(collectionId);
  
  if (!collection) {
    throw new Error('Collection not found');
  }
  
  const updatedWords = collection.words.filter(w => w !== word);
  return updateCollection(collectionId, { words: updatedWords });
}

/**
 * Generate a shareable URL for a collection
 */
export function generateShareUrl(collectionId) {
  const collection = getCollection(collectionId);
  
  if (!collection) {
    throw new Error('Collection not found');
  }
  
  // Create compressed collection data
  const shareData = {
    id: collection.id,
    name: collection.name,
    description: collection.description,
    words: collection.words,
    tags: collection.tags,
    createdAt: collection.createdAt
  };
  
  // Encode the data
  const encodedData = btoa(JSON.stringify(shareData));
  const shareUrl = `${window.location.origin}/collections/shared/${encodedData}`;
  
  // Update collection with share URL
  updateCollection(collectionId, { 
    shareUrl,
    isPublic: true 
  });
  
  return shareUrl;
}

/**
 * Import a collection from a share URL
 */
export function importFromShareUrl(encodedData) {
  try {
    const shareData = JSON.parse(atob(encodedData));
    
    // Validate the data
    if (!shareData.name || !Array.isArray(shareData.words)) {
      throw new Error('Invalid collection data');
    }
    
    // Create a new collection with imported data
    const importedName = `${shareData.name} (Imported)`;
    return createCollection(
      importedName,
      shareData.description || '',
      shareData.words,
      shareData.tags || []
    );
  } catch (error) {
    throw new Error('Failed to import collection: ' + error.message);
  }
}

/**
 * Search collections
 */
export function searchCollections(query, options = {}) {
  const collections = getAllCollections();
  const {
    includeWords = true,
    includeTags = true,
    includeDescription = true
  } = options;
  
  if (!query || query.trim() === '') {
    return Object.values(collections);
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return Object.values(collections).filter(collection => {
    // Search in name (always included)
    if (collection.name.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in description
    if (includeDescription && collection.description.toLowerCase().includes(searchTerm)) {
      return true;
    }
    
    // Search in words
    if (includeWords && collection.words.some(word => 
      word.toLowerCase().includes(searchTerm)
    )) {
      return true;
    }
    
    // Search in tags
    if (includeTags && collection.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm)
    )) {
      return true;
    }
    
    return false;
  });
}

/**
 * Get collection statistics
 */
export function getCollectionStats() {
  const collections = getAllCollections();
  const collectionList = Object.values(collections);
  
  const totalCollections = collectionList.length;
  const totalWords = collectionList.reduce((sum, col) => sum + col.words.length, 0);
  const averageSize = totalCollections > 0 ? Math.round(totalWords / totalCollections) : 0;
  const publicCollections = collectionList.filter(col => col.isPublic).length;
  
  // Most common tags
  const tagCounts = {};
  collectionList.forEach(col => {
    col.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
  
  return {
    totalCollections,
    totalWords,
    averageSize,
    publicCollections,
    topTags,
    storageUsed: JSON.stringify(collections).length
  };
}

/**
 * Export all collections as JSON
 */
export function exportCollections() {
  const collections = getAllCollections();
  const exportData = {
    collections,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
  
  return JSON.stringify(exportData, null, 2);
}

/**
 * Import collections from JSON
 */
export function importCollections(jsonData, options = {}) {
  const { merge = false } = options;
  
  try {
    const importData = JSON.parse(jsonData);
    
    if (!importData.collections || typeof importData.collections !== 'object') {
      throw new Error('Invalid import format');
    }
    
    let currentCollections = merge ? getAllCollections() : {};
    let importedCount = 0;
    
    Object.values(importData.collections).forEach(collection => {
      if (!collection.name || !Array.isArray(collection.words)) {
        console.warn('Skipping invalid collection:', collection);
        return;
      }
      
      // Generate new ID to avoid conflicts
      const newId = generateCollectionId();
      currentCollections[newId] = {
        ...collection,
        id: newId,
        importedAt: new Date().toISOString(),
        shareUrl: null // Reset share URL
      };
      
      importedCount++;
    });
    
    if (saveCollections(currentCollections)) {
      return { success: true, importedCount };
    } else {
      throw new Error('Failed to save imported collections');
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if a word exists in any collection
 */
export function findWordInCollections(word) {
  const collections = getAllCollections();
  const found = [];
  
  Object.values(collections).forEach(collection => {
    if (collection.words.includes(word)) {
      found.push(collection);
    }
  });
  
  return found;
}

/**
 * Get recently updated collections
 */
export function getRecentCollections(limit = 5) {
  const collections = getAllCollections();
  
  return Object.values(collections)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);
}

/**
 * Cleanup old or empty collections
 */
export function cleanupCollections() {
  const collections = getAllCollections();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  let removedCount = 0;
  
  Object.entries(collections).forEach(([id, collection]) => {
    const shouldRemove = (
      // Empty collections older than a week
      (collection.words.length === 0 && 
       new Date(collection.updatedAt) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      // Very old unused collections
      (collection.words.length === 0 && 
       new Date(collection.createdAt) < oneMonthAgo)
    );
    
    if (shouldRemove) {
      delete collections[id];
      removedCount++;
    }
  });
  
  if (removedCount > 0) {
    saveCollections(collections);
  }
  
  return removedCount;
}