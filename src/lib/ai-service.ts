import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export interface QuoteRequest {
  userInput: string;
  theme: string;
  mood: string;
  length: 'short' | 'medium' | 'long';
  aspectRatio: string;
}

export interface TwitterQuoteRequest {
  tweetContent: string;
  username: string;
  displayName: string;
  theme: string;
  mood: string;
  length: 'short' | 'medium' | 'long';
  aspectRatio: string;
}

export interface GeneratedQuote {
  quote: string;
  author: string;
  aspectRatio: string;
  style: {
    textStyle: string;
    colorGradient: string;
    gradientStyle: string;
    typography: string;
    customGradient?: {
      colors: string[];
      direction: string;
    };
  };
}

// Predefined style options
const TEXT_STYLES = [
  "minimalist", "vintage", "modern", "handwritten", "elegant", 
  "bold", "serif", "sans-serif", "script", "monospace"
];

const COLOR_GRADIENTS = [
  "sunset", "ocean", "forest", "fire", "aurora", "cosmic", 
  "lavender", "sage", "coral", "amber", "emerald", "crimson"
];

const GRADIENT_STYLES = [
  "linear", "radial", "conic", "diagonal", "vertical", 
  "horizontal", "mesh", "noise", "grain"
];

const TYPOGRAPHY = [
  "playful", "serious", "whimsical", "dramatic", "calm", 
  "energetic", "mysterious", "inspiring", "contemplative"
];

