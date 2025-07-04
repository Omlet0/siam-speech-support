
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { AlertTriangle } from "lucide-react";

interface PerformanceData {
  timestamp: string;
  cpu: number;
  ram: number;
  disk: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const chartConfig = {
  cpu: {
    label: "CPU %",
    color: "hsl(var(--chart-1))",
  },
  ram: {
    label: "RAM %",
    color: "hsl(var(--chart-2))",
  },
  disk: {
    label: "Disk %",
    color: "hsl(var(--chart-3))",
  },
};

export const PerformanceChart = ({ data }: PerformanceChartProps) => {
  // Show empty state when no data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium">No Performance Data Available</p>
            <p className="text-sm text-center mt-2">
              Connect to the backend server to view real-time performance metrics
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis domain={[0, 100]} />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              labelFormatter={(value) => new Date(value).toLocaleString()}
            />
            <Line 
              type="monotone" 
              dataKey="cpu" 
              stroke="var(--color-cpu)" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="ram" 
              stroke="var(--color-ram)" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="disk" 
              stroke="var(--color-disk)" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
