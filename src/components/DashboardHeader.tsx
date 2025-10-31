import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PersonaType } from "@/types";

interface DashboardHeaderProps {
  title: string;
  persona: PersonaType;
}

export const DashboardHeader = ({ title, persona }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  
  const getRoleLabel = (persona: PersonaType) => {
    return persona === 'scrum-master' ? 'Scrum Master' : 'Tech Lead';
  };

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="flex-shrink-0" aria-label="Go back to home">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate">{title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{getRoleLabel(persona)} View</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
