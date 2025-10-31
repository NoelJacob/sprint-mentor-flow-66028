import { PersonaSwitcher } from "@/components/PersonaSwitcher";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
}

export const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const navigate = useNavigate();

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
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">{subtitle}</p>
            </div>
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            <PersonaSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
};
