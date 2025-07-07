
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  isMultiDayTour: boolean;
  onPrev: () => void;
  onNext: () => void;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function StepNavigation({
  steps,
  currentStep,
  isMultiDayTour,
  onPrev,
  onNext,
  progress,
  isFirstStep,
  isLastStep,
}: StepNavigationProps) {
  // Kısaltılmış ve yeniden sıralanmış adım yapısı. Accommodation atlaması kaldırıldı.
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step) => {
          // Eski adım atlama kodları kaldırıldı, artık tüm adımlar sıralı olarak gösterilir
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isActive
                    ? "border-primary text-primary bg-primary/10"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div className="text-center">
                <div
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
