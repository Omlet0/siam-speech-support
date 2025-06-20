
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, Cpu, HardDrive, MemoryStick, RefreshCw, Brain, Settings } from "lucide-react";
import { AIAnalysisPanel } from "./AIAnalysisPanel";
import { ManagementActionsPanel } from "./ManagementActionsPanel";

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

  const getProgressColor = (value: number, status: string) => {
    if (status === 'critical' && value > 85) return 'bg-red-500';
    if (status === 'warning' && value > 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4" />
          <CardTitle className="text-base">{vm.name}</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(vm.status)}
          {vm.analysisResult && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              <Brain className="h-3 w-3 mr-1" />
              AI: {vm.analysisResult.score}/100
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
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
          </TabsContent>

          <TabsContent value="analysis" className="mt-4">
            {vm.analysisResult ? (
              <AIAnalysisPanel analysis={vm.analysisResult} vmName={vm.name} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>AI Analysis not available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions" className="mt-4">
            <ManagementActionsPanel vm={vm} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
