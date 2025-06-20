
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
import { useVMData } from "@/hooks/useVMData";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { mockPerformanceData, mockActivityLog } from "@/data/mockData";
import { Server, Activity, AlertTriangle, CheckCircle, Table, BarChart3, Wifi, WifiOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedVM, setSelectedVM] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'analysis' | 'management'>('analysis');
  const { toast } = useToast();
  
  const { vms, isLoading, error, refetch, healthStatus } = useVMData();
  const { systemStatus } = useSystemStatus();

  // Show connection status
  const isConnected = healthStatus === true;

  const totalVMs = vms.length;
  const healthyVMs = vms.filter(vm => vm.status === 'healthy').length;
  const warningVMs = vms.filter(vm => vm.status === 'warning').length;
  const criticalVMs = vms.filter(vm => vm.status === 'critical').length;

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

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Data Refreshed",
      description: "VM data has been updated",
    });
  };

  if (error) {
    console.error('VM Data Error:', error);
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">VM Health Monitoring</h1>
            <p className="text-muted-foreground">Real-time monitoring dashboard for virtual machines</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">Disconnected</span>
                </>
              )}
            </div>
            
            <Button onClick={handleRefresh} variant="outline" size="sm">
              Refresh
            </Button>
            
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              <span className="text-sm font-medium">
                {isLoading ? 'Loading...' : `${totalVMs} Total VMs`}
              </span>
            </div>
          </div>
        </div>

        {/* Connection Alert */}
        {!isConnected && !isLoading && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-2 p-4">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Backend API Not Connected</p>
                <p className="text-sm text-red-600">
                  Make sure the backend server is running on localhost:3001
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Status */}
        {systemStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Live System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Hostname</p>
                  <p className="text-2xl font-bold">{systemStatus.hostname}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Platform</p>
                  <p className="text-2xl font-bold">{systemStatus.platform}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Uptime</p>
                  <p className="text-2xl font-bold">{systemStatus.uptime}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(systemStatus.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading VM data...</p>
              </div>
            ) : (
              <SummaryDashboard vms={vms} />
            )}
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading VM data...</p>
              </div>
            ) : (
              <VMTableView 
                vms={vms}
                onViewDetails={handleViewDetails}
                onManageVM={handleManageVM}
              />
            )}
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
