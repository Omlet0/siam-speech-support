
import { useQuery } from '@tanstack/react-query';
import { vmManagementAPI } from '@/services/vmManagementApi';

export const usePerformanceData = () => {
  const { data: performanceData, isLoading, error } = useQuery({
    queryKey: ['performance-data'],
    queryFn: async () => {
      // For now, return empty array since backend doesn't have performance endpoint yet
      // This can be implemented when backend adds performance data endpoint
      return [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2,
  });

  return {
    performanceData,
    isLoading,
    error
  };
};
