"use client";

import { useState } from 'react';
import { Practice } from '@prisma/client';
import { OnboardingProvider, useOnboarding } from '@/contexts/onboarding-context';
import { PracticeIdentityForm } from '@/components/onboarding/practice-identity-form';
import { updatePracticeSettings } from '@/app/dashboard/settings/actions';

interface SettingsClientPageProps {
  practice: Practice;
}

function SettingsForm() {
  const { formData } = useOnboarding();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await updatePracticeSettings(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Settings updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update settings' });
      }
    } catch {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Settings</h1>
        <p className="text-gray-600">
          Update your practice configuration. Changes will be saved when you click &quot;Save Changes&quot;.
        </p>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="bg-white space-y-6">
        <PracticeIdentityForm />
        
        <div className="pt-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className={`px-6 py-2 rounded-md font-medium ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsClientPage({ practice }: SettingsClientPageProps) {
  return (
    <OnboardingProvider initialData={practice}>
      <SettingsForm />
    </OnboardingProvider>
  );
} 