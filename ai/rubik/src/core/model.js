// Cube engine: geometric cubie model (authoritative) + compact cubie-level state
// with precomputed move tables used by the solvers.

export const FACE_NAMES = ['U', 'D', 'R', 'L', 'F', 'B'];
export const FACE_NORMAL = [
  [0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1],
];
// 2D display frame per face: right vector, up vector (right x up = normal)
export const FACE_FRAME = [
  [[1, 0, 0], [0, 0, -1]],
  [[1, 0, 0], [0, 0, 1]],
  [[0, 0, -1], [0, 1, 0]],
  [[0, 0, 1], [0, 1, 0]],
  [[1, 0, 0], [0, 1, 0]],
  [[-1, 0, 0], [0, 1, 0]],
];

export const CORNER_POS = [
  [1, 1, 1], [-1, 1, 1], [-1, 1, -1], [1, 1, -1],
  [1, -1, 1], [-1, -1, 1], [-1, -1, -1], [1, -1, -1],
];
export const CORNER_NAMES = ['URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB'];
export const EDGE_POS = [
  [1, 1, 0], [0, 1, 1], [-1, 1, 0], [0, 1, -1],
  [1, -1, 0], [0, -1, 1], [-1, -1, 0], [0, -1, -1],
  [1, 0, 1], [-1, 0, 1], [-1, 0, -1], [1, 0, -1],
];
export const EDGE_NAMES = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR'];

const AXIS_OF = { x: 0, y: 1, z: 2 };

function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function matVec(m, v) {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}
function matMul(a, b) {
  const o = new Array(9);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    o[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c];
  }
  return o;
}
const IDENT = [1, 0, 0, 0, 1, 0, 0, 0, 1];

// exact integer rotation: angle = -90*turns about signed unit axis a
export function rotMatrix(axisVec, turns) {
  const t = ((turns % 4) + 4) % 4;
  if (t === 0) return IDENT.slice();
  const a = axisVec;
  const aa = [
    a[0] * a[0], a[0] * a[1], a[0] * a[2],
    a[1] * a[0], a[1] * a[1], a[1] * a[2],
    a[2] * a[0], a[2] * a[1], a[2] * a[2],
  ];
  const sk = [0, -a[2], a[1], a[2], 0, -a[0], -a[1], a[0], 0];
  const s = t === 3 ? 1 : -1; // sin(-90*t) sign for t=1,3
  if (t === 2) return aa.map((v, i) => 2 * v - IDENT[i]);
  return aa.map((v, i) => v + s * sk[i]);
}

function axisVec(axis, dir) {
  const v = [0, 0, 0];
  v[axis] = dir;
  return v;
}

// ---------------------------------------------------------------- move table
// idx = kind*3 + (quarter-1); kinds: 6 faces, M E S, x y z
const KINDS = [
  { n: 'U', axis: 1, dir: 1, layer: (p) => p[1] === 1 },
  { n: 'D', axis: 1, dir: -1, layer: (p) => p[1] === -1 },
  { n: 'R', axis: 0, dir: 1, layer: (p) => p[0] === 1 },
  { n: 'L', axis: 0, dir: -1, layer: (p) => p[0] === -1 },
  { n: 'F', axis: 2, dir: 1, layer: (p) => p[2] === 1 },
  { n: 'B', axis: 2, dir: -1, layer: (p) => p[2] === -1 },
  { n: 'M', axis: 0, dir: -1, layer: (p) => p[0] === 0, slice: true },
  { n: 'E', axis: 1, dir: -1, layer: (p) => p[1] === 0, slice: true },
  { n: 'S', axis: 2, dir: 1, layer: (p) => p[2] === 0, slice: true },
  { n: 'x', axis: 0, dir: 1, layer: () => true, whole: true },
  { n: 'y', axis: 1, dir: 1, layer: () => true, whole: true },
  { n: 'z', axis: 2, dir: 1, layer: () => true, whole: true },
];

export const MOVES = [];
export const MOVE_INDEX = new Map();
KINDS.forEach((k, ki) => {
  [1, 2, 3].forEach((q) => {
    const name = k.n + (q === 1 ? '' : q === 2 ? '2' : "'");
    const idx = MOVES.length;
    // every layer / slice / whole-cube rotation maps a slot's two exterior
    // faces bijectively onto the target slot's, so eo acts as eo XOR delta.
    const edgeSafe = true;
    MOVES.push({
      idx, name, kind: ki, base: k.n, q, axis: k.axis, dir: k.dir,
      slice: !!k.slice, whole: !!k.whole, edgeSafe,
      matrix: rotMatrix(axisVec(k.axis, k.dir), q),
      layer: k.layer,
    });
    MOVE_INDEX.set(name, idx);
  });
});
export const MOVE_COUNT = MOVES.length;
export const FACE_MOVES = MOVES.slice(0, 18);

