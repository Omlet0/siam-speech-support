
import { useQuery } from '@tanstack/react-query';
import { vmManagementAPI } from '@/services/vmManagementApi';

export const useVMData = () => {
  const { data: vms = [], isLoading, error, refetch } = useQuery({
    queryKey: ['vms'],
    queryFn: () => vmManagementAPI.getVMs(),
    refetchInterval: 5000, // Refresh every 5 seconds instead of 30
    retry: 3,
    staleTime: 1000, // Consider data stale after 1 second
    gcTime: 30000, // Keep in cache for 30 seconds
  });

  const { data: healthStatus, isLoading: isHealthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: () => vmManagementAPI.checkHealth(),
    refetchInterval: 10000, // Check health every 10 seconds instead of 60
    retry: 2,
    staleTime: 5000,
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
