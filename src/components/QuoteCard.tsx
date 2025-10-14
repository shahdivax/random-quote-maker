'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, RefreshCw, X, Monitor, Smartphone } from 'lucide-react';
import { GeneratedQuote } from '@/lib/ai-service';
import { toJpeg } from 'html-to-image';
import Watermark from './Watermark';

interface QuoteCardProps {
  quote: GeneratedQuote;
  isDarkMode: boolean;
  onRegenerate: () => void;
  onModalStateChange?: (hasOpenModal: boolean) => void;
}

export default function QuoteCard({ quote, isDarkMode, onRegenerate, onModalStateChange }: QuoteCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [selectedWallpaperFormat, setSelectedWallpaperFormat] = useState<'mobile' | 'desktop' | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Notify parent when modal states change
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(showDownloadModal || showWallpaperModal);
    }
  }, [showDownloadModal, showWallpaperModal, onModalStateChange]);

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

  const handleDownload = async (is4K: boolean = false) => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      // Wait for fonts to load
      await document.fonts.ready;
      
      const pixelRatio = is4K ? 8 : 4; // Higher pixel ratio for 4K
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      
      // Use JPEG with proper background capture
      const dataUrl = await toJpeg(cardRef.current, {
        quality: 0.95,
        pixelRatio,
        // Remove backgroundColor to preserve the actual background
        style: {
          transform: 'none',
          position: 'static'
        }
      });

      const filename = `Aura-Vibes-quote-${is4K ? '4K-' : ''}${timestamp}.jpg`;

      // Create download link
      const link = document.createElement('a');
      link.download = filename;
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
      setShowDownloadModal(false);
    }
  };

  const handleWallpaperDownload = async (format: 'mobile' | 'desktop', is4K: boolean = true) => {
    if (!cardRef.current) return;

    setIsDownloading(true);
    try {
      await document.fonts.ready;
      
      // Fix mobile 4K issue by using lower pixel ratio for mobile
      const pixelRatio = format === 'mobile' ? (is4K ? 4 : 2) : (is4K ? 8 : 4);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      
      // Create a temporary element with wallpaper dimensions
      const tempElement = cardRef.current.cloneNode(true) as HTMLElement;
      
      // Set wallpaper dimensions
      if (format === 'mobile') {
        tempElement.style.width = '1080px';
        tempElement.style.height = '1920px';
        tempElement.style.aspectRatio = '9/16';
      } else {
        tempElement.style.width = '3840px';
        tempElement.style.height = '2160px';
        tempElement.style.aspectRatio = '16/9';
      }
      
      // Position off-screen
      tempElement.style.position = 'absolute';
      tempElement.style.left = '-9999px';
      tempElement.style.top = '-9999px';
      tempElement.style.zIndex = '-9999';
      
      // Add wallpaper-specific CSS for better text scaling and formatting preservation
      const wallpaperStyle = document.createElement('style');
      wallpaperStyle.textContent = `
        .wallpaper-text {
          font-size: ${format === 'mobile' ? '48px' : '72px'} !important;
          line-height: 1.2 !important;
          font-weight: bold !important;
        }
        .wallpaper-author {
          font-size: ${format === 'mobile' ? '24px' : '36px'} !important;
          line-height: 1.3 !important;
          font-weight: 500 !important;
        }
        .wallpaper-container {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          text-align: center !important;
          padding: ${format === 'mobile' ? '120px' : '200px'} !important;
          min-height: 100% !important;
        }
      `;
      document.head.appendChild(wallpaperStyle);
      
      // Apply wallpaper classes to text elements
      const textElements = tempElement.querySelectorAll('div');
      textElements.forEach((element: HTMLElement) => {
        if (element.textContent && element.textContent.includes(quote.quote)) {
          element.className = 'wallpaper-text';
        } else if (element.textContent && element.textContent.includes(quote.author)) {
          element.className = 'wallpaper-author';
        }
      });
      
      // Apply container class
      tempElement.className = 'wallpaper-container';
      
      document.body.appendChild(tempElement);

      // Use JPEG with proper background capture
      const dataUrl = await toJpeg(tempElement, {
        quality: 0.95,
        pixelRatio,
        // Remove backgroundColor to preserve the actual background
        style: {
          transform: 'none',
          position: 'static'
        }
      });

      const filename = `Aura-Vibes-wallpaper-${format}-${is4K ? '4K-' : ''}${timestamp}.jpg`;

      // Clean up
      document.body.removeChild(tempElement);
      document.head.removeChild(wallpaperStyle);

      // Create download link
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Wallpaper download failed:', error);
      alert('Wallpaper download failed. Please try again.');
    } finally {
      setIsDownloading(false);
      setShowWallpaperModal(false);
      setSelectedWallpaperFormat(null);
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
        
        {/* Watermark */}
        <Watermark isDarkMode={isDarkMode} />
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDownloadModal(true)}
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
          onClick={() => setShowWallpaperModal(true)}
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
          <Monitor className="w-4 h-4" />
          <span>Wallpaper</span>
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
          <RefreshCw className="w-4 h-4" />
          <span>Regenerate</span>
        </motion.button>
      </motion.div>

      {/* Download Format Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDownloadModal(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative z-20 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border shadow-2xl w-full max-w-xs sm:max-w-lg lg:max-w-2xl mx-4 ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700/50 shadow-slate-900/50' 
                  : 'bg-white border-amber-200/50 shadow-amber-900/10'
              }`}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Download Format
                </h3>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className={`p-2 rounded-full transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-slate-700 text-slate-400' 
                      : 'hover:bg-amber-100 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDownload(false)}
                    className={`p-6 rounded-xl border transition-all duration-300 group ${
                      isDarkMode
                        ? 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/80 hover:border-slate-600/70 text-white shadow-lg hover:shadow-xl'
                        : 'bg-white/60 border-amber-200/50 hover:bg-amber-50/80 hover:border-amber-300/70 text-slate-800 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold group-hover:text-emerald-500 transition-colors duration-300">Regular Quality</div>
                      <div className="text-sm opacity-70 mt-1">High quality JPEG</div>
                    </div>
                  </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDownload(true)}
                  className={`p-6 rounded-xl border transition-all duration-300 group ${
                    isDarkMode
                      ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border-emerald-500/50 hover:from-emerald-600/40 hover:to-teal-600/40 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300 hover:from-emerald-200 hover:to-teal-200 text-slate-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold group-hover:text-emerald-400 transition-colors duration-300">4K Ultra HD</div>
                    <div className="text-sm opacity-70 mt-1">Ultra high quality JPEG</div>
                  </div>
                </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallpaper Modal */}
      <AnimatePresence>
        {showWallpaperModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowWallpaperModal(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative z-20 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border w-full max-w-xs sm:max-w-lg lg:max-w-2xl mx-4 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-600/50' 
                  : 'bg-white border-amber-200/50'
              }`}
            >
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Wallpaper Generator
                </h3>
                <button
                  onClick={() => setShowWallpaperModal(false)}
                  className={`p-2 rounded-full transition-colors ${
                    isDarkMode 
                      ? 'hover:bg-slate-700 text-slate-400' 
                      : 'hover:bg-amber-100 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h4 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Choose Format
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedWallpaperFormat('mobile')}
                      className={`p-4 sm:p-6 rounded-xl border transition-all ${
                        selectedWallpaperFormat === 'mobile'
                          ? isDarkMode
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-emerald-500 border-emerald-400 text-white'
                          : isDarkMode
                          ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-white'
                          : 'bg-amber-50/50 border-amber-200 hover:bg-amber-100 text-slate-800'
                      }`}
                    >
                      <div className="text-center">
                        <Smartphone className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-lg font-semibold">Mobile</div>
                        <div className="text-sm opacity-70">9:16 (1080x1920)</div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedWallpaperFormat('desktop')}
                      className={`p-4 sm:p-6 rounded-xl border transition-all ${
                        selectedWallpaperFormat === 'desktop'
                          ? isDarkMode
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-emerald-500 border-emerald-400 text-white'
                          : isDarkMode
                          ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-600 text-white'
                          : 'bg-amber-50/50 border-amber-200 hover:bg-amber-100 text-slate-800'
                      }`}
                    >
                      <div className="text-center">
                        <Monitor className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-lg font-semibold">Desktop</div>
                        <div className="text-sm opacity-70">16:9 (3840x2160)</div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                <div>
                  <h4 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Quality Options
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (selectedWallpaperFormat) {
                          handleWallpaperDownload(selectedWallpaperFormat, false);
                        } else {
                          alert('Please select a wallpaper format (Mobile or Desktop) first');
                        }
                      }}
                      disabled={!selectedWallpaperFormat}
                      className={`p-4 sm:p-6 rounded-xl border transition-all ${
                        !selectedWallpaperFormat
                          ? isDarkMode
                            ? 'bg-slate-600/50 border-slate-600 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-300/50 border-slate-300 text-slate-500 cursor-not-allowed'
                          : isDarkMode
                          ? 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/80 hover:border-slate-600/70 text-white shadow-lg hover:shadow-xl'
                          : 'bg-white/60 border-amber-200/50 hover:bg-amber-50/80 hover:border-amber-300/70 text-slate-800 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-semibold">Regular Quality</div>
                        <div className="text-sm opacity-70">High quality JPEG</div>
                      </div>
                    </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (selectedWallpaperFormat) {
                      handleWallpaperDownload(selectedWallpaperFormat, true);
                    } else {
                      alert('Please select a wallpaper format (Mobile or Desktop) first');
                    }
                  }}
                  disabled={!selectedWallpaperFormat}
                      className={`p-4 sm:p-6 rounded-xl border transition-all ${
                        !selectedWallpaperFormat
                          ? isDarkMode
                            ? 'bg-slate-600/50 border-slate-600 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-300/50 border-slate-300 text-slate-500 cursor-not-allowed'
                          : isDarkMode
                          ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border-emerald-500/50 hover:from-emerald-600/40 hover:to-teal-600/40 text-white shadow-lg hover:shadow-xl'
                          : 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300 hover:from-emerald-200 hover:to-teal-200 text-slate-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">4K Ultra HD</div>
                    <div className="text-sm opacity-70">Ultra high quality JPEG</div>
                  </div>
                </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
