
import { useQuery } from '@tanstack/react-query';
import { vmManagementAPI } from '@/services/vmManagementApi';

export const useSystemStatus = () => {
  const { data: systemStatus, isLoading, error } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => vmManagementAPI.getVMStatus('main-system'),
    refetchInterval: 1000, // Refresh every 1 second instead of 3
    retry: 2,
    staleTime: 100, // Consider data stale after 100ms
    gcTime: 5000, // Keep in cache for 5 seconds
  });

  return {
    systemStatus,
    isLoading,
    error
  };
};
