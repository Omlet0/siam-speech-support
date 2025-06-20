

   export interface VMAction {
     vmId: string;
     action: string;
     parameters?: Record<string, any>;
   }

   export interface VMActionResult {
     success: boolean;
     message: string;
     data?: any;
   }

   export interface VM {
     id: string;
     name: string;
     status: 'healthy' | 'warning' | 'critical';
     cpu: number;
     ram: number;
     disk: number;
     uptime: string;
     lastUpdate: string;
   }

   class VMManagementAPI {
     private baseUrl = 'http://127.0.0.1:3001/api';

     async executeAction(action: VMAction): Promise<VMActionResult> {
       try {
         console.log(`Executing ${action.action} on VM ${action.vmId}`);
         
         const response = await fetch(`${this.baseUrl}/vm/action`, {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
           },
           body: JSON.stringify(action)
         });

         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }

         const result = await response.json();
         return result;
       } catch (error) {
         console.error('API Error:', error);
         return {
           success: false,
           message: `Failed to execute ${action.action}: ${error instanceof Error ? error.message : 'Network error'}`,
         };
       }
     }

     async getVMs(): Promise<VM[]> {
       try {
         console.log('Fetching VMs from backend API...');
         console.log('Using URL:', `${this.baseUrl}/vms`);
         
         const response = await fetch(`${this.baseUrl}/vms`, {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
         });
         
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }

         const result = await response.json();
         console.log('Backend API response:', result);
         
         if (result.success && result.data) {
           return result.data;
         } else {
           throw new Error(result.message || 'Failed to fetch VMs');
         }
       } catch (error) {
         console.error('Failed to get VMs from backend:', error);
         
         // Return empty array instead of mock data
         console.log('Backend not available, returning empty array');
         return [];
       }
     }

     async getVMStatus(vmId: string): Promise<any> {
       try {
         console.log(`Fetching system status from backend...`);
         console.log('Using URL:', `${this.baseUrl}/system/status`);
         
         const response = await fetch(`${this.baseUrl}/system/status`, {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
         });
         
         if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
         }

         const result = await response.json();
         console.log('System status response:', result);
         
         if (result.success && result.data) {
           return {
             id: vmId,
             status: 'running',
             ...result.data
           };
         } else {
           throw new Error(result.message || 'Failed to get system status');
         }
       } catch (error) {
         console.error('Failed to get system status:', error);
         throw error;
       }
     }

     async checkHealth(): Promise<boolean> {
       try {
         console.log('Checking backend health...');
         console.log('Using URL:', `${this.baseUrl}/health`);
         const response = await fetch(`${this.baseUrl}/health`, {
           method: 'GET',
           headers: {
             'Content-Type': 'application/json',
           },
         });
         
         if (!response.ok) {
           console.log('Health check failed - response not ok:', response.status);
           return false;
         }
         
         const result = await response.json();
         console.log('Health check result:', result);
         return result.success === true;
       } catch (error) {
         console.error('Health check failed:', error);
         return false;
       }
     }
   }

   export const vmManagementAPI = new VMManagementAPI();
   
