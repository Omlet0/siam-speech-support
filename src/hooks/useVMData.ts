
import { useQuery } from '@tanstack/react-query';
import { vmManagementAPI } from '@/services/vmManagementApi';

export const useVMData = () => {
  const { data: vms = [], isLoading, error, refetch } = useQuery({
    queryKey: ['vms'],
    queryFn: () => vmManagementAPI.getVMs(),
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 3,
  });

  const { data: healthStatus, isLoading: isHealthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: () => vmManagementAPI.checkHealth(),
    refetchInterval: 60000, // Check health every minute
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
