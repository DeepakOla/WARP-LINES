export type Player = 'player1' | 'player2';
export type GameMode = 'LOCAL' | 'SOLO' | 'CAMPAIGN';
export type GameStatus = 'WAITING' | 'PLAYING' | 'GAMEOVER' | 'DRAW';
export type Screen = 'MENU' | 'MODE_SELECT' | 'CAMPAIGN_MAP' | 'GAME';
export type AIDifficulty = 1 | 2 | 3 | 4 | 5;

export interface NodePosition {
  x: number;
  y: number;
}

export interface BoardNode {
  id: number;
  position: NodePosition;
  rowIndex: number;
  colIndex: number;
}

export interface BoardEdge {
  from: number;
  to: number;
}

export interface BoardConfig {
  id: string;
  rows: number[];
  nodeCount: number;
}

export interface Piece {
  id: string;
  owner: Player;
  nodeId: number;
  isKing: boolean;
}

export interface Board {
  nodes: BoardNode[];
  edges: BoardEdge[];
  adjacencyMap: Map<number, number[]>;
}

export interface Move {
  pieceId: string;
  fromNodeId: number;
  toNodeId: number;
  capturedPieceId?: string;
  capturedNodeId?: number;
  isChainCapture?: boolean;
}

export interface GameState {
  board: Board;
  pieces: Piece[];
  currentPlayer: Player;
  mode: GameMode;
  status: GameStatus;
  winner: Player | null;
  isDraw: boolean;
  moveCount: number;
  movesSinceCapture: number;
  history: Move[];
  selectedPieceId: string | null;
  validMoves: Move[];
  chainCaptureNodeId: number | null;
  aiDifficulty?: AIDifficulty;
  boardConfig: BoardConfig;
  rulesConfig: RulesConfig;
  campaignLevel?: number;
}

export interface RulesConfig {
  mandatoryCaptures: boolean;
  turnTimeLimit: number | null;
  infiltrators: number;
}

export interface AIConfig {
  difficulty: AIDifficulty;
  maxDepth: number;
}

export interface CampaignLevel {
  id: number;
  boardConfigId: string;
  aiDifficulty: AIDifficulty;
  rulesConfig: RulesConfig;
  starThresholds: [number, number, number];
  name: string;
  description: string;
}

export interface CampaignProgress {
  [levelId: number]: {
    completed: boolean;
    stars: number;
    bestMoves: number;
  };
}

export interface BoardSerial {
  nodes: BoardNode[];
  edges: BoardEdge[];
  adjacencyList: [number, number[]][];
}

export type GameStateSerial = Omit<GameState, 'board'> & {
  boardSerial: BoardSerial;
};

export interface WorkerMessage {
  type: 'COMPUTE_MOVE';
  state: GameStateSerial;
  difficulty: AIDifficulty;
}

export interface WorkerResponse {
  type: 'MOVE_RESULT';
  move: Move | null;
}
