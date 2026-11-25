import { CubeModel, randomScramble, algToString, MOVES } from '../src/core/model.js';
import { Solver2, SOLVER2_INFO } from '../src/core/solver2.js';

const rng = (() => { let s = 424242; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; })();
const t0 = Date.now();
const solver = new Solver2().buildSync();
console.log(`2x2 BFS table: ${solver.nodes} states in ${Date.now() - t0}ms, max depth (God's number for <U,R,F>) = ${solver.maxDepth}`);
if (solver.nodes !== SOLVER2_INFO.states) { console.log('FAIL: state count'); process.exit(1); }

const key = (c) => c.cubies.map((x) => `${x.home}|${x.pos}|${x.rot}`).sort().join(';');
let fail = 0, total = 0, max = 0, worst = 0;
const N = Number(process.argv[2] || 300);
for (let i = 0; i < N; i++) {
  const cube = new CubeModel(2);
  const scr = randomScramble(2, 20, rng);
  cube.applySeq(scr, false);
  const t = Date.now();
  const res = solver.solve(cube.toFast());
  worst = Math.max(worst, Date.now() - t);
  if (!res) { fail++; console.log('FAIL no solution', algToString(scr)); continue; }
  const check = new CubeModel(2);
  check.applySeq(scr, false);
  check.applySeq(res.rotations, false);
  check.applySeq(res.moves, false);
  if (!check.isSolved()) { fail++; if (fail < 4) console.log('FAIL not solved', algToString(scr)); continue; }
  total += res.moves.length; max = Math.max(max, res.moves.length);
}
console.log(`2x2 optimal: ${N - fail}/${N} solved, avg ${(total / Math.max(1, N - fail)).toFixed(2)} moves, max ${max}, worst solve ${worst}ms`);
process.exit(fail ? 1 : 0);