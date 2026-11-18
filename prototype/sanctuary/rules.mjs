// Pure, device-local prototype rules. Never accepted as evidence for public ranks.
export const DAY = 86400000;
export const CREATURES = Object.freeze({
  koi: { cost: 20, habitats: ['pond', 'lake'], color: '#efbd66', size: 1.35 },
  butterfly: { cost: 35, habitats: ['pond', 'lake'], color: '#f5e6c5', size: 1.35 },
  turtle: { cost: 45, habitats: ['pond', 'lake', 'river'], color: '#86b5a1', size: 1.1 },
  minnow: { cost: 10, habitats: ['river', 'lake'], color: '#b8dce8', size: .65 },
  clownfish: { cost: 25, habitats: ['sea'], color: '#f5985e', size: .85 },
  ray: { cost: 50, habitats: ['sea'], color: '#b7d9d7', size: 1.6 }
});
export function fresh() { return { version: 1, seeds: 80, lastVisit: -1, releases: [] }; }
const bounded = (v, max) => Number.isSafeInteger(v) && v >= 0 && v <= max;
const validId = id => typeof id === 'string' && /^[\w-]{1,80}$/.test(id);
export function restore(raw) {
  if (!raw || raw.version !== 1 || !bounded(raw.seeds, 10000) || !Number.isSafeInteger(raw.lastVisit) || raw.lastVisit < -1 || raw.lastVisit > 10000000 || !Array.isArray(raw.releases) || raw.releases.length > 500) throw Error('Invalid save');
  const ids = new Set();
  const releases = raw.releases.map(r => {
    if (!r || !validId(r.id) || ids.has(r.id) || !Object.hasOwn(CREATURES, r.species) || !CREATURES[r.species].habitats.includes(r.habitat) || !bounded(r.at, 8640000000000000)) throw Error('Invalid save');
    ids.add(r.id);
    return { id: r.id, species: r.species, habitat: r.habitat, at: r.at };
  });
  return { version: 1, seeds: raw.seeds, lastVisit: raw.lastVisit, releases };
}
export function release(state, species, habitat, id, now) {
  if (!validId(id) || !bounded(now, 8640000000000000) || !Object.hasOwn(CREATURES, species)) throw Error('Invalid input');
  if (state.releases.some(r => r.id === id)) return state;
  const creature = CREATURES[species];
  if (!creature.habitats.includes(habitat)) throw Error('Incompatible habitat');
  if (state.releases.length >= 500) throw Error('Journal full');
  if (state.seeds < creature.cost) throw Error('Not enough seeds');
  return { ...state, seeds: state.seeds - creature.cost, releases: [...state.releases, { id, species, habitat, at: now }] };
}
export function visit(state, now) {
  if (!bounded(now, 8640000000000000)) throw Error('Invalid input');
  const day = Math.floor(now / DAY);
  if (day <= state.lastVisit) return state;
  return { ...state, seeds: Math.min(10000, state.seeds + 10), lastVisit: day };
}
export function chapter(r, now) { const age = Math.max(0, (now - r.at) / DAY); return age >= 7 ? 3 : age >= 3 ? 2 : age >= 1 ? 1 : 0; }
export function summary(state) {
  const counts = {};
  for (const r of state.releases) counts[r.species] = (counts[r.species] || 0) + 1;
  return { total: state.releases.length, species: Object.keys(counts).length, counts, rank: state.releases.length >= 20 ? 3 : state.releases.length >= 8 ? 2 : state.releases.length >= 3 ? 1 : 0 };
}
