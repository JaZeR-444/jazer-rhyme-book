/**
 * PWA Helper Functions
 * Utilities for Progressive Web App functionality
 */

// Register service worker
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('ServiceWorker registered:', registration.scope);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            console.log('New service worker available');
            
            // Notify user about update
            if (window.confirm('New version available! Reload to update?')) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
      return null;
    }
  }
  
  return null;
}

// Unregister service worker
export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('ServiceWorker unregistered');
    }
  }
}

// Check if app is installed
export function isAppInstalled() {
  // Check if running in standalone mode
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone || // iOS
         document.referrer.includes('android-app://'); // Android
}

// Check if install prompt is available
export function canInstallApp() {
  return !isAppInstalled() && 'BeforeInstallPromptEvent' in window;
}

// Request permission for notifications
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

// Show notification
export async function showNotification(title, options = {}) {
  const hasPermission = await requestNotificationPermission();
  
  if (!hasPermission) {
    console.log('Notification permission denied');
    return;
  }
  
  const registration = await navigator.serviceWorker.getRegistration();
  
  if (registration) {
    registration.showNotification(title, {
      icon: '/icon-192.png',
      badge: '/icon-72.png',
      ...options
    });
  } else {
    new Notification(title, {
      icon: '/icon-192.png',
      ...options
    });
  }
}

// Check if offline
export function isOffline() {
  return !navigator.onLine;
}

// Listen for online/offline events
export function onNetworkChange(callback) {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

// Clear all caches
export async function clearAllCaches() {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('All caches cleared');
  }
}

// Get cache size
export async function getCacheSize() {
  if ('caches' in window && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage,
      quota: estimate.quota,
      percentage: (estimate.usage / estimate.quota) * 100
    };
  }
  return null;
}

// Request persistent storage
export async function requestPersistentStorage() {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    const isPersisted = await navigator.storage.persist();
    console.log(`Persistent storage: ${isPersisted}`);
    return isPersisted;
  }
  return false;
}

// Check if persistent storage is granted
export async function isPersistentStorageGranted() {
  if ('storage' in navigator && 'persisted' in navigator.storage) {
    return await navigator.storage.persisted();
  }
  return false;
}

// Share API
export async function shareContent(data) {
  if ('share' in navigator) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }
  return false;
}

// Check if share is supported
export function canShare() {
  return 'share' in navigator;
}

// Detect iOS
export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Detect Android
export function isAndroid() {
  return /Android/.test(navigator.userAgent);
}

// Get install instructions based on platform
export function getInstallInstructions() {
  if (isIOS()) {
    return {
      platform: 'iOS',
      steps: [
        'Tap the Share button in Safari',
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" in the top right corner'
      ]
    };
  }
  
  if (isAndroid()) {
    return {
      platform: 'Android',
      steps: [
        'Tap the menu button (⋮)',
        'Tap "Add to Home screen"',
        'Tap "Add"'
      ]
    };
  }
  
  return {
    platform: 'Desktop',
    steps: [
      'Click the install icon in the address bar',
      'Click "Install" in the popup'
    ]
  };
}

// Log PWA status for debugging
export async function logPWAStatus() {
  console.log('PWA Status:');
  console.log('- Installed:', isAppInstalled());
  console.log('- Can Install:', canInstallApp());
  console.log('- Offline:', isOffline());
  console.log('- Notifications:', Notification.permission);
  console.log('- Service Worker:', 'serviceWorker' in navigator);
  
  const cacheSize = await getCacheSize();
  if (cacheSize) {
    console.log('- Cache Usage:', `${(cacheSize.usage / 1024 / 1024).toFixed(2)} MB`);
    console.log('- Cache Quota:', `${(cacheSize.quota / 1024 / 1024).toFixed(2)} MB`);
    console.log('- Cache %:', `${cacheSize.percentage.toFixed(2)}%`);
  }
  
  const isPersisted = await isPersistentStorageGranted();
  console.log('- Persistent Storage:', isPersisted);
}
