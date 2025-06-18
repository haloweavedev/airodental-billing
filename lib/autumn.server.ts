const AUTUMN_API_URL = 'https://api.useautumn.com/v1';
const AUTUMN_SECRET_KEY = process.env.AUTUMN_SECRET_KEY;

interface TrackEventArgs {
  customerId: string;
  featureId: string;
  value: number;
  eventId?: string; // Optional: for idempotency if needed
}

export async function trackAutumnUsage({ 
  customerId, 
  featureId, 
  value, 
  eventId 
}: TrackEventArgs): Promise<{ success: boolean; data?: unknown; error?: string }> {
  if (!AUTUMN_SECRET_KEY) {
    console.error('Autumn Server: AUTUMN_SECRET_KEY is not set.');
    return { success: false, error: 'Autumn secret key not configured.' };
  }

  if (!customerId) {
    console.error('Autumn Server Track: customerId is required.');
    return { success: false, error: 'Customer ID is required for tracking.' };
  }

  try {
    const response = await fetch(`${AUTUMN_API_URL}/track`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AUTUMN_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customerId,
        feature_id: featureId,
        value: value,
        ...(eventId && { event_id: eventId }), // Use if providing a unique event ID
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Autumn Server Track Error:', responseData);
      return { success: false, error: responseData.message || `API error: ${response.status}`, data: responseData };
    }

    console.log('Autumn Server Track Success:', responseData);
    return { success: true, data: responseData };
  } catch (error: unknown) {
    console.error('Autumn Server Track Exception:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to track usage with Autumn.';
    return { success: false, error: errorMessage };
  }
} 