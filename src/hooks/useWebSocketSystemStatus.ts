
import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

interface SystemStatus {
  id: string;
  status: string;
  cpu: number;
  memory: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    percentage: number;
  };
  uptime: string;
  platform: string;
  hostname: string;
  timestamp: string;
}

export const useWebSocketSystemStatus = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const handleMessage = useCallback((message: any) => {
    if (message.type === 'system-status') {
      setSystemStatus(message.data);
      setLastUpdate(new Date().toISOString());
    }
  }, []);

  const { isConnected, connectionError, sendMessage } = useWebSocket({
    url: 'ws://localhost:8080',
    onMessage: handleMessage,
    onOpen: () => {
      console.log('System status WebSocket connected');
      // Request initial data
      sendMessage({ type: 'request-data' });
    },
    onClose: () => {
      console.log('System status WebSocket disconnected');
    }
  });

  return {
    systemStatus,
    isConnected,
    connectionError,
    lastUpdate,
    isLoading: false,
    error: connectionError
  };
};
