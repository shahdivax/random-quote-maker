// Simple in-memory rate limiter for Twitter API
class RateLimiter {
  private static instance: RateLimiter;
  private lastUserRequestTime: number = 0;
  private userRequestCount: number = 0;
  private lastTweetRequestTime: number = 0;
  private tweetRequestCount: number = 0;
  private readonly maxUserRequestsPer15Min = 2; // Free tier: 3 requests per 15 mins, leave buffer
  private readonly maxTweetRequestsPer15Min = 1; // Free tier: 1 request per 15 mins
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  private constructor() {}

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  canMakeUserRequest(): boolean {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now - this.lastUserRequestTime > this.windowMs) {
      this.userRequestCount = 0;
      this.lastUserRequestTime = now;
    }

    return this.userRequestCount < this.maxUserRequestsPer15Min;
  }

  canMakeTweetRequest(): boolean {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now - this.lastTweetRequestTime > this.windowMs) {
      this.tweetRequestCount = 0;
      this.lastTweetRequestTime = now;
    }

    return this.tweetRequestCount < this.maxTweetRequestsPer15Min;
  }

  recordUserRequest(): void {
    this.userRequestCount++;
    this.lastUserRequestTime = Date.now();
  }

  recordTweetRequest(): void {
    this.tweetRequestCount++;
    this.lastTweetRequestTime = Date.now();
  }

  getTimeUntilUserReset(): number {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastUserRequestTime;
    const timeUntilReset = this.windowMs - timeSinceLastRequest;
    return Math.max(0, timeUntilReset);
  }

  getTimeUntilTweetReset(): number {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastTweetRequestTime;
    const timeUntilReset = this.windowMs - timeSinceLastRequest;
    return Math.max(0, timeUntilReset);
  }

  getRemainingUserRequests(): number {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now - this.lastUserRequestTime > this.windowMs) {
      return this.maxUserRequestsPer15Min;
    }

    return Math.max(0, this.maxUserRequestsPer15Min - this.userRequestCount);
  }

  getRemainingTweetRequests(): number {
    const now = Date.now();
    
    // Reset counter if window has passed
    if (now - this.lastTweetRequestTime > this.windowMs) {
      return this.maxTweetRequestsPer15Min;
    }

    return Math.max(0, this.maxTweetRequestsPer15Min - this.tweetRequestCount);
  }
}

export const rateLimiter = RateLimiter.getInstance();
