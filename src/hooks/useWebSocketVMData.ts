
import { useState, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';

interface VM {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  ram: number;
  disk: number;
  uptime: string;
  lastUpdate: string;
}

export const useWebSocketVMData = () => {
  const [vms, setVms] = useState<VM[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const handleMessage = useCallback((message: any) => {
    if (message.type === 'vm-data') {
      setVms(message.data);
      setLastUpdate(new Date().toISOString());
    }
  }, []);

  const { isConnected, connectionError, sendMessage } = useWebSocket({
    url: 'ws://localhost:8080',
    onMessage: handleMessage,
    onOpen: () => {
      console.log('VM data WebSocket connected');
      sendMessage({ type: 'request-data' });
    }
  });

  const refetch = useCallback(() => {
    sendMessage({ type: 'request-data' });
  }, [sendMessage]);

  return {
    vms,
    isLoading: false,
    error: connectionError,
    refetch,
    healthStatus: isConnected,
    isHealthLoading: false,
    lastUpdate
  };
};
