'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface AnimatedLogoProps {
  isDarkMode: boolean;
  isAnimating?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AnimatedLogo({ 
  isAnimating = false, 
  size = 'md',
  className = '' 
}: AnimatedLogoProps) {
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
        animate={isAnimating ? {
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        } : {}}
        transition={isAnimating ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
        style={{
          transform: isAnimating ? 'rotate(12deg)' : 'rotate(12deg)'
        }}
      >
        {/* Animated background glow */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 opacity-20"
          animate={isAnimating ? {
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1]
          } : {}}
          transition={isAnimating ? {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          } : {}}
        />
        
        {/* Quote icon */}
        <Quote className={`${iconSizes[size]} text-white drop-shadow-lg`} />
        
        {/* Animated dots */}
        <motion.div 
          className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
          animate={isAnimating ? {
            y: [0, -4, 0],
            scale: [1, 1.2, 1]
          } : {
            y: [0, -2, 0]
          }}
          transition={isAnimating ? {
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          } : {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full"
          animate={isAnimating ? {
            scale: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8]
          } : {
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={isAnimating ? {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
          } : {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Floating double quotes animation */}
      {isAnimating && (
        <>
          <motion.div
            className="absolute -top-2 -left-2 text-2xl text-emerald-400 font-bold"
            animate={{
              y: [0, -8, 0],
              rotate: [0, 5, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            &ldquo;
          </motion.div>
          <motion.div
            className="absolute -bottom-2 -right-2 text-2xl text-emerald-400 font-bold"
            animate={{
              y: [0, 8, 0],
              rotate: [0, -5, 0],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6
            }}
          >
            &rdquo;
          </motion.div>
        </>
      )}

      {/* Pulsing ring during animation */}
      {isAnimating && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-emerald-400"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}
    </div>
  );
}
