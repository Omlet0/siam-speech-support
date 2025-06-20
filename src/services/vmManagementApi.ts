
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
  private baseUrl = 'http://localhost:3001/api';

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
      console.log('Fetching VMs from local API...');
      
      const response = await fetch(`${this.baseUrl}/vms`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch VMs');
      }
    } catch (error) {
      console.error('Failed to get VMs:', error);
      
      // Fallback to mock data if local API is not available
      console.log('Falling back to mock data...');
      return this.getMockVMs();
    }
  }

  async getVMStatus(vmId: string): Promise<any> {
    try {
      console.log(`Fetching status for VM ${vmId}`);
      
      const response = await fetch(`${this.baseUrl}/system/status`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return {
          id: vmId,
          status: 'running',
          ...result.data
        };
      } else {
        throw new Error(result.message || 'Failed to get system status');
      }
    } catch (error) {
      console.error('Failed to get VM status:', error);
      throw error;
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Fallback mock data when backend is not available
  private getMockVMs(): VM[] {
    return [
      {
        id: 'vm-1',
        name: 'Production Server',
        status: 'healthy',
        cpu: Math.random() * 100,
        ram: Math.random() * 100,
        disk: Math.random() * 100,
        uptime: '7d 12h 34m',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'vm-2',
        name: 'Development Server',
        status: 'warning',
        cpu: Math.random() * 100,
        ram: Math.random() * 100,
        disk: Math.random() * 100,
        uptime: '2d 8h 15m',
        lastUpdate: new Date().toISOString()
      },
      {
        id: 'vm-3',
        name: 'Database Server',
        status: 'critical',
        cpu: Math.random() * 100,
        ram: Math.random() * 100,
        disk: Math.random() * 100,
        uptime: '15d 3h 22m',
        lastUpdate: new Date().toISOString()
      }
    ];
  }
}

export const vmManagementAPI = new VMManagementAPI();
