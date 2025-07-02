"use client";

import { useOnboarding } from '@/contexts/onboarding-context';
import { PracticeIdentityForm } from '@/components/onboarding/practice-identity-form';
import { Button } from '@/components/ui/button';
import { completeOnboarding } from './actions';
import { useState } from 'react';

export default function OnboardingPage() {
  const { currentStep, setCurrentStep, formData } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    try {
      setIsSubmitting(true);
      await completeOnboarding(formData);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('There was an error completing your setup. Please try again.');
      setIsSubmitting(false);
    }
  };

  const isNextDisabled = currentStep === 1 && !formData.name.trim();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Practice Setup
        </h1>
        <p className="text-lg text-gray-600">
          Configure your dental practice to personalize your Laine AI assistant.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
        {/* Form Content */}
        <div className="mb-8">
          {currentStep === 1 && <PracticeIdentityForm />}
          {currentStep > 1 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Step {currentStep}: Coming Soon
              </h2>
              <p className="text-gray-600">
                This step will be implemented in future phases. For now, you can navigate back to step 1 or continue to test the flow.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>

          <div className="flex items-center space-x-4">
            {currentStep === 1 && (
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-500">
                  {formData.name.trim() ? 'Ready to continue' : 'Please enter office name to continue'}
                </p>
                {formData.name.trim() && (
                  <Button
                    onClick={handleFinish}
                    disabled={isSubmitting}
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    {isSubmitting ? 'Creating...' : 'Test Finish Setup'}
                  </Button>
                )}
              </div>
            )}
            
            {currentStep < 8 ? (
              <Button
                onClick={handleNext}
                disabled={isNextDisabled}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Your Practice...' : 'Finish Setup'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 