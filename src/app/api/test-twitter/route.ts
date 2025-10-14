import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    
    if (!bearerToken) {
      return NextResponse.json({ error: 'No Bearer Token found' }, { status: 400 });
    }

    // Test with a simple user lookup first
    const response = await fetch(
      'https://api.twitter.com/2/users/by/username/elonmusk?user.fields=public_metrics,description',
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ 
        error: `Twitter API error: ${response.status} ${response.statusText}`,
        details: errorData,
        status: response.status
      }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      user: data.data,
      message: 'Twitter API connection successful!'
    });

  } catch (error) {
    console.error('Test Twitter API error:', error);
    return NextResponse.json({ 
      error: 'Failed to connect to Twitter API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
