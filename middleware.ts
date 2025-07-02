import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/vapi/webhook(.*)'
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
    
    // After protecting the route, check if user needs onboarding
    const { orgId } = await auth();
    
    // If user has no organization and is not on onboarding route, redirect to onboarding
    if (!orgId && !isOnboardingRoute(request)) {
      const onboardingUrl = new URL('/onboarding', request.url);
      return NextResponse.redirect(onboardingUrl);
    }
  }
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 