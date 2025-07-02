import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { SettingsClientPage } from '@/components/settings/settings-client-page';

export default async function SettingsPage() {
  // Get organization ID from auth
  const { orgId } = await auth();
  
  if (!orgId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Active Organization</h1>
          <p className="text-gray-600">No active organization found. Please contact support.</p>
        </div>
      </div>
    );
  }

  // Check for admin role
  const { has } = await auth();
  const isAdmin = has({ role: 'org:admin' });
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be an organization administrator to access practice settings.</p>
        </div>
      </div>
    );
  }

  // Fetch practice data
  const prisma = new PrismaClient();
  
  try {
    const practice = await prisma.practice.findUnique({
      where: { clerkOrganizationId: orgId },
    });

    if (!practice) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Practice Not Found</h1>
            <p className="text-gray-600">Practice settings not found. Please complete onboarding first.</p>
          </div>
        </div>
      );
    }

    // Pass practice data to client component
    return <SettingsClientPage practice={practice} />;
    
  } catch (error) {
    console.error('Error fetching practice:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600">An error occurred while loading practice settings.</p>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
} 