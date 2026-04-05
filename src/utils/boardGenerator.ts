/**
 * Board Generation Utilities
 *
 * Generates game boards with different shapes and configurations
 */

import { BoardConfig, BoardShape } from '../config/game.config';
import { Board, Cell, Piece, Position, PlayerColor } from '../types/game';

/**
 * Generate a board based on the provided configuration
 */
export function generateBoard(config: BoardConfig): Board {
  const cells = generateCells(config);
  const pieces = generateInitialPieces(config);

  // Place pieces on cells
  pieces.forEach((piece) => {
    const cell = cells[piece.position.row][piece.position.col];
    if (cell) {
      cell.piece = piece;
    }
  });

  return {
    config,
    cells,
    pieces,
  };
}

/**
 * Generate cells based on board shape
 */
function generateCells(config: BoardConfig): Cell[][] {
  switch (config.shape) {
    case 'triangle':
      return generateTriangleCells(config);
    case 'rectangle':
      return generateRectangleCells(config);
    case 'square':
      return generateSquareCells(config);
    default:
      throw new Error(`Unknown board shape: ${config.shape}`);
  }
}

/**
 * Generate triangular board cells
 * Pattern: row 0 has 1 cell, row 1 has 2 cells, row 2 has 3 cells, etc.
 */
function generateTriangleCells(config: BoardConfig): Cell[][] {
  const cells: Cell[][] = [];
  const rows = config.rows;

  for (let row = 0; row < rows; row++) {
    const rowCells: Cell[] = [];
    const cellsInRow = row + 1;

    for (let col = 0; col < cellsInRow; col++) {
      const position: Position = { row, col };
      const cell: Cell = {
        position,
        piece: null,
        isPlayable: true,
        neighbors: getTriangleNeighbors(position, rows),
      };
      rowCells.push(cell);
    }

    cells.push(rowCells);
  }

  return cells;
}

/**
 * Generate rectangular board cells
 */
function generateRectangleCells(config: BoardConfig): Cell[][] {
  const cells: Cell[][] = [];
  const rows = config.rows;
  const cols = Math.floor(config.nodes / rows);

  for (let row = 0; row < rows; row++) {
    const rowCells: Cell[] = [];

    for (let col = 0; col < cols; col++) {
      const position: Position = { row, col };
      const cell: Cell = {
        position,
        piece: null,
        isPlayable: true,
        neighbors: getRectangleNeighbors(position, rows, cols),
      };
      rowCells.push(cell);
    }

    cells.push(rowCells);
  }

  return cells;
}

/**
 * Generate square board cells
 */
function generateSquareCells(config: BoardConfig): Cell[][] {
  const cells: Cell[][] = [];
  const size = Math.floor(Math.sqrt(config.nodes));

  for (let row = 0; row < size; row++) {
    const rowCells: Cell[] = [];

    for (let col = 0; col < size; col++) {
      const position: Position = { row, col };
      const cell: Cell = {
        position,
        piece: null,
        isPlayable: true,
        neighbors: getSquareNeighbors(position, size),
      };
      rowCells.push(cell);
    }

    cells.push(rowCells);
  }

  return cells;
}

/**
 * Get neighboring positions for a triangular grid
 */
function getTriangleNeighbors(position: Position, maxRows: number): Position[] {
  const { row, col } = position;
  const neighbors: Position[] = [];

  // Left neighbor (same row)
  if (col > 0) {
    neighbors.push({ row, col: col - 1 });
  }

  // Right neighbor (same row)
  if (col < row) {
    neighbors.push({ row, col: col + 1 });
  }

  // Upper-left neighbor (previous row)
  if (row > 0 && col > 0) {
    neighbors.push({ row: row - 1, col: col - 1 });
  }

  // Upper-right neighbor (previous row)
  if (row > 0 && col <= row - 1) {
    neighbors.push({ row: row - 1, col });
  }

  // Lower-left neighbor (next row)
  if (row < maxRows - 1) {
    neighbors.push({ row: row + 1, col });
  }

  // Lower-right neighbor (next row)
  if (row < maxRows - 1) {
    neighbors.push({ row: row + 1, col: col + 1 });
  }

  return neighbors;
}

/**
 * Get neighboring positions for a rectangular grid
 */
