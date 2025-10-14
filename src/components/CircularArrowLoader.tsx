'use client';

import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface CircularArrowLoaderProps {
  isDarkMode: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CircularArrowLoader({ 
  isDarkMode, 
  size = 'md',
  className = '' 
}: CircularArrowLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Circular background */}
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center ${
          isDarkMode ? 'bg-slate-700' : 'bg-amber-100'
        }`}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Rotating arrow */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <RefreshCw className={`${iconSizes[size]} ${
            isDarkMode ? 'text-emerald-400' : 'text-emerald-500'
          }`} />
        </motion.div>
        
        {/* Pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-emerald-400"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      </motion.div>
    </div>
  );
}
