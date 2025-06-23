import { useState, useEffect } from 'react';
import { useWebSocketSystemStatus } from './useWebSocketSystemStatus';

interface PerformanceDataPoint {
  timestamp: string;
  cpu: number;
  ram: number;
  disk: number;
}

export const usePerformanceData = () => {
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceDataPoint[]>([]);
  const { systemStatus } = useWebSocketSystemStatus();

  // Update performance history when new data comes in via WebSocket
  useEffect(() => {
    if (systemStatus && systemStatus.cpu !== undefined) {
      const newDataPoint: PerformanceDataPoint = {
        timestamp: new Date().toISOString(),
        cpu: systemStatus.cpu,
        ram: systemStatus.memory?.percentage || 0,
        disk: systemStatus.disk?.percentage || 0,
      };

      setPerformanceHistory(prev => {
        const updated = [...prev, newDataPoint];
        // Keep only last 60 data points (about 60 seconds of data)
        return updated.slice(-60);
      });
    }
  }, [systemStatus]);

  return {
    performanceData: performanceHistory,
    isLoading: false,
    error: null
  };
};
