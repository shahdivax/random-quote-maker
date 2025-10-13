# 🧠 AI Wisdom Generator

A premium Next.js application that generates personalized philosophical quotes using Google's Gemini AI. Create unique, downloadable quote cards with custom styling based on your input.

## ✨ Features

- **AI-Powered Generation**: Uses Gemini 2.0 Flash to create personalized quotes
- **Smart Styling**: AI selects complementary colors, typography, and gradients
- **Premium UI**: Dark/light mode with beautiful gradients and animations
- **Download Cards**: Export your quotes as high-quality PDFs
- **Responsive Design**: Works perfectly on all devices
- **Custom Themes**: 8 different themes (wisdom, love, success, etc.)
- **Mood Selection**: 8 different moods (inspiring, calm, energetic, etc.)
- **Length Options**: Short, medium, or long quotes

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Get your Gemini API key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env.local` file

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 How It Works

1. **Input**: Enter a 10-15 character word or phrase that represents your current state of mind
2. **Customize**: Choose a theme (wisdom, love, success, etc.) and mood (inspiring, calm, etc.)
3. **Generate**: AI creates a personalized quote with complementary styling
4. **Download**: Export your unique quote card as a PDF

## 🎯 AI Features

The AI intelligently selects:
- **Text Styles**: Minimalist, vintage, modern, handwritten, elegant, bold, serif, sans-serif, script, monospace
- **Color Gradients**: Sunset, ocean, forest, fire, aurora, cosmic, lavender, sage, coral, amber, emerald, crimson
- **Gradient Styles**: Linear, radial, conic, diagonal, vertical, horizontal, mesh, noise, grain
- **Typography**: Playful, serious, whimsical, dramatic, calm, energetic, mysterious, inspiring, contemplative

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Google Gemini 2.0 Flash
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: Lucide React

## 📱 UI Design

- **Premium Look**: Clean, modern interface with subtle animations
- **Dark/Light Mode**: Toggle between themes
- **Color Palette**: Avoids blue, pink, purple - uses emerald, teal, amber, orange
- **Responsive**: Mobile-first design
- **Accessibility**: Proper contrast and keyboard navigation

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📄 API Endpoints

- `POST /api/generate-quote` - Generate a new quote
  - Body: `{ userInput: string, theme: string, mood: string, length: string }`
  - Returns: Generated quote with styling information

## 🎨 Customization

You can easily customize:
- **Themes**: Add new themes in `QuoteForm.tsx`
- **Moods**: Add new moods in `QuoteForm.tsx`
- **Styling Options**: Modify the style arrays in `ai-service.ts`
- **Colors**: Update gradient classes in `QuoteCard.tsx`

## 🚀 Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel, Netlify, or your preferred platform**

3. **Set environment variables** in your deployment platform:
   - `GEMINI_API_KEY`

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Made with ❤️ and AI**