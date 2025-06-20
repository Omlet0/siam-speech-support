
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  Cpu, 
  MemoryStick, 
  HardDrive,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";

interface VM {
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

interface SummaryDashboardProps {
  vms: VM[];
}

export const SummaryDashboard = ({ vms }: SummaryDashboardProps) => {
  // Calculate summary statistics
  const totalVMs = vms.length;
  const healthyVMs = vms.filter(vm => vm.status === 'healthy').length;
  const warningVMs = vms.filter(vm => vm.status === 'warning').length;
  const criticalVMs = vms.filter(vm => vm.status === 'critical').length;

  // Calculate average resource usage
  const avgCpu = vms.reduce((sum, vm) => sum + vm.cpu, 0) / totalVMs;
  const avgRam = vms.reduce((sum, vm) => sum + vm.ram, 0) / totalVMs;
  const avgDisk = vms.reduce((sum, vm) => sum + vm.disk, 0) / totalVMs;

  // Calculate AI analysis summary
  const vmsWithAnalysis = vms.filter(vm => vm.analysisResult);
  const avgAIScore = vmsWithAnalysis.length > 0 
    ? vmsWithAnalysis.reduce((sum, vm) => sum + vm.analysisResult.score, 0) / vmsWithAnalysis.length 
    : 0;

  // Find critical VMs for quick access
  const criticalVMsList = vms.filter(vm => vm.status === 'critical').slice(0, 5);

  const getResourceTrend = (value: number) => {
    if (value > 80) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (value > 60) return <TrendingUp className="h-4 w-4 text-yellow-500" />;
    if (value < 30) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total VMs</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVMs}</div>
            <p className="text-xs text-muted-foreground">
              Active virtual machines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthyVMs}</div>
            <p className="text-xs text-muted-foreground">
              {((healthyVMs / totalVMs) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningVMs}</div>
            <p className="text-xs text-muted-foreground">
              {((warningVMs / totalVMs) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalVMs}</div>
            <p className="text-xs text-muted-foreground">
              {((criticalVMs / totalVMs) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average CPU Usage</CardTitle>
            <div className="flex items-center gap-1">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              {getResourceTrend(avgCpu)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCpu.toFixed(1)}%</div>
            <Progress value={avgCpu} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average RAM Usage</CardTitle>
            <div className="flex items-center gap-1">
              <MemoryStick className="h-4 w-4 text-muted-foreground" />
              {getResourceTrend(avgRam)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRam.toFixed(1)}%</div>
            <Progress value={avgRam} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Disk Usage</CardTitle>
            <div className="flex items-center gap-1">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              {getResourceTrend(avgDisk)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDisk.toFixed(1)}%</div>
            <Progress value={avgDisk} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Summary & Critical VMs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              AI Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Health Score</span>
              <Badge className="bg-purple-100 text-purple-800">
                {avgAIScore.toFixed(0)}/100
              </Badge>
            </div>
            <Progress value={avgAIScore} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Based on {vmsWithAnalysis.length} analyzed VMs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Critical VMs Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            {criticalVMsList.length > 0 ? (
              <div className="space-y-2">
                {criticalVMsList.map((vm) => (
                  <div key={vm.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{vm.name}</div>
                      <div className="text-xs text-muted-foreground">
                        CPU: {vm.cpu.toFixed(1)}% | RAM: {vm.ram.toFixed(1)}% | Disk: {vm.disk.toFixed(1)}%
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800">Critical</Badge>
                  </div>
                ))}
                {criticalVMs > 5 && (
                  <div className="text-xs text-muted-foreground text-center pt-2">
                    ... and {criticalVMs - 5} more critical VMs
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>No critical VMs detected</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
