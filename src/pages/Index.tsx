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
import { RealTimeIndicator } from "@/components/RealTimeIndicator";
import { useVMData } from "@/hooks/useVMData";
import { useSystemStatus } from "@/hooks/useSystemStatus";
import { usePerformanceData } from "@/hooks/usePerformanceData";
import { useActivityData } from "@/hooks/useActivityData";
import { Server, Activity, AlertTriangle, CheckCircle, Table, BarChart3, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedVM, setSelectedVM] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'analysis' | 'management'>('analysis');
  const { toast } = useToast();
  
  const { vms, isLoading, error, refetch, healthStatus } = useVMData();
  const { systemStatus } = useSystemStatus();
  const { performanceData } = usePerformanceData();
  const { activityData } = useActivityData();

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
      description: "VM data has been updated manually",
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
            {/* Real-time Status Indicator */}
            <RealTimeIndicator 
              isConnected={isConnected}
              lastUpdate={systemStatus?.timestamp || vms[0]?.lastUpdate}
              refreshInterval={1000} // 1 second refresh
            />
            
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh'}
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
                  Make sure the backend server is running on localhost:3001 for real-time data
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* System Status */}
        {systemStatus && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Live System Status
                <Badge className="bg-green-100 text-green-800 animate-pulse">LIVE</Badge>
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
            <TabsTrigger value="performance">
              Performance
              {performanceData && performanceData.length > 0 && (
                <Badge className="ml-1 bg-blue-100 text-blue-800">LIVE</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="activity">
              Activity Log
              {activityData && activityData.length > 0 && (
                <Badge className="ml-1 bg-purple-100 text-purple-800">
                  {activityData.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading real-time VM data...</p>
              </div>
            ) : (
              <SummaryDashboard vms={vms} />
            )}
          </TabsContent>

          <TabsContent value="table" className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading real-time VM data...</p>
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
            <PerformanceChart data={performanceData || []} />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityLog activities={activityData || []} />
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
