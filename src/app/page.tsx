'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Quote } from 'lucide-react';
import QuoteCard from '@/components/QuoteCard';
import QuoteForm from '@/components/QuoteForm';
import QuoteTemplates, { QuoteTemplate } from '@/components/QuoteTemplates';
import { GeneratedQuote } from '@/lib/ai-service';

export default function Home() {
  const [quote, setQuote] = useState<GeneratedQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [lastFormData, setLastFormData] = useState<Record<string, string> | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [hasOpenModal, setHasOpenModal] = useState(false);

  const handleGenerateQuote = async (formData: Record<string, string>) => {
    setIsLoading(true);
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
        throw new Error('Failed to generate quote');
      }

      const generatedQuote = await response.json();
      setQuote(generatedQuote);
    } catch (error) {
      console.error('Error generating quote:', error);
      // You could add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (lastFormData) {
      await handleGenerateQuote(lastFormData);
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
            <QuoteForm 
              onSubmit={handleGenerateQuote} 
              isLoading={isLoading}
              isDarkMode={isDarkMode}
              onTemplatesClick={() => setShowTemplates(true)}
              selectedTemplate={selectedTemplate}
              onClearTemplate={handleClearTemplate}
            />
          </motion.div>

          {/* Quote Card Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="order-1 lg:order-2"
          >
            <div className="sticky top-6">
              {quote ? (
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
                    {isLoading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                            isDarkMode ? 'bg-slate-700' : 'bg-amber-100'
                          }`}
                        >
                          <Sparkles className={`w-8 h-8 ${
                            isDarkMode ? 'text-emerald-400' : 'text-emerald-500'
                          }`} />
                        </motion.div>
                        <p className={`text-lg font-medium ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          Generating your quote...
                        </p>
                        <p className={`text-sm mt-2 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          This may take a few moments
                        </p>
                      </>
                    ) : (
                      <>
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                          isDarkMode ? 'bg-slate-700' : 'bg-amber-100'
                        }`}>
                          <Sparkles className={`w-8 h-8 ${
                            isDarkMode ? 'text-slate-400' : 'text-amber-400'
                          }`} />
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
                      </>
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