function getRectangleNeighbors(position: Position, rows: number, cols: number): Position[] {
  const { row, col } = position;
  const neighbors: Position[] = [];

  // Orthogonal neighbors
  const directions = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
  ];

  // Diagonal neighbors
  const diagonals = [
    { row: -1, col: -1 }, // Upper-left
    { row: -1, col: 1 }, // Upper-right
    { row: 1, col: -1 }, // Lower-left
    { row: 1, col: 1 }, // Lower-right
  ];

  [...directions, ...diagonals].forEach(({ row: dr, col: dc }) => {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      neighbors.push({ row: newRow, col: newCol });
    }
  });

  return neighbors;
}

/**
 * Get neighboring positions for a square grid
 */
function getSquareNeighbors(position: Position, size: number): Position[] {
  return getRectangleNeighbors(position, size, size);
}

/**
 * Generate initial pieces for the board
 */
function generateInitialPieces(config: BoardConfig): Piece[] {
  switch (config.shape) {
    case 'triangle':
      return generateTrianglePieces(config);
    case 'rectangle':
      return generateRectanglePieces(config);
    case 'square':
      return generateSquarePieces(config);
    default:
      throw new Error(`Unknown board shape: ${config.shape}`);
  }
}

/**
 * Generate pieces for triangular board
 * RED pieces at the bottom, GREEN pieces at the top
 */
function generateTrianglePieces(config: BoardConfig): Piece[] {
  const pieces: Piece[] = [];
  let pieceId = 0;
  const rows = config.rows;

  // GREEN pieces (top 2 rows)
  for (let row = 0; row < Math.min(2, rows); row++) {
    for (let col = 0; col <= row; col++) {
      pieces.push({
        id: pieceId++,
        color: 'GREEN',
        position: { row, col },
        isInfiltrator: false,
        isCaptured: false,
      });
    }
  }

  // RED pieces (bottom 2 rows)
  for (let row = Math.max(rows - 2, 0); row < rows; row++) {
    for (let col = 0; col <= row; col++) {
      pieces.push({
        id: pieceId++,
        color: 'RED',
        position: { row, col },
        isInfiltrator: false,
        isCaptured: false,
      });
    }
  }

  return pieces;
}

/**
 * Generate pieces for rectangular board
 */
function generateRectanglePieces(config: BoardConfig): Piece[] {
  const pieces: Piece[] = [];
  let pieceId = 0;
  const rows = config.rows;
  const cols = Math.floor(config.nodes / rows);

  // GREEN pieces (top 2 rows)
  for (let row = 0; row < Math.min(2, rows); row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        id: pieceId++,
        color: 'GREEN',
        position: { row, col },
        isInfiltrator: false,
        isCaptured: false,
      });
    }
  }

  // RED pieces (bottom 2 rows)
  for (let row = Math.max(rows - 2, 0); row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        id: pieceId++,
        color: 'RED',
        position: { row, col },
        isInfiltrator: false,
        isCaptured: false,
      });
    }
  }

  return pieces;
}

/**
 * Generate pieces for square board
 */
function generateSquarePieces(config: BoardConfig): Piece[] {
  const pieces: Piece[] = [];
  let pieceId = 0;
  const size = Math.floor(Math.sqrt(config.nodes));

  // GREEN pieces (top 2 rows)
  for (let row = 0; row < Math.min(2, size); row++) {
    for (let col = 0; col < size; col++) {
      pieces.push({
        id: pieceId++,
        color: 'GREEN',
        position: { row, col },
        isInfiltrator: false,
        isCaptured: false,
      });
    }
  }

  // RED pieces (bottom 2 rows)
  for (let row = Math.max(size - 2, 0); row < size; row++) {
    for (let col = 0; col < size; col++) {
      pieces.push({
        id: pieceId++,
        color: 'RED',
        position: { row, col },
        isInfiltrator: false,
        isCaptured: false,
      });
    }
  }

  return pieces;
}

/**
 * Get cell at a specific position
 */
export function getCellAt(board: Board, position: Position): Cell | null {
  const row = board.cells[position.row];
  if (!row) return null;
  return row[position.col] || null;
}

/**
 * Get piece at a specific position
 */
export function getPieceAt(board: Board, position: Position): Piece | null {
  const cell = getCellAt(board, position);
  return cell?.piece || null;
}

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Calculate distance between two positions
 */
export function getDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
}
