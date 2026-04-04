/**
 * Board Layout Generator for Warp Board
 * Creates node-based board layouts with connections
 */

import type { BoardLayout, Connection, Position } from '../types/game';

/**
 * Generates a board layout for a given size
 * Size 3 = 3x3 grid of squares = 4x4 nodes (16 nodes)
 * Size 4 = 4x4 grid of squares = 5x5 nodes (25 nodes)
 */
export function generateBoardLayout(gridSize: 3 | 4): BoardLayout {
  const nodeSize = gridSize + 1; // Nodes are at intersections
  const nodes: Position[] = [];
  const connections: Connection[] = [];

  // Generate all nodes
  for (let row = 0; row < nodeSize; row++) {
    for (let col = 0; col < nodeSize; col++) {
      nodes.push({ row, col });
    }
  }

  // Generate connections
  for (let row = 0; row < nodeSize; row++) {
    for (let col = 0; col < nodeSize; col++) {
      const from: Position = { row, col };

      // Horizontal connections (right)
      if (col < nodeSize - 1) {
        connections.push({
          from,
          to: { row, col: col + 1 },
          type: 'horizontal',
        });
      }

      // Vertical connections (down)
      if (row < nodeSize - 1) {
        connections.push({
          from,
          to: { row: row + 1, col },
          type: 'vertical',
        });
      }

      // Diagonal connections (down-right)
      if (row < nodeSize - 1 && col < nodeSize - 1) {
        connections.push({
          from,
          to: { row: row + 1, col: col + 1 },
          type: 'diagonal',
        });
      }

      // Diagonal connections (down-left)
      if (row < nodeSize - 1 && col > 0) {
        connections.push({
          from,
          to: { row: row + 1, col: col - 1 },
          type: 'diagonal',
        });
      }
    }
  }

  return { size: nodeSize, nodes, connections };
}

/**
 * Checks if two positions are connected on the board
 */
export function arePositionsConnected(
  layout: BoardLayout,
  from: Position,
  to: Position
): boolean {
  return layout.connections.some(
    (conn) =>
      (positionsEqual(conn.from, from) && positionsEqual(conn.to, to)) ||
      (positionsEqual(conn.from, to) && positionsEqual(conn.to, from))
  );
}

/**
 * Gets all positions connected to a given position
 */
export function getConnectedPositions(
  layout: BoardLayout,
  position: Position
): Position[] {
  const connected: Position[] = [];

  layout.connections.forEach((conn) => {
    if (positionsEqual(conn.from, position)) {
      connected.push(conn.to);
    } else if (positionsEqual(conn.to, position)) {
      connected.push(conn.from);
    }
  });

  return connected;
}

/**
 * Gets the direction vector from one position to another
 */
export function getDirection(from: Position, to: Position): Position {
  return {
    row: Math.sign(to.row - from.row),
    col: Math.sign(to.col - from.col),
  };
}

/**
 * Checks if a position is within board bounds
 */
export function isPositionValid(layout: BoardLayout, position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < layout.size &&
    position.col >= 0 &&
    position.col < layout.size
  );
}

/**
 * Helper to check if two positions are equal
 */
export function positionsEqual(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

/**
 * Gets the position between two positions (for capture detection)
 */
export function getMiddlePosition(from: Position, to: Position): Position | null {
  const rowDiff = to.row - from.row;
  const colDiff = to.col - from.col;

  // Check if positions are exactly 2 steps apart
  if (Math.abs(rowDiff) !== 2 && Math.abs(colDiff) !== 2) {
    return null;
  }

  // Check if positions are in a straight line
  if (Math.abs(rowDiff) === 2 && colDiff === 0) {
    // Vertical
    return { row: from.row + rowDiff / 2, col: from.col };
  } else if (rowDiff === 0 && Math.abs(colDiff) === 2) {
    // Horizontal
    return { row: from.row, col: from.col + colDiff / 2 };
  } else if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
    // Diagonal
    return { row: from.row + rowDiff / 2, col: from.col + colDiff / 2 };
  }

  return null;
}

/**
 * Initial piece setup for a board
 */
export function getInitialPieceSetup(
  boardSize: 3 | 4,
  infiltrators: 0 | 1 | 2
): Position[] {
  const nodeSize = boardSize + 1;
  const greenPositions: Position[] = [];
  const redPositions: Position[] = [];

  if (boardSize === 3) {
    // 4x4 nodes board
    // Green pieces on top two rows
    greenPositions.push(
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 }
    );

    // Red pieces on bottom two rows
    redPositions.push(
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 3, col: 0 },
      { row: 3, col: 1 },
      { row: 3, col: 2 },
      { row: 3, col: 3 }
    );
  } else {
    // 5x5 nodes board
    // Green pieces on top two rows
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < nodeSize; col++) {
        greenPositions.push({ row, col });
      }
    }

    // Red pieces on bottom two rows
    for (let row = nodeSize - 2; row < nodeSize; row++) {
      for (let col = 0; col < nodeSize; col++) {
        redPositions.push({ row, col });
      }
    }
  }

  // Handle infiltrators (swap pieces symmetrically)
  if (infiltrators > 0) {
    const swapCount = infiltrators;
    for (let i = 0; i < swapCount; i++) {
      // Swap pieces at symmetrical positions
      const temp = greenPositions[i];
      greenPositions[i] = redPositions[redPositions.length - 1 - i];
      redPositions[redPositions.length - 1 - i] = temp;
    }
  }

  return [...greenPositions, ...redPositions];
}
