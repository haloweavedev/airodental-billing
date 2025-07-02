"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Type definition for the form data matching Practice model
export interface PracticeFormData {
  // [1] PRACTICE IDENTITY
  name: string;
  address?: string;
  city?: string;
  state?: string;
  locationContext?: string;
  directions?: string;
  doctors?: string; // Using string for textarea input, will parse to JSON later
  hygienists?: string; // Using string for textarea input, will parse to JSON later

  // [2] OFFICE LOGISTICS & CULTURE
  tone: string;
  offTopicResponse?: string;
  seesKids: boolean;
  acceptsWalkIns?: string;
  vendorCallPolicy?: string;
  offersSameDayTreatment: boolean;

  // [3] NEW PATIENT SCHEDULING FLOW
  newPatientFlow?: string;
  newPatientSpecialOffer: boolean;
  newPatientSpecialDetails?: string;
  mentionSpecialOfferProactively: boolean;

  // [4] INSURANCE PARTICIPATION
  inNetworkPPOs: string[];
  deltaDentalTier?: string;
  deltaDentalOutOfNetworkDetails?: string;
  acceptsMedicaid: boolean;
  medicaidStateName?: string;
  medicaidNotAcceptedPhrase?: string;
  acceptsHMO_DMO: boolean;
  hmoDmoNotAcceptedPhrase?: string;
  dualInsuranceNotes?: string;
  inHouseSavingsPlanDetails?: string;

  // [5] INSURANCE HANDLING DETAILS
  collectInsuranceCompany: boolean;
  collectSubscriberName: boolean;
  collectSubscriberDob: boolean;
  collectInsuranceId: boolean;
  collectGroupId: boolean;
  collectSubscriberEmployer: boolean;
  confirmNameSpelling: boolean;
  validateNumbers: boolean;

  // [6] APPOINTMENT TYPES TO OFFER
  offeredAppointmentTypes: string[];

  // [7] SCHEDULING LOGISTICS
  schedulingTimeframeLimit?: string;
  schedulingPriority: string;
  appointmentOfferSequence?: string; // Using string for textarea input, will parse to JSON later

  // [8] ADDITIONAL PROMPTS & EDGE CASES
  promptForFamilyScheduling: boolean;
  handleInsuranceNotOnFile?: string;
  handleQuoteRequest?: string;
  handleGeneralQuestion?: string;
  handleSpecificProviderRequest?: string;
}

interface OnboardingContextType {
  formData: PracticeFormData;
  setFormData: React.Dispatch<React.SetStateAction<PracticeFormData>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Default form data with sensible defaults matching the Practice model
const defaultFormData: PracticeFormData = {
  // [1] PRACTICE IDENTITY
  name: '',
  address: '',
  city: '',
  state: '',
  locationContext: '',
  directions: '',
  doctors: '',
  hygienists: '',

  // [2] OFFICE LOGISTICS & CULTURE
  tone: 'warm, professional, human',
  offTopicResponse: '',
  seesKids: false,
  acceptsWalkIns: '',
  vendorCallPolicy: '',
  offersSameDayTreatment: false,

  // [3] NEW PATIENT SCHEDULING FLOW
  newPatientFlow: '',
  newPatientSpecialOffer: false,
  newPatientSpecialDetails: '',
  mentionSpecialOfferProactively: false,

  // [4] INSURANCE PARTICIPATION
  inNetworkPPOs: [],
  deltaDentalTier: '',
  deltaDentalOutOfNetworkDetails: '',
  acceptsMedicaid: false,
  medicaidStateName: '',
  medicaidNotAcceptedPhrase: '',
  acceptsHMO_DMO: false,
  hmoDmoNotAcceptedPhrase: '',
  dualInsuranceNotes: '',
  inHouseSavingsPlanDetails: '',

  // [5] INSURANCE HANDLING DETAILS
  collectInsuranceCompany: true,
  collectSubscriberName: true,
  collectSubscriberDob: true,
  collectInsuranceId: true,
  collectGroupId: true,
  collectSubscriberEmployer: true,
  confirmNameSpelling: true,
  validateNumbers: true,

  // [6] APPOINTMENT TYPES TO OFFER
  offeredAppointmentTypes: [],

  // [7] SCHEDULING LOGISTICS
  schedulingTimeframeLimit: '',
  schedulingPriority: 'First availability',
  appointmentOfferSequence: '',

  // [8] ADDITIONAL PROMPTS & EDGE CASES
  promptForFamilyScheduling: false,
  handleInsuranceNotOnFile: '',
  handleQuoteRequest: '',
  handleGeneralQuestion: '',
  handleSpecificProviderRequest: '',
};

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<PracticeFormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState<number>(1);

  return (
    <OnboardingContext.Provider value={{
      formData,
      setFormData,
      currentStep,
      setCurrentStep
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
} 