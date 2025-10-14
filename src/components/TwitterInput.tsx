'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Twitter, X, Check } from 'lucide-react';

interface TwitterInputProps {
  onTwitterSubmit: (username: string) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

export default function TwitterInput({ onTwitterSubmit, isLoading, isDarkMode }: TwitterInputProps) {
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateUsername = (username: string) => {
    // Remove @ if present and validate Twitter username format
    const cleanUsername = username.replace('@', '').trim();
    const twitterUsernameRegex = /^[a-zA-Z0-9_]{1,15}$/;
    return twitterUsernameRegex.test(cleanUsername);
  };

  const handleUsernameChange = (value: string) => {
    const cleanValue = value.replace('@', '').trim();
    setUsername(cleanValue);
    setIsValid(validateUsername(cleanValue));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && username.trim()) {
      onTwitterSubmit(username.trim());
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-3xl border ${
        isDarkMode 
          ? 'bg-slate-800/50 border-slate-700' 
          : 'bg-white/70 border-amber-200'
      }`}
    >
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-3">
          <Twitter className={`w-8 h-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
          <h3 className={`text-2xl font-bold font-classy-ui ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Twitter Quote Generator
          </h3>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className={`text-sm font-casual-ui ${
          isDarkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          Enter a Twitter username to generate a quote based on their latest tweets
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username Input */}
        <div>
          <label className={`block text-sm font-medium mb-2 font-casual-ui ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Twitter Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>@</span>
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="username"
              maxLength={15}
              className={`w-full pl-8 pr-12 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isValid === true
                  ? 'border-green-500 focus:ring-green-500'
                  : isValid === false
                  ? 'border-red-500 focus:ring-red-500'
                  : isDarkMode 
                  ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white border-amber-200 text-slate-800 placeholder-slate-400'
              }`}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {isValid === true && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {isValid === false && (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
          <p className={`text-xs mt-1 font-modern-ui ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {username.length}/15 characters
          </p>
          {isValid === false && (
            <p className="text-xs mt-1 text-red-500 font-modern-ui">
              Invalid Twitter username format
            </p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || !isValid || !username.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
            isLoading || !isValid || !username.trim()
              ? isDarkMode
                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing Tweets...</span>
            </>
          ) : (
            <>
              <Twitter className="w-5 h-5" />
              <span>Generate Quote from Tweets</span>
            </>
          )}
        </motion.button>
      </form>

      <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <p className={`text-sm font-casual-ui ${
          isDarkMode ? 'text-blue-200' : 'text-blue-700'
        }`}>
          Enter any Twitter username to analyze their account and generate a personalized quote.
        </p>
        <p className={`text-xs mt-2 font-modern-ui ${
          isDarkMode ? 'text-blue-300' : 'text-blue-600'
        }`}></p>
      </div>
    </motion.div>
  );
}
