import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';

interface Cell {
  x: number;
  y: number;
  occupied: boolean;
  piece?: 'player1' | 'player2';
}

export const GameBoard: React.FC = () => {
  const { theme, themeType } = useTheme();
  const boardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 20, y: -20 });
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  // Create 8x8 board
  const boardSize = 8;
  const cells: Cell[] = [];
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      cells.push({ x, y, occupied: false });
    }
  }

  // Sample pieces for demonstration
  cells[3 * boardSize + 3].occupied = true;
  cells[3 * boardSize + 3].piece = 'player1';
  cells[4 * boardSize + 4].occupied = true;
  cells[4 * boardSize + 4].piece = 'player2';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!boardRef.current) return;

      const rect = boardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientY - centerY) / 20;
      const deltaY = (e.clientX - centerX) / 20;

      setRotation({ x: 20 + deltaX, y: -20 + deltaY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <div className="perspective-extreme">
        <motion.div
          ref={boardRef}
          className="preserve-3d"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Board container */}
          <div className="relative" style={{ width: '600px', height: '600px' }}>
            {/* Board base with 3D effect */}
            <div
              className="absolute inset-0 rounded-xl shadow-2xl"
              style={{
                background: themeType === 'sovereign'
                  ? 'linear-gradient(145deg, #ffffff, #f3f3f3)'
                  : 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
                transform: 'translateZ(-20px)',
                boxShadow: themeType === 'cyber'
                  ? '0 20px 60px rgba(0, 255, 255, 0.3), inset 0 0 40px rgba(0, 255, 255, 0.05)'
                  : '0 20px 60px rgba(0, 0, 0, 0.1)',
              }}
            />

            {/* Grid */}
            <div className="absolute inset-0 grid grid-cols-8 gap-1 p-4">
              {cells.map((cell, index) => {
                const isHovered = hoveredCell?.x === cell.x && hoveredCell?.y === cell.y;
                const isLight = (cell.x + cell.y) % 2 === 0;

                return (
                  <motion.div
                    key={index}
                    className="relative preserve-3d cursor-pointer rounded-lg overflow-hidden"
                    style={{
                      background: themeType === 'sovereign'
                        ? isLight ? '#ffffff' : '#f3f3f3'
                        : isLight ? '#1a1a1a' : '#0a0a0a',
                      transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)',
                      transition: 'all 0.2s ease',
                      border: themeType === 'cyber' ? `1px solid ${isLight ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 0, 255, 0.2)'}` : 'none',
                    }}
                    onHoverStart={() => setHoveredCell({ x: cell.x, y: cell.y })}
                    onHoverEnd={() => setHoveredCell(null)}
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Cell glow effect for cyber theme */}
                    {themeType === 'cyber' && isHovered && (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: 'radial-gradient(circle, rgba(0, 255, 255, 0.2), transparent)',
                          animation: 'pulse 1s ease-in-out infinite',
                        }}
                      />
                    )}

                    {/* Piece */}
                    {cell.occupied && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center preserve-3d"
                        initial={{ scale: 0, rotateY: 0 }}
                        animate={{ scale: 1, rotateY: 360 }}
                        transition={{ duration: 0.6, type: 'spring' }}
                      >
                        <div
                          className="w-12 h-12 rounded-full shadow-lg"
                          style={{
                            background: cell.piece === 'player1'
                              ? themeType === 'sovereign'
                                ? 'linear-gradient(145deg, #8a4853, #a6606b)'
                                : 'linear-gradient(145deg, #00ffff, #00cccc)'
                              : themeType === 'sovereign'
                              ? 'linear-gradient(145deg, #5f5e5e, #7a7979)'
                              : 'linear-gradient(145deg, #ff00ff, #cc00cc)',
                            transform: 'translateZ(20px)',
                            boxShadow: themeType === 'cyber'
                              ? cell.piece === 'player1'
                                ? '0 0 20px rgba(0, 255, 255, 0.6), 0 0 40px rgba(0, 255, 255, 0.4)'
                                : '0 0 20px rgba(255, 0, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4)'
                              : '0 10px 20px rgba(0, 0, 0, 0.2)',
                          }}
                        />
                      </motion.div>
                    )}

                    {/* Grid lines for cyber theme */}
                    {themeType === 'cyber' && (
                      <>
                        <div
                          className="absolute top-0 left-0 right-0 h-px"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
                          }}
                        />
                        <div
                          className="absolute top-0 bottom-0 left-0 w-px"
                          style={{
                            background: 'linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
                          }}
                        />
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Decorative edges for 3D effect */}
            <div
              className="absolute -bottom-8 left-0 right-0 h-8 rounded-b-xl"
              style={{
                background: themeType === 'sovereign'
                  ? 'linear-gradient(180deg, #e2e2e2, #d0d0d0)'
                  : 'linear-gradient(180deg, #0a0a0a, #000000)',
                transform: 'rotateX(-90deg)',
                transformOrigin: 'top',
                opacity: 0.5,
              }}
            />
          </div>

          {/* Floating info cards */}
          <motion.div
            className="absolute -left-48 top-1/4 glass-effect p-6 rounded-xl shadow-xl"
            style={{
              width: '180px',
              transform: 'translateZ(40px) rotateY(15deg)',
            }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="text-sm font-semibold mb-2" style={{ color: theme.colors.primary }}>
              Player 1
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full"
                style={{
                  background: themeType === 'sovereign'
                    ? 'linear-gradient(145deg, #8a4853, #a6606b)'
                    : 'linear-gradient(145deg, #00ffff, #00cccc)',
                  boxShadow: themeType === 'cyber' ? '0 0 15px rgba(0, 255, 255, 0.5)' : 'none',
                }}
              />
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs opacity-70">Pieces</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute -right-48 top-1/4 glass-effect p-6 rounded-xl shadow-xl"
            style={{
              width: '180px',
              transform: 'translateZ(40px) rotateY(-15deg)',
            }}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          >
            <div className="text-sm font-semibold mb-2" style={{ color: theme.colors.secondary }}>
              Player 2
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full"
                style={{
                  background: themeType === 'sovereign'
                    ? 'linear-gradient(145deg, #5f5e5e, #7a7979)'
                    : 'linear-gradient(145deg, #ff00ff, #cc00cc)',
                  boxShadow: themeType === 'cyber' ? '0 0 15px rgba(255, 0, 255, 0.5)' : 'none',
                }}
              />
              <div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs opacity-70">Pieces</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
