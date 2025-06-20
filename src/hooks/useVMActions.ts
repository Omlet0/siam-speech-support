
import { useState } from 'react';
import { vmManagementAPI, VMAction, VMActionResult } from '@/services/vmManagementApi';
import { useToast } from '@/hooks/use-toast';

export const useVMActions = () => {
  const [isExecuting, setIsExecuting] = useState<string | null>(null);
  const { toast } = useToast();

  const executeAction = async (vmId: string, actionLabel: string, vmName: string) => {
    setIsExecuting(actionLabel);
    
    try {
      console.log(`Starting action: ${actionLabel} for VM: ${vmName}`);
      
      const action: VMAction = {
        vmId,
        action: actionLabel,
        parameters: { vmName }
      };

      // Show initial toast
      toast({
        title: "Action Started",
        description: `Executing "${actionLabel}" on ${vmName}...`,
      });

      const result = await vmManagementAPI.executeAction(action);
      
      if (result.success) {
        toast({
          title: "Action Completed",
          description: result.message,
          variant: "default",
        });
        
        // Log additional data if available
        if (result.data) {
          console.log('Action result data:', result.data);
        }
      } else {
        toast({
          title: "Action Failed",
          description: result.message,
          variant: "destructive",
        });
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Action execution failed:', error);
      
      toast({
        title: "Action Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsExecuting(null);
    }
  };

  return {
    executeAction,
    isExecuting
  };
};
