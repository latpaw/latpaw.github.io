// 3x3 beginner-method solver. Every stage is a bounded macro search whose
// result is verified, so each produced move carries a human meaning.
import {
  MOVES, MOVE_INDEX, FACE_NORMAL, parseAlg, fastApply, fastClone, fastSeq,
  fastIsSolved, CORNER_NAMES, EDGE_NAMES, matVec,
} from './model.js';

const mi = (n) => MOVE_INDEX.get(n);
const A = (s) => parseAlg(s);

export const STAGES3 = [
  {
    id: 'cross', name: '底层十字', en: 'White Cross', color: '#F4F1EA',
    goal: '四个白色棱块归位到底层，侧面颜色与中心块对齐',
    why: '十字是整座魔方的地基：它同时锁定了 4 个棱块的位置与朝向，也确定了底面与四个侧面的相对关系。后续所有公式都以「不破坏十字」为前提。',
    math: '棱块朝向构成 (Z/2)^11 的一个分量：12 个棱块的翻转数之和必须为偶数，所以最后一个棱块的朝向由前 11 个决定。',
  },
  {
    id: 'corners', name: '底层角块', en: 'First Layer Corners', color: '#FF8A1F',
    goal: '四个白色角块插入底层，第一层完整',
    why: '角块有三个贴纸，一旦归位就同时确定三个面的颜色关系。用「抽出—对齐—插入」的循环，可以在不破坏十字的前提下逐个安放。',
    math: '角块朝向属于 (Z/3)^7：8 个角块的扭转数之和 ≡ 0 (mod 3)，这就是「不可能只扭转一个角块」的数学原因。',
  },
  {
    id: 'middle', name: '中层棱块', en: 'Middle Layer Edges', color: '#14E06A',
    goal: '四个不含黄色的棱块插入中层，前两层完成',
    why: '中层棱块只有两个贴纸，且不含顶面颜色。左右两条插入公式互为镜像，本质是把顶层棱块「让位—回填」的交换子。',
    math: '插入公式是交换子 [U, R] 的共轭：先破坏一小块，再用另一条路径补回，净效果只交换少数块——这是所有魔方公式的通用构造法。',
  },
  {
    id: 'ollEdges', name: '顶层十字', en: 'Orient Last Layer Edges', color: '#FFD400',
    goal: '顶面四个棱块黄色朝上（点 → 折线 → 直线 → 十字）',
    why: '先解决朝向再解决位置，是「分而治之」：朝向只有 2^3 种合法组合，用一条公式就能把它们全部推进到十字。',
    math: '顶层棱块朝向只有 4 种合法状态（0/2/4 个翻转），因为翻转总数必须为偶数——奇数个 flipped edge 的状态在魔方群里根本不存在。',
  },
  {
    id: 'ollCorners', name: '顶面朝向', en: 'Orient Last Layer Corners', color: '#22E3FF',
    goal: '顶面全部黄色（Sune / Antisune 及其镜像）',
    why: 'Sune 公式只扭转三个角块而不改变任何块的朝向合法性，配合顶层旋转就能覆盖全部 7 种顶面角块朝向情况。',
    math: '角块扭转和 ≡ 0 (mod 3) 意味着「只有一个角块扭转」不可能；Sune 恰好实现 (+1, +1, +1) 的扭转分配。',
  },
  {
    id: 'pllCorners', name: '顶层角块位置', en: 'Permute Last Layer Corners', color: '#FF2D9B',
    goal: '四个顶层角块回到正确位置（朝向已对）',
    why: '此时颜色都对了，只是「站错了位置」。三轮换公式（A-perm）与 T-perm 提供偶置换与奇置换两种基本操作。',
    math: '角块置换与棱块置换的奇偶性必须相同。单独交换两个角块是不可能的——必须同时交换两个棱块，这就是 T-perm 存在的理由。',
  },
  {
    id: 'pllEdges', name: '顶层棱块位置', en: 'Permute Last Layer Edges', color: '#2B7BFF',
    goal: '最后四个棱块归位，魔方复原',
    why: 'U-perm 是纯粹的三轮换，H-perm 是两组对换。它们不改变任何朝向，是收尾的「纯置换」工具。',
    math: '固定其余块后，顶层棱块的可达置换群是 A4（12 个偶置换），由两个 3-循环生成——所以 Ua + Ub 就足够了。',
  },
];

