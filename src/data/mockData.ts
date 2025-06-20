
// Mock data for VM monitoring dashboard with AI Analysis

import { VMHealthAnalyzer, type VMMetrics } from "@/utils/aiAnalysis";

export interface VM {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  ram: number;
  disk: number;
  uptime: string;
  lastUpdate: string;
  analysisResult?: any;
}

export interface PerformanceData {
  timestamp: string;
  cpu: number;
  ram: number;
  disk: number;
}

export interface Activity {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  vmName?: string;
}

// Generate realistic values based on different scenarios
const generateVMScenario = (scenario: 'healthy' | 'warning' | 'critical') => {
  switch (scenario) {
    case 'healthy':
      return {
        cpu: Math.random() * 40 + 10,  // 10-50%
        ram: Math.random() * 50 + 20,  // 20-70%
        disk: Math.random() * 50 + 15, // 15-65%
      };
    case 'warning':
      return {
        cpu: Math.random() * 25 + 60,  // 60-85%
        ram: Math.random() * 20 + 70,  // 70-90%
        disk: Math.random() * 15 + 75, // 75-90%
      };
    case 'critical':
      return {
        cpu: Math.random() * 8 + 85,   // 85-93%
        ram: Math.random() * 10 + 85,  // 85-95%
        disk: Math.random() * 5 + 90,  // 90-95%
      };
  }
};

// Create VMs with realistic scenarios
const createVMData = (id: string, name: string, scenario: 'healthy' | 'warning' | 'critical', uptime: string): VM => {
  const metrics = generateVMScenario(scenario);
  
  // AI Analysis
  const vmMetrics: VMMetrics = {
    cpu: metrics.cpu,
    ram: metrics.ram,
    disk: metrics.disk,
    uptime: uptime
  };
  
  const analysisResult = VMHealthAnalyzer.analyzeVM(vmMetrics);
  
  return {
    id,
    name,
    status: analysisResult.status,
    cpu: metrics.cpu,
    ram: metrics.ram,
    disk: metrics.disk,
    uptime,
    lastUpdate: `${Math.floor(Math.random() * 5) + 1} minutes ago`,
    analysisResult
  };
};

// Mock VM data with AI-analyzed statuses
export const mockVMData: VM[] = [
  createVMData("vm-001", "Web Server 01", "healthy", "15d 4h 32m"),
  createVMData("vm-002", "Database Server", "warning", "8d 12h 15m"),
  createVMData("vm-003", "Application Server", "critical", "2d 6h 45m"),
  createVMData("vm-004", "Load Balancer", "healthy", "45d 2h 18m"),
  createVMData("vm-005", "Cache Server", "healthy", "12d 8h 42m"),
  createVMData("vm-006", "Backup Server", "warning", "28d 15h 22m")
];

// Generate performance data for the last 24 hours
const generatePerformanceData = (): PerformanceData[] => {
  const data: PerformanceData[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    
    // Simulate realistic patterns
    const hour = timestamp.getHours();
    let baseLoad = 30; // Base load
    
    // Business hours (9-17) have higher load
    if (hour >= 9 && hour <= 17) {
      baseLoad = 60;
    }
    
    // Peak hours (11-14) have highest load
    if (hour >= 11 && hour <= 14) {
      baseLoad = 75;
    }
    
    data.push({
      timestamp: timestamp.toISOString(),
      cpu: baseLoad + (Math.random() * 20 - 10), // ±10% variation
      ram: baseLoad + (Math.random() * 15 - 7.5), // ±7.5% variation
      disk: Math.min(95, baseLoad * 0.8 + (Math.random() * 10 - 5)) // Disk grows slower
    });
  }
  
  return data;
};

export const mockPerformanceData = generatePerformanceData();

// Enhanced activity log with AI analysis results
export const mockActivityLog: Activity[] = [
  {
    id: "act-001",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: "error",
    message: "AI detected critical CPU usage (91.2%) - Auto-mitigation initiated",
    vmName: "Application Server"
  },
  {
    id: "act-002", 
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: "warning",
    message: "AI Analysis: Memory usage pattern suggests memory leak",
    vmName: "Database Server"
  },
  {
    id: "act-003",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: "success",
    message: "AI-recommended optimization completed successfully",
    vmName: "Web Server 01"
  },
  {
    id: "act-004",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: "info",
    message: "AI scheduled maintenance window based on usage patterns",
    vmName: "Backup Server"
  },
  {
    id: "act-005",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    type: "warning",
    message: "AI Alert: Disk space trending towards critical threshold",
    vmName: "Backup Server"
  },
  {
    id: "act-006",
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    type: "success",
    message: "AI-initiated VM restart resolved performance issues",
    vmName: "Cache Server"
  },
  {
    id: "act-007",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    type: "info",
    message: "AI Health Check: All systems operating within normal parameters",
    vmName: "Load Balancer"
  },
  {
    id: "act-008",
    timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    type: "error",
    message: "AI detected anomalous network patterns - Security scan recommended",
    vmName: "Database Server"
  }
];
