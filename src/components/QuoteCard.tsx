'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Sparkles } from 'lucide-react';
import { GeneratedQuote } from '@/lib/ai-service';
import { toJpeg } from 'html-to-image';

interface QuoteCardProps {
  quote: GeneratedQuote;
  isDarkMode: boolean;
  onRegenerate: () => void;
}

export default function QuoteCard({ quote, isDarkMode, onRegenerate }: QuoteCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const getAspectRatioClass = (aspectRatio: string) => {
    const aspectMap: Record<string, string> = {
      '9:16': 'aspect-[9/16]',
      '1:1': 'aspect-square',
      '16:9': 'aspect-[16/9]',
      '4:5': 'aspect-[4/5]',
      '3:4': 'aspect-[3/4]'
    };
    return aspectMap[aspectRatio] || 'aspect-[4/5]';
  };

  const getGradientClasses = (gradient: string, style: string) => {
    const gradients: Record<string, string> = {
      sunset: 'from-orange-400 via-pink-500 to-red-500',
      ocean: 'from-cyan-400 via-blue-500 to-indigo-600',
      forest: 'from-green-400 via-emerald-500 to-teal-600',
      fire: 'from-yellow-400 via-orange-500 to-red-600',
      aurora: 'from-green-300 via-blue-400 to-purple-500',
      cosmic: 'from-indigo-500 via-purple-500 to-pink-500',
      lavender: 'from-purple-300 via-pink-300 to-rose-300',
      sage: 'from-green-300 via-emerald-400 to-teal-400',
      coral: 'from-orange-300 via-red-300 to-pink-400',
      amber: 'from-yellow-300 via-amber-400 to-orange-500',
      emerald: 'from-emerald-300 via-green-400 to-teal-500',
      crimson: 'from-red-400 via-rose-500 to-pink-600'
    };

    const styles: Record<string, string> = {
      linear: 'bg-gradient-to-r',
      radial: 'bg-gradient-to-br',
      conic: 'bg-gradient-conic',
      diagonal: 'bg-gradient-to-br',
      vertical: 'bg-gradient-to-b',
      horizontal: 'bg-gradient-to-r',
      mesh: 'bg-gradient-to-br',
      noise: 'bg-gradient-to-br',
      grain: 'bg-gradient-to-br'
    };

    return `${styles[style] || 'bg-gradient-to-br'} ${gradients[gradient] || gradients.sunset}`;
  };

  const getTypographyClasses = (typography: string) => {
    const typographyStyles: Record<string, string> = {
      playful: 'font-funny-quote text-2xl',
      serious: 'font-cranky-quote text-xl',
      whimsical: 'font-viby-quote text-lg',
      dramatic: 'font-chaotic-quote text-2xl',
      calm: 'font-sarcastic-quote text-lg',
      energetic: 'font-mad-quote text-xl',
      mysterious: 'font-insane-quote text-lg',
      inspiring: 'font-wild-quote text-xl',
      contemplative: 'font-disturbed-quote text-lg',
      viby: 'font-viby-quote text-2xl',
      cranky: 'font-cranky-quote text-xl',
      sarcastic: 'font-sarcastic-quote text-lg',
      funny: 'font-funny-quote text-xl',
      wild: 'font-wild-quote text-2xl',
      chaotic: 'font-chaotic-quote text-xl',
      mad: 'font-mad-quote text-xl',
      insane: 'font-insane-quote text-lg',
      disturbed: 'font-disturbed-quote text-lg',
      nightmare: 'font-nightmare-quote text-lg',
      glitch: 'font-glitch-quote text-xl',
      burned: 'font-burned-quote text-lg',
      distressed: 'font-distressed-quote text-lg',
      microbe: 'font-microbe-quote text-lg',
      puddles: 'font-puddles-quote text-lg',
      spray: 'font-spray-paint-quote text-xl',
      vinyl: 'font-vinyl-quote text-lg'
    };

    return typographyStyles[typography] || typographyStyles.viby;
  };

  const getTextStyleClasses = (textStyle: string) => {
    const textStyles: Record<string, string> = {
      minimalist: 'font-light tracking-wide',
      vintage: 'font-cranky-quote italic',
      modern: 'font-viby-quote font-medium',
      handwritten: 'font-funny-quote italic',
      elegant: 'font-sarcastic-quote font-light',
      bold: 'font-chaotic-quote font-bold',
      serif: 'font-wild-quote',
      'sans-serif': 'font-mad-quote',
      script: 'font-insane-quote italic',
      monospace: 'font-disturbed-quote',
      viby: 'font-viby-quote',
      cranky: 'font-cranky-quote',
      sarcastic: 'font-sarcastic-quote',
      funny: 'font-funny-quote',
      wild: 'font-wild-quote',
      chaotic: 'font-chaotic-quote',
      mad: 'font-mad-quote',
      insane: 'font-insane-quote',
      disturbed: 'font-disturbed-quote',
      nightmare: 'font-nightmare-quote',
      glitch: 'font-glitch-quote',
      burned: 'font-burned-quote',
      distressed: 'font-distressed-quote',
      microbe: 'font-microbe-quote',
      puddles: 'font-puddles-quote',
      spray: 'font-spray-paint-quote',
      vinyl: 'font-vinyl-quote'
    };

    return textStyles[textStyle] || textStyles.viby;
  };

  const getCustomGradientStyle = (customGradient?: { colors: string[]; direction: string }) => {
    if (!customGradient || !customGradient.colors || customGradient.colors.length === 0) {
      return undefined;
    }

    const directionMap: Record<string, string> = {
      'to-r': 'to right',
      'to-br': 'to bottom right',
      'to-b': 'to bottom',
      'to-tr': 'to top right',
      'radial': 'circle'
    };

    const direction = directionMap[customGradient.direction] || 'to bottom right';
    const colorStops = customGradient.colors.join(', ');

    if (customGradient.direction === 'radial') {
      return {
        background: `radial-gradient(${direction}, ${colorStops})`
      };
    }

    return {
      background: `linear-gradient(${direction}, ${colorStops})`
    };
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      // Wait for fonts to load
      await document.fonts.ready;
      
      // Use html-to-image which supports modern CSS features like oklab
      const dataUrl = await toJpeg(cardRef.current, {
        quality: 0.95, // High quality JPEG (0.95 for excellent quality)
        pixelRatio: 4, // High resolution
        backgroundColor: '#ffffff', // White background for JPEG
        style: {
          transform: 'none', // Remove any transforms
          position: 'static'
        }
      });

      // Create download link
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const link = document.createElement('a');
      link.download = `AuraVibes-quote-${timestamp}.jpg`;
      link.href = dataUrl;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Quote Card */}
      <div
        ref={cardRef}
        data-card-ref="true"
        className={`${getAspectRatioClass(quote.aspectRatio)} rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden ${
          quote.style.customGradient ? '' : getGradientClasses(quote.style.colorGradient, quote.style.gradientStyle)
        }`}
        style={quote.style.customGradient ? getCustomGradientStyle(quote.style.customGradient) : undefined}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20"></div>
          <div className="absolute bottom-8 left-6 w-16 h-16 rounded-full bg-white/10"></div>
          <div className="absolute top-1/2 left-4 w-12 h-12 rounded-full bg-white/15"></div>
        </div>

        {/* Quote Content */}
        <div className="relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`mb-6 leading-relaxed ${getTypographyClasses(quote.style.typography)} ${getTextStyleClasses(quote.style.textStyle)}`}
          >
            &ldquo;{quote.quote}&rdquo;
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm opacity-80 font-light"
          >
            — {quote.author}
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-6 left-6 w-2 h-2 bg-white/30 rounded-full"></div>
        <div className="absolute bottom-6 right-6 w-3 h-3 bg-white/20 rounded-full"></div>
        <div className="absolute top-1/3 right-8 w-1 h-1 bg-white/40 rounded-full"></div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center space-x-4 mt-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          disabled={isDownloading}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 ${
            isDownloading
              ? isDarkMode
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : isDarkMode
              ? 'bg-slate-700 hover:bg-slate-600 text-white'
              : 'bg-white hover:bg-amber-50 text-slate-800 border border-amber-200'
          }`}
        >
          {isDownloading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRegenerate}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 ${
            isDarkMode
              ? 'bg-slate-700 hover:bg-slate-600 text-white'
              : 'bg-white hover:bg-amber-50 text-slate-800 border border-amber-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Regenerate</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
