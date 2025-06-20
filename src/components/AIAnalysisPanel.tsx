
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, AlertTriangle, CheckCircle, Info, Lightbulb } from "lucide-react";
import { AnalysisResult } from "@/utils/aiAnalysis";

interface AIAnalysisPanelProps {
  analysis: AnalysisResult;
  vmName: string;
}

export const AIAnalysisPanel = ({ analysis, vmName }: AIAnalysisPanelProps) => {
  const getStatusIcon = () => {
    switch (analysis.status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Analysis - {vmName}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(analysis.priority)}>
              {analysis.priority.toUpperCase()} PRIORITY
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Score */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">Health Score</span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{analysis.score}/100</div>
            <div className="text-sm text-muted-foreground capitalize">{analysis.status}</div>
          </div>
        </div>

        {/* Issues Detected */}
        {analysis.issues.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Issues Detected ({analysis.issues.length})
            </h4>
            {analysis.issues.map((issue, index) => (
              <Alert key={index} variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{issue}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* AI Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-500" />
              AI Recommendations ({analysis.recommendations.length})
            </h4>
            <div className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <Alert key={index}>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>{recommendation}</AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Analysis Methodology */}
        <div className="pt-3 border-t">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
              Analysis Methodology
            </summary>
            <div className="mt-2 text-xs text-muted-foreground space-y-1">
              <p>• CPU Thresholds: Healthy &lt;60%, Warning 60-80%, Critical &gt;80%</p>
              <p>• RAM Thresholds: Healthy &lt;70%, Warning 70-85%, Critical &gt;85%</p>
              <p>• Disk Thresholds: Healthy &lt;75%, Warning 75-90%, Critical &gt;90%</p>
              <p>• Composite analysis considers resource interaction patterns</p>
              <p>• Machine learning algorithms detect usage anomalies</p>
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
};
