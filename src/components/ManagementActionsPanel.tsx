
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  Power, 
  Pause, 
  Play, 
  Terminal, 
  Settings, 
  Trash2,
  Shield,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VM {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
}

interface ManagementActionsPanelProps {
  vm: VM;
}

export const ManagementActionsPanel = ({ vm }: ManagementActionsPanelProps) => {
  const { toast } = useToast();

  const handleAction = (action: string, vmName: string) => {
    // Simulate management action
    console.log(`Performing ${action} on ${vmName}`);
    
    toast({
      title: `${action} initiated`,
      description: `Action "${action}" has been queued for ${vmName}`,
    });
  };

  const getActionsByStatus = () => {
    switch (vm.status) {
      case 'critical':
        return [
          { 
            id: 'emergency-restart', 
            label: 'Emergency Restart', 
            icon: Power, 
            variant: 'destructive' as const,
            description: 'Force restart to resolve critical issues'
          },
          { 
            id: 'kill-processes', 
            label: 'Kill Heavy Processes', 
            icon: Trash2, 
            variant: 'destructive' as const,
            description: 'Terminate resource-intensive processes'
          },
          { 
            id: 'free-memory', 
            label: 'Free Memory', 
            icon: RefreshCw, 
            variant: 'default' as const,
            description: 'Clear cache and free up memory'
          }
        ];
      
      case 'warning':
        return [
          { 
            id: 'optimize-performance', 
            label: 'Optimize Performance', 
            icon: Settings, 
            variant: 'default' as const,
            description: 'Apply performance optimizations'
          },
          { 
            id: 'cleanup-disk', 
            label: 'Cleanup Disk', 
            icon: Trash2, 
            variant: 'default' as const,
            description: 'Remove temporary files and logs'
          },
          { 
            id: 'restart-services', 
            label: 'Restart Services', 
            icon: RefreshCw, 
            variant: 'default' as const,
            description: 'Restart problematic services'
          }
        ];
      
      default:
        return [
          { 
            id: 'health-check', 
            label: 'Run Health Check', 
            icon: Shield, 
            variant: 'outline' as const,
            description: 'Perform comprehensive system check'
          },
          { 
            id: 'update-system', 
            label: 'Update System', 
            icon: RefreshCw, 
            variant: 'outline' as const,
            description: 'Apply system updates'
          },
          { 
            id: 'backup-data', 
            label: 'Backup Data', 
            icon: Shield, 
            variant: 'outline' as const,
            description: 'Create system backup'
          }
        ];
    }
  };

  const actions = getActionsByStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Management Actions
          <Badge variant={vm.status === 'critical' ? 'destructive' : vm.status === 'warning' ? 'secondary' : 'default'}>
            {vm.status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning for Critical Actions */}
        {vm.status === 'critical' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Critical status detected. Actions below may cause service interruption.
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Actions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Recommended Actions</h4>
          {actions.map((action) => {
            const IconComponent = action.icon;
            return (
              <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  <IconComponent className="h-4 w-4 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{action.label}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant={action.variant}
                  onClick={() => handleAction(action.label, vm.name)}
                >
                  Execute
                </Button>
              </div>
            );
          })}
        </div>

        {/* Manual Commands */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Manual Commands</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAction('Pause VM', vm.name)}
            >
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAction('Resume VM', vm.name)}
            >
              <Play className="h-3 w-3 mr-1" />
              Resume
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAction('Soft Restart', vm.name)}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Restart
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAction('Open Console', vm.name)}
            >
              <Terminal className="h-3 w-3 mr-1" />
              Console
            </Button>
          </div>
        </div>

        {/* Automation Settings */}
        <div className="pt-3 border-t">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Automation Settings
            </summary>
            <div className="mt-2 space-y-2">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span>Auto-restart on critical status</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span>Auto-cleanup disk when &gt;90%</span>
              </label>
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="rounded" />
                <span>Send alerts to admin</span>
              </label>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
};