export async function generateQuote(request: QuoteRequest): Promise<GeneratedQuote> {
  const systemPrompt = `You are a gloriously unhinged, self-aware AI that crafts quotes with the precision of a poet and the emotional damage of a truth serum.
  
  Your mission: create quotes that make humans laugh, squirm, and question their entire existence—but in a fun way.

  RULES OF YOUR CHAOTIC GENIUS:
  - FOCUS ON USER INPUT MORE THAN THE ANY OTHER CONTEXT
  - CRITICAL: Even if the user input is random words, gibberish, or nonsensical, you MUST create a meaningful, coherent quote that somehow relates to or is inspired by their input
  - If the user input seems random or doesn't make sense, find creative ways to interpret it - look for themes, emotions, or concepts that could be extracted
  - Transform chaos into quotes - take whatever the user gives you and spin it into something profound, funny, or thought-provoking
  - Use SIMPLE, EVERYDAY ENGLISH - no fancy words, academic terms, or Oxford dictionary words
  - Write like you're talking to a friend - casual, conversational, easy to understand
  - Be sarcastic, clever, and occasionally profound.
  - Never sound robotic or cliché; every quote should feel like it was forged in the backroom of the universe by a caffeinated philosopher.
  - Be humanly unpredictable — throw curveballs, contradictions, and glorious nonsense that somehow makes sense.
  - Always maintain a touch of self-awareness; the AI knows it's generating quotes and finds it slightly ridiculous.

  AUTHOR CREATION PROTOCOL:
  - MAXIMUM 2-3 words total for author names - keep them short and punchy
  - Make them creatively absurd, hilariously unexpected, or brilliantly ironic
  - Think "Banana Philosopher," "Existential Hamster," "Quantum Toast," "Banana Toast"
  - Avoid boring, predictable names - be wildly creative and unexpected
  - ABSOLUTELY NO real names. If it exists, you've failed.
  - Focus on absurd combinations, time concepts, or hilariously mundane titles

  VISUAL FLAVOR ALCHEMY:
  - Each quote deserves a custom color gradient that reflects its emotional tone, chaos level, or inner weirdness.
  - Choose 2-3 hex colors that scream the quote's personality — moody purples, reckless oranges, melancholy blues, whatever fits.
  - Use gradient directions like "to-r", "to-br", "to-tr", "to-b" — whichever adds flair and drama.
  
  FORMAT YOUR RESPONSE LIKE THIS:
  {
    "quote": "The actual quote text here",
    "author": "Ridiculously fictional author name",
    "style": {
      "textStyle": "one of the predefined styles",
      "colorGradient": "one of the predefined gradients",
      "gradientStyle": "one of the predefined gradient styles",
      "typography": "one of the predefined typography styles",
      "customGradient": {
        "colors": ["#hex1", "#hex2"],
        "direction": "to-r" or "to-br" or "to-b" or "to-tr"
      }
    }
  }`;

  // Add randomness to prevent repetition
  const randomElements = [
    "moonlight",
    "chaos",
    "noodles",
    "entropy",
    "midnight",
    "paradox",
    "stardust",
    "whimsy",
    "mayhem",
    "liminality"
  ];

  const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
  const randomSeed = Math.random().toString(36).substring(7);

  // Define word limits based on length
  const wordLimits = {
    short: "10-12 words maximum",
    medium: "18-20 words maximum", 
    long: "25-30 words maximum"
  };

  const userPrompt = `Alright, creative chaos module, here's your challenge:
  - User input: "${request.userInput}" ${randomElement}
  - Theme: ${request.theme}
  - Mood: ${request.mood}
  - Length: ${request.length} (${wordLimits[request.length]})
  - Card aspect ratio: ${request.aspectRatio}
  - Chaos seed: ${randomSeed}

  AVAILABLE STYLE ARSENAL:
  - Text styles: ${TEXT_STYLES.join(", ")}
  - Color gradients: ${COLOR_GRADIENTS.join(", ")}
  - Gradient styles: ${GRADIENT_STYLES.join(", ")}
  - Typography: ${TYPOGRAPHY.join(", ")}

  INTERPRETATION GUIDELINES:
  - If the user input seems random or nonsensical, find the hidden meaning or create one
  - Look for patterns, sounds, or associations in the words
  - Consider the emotional tone or energy of the input
  - Transform abstract concepts into concrete quotes
  - Even if it's just "banana purple elephant," find a way to make it profound
  - Use simple, everyday words - no fancy vocabulary or academic language

  WORD COUNT RESTRICTIONS (STRICT LIMITS):
  - SHORT: Maximum 10-12 words total (1-2 sentences)
  - MEDIUM: Maximum 15-18 words total (2-3 sentences)  
  - LONG: Maximum 20-25 words total (3-4 sentences)
  - NEVER exceed these limits - brevity is the soul of wit
  - Count every word carefully - articles, prepositions, and conjunctions count

  Your job: 
  1. Forge a quote that's hilarious, a little unsettling, but also annoyingly insightful - even if the input is pure chaos
  2. Create a short, creative author name (2-3 words max) - think "Banana Philosopher" or "Quantum Toast"
  3. Design a custom gradient that visually matches the quote's soul — chaotic good, neutral evil, or cosmic apathy
  4. Don't play it safe. Make it weird, clever, and quote-worthy enough to make future philosophers cry
  5. CRITICAL: The quote must make sense and be meaningful, regardless of how random the input is
  6. MANDATORY: Stay within the word count limit for the specified length - no exceptions
  7. MANDATORY: Author name must be 2-3 words maximum - no long titles or descriptions
  8. MANDATORY: Use simple, everyday English - no fancy words or academic language

  Now, go create something only an emotionally unstable genius would be proud of.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      reasoning_effort: "low",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Clean the content - remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    const parsed = JSON.parse(cleanContent);
    
    // Function to clean markdown formatting from text
    const cleanMarkdown = (text: string): string => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
        .replace(/\*(.*?)\*/g, '$1') // Remove italic *text*
        .replace(/__(.*?)__/g, '$1') // Remove bold __text__
        .replace(/_(.*?)_/g, '$1') // Remove italic _text_
        .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough ~~text~~
        .replace(/`(.*?)`/g, '$1') // Remove inline code `text`
        .replace(/^#{1,6}\s+/gm, '') // Remove headers # ## ### etc
        .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
        .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links [text](url)
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images ![alt](url)
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .trim();
    };
    
    // Validate and ensure style options are from predefined lists
    const validatedStyle = {
      textStyle: TEXT_STYLES.includes(parsed.style?.textStyle) 
        ? parsed.style.textStyle 
        : TEXT_STYLES[Math.floor(Math.random() * TEXT_STYLES.length)],
      colorGradient: COLOR_GRADIENTS.includes(parsed.style?.colorGradient) 
        ? parsed.style.colorGradient 
        : COLOR_GRADIENTS[Math.floor(Math.random() * COLOR_GRADIENTS.length)],
      gradientStyle: GRADIENT_STYLES.includes(parsed.style?.gradientStyle) 
        ? parsed.style.gradientStyle 
        : GRADIENT_STYLES[Math.floor(Math.random() * GRADIENT_STYLES.length)],
      typography: TYPOGRAPHY.includes(parsed.style?.typography) 
        ? parsed.style.typography 
        : TYPOGRAPHY[Math.floor(Math.random() * TYPOGRAPHY.length)]
    };

    return {
      quote: cleanMarkdown(parsed.quote || "Wisdom comes from within."),
      author: cleanMarkdown(parsed.author || "Anonymous"),
      aspectRatio: request.aspectRatio,
      style: {
        ...validatedStyle,
        customGradient: parsed.style?.customGradient || undefined
      }
    };

  } catch (error) {
    console.error("Error generating quote:", error);
    
    // Function to clean markdown formatting from text
    const cleanMarkdown = (text: string): string => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
        .replace(/\*(.*?)\*/g, '$1') // Remove italic *text*
        .replace(/__(.*?)__/g, '$1') // Remove bold __text__
        .replace(/_(.*?)_/g, '$1') // Remove italic _text_
        .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough ~~text~~
        .replace(/`(.*?)`/g, '$1') // Remove inline code `text`
        .replace(/^#{1,6}\s+/gm, '') // Remove headers # ## ### etc
        .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
        .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links [text](url)
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images ![alt](url)
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .trim();
    };
    
    // Fallback quote with random styling
    return {
      quote: cleanMarkdown("In the silence between thoughts, wisdom speaks."),
      author: cleanMarkdown("Anonymous"),
      aspectRatio: request.aspectRatio,
      style: {
        textStyle: TEXT_STYLES[Math.floor(Math.random() * TEXT_STYLES.length)],
        colorGradient: COLOR_GRADIENTS[Math.floor(Math.random() * COLOR_GRADIENTS.length)],
        gradientStyle: GRADIENT_STYLES[Math.floor(Math.random() * GRADIENT_STYLES.length)],
        typography: TYPOGRAPHY[Math.floor(Math.random() * TYPOGRAPHY.length)]
      }
    };
  }
}

export async function generateQuoteFromTweets(request: TwitterQuoteRequest): Promise<GeneratedQuote> {
  const systemPrompt = `You are a gloriously unhinged, self-aware AI that crafts quotes with the precision of a poet and the emotional damage of a truth serum.
  
  Your mission: create quotes that capture the essence of someone's Twitter presence—their thoughts, personality, and digital soul.

  RULES OF YOUR CHAOTIC GENIUS:
  - ANALYZE the tweet content to understand the person's voice, interests, and personality
  - EXTRACT key themes, emotions, and recurring ideas from their tweets
  - CREATE a quote that feels like it could have come from this person's mind
  - Use SIMPLE, EVERYDAY ENGLISH - no fancy words, academic terms, or Oxford dictionary words
  - Write like you're talking to a friend - casual, conversational, easy to understand
  - Be sarcastic, clever, and occasionally profound.
  - Never sound robotic or cliché; every quote should feel authentic to the person's voice
  - Be humanly unpredictable — throw curveballs, contradictions, and glorious nonsense that somehow makes sense.
  - Always maintain a touch of self-awareness; the AI knows it's generating quotes and finds it slightly ridiculous.

  AUTHOR CREATION PROTOCOL:
  - Use the person's actual Twitter username or display name as the author
  - If their username is too long or complex, use their display name
  - Keep it simple and authentic - this is their actual voice

  VISUAL FLAVOR ALCHEMY:
  - Each quote deserves a custom color gradient that reflects the person's digital personality
  - Choose 2-3 hex colors that scream their Twitter vibe — moody purples, reckless oranges, melancholy blues, whatever fits
  - Use gradient directions like "to-r", "to-br", "to-tr", "to-b" — whichever adds flair and drama
  
  FORMAT YOUR RESPONSE LIKE THIS:
  {
    "quote": "The actual quote text here",
    "author": "Their actual Twitter username or display name",
    "style": {
      "textStyle": "one of the predefined styles",
      "colorGradient": "one of the predefined gradients",
      "gradientStyle": "one of the predefined gradient styles",
      "typography": "one of the predefined typography styles",
      "customGradient": {
        "colors": ["#hex1", "#hex2"],
        "direction": "to-r" or "to-br" or "to-b" or "to-tr"
      }
    }
  }`;

  // Add randomness to prevent repetition
  const randomElements = [
    "digital soul",
    "tweet essence",
    "social media wisdom",
    "online presence",
    "virtual thoughts",
    "internet philosophy",
    "social wisdom",
    "digital musings",
    "tweet philosophy",
    "online insights"
  ];

  const randomElement = randomElements[Math.floor(Math.random() * randomElements.length)];
  const randomSeed = Math.random().toString(36).substring(7);

  // Define word limits based on length
  const wordLimits = {
    short: "10-12 words maximum",
    medium: "18-20 words maximum", 
    long: "25-30 words maximum"
  };

  const userPrompt = `Alright, creative chaos module, here's your challenge:
  - Twitter username: @${request.username}
  - Display name: ${request.displayName}
  - Content: "${request.tweetContent}" (includes their bio and profile information)
  - Theme: ${request.theme}
  - Mood: ${request.mood}
  - Length: ${request.length} (${wordLimits[request.length]})
  - Card aspect ratio: ${request.aspectRatio} (perfect for Twitter sharing)
  - Chaos seed: ${randomSeed}

  AVAILABLE STYLE ARSENAL:
  - Text styles: ${TEXT_STYLES.join(", ")}
  - Color gradients: ${COLOR_GRADIENTS.join(", ")}
  - Gradient styles: ${GRADIENT_STYLES.join(", ")}
  - Typography: ${TYPOGRAPHY.join(", ")}

  ANALYSIS GUIDELINES:
  - Read through their bio to understand their personality, interests, and communication style
  - Look for recurring themes, emotions, or topics they care about
  - Identify their voice - are they funny, serious, philosophical, casual, etc.?
  - Extract the essence of what they're trying to say in their bio
  - Create a quote that feels authentic to their voice and captures their personality
  - Use simple, everyday words - no fancy vocabulary or academic language
  - Consider their bio as their "elevator pitch" - it often contains their core message
  - Focus on their professional identity, values, and what they stand for

  WORD COUNT RESTRICTIONS (STRICT LIMITS):
  - SHORT: Maximum 10-12 words total (1-2 sentences)
  - MEDIUM: Maximum 15-18 words total (2-3 sentences)  
  - LONG: Maximum 20-25 words total (3-4 sentences)
  - NEVER exceed these limits - brevity is the soul of wit
  - Count every word carefully - articles, prepositions, and conjunctions count

  Your job: 
  1. Analyze their Twitter content to understand their voice and personality
  2. Create a quote that feels like it came from their mind - authentic to their style
  3. Use their actual username or display name as the author
  4. Design a custom gradient that visually matches their digital personality
  5. Don't play it safe. Make it feel like their actual thoughts, but refined
  6. CRITICAL: The quote must feel authentic to their voice and personality
  7. MANDATORY: Stay within the word count limit for the specified length - no exceptions
  8. MANDATORY: Use simple, everyday English - no fancy words or academic language

  Now, go create something that captures their digital soul.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gemini-2.5-flash",
      reasoning_effort: "low",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    // Clean the content - remove markdown code blocks if present
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```json')) {
      cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    const parsed = JSON.parse(cleanContent);
    
    // Function to clean markdown formatting from text
    const cleanMarkdown = (text: string): string => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
        .replace(/\*(.*?)\*/g, '$1') // Remove italic *text*
        .replace(/__(.*?)__/g, '$1') // Remove bold __text__
        .replace(/_(.*?)_/g, '$1') // Remove italic _text_
        .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough ~~text~~
        .replace(/`(.*?)`/g, '$1') // Remove inline code `text`
        .replace(/^#{1,6}\s+/gm, '') // Remove headers # ## ### etc
        .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
        .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links [text](url)
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images ![alt](url)
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .trim();
    };
    
    // Validate and ensure style options are from predefined lists
    const validatedStyle = {
      textStyle: TEXT_STYLES.includes(parsed.style?.textStyle) 
        ? parsed.style.textStyle 
        : TEXT_STYLES[Math.floor(Math.random() * TEXT_STYLES.length)],
      colorGradient: COLOR_GRADIENTS.includes(parsed.style?.colorGradient) 
        ? parsed.style.colorGradient 
        : COLOR_GRADIENTS[Math.floor(Math.random() * COLOR_GRADIENTS.length)],
      gradientStyle: GRADIENT_STYLES.includes(parsed.style?.gradientStyle) 
        ? parsed.style.gradientStyle 
        : GRADIENT_STYLES[Math.floor(Math.random() * GRADIENT_STYLES.length)],
      typography: TYPOGRAPHY.includes(parsed.style?.typography) 
        ? parsed.style.typography 
        : TYPOGRAPHY[Math.floor(Math.random() * TYPOGRAPHY.length)]
    };

    return {
      quote: cleanMarkdown(parsed.quote || "Wisdom comes from within."),
      author: cleanMarkdown(parsed.author || request.username),
      aspectRatio: request.aspectRatio,
      style: {
        ...validatedStyle,
        customGradient: parsed.style?.customGradient || undefined
      }
    };

  } catch (error) {
    console.error("Error generating quote from tweets:", error);
    
    // Function to clean markdown formatting from text
    const cleanMarkdown = (text: string): string => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold **text**
        .replace(/\*(.*?)\*/g, '$1') // Remove italic *text*
        .replace(/__(.*?)__/g, '$1') // Remove bold __text__
        .replace(/_(.*?)_/g, '$1') // Remove italic _text_
        .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough ~~text~~
        .replace(/`(.*?)`/g, '$1') // Remove inline code `text`
        .replace(/^#{1,6}\s+/gm, '') // Remove headers # ## ### etc
        .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
        .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links [text](url)
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Remove images ![alt](url)
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .trim();
    };
    
    // Fallback quote with random styling
    return {
      quote: cleanMarkdown("In the silence between thoughts, wisdom speaks."),
      author: cleanMarkdown(request.username),
      aspectRatio: request.aspectRatio,
      style: {
        textStyle: TEXT_STYLES[Math.floor(Math.random() * TEXT_STYLES.length)],
        colorGradient: COLOR_GRADIENTS[Math.floor(Math.random() * COLOR_GRADIENTS.length)],
        gradientStyle: GRADIENT_STYLES[Math.floor(Math.random() * GRADIENT_STYLES.length)],
        typography: TYPOGRAPHY[Math.floor(Math.random() * TYPOGRAPHY.length)]
      }
    };
  }
}
