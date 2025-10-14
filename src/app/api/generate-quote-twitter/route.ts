import { NextRequest, NextResponse } from 'next/server';
import { TwitterService } from '@/lib/twitter-service';
import { generateQuoteFromTweets, TwitterQuoteRequest } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: { username: string; theme?: string; mood?: string; length?: 'short' | 'medium' | 'long'; aspectRatio?: string } = await request.json();
    
    // Validate required fields
    if (!body.username) {
      return NextResponse.json(
        { error: 'Twitter username is required' },
        { status: 400 }
      );
    }

    // Set defaults
    const theme = body.theme || 'personal';
    const mood = body.mood || 'neutral';
    const length = body.length || 'medium';
    const aspectRatio = body.aspectRatio || '1:1'; // Default to square for Twitter

    // Initialize Twitter service
    const twitterService = new TwitterService();

    // Fetch user and their tweets (limited to 2 for API efficiency)
    const userData = await twitterService.getUserTweetsByUsername(body.username, 2);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found or tweets not accessible' },
        { status: 404 }
      );
    }

    const { user, tweets } = userData;

    if (!user.description) {
      return NextResponse.json(
        { error: 'No bio found for this user. Please try a user with a bio in their profile.' },
        { status: 404 }
      );
    }

    // Clean tweet text and bio for AI processing
    const cleanedText = twitterService.cleanTweetText(tweets, user.description);

    // Generate quote based on tweets
    const quoteRequest: TwitterQuoteRequest = {
      tweetContent: cleanedText,
      username: user.username,
      displayName: user.name,
      theme,
      mood,
      length,
      aspectRatio
    };

    const quote = await generateQuoteFromTweets(quoteRequest);
    
    return NextResponse.json({
      ...quote,
      twitterData: {
        username: user.username,
        displayName: user.name,
        bio: user.description || '',
        tweetCount: tweets.length,
        followerCount: user.public_metrics?.followers_count || 0
      }
    });
  } catch (error) {
    console.error('Error in generate-quote-twitter API:', error);
    
    // Handle specific Twitter API errors
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return NextResponse.json(
          { error: 'Twitter user not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('401') || error.message.includes('403')) {
        return NextResponse.json(
          { error: 'Twitter API authentication failed' },
          { status: 401 }
        );
      }
      if (error.message.includes('429') || error.message.includes('Rate limit exceeded')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in 15 minutes.' },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate quote from Twitter data' },
      { status: 500 }
    );
  }
}
