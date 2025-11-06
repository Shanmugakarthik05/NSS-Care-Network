import { useState, useEffect } from 'react';
import { Badge } from "./ui/badge";

interface BackendStatusProps {
  // Add any props if needed
}

export function BackendStatus({}: BackendStatusProps) {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // You can implement actual status checking logic here
  useEffect(() => {
    const checkStatus = async () => {
      try {
        // This is a placeholder - replace with actual status check
        setStatus('online');
        setLastChecked(new Date());
      } catch (error) {
        console.error('Error checking backend status:', error);
        setStatus('offline');
      }
    };

    checkStatus();
    // Check every 5 minutes
    const interval = setInterval(checkStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Backend:</span>
      <Badge variant={status === 'online' ? 'default' : 'destructive'}>
        {status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking...'}
      </Badge>
      {lastChecked && (
        <span className="text-xs text-muted-foreground">
          Last checked: {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
}
