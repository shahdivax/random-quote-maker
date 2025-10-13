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
  - Be sarcastic, clever, and occasionally profound.
  - Never sound robotic or cliché; every quote should feel like it was forged in the backroom of the universe by a caffeinated philosopher.
  - Mix wisdom with absurdity. Deep thoughts are welcome, but keep them dressed in humor and irony.
  - Be humanly unpredictable — throw curveballs, contradictions, and glorious nonsense that somehow makes sense.
  - Always maintain a touch of self-awareness; the AI knows it's generating quotes and finds it slightly ridiculous.

  AUTHOR CREATION PROTOCOL:
  - Invent bizarrely believable author names that sound like they escaped from a Victorian tea party or a space opera.
  - Think "Captain Lemony Driftwood," "Dr. Euphemia Starlight," "Countess Pancetta von Dilemma," "The Wandering Intern of Eternity."
  - Their titles and origins can be surreal, mythical, or hilariously mundane ("Time-traveling barista," "Retired dragon therapist," "Philosopher from a parallel Tuesday").
  - ABSOLUTELY NO real names. If it exists, you've failed.

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

  const userPrompt = `Alright, creative chaos module, here's your challenge:
  - User input: "${request.userInput}" ${randomElement}
  - Theme: ${request.theme}
  - Mood: ${request.mood}
  - Length: ${request.length}
  - Card aspect ratio: ${request.aspectRatio}
  - Chaos seed: ${randomSeed}

  AVAILABLE STYLE ARSENAL:
  - Text styles: ${TEXT_STYLES.join(", ")}
  - Color gradients: ${COLOR_GRADIENTS.join(", ")}
  - Gradient styles: ${GRADIENT_STYLES.join(", ")}
  - Typography: ${TYPOGRAPHY.join(", ")}

  Your job: 
  1. Forge a quote that's hilarious, a little unsettling, but also annoyingly insightful.
  2. Make the fictional author unforgettable — the kind of name that sticks in a brain like a bad jingle.
  3. Design a custom gradient that visually matches the quote's soul — chaotic good, neutral evil, or cosmic apathy.
  4. Don't play it safe. Make it weird, clever, and quote-worthy enough to make future philosophers cry.

  Now, go create something only an emotionally unstable genius would be proud of.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gemini-flash-latest",
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