export function moveAngle(m) {
  // rotation about +axis, radians (dir folded in)
  return -Math.PI / 2 * m.q * m.dir;
}

export function parseMove(token) {
  const t = token.trim();
  if (MOVE_INDEX.has(t)) return MOVE_INDEX.get(t);
  const m = /^([UDRLFBMESxyz])(2|')?$/.exec(t);
  if (!m) return -1;
  const name = m[1] + (m[2] || '');
  return MOVE_INDEX.has(name) ? MOVE_INDEX.get(name) : -1;
}

export function parseAlg(str) {
  return str.trim().split(/\s+/).filter(Boolean).map((t) => {
    const i = parseMove(t);
    if (i < 0) throw new Error('bad move: ' + t);
    return i;
  });
}

export function algToString(seq) { return seq.map((i) => MOVES[i].name).join(' '); }
export function invertSeq(seq) { return seq.slice().reverse().map(inverseMove); }
export function inverseMove(i) {
  const m = MOVES[i];
  const q = m.q === 2 ? 2 : 4 - m.q; // 1<->3, 2->2
  return m.kind * 3 + (q - 1);
}

// ------------------------------------------------------------ geometric model
let CUBIE_ID = 0;
export class CubeModel {
  constructor(n = 3) {
    this.n = n;
    this.cubies = [];
    const r = n === 2 ? [-1, 1] : [-1, 0, 1];
    for (const x of r) for (const y of r) for (const z of r) {
      if (n === 3 && x === 0 && y === 0 && z === 0) continue;
      const home = [x, y, z];
      const stickers = [null, null, null, null, null, null];
      for (let f = 0; f < 6; f++) {
        const nrm = FACE_NORMAL[f];
        const ax = nrm.findIndex((v) => v !== 0);
        if (home[ax] === nrm[ax]) stickers[f] = f;
      }
      const kind = stickers.filter((s) => s !== null).length;
      this.cubies.push({
        id: CUBIE_ID++, home, pos: home.slice(), rot: IDENT.slice(), stickers,
        type: kind === 3 ? 'corner' : kind === 2 ? 'edge' : 'center',
      });
    }
    this.history = [];
  }

  clone() {
    const c = new CubeModel(this.n);
    c.cubies = this.cubies.map((q) => ({ ...q, home: q.home.slice(), pos: q.pos.slice(), rot: q.rot.slice(), stickers: q.stickers.slice() }));
    c.history = this.history.slice();
    return c;
  }

  apply(idx, record = true) {
    const m = MOVES[idx];
    if (m.slice && this.n === 2) return false;
    const R = m.matrix;
    for (const c of this.cubies) {
      if (!m.layer(c.pos)) continue;
      c.pos = matVec(R, c.pos);
      c.rot = matMul(R, c.rot);
    }
    if (record) this.history.push(idx);
    return true;
  }

  applySeq(seq, record = true) { for (const i of seq) this.apply(i, record); }

  undo() {
    const last = this.history.pop();
    if (last === undefined) return null;
    this.apply(inverseMove(last), false);
    return last;
  }

  reset() {
    for (const c of this.cubies) { c.pos = c.home.slice(); c.rot = IDENT.slice(); }
    this.history = [];
  }

  cubieAt(pos) {
    return this.cubies.find((c) => c.pos[0] === pos[0] && c.pos[1] === pos[1] && c.pos[2] === pos[2]);
  }

  // color face index shown at world face f, slot position p
  colorAt(f, p) {
    const c = this.cubieAt(p);
    if (!c) return null;
    const nrm = FACE_NORMAL[f];
    // local axis = rot^T * nrm
    const rt = [c.rot[0], c.rot[3], c.rot[6], c.rot[1], c.rot[4], c.rot[7], c.rot[2], c.rot[5], c.rot[8]];
    const lv = matVec(rt, nrm);
    const li = FACE_NORMAL.findIndex((v) => v[0] === lv[0] && v[1] === lv[1] && v[2] === lv[2]);
    return c.stickers[li];
  }

  // facelets[f][row*N+col]
  facelets() {
    const N = this.n;
    const out = [];
    const step = 2 / (N - 1 || 1);
    for (let f = 0; f < 6; f++) {
      const [u, v] = FACE_FRAME[f];
      const nrm = FACE_NORMAL[f];
      const arr = new Array(N * N);
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        const a = (c - (N - 1) / 2) * (N === 2 ? 2 : step);
        const b = ((N - 1) / 2 - r) * (N === 2 ? 2 : step);
        const p = [
          Math.round(nrm[0] + u[0] * a + v[0] * b),
          Math.round(nrm[1] + u[1] * a + v[1] * b),
          Math.round(nrm[2] + u[2] * a + v[2] * b),
        ];
        arr[r * N + c] = this.colorAt(f, p);
      }
      out.push(arr);
    }
    return out;
  }

  isSolved() {
    for (const c of this.cubies) {
      if (c.pos[0] !== c.home[0] || c.pos[1] !== c.home[1] || c.pos[2] !== c.home[2]) return false;
      if (c.type === 'center') {
        const f = c.stickers.findIndex((s) => s !== null);
        const d = matVec(c.rot, FACE_NORMAL[f]);
        const h = FACE_NORMAL[f];
        if (d[0] !== h[0] || d[1] !== h[1] || d[2] !== h[2]) return false;
      } else if (c.rot.join() !== IDENT.join()) return false;
    }
    return true;
  }

  solvedCount() {
    const fl = this.facelets();
    let k = 0;
    for (let f = 0; f < 6; f++) for (const v of fl[f]) if (v === f) k++;
    return k;
  }

  toFast() { return geoToFast(this); }
}

