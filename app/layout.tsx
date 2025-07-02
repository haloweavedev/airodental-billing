import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  OrganizationSwitcher,
} from "@clerk/nextjs";
import { AutumnProvider } from "autumn-js/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Airodental Billing",
  description: "Dental billing management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const autumnBackendUrl = process.env.NEXT_PUBLIC_AUTUMN_BACKEND_URL;
  
  if (!autumnBackendUrl) {
    // In a real app, you might want to throw an error or have a fallback,
    // but for local dev, this check is good.
    // For build time, this variable must be present.
    console.error("FATAL: NEXT_PUBLIC_AUTUMN_BACKEND_URL is not defined.");
    // Potentially return a static error page or minimal layout
  }

  return (
    <ClerkProvider>
      <AutumnProvider
        backendUrl={autumnBackendUrl!} // Use non-null assertion if confident it's set by build/env
        // getBearerToken can be added if needed, but Clerk's session should propagate
        // with Next.js App Router if /api/autumn is not in publicRoutes.
        // Example if needed:
        // getBearerToken={async () => {
        //   const { getToken } = await import('@clerk/nextjs');
        //   return getToken({ template: 'your_template_if_any' }); // May need to be called from an async context or hook
        // }}
      >
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <header className="border-b p-4">
              <div className="flex justify-between items-center max-w-6xl mx-auto">
                <div className="flex items-center gap-8">
                  <h1 className="text-xl font-bold">Airodental Billing</h1>
                  <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm hover:text-primary transition-colors">
                      Home
                    </Link>
                    <Link href="/pricing" className="text-sm hover:text-primary transition-colors">
                      Pricing
                    </Link>
                    <SignedIn>
                      <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
                        Dashboard
                      </Link>
                      <Link href="/laine" className="text-sm hover:text-primary transition-colors">
                        Laine Assistant
                      </Link>
                      <Link href="/dashboard/billing" className="text-sm hover:text-primary transition-colors">
                        Billing
                      </Link>
                      <Link href="/dashboard/team" className="text-sm hover:text-primary transition-colors">
                        Team
                      </Link>
                      <Link href="/dashboard/settings" className="text-sm hover:text-primary transition-colors">
                        Settings
                      </Link>
                    </SignedIn>
                  </nav>
                </div>
                <div className="flex items-center gap-4">
                  <SignedOut>
                    <SignInButton />
                    <SignUpButton />
                  </SignedOut>
                  <SignedIn>
                    <OrganizationSwitcher afterCreateOrganizationUrl="/dashboard" />
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </header>
            {children}
          </body>
        </html>
      </AutumnProvider>
    </ClerkProvider>
  );
}
