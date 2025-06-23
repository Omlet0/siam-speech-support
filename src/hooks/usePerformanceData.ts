import { useQuery } from '@tanstack/react-query';
import { vmManagementAPI } from '@/services/vmManagementApi';
import { useState, useEffect } from 'react';

interface PerformanceDataPoint {
  timestamp: string;
  cpu: number;
  ram: number;
  disk: number;
}

export const usePerformanceData = () => {
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceDataPoint[]>([]);

  // Get current system status for real-time data
  const { data: systemStatus } = useQuery({
    queryKey: ['system-status-performance'],
    queryFn: () => vmManagementAPI.getVMStatus('main-system'),
    refetchInterval: 2000, // Update every 2 seconds for performance chart
    retry: 1,
    staleTime: 500,
  });

  // Update performance history when new data comes in
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
        // Keep only last 50 data points (about 100 seconds of data)
        return updated.slice(-50);
      });
    }
  }, [systemStatus]);

  const { data: performanceData, isLoading, error } = useQuery({
    queryKey: ['performance-data'],
    queryFn: async () => {
      // Return the real-time collected data
      return performanceHistory;
    },
    enabled: false, // We'll use the state-managed data instead
  });

  return {
    performanceData: performanceHistory,
    isLoading: false,
    error: null
  };
};
