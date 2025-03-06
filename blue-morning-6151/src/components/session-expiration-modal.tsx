'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/stores/auth-store';



export function SessionExpirationModal() {
  const { isSessionExpired, refreshSession } = useAuthStore();
  
  const handleRefresh = async () => {
    await refreshSession();
  };

  return (
    <Dialog open={isSessionExpired}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Your session has expired. Please refresh your session to continue.
          </p>
          <Button 
            onClick={handleRefresh}
            className="w-full"
          >
            Refresh Session
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
