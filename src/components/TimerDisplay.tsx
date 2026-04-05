import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  seconds: number;
  onExpire: () => void;
  isActive: boolean;
  resetKey?: number;
}

export const TimerDisplay: React.FC<Props> = ({ seconds, onExpire, isActive, resetKey }) => {
  const { theme, themeType } = useTheme();
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSovereign = themeType === 'sovereign';

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds, resetKey]);

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, onExpire, resetKey]);

  const ratio = remaining / seconds;
  const isWarning = ratio <= 0.33;
  const isDanger = ratio <= 0.15;

  const color = isDanger
    ? (isSovereign ? '#e53935' : '#ff0055')
    : isWarning
    ? (isSovereign ? '#ff9800' : '#ffaa00')
    : theme.colors.primary;

  const circumference = 2 * Math.PI * 20;
  const dash = circumference * ratio;

  return (
    <motion.div
      className="flex items-center gap-2"
      animate={isDanger ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.5, repeat: isDanger ? Infinity : 0 }}
    >
      <svg width={52} height={52}>
        {/* Background ring */}
        <circle
          cx={26} cy={26} r={20}
          fill="none"
          stroke={isSovereign ? '#e0e0e0' : '#1a2a2a'}
          strokeWidth={4}
        />
        {/* Progress ring */}
        <circle
          cx={26} cy={26} r={20}
          fill="none"
          stroke={color}
          strokeWidth={4}
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 26 26)"
          style={{
            transition: 'stroke-dasharray 1s linear, stroke 0.3s',
            filter: !isSovereign ? `drop-shadow(0 0 4px ${color})` : 'none',
          }}
        />
        {/* Number */}
        <text
          x={26} y={32}
          textAnchor="middle"
          fontSize={14}
          fontWeight="bold"
          fill={color}
          fontFamily={theme.fonts.body}
        >
          {remaining}
        </text>
      </svg>
    </motion.div>
  );
};
