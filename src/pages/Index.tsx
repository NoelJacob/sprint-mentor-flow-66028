import { PersonaCard } from "@/components/PersonaCard";
import { PersonaType } from "@/types";
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handlePersonaSelect = (type: PersonaType) => {
    if (type === 'scrum-master') {
      navigate('/scrum-master');
    } else {
      navigate('/tech-lead');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 rounded-full mb-4 sm:mb-6">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">AI-Powered Agile Coach</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-primary bg-clip-text text-transparent px-4">
              Agentic AI Coach
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Real-time insights and proactive nudges for Scrum Masters and Tech Leads. 
              Choose your persona to explore the dashboard.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto px-4">
            <PersonaCard 
              type="scrum-master" 
              onSelect={handlePersonaSelect}
            />
            <PersonaCard 
              type="tech-lead" 
              onSelect={handlePersonaSelect}
            />
          </div>

          <div className="mt-10 sm:mt-16 text-center px-4">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Key Features</p>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
              <div className="p-3 sm:p-4 rounded-lg bg-card border">
                <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">Real-time Metrics</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Monitor sprint health, engagement, and velocity
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-card border">
                <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">Smart Nudges</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  AI-powered recommendations with actionable insights
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-card border">
                <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2">Interactive Simulator</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Trigger events and see AI responses in real-time
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
