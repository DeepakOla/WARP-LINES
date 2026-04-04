/**
 * Campaign Mode Configuration
 * 7 levels with progressive difficulty
 */

import type { CampaignLevel } from '../types/game';

export const CAMPAIGN_LEVELS: CampaignLevel[] = [
  {
    level: 1,
    name: 'Tutorial: First Steps',
    description: 'Learn the basics of movement and capturing',
    tutorial: true,
    settings: {
      boardSize: 3,
      mandatoryCaptures: false,
      infiltrators: 0,
      aiDifficulty: 1,
    },
    starsThresholds: [15, 12, 10], // 3 stars for 10 moves or less
  },
  {
    level: 2,
    name: 'Apprentice Challenge',
    description: 'Practice your skills against a beginner AI',
    settings: {
      boardSize: 3,
      mandatoryCaptures: true,
      infiltrators: 0,
      aiDifficulty: 1,
    },
    starsThresholds: [20, 15, 12],
  },
  {
    level: 3,
    name: 'Mandatory Captures',
    description: 'Master the art of forced captures',
    settings: {
      boardSize: 3,
      mandatoryCaptures: true,
      infiltrators: 1,
      aiDifficulty: 1,
    },
    starsThresholds: [25, 20, 15],
  },
  {
    level: 4,
    name: 'Strategist Rising',
    description: 'Face a more challenging opponent',
    settings: {
      boardSize: 3,
      mandatoryCaptures: true,
      infiltrators: 1,
      aiDifficulty: 2,
    },
    starsThresholds: [30, 25, 20],
  },
  {
    level: 5,
    name: 'Larger Board',
    description: 'Expand your tactical thinking on a 4x4 board',
    settings: {
      boardSize: 4,
      mandatoryCaptures: true,
      infiltrators: 0,
      aiDifficulty: 2,
    },
    starsThresholds: [35, 30, 25],
  },
  {
    level: 6,
    name: 'Infiltration Tactics',
    description: 'Adapt to enemy pieces in your ranks',
    settings: {
      boardSize: 4,
      mandatoryCaptures: true,
      infiltrators: 2,
      aiDifficulty: 2,
    },
    starsThresholds: [40, 35, 30],
  },
  {
    level: 7,
    name: 'Grandmaster Trial',
    description: 'The ultimate test of your skills',
    settings: {
      boardSize: 4,
      mandatoryCaptures: true,
      infiltrators: 2,
      aiDifficulty: 3,
    },
    starsThresholds: [50, 45, 40],
  },
];

/**
 * Gets stars earned based on move count
 */
export function getStarsForMoves(level: CampaignLevel, moveCount: number): number {
  if (moveCount <= level.starsThresholds[2]) return 3;
  if (moveCount <= level.starsThresholds[1]) return 2;
  if (moveCount <= level.starsThresholds[0]) return 1;
  return 1; // Always get at least 1 star for winning
}

/**
 * Checks if a level is unlocked
 */
export function isLevelUnlocked(
  level: number,
  completedLevels: number[]
): boolean {
  if (level === 1) return true; // First level always unlocked
  return completedLevels.includes(level - 1); // Previous level must be completed
}
