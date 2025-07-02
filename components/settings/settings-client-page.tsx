"use client";

import React, { useState } from 'react';
import { Practice } from '@prisma/client';
import { useOnboarding } from '@/contexts/onboarding-context';
import { PracticeIdentityForm } from '@/components/onboarding/practice-identity-form';
import { updatePracticeSettings } from '@/app/dashboard/settings/actions';

interface SettingsClientPageProps {
  practice: Practice;
}

function SettingsForm({ practice }: { practice: Practice }) {
  const { formData, setFormData } = useOnboarding();

  // Initialize form data with practice data on mount
  React.useEffect(() => {
    const initialFormData = {
      // [1] PRACTICE IDENTITY
      name: practice.name || '',
      address: practice.address || '',
      city: practice.city || '',
      state: practice.state || '',
      locationContext: practice.locationContext || '',
      directions: practice.directions || '',
      doctors: (practice.doctors as { text?: string })?.text || '',
      hygienists: (practice.hygienists as { text?: string })?.text || '',

      // [2] OFFICE LOGISTICS & CULTURE
      tone: practice.tone || 'warm, professional, human',
      offTopicResponse: practice.offTopicResponse || '',
      seesKids: practice.seesKids || false,
      acceptsWalkIns: practice.acceptsWalkIns || '',
      vendorCallPolicy: practice.vendorCallPolicy || '',
      offersSameDayTreatment: practice.offersSameDayTreatment || false,

      // [3] NEW PATIENT SCHEDULING FLOW
      newPatientFlow: practice.newPatientFlow || '',
      newPatientSpecialOffer: practice.newPatientSpecialOffer || false,
      newPatientSpecialDetails: practice.newPatientSpecialDetails || '',
      mentionSpecialOfferProactively: practice.mentionSpecialOfferProactively || false,

      // [4] INSURANCE PARTICIPATION
      inNetworkPPOs: practice.inNetworkPPOs || [],
      deltaDentalTier: practice.deltaDentalTier || '',
      deltaDentalOutOfNetworkDetails: practice.deltaDentalOutOfNetworkDetails || '',
      acceptsMedicaid: practice.acceptsMedicaid || false,
      medicaidStateName: practice.medicaidStateName || '',
      medicaidNotAcceptedPhrase: practice.medicaidNotAcceptedPhrase || '',
      acceptsHMO_DMO: practice.acceptsHMO_DMO || false,
      hmoDmoNotAcceptedPhrase: practice.hmoDmoNotAcceptedPhrase || '',
      dualInsuranceNotes: practice.dualInsuranceNotes || '',
      inHouseSavingsPlanDetails: practice.inHouseSavingsPlanDetails || '',

      // [5] INSURANCE HANDLING DETAILS
      collectInsuranceCompany: practice.collectInsuranceCompany ?? true,
      collectSubscriberName: practice.collectSubscriberName ?? true,
      collectSubscriberDob: practice.collectSubscriberDob ?? true,
      collectInsuranceId: practice.collectInsuranceId ?? true,
      collectGroupId: practice.collectGroupId ?? true,
      collectSubscriberEmployer: practice.collectSubscriberEmployer ?? true,
      confirmNameSpelling: practice.confirmNameSpelling ?? true,
      validateNumbers: practice.validateNumbers ?? true,

      // [6] APPOINTMENT TYPES TO OFFER
      offeredAppointmentTypes: practice.offeredAppointmentTypes || [],

      // [7] SCHEDULING LOGISTICS
      schedulingTimeframeLimit: practice.schedulingTimeframeLimit || '',
      schedulingPriority: practice.schedulingPriority || 'First availability',
      appointmentOfferSequence: (practice.appointmentOfferSequence as { text?: string })?.text || '',

      // [8] ADDITIONAL PROMPTS & EDGE CASES
      promptForFamilyScheduling: practice.promptForFamilyScheduling || false,
      handleInsuranceNotOnFile: practice.handleInsuranceNotOnFile || '',
      handleQuoteRequest: practice.handleQuoteRequest || '',
      handleGeneralQuestion: practice.handleGeneralQuestion || '',
      handleSpecificProviderRequest: practice.handleSpecificProviderRequest || '',
    };

    setFormData(initialFormData);
  }, [practice, setFormData]);
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
  return <SettingsForm practice={practice} />;
} 