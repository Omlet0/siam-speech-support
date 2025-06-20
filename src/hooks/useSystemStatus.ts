
import { useQuery } from '@tanstack/react-query';
import { vmManagementAPI } from '@/services/vmManagementApi';

export const useSystemStatus = () => {
  const { data: systemStatus, isLoading, error } = useQuery({
    queryKey: ['system-status'],
    queryFn: () => vmManagementAPI.getVMStatus('main-system'),
    refetchInterval: 15000, // Refresh every 15 seconds
    retry: 2,
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  return {
    systemStatus,
    isLoading,
    error
  };
};