// ------------------------------------------------------------------ utilities
function rotFaceMap(rotName) {
  const R = MOVES[mi(rotName)].matrix;
  const map = [];
  for (let f = 0; f < 6; f++) {
    const d = matVec(R, FACE_NORMAL[f]);
    map[f] = FACE_NORMAL.findIndex((n) => n[0] === d[0] && n[1] === d[1] && n[2] === d[2]);
  }
  return map;
}
function remap(seq, rotName) {
  if (rotName === 'id') return seq.slice();
  const map = rotFaceMap(rotName);
  return seq.map((i) => {
    const m = MOVES[i];
    if (m.kind >= 6) throw new Error('remap only supports face moves');
    return map[m.kind] * 3 + (m.q - 1);
  });
}
function macro(name, seq, tag, note) {
  return { name, seq: typeof seq === 'string' ? A(seq) : seq, tag, note };
}
const U_MACROS = [
  macro('U', 'U', 'U', '顶层顺时针 90°，用来把目标块对准它要去的槽位'),
  macro("U'", "U'", 'U', '顶层逆时针 90°'),
  macro('U2', 'U2', 'U', '顶层 180°，一次对齐到对面'),
];

function solvedEdges(s, list) { return list.every((i) => s[16 + i] === i && s[28 + i] === 0); }
function solvedCorners(s, list) { return list.every((i) => s[i] === i && s[8 + i] === 0); }
const D_EDGES = [4, 5, 6, 7];
const D_CORNERS = [4, 5, 6, 7];
const M_EDGES = [8, 9, 10, 11];
const U_CORNERS = [0, 1, 2, 3];
const U_EDGES = [0, 1, 2, 3];

function firstTwoLayers(s) {
  return solvedEdges(s, D_EDGES) && solvedCorners(s, D_CORNERS) && solvedEdges(s, M_EDGES);
}

// IDDFS over macros; goal + protect are only tested for acceptance, never used
// to prune, so temporary breaking (as every real algorithm does) is allowed.
function search(state, macros, goal, protect, maxDepth, nodeCap) {
  const work = fastClone(state);
  const path = [];
  const tags = [];
  let nodes = 0;
  let overflow = false;
  const saved = [];
  for (let i = 0; i <= maxDepth + 1; i++) saved.push(new Uint8Array(40));

  function rec(depth) {
    if (goal(work) && protect(work)) return true;
    if (depth === 0 || overflow) return false;
    const lastTag = tags.length ? tags[tags.length - 1] : null;
    for (const mc of macros) {
      if (mc.tag && mc.tag === lastTag) continue;
      if (++nodes > nodeCap) { overflow = true; return false; }
      saved[depth].set(work);
      fastSeq(work, mc.seq);
      path.push(mc); tags.push(mc.tag);
      if (rec(depth - 1)) return true;
      path.pop(); tags.pop();
      work.set(saved[depth]);
      if (overflow) return false;
    }
    return false;
  }
  for (let d = 0; d <= maxDepth; d++) {
    nodes = 0; overflow = false;
    if (rec(d)) return { path: path.slice(), nodes };
    if (!overflow && d === maxDepth) break;
  }
  return { path: null, nodes, overflow };
}

// -------------------------------------------------------------- macro banks
const CROSS_MACROS = MOVES.slice(0, 18).map((m) => macro(m.name, [m.idx], m.base, ''));

function cornerMacros() {
  const out = [...U_MACROS];
  const bases = ['R', "R'", 'R2', 'L', "L'", 'L2', 'F', "F'", 'F2', 'B', "B'", 'B2'];
  for (const b of bases) {
    const inv = b.endsWith("'") ? b.slice(0, 1) : b.endsWith('2') ? b : b + "'";
    for (const u of ['U', "U'", 'U2']) {
      out.push(macro(`${b} ${u} ${inv}`, `${b} ${u} ${inv}`, b[0], '抽出 / 让位：把底层角块提到顶层，或给目标块腾出插入路径'));
    }
  }
  const cycles = [
    ['R', "R U R' U'", '右手公式（sexy move）：把顶层角块塞进右前底槽'],
    ['L', "L' U' L U", '左手公式：镜像的插入循环，用于左前底槽'],
    ['R2', "R' U' R U", '右后槽的插入循环'],
    ['L2', "L U L' U'", '左后槽的插入循环'],
    ['F', "F' U' F U", '前左槽的插入循环'],
    ['B', "B U B' U'", '后右槽的插入循环'],
  ];
  for (const [tag, seq, note] of cycles) {
    const base = A(seq);
    for (let k = 1; k <= 5; k++) {
      const s = [];
      for (let i = 0; i < k; i++) s.push(...base);
      out.push(macro(`(${seq})×${k}`, s, tag, k === 1 ? note : `${note}；重复 ${k} 次以匹配角块的三种朝向`));
    }
  }
  return out;
}

