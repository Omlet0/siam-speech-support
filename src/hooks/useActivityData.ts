
import { useQuery } from '@tanstack/react-query';
import { vmManagementAPI } from '@/services/vmManagementApi';

export const useActivityData = () => {
  const { data: activityData, isLoading, error } = useQuery({
    queryKey: ['activity-data'],
    queryFn: async () => {
      // For now, return empty array since backend doesn't have activity endpoint yet
      // This can be implemented when backend adds activity log endpoint
      return [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2,
  });

  return {
    activityData,
    isLoading,
    error
  };
};
