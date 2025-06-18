"use client";

import React from "react";
import { PricingTable } from "@/components/autumn/pricing-table";
import { useOrganization, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export default function PricingPage() {
  const { organization, isLoaded: isOrgLoaded } = useOrganization();

  if (!isOrgLoaded) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading organization details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tailored Solutions for Every Practice</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the Laine plan that best fits your dental practice&apos;s needs and unlock powerful billing automation.
        </p>
      </header>

      <SignedOut>
        <div className="text-center py-16">
          <div className="max-w-md mx-auto bg-card border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Sign in to View Plans</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to view our pricing plans and make a subscription.
            </p>
            <SignInButton mode="modal">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2 px-6 rounded-lg transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        {isOrgLoaded && !organization && (
          <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-center text-center">
              <div>
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-amber-800 mb-2">Organization Required</h3>
                <p className="text-amber-700 text-sm max-w-md">
                  To subscribe to a billing plan, you need to create or select an organization. 
                  Use the organization switcher in the top navigation to get started.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8">
          <PricingTable />
        </div>

        {organization && (
          <div className="mt-12 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-blue-800">Current Organization</h3>
              </div>
              <p className="text-blue-700 text-sm">
                Your subscription will be associated with <strong>{organization.name}</strong>
              </p>
              <p className="text-blue-600 text-xs mt-2 opacity-75">
                You can change organizations using the switcher in the header
              </p>
            </div>
          </div>
        )}
      </SignedIn>
    </div>
  );
} 