const RIGHT_INSERT = 'U R U\' R\' U\' F\' U F';
const LEFT_INSERT = 'U\' L\' U L U F U\' F\'';
const SLOT_ROT = { 8: 'id', 11: "y'", 10: 'y2', 9: 'y' };      // FR BR BL FL
const SLOT_ROT_L = { 9: 'id', 8: "y'", 11: 'y2', 10: 'y' };

function middleMacros(target) {
  const out = [...U_MACROS];
  // every middle slot needs both insertion directions: an edge stuck in a
  // *different* slot can only be evicted by that slot's own algorithm.
  for (const slot of [8, 11, 10, 9]) {
    const r = remap(A(RIGHT_INSERT), SLOT_ROT[slot]);
    const l = remap(A(LEFT_INSERT), SLOT_ROT_L[slot]);
    const rNoU = remap(A(RIGHT_INSERT.slice(2)), SLOT_ROT[slot]);
    const lNoU = remap(A(LEFT_INSERT.slice(3)), SLOT_ROT_L[slot]);
    const tn = EDGE_NAMES[slot];
    out.push(macro(`右插入→${tn}`, r, 'iR' + slot, `右手插入公式：把顶层棱块送进 ${tn} 槽，第一层先破后补`));
    out.push(macro(`左插入→${tn}`, l, 'iL' + slot, `左手插入公式：镜像版本，送往 ${tn} 槽`));
    out.push(macro(`右插入→${tn}(已对齐)`, rNoU, 'nR' + slot, '已经对齐时省去顶层预备转动'));
    out.push(macro(`左插入→${tn}(已对齐)`, lNoU, 'nL' + slot, '已经对齐时省去顶层预备转动'));
  }
  return out;
}

const OLL_E_MACROS = [
  ...U_MACROS,
  macro('F R U R\' U\' F\'', 'F R U R\' U\' F\'', 'F', '「点/折线 → 十字」公式：一次翻转两个顶层棱块'),
  macro('F U R U\' R\' F\'', 'F U R U\' R\' F\'', 'F', '另一种朝向的翻棱公式，处理直线情形'),
  macro('Sune', 'R U R\' U R U2 R\'', 'R', 'Sune：同时调整顶层朝向，保持前两层不变'),
  macro('Antisune', 'R U2 R\' U\' R U\' R\'', 'R', 'Antisune：Sune 的镜像'),
];
const OLL_C_MACROS = [
  ...U_MACROS,
  macro('Sune', 'R U R\' U R U2 R\'', 'R', 'Sune：三个角块各扭转一次，顶面变黄'),
  macro('Antisune', 'R U2 R\' U\' R U\' R\'', 'R', 'Antisune：反向扭转三个角块'),
  macro('Double Sune', 'R U R\' U R U\' R\' U R U2 R\'', 'R', '双 Sune：处理需要两次扭转分配的情形'),
];
const PLL_C_MACROS = [
  ...U_MACROS,
  macro('Aa-perm', "R' F R' B2 R F' R' B2 R2", 'R', '角块三轮换（顺时针），棱块随之轮换但朝向不变'),
  macro('Ab-perm', "R2 B2 R F R' B2 R F' R", 'R', '角块三轮换（逆时针）'),
  macro('T-perm', "R U R' U' R' F R2 U' R' U' R U R' F'", 'R', 'T-perm：交换两个角块 + 两个棱块，提供奇置换'),
  macro('Y-perm', "F R U' R' U' R U R' F' R U R' U' R' F R F'", 'F', 'Y-perm：对角交换两角 + 两棱'),
];
const PLL_E_MACROS = [
  ...U_MACROS,
  macro('Ua-perm', "R U' R U R U R U' R' U' R2", 'R', '顶层三棱顺时针轮换，其余全部不动'),
  macro('Ub-perm', "R2 U R U R' U' R' U' R' U R'", 'R', '顶层三棱逆时针轮换'),
  macro('H-perm', 'M2 U M2 U2 M2 U M2', 'M', 'H-perm：两组对棱互换（中层两次 180°，中心块回位）'),
];

