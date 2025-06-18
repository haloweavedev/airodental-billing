'use client';

import React from 'react';
import { useCustomer } from 'autumn-js/react';
import { useOrganization, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UsagePage() {
  const router = useRouter();
  const { customer, isLoading: isCustomerLoading, error: customerError, refetch: refetchCustomer } = useCustomer();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();

  if (isCustomerLoading || !isOrgLoaded || !isAuthLoaded) {
    return <div style={{ padding: '2rem' }}>Loading usage details...</div>;
  }

  if (!isSignedIn) {
    router.push('/sign-in');
    return null;
  }

  if (!organization) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Please select or create an organization to view usage.</p>
        <Link href="/dashboard">Go to Dashboard</Link>
      </div>
    );
  }
  
  const hasActiveSubscription = customer?.products?.some(p => p.status === 'active' || p.status === 'trialing');

  if (!isCustomerLoading && !hasActiveSubscription) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Usage Details</h1>
        <p>Your organization does not have an active Laine subscription.</p>
        <Link href="/pricing">
          <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            View Pricing Plans
          </button>
        </Link>
      </div>
    );
  }

  if (customerError) {
    return <div style={{ padding: '2rem', color: 'red' }}>Error loading usage details: {customerError.message}</div>;
  }

  const activeProducts = customer?.products?.filter(p => p.status === 'active' || p.status === 'trialing');
  const aiMinutesFeature = customer?.features?.['ai-minutes'];

  const formatTimestamp = (timestamp: number | undefined | null) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Your Laine Usage</h1>
        <p>Review your AI-handled minute consumption for the current billing period.</p>
      </header>

      <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '2rem', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ marginTop: '0', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          Subscription Details
        </h2>
        {activeProducts && activeProducts.length > 0 ? (
          activeProducts.map(product => (
            <p key={product.id}>
              <strong>Current Plan:</strong> {product.name} (Status: {product.status})
            </p>
          ))
        ) : (
          <p>No active plan found.</p>
        )}

        <h2 style={{ marginTop: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          AI-Handled Minutes Usage
        </h2>
        {aiMinutesFeature ? (
          <div style={{ fontSize: '1.1rem' }}>
            {(() => {
              const included = aiMinutesFeature.unlimited ? Infinity : (aiMinutesFeature.included_usage ?? 0);
              const used = aiMinutesFeature.usage ?? 0;
              const balance = aiMinutesFeature.unlimited ? Infinity : (aiMinutesFeature.balance ?? 0);
              const percentageUsed = (included > 0 && !aiMinutesFeature.unlimited) ? Math.round((used / included) * 100) : 0;
              
              return (
                <>
                  <p><strong>Total Allotted Minutes:</strong> {aiMinutesFeature.unlimited ? 'Unlimited' : included}</p>
                  <p><strong>Minutes Used:</strong> {used} {!aiMinutesFeature.unlimited && `(${percentageUsed}%)`}</p>
                  
                  {!aiMinutesFeature.unlimited && included > 0 && (
                    <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '2px', marginTop: '5px', marginBottom: '10px' }}>
                      <div style={{ 
                        width: `${percentageUsed}%`, 
                        backgroundColor: percentageUsed > 85 ? '#dc3545' : percentageUsed > 60 ? '#ffc107' : '#28a745', 
                        height: '20px', 
                        borderRadius: '2px',
                        textAlign: 'center',
                        color: 'white',
                        lineHeight: '20px',
                        fontSize: '0.8em'
                      }}>
                        {percentageUsed}%
                      </div>
                    </div>
                  )}
                  
                  <p style={{ fontWeight: 'bold', color: (balance > 0 || aiMinutesFeature.unlimited) ? 'green' : 'red' }}>
                    <strong>Remaining Minutes:</strong> {aiMinutesFeature.unlimited ? 'Unlimited' : balance}
                  </p>
                  <p><strong>Usage Resets On:</strong> {formatTimestamp(aiMinutesFeature.next_reset_at)}</p>
                  <p><small>Your minute allowance renews on the date shown above.</small></p>
                  {aiMinutesFeature.unlimited && <p><small>Note: &ldquo;Unlimited&rdquo; plans may still be subject to fair use policies.</small></p>}
                </>
              );
            })()}
          </div>
        ) : (
          <p>AI minutes usage data is not available at this moment. This could be because your plan is still provisioning or has no minute-based features.</p>
        )}
      </div>
      <button 
          onClick={() => refetchCustomer()} 
          style={{ 
            marginTop: '1.5rem', 
            padding: '10px 20px', 
            fontSize: '16px', 
            cursor: 'pointer',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Refresh Usage Data
        </button>

      <div style={{marginTop: '2rem', fontSize: '0.8em', backgroundColor: '#eee', padding: '1rem', borderRadius: '4px', overflowX: 'auto'}}>
          <h3>Debug: Raw Customer Data</h3>
          <pre>{JSON.stringify(customer, null, 2)}</pre>
      </div>
    </div>
  );
} 