// 2x2 optimal solver: full breadth-first search over the 3,674,160 states of
// the mini-cube group with the DBL corner held fixed (<U, R, F> generators).
import { MOVES, MOVE_INDEX, T_CP, T_CO, fastClone, fastApply, fastSeq, fastIsSolved, CORNER_NAMES } from './model.js';

const SLOTS = [0, 1, 2, 3, 4, 5, 7];       // every corner slot except DBL(6)
const RANK = new Map(SLOTS.map((s, i) => [s, i]));
const PERM_N = 5040, ORI_N = 729, TOTAL = PERM_N * ORI_N;
const FACT = [720, 120, 24, 6, 2, 1, 1];
const M2 = ['U', "U'", 'U2', 'R', "R'", 'R2', 'F', "F'", 'F2'].map((n) => MOVE_INDEX.get(n));

function encodePerm(arr) {
  let idx = 0;
  for (let i = 0; i < 7; i++) {
    let c = 0;
    for (let j = i + 1; j < 7; j++) if (arr[j] < arr[i]) c++;
    idx = idx * (7 - i) + c;
  }
  return idx;
}
function decodePerm(idx) {
  const digits = [];
  for (let i = 0; i < 7; i++) digits.push(Math.floor(idx / FACT[i]) % (7 - i));
  const pool = [0, 1, 2, 3, 4, 5, 6];
  const arr = [];
  for (let i = 0; i < 7; i++) arr.push(pool.splice(digits[i], 1)[0]);
  return arr;
}
function encodeOri(co) { let o = 0; for (let i = 5; i >= 0; i--) o = o * 3 + co[i]; return o; }
function decodeOri(o) { const co = []; for (let i = 0; i < 6; i++) { co.push(o % 3); o = (o / 3) | 0; } return co; }

export function encode2(s) {
  const arr = SLOTS.map((i) => RANK.get(s[i]));
  if (arr.some((a) => a === undefined)) return -1;
  return encodePerm(arr) * ORI_N + encodeOri(s.subarray(8, 14));
}

const PERM_T = new Uint16Array(PERM_N * 9);
const ORI_T = new Uint16Array(ORI_N * 9);
(function buildTables() {
  const cp = new Uint8Array(8);
  for (let p = 0; p < PERM_N; p++) {
    const arr = decodePerm(p);
    cp[6] = 6;
    for (let k = 0; k < 7; k++) cp[SLOTS[k]] = SLOTS[arr[k]];
    for (let m = 0; m < 9; m++) {
      const b = M2[m] * 8;
      const na = [];
      for (let k = 0; k < 7; k++) na.push(RANK.get(cp[T_CP[b + SLOTS[k]]]));
      PERM_T[p * 9 + m] = encodePerm(na);
    }
  }
  const co = new Uint8Array(8);
  for (let o = 0; o < ORI_N; o++) {
    const d = decodeOri(o);
    for (let i = 0; i < 6; i++) co[i] = d[i];
    co[6] = 0;
    let sum = 0;
    for (let i = 0; i < 7; i++) sum += co[i];
    co[7] = (3 - (sum % 3)) % 3;
    for (let m = 0; m < 9; m++) {
      const b = M2[m] * 8;
      const nc = [];
      for (let i = 0; i < 6; i++) nc.push((co[T_CP[b + i]] + T_CO[b + i]) % 3);
      ORI_T[o * 9 + m] = encodeOri(nc);
    }
  }
})();

// the 24 whole-cube orientations, as shortest x/y/z sequences
const ROTATIONS = (() => {
  const gens = ['x', "x'", 'y', "y'", 'z', "z'"].map((n) => MOVE_INDEX.get(n));
  const seen = new Map();
  const start = new Uint8Array(40);
  for (let i = 0; i < 8; i++) start[i] = i;
  const key = (s) => s.subarray(0, 16).join(',');
  seen.set(key(start), []);
  const queue = [start];
  const paths = [[]];
  for (let h = 0; h < queue.length; h++) {
    const s = queue[h];
    for (const g of gens) {
      const n = fastClone(s);
      fastApply(n, g);
      const k = key(n);
      if (seen.has(k)) continue;
      const p = paths[h].concat(g);
      seen.set(k, p);
      queue.push(n); paths.push(p);
    }
  }
  return [...seen.values()];
})();

export class Solver2 {
  constructor() {
    this.dist = null;
    this.ready = false;
    this.maxDepth = 0;
    this.building = null;
    this.nodes = 0;
  }