// ------------------------------------------------------------------- solver
export function solve3(fastState, opts = {}) {
  const s = fastClone(fastState);
  const steps = [];
  const stageReport = [];
  const push = (stageIdx, path) => {
    for (const mc of path) {
      steps.push({ stage: stageIdx, macro: mc.name, note: mc.note, moves: mc.seq.slice() });
    }
  };

  if (fastIsSolved(s, 3)) return { steps, stages: stageReport, ok: true, alreadySolved: true };

  // stage 1: cross
  const crossDone = [];
  for (const t of [5, 4, 6, 7]) {
    const goal = (w) => w[16 + t] === t && w[28 + t] === 0;
    const protect = (w) => solvedEdges(w, crossDone);
    const res = search(s, CROSS_MACROS, goal, protect, 6, opts.nodeCap || 900000);
    if (!res.path) return { ok: false, failedStage: 0, steps, stages: stageReport };
    push(0, res.path);
    for (const mc of res.path) fastSeq(s, mc.seq);
    crossDone.push(t);
    stageReport.push({ stage: 0, target: EDGE_NAMES[t], nodes: res.nodes, depth: res.path.length });
  }
  // stage 2: corners
  const cornerDone = [];
  const cm = cornerMacros();
  for (const t of [4, 7, 6, 5]) {
    const goal = (w) => w[t] === t && w[8 + t] === 0;
    const protect = (w) => solvedEdges(w, D_EDGES) && solvedCorners(w, cornerDone);
    const res = search(s, cm, goal, protect, 3, opts.nodeCap || 500000);
    if (!res.path) return { ok: false, failedStage: 1, steps, stages: stageReport };
    push(1, res.path);
    for (const mc of res.path) fastSeq(s, mc.seq);
    cornerDone.push(t);
    stageReport.push({ stage: 1, target: CORNER_NAMES[t], nodes: res.nodes, depth: res.path.length });
  }
  // stage 3: middle edges
  const midDone = [];
  for (const t of [8, 11, 10, 9]) {
    const goal = (w) => w[16 + t] === t && w[28 + t] === 0;
    const protect = (w) => solvedEdges(w, D_EDGES) && solvedCorners(w, D_CORNERS) && solvedEdges(w, midDone);
    const res = search(s, middleMacros(t), goal, protect, 4, opts.nodeCap || 400000);
    if (!res.path) return { ok: false, failedStage: 2, steps, stages: stageReport };
    push(2, res.path);
    for (const mc of res.path) fastSeq(s, mc.seq);
    midDone.push(t);
    stageReport.push({ stage: 2, target: EDGE_NAMES[t], nodes: res.nodes, depth: res.path.length });
  }
  // stage 4..7
  const late = [
    { idx: 3, macros: OLL_E_MACROS, goal: (w) => U_EDGES.every((i) => w[28 + i] === 0), protect: firstTwoLayers, depth: 4 },
    { idx: 4, macros: OLL_C_MACROS, goal: (w) => U_CORNERS.every((i) => w[8 + i] === 0), protect: (w) => firstTwoLayers(w) && U_EDGES.every((i) => w[28 + i] === 0), depth: 4 },
    { idx: 5, macros: PLL_C_MACROS, goal: (w) => U_CORNERS.every((i) => w[i] === i), protect: (w) => firstTwoLayers(w) && U_CORNERS.every((i) => w[8 + i] === 0) && U_EDGES.every((i) => w[28 + i] === 0), depth: 4 },
    { idx: 6, macros: PLL_E_MACROS, goal: (w) => fastIsSolved(w, 3), protect: (w) => firstTwoLayers(w) && U_CORNERS.every((i) => w[i] === i && w[8 + i] === 0) && U_EDGES.every((i) => w[28 + i] === 0), depth: 4 },
  ];
  for (const st of late) {
    const res = search(s, st.macros, st.goal, st.protect, st.depth, opts.nodeCap || 600000);
    if (!res.path) return { ok: false, failedStage: st.idx, steps, stages: stageReport };
    push(st.idx, res.path);
    for (const mc of res.path) fastSeq(s, mc.seq);
    stageReport.push({ stage: st.idx, nodes: res.nodes, depth: res.path.length });
  }
  return { ok: fastIsSolved(s, 3), steps, stages: stageReport, finalState: s };
}

export function flattenSteps(steps) {
  const out = [];
  for (const st of steps) for (const m of st.moves) out.push({ move: m, stage: st.stage, macro: st.macro, note: st.note });
  return out;
}