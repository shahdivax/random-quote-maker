import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AURA vibes - Personal Quotes Generator",
  description: "Generate viby, funny, cranky, and sarcastic personal quotes with AI. Create unique quote cards with attitude!",
  keywords: ["quotes", "AI", "generator", "personal", "wisdom", "viby", "funny", "sarcastic"],
  authors: [{ name: "AURA vibes" }],
  creator: "AURA  vibes",
  publisher: "AURA  vibes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: "AURA vibes - Personal Quotes Generator",
    description: "Generate viby, funny, cranky, and sarcastic personal quotes with AI. Create unique quote cards with attitude!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA vibes - Personal Quotes Generator",
    description: "Generate viby, funny, cranky, and sarcastic personal quotes with AI. Create unique quote cards with attitude!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
