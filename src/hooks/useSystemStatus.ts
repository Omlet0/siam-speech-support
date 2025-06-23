
import { useQuery } from '@tanstack/react-query';
import { vmManagementAPI } from '@/services/vmManagementApi';

export const useSystemStatus = () => {
  const { data: systemStatus, isLoading, error } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => vmManagementAPI.getVMStatus('main-system'),
    refetchInterval: 3000, // Refresh every 3 seconds instead of 15
    retry: 2,
    staleTime: 1000, // Consider data stale after 1 second
    gcTime: 10000, // Keep in cache for 10 seconds
  });

  return {
    systemStatus,
    isLoading,
    error
  };
};
