"use server";

import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { PracticeFormData } from '@/contexts/onboarding-context';

export async function updatePracticeSettings(formData: PracticeFormData) {
  try {
    // Get organization ID and check auth
    const { orgId } = await auth();
    
    if (!orgId) {
      return {
        success: false,
        error: 'No active organization found'
      };
    }

    // Check for admin role
    const { has } = await auth();
    const isAdmin = has({ role: 'org:admin' });
    
    if (!isAdmin) {
      return {
        success: false,
        error: 'You must be an organization administrator to update practice settings'
      };
    }

    // Initialize Prisma client
    const prisma = new PrismaClient();

    try {
      // Parse JSON fields from string inputs (same logic as onboarding)
      let doctors = undefined;
      let hygienists = undefined;
      let appointmentOfferSequence = undefined;

      if (formData.doctors?.trim()) {
        doctors = { text: formData.doctors };
      }

      if (formData.hygienists?.trim()) {
        hygienists = { text: formData.hygienists };
      }

      if (formData.appointmentOfferSequence?.trim()) {
        appointmentOfferSequence = { text: formData.appointmentOfferSequence };
      }

      // Update the Practice record
      await prisma.practice.update({
        where: { clerkOrganizationId: orgId },
        data: {
          // [1] PRACTICE IDENTITY
          name: formData.name,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          locationContext: formData.locationContext || null,
          directions: formData.directions || null,
          doctors: doctors,
          hygienists: hygienists,

          // [2] OFFICE LOGISTICS & CULTURE
          tone: formData.tone,
          offTopicResponse: formData.offTopicResponse || null,
          seesKids: formData.seesKids,
          acceptsWalkIns: formData.acceptsWalkIns || null,
          vendorCallPolicy: formData.vendorCallPolicy || null,
          offersSameDayTreatment: formData.offersSameDayTreatment,

          // [3] NEW PATIENT SCHEDULING FLOW
          newPatientFlow: formData.newPatientFlow || null,
          newPatientSpecialOffer: formData.newPatientSpecialOffer,
          newPatientSpecialDetails: formData.newPatientSpecialDetails || null,
          mentionSpecialOfferProactively: formData.mentionSpecialOfferProactively,

          // [4] INSURANCE PARTICIPATION
          inNetworkPPOs: formData.inNetworkPPOs,
          deltaDentalTier: formData.deltaDentalTier || null,
          deltaDentalOutOfNetworkDetails: formData.deltaDentalOutOfNetworkDetails || null,
          acceptsMedicaid: formData.acceptsMedicaid,
          medicaidStateName: formData.medicaidStateName || null,
          medicaidNotAcceptedPhrase: formData.medicaidNotAcceptedPhrase || null,
          acceptsHMO_DMO: formData.acceptsHMO_DMO,
          hmoDmoNotAcceptedPhrase: formData.hmoDmoNotAcceptedPhrase || null,
          dualInsuranceNotes: formData.dualInsuranceNotes || null,
          inHouseSavingsPlanDetails: formData.inHouseSavingsPlanDetails || null,

          // [5] INSURANCE HANDLING DETAILS
          collectInsuranceCompany: formData.collectInsuranceCompany,
          collectSubscriberName: formData.collectSubscriberName,
          collectSubscriberDob: formData.collectSubscriberDob,
          collectInsuranceId: formData.collectInsuranceId,
          collectGroupId: formData.collectGroupId,
          collectSubscriberEmployer: formData.collectSubscriberEmployer,
          confirmNameSpelling: formData.confirmNameSpelling,
          validateNumbers: formData.validateNumbers,

          // [6] APPOINTMENT TYPES TO OFFER
          offeredAppointmentTypes: formData.offeredAppointmentTypes,

          // [7] SCHEDULING LOGISTICS
          schedulingTimeframeLimit: formData.schedulingTimeframeLimit || null,
          schedulingPriority: formData.schedulingPriority,
          appointmentOfferSequence: appointmentOfferSequence,

          // [8] ADDITIONAL PROMPTS & EDGE CASES
          promptForFamilyScheduling: formData.promptForFamilyScheduling,
          handleInsuranceNotOnFile: formData.handleInsuranceNotOnFile || null,
          handleQuoteRequest: formData.handleQuoteRequest || null,
          handleGeneralQuestion: formData.handleGeneralQuestion || null,
          handleSpecificProviderRequest: formData.handleSpecificProviderRequest || null,
        },
      });

      console.log('Successfully updated practice settings for organization:', orgId);
      
      // Revalidate the settings page to show fresh data
      revalidatePath('/dashboard/settings');
      
      return {
        success: true,
        message: 'Practice settings updated successfully'
      };
      
    } finally {
      await prisma.$disconnect();
    }
    
  } catch (error) {
    console.error('Error updating practice settings:', error);
    return {
      success: false,
      error: 'Failed to update practice settings. Please try again.'
    };
  }
} 