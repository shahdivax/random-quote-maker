'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Send } from 'lucide-react';

interface QuoteFormProps {
  onSubmit: (data: Record<string, string>) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

export default function QuoteForm({ onSubmit, isLoading, isDarkMode }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    userInput: '',
    theme: 'wisdom',
    mood: 'inspiring',
    length: 'medium',
    aspectRatio: '9:16'
  });

  const themes = [
    { value: 'wisdom', label: 'Wisdom' },
    { value: 'love', label: 'Love' },
    { value: 'success', label: 'Success' },
    { value: 'creativity', label: 'Creativity' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'courage', label: 'Courage' },
    { value: 'growth', label: 'Growth' },
    { value: 'peace', label: 'Peace' }
  ];

  const moods = [
    { value: 'inspiring', label: 'Inspiring' },
    { value: 'calm', label: 'Calm' },
    { value: 'energetic', label: 'Energetic' },
    { value: 'contemplative', label: 'Contemplative' },
    { value: 'hopeful', label: 'Hopeful' },
    { value: 'mysterious', label: 'Mysterious' },
    { value: 'playful', label: 'Playful' },
    { value: 'serious', label: 'Serious' }
  ];

  const lengths = [
    { value: 'short', label: 'Short (1-2 sentences)' },
    { value: 'medium', label: 'Medium (2-3 sentences)' },
    { value: 'long', label: 'Long (3-5 sentences)' }
  ];

  const aspectRatios = [
    { value: '9:16', label: '9:16 (Portrait/Story)', aspect: 'aspect-[9/16]' },
    { value: '1:1', label: '1:1 (Square)', aspect: 'aspect-square' },
    { value: '16:9', label: '16:9 (Landscape)', aspect: 'aspect-[16/9]' },
    { value: '4:5', label: '4:5 (Instagram)', aspect: 'aspect-[4/5]' },
    { value: '3:4', label: '3:4 (Portrait)', aspect: 'aspect-[3/4]' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.userInput.trim()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-3xl border ${
        isDarkMode 
          ? 'bg-slate-800/50 border-slate-700 backdrop-blur-sm' 
          : 'bg-white/70 border-amber-200 backdrop-blur-sm'
      }`}
    >
      <h3 className={`text-2xl font-bold mb-6 font-classy-ui ${
        isDarkMode ? 'text-white' : 'text-slate-800'
      }`}>
        Create Your Quote
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 font-casual-ui ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            What&apos;s on your mind? (10-15 characters)
          </label>
          <input
            type="text"
            value={formData.userInput}
            onChange={(e) => handleInputChange('userInput', e.target.value)}
            maxLength={15}
            placeholder="e.g., 'dreams', 'hope', 'change'"
            className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              isDarkMode 
                ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                : 'bg-white border-amber-200 text-slate-800 placeholder-slate-400'
            }`}
            required
          />
          <p className={`text-xs mt-1 font-modern-ui ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {formData.userInput.length}/15 characters
          </p>
        </div>

        {/* Theme Selection */}
        <div>
          <label className={`block text-sm font-medium mb-3 font-elegant-ui ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Choose a theme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <motion.button
                key={theme.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('theme', theme.value)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  formData.theme === theme.value
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-amber-100 text-slate-700 hover:bg-amber-200'
                }`}
              >
                {theme.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Mood Selection */}
        <div>
          <label className={`block text-sm font-medium mb-3 font-playful-ui ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Set the mood
          </label>
          <div className="grid grid-cols-2 gap-2">
            {moods.map((mood) => (
              <motion.button
                key={mood.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('mood', mood.value)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  formData.mood === mood.value
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-amber-100 text-slate-700 hover:bg-amber-200'
                }`}
              >
                {mood.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Length Selection */}
        <div>
          <label className={`block text-sm font-medium mb-3 font-sophisticated-ui ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Quote length
          </label>
          <div className="space-y-2">
            {lengths.map((length) => (
              <motion.button
                key={length.value}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleInputChange('length', length.value)}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                  formData.length === length.value
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-amber-100 text-slate-700 hover:bg-amber-200'
                }`}
              >
                {length.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Card Size Selection */}
        <div>
          <label className={`block text-sm font-medium mb-3 font-modern-ui ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Card size
          </label>
          <div className="grid grid-cols-2 gap-2">
            {aspectRatios.map((ratio) => (
              <motion.button
                key={ratio.value}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleInputChange('aspectRatio', ratio.value)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  formData.aspectRatio === ratio.value
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    : 'bg-amber-100 text-slate-700 hover:bg-amber-200'
                }`}
              >
                {ratio.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || !formData.userInput.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
            isLoading || !formData.userInput.trim()
              ? isDarkMode
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Generate Quote</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
