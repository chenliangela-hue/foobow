import test from 'node:test';
import assert from 'node:assert/strict';
import { fresh, restore, release, visit, chapter, summary } from '../prototype/sanctuary/rules.mjs';

test('release spends seeds once, validates habitat, and retains lifetime rank', () => {
  const first = release(fresh(), 'koi', 'pond', 'one', 1000);
  assert.equal(first.seeds, 60);
  assert.equal(first.releases.length, 1);
  assert.deepEqual(release(first, 'koi', 'pond', 'one', 1000), first);
  assert.throws(() => release(first, 'turtle', 'sea', 'two', 1000), /habitat/);
  assert.throws(() => release(first, 'koi', 'pond', 'three', NaN), /input/);
  assert.equal(summary(first).total, 1);
  assert.throws(() => release({ ...first, seeds: 0 }, 'koi', 'pond', 'two', 1000), /seeds/);
});

test('visiting earns bounded daily seeds; life chapters never punish absence', () => {
  const state = release(fresh(), 'koi', 'lake', 'one', 1000);
  const visited = visit(state, 86401000);
  assert.equal(visited.seeds, 70);
  assert.deepEqual(visit(visited, 86402000), visited);
  assert.equal(chapter(state.releases[0], 1000), 0);
  assert.equal(chapter(state.releases[0], 86401000), 1);
  assert.equal(chapter(state.releases[0], 1000 + 86400000 * 90), 3);
  assert.equal(chapter(state.releases[0], 0), 0);
});

test('restoration rejects malformed, future-version, duplicate and unbounded saves without overwriting them', () => {
  for (const bad of [null, {}, {version: 2}, {...fresh(), seeds: -1}, {...fresh(), seeds: Infinity}, {...fresh(), releases: Array(501).fill({})}]) {
    assert.throws(() => restore(bad), /save/);
  }
  const s = release(fresh(), 'koi', 'pond', 'one', 1000);
  assert.deepEqual(restore(JSON.parse(JSON.stringify(s))), s);
  assert.throws(() => restore({...s, releases: [s.releases[0], s.releases[0]]}), /save/);
  assert.throws(() => restore({...s, releases: [{...s.releases[0], habitat: 'sea'}]}), /save/);
});
