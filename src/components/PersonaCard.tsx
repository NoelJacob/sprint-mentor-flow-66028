import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCircle, Code } from "lucide-react";
import { PersonaType } from "@/types";

interface PersonaCardProps {
  type: PersonaType;
  onSelect: (type: PersonaType) => void;
}

export const PersonaCard = ({ type, onSelect }: PersonaCardProps) => {
  const isScrumMaster = type === 'scrum-master';
  
  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => onSelect(type)}>
      <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${
          isScrumMaster ? 'bg-gradient-primary' : 'bg-gradient-success'
        }`}>
          {isScrumMaster ? (
            <UserCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          ) : (
            <Code className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          )}
        </div>
        <div>
          <h3 className="text-base sm:text-xl font-semibold mb-1.5 sm:mb-2">
            {isScrumMaster ? 'Scrum Master' : 'Tech Lead'}
          </h3>
          <p className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">
            {isScrumMaster 
              ? 'Manage sprint health, team engagement, and blockers' 
              : 'Track stories, technical debt, and dependencies'}
          </p>
        </div>
        <Button className="w-full text-sm sm:text-base h-9 sm:h-10">
          Enter Dashboard
        </Button>
      </div>
    </Card>
  );
};
