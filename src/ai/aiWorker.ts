import type { WorkerMessage, WorkerResponse, GameStateSerial, GameState } from '../types/game';
import { buildAdjacencyMap } from '../engine/boardGenerator';
import { getBestMove } from './minimax';

/**
 * Reconstruct a full GameState (with Map-based adjacencyMap) from the
 * serialized version sent over the worker message channel.
 */
function deserializeState(serial: GameStateSerial): GameState {
  const { boardSerial, ...rest } = serial;
  const adjacencyMap = buildAdjacencyMap(
    boardSerial.nodes.length,
    boardSerial.edges
  );
  const board = {
    nodes: boardSerial.nodes,
    edges: boardSerial.edges,
    adjacencyMap,
  };
  return { ...rest, board } as GameState;
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { type, state: serialState, difficulty } = event.data;

  if (type === 'COMPUTE_MOVE') {
    const state = deserializeState(serialState);
    const move = getBestMove(state, difficulty);
    const response: WorkerResponse = { type: 'MOVE_RESULT', move };
    self.postMessage(response);
  }
};
