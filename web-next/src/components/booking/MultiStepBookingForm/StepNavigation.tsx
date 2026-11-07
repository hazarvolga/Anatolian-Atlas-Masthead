"use client";

import { Check } from "lucide-react";

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
}: StepNavigationProps) {
  return (
    <div className="w-full mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 border border-border divide-y sm:divide-y-0 sm:divide-x divide-border bg-card">
        {steps.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div
              key={step.id}
              className={`p-4 sm:p-5 flex items-start gap-3.5 transition-colors ${
                isActive
                  ? "bg-foreground text-background"
                  : isCompleted
                    ? "bg-card text-foreground"
                    : "bg-background/60 text-text-secondary"
              }`}
            >
              <div
                className={`w-7 h-7 shrink-0 flex items-center justify-center text-xs font-semibold tabular-nums border ${
                  isCompleted
                    ? "bg-primary border-primary text-primary-foreground"
                    : isActive
                      ? "border-[#D89A8B] text-[#D89A8B]"
                      : "border-border text-text-secondary"
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span>0{step.id}</span>
                )}
              </div>
              <div>
                <div
                  className={`font-serif text-base leading-tight ${
                    isActive
                      ? "text-background"
                      : isCompleted
                        ? "text-foreground"
                        : "text-text-secondary"
                  }`}
                >
                  {step.title}
                </div>
                <div
                  className={`text-[11px] mt-0.5 ${
                    isActive ? "text-background/70" : "text-text-secondary"
                  }`}
                >
                  {step.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
