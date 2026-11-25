import { CubeModel, randomScramble, geoToFast, fastSeq, fastIsSolved, algToString, invertSeq } from '../src/core/model.js';
import { solve3, flattenSteps } from '../src/core/solver3.js';

const rng = (() => { let s = 987654321; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; })();
const N = Number(process.argv[2] || 120);
let fail = 0, totalMoves = 0, maxMoves = 0, t0 = Date.now(), worst = 0;
const stageFails = {};
for (let i = 0; i < N; i++) {
  const cube = new CubeModel(3);
  const scr = randomScramble(3, 25, rng);
  cube.applySeq(scr, false);
  const t = Date.now();
  const res = solve3(cube.toFast());
  const dt = Date.now() - t;
  worst = Math.max(worst, dt);
  if (!res.ok) {
    fail++;
    stageFails[res.failedStage] = (stageFails[res.failedStage] || 0) + 1;
    if (fail <= 3) console.log(`FAIL#${i} stage=${res.failedStage} scramble=${algToString(scr)}`);
    continue;
  }
  const flat = flattenSteps(res.steps).map((x) => x.move);
  // verify on the authoritative geometric model
  const check = new CubeModel(3);
  check.applySeq(scr, false);
  check.applySeq(flat, false);
  if (!check.isSolved()) { fail++; console.log(`FAIL#${i} geometric not solved after solution`); continue; }
  totalMoves += flat.length;
  maxMoves = Math.max(maxMoves, flat.length);
}
console.log(`3x3 LBL: ${N - fail}/${N} solved, avg ${(totalMoves / Math.max(1, N - fail)).toFixed(1)} moves, max ${maxMoves}, total ${((Date.now() - t0) / 1000).toFixed(1)}s, worst single ${worst}ms`);
if (Object.keys(stageFails).length) console.log('stage failures:', stageFails);
process.exit(fail ? 1 : 0);