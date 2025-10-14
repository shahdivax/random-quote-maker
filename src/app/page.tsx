'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Quote } from 'lucide-react';
import QuoteCard from '@/components/QuoteCard';
import QuoteForm from '@/components/QuoteForm';
import TwitterInput from '@/components/TwitterInput';
import QuoteTemplates, { QuoteTemplate } from '@/components/QuoteTemplates';
import AnimatedLogo from '@/components/AnimatedLogo';
import SteadyLogo from '@/components/SteadyLogo';
import { GeneratedQuote } from '@/lib/ai-service';

export default function Home() {
  const [quote, setQuote] = useState<GeneratedQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lastFormData, setLastFormData] = useState<Record<string, string> | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [hasOpenModal, setHasOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'twitter'>('manual');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQuote = async (formData: Record<string, string>) => {
    setIsLoading(true);
    setQuote(null); // Clear the old quote immediately
    setError(null); // Clear any previous errors
    setLastFormData(formData); // Store form data for regeneration
    try {
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quote');
      }

      const generatedQuote = await response.json();
      setQuote(generatedQuote);
    } catch (error) {
      console.error('Error generating quote:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate quote');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (lastFormData) {
      setIsRegenerating(true);
      setQuote(null); // Clear the old quote immediately
      await handleGenerateQuote(lastFormData);
      setIsRegenerating(false);
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate | null>(null);

  const handleTemplateSelect = (template: QuoteTemplate) => {
    setSelectedTemplate(template);
    setShowTemplates(false);
  };

  const handleClearTemplate = () => {
    setSelectedTemplate(null);
  };

  const handleTwitterSubmit = async (username: string) => {
    setIsLoading(true);
    setQuote(null);
    setError(null); // Clear any previous errors
    try {
      const response = await fetch('/api/generate-quote-twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle rate limit specifically
        if (response.status === 429) {
          setError(`Please try again in 15 minutes, or use the manual input option beside to create a quote instead.`);
          return;
        } else {
          throw new Error(errorData.error || 'Failed to generate quote from Twitter');
        }
      }

      const generatedQuote = await response.json();
      setQuote(generatedQuote);
    } catch (error) {
      console.error('Error generating quote from Twitter:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate quote from Twitter';
      
      // Check if it's a rate limit error
      if (errorMessage.includes('Rate limit exceeded') || errorMessage.includes('429')) {
        setError(`Please try again in 15 minutes, or use the manual input option beside to create a quote instead.`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    }`}>
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-300">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 opacity-20 animate-pulse"></div>
              <Quote className="w-6 h-6 text-white drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-elegant-ui">
              AURA vibes
            </h1>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-full transition-all duration-300 ${
              isDarkMode 
                ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' 
                : 'bg-amber-100 hover:bg-amber-200 text-amber-600'
            }`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className={`text-4xl md:text-6xl font-bold mb-6 font-modern-ui ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Generate Your
            <span className="block bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent font-playful-ui">
              Personal Quotes
            </span>
          </h2>
          <p className={`text-lg md:text-xl max-w-2xl mx-auto font-sophisticated-ui ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Share a thought, choose your vibe, and watch AI craft a unique quote card just for you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={`order-2 lg:order-1 transition-all duration-300 ${
              isLoading || hasOpenModal ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className={`flex rounded-xl p-1 ${
                isDarkMode ? 'bg-slate-700' : 'bg-amber-100'
              }`}>
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'manual'
                      ? isDarkMode
                        ? 'bg-slate-600 text-white shadow-lg'
                        : 'bg-white text-slate-800 shadow-lg'
                      : isDarkMode
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Manual Input
                </button>
                <button
                  onClick={() => setActiveTab('twitter')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === 'twitter'
                      ? isDarkMode
                        ? 'bg-slate-600 text-white shadow-lg'
                        : 'bg-white text-slate-800 shadow-lg'
                      : isDarkMode
                      ? 'text-slate-300 hover:text-white'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>Twitter Analysis</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === 'twitter'
                        ? isDarkMode
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-orange-100 text-orange-600'
                        : isDarkMode
                        ? 'bg-orange-500/10 text-orange-400'
                        : 'bg-orange-50 text-orange-500'
                    }`}>
                      Experimental
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className={`mb-6 p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-red-900/20 border-red-800 text-red-200' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="font-medium">Error</p>
                </div>
                <p className="mt-1 text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className={`mt-2 text-xs underline hover:no-underline ${
                    isDarkMode ? 'text-red-300' : 'text-red-600'
                  }`}
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Form Content */}
            {activeTab === 'manual' ? (
              <QuoteForm 
                onSubmit={handleGenerateQuote} 
                isLoading={isLoading}
                isDarkMode={isDarkMode}
                onTemplatesClick={() => setShowTemplates(true)}
                selectedTemplate={selectedTemplate}
                onClearTemplate={handleClearTemplate}
              />
            ) : (
              <TwitterInput 
                onTwitterSubmit={handleTwitterSubmit}
                isLoading={isLoading}
                isDarkMode={isDarkMode}
              />
            )}
          </motion.div>

          {/* Quote Card Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="sticky top-6">
              {quote && !isRegenerating ? (
                <QuoteCard 
                  quote={quote} 
                  isDarkMode={isDarkMode}
                  onRegenerate={handleRegenerate}
                  onModalStateChange={setHasOpenModal}
                />
              ) : (
                <div className={`aspect-[4/5] rounded-3xl border-2 border-dashed flex items-center justify-center ${
                  isDarkMode 
                    ? 'border-slate-600 bg-slate-800/50' 
                    : 'border-amber-200 bg-amber-50/50'
                }`}>
                  <div className="text-center">
                    {isLoading || isRegenerating ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-6">
                          <AnimatedLogo 
                            isDarkMode={isDarkMode} 
                            isAnimating={true}
                            size="lg"
                          />
                        </div>
                        <p className={`text-lg font-medium ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {isRegenerating ? 'Regenerating your quote...' : 'Generating your quote...'}
                        </p>
                        <p className={`text-sm mt-2 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          This may take a few moments
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-6">
                          <SteadyLogo 
                            isDarkMode={isDarkMode} 
                            size="lg"
                          />
                        </div>
                        <p className={`text-lg font-medium ${
                          isDarkMode ? 'text-slate-400' : 'text-amber-600'
                        }`}>
                          Your quote will appear here
                        </p>
                        <p className={`text-sm mt-2 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          Fill out the form and click generate
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Full-Screen Templates Modal */}
      {showTemplates && (
        <QuoteTemplates
          isDarkMode={isDarkMode}
          onTemplateSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
    </div>
  );
}