// ------------------------------------------------------- orientation helpers
function twistMatrix(s) {
  // rotation by -120deg about corner diagonal s (integer entries)
  const aa = [s[0] * s[0], s[0] * s[1], s[0] * s[2], s[1] * s[0], s[1] * s[1], s[1] * s[2], s[2] * s[0], s[2] * s[1], s[2] * s[2]];
  const sk = [0, -s[2], s[1], s[2], 0, -s[0], -s[1], s[0], 0];
  return aa.map((v, i) => Math.round((v - IDENT[i] - sk[i]) / 2));
}
const CORNER_TWIST = CORNER_POS.map((p) => twistMatrix(p));

function cornerOrient(slot, rot, homeY) {
  const s = CORNER_POS[slot];
  const target = [0, s[1], 0];
  const d = matVec(rot, [0, homeY, 0]);
  let m = IDENT.slice();
  for (let k = 0; k < 3; k++) {
    const t = matVec(m, target);
    if (t[0] === d[0] && t[1] === d[1] && t[2] === d[2]) return k;
    m = matMul(CORNER_TWIST[slot], m);
  }
  return 0;
}
// Edge orientation must compare against one *specific* face per slot (not an
// axis class): only then does every rotation act as eo -> eo XOR delta.
const EDGE_REF_FACE = EDGE_POS.map((p) => (p[1] === 1 ? 0 : p[1] === -1 ? 1 : p[2] === 1 ? 4 : 5));
function edgeRefSticker(home) {
  for (const f of [0, 1, 4, 5]) {
    const n = FACE_NORMAL[f];
    const ax = n.findIndex((v) => v !== 0);
    if (home[ax] === n[ax]) return f;
  }
  return 2;
}
function edgeOrient(slot, rot, home) {
  const d = matVec(rot, FACE_NORMAL[edgeRefSticker(home)]);
  const t = FACE_NORMAL[EDGE_REF_FACE[slot]];
  return d[0] === t[0] && d[1] === t[1] && d[2] === t[2] ? 0 : 1;
}

export function geoToFast(cube) {
  const s = new Uint8Array(40);
  for (let i = 0; i < 8; i++) {
    const c = cube.cubieAt(CORNER_POS[i]);
    const j = CORNER_POS.findIndex((p) => p[0] === c.home[0] && p[1] === c.home[1] && p[2] === c.home[2]);
    s[i] = j;
    s[8 + i] = cornerOrient(i, c.rot, c.home[1]);
  }
  if (cube.n === 3) {
    for (let i = 0; i < 12; i++) {
      const c = cube.cubieAt(EDGE_POS[i]);
      const j = EDGE_POS.findIndex((p) => p[0] === c.home[0] && p[1] === c.home[1] && p[2] === c.home[2]);
      s[16 + i] = j;
      s[28 + i] = edgeOrient(i, c.rot, c.home);
    }
  } else {
    for (let i = 0; i < 12; i++) { s[16 + i] = i; s[28 + i] = 0; }
  }
  return s;
}

