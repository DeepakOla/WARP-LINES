import type { BoardConfig, CampaignLevel, AIConfig, AIDifficulty, RulesConfig } from '../types/game';

// ─── Board Configurations ─────────────────────────────────────────────────────
// All board settings live here. Change rows arrays to add/remove node configs.
export const BOARD_CONFIGS: Record<string, BoardConfig> = {
  '3-4-3': {
    id: '3-4-3',
    rows: [3, 4, 3],
    nodeCount: 10,
  },
  '3-4-3-3': {
    id: '3-4-3-3',
    rows: [3, 4, 3, 3],
    nodeCount: 13,
  },
  '3-4-3-3-3': {
    id: '3-4-3-3-3',
    rows: [3, 4, 3, 3, 3],
    nodeCount: 16,
  },
};

export const BOARD_CONFIG_LIST = Object.values(BOARD_CONFIGS);
export const DEFAULT_BOARD_CONFIG = BOARD_CONFIGS['3-4-3'];

// ─── AI Configuration ─────────────────────────────────────────────────────────
export const AI_CONFIGS: Record<AIDifficulty, AIConfig> = {
  1: { difficulty: 1, maxDepth: 1 },
  2: { difficulty: 2, maxDepth: 2 },
  3: { difficulty: 3, maxDepth: 3 },
  4: { difficulty: 4, maxDepth: 4 },
  5: { difficulty: 5, maxDepth: 5 },
};

export const AI_DIFFICULTY_LABELS: Record<AIDifficulty, string> = {
  1: 'Novice',
  2: 'Beginner',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Master',
};

// ─── Game Rules ────────────────────────────────────────────────────────────────
export const DRAW_MOVE_LIMIT = 40;

export const DEFAULT_RULES_CONFIG: RulesConfig = {
  mandatoryCaptures: true,
  turnTimeLimit: null,
  infiltrators: 0,
};

export const TIME_LIMIT_OPTIONS: Array<{ label: string; value: number | null }> = [
  { label: 'Off', value: null },
  { label: '30s', value: 30 },
  { label: '60s', value: 60 },
  { label: '90s', value: 90 },
];

// ─── Board Visual Settings ─────────────────────────────────────────────────────
// Controls the SVG display size of the board
export const BOARD_VISUAL = {
  NODE_RADIUS: 18,
  NODE_SPACING_X: 80,   // horizontal distance between adjacent nodes
  ROW_HEIGHT: 70,       // vertical distance between rows
  SVG_PADDING: 50,      // padding around the board in SVG
};

// ─── Campaign Levels ───────────────────────────────────────────────────────────
export const CAMPAIGN_LEVELS: CampaignLevel[] = [
  {
    id: 1,
    boardConfigId: '3-4-3',
    aiDifficulty: 1,
    rulesConfig: { mandatoryCaptures: false, turnTimeLimit: null, infiltrators: 0 },
    starThresholds: [15, 25, 40],
    name: 'First Contact',
    description: 'Learn the basics on a small board.',
  },
  {
    id: 2,
    boardConfigId: '3-4-3',
    aiDifficulty: 2,
    rulesConfig: { mandatoryCaptures: true, turnTimeLimit: null, infiltrators: 0 },
    starThresholds: [12, 20, 35],
    name: 'Law of Capture',
    description: 'Mandatory captures now apply.',
  },
  {
    id: 3,
    boardConfigId: '3-4-3',
    aiDifficulty: 3,
    rulesConfig: { mandatoryCaptures: true, turnTimeLimit: 90, infiltrators: 0 },
    starThresholds: [12, 18, 30],
    name: 'Clock Pressure',
    description: 'Think fast — 90 second turns.',
  },
  {
    id: 4,
    boardConfigId: '3-4-3-3',
    aiDifficulty: 3,
    rulesConfig: { mandatoryCaptures: true, turnTimeLimit: null, infiltrators: 0 },
    starThresholds: [18, 28, 45],
    name: 'Expanded Theatre',
    description: 'Larger board, more strategy.',
  },
  {
    id: 5,
    boardConfigId: '3-4-3-3',
    aiDifficulty: 3,
    rulesConfig: { mandatoryCaptures: true, turnTimeLimit: 60, infiltrators: 0 },
    starThresholds: [16, 26, 40],
    name: 'Decisive Action',
    description: 'Bigger board and a tighter timer.',
  },
  {
    id: 6,
    boardConfigId: '3-4-3-3',
    aiDifficulty: 4,
    rulesConfig: { mandatoryCaptures: true, turnTimeLimit: null, infiltrators: 1 },
    starThresholds: [14, 22, 38],
    name: 'Infiltration',
    description: 'An infiltrator piece changes everything.',
  },
  {
    id: 7,
    boardConfigId: '3-4-3-3',
    aiDifficulty: 4,
    rulesConfig: { mandatoryCaptures: true, turnTimeLimit: 45, infiltrators: 2 },
    starThresholds: [13, 20, 35],
    name: 'Double Agent',
    description: 'Two infiltrators — chaos under the clock.',
  },
  {
    id: 8,
    boardConfigId: '3-4-3-3-3',
    aiDifficulty: 4,
    rulesConfig: { mandatoryCaptures: true, turnTimeLimit: null, infiltrators: 0 },
    starThresholds: [20, 32, 50],
    name: 'Grand Stage',
    description: 'Full board. Advanced opponent.',
  },
  {
    id: 9,
    boardConfigId: '3-4-3-3-3',
    aiDifficulty: 5,
    rulesConfig: { mandatoryCaptures: true, turnTimeLimit: null, infiltrators: 1 },
    starThresholds: [18, 28, 45],
    name: 'Sovereign Trial',
    description: 'Master AI with an infiltrator.',
  },
  {
    id: 10,
    boardConfigId: '3-4-3-3-3',
    aiDifficulty: 5,
    rulesConfig: { mandatoryCaptures: true, turnTimeLimit: 30, infiltrators: 2 },
    starThresholds: [15, 24, 40],
    name: 'The Sovereign Warp',
    description: 'All rules. Master difficulty. 30 seconds per turn.',
  },
];

// Generate procedural levels beyond 10
export function generateCampaignLevel(levelId: number): CampaignLevel {
  const boardConfigs = ['3-4-3', '3-4-3-3', '3-4-3-3-3'];
  const boardConfigId = boardConfigs[Math.min(2, Math.floor((levelId - 11) / 3))];
  const aiDifficulty: AIDifficulty = 5;
  const extraDepth = Math.floor((levelId - 11) / 5);
  const timeLimit = levelId % 3 === 0 ? Math.max(20, 30 - extraDepth * 2) : null;
  const infiltrators = Math.max(0, Math.min(2, Math.floor((levelId - 11) / 4))) as 0 | 1 | 2;

  const baseStars: [number, number, number] = [
    Math.max(8, 15 - extraDepth),
    Math.max(14, 24 - extraDepth),
    Math.max(22, 38 - extraDepth * 2),
  ];

  return {
    id: levelId,
    boardConfigId,
    aiDifficulty,
    rulesConfig: { mandatoryCaptures: true, turnTimeLimit: timeLimit, infiltrators },
    starThresholds: baseStars,
    name: `Warp ${levelId}`,
    description: `Procedurally generated level ${levelId}.`,
  };
}

export function getCampaignLevel(levelId: number): CampaignLevel {
  const preset = CAMPAIGN_LEVELS.find(l => l.id === levelId);
  if (preset) return preset;
  return generateCampaignLevel(levelId);
}
