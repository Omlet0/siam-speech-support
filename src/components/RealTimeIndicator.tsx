
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface RealTimeIndicatorProps {
  isConnected: boolean;
  lastUpdate?: string;
  refreshInterval?: number;
}

export const RealTimeIndicator = ({ 
  isConnected, 
  lastUpdate, 
  refreshInterval = 1000 // Default to 1 second
}: RealTimeIndicatorProps) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<number>(0);

  // Pulse animation when data updates
  useEffect(() => {
    if (lastUpdate) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 800);
      return () => clearTimeout(timer);
    }
  }, [lastUpdate]);

  // Calculate time since last update
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastUpdate) {
        const now = new Date().getTime();
        const updateTime = new Date(lastUpdate).getTime();
        const diff = Math.floor((now - updateTime) / 1000);
        setTimeSinceUpdate(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  const getStatusColor = () => {
    if (!isConnected) return "text-red-500";
    if (timeSinceUpdate > refreshInterval / 1000 * 3) return "text-yellow-500"; // 3x refresh interval
    return "text-green-500";
  };

  const getStatusText = () => {
    if (!isConnected) return "Disconnected";
    if (timeSinceUpdate > refreshInterval / 1000 * 3) return "Delayed";
    return "Live";
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={cn(
          "flex items-center gap-1 transition-all duration-300",
          isPulsing && "scale-105 shadow-lg",
          isConnected ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
        )}
      >
        {isConnected ? (
          <Wifi className={cn("h-3 w-3", getStatusColor())} />
        ) : (
          <WifiOff className="h-3 w-3 text-red-500" />
        )}
        <span className={cn("text-xs font-medium", getStatusColor())}>
          {getStatusText()}
        </span>
        {isConnected && (
          <Activity className={cn(
            "h-3 w-3 ml-1",
            getStatusColor(),
            isPulsing && "animate-pulse"
          )} />
        )}
      </Badge>
      
      {isConnected && lastUpdate && (
        <div className="text-xs text-muted-foreground">
          Updated {timeSinceUpdate}s ago
        </div>
      )}
    </div>
  );
};
