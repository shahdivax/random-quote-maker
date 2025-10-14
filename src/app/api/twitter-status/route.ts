import { NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';

export async function GET() {
  try {
    const remaining = rateLimiter.getRemainingRequests();
    const timeUntilReset = rateLimiter.getTimeUntilReset();
    
    return NextResponse.json({
      remainingRequests: remaining,
      timeUntilReset: Math.ceil(timeUntilReset / 1000), // seconds
      canMakeRequest: rateLimiter.canMakeRequest()
    });
  } catch (error) {
    console.error('Error getting Twitter status:', error);
    return NextResponse.json(
      { error: 'Failed to get Twitter status' },
      { status: 500 }
    );
  }
}
