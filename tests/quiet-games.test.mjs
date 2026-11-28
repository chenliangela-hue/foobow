import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waterPath, canPlace, mosaicPieces } from '../prototype/app/quiet-games-rules.mjs';

test('water follows matching openings from spring to pond', () => {
  assert.deepEqual([...waterPath([10, 10, 10, 10], 4, 0)], [0, 1, 2, 3]);
  assert.deepEqual([...waterPath([10, 5, 10, 10], 4, 0)], [0]);
  assert.deepEqual([...waterPath([10, 10, 0, 10], 2, 0)], [0, 1]);
});

test('mosaic pieces can fill the tray without wrapping or overlapping', () => {
  const board = Array(16).fill('');
  for (const [piece, anchor] of mosaicPieces.map((piece, index) => [piece, [0, 3, 8, 10][index]])) {
    const cells = canPlace(board, piece, anchor);
    assert.equal(cells.length, 4);
    for (const cell of cells) board[cell] = 'filled';
  }
  assert.ok(board.every(Boolean));
  assert.deepEqual(canPlace(Array(16).fill(''), mosaicPieces[0], 3), []);
  assert.deepEqual(canPlace(board, mosaicPieces[0], 0), []);
});
