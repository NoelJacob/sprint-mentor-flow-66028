import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DependencyNode } from "@/types";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface DependencyMapProps {
  nodes: DependencyNode[];
}

export const DependencyMap = ({ nodes }: DependencyMapProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'at-risk':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'blocked':
        return <XCircle className="w-4 h-4 text-destructive" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-success bg-success/5';
      case 'at-risk':
        return 'border-warning bg-warning/5';
      case 'blocked':
        return 'border-destructive bg-destructive/5';
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Dependency Map</h3>
      <div className="space-y-4 sm:space-y-6">
        {nodes.map((node) => (
          <div key={node.id} className="relative">
            <div className={`p-3 sm:p-4 rounded-lg border-2 ${getStatusColor(node.status)} transition-all`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {getStatusIcon(node.status)}
                  <span className="font-medium text-xs sm:text-sm">{node.title}</span>
                </div>
                <Badge variant="outline" className="capitalize text-[10px] sm:text-xs self-start">
                  {node.status}
                </Badge>
              </div>
              {node.dependencies.length > 0 && (
                <div className="mt-2 sm:mt-3 pl-4 sm:pl-6 border-l-2 border-muted">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">Depends on:</p>
                  <div className="space-y-0.5 sm:space-y-1">
                    {node.dependencies.map((dep, idx) => (
                      <div key={idx} className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1.5 sm:gap-2">
                        <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                        <span className="break-words">{dep}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
