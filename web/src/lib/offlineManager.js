/**
 * Offline Manager
 * Handles offline/online state and queues actions
 */

class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.queue = this.loadQueue();
    this.listeners = new Set();
    this.init();
  }

  init() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  handleOnline() {
    this.isOnline = true;
    this.notifyListeners('online');
    this.processQueue();
  }

  handleOffline() {
    this.isOnline = false;
    this.notifyListeners('offline');
  }

  notifyListeners(status) {
    this.listeners.forEach((callback) => callback(status));
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  loadQueue() {
    try {
      return JSON.parse(localStorage.getItem('offline_queue') || '[]');
    } catch {
      return [];
    }
  }

  saveQueue() {
    try {
      localStorage.setItem('offline_queue', JSON.stringify(this.queue));
    } catch (e) {
      console.error('Failed to save offline queue:', e);
    }
  }

  addToQueue(action) {
    this.queue.push({
      ...action,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9),
    });
    this.saveQueue();
  }

  async processQueue() {
    if (!this.isOnline || this.queue.length === 0) return;

    const queue = [...this.queue];
    this.queue = [];
    this.saveQueue();

    for (const action of queue) {
      try {
        await this.executeAction(action);
      } catch (error) {
        console.error('Failed to process offline action:', error);
        this.queue.push(action); // Re-queue failed actions
      }
    }

    this.saveQueue();
  }

  async executeAction(action) {
    const { type, data } = action;

    switch (type) {
      case 'favorite':
        return this.syncFavorite(data);
      case 'pin':
        return this.syncPin(data);
      case 'studio-save':
        return this.syncStudioSave(data);
      default:
        console.warn('Unknown action type:', type);
    }
  }

  async syncFavorite(data) {
    // Implementation depends on your backend
    console.log('Syncing favorite:', data);
  }

  async syncPin(data) {
    // Implementation depends on your backend
    console.log('Syncing pin:', data);
  }

  async syncStudioSave(data) {
    // Implementation depends on your backend
    console.log('Syncing studio save:', data);
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      queueLength: this.queue.length,
    };
  }

  clearQueue() {
    this.queue = [];
    this.saveQueue();
  }
}

export const offlineManager = new OfflineManager();