export function solvedFast(n = 3) {
  const s = new Uint8Array(40);
  for (let i = 0; i < 8; i++) s[i] = i;
  for (let i = 0; i < 12; i++) s[16 + i] = i;
  if (n === 2) { /* edges unused */ }
  return s;
}

// ------------------------------------------------------------- fast tables
export const T_CP = new Uint8Array(MOVE_COUNT * 8);
export const T_CO = new Uint8Array(MOVE_COUNT * 8);
export const T_EP = new Uint8Array(MOVE_COUNT * 12);
export const T_EO = new Uint8Array(MOVE_COUNT * 12);

(function buildTables() {
  for (let mi = 0; mi < MOVE_COUNT; mi++) {
    const cube = new CubeModel(3);
    cube.apply(mi, false);
    const f = geoToFast(cube);
    for (let i = 0; i < 8; i++) { T_CP[mi * 8 + i] = f[i]; T_CO[mi * 8 + i] = f[8 + i]; }
    for (let i = 0; i < 12; i++) { T_EP[mi * 12 + i] = f[16 + i]; T_EO[mi * 12 + i] = f[28 + i]; }
  }
})();

export function fastApply(s, mi) {
  const b = mi * 8, e = mi * 12;
  const cp = new Uint8Array(8), co = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    const src = T_CP[b + i];
    cp[i] = s[src];
    co[i] = (s[8 + src] + T_CO[b + i]) % 3;
  }
  const ep = new Uint8Array(12), eo = new Uint8Array(12);
  for (let i = 0; i < 12; i++) {
    const src = T_EP[e + i];
    ep[i] = s[16 + src];
    eo[i] = (s[28 + src] + T_EO[e + i]) & 1;
  }
  for (let i = 0; i < 8; i++) { s[i] = cp[i]; s[8 + i] = co[i]; }
  for (let i = 0; i < 12; i++) { s[16 + i] = ep[i]; s[28 + i] = eo[i]; }
  return s;
}

export function fastClone(s) { return Uint8Array.from(s); }
export function fastSeq(s, seq) { for (const m of seq) fastApply(s, m); return s; }
export function fastIsSolved(s, n = 3) {
  for (let i = 0; i < 8; i++) if (s[i] !== i || s[8 + i] !== 0) return false;
  if (n === 3) for (let i = 0; i < 12; i++) if (s[16 + i] !== i || s[28 + i] !== 0) return false;
  return true;
}
export function fastKey(s, n = 3) {
  let k = '';
  for (let i = 0; i < 8; i++) k += String.fromCharCode(65 + s[i] * 3 + s[8 + i]);
  if (n === 3) for (let i = 0; i < 12; i++) k += String.fromCharCode(97 + s[16 + i] * 2 + s[28 + i]);
  return k;
}

// piece colour identities (face indices) derived from home slot
export function cornerColors(j) {
  const p = CORNER_POS[j];
  const out = [];
  for (let f = 0; f < 6; f++) {
    const n = FACE_NORMAL[f];
    const ax = n.findIndex((v) => v !== 0);
    if (p[ax] === n[ax]) out.push(f);
  }
  return out;
}
export function edgeColors(j) {
  const p = EDGE_POS[j];
  const out = [];
  for (let f = 0; f < 6; f++) {
    const n = FACE_NORMAL[f];
    const ax = n.findIndex((v) => v !== 0);
    if (p[ax] === n[ax]) out.push(f);
  }
  return out;
}

export function randomScramble(n = 3, len = n === 2 ? 14 : 24, rng = Math.random) {
  const faces = n === 2 ? [0, 1, 2, 3, 4, 5] : [0, 1, 2, 3, 4, 5];
  const seq = [];
  let last = -1, last2 = -1;
  while (seq.length < len) {
    const f = faces[Math.floor(rng() * faces.length)];
    if (f === last) continue;
    if (f === last2 && (f % 2 === 0 ? f + 1 : f - 1) === last) continue;
    const q = 1 + Math.floor(rng() * 3);
    seq.push(f * 3 + (q - 1));
    last2 = last; last = f;
  }
  return seq;
}

export { cross, dot, matVec, matMul, IDENT, AXIS_OF };