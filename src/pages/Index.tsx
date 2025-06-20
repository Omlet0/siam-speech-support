
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { VMStatusCard } from "@/components/VMStatusCard";
import { PerformanceChart } from "@/components/PerformanceChart";
import { ActivityLog } from "@/components/ActivityLog";
import { VMTableView } from "@/components/VMTableView";
import { SummaryDashboard } from "@/components/SummaryDashboard";
import { VMDetailModal } from "@/components/VMDetailModal";
import { mockVMData, mockPerformanceData, mockActivityLog } from "@/data/mockData";
import { Server, Activity, AlertTriangle, CheckCircle, Table, BarChart3 } from "lucide-react";

const Index = () => {
  const [selectedVM, setSelectedVM] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'analysis' | 'management'>('analysis');

  const totalVMs = mockVMData.length;
  const healthyVMs = mockVMData.filter(vm => vm.status === 'healthy').length;
  const warningVMs = mockVMData.filter(vm => vm.status === 'warning').length;
  const criticalVMs = mockVMData.filter(vm => vm.status === 'critical').length;

  const handleViewDetails = (vm: any, tab: 'analysis' | 'management' = 'analysis') => {
    setSelectedVM(vm);
    setDefaultTab(tab);
    setIsModalOpen(true);
    console.log('View details for VM:', vm.name, 'Tab:', tab);
  };

  const handleManageVM = (vm: any, tab: 'analysis' | 'management' = 'management') => {
    setSelectedVM(vm);
    setDefaultTab(tab);
    setIsModalOpen(true);
    console.log('Manage VM:', vm.name, 'Tab:', tab);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">VM Health Monitoring</h1>
            <p className="text-muted-foreground">Real-time monitoring dashboard for virtual machines</p>
          </div>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <span className="text-sm font-medium">{totalVMs} Total VMs</span>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SummaryDashboard vms={mockVMData} />
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            <VMTableView 
              vms={mockVMData}
              onViewDetails={handleViewDetails}
              onManageVM={handleManageVM}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceChart data={mockPerformanceData} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityLog activities={mockActivityLog} />
          </TabsContent>
        </Tabs>

        {/* VM Detail Modal */}
        <VMDetailModal 
          vm={selectedVM}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          defaultTab={defaultTab}
        />
      </div>
    </div>
  );
};

export default Index;
