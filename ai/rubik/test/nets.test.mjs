import { buildNets, netFacelets } from '../src/core/nets.js';
import { FACE_NORMAL, FACE_FRAME, cross } from '../src/core/model.js';

let fails = 0;
const ok = (c, m) => { if (!c) { fails++; console.log('FAIL: ' + m); } };

const { nets, classicId, treeCount } = buildNets();
ok(treeCount === 384, 'spanning trees of octahedron graph = 384, got ' + treeCount);
ok(nets.length === 11, '11 distinct cube nets, got ' + nets.length);
console.log(`nets: ${nets.length} distinct shapes from ${treeCount} spanning trees; classic cross id=${classicId}`);

function rotAxisAngle(a, theta) {
  const [x, y, z] = a;
  const c = Math.cos(theta), s = Math.sin(theta), t = 1 - c;
  return [
    t * x * x + c, t * x * y - s * z, t * x * z + s * y,
    t * x * y + s * z, t * y * y + c, t * y * z - s * x,
    t * x * z - s * y, t * y * z + s * x, t * z * z + c,
  ];
}
const mv = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
const mm = (a, b) => { const o = new Array(9); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[r * 3 + c] = a[r * 3] * b[c] + a[r * 3 + 1] * b[3 + c] + a[r * 3 + 2] * b[6 + c]; return o; };
const I = [1, 0, 0, 0, 1, 0, 0, 0, 1];

for (const net of nets) {
  // no overlapping cells
  const seen = new Set(net.cells.map((c) => c.x + ',' + c.y));
  ok(seen.size === 6, `net ${net.id} has 6 distinct cells`);
  // connectivity of the net adjacency
  const adj = new Map(net.cells.map((c) => [c.x + ',' + c.y, c.face]));
  let links = 0;
  for (const c of net.cells) for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (adj.has((c.x + d[0]) + ',' + (c.y + d[1]))) links++;
  ok(links / 2 === 5, `net ${net.id} is a tree of 6 cells (5 links), got ${links / 2}`);

  // simulate the 3D hinge composition and compare with the flat layout
  const R = new Array(6).fill(null), T = new Array(6).fill(null);
  R[4] = I; T[4] = (v) => v;
  for (const f of net.order) {
    if (f === 4) continue;
    const h = net.hinges.find((x) => x.face === f);
    const Hm = rotAxisAngle(h.axis, h.angle);
    const q = h.point; // h = 1
    const Rp = R[h.parent], Tp = T[h.parent];
    R[f] = mm(Rp, Hm);
    T[f] = (v) => Tp([q[0] + mv(Hm, [v[0] - q[0], v[1] - q[1], v[2] - q[2]])[0], q[1] + mv(Hm, [v[0] - q[0], v[1] - q[1], v[2] - q[2]])[1], q[2] + mv(Hm, [v[0] - q[0], v[1] - q[1], v[2] - q[2]])[2]]);
  }
  for (const cell of net.cells) {
    const f = cell.face;
    const n = mv(R[f], FACE_NORMAL[f]);
    ok(Math.abs(n[0]) < 1e-9 && Math.abs(n[1]) < 1e-9 && Math.abs(n[2] - 1) < 1e-9, `net ${net.id} face ${f} normal flat, got ${n}`);
    const centre = T[f](FACE_NORMAL[f]);
    const exp = [cell.x * 2, cell.y * 2, 1];
    ok(Math.abs(centre[0] - exp[0]) < 1e-9 && Math.abs(centre[1] - exp[1]) < 1e-9 && Math.abs(centre[2] - exp[2]) < 1e-9,
      `net ${net.id} face ${f} centre ${centre} != ${exp}`);
    const u = mv(R[f], FACE_FRAME[f][0]);
    ok(Math.abs(u[0] - cell.u[0]) < 1e-9 && Math.abs(u[1] - cell.u[1]) < 1e-9, `net ${net.id} face ${f} u frame ${u} != ${cell.u}`);
    const v = mv(R[f], FACE_FRAME[f][1]);
    ok(Math.abs(v[0] - cell.v[0]) < 1e-9 && Math.abs(v[1] - cell.v[1]) < 1e-9, `net ${net.id} face ${f} v frame ${v} != ${cell.v}`);
  }
  const fl = netFacelets(net, 3);
  ok(fl.length === 54, 'net has 54 facelets');
  ok(new Set(fl.map((x) => x.gx + ',' + x.gy)).size === 54, 'net facelets do not overlap');
}
console.log(fails === 0 ? 'NETS OK (hinge composition matches flat layout for all 11 nets)' : `NETS FAILURES: ${fails}`);
process.exit(fails ? 1 : 0);