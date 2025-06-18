import { NextRequest, NextResponse } from 'next/server';
import { trackAutumnUsage } from '@/lib/autumn.server';
// import { getClerkOrgIdFromPracticeId } from '@/lib/practice-utils'; // Will be used when real mapping is implemented
// import { prisma } from '@/lib/prisma'; // If you're saving CallLog here

const VAPI_WEBHOOK_SECRET = process.env.VAPI_WEBHOOK_SECRET;
const TEST_CLERK_ORG_ID_FOR_LANE_ASSISTANT = process.env.TEST_CLERK_ORG_ID_FOR_LANE_ASSISTANT;

// Interface for VAPI webhook message structure
interface VapiCall {
  id: string;
  assistantId: string;
  startedAt?: string;
  endedAt?: string;
  metadata?: Record<string, unknown>;
}

interface VapiWebhookMessage {
  type: string;
  call: VapiCall;
}

interface VapiWebhookBody {
  message: VapiWebhookMessage;
}

async function handleEndOfCallReport(message: VapiWebhookMessage) {
  const vapiCallId = message.call.id;
  const assistantId = message.call.assistantId;
  const startedAt = message.call.startedAt;
  const endedAt = message.call.endedAt;

  console.log(`VAPI Webhook: Processing end-of-call report for call ${vapiCallId}, assistant ${assistantId}`);

  // Get the Clerk Organization ID from the assistant
  const clerkOrgId = await getClerkOrgIdFromAssistant(assistantId);

  if (!clerkOrgId) {
    console.error(`VAPI Webhook: Could not determine Clerk Organization ID for assistant ${assistantId}. Usage not tracked in Autumn.`);
    // Potentially save the call log anyway, but flag it for manual review
    return;
  }

  if (startedAt && endedAt) {
    const durationSeconds = Math.round((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000);
    const minutesUsed = Math.ceil(durationSeconds / 60);

    if (minutesUsed > 0) {
      console.log(`VAPI Webhook: Call ${vapiCallId} for Org ${clerkOrgId} lasted ${durationSeconds}s (${minutesUsed} min). Tracking in Autumn.`);
      
      const trackResult = await trackAutumnUsage({
        customerId: clerkOrgId,
        featureId: 'ai-minutes', // Matches Autumn feature ID
        value: minutesUsed,
        eventId: vapiCallId, // Using VAPI call ID for idempotency
      });

      if (!trackResult.success) {
        console.error(`VAPI Webhook: Failed to track usage in Autumn for call ${vapiCallId}, Org ${clerkOrgId}. Error: ${trackResult.error}`);
        // Add to a retry queue or log for manual intervention
      } else {
        console.log(`VAPI Webhook: Successfully tracked ${minutesUsed} minutes for Org ${clerkOrgId} in Autumn.`);
      }
    } else {
      console.log(`VAPI Webhook: Call ${vapiCallId} for Org ${clerkOrgId} duration was 0 or negative. No usage tracked.`);
    }
    
    // Your existing CallLog creation logic can remain:
    // await prisma.callLog.create({ 
    //   data: { 
    //     vapiCallId,
    //     assistantId,
    //     practiceId: clerkOrgId, // Assuming practiceId is the Clerk Org ID
    //     callDurationSeconds: durationSeconds,
    //     // ... other call log data ... 
    //   } 
    // });

  } else {
    console.warn(`VAPI Webhook: Call ${vapiCallId} for Org ${clerkOrgId} missing start/end times. Cannot calculate duration.`);
  }
}

// Placeholder for the mapping function - this is critical and specific to your app's logic
async function getClerkOrgIdFromAssistant(vapiAssistantId: string): Promise<string | null> {
  // TODO: CRITICAL - Implement robust production logic to map VAPI assistantId 
  // to your Clerk Organization ID.
  // This might involve:
  // 1. A database lookup: e.g., Prisma query on an 'AssistantConfiguration' table 
  //    that links `vapiAssistantId` to `clerkOrganizationId`.
  //    Example: 
  //    // const assistantConfig = await prisma.assistantConfiguration.findUnique({
  //    //   where: { vapiAssistantId: vapiAssistantId },
  //    //   select: { clerkOrganizationId: true }
  //    // });
  //    // if (assistantConfig?.clerkOrganizationId) return assistantConfig.clerkOrganizationId;
  //
  // 2. Extracting `clerkOrganizationId` from `message.call.metadata` if you set it 
  //    when initiating the call with VAPI. This is a common and good pattern.
  //    Example (if metadata is passed to this function):
  //    // if (callMetadata?.clerkOrgId) return callMetadata.clerkOrgId as string;

  console.warn(`[LOOKUP REQUIRED] getClerkOrgIdFromAssistant called for VAPI assistant ID: ${vapiAssistantId}. Implement production mapping.`);

  // For MVP testing with the primary Laine assistant:
  if (vapiAssistantId === "4c6a9a14-365b-452a-9b61-60bb13a8d19d") {
    if (TEST_CLERK_ORG_ID_FOR_LANE_ASSISTANT) {
      console.log(`[MVP TEST] Using TEST_CLERK_ORG_ID_FOR_LANE_ASSISTANT ('${TEST_CLERK_ORG_ID_FOR_LANE_ASSISTANT}') for Laine assistant.`);
      return TEST_CLERK_ORG_ID_FOR_LANE_ASSISTANT;
    } else {
      console.error(`[MVP TEST CONFIG ERROR] Laine assistant ID matched, but TEST_CLERK_ORG_ID_FOR_LANE_ASSISTANT is not set in .env.local. Cannot track usage.`);
      return null;
    }
  }
  
  console.error(`[NO MAPPING] No specific mapping found for VAPI assistant ID: ${vapiAssistantId}. Cannot determine Clerk Organization ID.`);
  return null; 
}

// Main POST handler for the webhook
export async function POST(request: NextRequest) {
  // Webhook Security Check
  if (VAPI_WEBHOOK_SECRET) {
    // Option 1: Check a custom header (e.g., 'X-Webhook-Secret')
    const providedSecretHeader = request.headers.get('X-Webhook-Secret');
    // Option 2: Check a query parameter (e.g., /api/vapi/webhook?secret=YOUR_SECRET)
    const providedSecretQuery = request.nextUrl.searchParams.get('secret');
    
    let authorized = false;
    if (providedSecretHeader && providedSecretHeader === VAPI_WEBHOOK_SECRET) {
      authorized = true;
    } else if (!providedSecretHeader && providedSecretQuery && providedSecretQuery === VAPI_WEBHOOK_SECRET) {
      // Fallback to query param if header not present, for easier testing via browser/curl initially
      authorized = true;
    }

    if (!authorized) {
      console.warn('VAPI Webhook: Unauthorized attempt. Invalid or missing secret.');
      return NextResponse.json({ status: 'error', message: 'Unauthorized' }, { status: 401 });
    }
    console.log('VAPI Webhook: Authorized via shared secret.');
  } else {
    console.warn('VAPI Webhook: VAPI_WEBHOOK_SECRET is not set. Webhook is unsecured. This is not recommended for production.');
  }

  try {
    const body: VapiWebhookBody = await request.json();
    console.log('VAPI Webhook Received (Authenticated):', JSON.stringify(body, null, 2));

    if (body.message && body.message.type === 'end-of-call-report') {
      await handleEndOfCallReport(body.message);
    } else if (body.message && body.message.type === 'transcript') {
      console.log('VAPI Webhook: Received transcript message (not processing usage)');
    } else {
      console.log(`VAPI Webhook: Received unknown message type: ${body.message?.type || 'undefined'}`);
    }
    return NextResponse.json({ status: 'received' });
  } catch (error) {
    console.error('VAPI Webhook Error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to process webhook' },
      { status: 500 }
    );
  }
} 