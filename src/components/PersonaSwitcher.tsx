import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { UserCircle, Code } from "lucide-react";

export const PersonaSwitcher = () => {
  const { currentPersona, setCurrentPersona } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSwitch = () => {
    const newPersona = currentPersona === 'scrum-master' ? 'tech-lead' : 'scrum-master';
    setCurrentPersona(newPersona);
    navigate(newPersona === 'scrum-master' ? '/scrum-master' : '/tech-lead');
  };

  // Only show on dashboard pages
  if (location.pathname === '/') return null;

  const otherPersona = currentPersona === 'scrum-master' ? 'Tech Lead' : 'Scrum Master';
  const Icon = currentPersona === 'scrum-master' ? Code : UserCircle;

  return (
    <Button variant="outline" size="sm" onClick={handleSwitch} className="gap-1.5 sm:gap-2 text-xs sm:text-sm whitespace-nowrap">
      <Icon className="w-3.5 sm:w-4 h-3.5 sm:h-4 flex-shrink-0" />
      <span className="hidden sm:inline">Switch to {otherPersona}</span>
      <span className="sm:hidden">{currentPersona === 'scrum-master' ? 'TL' : 'SM'}</span>
    </Button>
  );
};
