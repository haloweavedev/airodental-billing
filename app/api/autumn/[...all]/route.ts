import { autumnHandler } from "autumn-js/next";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

export const { GET, POST } = autumnHandler({
  identify: async () => {
    // The auth() function provides access to the current auth state.
    // It needs to be called within a route handler or server component.
    const { orgId, orgSlug } = await auth(); // auth() must be called once per request and awaited
    const user = await currentUser(); // To get email or name if needed

    if (!orgId) {
      // Autumn requires a customerId. If billing is strictly org-based,
      // and there's no orgId, we might not be able to proceed.
      // For Laine, billing is at the organization level.
      // Consider if user-level billing is a fallback or if org is mandatory.
      // For this MVP, orgId is mandatory for billing.
      console.error("Autumn Handler: No organization ID found in session.");
      // Return a structure that Autumn expects, perhaps indicating an error or undefined customer
      // Or throw an error if Autumn's handler can gracefully catch it.
      // For now, let's return undefined customerId if no orgId, Autumn might handle this.
      // Or, better, ensure users are in an org context before they can access billing features.
      return {
        customerId: undefined, // Or throw new Error("Organization context required for billing");
        // customerData: {},
      };
    }

    let organizationName = `Org: ${orgId}`; // Default
    if (orgSlug) {
      organizationName = orgSlug; // Use slug if available
    }
    
    try {
      const clerk = await clerkClient();
      const clerkOrg = await clerk.organizations.getOrganization({ organizationId: orgId });
      if (clerkOrg?.name) {
        organizationName = clerkOrg.name; // Prefer full name
      }
    } catch (error) {
      console.warn(`Autumn Handler: Could not fetch organization details for ${orgId}:`, error);
      // Fallback to orgSlug or orgId is already set
    }

    // console.log(`Autumn Handler: Identifying customer. Org ID: ${orgId}, User ID: ${userId}`);

    return {
      customerId: orgId, // Use the organization ID as the customer ID for Autumn
      customerData: {
        // Optional: Provide additional data about the customer
        // This data is stored in Autumn and can be useful for CRM or analytics.
        name: organizationName,
        email: user?.primaryEmailAddress?.emailAddress, // Email of the user initiating (admin/member)
      },
    };
  },
  // You can also include onAttach, onCheck, onTrack callbacks here if needed
  // for custom logic before/after Autumn API calls.
  // Example:
  // onCheck: async (payload) => {
  //   console.log("Autumn onCheck:", payload);
  //   return payload; // Must return the payload
  // },
}); 