'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, Lightbulb, Target, Zap, Shield, TreePine } from 'lucide-react';

interface QuoteTemplatesProps {
  isDarkMode: boolean;
  onTemplateSelect: (template: QuoteTemplate) => void;
  onClose: () => void;
}

export interface QuoteTemplate {
  id: string;
  name: string;
  icon: React.ReactNode;
  theme: string;
  mood: string;
  description: string;
  gradient: string;
  typography: string;
}

const templates: QuoteTemplate[] = [
  {
    id: 'motivational',
    name: 'Motivational',
    icon: <Target className="w-6 h-6" />,
    theme: 'success',
    mood: 'inspiring',
    description: 'Perfect for daily motivation and goal-setting',
    gradient: 'from-orange-400 via-red-500 to-pink-600',
    typography: 'bold'
  },
  {
    id: 'love',
    name: 'Love & Romance',
    icon: <Heart className="w-6 h-6" />,
    theme: 'love',
    mood: 'hopeful',
    description: 'Sweet quotes for relationships and romance',
    gradient: 'from-pink-400 via-rose-500 to-red-500',
    typography: 'elegant'
  },
  {
    id: 'wisdom',
    name: 'Ancient Wisdom',
    icon: <TreePine className="w-6 h-6" />,
    theme: 'wisdom',
    mood: 'contemplative',
    description: 'Deep thoughts and philosophical insights',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    typography: 'serif'
  },
  {
    id: 'creativity',
    name: 'Creative Spark',
    icon: <Lightbulb className="w-6 h-6" />,
    theme: 'creativity',
    mood: 'energetic',
    description: 'Inspire artistic expression and innovation',
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    typography: 'playful'
  },
  {
    id: 'success',
    name: 'Success & Achievement',
    icon: <Star className="w-6 h-6" />,
    theme: 'success',
    mood: 'inspiring',
    description: 'Celebrate achievements and milestones',
    gradient: 'from-purple-500 via-indigo-500 to-blue-600',
    typography: 'bold'
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: <Shield className="w-6 h-6" />,
    theme: 'mindfulness',
    mood: 'calm',
    description: 'Peaceful thoughts for meditation and reflection',
    gradient: 'from-green-300 via-emerald-400 to-teal-500',
    typography: 'minimalist'
  },
  {
    id: 'courage',
    name: 'Courage & Strength',
    icon: <Zap className="w-6 h-6" />,
    theme: 'courage',
    mood: 'energetic',
    description: 'Empowering quotes for facing challenges',
    gradient: 'from-blue-500 via-purple-500 to-pink-500',
    typography: 'dramatic'
  }
];

export default function QuoteTemplates({ isDarkMode, onTemplateSelect, onClose }: QuoteTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<QuoteTemplate | null>(null);

  const handleTemplateClick = (template: QuoteTemplate) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
    onClose();
  };

  return (
    <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`relative z-10 w-full h-full flex flex-col ${
            isDarkMode 
              ? 'bg-slate-900/95' 
              : 'bg-white/95'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700/20">
            <h3 className={`text-2xl sm:text-3xl font-bold ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              Choose Your Template
            </h3>
            <button
              onClick={onClose}
              className={`p-3 rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-slate-700 text-slate-400' 
                  : 'hover:bg-amber-100 text-slate-600'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {templates.map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTemplateClick(template)}
                className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 text-left group ${
                  isDarkMode
                    ? 'bg-slate-800/70 border-slate-700/50 hover:bg-slate-700/90 hover:border-slate-600/70 text-white shadow-xl hover:shadow-2xl'
                    : 'bg-white/70 border-amber-200/50 hover:bg-amber-50/90 hover:border-amber-300/70 text-slate-800 shadow-xl hover:shadow-2xl'
                }`}
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${template.gradient} text-white shadow-xl group-hover:shadow-2xl transition-all duration-300`}>
                    {template.icon}
                  </div>
                  <h4 className="text-xl font-bold group-hover:text-emerald-500 transition-colors duration-300">{template.name}</h4>
                </div>
                <p className={`text-base leading-relaxed mb-6 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  {template.description}
                </p>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                    isDarkMode ? 'bg-slate-700/80 text-slate-200 border border-slate-600' : 'bg-amber-100 text-slate-700 border border-amber-200'
                  }`}>
                    {template.theme}
                  </span>
                  <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                    isDarkMode ? 'bg-slate-700/80 text-slate-200 border border-slate-600' : 'bg-amber-100 text-slate-700 border border-amber-200'
                  }`}>
                    {template.mood}
                  </span>
                </div>
              </motion.button>
            ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-700/20">
            <p className={`text-center text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Choose a template to automatically set your quote's theme, mood, and styling
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
