import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type {
  GameState,
  GameMode,
  BoardConfig,
  RulesConfig,
  AIDifficulty,
  Move,
  Piece,
  Screen,
  CampaignProgress,
  GameStateSerial,
  WorkerResponse,
} from '../types/game';
import { createInitialGameState, applyMove, switchTurn } from '../engine/gameState';
import { evaluateGameEnd } from '../engine/winCondition';
import { DEFAULT_BOARD_CONFIG, DEFAULT_RULES_CONFIG, getCampaignLevel } from '../config/gameConfig';
import { BOARD_CONFIGS } from '../config/gameConfig';

// ─── Types ────────────────────────────────────────────────────────────────────

interface GameContextValue {
  screen: Screen;
  gameState: GameState | null;
  campaignProgress: CampaignProgress;
  selectedDifficulty: AIDifficulty;
  selectedBoardConfig: BoardConfig;
  selectedRulesConfig: RulesConfig;
  selectedMode: GameMode;
  isAIThinking: boolean;
  // Actions
  navigateTo: (screen: Screen) => void;
  setDifficulty: (d: AIDifficulty) => void;
  setBoardConfig: (c: BoardConfig) => void;
  setRulesConfig: (r: RulesConfig) => void;
  setMode: (m: GameMode) => void;
  startGame: (campaignLevel?: number) => void;
  selectPiece: (pieceId: string | null) => void;
  makeMove: (move: Move) => void;
  resetGame: () => void;
  undoMove: () => void;
  passTurn: () => void;
}

// ─── State ────────────────────────────────────────────────────────────────────

interface ContextState {
  screen: Screen;
  gameState: GameState | null;
  campaignProgress: CampaignProgress;
  selectedDifficulty: AIDifficulty;
  selectedBoardConfig: BoardConfig;
  selectedRulesConfig: RulesConfig;
  selectedMode: GameMode;
  isAIThinking: boolean;
}

type Action =
  | { type: 'SET_SCREEN'; screen: Screen }
  | { type: 'SET_GAME_STATE'; state: GameState | null }
  | { type: 'SET_DIFFICULTY'; difficulty: AIDifficulty }
  | { type: 'SET_BOARD_CONFIG'; config: BoardConfig }
  | { type: 'SET_RULES_CONFIG'; config: RulesConfig }
  | { type: 'SET_MODE'; mode: GameMode }
  | { type: 'SET_AI_THINKING'; thinking: boolean }
  | { type: 'UPDATE_CAMPAIGN_PROGRESS'; progress: CampaignProgress };

function reducer(state: ContextState, action: Action): ContextState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, screen: action.screen };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.state ?? null };
    case 'SET_DIFFICULTY':
      return { ...state, selectedDifficulty: action.difficulty };
    case 'SET_BOARD_CONFIG':
      return { ...state, selectedBoardConfig: action.config };
    case 'SET_RULES_CONFIG':
      return { ...state, selectedRulesConfig: action.config };
    case 'SET_MODE':
      return { ...state, selectedMode: action.mode };
    case 'SET_AI_THINKING':
      return { ...state, isAIThinking: action.thinking };
    case 'UPDATE_CAMPAIGN_PROGRESS':
      return { ...state, campaignProgress: action.progress };
    default:
      return state;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadCampaignProgress(): CampaignProgress {
  try {
    const saved = localStorage.getItem('warp-lines-campaign');
    if (saved) return JSON.parse(saved) as CampaignProgress;
  } catch {
    // ignore
  }
  return {};
}

function saveCampaignProgress(progress: CampaignProgress) {
  localStorage.setItem('warp-lines-campaign', JSON.stringify(progress));
}

function serializeState(state: GameState): GameStateSerial {
  const adjacencyList: [number, number[]][] = [];
  state.board.adjacencyMap.forEach((neighbors, nodeId) => {
    adjacencyList.push([nodeId, neighbors]);
  });
  const { board, ...rest } = state;
  return {
    ...rest,
    boardSerial: {
      nodes: board.nodes,
      edges: board.edges,
      adjacencyList,
    },
  };
}

