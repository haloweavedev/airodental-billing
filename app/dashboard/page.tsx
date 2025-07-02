import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to the Airodental Billing Dashboard! Manage your organization, team, and billing from here.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Billing Management Card */}
          <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Billing Management</h2>
                <p className="text-gray-600 text-sm">View usage, manage subscriptions, and handle payments</p>
              </div>
            </div>
            <Link href="/dashboard/billing">
              <Button className="w-full">
                Manage Billing
              </Button>
            </Link>
          </div>

          {/* Team Management Card */}
          <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Team Management</h2>
                <p className="text-gray-600 text-sm">Invite members, assign roles, and manage permissions</p>
              </div>
            </div>
            <Link href="/dashboard/team">
              <Button className="w-full" variant="outline">
                Manage Team
              </Button>
            </Link>
          </div>

          {/* Practice Settings Card */}
          <div className="bg-white rounded-lg border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold">Practice Settings</h2>
                <p className="text-gray-600 text-sm">Configure practice information and preferences</p>
              </div>
            </div>
            <Link href="/dashboard/settings">
              <Button className="w-full" variant="outline">
                Manage Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/laine">
              <Button variant="outline" size="sm">
                Laine Assistant
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="sm">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 