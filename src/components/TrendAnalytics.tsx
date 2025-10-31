import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Lightbulb, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const completionData = [
  { sprint: 'Sprint 1', count: 12, predicted: 10 },
  { sprint: 'Sprint 2', count: 15, predicted: 14 },
  { sprint: 'Sprint 3', count: 18, predicted: 16 },
  { sprint: 'Sprint 4', count: 20, predicted: 18 },
];

const engagementData = [
  { week: 'Week 1', engagement: 72, blockers: 5 },
  { week: 'Week 2', engagement: 78, blockers: 3 },
  { week: 'Week 3', engagement: 65, blockers: 8 },
  { week: 'Week 4', engagement: 85, blockers: 2 },
];

const sprintPredictability = [
  { sprint: 'Sprint 1', actual: 85, predicted: 87 },
  { sprint: 'Sprint 2', actual: 92, predicted: 90 },
  { sprint: 'Sprint 3', actual: 78, predicted: 85 },
  { sprint: 'Sprint 4', actual: 88, predicted: 88 },
];

export const TrendAnalytics = () => {
  return (
    <Card className="p-4 sm:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Activity className="w-5 h-5" />
        <h3 className="text-base sm:text-lg font-semibold">Trends & AI Insights</h3>
      </div>

      <Tabs defaultValue="completion" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="completion" className="text-[10px] sm:text-xs">Completion</TabsTrigger>
          <TabsTrigger value="engagement" className="text-[10px] sm:text-xs">Engagement</TabsTrigger>
          <TabsTrigger value="predictability" className="text-[10px] sm:text-xs">Predictability</TabsTrigger>
        </TabsList>

        <TabsContent value="completion" className="mt-0">
          <div className="h-[250px] sm:h-[300px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="sprint" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <Card className="p-3 sm:p-4 bg-primary/5 border-primary/20">
            <div className="flex gap-2">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-medium mb-1">AI Insight</p>
                <p className="text-xs text-muted-foreground">
                  Task completion improved <span className="font-semibold text-green-600">+67%</span> over last 4 sprints. 
                  Consistent upward trend suggests improved team capacity and reduced blockers.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-0">
          <div className="h-[250px] sm:h-[300px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="engagement" fill="hsl(var(--primary))" name="Engagement %" />
                <Bar dataKey="blockers" fill="hsl(var(--destructive))" name="Active Blockers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <Card className="p-3 sm:p-4 bg-primary/5 border-primary/20">
            <div className="flex gap-2">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-medium mb-1">AI Insight</p>
                <p className="text-xs text-muted-foreground">
                  Engagement rose <span className="font-semibold text-green-600">+18%</span> in Week 4 after reducing 
                  meeting time by 15 minutes. Blocker resolution improved team morale.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="predictability" className="mt-0">
          <div className="h-[250px] sm:h-[300px] mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sprintPredictability}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="sprint" className="text-xs" />
                <YAxis domain={[0, 100]} className="text-xs" />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual %" />
                <Line type="monotone" dataKey="predicted" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Predicted %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            <Card className="p-3 bg-green-500/10 border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <Badge variant="outline" className="text-[10px] border-green-600 text-green-600">Improving</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Sprint 4 matched prediction perfectly (88%). Team estimation accuracy is increasing.
              </p>
            </Card>
            
            <Card className="p-3 bg-amber-500/10 border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-amber-600" />
                <Badge variant="outline" className="text-[10px] border-amber-600 text-amber-600">Watch</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Sprint 3 underperformed by 7%. Root cause: unexpected dependencies. Addressed in Sprint 4.
              </p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};