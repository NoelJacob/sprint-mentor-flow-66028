import { useState, useEffect } from "react";
import { MetricCard } from "@/components/MetricCard";
import { AIChat } from "@/components/AIChat";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SprintBoard } from "@/components/SprintBoard";
import { DependencyMap } from "@/components/DependencyMap";
import { useAppContext } from "@/contexts/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const TechLeadDashboard = () => {
  const { 
    techMetrics, 
    setCurrentPersona, 
    tasks,
    dependencies,
    refreshJiraData,
    isLoadingJira 
  } = useAppContext();

  useEffect(() => {
    setCurrentPersona('tech-lead');
  }, [setCurrentPersona]);

  const blockedTasks = tasks.filter(t => t.status === 'blocked');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'done');

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Tech Lead Dashboard"
        persona="tech-lead"
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Top Action Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Technical Overview</h1>
          <Button 
            onClick={refreshJiraData} 
            disabled={isLoadingJira}
            variant="outline"
            size="sm"
          >
            {isLoadingJira ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync with Jira
              </>
            )}
          </Button>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Blocked Tasks Alert */}
        {blockedTasks.length > 0 && (
          <Card className="p-4 bg-red-50 border-red-200">
            <h3 className="font-semibold text-red-800 mb-2">⚠️ {blockedTasks.length} Blocked Task{blockedTasks.length !== 1 ? 's' : ''}</h3>
            <div className="space-y-2">
              {blockedTasks.map(task => (
                <div key={task.id} className="text-sm">
                  <span className="font-mono text-xs text-red-700">{task.key}</span>
                  <span className="ml-2 text-red-900">{task.title}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="board" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="board">Task Board</TabsTrigger>
                <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="board" className="mt-4">
                <SprintBoard tasks={tasks} />
              </TabsContent>
              
              <TabsContent value="dependencies" className="mt-4">
                {dependencies.length > 0 ? (
                  <DependencyMap nodes={dependencies} />
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    <p>No dependencies tracked yet.</p>
                    <p className="text-sm mt-2">Dependencies will appear here as they are identified.</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Task Summary */}
            <Card className="mt-6 p-6">
              <h3 className="font-semibold mb-4">Task Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{inProgressTasks.length}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{completedTasks.length}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600">{blockedTasks.length}</div>
                  <div className="text-sm text-muted-foreground">Blocked</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - AI Chat */}
          <div className="lg:col-span-1">
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechLeadDashboard;