  buildSync() {
    const dist = new Uint8Array(TOTAL).fill(255);
    const queue = new Int32Array(TOTAL);
    dist[0] = 0; queue[0] = 0;
    let head = 0, tail = 1, maxD = 0;
    while (head < tail) {
      const idx = queue[head++];
      const d = dist[idx];
      const p = (idx / ORI_N) | 0, o = idx % ORI_N;
      const pb = p * 9, ob = o * 9;
      for (let m = 0; m < 9; m++) {
        const n = PERM_T[pb + m] * ORI_N + ORI_T[ob + m];
        if (dist[n] === 255) { dist[n] = d + 1; if (d + 1 > maxD) maxD = d + 1; queue[tail++] = n; }
      }
    }
    this.dist = dist; this.ready = true; this.maxDepth = maxD; this.nodes = tail;
    return this;
  }

  // chunked so the UI keeps painting while the table is generated
  build(onProgress) {
    if (this.ready) return Promise.resolve(this);
    if (this.building) return this.building;
    this.building = new Promise((resolve) => {
      const dist = new Uint8Array(TOTAL).fill(255);
      const queue = new Int32Array(TOTAL);
      dist[0] = 0; queue[0] = 0;
      let head = 0, tail = 1, maxD = 0;
      const step = () => {
        const stop = Math.min(tail, head + 140000);
        while (head < stop) {
          const idx = queue[head++];
          const d = dist[idx];
          const p = (idx / ORI_N) | 0, o = idx % ORI_N;
          const pb = p * 9, ob = o * 9;
          for (let m = 0; m < 9; m++) {
            const n = PERM_T[pb + m] * ORI_N + ORI_T[ob + m];
            if (dist[n] === 255) { dist[n] = d + 1; if (d + 1 > maxD) maxD = d + 1; queue[tail++] = n; }
          }
        }
        if (onProgress) onProgress(head / TOTAL, maxD);
        if (head < tail) setTimeout(step, 0);
        else {
          this.dist = dist; this.ready = true; this.maxDepth = maxD; this.nodes = tail;
          this.building = null;
          resolve(this);
        }
      };
      setTimeout(step, 0);
    });
    return this.building;
  }

  // returns { moves, rotations, depth, optimal }
  solve(state) {
    if (!this.ready) throw new Error('solver2 not built');
    const s = fastClone(state);
    let rot = [];
    if (s[6] !== 6 || s[14] !== 0) {
      for (const r of ROTATIONS) {
        const t = fastClone(s);
        fastSeq(t, r);
        if (t[6] === 6 && t[14] === 0) { rot = r; s.set(t); break; }
      }
    }
    const start = encode2(s);
    if (start < 0 || this.dist[start] === 255) return null;
    let idx = start;
    let d = this.dist[idx];
    const depth = d;
    const moves = [];
    while (d > 0) {
      const p = (idx / ORI_N) | 0, o = idx % ORI_N;
      let found = -1;
      for (let m = 0; m < 9; m++) {
        const n = PERM_T[p * 9 + m] * ORI_N + ORI_T[o * 9 + m];
        if (this.dist[n] === d - 1) { found = m; idx = n; break; }
      }
      if (found < 0) return null;
      moves.push(M2[found]);
      d--;
    }
    return { moves, rotations: rot, depth, optimal: true, godNumber: this.maxDepth };
  }
}

export const SOLVER2_INFO = {
  states: TOTAL,
  generators: '<U, R, F>',
  fixed: CORNER_NAMES[6],
};

export function verify2Tables(trials = 3000) {
  const base = new Uint8Array(40);
  for (let i = 0; i < 8; i++) base[i] = i;
  let bad = 0;
  const example = [];
  for (let t = 0; t < trials; t++) {
    const s = fastClone(base);
    for (let k = 0; k < 14; k++) fastApply(s, M2[(Math.random() * 9) | 0]);
    const idx = encode2(s);
    if (idx < 0) { bad++; continue; }
    const p = (idx / ORI_N) | 0, o = idx % ORI_N;
    for (let m = 0; m < 9; m++) {
      const a = fastClone(s);
      fastApply(a, M2[m]);
      const real = encode2(a);
      const tab = PERM_T[p * 9 + m] * ORI_N + ORI_T[o * 9 + m];
      if (real !== tab) {
        bad++;
        if (example.length < 3) example.push({ idx, m: MOVES[M2[m]].name, real, tab, cp: Array.from(s.subarray(0, 8)), co: Array.from(s.subarray(8, 16)) });
      }
    }
  }
  return { bad, example, rotations: ROTATIONS.length };
}