
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAnalysisPanel } from "@/components/AIAnalysisPanel";
import { ManagementActionsPanel } from "@/components/ManagementActionsPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VMHealthAnalyzer } from "@/utils/aiAnalysis";
import { 
  Server, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Clock,
  Brain,
  Settings
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

interface VMDetailModalProps {
  vm: VM | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VMDetailModal = ({ vm, open, onOpenChange }: VMDetailModalProps) => {
  if (!vm) return null;

  // Generate AI analysis
  const aiAnalysis = VMHealthAnalyzer.analyzeVM({
    cpu: vm.cpu,
    ram: vm.ram,
    disk: vm.disk,
    uptime: vm.uptime
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Healthy</Badge>;
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            {vm.name}
            {getStatusBadge(vm.status)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* VM Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Cpu className="h-4 w-4" />
                    CPU Usage
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">{vm.cpu.toFixed(1)}%</span>
                    </div>
                    <Progress value={vm.cpu} className="h-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MemoryStick className="h-4 w-4" />
                    RAM Usage
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">{vm.ram.toFixed(1)}%</span>
                    </div>
                    <Progress value={vm.ram} className="h-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <HardDrive className="h-4 w-4" />
                    Disk Usage
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">{vm.disk.toFixed(1)}%</span>
                    </div>
                    <Progress value={vm.disk} className="h-2" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    Uptime
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {vm.uptime}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last update: {vm.lastUpdate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for AI Analysis and Management */}
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                AI Analysis
              </TabsTrigger>
              <TabsTrigger value="management" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Management
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="mt-4">
              <AIAnalysisPanel analysis={aiAnalysis} vmName={vm.name} />
            </TabsContent>
            
            <TabsContent value="management" className="mt-4">
              <ManagementActionsPanel vm={vm} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
