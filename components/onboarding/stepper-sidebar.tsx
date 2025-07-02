"use client";

import { useOnboarding } from '@/contexts/onboarding-context';

const steps = [
  { number: 1, title: "Practice Identity", description: "Basic practice information" },
  { number: 2, title: "Office Logistics & Culture", description: "Tone and policies" },
  { number: 3, title: "New Patient Scheduling Flow", description: "Patient onboarding process" },
  { number: 4, title: "Insurance Participation", description: "Insurance networks and policies" },
  { number: 5, title: "Insurance Handling", description: "Data collection preferences" },
  { number: 6, title: "Appointment Types to Offer", description: "Available services" },
  { number: 7, title: "Scheduling Logistics", description: "Appointment scheduling rules" },
  { number: 8, title: "Additional Prompts & Edge Cases", description: "Special handling scenarios" },
];

export function StepperSidebar() {
  const { currentStep } = useOnboarding();

  return (
    <div className="w-80 bg-gray-50 border-r min-h-screen p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Practice Setup</h2>
      <nav className="space-y-4">
        {steps.map((step) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          
          return (
            <div
              key={step.number}
              className={`flex items-start space-x-3 ${
                isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-900'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </nav>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Step {currentStep} of {steps.length}
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
} 