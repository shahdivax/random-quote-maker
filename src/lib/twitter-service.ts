import { rateLimiter } from './rate-limiter';

export interface TwitterUser {
  id: string;
  username: string;
  name: string;
  description?: string; // Bio/description
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics?: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
  };
}

export interface TwitterApiResponse {
  data?: Tweet[];
  meta?: {
    result_count: number;
    next_token?: string;
  };
  errors?: Array<{
    value: string;
    detail: string;
    title: string;
  }>;
}

export class TwitterService {
  private bearerToken: string;
  private baseUrl = 'https://api.twitter.com/2';

  constructor() {
    // @ts-ignore - process.env is available in Node.js environment
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN || '';
    if (!this.bearerToken) {
      throw new Error('Twitter Bearer Token is required');
    }
  }

  /**
   * Get user information by username (including bio) with rate limit handling
   */
  async getUserByUsername(username: string): Promise<TwitterUser | null> {
    try {
      // Check rate limit before making request
      if (!rateLimiter.canMakeUserRequest()) {
        throw new Error(`Rate limit exceeded. Please try again later.`);
      }

      // Record this request
      rateLimiter.recordUserRequest();

      const response = await fetch(
        `${this.baseUrl}/users/by/username/${username}?user.fields=public_metrics,description`,
        {
          headers: {
            'Authorization': `Bearer ${this.bearerToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null; // User not found
        }
        
        // Handle rate limit specifically
        if (response.status === 429) {
          throw new Error(`Rate limit exceeded. Please try again in 15 minutes.`);
        }
        
        throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || null;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  /**
   * Get user's recent tweets with rate limit handling
   */
  async getUserTweets(userId: string, maxResults: number = 10): Promise<Tweet[]> {
    try {
      // Check rate limit before making request
      if (!rateLimiter.canMakeTweetRequest()) {
        const timeUntilReset = rateLimiter.getTimeUntilTweetReset();
        const minutes = Math.ceil(timeUntilReset / (1000 * 60));
        throw new Error(`Rate limit exceeded. Please try again in ${minutes} minutes.`);
      }

      // Record this request
      rateLimiter.recordTweetRequest();

      const response = await fetch(
        `${this.baseUrl}/users/${userId}/tweets?max_results=${maxResults}`,
        {
          headers: {
            'Authorization': `Bearer ${this.bearerToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Twitter API error details:', errorData);
        
        // Handle rate limit specifically
        if (response.status === 429) {
          const resetTime = response.headers.get('x-rate-limit-reset');
          if (resetTime) {
            const resetDate = new Date(parseInt(resetTime) * 1000);
            const now = new Date();
            const waitTime = resetDate.getTime() - now.getTime();
            
            if (waitTime > 0 && waitTime < 15 * 60 * 1000) { // Only wait if it's less than 15 minutes
              console.log(`Rate limit hit. Waiting ${Math.ceil(waitTime / 1000)} seconds until reset...`);
              await new Promise(resolve => setTimeout(resolve, waitTime + 1000)); // Wait a bit extra
              
              // Retry once
              const retryResponse = await fetch(
                `${this.baseUrl}/users/${userId}/tweets?max_results=${maxResults}`,
                {
                  headers: {
                    'Authorization': `Bearer ${this.bearerToken}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
              
              if (retryResponse.ok) {
                const retryData: TwitterApiResponse = await retryResponse.json();
                return retryData.data || [];
              }
            }
          }
          
          throw new Error(`Rate limit exceeded. Please try again in a few minutes.`);
        }
        
        throw new Error(`Twitter API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const data: TwitterApiResponse = await response.json();
      
      if (data.errors) {
        throw new Error(`Twitter API errors: ${data.errors.map(e => e.detail).join(', ')}`);
      }

      return data.data || [];
    } catch (error) {
      console.error('Error fetching user tweets:', error);
      throw error;
    }
  }

  /**
   * Get user's recent tweets by username (convenience method)
   * Optimized for limited API usage - fetches user info and tweets in one call
   */
  async getUserTweetsByUsername(username: string, maxResults: number = 1): Promise<{ user: TwitterUser; tweets: Tweet[] } | null> {
    try {
      // First get user info
      const user = await this.getUserByUsername(username);
      if (!user) {
        return null;
      }

      // Use bio and user details only - no tweets to avoid rate limits
      console.log('Using bio and user details only (no tweets)');
      const tweets: Tweet[] = [];
      
      return { user, tweets };
    } catch (error) {
      console.error('Error fetching user tweets by username:', error);
      throw error;
    }
  }

  /**
   * Clean and prepare tweet text and bio for quote generation
   */
  cleanTweetText(tweets: Tweet[], bio?: string): string {
    const tweetTexts = tweets
      .map(tweet => {
        // Remove URLs, mentions, and hashtags for cleaner text
        let text = tweet.text
          .replace(/https?:\/\/\S+/g, '') // Remove URLs
          .replace(/@\w+/g, '') // Remove mentions
          .replace(/#\w+/g, '') // Remove hashtags
          .replace(/\s+/g, ' ') // Normalize whitespace
          .trim();
        
        return text;
      })
      .filter(text => text.length > 10); // Filter out very short tweets

    // Add bio if available
    if (bio && bio.trim()) {
      const cleanBio = bio
        .replace(/https?:\/\/\S+/g, '') // Remove URLs
        .replace(/@\w+/g, '') // Remove mentions
        .replace(/#\w+/g, '') // Remove hashtags
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      if (cleanBio.length > 5) {
        tweetTexts.unshift(`Bio: ${cleanBio}`); // Add bio at the beginning
      }
    }

    return tweetTexts.join(' ');
  }
}
