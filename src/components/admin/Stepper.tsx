"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

interface Step {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  completed?: boolean;
  current?: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
  orientation?: "horizontal" | "vertical";
  size?: "sm" | "md" | "lg";
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
  orientation = "horizontal",
  size = "md",
}: StepperProps) {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const stepSizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const connectorHeight = {
    sm: "h-0.5",
    md: "h-1",
    lg: "h-1.5",
  };

  if (orientation === "vertical") {
    return (
      <div className={cn("flex flex-col space-y-4", className)}>
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="flex items-start space-x-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStepClick?.(index);
                  }}
                  className={cn(
                    "relative flex items-center justify-center rounded-full border-2 font-medium transition-all duration-200",
                    stepSizeClasses[size],
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white"
                      : isCompleted
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-300 bg-white text-gray-500 hover:border-gray-400",
                    onStepClick && "cursor-pointer hover:scale-105"
                  )}
                  disabled={!onStepClick}
                  type="button"
                >
                  {step.icon || (
                    <span className="font-semibold">
                      {isCompleted ? "✓" : index + 1}
                    </span>
                  )}
                </button>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 bg-gray-300 mt-2 flex-1 min-h-[24px]",
                      isCompleted && "bg-green-600",
                      connectorHeight[size]
                    )}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-4">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStepClick?.(index);
                  }}
                  className={cn(
                    "text-left font-medium transition-colors w-full",
                    sizeClasses[size],
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                      ? "text-green-600"
                      : "text-gray-500",
                    onStepClick && "cursor-pointer hover:text-gray-700"
                  )}
                  disabled={!onStepClick}
                  type="button"
                >
                  {step.label}
                </button>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="flex items-center justify-between min-w-max pb-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center min-w-0 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onStepClick?.(index);
                  }}
                  className={cn(
                    "relative flex items-center justify-center rounded-full border-2 font-medium transition-all duration-200",
                    stepSizeClasses[size],
                    isActive
                      ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : isCompleted
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-300 bg-white text-gray-500 hover:border-gray-400",
                    onStepClick && "cursor-pointer hover:scale-105"
                  )}
                  disabled={!onStepClick}
                  type="button"
                >
                  {step.icon || (
                    <span className="font-semibold">
                      {isCompleted ? "✓" : index + 1}
                    </span>
                  )}
                </button>
                <div className="mt-2 text-center min-w-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onStepClick?.(index);
                    }}
                    className={cn(
                      "font-medium transition-colors text-xs sm:text-sm",
                      sizeClasses[size],
                      isActive
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-500",
                      onStepClick && "cursor-pointer hover:text-gray-700"
                    )}
                    disabled={!onStepClick}
                    type="button"
                  >
                    <div className="truncate max-w-[60px] sm:max-w-none">
                      {step.label}
                    </div>
                  </button>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1 max-w-[80px] sm:max-w-[120px] truncate hidden sm:block">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 mx-1 sm:mx-2 min-w-[20px] sm:min-w-[40px]",
                    connectorHeight[size],
                    isCompleted ? "bg-green-600" : "bg-gray-300"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

interface StepContentProps {
  steps: Step[];
  currentStep: number;
  children: React.ReactNode;
}

export function StepContent({ steps, currentStep, children }: StepContentProps) {
  const currentStepData = steps[currentStep];
  
  return (
    <div className="mt-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {currentStepData.label}
        </h3>
        {currentStepData.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {currentStepData.description}
          </p>
        )}
      </div>
      <div className="min-h-[400px]">
        {children}
      </div>
    </div>
  );
}

interface StepperNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  isLastStep?: boolean;
  isLoading?: boolean;
  className?: string;
}

export function StepperNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  canGoNext = true,
  canGoPrevious = true,
  isLastStep = false,
  isLoading = false,
  className,
}: StepperNavigationProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between mt-8 gap-4", className)}>
      <div className="text-sm text-gray-500 order-2 sm:order-1">
        Step {currentStep + 1} of {totalSteps}
      </div>
      
      <div className="flex items-center space-x-3 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPrevious?.();
          }}
          disabled={!canGoPrevious || currentStep === 0 || isLoading}
          type="button"
          className="flex-1 sm:flex-none"
        >
          Previous
        </Button>
        
        {isLastStep ? (
          <Button
            onClick={() => onSubmit?.(new Event('submit') as any)}
            disabled={!canGoNext || isLoading}
            className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
          >
            {isLoading ? "Saving..." : "Save Property"}
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNext?.();
            }}
            disabled={!canGoNext || isLoading}
            className="flex-1 sm:flex-none"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
