import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Palette, Grid3x3, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, themeType, setThemeType } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      type: 'sovereign' as const,
      name: 'Sovereign Aesthetic',
      description: 'The Digital Atelier - High-art luxury',
      icon: Palette,
      preview: {
        primary: '#8a4853',
        secondary: '#5f5e5e',
        surface: '#f9f9f9',
      },
    },
    {
      type: 'cyber' as const,
      name: 'Cyber Tech',
      description: 'Digital Neon Grid - Futuristic 3D',
      icon: Zap,
      preview: {
        primary: '#00ffff',
        secondary: '#ff00ff',
        surface: '#0a0a0a',
      },
    },
  ];

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-effect p-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Theme switcher"
      >
        <Grid3x3 className="w-6 h-6" style={{ color: theme.colors.primary }} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 right-0 w-80 glass-effect rounded-xl shadow-2xl p-6 overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
                   style={{ background: theme.colors.primary }} />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl"
                   style={{ background: theme.colors.secondary }} />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: theme.fonts.display }}>
                Choose Your Theme
              </h3>
              <p className="text-sm opacity-70 mb-6">
                Select the visual experience for your board
              </p>

              <div className="space-y-4">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon;
                  const isActive = themeType === themeOption.type;

                  return (
                    <motion.button
                      key={themeOption.type}
                      onClick={() => {
                        setThemeType(themeOption.type);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        isActive ? 'ring-2' : 'hover:scale-102'
                      }`}
                      style={{
                        background: isActive
                          ? `linear-gradient(135deg, ${themeOption.preview.primary}15, ${themeOption.preview.secondary}15)`
                          : themeOption.preview.surface === '#f9f9f9'
                          ? 'rgba(255, 255, 255, 0.5)'
                          : 'rgba(0, 0, 0, 0.3)',
                        outline: isActive ? `2px solid ${themeOption.preview.primary}` : 'none',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="p-2 rounded-lg"
                          style={{ background: themeOption.preview.primary }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{themeOption.name}</h4>
                          <p className="text-xs opacity-70">{themeOption.description}</p>
                        </div>
                      </div>

                      {/* Color preview */}
                      <div className="flex gap-2 mt-3">
                        <div
                          className="flex-1 h-2 rounded-full"
                          style={{ background: themeOption.preview.primary }}
                        />
                        <div
                          className="flex-1 h-2 rounded-full"
                          style={{ background: themeOption.preview.secondary }}
                        />
                        <div
                          className="flex-1 h-2 rounded-full border"
                          style={{
                            background: themeOption.preview.surface,
                            borderColor: themeOption.preview.primary + '30',
                          }}
                        />
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 text-xs font-medium"
                          style={{ color: themeOption.preview.primary }}
                        >
                          ✓ Currently Active
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-6 pt-4 border-t" style={{ borderColor: theme.colors.outlineVariant }}>
                <p className="text-xs opacity-60 text-center">
                  Theme changes apply instantly across the entire website
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
