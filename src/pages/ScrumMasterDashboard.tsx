import { useState, useEffect } from "react";
import { MetricCard } from "@/components/MetricCard";
import { AIChat } from "@/components/AIChat";
import { SprintHealthScore } from "@/components/SprintHealthScore";
import { DashboardHeader } from "@/components/DashboardHeader";
import { SprintBoard } from "@/components/SprintBoard";
import { SprintInfo } from "@/components/SprintInfo";
import { Backlog } from "@/components/Backlog";
import { useAppContext } from "@/contexts/AppContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";

const ScrumMasterDashboard = () => {
  const { 
    scrumMetrics, 
    setCurrentPersona, 
    tasks, 
    activeSprint, 
    refreshJiraData,
    isLoadingJira,
    sprintHealthScore 
  } = useAppContext();

  useEffect(() => {
    setCurrentPersona('scrum-master');
  }, [setCurrentPersona]);

  const sprintTasks = tasks; // In real scenario, filter by sprint
  const backlogTasks = tasks.filter(t => t.status === 'to-do'); // Simplified backlog

  const sprintMetrics = {
    total: sprintTasks.length,
    completed: sprintTasks.filter(t => t.status === 'done').length,
    inProgress: sprintTasks.filter(t => t.status === 'in-progress').length,
    blocked: sprintTasks.filter(t => t.status === 'blocked').length,
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        title="Scrum Master Dashboard"
        persona="scrum-master"
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Top Action Bar */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sprint Management</h1>
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
          {scrumMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Sprint Health Score */}
        <SprintHealthScore score={sprintHealthScore} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="board" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="board">Sprint Board</TabsTrigger>
                <TabsTrigger value="backlog">Backlog</TabsTrigger>
              </TabsList>
              
              <TabsContent value="board" className="mt-4">
                {activeSprint ? (
                  <>
                    <SprintInfo 
                      sprint={activeSprint}
                      tasksTotal={sprintMetrics.total}
                      tasksCompleted={sprintMetrics.completed}
                      tasksInProgress={sprintMetrics.inProgress}
                      tasksBlocked={sprintMetrics.blocked}
                    />
                    <div className="mt-6">
                      <SprintBoard tasks={sprintTasks} />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No active sprint. Start a new sprint to begin tracking tasks.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="backlog" className="mt-4">
                <Backlog tasks={backlogTasks} />
              </TabsContent>
            </Tabs>
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

export default ScrumMasterDashboard;
