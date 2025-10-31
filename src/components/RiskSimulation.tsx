import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

interface SimulationFactor {
  id: string;
  label: string;
  enabled: boolean;
  impact: number;
  description: string;
}

export const RiskSimulation = () => {
  const [factors, setFactors] = useState<SimulationFactor[]>([
    {
      id: 'ignore-blockers',
      label: 'Ignore 2 Critical Blockers',
      enabled: false,
      impact: -12,
      description: 'Sprint predictability drops by 12%'
    },
    {
      id: 'skip-retros',
      label: 'Skip Retrospectives',
      enabled: false,
      impact: -8,
      description: 'Team engagement decreases by 8%'
    },
    {
      id: 'reduce-wip',
      label: 'Reduce WIP Limits',
      enabled: true,
      impact: +15,
      description: 'Focus improves, velocity increases by 15%'
    },
    {
      id: 'daily-standups',
      label: 'Consistent Daily Standups',
      enabled: true,
      impact: +10,
      description: 'Team alignment improves by 10%'
    },
  ]);

  const toggleFactor = (id: string) => {
    setFactors(prev => prev.map(f => 
      f.id === id ? { ...f, enabled: !f.enabled } : f
    ));
  };

  const baselinePredictability = 70;
  const totalImpact = factors.reduce((sum, f) => sum + (f.enabled ? f.impact : 0), 0);
  const projectedPredictability = Math.max(0, Math.min(100, baselinePredictability + totalImpact));

  const getStatusColor = () => {
    if (projectedPredictability >= 80) return 'text-green-600';
    if (projectedPredictability >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  const getStatusBadge = () => {
    if (projectedPredictability >= 80) return { label: 'Excellent', variant: 'default' as const };
    if (projectedPredictability >= 60) return { label: 'Moderate', variant: 'secondary' as const };
    return { label: 'At Risk', variant: 'destructive' as const };
  };

  return (
    <Card className="p-4 sm:p-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <AlertTriangle className="w-5 h-5" />
        <h3 className="text-base sm:text-lg font-semibold">Risk Impact Simulation</h3>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs sm:text-sm">Projected Sprint Predictability</Label>
          <Badge variant={getStatusBadge().variant} className="text-xs">
            {getStatusBadge().label}
          </Badge>
        </div>
        
        <div className="relative">
          <Progress value={projectedPredictability} className="h-8 sm:h-10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-base sm:text-lg font-bold ${getStatusColor()}`}>
              {projectedPredictability}%
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Baseline: {baselinePredictability}%</span>
          <span className="flex items-center gap-1">
            {totalImpact > 0 ? <TrendingUp className="w-3 h-3" /> : totalImpact < 0 ? <TrendingDown className="w-3 h-3" /> : null}
            Impact: {totalImpact > 0 ? '+' : ''}{totalImpact}%
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-xs sm:text-sm font-semibold">What-If Scenarios</Label>
        
        {factors.map(factor => (
          <Card key={factor.id} className="p-3 sm:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Label htmlFor={factor.id} className="text-xs sm:text-sm font-medium cursor-pointer">
                    {factor.label}
                  </Label>
                  <Badge 
                    variant="outline" 
                    className={`text-[10px] ${factor.impact > 0 ? 'border-green-600 text-green-600' : 'border-red-600 text-red-600'}`}
                  >
                    {factor.impact > 0 ? '+' : ''}{factor.impact}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{factor.description}</p>
              </div>
              <Switch
                id={factor.id}
                checked={factor.enabled}
                onCheckedChange={() => toggleFactor(factor.id)}
              />
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4 p-3 sm:p-4 bg-primary/5 border-primary/20">
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold">Recommendation:</span> {
            projectedPredictability >= 80 
              ? "Maintain current practices. Team is performing excellently."
              : projectedPredictability >= 60
              ? "Consider enabling positive factors and addressing blockers promptly."
              : "Immediate action needed. Enable recommended practices and escalate blockers."
          }
        </p>
      </Card>
    </Card>
  );
};