// Turns raw moves into human meaning: what moved, what it fixed, why it matters.
import { MOVES, CORNER_NAMES, EDGE_NAMES, FACE_NAMES, cornerColors, edgeColors, fastClone, fastSeq } from './model.js';
import { STAGES3 } from './solver3.js';

export const FACE_CN = ['上', '下', '右', '左', '前', '后'];
export const COLOR_CN = ['黄', '白', '红', '橙', '绿', '蓝'];
export const COLOR_HEX = ['#FFD400', '#F4F1EA', '#F5333F', '#FF8A1F', '#14E06A', '#2B7BFF'];

export function pieceLabel(kind, idx) {
  const cols = (kind === 'corner' ? cornerColors(idx) : edgeColors(idx)).map((f) => COLOR_CN[f]).join('');
  const slot = kind === 'corner' ? CORNER_NAMES[idx] : EDGE_NAMES[idx];
  return `${cols}${kind === 'corner' ? '角块' : '棱块'} ${slot}`;
}

export function moveCN(idx) {
  const m = MOVES[idx];
  if (m.whole) return `整体旋转 ${m.name}`;
  const cn = { U: '顶层', D: '底层', R: '右层', L: '左层', F: '前层', B: '后层', M: '中夹层(左右向)', E: '中夹层(上下向)', S: '中夹层(前后向)' }[m.base];
  const dir = m.q === 2 ? '转 180°' : m.q === 1 ? '顺时针 90°' : '逆时针 90°';
  return `${cn}${dir}`;
}

function score(facelets) {
  let k = 0;
  for (let f = 0; f < 6; f++) for (const v of facelets[f]) if (v === f) k++;
  return k;
}

function snapshot(cube) {
  return cube.cubies.map((c) => ({ pos: c.pos.join(','), rot: c.rot.join(','), home: c.home.join(','), type: c.type }));
}

// annotate a flat step list against the authoritative geometric model
export function annotate(cube, flat, n) {
  const work = cube.clone();
  const out = [];
  const total = n === 2 ? 24 : 54;
  for (let i = 0; i < flat.length; i++) {
    const st = flat[i];
    const beforeFl = work.facelets();
    const beforeSnap = snapshot(work);
    const beforeScore = score(beforeFl);
    work.apply(st.move, false);
    const afterFl = work.facelets();
    const afterSnap = snapshot(work);
    const afterScore = score(afterFl);
    const moved = [];
    const fixed = [];
    for (let k = 0; k < work.cubies.length; k++) {
      const c = work.cubies[k];
      if (beforeSnap[k].pos !== afterSnap[k].pos || beforeSnap[k].rot !== afterSnap[k].rot) {
        const homeIdx = c.type === 'corner'
          ? CORNER_NAMES.findIndex((nm, j) => cornerHome(j).join(',') === c.home.join(','))
          : c.type === 'edge' ? EDGE_NAMES.findIndex((nm, j) => edgeHome(j).join(',') === c.home.join(',')) : -1;
        moved.push({ type: c.type, label: c.type === 'center' ? `${COLOR_CN[c.stickers.find((s) => s !== null)]}中心块` : pieceLabel(c.type, homeIdx) });
        if (afterSnap[k].pos === c.home.join(',') && afterSnap[k].rot === '1,0,0,0,1,0,0,0,1' && beforeSnap[k].pos !== c.home.join(',')) {
          fixed.push(c.type === 'center' ? '中心块' : pieceLabel(c.type, homeIdx));
        }
      }
    }
    const gained = afterScore - beforeScore;
    out.push({
      i, move: st.move, name: MOVES[st.move].name, cn: moveCN(st.move),
      stage: st.stage, macro: st.macro, note: st.note,
      before: beforeFl, after: afterFl, beforeScore, afterScore, total,
      gained, moved, fixed,
      meaning: buildMeaning(st, gained, fixed, moved, n),
    });
  }
  return out;
}

function cornerHome(j) { const p = [[1, 1, 1], [-1, 1, 1], [-1, 1, -1], [1, 1, -1], [1, -1, 1], [-1, -1, 1], [-1, -1, -1], [1, -1, -1]][j]; return p; }
function edgeHome(j) { return [[1, 1, 0], [0, 1, 1], [-1, 1, 0], [0, 1, -1], [1, -1, 0], [0, -1, 1], [-1, -1, 0], [0, -1, -1], [1, 0, 1], [-1, 0, 1], [-1, 0, -1], [1, 0, -1]][j]; }

