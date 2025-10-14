'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface SteadyLogoProps {
  isDarkMode: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SteadyLogo({ 
  size = 'md',
  className = '' 
}: SteadyLogoProps) {
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
      {/* Main logo container */}
      <motion.div
        className={`relative ${sizeClasses[size]} rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg`}
        style={{
          transform: 'rotate(12deg)'
        }}
        whileHover={{ 
          rotate: 0,
          scale: 1.05,
          transition: { duration: 0.3 }
        }}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 opacity-20"></div>
        
        {/* Quote icon */}
        <Quote className={`${iconSizes[size]} text-white drop-shadow-lg`} />
        
        {/* Static decorative dots */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full"></div>
      </motion.div>
    </div>
  );
}
