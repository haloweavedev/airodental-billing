import { auth } from '@clerk/nextjs/server';
import { OrganizationProfile } from '@clerk/nextjs';

export default async function TeamPage() {
  const { has } = await auth();
  
  // Check if the user has admin role
  const isAdmin = has({ role: 'org:admin' });

  if (!isAdmin) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-gray-600">
          You do not have permission to view this page. Only organization administrators can manage team members.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Team Management</h1>
        <p className="text-gray-600 mb-8">
          Manage your team members, send invitations, and assign roles within your organization.
        </p>
        
        <div className="bg-white rounded-lg shadow-sm border">
          <OrganizationProfile 
            appearance={{
              elements: {
                card: 'shadow-none border-none',
                navbar: 'hidden',
                pageScrollBox: 'p-6',
                page: 'bg-transparent',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 