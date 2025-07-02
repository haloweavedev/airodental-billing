"use server";

import { auth, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { PracticeFormData } from '@/contexts/onboarding-context';

export async function completeOnboarding(formData: PracticeFormData) {
  try {
    // Get the current user
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Create a new Clerk Organization
    const client = await clerkClient();
    const organization = await client.organizations.createOrganization({
      name: formData.name,
      createdBy: userId,
    });

    // Initialize Prisma client
    const prisma = new PrismaClient();

    try {
      // Parse JSON fields from string inputs
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

      // Create the Practice record
      await prisma.practice.create({
        data: {
          clerkOrganizationId: organization.id,
          
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

      console.log('Successfully created practice with organization ID:', organization.id);
      
    } finally {
      await prisma.$disconnect();
    }

    // Redirect to dashboard
    redirect('/dashboard');
    
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw new Error('Failed to complete onboarding. Please try again.');
  }
} 