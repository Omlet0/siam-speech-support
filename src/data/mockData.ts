
// Mock data for VM monitoring dashboard

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

// Generate random values within realistic ranges
const generateRandomValue = (min: number, max: number) => 
  Math.random() * (max - min) + min;

// Mock VM data
export const mockVMData: VM[] = [
  {
    id: "vm-001",
    name: "Web Server 01",
    status: "healthy",
    cpu: generateRandomValue(10, 30),
    ram: generateRandomValue(40, 60),
    disk: generateRandomValue(20, 40),
    uptime: "15d 4h 32m",
    lastUpdate: "2 minutes ago"
  },
  {
    id: "vm-002", 
    name: "Database Server",
    status: "warning",
    cpu: generateRandomValue(70, 85),
    ram: generateRandomValue(80, 90),
    disk: generateRandomValue(60, 75),
    uptime: "8d 12h 15m",
    lastUpdate: "1 minute ago"
  },
  {
    id: "vm-003",
    name: "Application Server",
    status: "critical",
    cpu: generateRandomValue(90, 98),
    ram: generateRandomValue(85, 95),
    disk: generateRandomValue(85, 95),
    uptime: "2d 6h 45m",
    lastUpdate: "30 seconds ago"
  },
  {
    id: "vm-004",
    name: "Load Balancer",
    status: "healthy",
    cpu: generateRandomValue(15, 35),
    ram: generateRandomValue(30, 50),
    disk: generateRandomValue(25, 45),
    uptime: "45d 2h 18m",
    lastUpdate: "3 minutes ago"
  },
  {
    id: "vm-005",
    name: "Cache Server",
    status: "healthy",
    cpu: generateRandomValue(20, 40),
    ram: generateRandomValue(60, 75),
    disk: generateRandomValue(30, 50),
    uptime: "12d 8h 42m",
    lastUpdate: "1 minute ago"
  },
  {
    id: "vm-006",
    name: "Backup Server",
    status: "warning",
    cpu: generateRandomValue(50, 70),
    ram: generateRandomValue(70, 85),
    disk: generateRandomValue(80, 90),
    uptime: "28d 15h 22m",
    lastUpdate: "5 minutes ago"
  }
];

// Generate performance data for the last 24 hours
const generatePerformanceData = (): PerformanceData[] => {
  const data: PerformanceData[] = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
    data.push({
      timestamp: timestamp.toISOString(),
      cpu: generateRandomValue(20, 80),
      ram: generateRandomValue(30, 90),
      disk: generateRandomValue(25, 70)
    });
  }
  
  return data;
};

export const mockPerformanceData = generatePerformanceData();

// Mock activity log
export const mockActivityLog: Activity[] = [
  {
    id: "act-001",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    type: "error",
    message: "High CPU usage detected",
    vmName: "Application Server"
  },
  {
    id: "act-002", 
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: "warning",
    message: "Memory usage above 80%",
    vmName: "Database Server"
  },
  {
    id: "act-003",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    type: "success",
    message: "Auto-recovery completed successfully",
    vmName: "Web Server 01"
  },
  {
    id: "act-004",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: "info",
    message: "Scheduled backup started",
    vmName: "Backup Server"
  },
  {
    id: "act-005",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    type: "warning",
    message: "Disk space running low",
    vmName: "Backup Server"
  },
  {
    id: "act-006",
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    type: "success",
    message: "VM restart completed",
    vmName: "Cache Server"
  },
  {
    id: "act-007",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    type: "info",
    message: "System health check passed",
    vmName: "Load Balancer"
  },
  {
    id: "act-008",
    timestamp: new Date(Date.now() - 150 * 60 * 1000).toISOString(),
    type: "error",
    message: "Connection timeout detected",
    vmName: "Database Server"
  }
];
