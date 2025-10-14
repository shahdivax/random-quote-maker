'use client';

import { motion } from 'framer-motion';

interface WatermarkProps {
  isDarkMode: boolean;
  className?: string;
}

export default function Watermark({ isDarkMode, className = '' }: WatermarkProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className={`absolute bottom-4 right-4 z-20 ${className}`}
    >
      <div className={`text-xs font-medium opacity-30 hover:opacity-50 transition-opacity duration-300 ${
        isDarkMode ? 'text-white' : 'text-slate-600'
      }`}>
        AURA vibes
      </div>
    </motion.div>
  );
}
