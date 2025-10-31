import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PersonaType } from "@/types";
import { CheckCircle, Sparkles, BarChart3, GitBranch } from "lucide-react";

interface OnboardingDialogProps {
  open: boolean;
  onClose: () => void;
  persona: PersonaType;
}

export const OnboardingDialog = ({ open, onClose, persona }: OnboardingDialogProps) => {
  const [step, setStep] = useState(0);

  const scrumMasterSteps = [
    {
      title: "Welcome, Scrum Master!",
      description: "Your AI Coach monitors sprint health, team engagement, and blockers in real-time.",
      icon: <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />,
    },
    {
      title: "Smart Nudges",
      description: "Get proactive recommendations when engagement drops, retrospectives need attention, or refinement is overdue.",
      icon: <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-success" />,
    },
    {
      title: "Take Action",
      description: "Accept, dismiss, or snooze each nudge. Your actions help the AI learn and improve over time.",
      icon: <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />,
    },
  ];

  const techLeadSteps = [
    {
      title: "Welcome, Tech Lead!",
      description: "Track user story progress, technical debt, and dependency risks with AI-powered insights.",
      icon: <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />,
    },
    {
      title: "Dependency Intelligence",
      description: "Visualize story dependencies and get alerts when blocked items threaten sprint goals.",
      icon: <GitBranch className="w-10 h-10 sm:w-12 sm:h-12 text-warning" />,
    },
    {
      title: "Risk Management",
      description: "Receive nudges about late APIs, technical debt spikes, and stories at risk. Escalate or adjust priorities easily.",
      icon: <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />,
    },
  ];

  const steps = persona === 'scrum-master' ? scrumMasterSteps : techLeadSteps;
  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setStep(0);
      onClose();
    }
  };

  const handleSkip = () => {
    setStep(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleSkip}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-4 sm:p-6">
        <DialogHeader>
          <div className="flex justify-center mb-3 sm:mb-4">{currentStep.icon}</div>
          <DialogTitle className="text-center text-lg sm:text-xl md:text-2xl px-2">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-center text-xs sm:text-sm md:text-base pt-1.5 sm:pt-2 px-2">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="ghost" onClick={handleSkip} className="w-full sm:w-auto h-9 sm:h-10 text-sm">
            Skip
          </Button>
          <Button onClick={handleNext} className="w-full sm:w-auto h-9 sm:h-10 text-sm">
            {step < steps.length - 1 ? 'Next' : 'Get Started'}
          </Button>
        </DialogFooter>
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-1 sm:mt-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 sm:h-1.5 w-6 sm:w-8 rounded-full transition-colors ${
                idx === step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
