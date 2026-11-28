const directions = [
  { opening: 1, opposite: 4, row: -1, column: 0 },
  { opening: 2, opposite: 8, row: 0, column: 1 },
  { opening: 4, opposite: 1, row: 1, column: 0 },
  { opening: 8, opposite: 2, row: 0, column: -1 },
];

export function waterPath(board, width, source) {
  const wet = new Set();
  const pending = board[source] & 8 ? [source] : [];
  for (const index of pending) {
    if (wet.has(index)) continue;
    wet.add(index);
    for (const { opening, opposite, row, column } of directions) {
      const nextColumn = index % width + column;
      const next = index + row * width + column;
      if (nextColumn >= 0 && nextColumn < width && board[index] & opening && board[next] & opposite) {
        pending.push(next);
      }
    }
  }
  return wet;
}

export const rotate = mask => ((mask << 1) & 15) | (mask >> 3);

export const mosaicPieces = [
  [[0, 0], [0, 1], [0, 2], [1, 0]],
  [[0, 0], [1, -2], [1, -1], [1, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
];

export function canPlace(board, piece, anchor) {
  const row = Math.floor(anchor / 4);
  const column = anchor % 4;
  const cells = [];
  for (const [y, x] of piece) {
    const next = (row + y) * 4 + column + x;
    if (row + y >= 4 || column + x < 0 || column + x >= 4 || board[next]) return [];
    cells.push(next);
  }
  return cells;
}
