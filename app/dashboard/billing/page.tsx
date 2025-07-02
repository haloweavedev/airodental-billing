'use client';

import React from 'react';
import { useCustomer } from 'autumn-js/react';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function BillingPage() {
  const { has } = useAuth();
  const { customer, isLoading, error, refetch } = useCustomer();
  
  // Check if user has billing permissions
  const canViewBilling = has?.({ permission: 'org:sys_billing:read' }) ?? false;
  
  if (!canViewBilling) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-gray-600">
          You do not have permission to view billing information. Please contact your organization administrator.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Billing Dashboard</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Billing Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Billing Data</h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeProducts = customer?.products?.filter(p => p.status === 'active' || p.status === 'trialing') || [];
  const hasActiveSubscription = activeProducts.length > 0;
  const aiMinutesFeature = customer?.features?.['ai-minutes'];

  const formatTimestamp = (timestamp: number | undefined | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing Dashboard</h1>
          <p className="text-gray-600">
            Manage your subscription, view usage, and handle billing for your organization.
          </p>
        </header>

        {!hasActiveSubscription ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">No Active Subscription</h2>
            <p className="text-yellow-700 mb-4">
              Your organization does not have an active Laine subscription.
            </p>
            <Link href="/pricing">
              <Button>View Pricing Plans</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            <section className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
              <div className="space-y-3">
                {activeProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">Status: {product.status}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Change Plan
                        </Button>
                        <Button variant="outline" size="sm">
                          Cancel Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">AI-Handled Minutes Usage</h2>
              {aiMinutesFeature ? (
                <div className="space-y-4">
                  {(() => {
                    const included = aiMinutesFeature.unlimited ? Infinity : (aiMinutesFeature.included_usage ?? 0);
                    const used = aiMinutesFeature.usage ?? 0;
                    const balance = aiMinutesFeature.unlimited ? Infinity : (aiMinutesFeature.balance ?? 0);
                    const percentageUsed = (included > 0 && !aiMinutesFeature.unlimited) ? Math.round((used / included) * 100) : 0;
                    
                    return (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h3 className="font-medium text-blue-900">Total Allotted</h3>
                            <p className="text-2xl font-bold text-blue-700">
                              {aiMinutesFeature.unlimited ? 'Unlimited' : included}
                            </p>
                          </div>
                          <div className="p-4 bg-orange-50 rounded-lg">
                            <h3 className="font-medium text-orange-900">Minutes Used</h3>
                            <p className="text-2xl font-bold text-orange-700">
                              {used} {!aiMinutesFeature.unlimited && `(${percentageUsed}%)`}
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h3 className="font-medium text-green-900">Remaining</h3>
                            <p className="text-2xl font-bold text-green-700">
                              {aiMinutesFeature.unlimited ? 'Unlimited' : balance}
                            </p>
                          </div>
                        </div>

                        {!aiMinutesFeature.unlimited && included > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Usage Progress</span>
                              <span>{percentageUsed}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div 
                                className={`h-3 rounded-full transition-all ${
                                  percentageUsed > 85 ? 'bg-red-500' : 
                                  percentageUsed > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="border-t pt-4 space-y-2">
                          <p className="text-sm">
                            <strong>Usage Resets On:</strong> {formatTimestamp(aiMinutesFeature.next_reset_at)}
                          </p>
                          <p className="text-xs text-gray-600">
                            Your minute allowance renews on the date shown above.
                          </p>
                          {aiMinutesFeature.unlimited && (
                            <p className="text-xs text-gray-600">
                              Note: &ldquo;Unlimited&rdquo; plans may still be subject to fair use policies.
                            </p>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    AI minutes usage data is not available at this moment. This could be because your plan is still provisioning or has no minute-based features.
                  </p>
                </div>
              )}
            </section>

            <section className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-4">Actions</h2>
              <div className="flex gap-4">
                <Button onClick={() => refetch()}>
                  Refresh Usage Data
                </Button>
                <Link href="/pricing">
                  <Button variant="outline">
                    View All Plans
                  </Button>
                </Link>
              </div>
            </section>

            {process.env.NODE_ENV === 'development' && (
              <section className="bg-gray-50 rounded-lg border p-6">
                <h2 className="text-lg font-semibold mb-4">Debug: Raw Customer Data</h2>
                <pre className="text-xs bg-white p-4 rounded border overflow-auto max-h-96">
                  {JSON.stringify(customer, null, 2)}
                </pre>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 