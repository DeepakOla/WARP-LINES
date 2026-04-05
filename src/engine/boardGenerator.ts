import type { Board, BoardConfig, BoardNode, BoardEdge, Piece, NodePosition } from '../types/game';
import { BOARD_VISUAL } from '../config/gameConfig';

const { NODE_SPACING_X, ROW_HEIGHT, SVG_PADDING } = BOARD_VISUAL;

/**
 * Returns x-offset for a row based on the alternating triangular grid pattern.
 * Even rows get offset = 0.5 unit, odd rows get 0 — this creates the
 * interlocking geometry needed for capture lines to work via the midpoint formula.
 */
function rowBaseOffset(rowIndex: number): number {
  return rowIndex % 2 === 0 ? 0.5 : 0;
}

/**
 * Calculates pixel coordinates for every node.
 * All x-positions use multiples of NODE_SPACING_X so that midpoints of
 * edges between rows also land precisely on nodes, enabling clean captures.
 */
export function calculateNodeCoordinates(rows: number[]): NodePosition[] {
  const positions: NodePosition[] = [];
  for (let r = 0; r < rows.length; r++) {
    const n = rows[r];
    const offset = rowBaseOffset(r);
    for (let i = 0; i < n; i++) {
      positions.push({
        x: SVG_PADDING + (offset + i) * NODE_SPACING_X,
        y: SVG_PADDING + r * ROW_HEIGHT,
      });
    }
  }
  return positions;
}

/**
 * Returns the global node index for local (row, col) coordinates.
 */
function nodeIndex(rows: number[], rowIndex: number, colIndex: number): number {
  let idx = 0;
  for (let r = 0; r < rowIndex; r++) idx += rows[r];
  return idx + colIndex;
}

/**
 * Generate all edges for a board defined by its row configuration.
 *
 * Rules:
 * - Within each row: connect adjacent nodes (i ↔ i+1).
 * - Between adjacent rows A (smaller/equal) and B (larger/equal):
 *   each node in the smaller row connects to the 2 nearest nodes
 *   in the larger row based on x-position.
 */
export function generateEdges(rows: number[]): BoardEdge[] {
  const positions = calculateNodeCoordinates(rows);
  const edgeSet = new Set<string>();
  const edges: BoardEdge[] = [];

  const addEdge = (a: number, b: number) => {
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`;
    if (!edgeSet.has(key)) {
      edgeSet.add(key);
      edges.push({ from: a, to: b });
    }
  };

  // Within-row edges
  let globalIdx = 0;
  for (let r = 0; r < rows.length; r++) {
    for (let i = 0; i < rows[r] - 1; i++) {
      addEdge(globalIdx + i, globalIdx + i + 1);
    }
    globalIdx += rows[r];
  }

  // Between-row edges
  for (let r = 0; r < rows.length - 1; r++) {
    const nA = rows[r];
    const nB = rows[r + 1];
    const startA = nodeIndex(rows, r, 0);
    const startB = nodeIndex(rows, r + 1, 0);

    // Determine which row is smaller
    const smaller = nA <= nB ? nA : nB;
    const larger = nA <= nB ? nB : nA;
    const startSmall = nA <= nB ? startA : startB;
    const startLarge = nA <= nB ? startB : startA;

    // For each node in the smaller row, connect to 2 nearest in larger row
    for (let i = 0; i < smaller; i++) {
      const px = positions[startSmall + i].x;

      // Find 2 closest nodes in larger row by x distance
      const candidates: Array<{ idx: number; dist: number }> = [];
      for (let j = 0; j < larger; j++) {
        candidates.push({ idx: startLarge + j, dist: Math.abs(positions[startLarge + j].x - px) });
      }
      candidates.sort((a, b) => a.dist - b.dist);
      const topTwo = candidates.slice(0, 2);
      topTwo.forEach(c => addEdge(startSmall + i, c.idx));
    }

    // For same-size rows, also ensure each node connects to its same-index neighbor
    if (nA === nB) {
      for (let i = 0; i < nA; i++) {
        addEdge(startA + i, startB + i);
      }
    }
  }

  return edges;
}

/**
 * Build the adjacency map (nodeId → list of adjacent nodeIds) from edges.
 */
export function buildAdjacencyMap(nodeCount: number, edges: BoardEdge[]): Map<number, number[]> {
  const map = new Map<number, number[]>();
  for (let i = 0; i < nodeCount; i++) map.set(i, []);
  for (const edge of edges) {
    map.get(edge.from)!.push(edge.to);
    map.get(edge.to)!.push(edge.from);
  }
  return map;
}

/**
 * Build a complete Board object from a BoardConfig.
 */
export function buildBoard(config: BoardConfig): Board {
  const positions = calculateNodeCoordinates(config.rows);
  const nodes: BoardNode[] = [];

  let globalIdx = 0;
  for (let r = 0; r < config.rows.length; r++) {
    for (let i = 0; i < config.rows[r]; i++) {
      nodes.push({
        id: globalIdx,
        position: positions[globalIdx],
        rowIndex: r,
        colIndex: i,
      });
      globalIdx++;
    }
  }

  const edges = generateEdges(config.rows);
  const adjacencyMap = buildAdjacencyMap(config.nodeCount, edges);

  return { nodes, edges, adjacencyMap };
}

/**
 * Place initial pieces for both players.
 * Player 1 fills rows from the top; Player 2 from the bottom.
 * Each player gets pieces filling their starting row(s) up to 3 pieces.
 */
export function createInitialPieces(config: BoardConfig): Piece[] {
  const pieces: Piece[] = [];

  // Player 1: first row (top)
  const topRowSize = config.rows[0];
  for (let i = 0; i < topRowSize; i++) {
    pieces.push({
      id: `p1-${i}`,
      owner: 'player1',
      nodeId: i,
      isKing: false,
    });
  }

  // Player 2: last row (bottom)
  const totalNodes = config.nodeCount;
  const bottomRowSize = config.rows[config.rows.length - 1];
  const bottomRowStart = totalNodes - bottomRowSize;
  for (let i = 0; i < bottomRowSize; i++) {
    pieces.push({
      id: `p2-${i}`,
      owner: 'player2',
      nodeId: bottomRowStart + i,
      isKing: false,
    });
  }

  return pieces;
}

/**
 * Return the SVG viewport dimensions needed to display the board.
 */
export function getBoardSVGSize(config: BoardConfig): { width: number; height: number } {
  const maxRowSize = Math.max(...config.rows);
  const width = SVG_PADDING * 2 + (maxRowSize - 1 + 1) * NODE_SPACING_X; // +1 for 0.5 offset
  const height = SVG_PADDING * 2 + (config.rows.length - 1) * ROW_HEIGHT;
  return { width, height };
}
