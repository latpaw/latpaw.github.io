import {
  CubeModel, MOVES, MOVE_INDEX, parseAlg, algToString, invertSeq, inverseMove,
  geoToFast, solvedFast, fastApply, fastClone, fastSeq, fastIsSolved, randomScramble,
} from '../src/core/model.js';

let fails = 0;
function ok(cond, msg) { if (!cond) { fails++; console.log('FAIL: ' + msg); } }

// 1. geometric model vs fast tables
const rng = (() => { let s = 12345; return () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff; })();
for (let trial = 0; trial < 400; trial++) {
  const cube = new CubeModel(3);
  const fast = solvedFast(3);
  const seq = [];
  for (let k = 0; k < 30; k++) {
    const mi = Math.floor(rng() * MOVES.length);
    seq.push(mi);
    cube.apply(mi, false);
    fastApply(fast, mi);
  }
  const g = geoToFast(cube);
  ok(g.join() === fast.join(), `geo/fast mismatch trial ${trial} seq=${algToString(seq)}`);
}
console.log('geo/fast agreement checked (400 x 30 moves, all 36 move kinds incl. slices and rotations)');

// 2. known orders
function orderOf(alg, cap = 5000) {
  const seq = parseAlg(alg);
  const cube = new CubeModel(3);
  for (let i = 1; i <= cap; i++) {
    cube.applySeq(seq, false);
    if (cube.isSolved()) return i;
  }
  return -1;
}
ok(orderOf('R') === 4, 'R order 4');
ok(orderOf("R U R' U'") === 6, 'sexy order 6, got ' + orderOf("R U R' U'"));
ok(orderOf('R U') === 105, 'R U order 105, got ' + orderOf('R U'));
ok(orderOf("R U2 D' B D'") === 1260, 'R U2 D\' B D\' order 1260, got ' + orderOf("R U2 D' B D'"));
console.log('group orders verified: R=4, sexy=6, RU=105');

// 3. solved facelets + inverse
{
  const c = new CubeModel(3);
  ok(c.solvedCount() === 54, 'solved facelets 54, got ' + c.solvedCount());
  const seq = randomScramble(3, 30, rng);
  c.applySeq(seq);
  ok(!c.isSolved(), 'scrambled not solved');
  c.applySeq(invertSeq(seq), false);
  ok(c.isSolved(), 'inverse restores');
  ok(c.solvedCount() === 54, 'restored facelets 54');
  const c2 = new CubeModel(2);
  ok(c2.cubies.length === 8, '2x2 has 8 cubies');
  ok(c2.solvedCount() === 24, '2x2 solved facelets 24, got ' + c2.solvedCount());
  const s2 = randomScramble(2, 20, rng);
  c2.applySeq(s2);
  c2.applySeq(invertSeq(s2), false);
  ok(c2.isSolved(), '2x2 inverse restores');
}

// 4. inverseMove correctness for every move
for (let i = 0; i < MOVES.length; i++) {
  const c = new CubeModel(3);
  c.apply(i, false); c.apply(inverseMove(i), false);
  ok(c.isSolved(), 'inverse of ' + MOVES[i].name);
}

// 5. slice moves keep centres consistent (M2 etc.)
{
  const c = new CubeModel(3);
  c.applySeq(parseAlg('M2 U M2 U2 M2 U M2'), false);
  const centres = c.cubies.filter((x) => x.type === 'center');
  ok(centres.every((x) => x.pos.join() === x.home.join()), 'H perm keeps centres');
}

// 6. facelet orientation sanity: U face of solved cube all 0, etc.
{
  const c = new CubeModel(3);
  const fl = c.facelets();
  for (let f = 0; f < 6; f++) ok(fl[f].every((v) => v === f), 'face ' + f + ' uniform');
  c.apply(MOVE_INDEX.get('U'), false);
  const fl2 = c.facelets();
  ok(fl2[0].every((v) => v === 0), 'U turn keeps U face uniform');
  ok(fl2[4].slice(0, 3).every((v) => v === 2), 'U turn sends R colour to F top row, got ' + fl2[4].slice(0, 3));
}

console.log(fails === 0 ? 'CORE OK' : `CORE FAILURES: ${fails}`);
process.exit(fails ? 1 : 0);