function buildMeaning(st, gained, fixed, moved, n) {
  const parts = [];
  if (fixed.length) parts.push(`归位：${fixed.slice(0, 3).join('、')}${fixed.length > 3 ? ` 等 ${fixed.length} 块` : ''}。`);
  if (gained > 0) parts.push(`正确贴纸 +${gained}。`);
  else if (gained < 0) parts.push(`正确贴纸 ${gained}：这是「先破后补」的中间步，公式走完会补回来。`);
  else parts.push('正确贴纸数不变：这一步在调整位置/朝向，为下一步铺路。');
  if (st.note) parts.push(st.note);
  if (n === 2) parts.push('2 阶没有中心块，颜色关系由角块自身决定。');
  return parts.join(' ');
}

export function stageInfo(idx, n) {
  if (n === 2) {
    return {
      id: 'mini', name: '最优解', en: 'Optimal BFS', color: '#22E3FF',
      goal: '用最少步数复原 2 阶',
      why: '2 阶魔方群只有 3,674,160 个状态，可以整表 breadth-first search，因此每一步都是数学上最短的路径。',
      math: '固定一个角块后，群 = 7! × 3^6 = 3,674,160。上帝之数 = 11（HTM）。',
    };
  }
  return STAGES3[idx] || STAGES3[0];
}

// ------------------------------------------------------------------ group math
export function permCycles(perm) {
  const seen = new Array(perm.length).fill(false);
  const cycles = [];
  for (let i = 0; i < perm.length; i++) {
    if (seen[i] || perm[i] === i) { seen[i] = true; continue; }
    const cyc = [];
    let j = i;
    while (!seen[j]) { seen[j] = true; cyc.push(j); j = perm[j]; }
    if (cyc.length > 1) cycles.push(cyc);
  }
  return cycles;
}
export function permParity(perm) {
  const cycles = permCycles(perm);
  let swaps = 0;
  for (const c of cycles) swaps += c.length - 1;
  return swaps % 2;
}
export function lcm(a, b) { const g = (x, y) => (y ? g(y, x % y) : x); return a / g(a, b) * b; }
export function seqOrder(cube, seq, cap = 20000) {
  const work = cube.clone();
  work.reset();
  let moves = 0;
  for (let i = 1; i <= cap; i++) {
    for (const m of seq) { work.apply(m, false); moves++; }
    if (work.isSolved()) return { order: i, moves };
  }
  return { order: -1, moves };
}
export function invariants(fast, n) {
  let twist = 0, flip = 0;
  for (let i = 0; i < 8; i++) twist += fast[8 + i];
  if (n === 3) for (let i = 0; i < 12; i++) flip += fast[28 + i];
  const cp = Array.from(fast.subarray(0, 8));
  const ep = n === 3 ? Array.from(fast.subarray(16, 28)) : [];
  return {
    twistSum: twist, twistMod: twist % 3,
    flipSum: flip, flipMod: flip % 2,
    cornerParity: permParity(cp), edgeParity: n === 3 ? permParity(ep) : 0,
    cornerCycles: permCycles(cp), edgeCycles: n === 3 ? permCycles(ep) : [],
    parityMatch: n === 3 ? permParity(cp) === permParity(ep) : true,
  };
}
export function stateSpace(n) {
  return n === 2
    ? { value: 3674160, formula: '7! × 3⁶', pretty: '3,674,160', god: 11, godQTM: 14 }
    : { value: 43252003274489856000, formula: '8! × 3⁷ × 12! × 2¹¹ ÷ 2', pretty: '43,252,003,274,489,856,000', god: 20, godQTM: 26 };
}
export const ORDER_PRESETS = [
  { alg: 'R U', label: 'R U', hint: '两个相邻面的四分之一转，生成 105 阶循环' },
  { alg: "R U R' U'", label: 'Sexy Move', hint: '交换子 [R,U]，6 次回到原状' },
  { alg: "R U R' U R U2 R'", label: 'Sune', hint: '顶层三轮换 + 扭转' },
  { alg: "R U2 D' B D'", label: 'R U2 D\' B D\'', hint: '著名的 1260 阶公式' },
  { alg: 'R L U D F B', label: '六面齐转', hint: '所有面同时顺时针' },
];