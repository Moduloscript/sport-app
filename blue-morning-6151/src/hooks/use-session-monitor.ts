'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';

export function useSessionMonitor() {
  const { checkSessionExpiration, refreshSessionIfNeeded } = useAuthStore();

  useEffect(() => {
    // Check session expiration every minute
    const interval = setInterval(() => {
      checkSessionExpiration();
      refreshSessionIfNeeded();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [checkSessionExpiration, refreshSessionIfNeeded]);

  // Check immediately on mount
  useEffect(() => {
    checkSessionExpiration();
    refreshSessionIfNeeded();
  }, [checkSessionExpiration, refreshSessionIfNeeded]);
}
