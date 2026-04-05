/**
 * Board generation and management for The Sovereign Warp
 */

import { Node, Position, Piece, PlayerId } from '../types/game';
import {
  getRowConfiguration,
  calculateRowSpacing,
  calculateColumnSpacing,
  VISUAL_CONFIG,
} from '../config/gameConfig';

/**
 * Generate geometric grid board with dynamic spacing
 */
export function generateBoard(nodeCount: 10 | 13 | 16): Node[][] {
  const rowConfig = getRowConfiguration(nodeCount);
  const board: Node[][] = [];

  let nodeIndex = 0;

  rowConfig.forEach((nodesInRow, rowIndex) => {
    const row: Node[] = [];

    for (let colIndex = 0; colIndex < nodesInRow; colIndex++) {
      const position: Position = { row: rowIndex, col: colIndex };

      const node: Node = {
        position,
        piece: null,
        isPlayable: true,
        adjacentNodes: [],
      };

      row.push(node);
      nodeIndex++;
    }

    board.push(row);
  });

  // Calculate adjacent nodes for each node
  calculateAdjacencies(board);

  return board;
}

/**
 * Calculate adjacent nodes for each node in the board
 * Nodes are adjacent if they are in neighboring rows and positions
 */
function calculateAdjacencies(board: Node[][]): void {
  board.forEach((row, rowIndex) => {
    row.forEach((node, colIndex) => {
      const adjacent: Position[] = [];

      // Check same row (left and right neighbors)
      if (colIndex > 0) {
        adjacent.push({ row: rowIndex, col: colIndex - 1 });
      }
      if (colIndex < row.length - 1) {
        adjacent.push({ row: rowIndex, col: colIndex + 1 });
      }

      // Check previous row
      if (rowIndex > 0) {
        const prevRow = board[rowIndex - 1];
        const prevRowLength = prevRow.length;
        const currentRowLength = row.length;

        // Determine which nodes in previous row are adjacent
        if (prevRowLength === currentRowLength) {
          // Same length: directly above and diagonals
          if (colIndex > 0) adjacent.push({ row: rowIndex - 1, col: colIndex - 1 });
          adjacent.push({ row: rowIndex - 1, col: colIndex });
          if (colIndex < prevRowLength - 1) adjacent.push({ row: rowIndex - 1, col: colIndex + 1 });
        } else if (prevRowLength > currentRowLength) {
          // Previous row is longer: connect to center-aligned nodes
          adjacent.push({ row: rowIndex - 1, col: colIndex });
          adjacent.push({ row: rowIndex - 1, col: colIndex + 1 });
        } else {
          // Previous row is shorter: connect based on position
          if (colIndex > 0) {
            adjacent.push({ row: rowIndex - 1, col: colIndex - 1 });
          }
          if (colIndex < prevRowLength) {
            adjacent.push({ row: rowIndex - 1, col: colIndex });
          }
        }
      }

      // Check next row
      if (rowIndex < board.length - 1) {
        const nextRow = board[rowIndex + 1];
        const nextRowLength = nextRow.length;
        const currentRowLength = row.length;

        // Determine which nodes in next row are adjacent
        if (nextRowLength === currentRowLength) {
          // Same length: directly below and diagonals
          if (colIndex > 0) adjacent.push({ row: rowIndex + 1, col: colIndex - 1 });
          adjacent.push({ row: rowIndex + 1, col: colIndex });
          if (colIndex < nextRowLength - 1) adjacent.push({ row: rowIndex + 1, col: colIndex + 1 });
        } else if (nextRowLength > currentRowLength) {
          // Next row is longer: connect to center-aligned nodes
          adjacent.push({ row: rowIndex + 1, col: colIndex });
          adjacent.push({ row: rowIndex + 1, col: colIndex + 1 });
        } else {
          // Next row is shorter: connect based on position
          if (colIndex > 0 && colIndex - 1 < nextRowLength) {
            adjacent.push({ row: rowIndex + 1, col: colIndex - 1 });
          }
          if (colIndex < nextRowLength) {
            adjacent.push({ row: rowIndex + 1, col: colIndex });
          }
        }
      }

      node.adjacentNodes = adjacent;
    });
  });
}

