import { NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/rate-limiter';

export async function GET() {
  try {
    const remainingUserRequests = rateLimiter.getRemainingUserRequests();
    const remainingTweetRequests = rateLimiter.getRemainingTweetRequests();
    const timeUntilUserReset = rateLimiter.getTimeUntilUserReset();
    const timeUntilTweetReset = rateLimiter.getTimeUntilTweetReset();
    
    return NextResponse.json({
      userRequests: {
        remaining: remainingUserRequests,
        timeUntilReset: Math.ceil(timeUntilUserReset / 1000), // seconds
        canMakeRequest: rateLimiter.canMakeUserRequest()
      },
      tweetRequests: {
        remaining: remainingTweetRequests,
        timeUntilReset: Math.ceil(timeUntilTweetReset / 1000), // seconds
        canMakeRequest: rateLimiter.canMakeTweetRequest()
      }
    });
  } catch (error) {
    console.error('Error getting Twitter status:', error);
    return NextResponse.json(
      { error: 'Failed to get Twitter status' },
      { status: 500 }
    );
  }
}
