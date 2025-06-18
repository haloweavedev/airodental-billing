'use client';

import React, { useState } from 'react';
import { useCustomer } from 'autumn-js/react';
import { useOrganization, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductChangeDialog from "@/components/autumn/product-change-dialog";
import { useAutumn } from 'autumn-js/react';

export default function LainePage() {
  const router = useRouter();
  const { customer, isLoading: isCustomerLoading, error: customerError, refetch: refetchCustomer } = useCustomer();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();

  const { check, track, attach } = useAutumn();
  const [showOverageButton, setShowOverageButton] = useState(false);
  const [simulatedUsageMessage, setSimulatedUsageMessage] = useState('');

  if (isCustomerLoading || !isOrgLoaded || !isAuthLoaded) {
    return <div style={{ padding: '2rem' }}>Loading assistant details...</div>;
  }

  if (!isSignedIn) {
    router.push('/sign-in'); // Should be handled by middleware, but good fallback
    return null;
  }

  if (!organization) {
    // This case should ideally be handled by guiding user to select/create org
    // For now, if they land here without an org, it's an edge case.
    return (
      <div style={{ padding: '2rem' }}>
        <p>Please select or create an organization to use Laine.</p>
        <Link href="/dashboard">Go to Dashboard</Link>
      </div>
    );
  }

  const hasActiveSubscription = customer?.products?.some(p => p.status === 'active' || p.status === 'trialing');

  if (!hasActiveSubscription && !isCustomerLoading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Access Laine AI Assistant</h1>
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
    return <div style={{ padding: '2rem', color: 'red' }}>Error loading subscription details: {customerError.message}</div>;
  }

  const handleSimulateUsageAndCheckOverage = async () => {
    setSimulatedUsageMessage('');
    setShowOverageButton(false);

    if (!customer) {
      setSimulatedUsageMessage("Error: Customer data not loaded.");
      return;
    }

    const { data: checkData, error: checkError } = await check({ featureId: 'ai-minutes' });

    if (checkError) {
      setSimulatedUsageMessage(`Error checking credits: ${checkError.message}`);
      return;
    }

    if (checkData?.allowed) {
      // For MVP, this client-side track is just for immediate UI feedback simulation.
      // The actual VAPI call usage is tracked server-side via webhook.
      // We are "using" 1 minute here for the simulation.
      const { error: trackError } = await track({ featureId: 'ai-minutes', value: 1 });
      if (trackError) {
        setSimulatedUsageMessage(`Error simulating usage tracking: ${trackError.message}`);
      } else {
        setSimulatedUsageMessage("Simulated 1 minute of usage. Credits deducted.");
      }
      await refetchCustomer(); // Refetch to update balance display if any
    } else {
      setSimulatedUsageMessage("You're out of AI minutes!");
      setShowOverageButton(true);
    }
  };

  const handlePurchaseOverage = async () => {
    try {
      await attach({
        productId: '200-minute_pack', // Ensure this product ID exists in Autumn
        dialog: ProductChangeDialog,
      });
      // After successful Stripe checkout & redirect, Autumn updates subscription.
      // We might want to refetch customer data or rely on page reload.
      setShowOverageButton(false);
      setSimulatedUsageMessage('Overage purchase initiated. Please check your balance after completion.');
      await refetchCustomer();
    } catch (error: unknown) {
      console.error("Overage purchase failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSimulatedUsageMessage(`Overage purchase error: ${errorMessage}`);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>Your Laine AI Dental Assistant</h1>
      </header>

      <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '2rem', backgroundColor: '#f9f9f9' }}>
        <h2 style={{ marginTop: '0' }}>Connect with Laine</h2>
        <p>You can reach your Laine assistant at:</p>
        <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff', margin: '0.5rem 0' }}>
          +1 (901) 808 9449
        </p>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Assistant ID: 4c6a9a14-365b-452a-9b61-60bb13a8d19d
        </p>
        <button 
          style={{ 
            padding: '12px 25px', 
            fontSize: '18px', 
            cursor: 'pointer', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            marginTop: '1rem',
            display: 'block',
            width: '100%',
            marginBottom: '1rem'
          }}
          onClick={handleSimulateUsageAndCheckOverage}
        >
          Simulate 1 Min Call & Check Credits
        </button>
        {simulatedUsageMessage && (
          <p style={{ color: showOverageButton ? 'red' : 'green', textAlign: 'center', fontWeight: 'bold' }}>
            {simulatedUsageMessage}
          </p>
        )}
        {showOverageButton && (
          <button
            style={{
              padding: '12px 25px', 
              fontSize: '18px', 
              cursor: 'pointer', 
              backgroundColor: '#ffc107', 
              color: 'black', 
              border: 'none', 
              borderRadius: '5px',
              marginTop: '0.5rem',
              display: 'block',
              width: '100%'
            }}
            onClick={handlePurchaseOverage}
          >
            Purchase 200 Overage Minutes ($50)
          </button>
        )}
      </div>
      
      <div style={{marginTop: '2rem'}}>
        <h3>Current Subscription Status (Debug Info):</h3>
        <pre style={{backgroundColor: '#eee', padding: '1rem', borderRadius: '4px', overflowX: 'auto', fontSize: '0.8em'}}>
          {JSON.stringify({
            isCustomerLoading,
            customerOrgId: customer?.id, // Autumn's customer ID (should be Clerk Org ID)
            activeProducts: customer?.products?.filter(p => p.status === 'active' || p.status === 'trialing').map(p => ({id: p.id, name: p.name, status: p.status})),
            aiMinutesFeature: customer?.features?.['ai-minutes'],
            hasActiveSubscription,
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
} 