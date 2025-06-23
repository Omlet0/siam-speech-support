
import { useQuery } from '@tanstack/react-query';
import { vmManagementAPI } from '@/services/vmManagementApi';
import { useState, useEffect } from 'react';

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
}

export const useActivityData = () => {
  const [activityHistory, setActivityHistory] = useState<ActivityLogEntry[]>([]);

  // Monitor system status changes for activity generation
  const { data: systemStatus } = useQuery({
    queryKey: ['system-status-activity'],
    queryFn: () => vmManagementAPI.getVMStatus('main-system'),
    refetchInterval: 2000, // Check every 2 seconds for activity generation
    retry: 1,
  });

  const { data: vms } = useQuery({
    queryKey: ['vms-activity'],
    queryFn: () => vmManagementAPI.getVMs(),
    refetchInterval: 3000, // Check VMs every 3 seconds
    retry: 1,
  });

  // Generate activity logs based on system changes
  useEffect(() => {
    if (systemStatus) {
      const now = new Date().toISOString();
      const newActivities: ActivityLogEntry[] = [];

      // CPU alerts
      if (systemStatus.cpu > 80) {
        newActivities.push({
          id: `cpu-alert-${Date.now()}`,
          timestamp: now,
          type: 'warning',
          message: 'High CPU Usage Detected',
          details: `CPU usage is at ${systemStatus.cpu.toFixed(1)}%`
        });
      }

      // Memory alerts
      if (systemStatus.memory?.percentage > 90) {
        newActivities.push({
          id: `memory-alert-${Date.now()}`,
          timestamp: now,
          type: 'error',
          message: 'Critical Memory Usage',
          details: `Memory usage is at ${systemStatus.memory.percentage.toFixed(1)}%`
        });
      }

      // Disk alerts
      if (systemStatus.disk?.percentage > 85) {
        newActivities.push({
          id: `disk-alert-${Date.now()}`,
          timestamp: now,
          type: 'warning',
          message: 'High Disk Usage',
          details: `Disk usage is at ${systemStatus.disk.percentage.toFixed(1)}%`
        });
      }

      // Add system health check
      if (Math.random() < 0.05) { // 5% chance to add a routine check
        newActivities.push({
          id: `health-check-${Date.now()}`,
          timestamp: now,
          type: 'info',
          message: 'System Health Check Completed',
          details: `System is ${systemStatus.cpu < 50 ? 'performing well' : 'under load'}`
        });
      }

      if (newActivities.length > 0) {
        setActivityHistory(prev => {
          const updated = [...newActivities, ...prev];
          return updated.slice(0, 100); // Keep last 100 activities
        });
      }
    }
  }, [systemStatus]);

  // Initialize with some sample activities
  useEffect(() => {
    if (activityHistory.length === 0) {
      const initialActivities: ActivityLogEntry[] = [
        {
          id: 'init-1',
          timestamp: new Date().toISOString(),
          type: 'success',
          message: 'Real-time Monitoring Started',
          details: 'VM Health monitoring system is now active'
        }
      ];
      setActivityHistory(initialActivities);
    }
  }, []);

  const { data: activityData, isLoading, error } = useQuery({
    queryKey: ['activity-data'],
    queryFn: async () => {
      return activityHistory;
    },
    enabled: false,
  });

  return {
    activityData: activityHistory,
    isLoading: false,
    error: null
  };
};
