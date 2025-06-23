
import { useQuery } from '@tanstack/react-query';
import { vmManagementAPI } from '@/services/vmManagementApi';

export const useVMData = () => {
  const { data: vms = [], isLoading, error, refetch } = useQuery({
    queryKey: ['vms'],
    queryFn: () => vmManagementAPI.getVMs(),
    refetchInterval: 1000, // Refresh every 1 second instead of 5
    retry: 3,
    staleTime: 100, // Consider data stale after 100ms
    gcTime: 10000, // Keep in cache for 10 seconds
  });

  const { data: healthStatus, isLoading: isHealthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: () => vmManagementAPI.checkHealth(),
    refetchInterval: 5000, // Keep health check at 5 seconds
    retry: 2,
    staleTime: 2000,
  });

  return {
    vms,
    isLoading,
    error,
    refetch,
    healthStatus,
    isHealthLoading
  };
};