function computeStars(moves: number, thresholds: [number, number, number]): number {
  if (moves <= thresholds[0]) return 3;
  if (moves <= thresholds[1]) return 2;
  if (moves <= thresholds[2]) return 1;
  return 0;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GameContext = createContext<GameContextValue | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    screen: 'MENU',
    gameState: null,
    campaignProgress: loadCampaignProgress(),
    selectedDifficulty: 3,
    selectedBoardConfig: DEFAULT_BOARD_CONFIG,
    selectedRulesConfig: DEFAULT_RULES_CONFIG,
    selectedMode: 'LOCAL',
    isAIThinking: false,
  });

  const workerRef = useRef<Worker | null>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const campaignProgressRef = useRef<CampaignProgress>(state.campaignProgress);
  // Ref to avoid circular dependency between applyAIMove and handleCampaignCompletion
  const handleCampaignCompletionRef = useRef<(gs: GameState, winner: string | null) => void>(() => {});

  // Keep refs in sync
  useEffect(() => {
    gameStateRef.current = state.gameState;
  }, [state.gameState]);
  useEffect(() => {
    campaignProgressRef.current = state.campaignProgress;
  }, [state.campaignProgress]);

  const applyAIMove = useCallback((move: Move) => {
    const gs = gameStateRef.current;
    if (!gs) return;

    const newState = applyMove(gs, move);
    const endResult = evaluateGameEnd(newState);

    if (endResult) {
      if ('draw' in endResult) {
        dispatch({ type: 'SET_GAME_STATE', state: { ...newState, status: 'DRAW', isDraw: true } });
      } else {
        const finalState = { ...newState, status: 'GAMEOVER' as const, winner: endResult.winner };
        dispatch({ type: 'SET_GAME_STATE', state: finalState });
        handleCampaignCompletionRef.current(finalState, endResult.winner);
      }
    } else {
      dispatch({ type: 'SET_GAME_STATE', state: newState });
    }
    dispatch({ type: 'SET_AI_THINKING', thinking: false });
  }, []);

  // Initialise AI worker
  useEffect(() => {
    const worker = new Worker(new URL('../ai/aiWorker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      if (event.data.type === 'MOVE_RESULT') {
        if (event.data.move) {
          applyAIMove(event.data.move);
        } else {
          dispatch({ type: 'SET_AI_THINKING', thinking: false });
        }
      }
    };

    return () => worker.terminate();
  }, [applyAIMove]);

  // Trigger AI when it's the AI's turn
  useEffect(() => {
    const gs = state.gameState;
    if (!gs || gs.status !== 'PLAYING') return;
    if (gs.mode !== 'SOLO' && gs.mode !== 'CAMPAIGN') return;
    if (gs.currentPlayer !== 'player2') return;
    if (state.isAIThinking) return;

    dispatch({ type: 'SET_AI_THINKING', thinking: true });

    const serialized = serializeState(gs);
    workerRef.current?.postMessage({
      type: 'COMPUTE_MOVE',
      state: serialized,
      difficulty: gs.aiDifficulty ?? 3,
    });
  }, [state.gameState?.currentPlayer, state.gameState?.status]);

  const handleCampaignCompletion = useCallback(
    (gs: GameState, winner: string | null) => {
      if (gs.mode !== 'CAMPAIGN' || gs.campaignLevel == null) return;
      if (winner !== 'player1') return;

      const level = getCampaignLevel(gs.campaignLevel);
      const stars = computeStars(gs.moveCount, level.starThresholds);
      const existing = campaignProgressRef.current[gs.campaignLevel];

      if (!existing || stars > existing.stars) {
        const updated: CampaignProgress = {
          ...campaignProgressRef.current,
          [gs.campaignLevel]: {
            completed: true,
            stars,
            bestMoves: Math.min(gs.moveCount, existing?.bestMoves ?? Infinity),
          },
        };
        saveCampaignProgress(updated);
        dispatch({ type: 'UPDATE_CAMPAIGN_PROGRESS', progress: updated });
      }
    },
    []
  );

  // Keep the ref in sync so applyAIMove can call it without a direct dependency
  useEffect(() => {
    handleCampaignCompletionRef.current = handleCampaignCompletion;
  }, [handleCampaignCompletion]);

  // ─── Public API ─────────────────────────────────────────────────────────────

  const navigateTo = useCallback((screen: Screen) => {
    dispatch({ type: 'SET_SCREEN', screen });
  }, []);

  const setDifficulty = useCallback((d: AIDifficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty: d });
  }, []);

  const setBoardConfig = useCallback((c: BoardConfig) => {
    dispatch({ type: 'SET_BOARD_CONFIG', config: c });
  }, []);

  const setRulesConfig = useCallback((r: RulesConfig) => {
    dispatch({ type: 'SET_RULES_CONFIG', config: r });
  }, []);

  const setMode = useCallback((m: GameMode) => {
    dispatch({ type: 'SET_MODE', mode: m });
  }, []);

  const startGame = useCallback(
    (campaignLevel?: number) => {
      let boardConfig = state.selectedBoardConfig;
      let rulesConfig = state.selectedRulesConfig;
      let difficulty: AIDifficulty = state.selectedDifficulty;

      if (campaignLevel != null) {
        const level = getCampaignLevel(campaignLevel);
        boardConfig = BOARD_CONFIGS[level.boardConfigId] ?? DEFAULT_BOARD_CONFIG;
        rulesConfig = level.rulesConfig;
        difficulty = level.aiDifficulty;
      }

      const gs = createInitialGameState(
        boardConfig,
        campaignLevel != null ? 'CAMPAIGN' : state.selectedMode,
        rulesConfig,
        difficulty,
        campaignLevel
      );

      dispatch({ type: 'SET_GAME_STATE', state: gs });
      dispatch({ type: 'SET_SCREEN', screen: 'GAME' });
    },
    [state.selectedBoardConfig, state.selectedRulesConfig, state.selectedDifficulty, state.selectedMode]
  );

  const selectPiece = useCallback(
    (pieceId: string | null) => {
      if (!state.gameState) return;

      // If in chain capture mode, don't allow selecting a different piece
      if (state.gameState.chainCaptureNodeId !== null && pieceId !== state.gameState.selectedPieceId) {
        return;
      }

      dispatch({
        type: 'SET_GAME_STATE',
        state: { ...state.gameState, selectedPieceId: pieceId },
      });
    },
    [state.gameState]
  );

  const makeMove = useCallback(
    (move: Move) => {
      if (!state.gameState || state.gameState.status !== 'PLAYING') return;

      const newState = applyMove(state.gameState, move);
      const endResult = evaluateGameEnd(newState);

      if (endResult) {
        if ('draw' in endResult) {
          dispatch({ type: 'SET_GAME_STATE', state: { ...newState, status: 'DRAW', isDraw: true } });
        } else {
          dispatch({
            type: 'SET_GAME_STATE',
            state: { ...newState, status: 'GAMEOVER', winner: endResult.winner },
          });
          handleCampaignCompletion(newState, endResult.winner);
        }
      } else {
        dispatch({ type: 'SET_GAME_STATE', state: newState });
      }
    },
    [state.gameState, handleCampaignCompletion]
  );

  const resetGame = useCallback(() => {
    dispatch({ type: 'SET_GAME_STATE', state: null });
    dispatch({ type: 'SET_SCREEN', screen: 'MENU' });
  }, []);

  const undoMove = useCallback(() => {
    // Only supported in LOCAL mode and when history exists
    if (!state.gameState) return;
    if (state.gameState.mode !== 'LOCAL') return;
    if (state.gameState.history.length === 0) return;
    // Rebuild state by replaying all moves except the last
    const { boardConfig, mode, rulesConfig, aiDifficulty, campaignLevel } = state.gameState;
    const history = state.gameState.history.slice(0, -1);
    let gs = createInitialGameState(boardConfig, mode, rulesConfig, aiDifficulty, campaignLevel);
    for (const m of history) {
      gs = applyMove(gs, m);
    }
    dispatch({ type: 'SET_GAME_STATE', state: gs });
  }, [state.gameState]);

  const passTurn = useCallback(() => {
    if (!state.gameState) return;
    dispatch({ type: 'SET_GAME_STATE', state: switchTurn(state.gameState) });
  }, [state.gameState]);

  const value: GameContextValue = {
    screen: state.screen,
    gameState: state.gameState,
    campaignProgress: state.campaignProgress,
    selectedDifficulty: state.selectedDifficulty,
    selectedBoardConfig: state.selectedBoardConfig,
    selectedRulesConfig: state.selectedRulesConfig,
    selectedMode: state.selectedMode,
    isAIThinking: state.isAIThinking,
    navigateTo,
    setDifficulty,
    setBoardConfig,
    setRulesConfig,
    setMode,
    startGame,
    selectPiece,
    makeMove,
    resetGame,
    undoMove,
    passTurn,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextValue => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
};
