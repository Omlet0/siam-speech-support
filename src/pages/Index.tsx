
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
import { mockVMData, mockPerformanceData, mockActivityLog } from "@/data/mockData";
import { Server, Activity, AlertTriangle, CheckCircle, Table, Grid3X3, BarChart3 } from "lucide-react";

const Index = () => {
  const [selectedVM, setSelectedVM] = useState(null);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const totalVMs = mockVMData.length;
  const healthyVMs = mockVMData.filter(vm => vm.status === 'healthy').length;
  const warningVMs = mockVMData.filter(vm => vm.status === 'warning').length;
  const criticalVMs = mockVMData.filter(vm => vm.status === 'critical').length;

  const handleViewDetails = (vm: any) => {
    setSelectedVM(vm);
    console.log('View details for VM:', vm.name);
  };

  const handleManageVM = (vm: any) => {
    console.log('Manage VM:', vm.name);
    // This would open a management dialog or navigate to management page
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Overview
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

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total VMs</CardTitle>
                  <Server className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalVMs}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Healthy</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{healthyVMs}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Warning</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{warningVMs}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Critical</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{criticalVMs}</div>
                </CardContent>
              </Card>
            </div>

            {/* VM Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {mockVMData.map((vm) => (
                <VMStatusCard key={vm.id} vm={vm} />
              ))}
            </div>
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
      </div>
    </div>
  );
};

export default Index;
