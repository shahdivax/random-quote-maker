import { NextRequest, NextResponse } from 'next/server';
import { generateQuote, QuoteRequest } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const body: QuoteRequest = await request.json();
    
    // Validate required fields
    if (!body.userInput || !body.theme || !body.mood || !body.length || !body.aspectRatio) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate length
    if (!['short', 'medium', 'long'].includes(body.length)) {
      return NextResponse.json(
        { error: 'Invalid length. Must be short, medium, or long' },
        { status: 400 }
      );
    }

    const quote = await generateQuote(body);
    
    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error in generate-quote API:', error);
    return NextResponse.json(
      { error: 'Failed to generate quote' },
      { status: 500 }
    );
  }
}
