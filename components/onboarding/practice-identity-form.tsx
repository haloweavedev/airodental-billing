"use client";

import { useOnboarding } from '@/contexts/onboarding-context';

export function PracticeIdentityForm() {
  const { formData, setFormData } = useOnboarding();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Identity</h2>
        <p className="text-gray-600">
          Let&apos;s start with the basic information about your dental practice.
        </p>
      </div>

      <div className="space-y-6">
        {/* Office Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Office Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your practice name"
            required
          />
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Practice Address</h3>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                id="city"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City name"
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                id="state"
                value={formData.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="State"
              />
            </div>
          </div>
        </div>

        {/* Location Context */}
        <div>
          <label htmlFor="locationContext" className="block text-sm font-medium text-gray-700 mb-2">
            Physical Location Context
          </label>
          <textarea
            id="locationContext"
            value={formData.locationContext || ''}
            onChange={(e) => handleInputChange('locationContext', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Near the intersection of Main St and Oak Ave, next to the shopping center"
          />
          <p className="mt-1 text-sm text-gray-500">
            Describe landmarks, intersections, or nearby businesses that help patients locate your office.
          </p>
        </div>

        {/* Directions */}
        <div>
          <label htmlFor="directions" className="block text-sm font-medium text-gray-700 mb-2">
            Turn-by-turn Directions
          </label>
          <textarea
            id="directions"
            value={formData.directions || ''}
            onChange={(e) => handleInputChange('directions', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Take Main St exit, turn right, we're in the second building on the left with blue awning"
          />
          <p className="mt-1 text-sm text-gray-500">
            Detailed directions that Laine can provide to patients over the phone.
          </p>
        </div>

        {/* Staff Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Staff Information</h3>
          
          <div>
            <label htmlFor="doctors" className="block text-sm font-medium text-gray-700 mb-2">
              Doctor&apos;s Full Names + Pronunciation Guide
            </label>
            <textarea
              id="doctors"
              value={formData.doctors || ''}
              onChange={(e) => handleInputChange('doctors', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Dr. Sarah Johnson (JOHN-son), Dr. Michael Chen (CHEN)"
            />
            <p className="mt-1 text-sm text-gray-500">
              List each doctor with pronunciation guides in parentheses if needed.
            </p>
          </div>

          <div>
            <label htmlFor="hygienists" className="block text-sm font-medium text-gray-700 mb-2">
              Hygienist Names
            </label>
            <textarea
              id="hygienists"
              value={formData.hygienists || ''}
              onChange={(e) => handleInputChange('hygienists', e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Lisa Smith, Maria Rodriguez"
            />
            <p className="mt-1 text-sm text-gray-500">
              List the names of your dental hygienists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 