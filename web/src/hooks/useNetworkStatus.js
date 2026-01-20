import { useState, useEffect } from 'react';
import { offlineManager } from '../lib/offlineManager';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueLength, setQueueLength] = useState(0);

  useEffect(() => {
    const unsubscribe = offlineManager.subscribe((status) => {
      setIsOnline(status === 'online');
      const { queueLength: length } = offlineManager.getStatus();
      setQueueLength(length);
    });

    const { queueLength: length } = offlineManager.getStatus();
    setQueueLength(length);

    return unsubscribe;
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
    queueLength,
    hasQueuedActions: queueLength > 0,
  };
}

export function NetworkStatusBanner() {
  const { isOffline, queueLength } = useNetworkStatus();

  if (!isOffline && queueLength === 0) return null;

  return (
    <div className="network-status-banner">
      {isOffline && (
        <div className="network-status-banner__offline">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
          </svg>
          <span>You're offline. Changes will sync when you reconnect.</span>
        </div>
      )}
      {isOnline && queueLength > 0 && (
        <div className="network-status-banner__syncing">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Syncing {queueLength} {queueLength === 1 ? 'change' : 'changes'}...</span>
        </div>
      )}
    </div>
  );
}
