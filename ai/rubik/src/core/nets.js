// Topology of the cube surface: enumerate every spanning tree of the face
// adjacency graph (the octahedron), unfold each into the plane, and dedupe the
// resulting hexominoes up to rotation/reflection -> the 11 distinct cube nets.
import { FACE_NORMAL, FACE_FRAME, FACE_NAMES, cross, dot } from './model.js';

const OPP = [1, 0, 3, 2, 5, 4];
const ROOT = 4; // F

const EDGES = [];
for (let a = 0; a < 6; a++) for (let b = a + 1; b < 6; b++) if (b !== OPP[a]) EDGES.push([a, b]);

function isTree(edges) {
  const adj = [[], [], [], [], [], []];
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  const seen = new Set([ROOT]);
  const stack = [ROOT];
  let count = 0;
  while (stack.length) {
    const v = stack.pop();
    for (const w of adj[v]) if (!seen.has(w)) { seen.add(w); stack.push(w); count++; }
  }
  return seen.size === 6 && count === 5;
}

function combos(arr, k) {
  const out = [];
  const rec = (start, cur) => {
    if (cur.length === k) { out.push(cur.slice()); return; }
    for (let i = start; i < arr.length; i++) { cur.push(arr[i]); rec(i + 1, cur); cur.pop(); }
  };
  rec(0, []);
  return out;
}

// unfold a rooted spanning tree into integer grid cells + 2D display frames
function unfold(edges) {
  const adj = [[], [], [], [], [], []];
  for (const [a, b] of edges) { adj[a].push(b); adj[b].push(a); }
  const parent = new Array(6).fill(-1);
  const grid = new Array(6).fill(null);
  const frame = new Array(6).fill(null);
  grid[ROOT] = [0, 0];
  frame[ROOT] = { u: [1, 0], v: [0, 1] };
  const order = [ROOT];
  const queue = [ROOT];
  while (queue.length) {
    const p = queue.shift();
    for (const c of adj[p]) {
      if (c === parent[p] || grid[c]) continue;
      parent[c] = p;
      const np = FACE_NORMAL[p], nc = FACE_NORMAL[c];
      const up = FACE_FRAME[p][0], vp = FACE_FRAME[p][1];
      const uc = FACE_FRAME[c][0], vc = FACE_FRAME[c][1];
      const a = cross(nc, np);
      // components in the parent's own frame, then rotated into global grid
      // axes by the parent's already-unfolded frame (matters at depth >= 2)
      const d = [dot(nc, up), dot(nc, vp)];
      const a2 = [dot(a, up), dot(a, vp)];
      const pu = frame[p].u, pv = frame[p].v;
      const toGlobal = (w) => [w[0] * pu[0] + w[1] * pv[0], w[0] * pu[1] + w[1] * pv[1]];
      const step = toGlobal(d);
      const aG = toGlobal(a2);
      const mk = (w) => {
        const al = -dot(w, np), be = dot(w, a);
        return [Math.round(al * step[0] + be * aG[0]), Math.round(al * step[1] + be * aG[1])];
      };
      grid[c] = [grid[p][0] + step[0], grid[p][1] + step[1]];
      frame[c] = { u: mk(uc), v: mk(vc) };
      order.push(c);
      queue.push(c);
    }
  }
  return { parent, grid, frame, order };
}

function shapeKey(cells) {
  const transforms = [
    (x, y) => [x, y], (x, y) => [y, x], (x, y) => [-x, y], (x, y) => [x, -y],
    (x, y) => [-y, x], (x, y) => [y, -x], (x, y) => [-x, -y], (x, y) => [-y, -x],
  ];
  let best = null;
  for (const t of transforms) {
    const pts = cells.map(([x, y]) => t(x, y));
    const mx = Math.min(...pts.map((p) => p[0])), my = Math.min(...pts.map((p) => p[1]));
    const key = pts.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((p) => p.join(',')).join(';');
    if (best === null || key < best) best = key;
  }
  return best;
}

export function buildNets() {
  const trees = combos(EDGES, 5).filter(isTree);
  const byShape = new Map();
  for (const edges of trees) {
    const lay = unfold(edges);
    if (lay.grid.some((g) => !g)) continue;
    const cells = lay.grid;
    const key = shapeKey(cells);
    if (byShape.has(key)) continue;
    // hinge data for the 3D rig: rotate child about (nc x np) through h*(np+nc)
    const hinges = [];
    for (const f of lay.order) {
      if (f === ROOT) continue;
      const p = lay.parent[f];
      const np = FACE_NORMAL[p], nc = FACE_NORMAL[f];
      hinges.push({
        face: f, parent: p,
        axis: cross(nc, np),
        point: [np[0] + nc[0], np[1] + nc[1], np[2] + nc[2]],
        angle: Math.PI / 2,
      });
    }
    byShape.set(key, {
      id: byShape.size,
      cells: cells.map((g, f) => ({ face: f, x: g[0], y: g[1], u: lay.frame[f].u, v: lay.frame[f].v })),
      hinges,
      order: lay.order,
      parent: lay.parent,
      key,
    });
  }
  const nets = [...byShape.values()];
  // classic cross: F centre, U above, D below, L left, R right, B above U
  const classic = nets.find((n) => {
    const at = (x, y) => n.cells.find((c) => c.x === x && c.y === y);
    return at(0, 0)?.face === 4 && at(0, 1)?.face === 0 && at(0, -1)?.face === 1
      && at(-1, 0)?.face === 3 && at(1, 0)?.face === 2 && at(0, 2)?.face === 5;
  });
  return { nets, classicId: classic ? classic.id : 0, treeCount: trees.length };
}

// facelet grid cell for every sticker of a net (used by the SVG renderer)
export function netFacelets(net, N) {
  const out = [];
  const off = (N - 1) / 2;
  for (const cell of net.cells) {
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const a = c - off, b = off - r;
      const gx = cell.x * N + off + cell.u[0] * a + cell.v[0] * b;
      const gy = cell.y * N + off + cell.u[1] * a + cell.v[1] * b;
      out.push({ face: cell.face, row: r, col: c, gx, gy });
    }
  }
  return out;
}

export const NET_INFO = {
  faces: 6, edges: 12, vertices: 8, euler: 2,
  genus: 0,
  adjacencyGraph: 'K_{2,2,2}（正八面体图）',
  spanningTrees: 384,
};
export { FACE_NAMES };