/**
 * Get node at specific position
 */
export function getNodeAt(board: Node[][], position: Position): Node | null {
  const row = board[position.row];
  if (!row) return null;

  const node = row[position.col];
  return node || null;
}

/**
 * Check if a position is valid on the board
 */
export function isValidPosition(board: Node[][], position: Position): boolean {
  return getNodeAt(board, position) !== null;
}

/**
 * Get all adjacent positions for a node
 */
export function getAdjacentPositions(board: Node[][], position: Position): Position[] {
  const node = getNodeAt(board, position);
  return node?.adjacentNodes || [];
}

/**
 * Place a piece on the board
 */
export function placePiece(board: Node[][], position: Position, piece: Piece): boolean {
  const node = getNodeAt(board, position);
  if (!node || !node.isPlayable || node.piece !== null) {
    return false;
  }

  node.piece = piece;
  piece.position = position;
  return true;
}

/**
 * Remove a piece from the board
 */
export function removePiece(board: Node[][], position: Position): Piece | null {
  const node = getNodeAt(board, position);
  if (!node || node.piece === null) {
    return null;
  }

  const piece = node.piece;
  node.piece = null;
  return piece;
}

/**
 * Move a piece on the board
 */
export function movePiece(board: Node[][], from: Position, to: Position): boolean {
  const piece = removePiece(board, from);
  if (!piece) return false;

  return placePiece(board, to, piece);
}

/**
 * Initialize board with starting pieces for both players
 */
export function initializePieces(board: Node[][], nodeCount: 10 | 13 | 16): void {
  const rowCount = board.length;

  // Player 1 pieces on the first row
  board[0].forEach((node, colIndex) => {
    const piece: Piece = {
      id: `p1-${colIndex}`,
      owner: 'player1',
      position: { row: 0, col: colIndex },
      type: 'normal',
    };
    placePiece(board, node.position, piece);
  });

  // Player 2 pieces on the last row
  const lastRowIndex = rowCount - 1;
  board[lastRowIndex].forEach((node, colIndex) => {
    const piece: Piece = {
      id: `p2-${colIndex}`,
      owner: 'player2',
      position: { row: lastRowIndex, col: colIndex },
      type: 'normal',
    };
    placePiece(board, node.position, piece);
  });
}

/**
 * Calculate screen coordinates for a node position
 * Returns x, y coordinates for rendering
 */
export function calculateNodeCoordinates(
  position: Position,
  board: Node[][],
  nodeCount: 10 | 13 | 16
): { x: number; y: number } {
  const rowConfig = getRowConfiguration(nodeCount);
  const nodesInRow = rowConfig[position.row];

  const rowSpacing = calculateRowSpacing(nodeCount);
  const colSpacing = calculateColumnSpacing(nodesInRow);

  // Calculate Y position (vertical)
  const y = VISUAL_CONFIG.nodeRadius * 2 + position.row * rowSpacing;

  // Calculate X position (horizontal, centered)
  const rowWidth = (nodesInRow - 1) * colSpacing;
  const rowOffset = (VISUAL_CONFIG.boardSize - rowWidth) / 2;
  const x = rowOffset + position.col * colSpacing;

  return { x, y };
}

/**
 * Get all pieces for a specific player
 */
export function getPlayerPieces(board: Node[][], playerId: PlayerId): Piece[] {
  const pieces: Piece[] = [];

  board.forEach((row) => {
    row.forEach((node) => {
      if (node.piece && node.piece.owner === playerId) {
        pieces.push(node.piece);
      }
    });
  });

  return pieces;
}

/**
 * Clone board for state manipulation
 */
export function cloneBoard(board: Node[][]): Node[][] {
  return board.map((row) =>
    row.map((node) => ({
      ...node,
      piece: node.piece ? { ...node.piece } : null,
      adjacentNodes: [...node.adjacentNodes],
    }))
  );
}
