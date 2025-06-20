
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Cpu, HardDrive, MemoryStick, RefreshCw } from "lucide-react";

interface VM {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  ram: number;
  disk: number;
  uptime: string;
  lastUpdate: string;
}

interface VMStatusCardProps {
  vm: VM;
}

export const VMStatusCard = ({ vm }: VMStatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4" />
          <CardTitle className="text-base">{vm.name}</CardTitle>
        </div>
        {getStatusBadge(vm.status)}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* CPU Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              <span>CPU</span>
            </div>
            <span className="font-medium">{vm.cpu.toFixed(1)}%</span>
          </div>
          <Progress value={vm.cpu} className="h-2" />
        </div>

        {/* RAM Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <MemoryStick className="h-3 w-3" />
              <span>RAM</span>
            </div>
            <span className="font-medium">{vm.ram.toFixed(1)}%</span>
          </div>
          <Progress value={vm.ram} className="h-2" />
        </div>

        {/* Disk Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <HardDrive className="h-3 w-3" />
              <span>Disk</span>
            </div>
            <span className="font-medium">{vm.disk.toFixed(1)}%</span>
          </div>
          <Progress value={vm.disk} className="h-2" />
        </div>

        {/* VM Info */}
        <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Uptime:</span>
            <span>{vm.uptime}</span>
          </div>
          <div className="flex justify-between">
            <span>Last Update:</span>
            <span>{vm.lastUpdate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex gap-2">
          <Button size="sm" variant="outline" className="flex-1">
            <RefreshCw className="h-3 w-3 mr-1" />
            Restart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
