import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <SignedOut>
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold mb-4">Welcome to Airodental Billing</h1>
          <p className="text-gray-600 mb-8">
            Professional dental billing management system. Please sign in to continue.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-lg font-semibold mb-2">Get Started</h2>
            <p className="text-sm text-gray-600">
              Click the &ldquo;Sign In&rdquo; or &ldquo;Sign Up&rdquo; button in the header to access your billing dashboard.
            </p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">Billing Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-500">Active patients</p>
            </div>
            
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Pending Bills</h3>
              <p className="text-3xl font-bold text-yellow-600">$0</p>
              <p className="text-sm text-gray-500">Awaiting payment</p>
            </div>
            
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
              <p className="text-3xl font-bold text-green-600">$0</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add Patient
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Create Bill
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                View Reports
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Settings
              </button>
            </div>
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Setup Required</h3>
            <p className="text-sm text-gray-700 mb-4">
              Complete your Supabase database setup to start managing patients and bills.
            </p>
            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
              <li>Create a Supabase project</li>
              <li>Add your database URL and anon key to environment variables</li>
              <li>Run the provided SQL schema to create tables</li>
            </ol>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
