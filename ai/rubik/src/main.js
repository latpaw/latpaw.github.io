import * as THREE from 'three';
import {
  CubeModel, MOVES, MOVE_INDEX, parseAlg, algToString, randomScramble, invertSeq,
  inverseMove, FACE_NORMAL, fastKey,
} from './core/model.js';
import { solve3, flattenSteps } from './core/solver3.js';
import { Solver2 } from './core/solver2.js';
import { buildNets } from './core/nets.js';
import { annotate, moveCN, seqOrder, ORDER_PRESETS, COLOR_HEX, stageInfo } from './core/insight.js';
import { World, PALETTES } from './three/world.js';
import { Audio } from './audio.js';
import { renderPlay, renderTutorial, renderMechanism, renderMath, renderHelp, netSVG } from './ui/panels.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const a = {
  n: 3, mode: 'play', palette: 'classic',
  cube: new CubeModel(3),
  history: [], scramble: [],
  nets: buildNets(), netId: 0, classicId: 0, unfold: 0,
  tutorial: { steps: [], annotated: [], index: 0, playing: false, speed: 1, baseKey: '' },
  building: false, buildProgress: 0, buildDepth: 0,
  selectedPart: null,
  orderDemo: { alg: "R U R' U'", seqLen: 4, order: 6, running: false, count: 0 },
  challenge: null,
  timer: { running: false, start: 0, elapsed: 0 },
  stats: { solves: 0 },
  programmatic: false,
  turnGap: 0,
  idleSpin: true,
};
a.classicId = a.nets.classicId;
a.netId = a.classicId;

const world = new World($('#gl'));
const audio = new Audio();
const solver2 = new Solver2();
let queue = [];
let pumping = false;
let gesture = null;
let unfoldAnim = null;
let lastHud = 0;
let celebrate = 0;

// ------------------------------------------------------------------- helpers
function toast(msg, kind = '') {
  const el = document.createElement('div');
  el.className = 'toast ' + kind;
  el.innerHTML = `<i></i><span>${msg}</span>`;
  $('#toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 2600);
}

function download(name, url) {
  const link = document.createElement('a');
  link.href = url; link.download = name;
  document.body.appendChild(link); link.click(); link.remove();
}

function baseDuration() { return 0.34 / world.opts.speed; }

function syncVisuals() {
  world.syncTransforms();
  if (a.mode === 'math') world.syncNet(a.cube.facelets());
}

function invalidateTutorial(reason) {
  if (a.tutorial.steps.length && !a.programmatic) {
    a.tutorial = { steps: [], annotated: [], index: 0, playing: false, speed: a.tutorial.speed, baseKey: '' };
    if (reason) toast(reason, 'warn');
  }
}

function afterMove(idx, record) {
  if (record) a.history.push(idx);
  syncVisuals();
  if (!a.programmatic) {
    invalidateTutorial('手动转动使教程失效，可重新求解');
    if (!a.timer.running && !a.cube.isSolved()) { a.timer.running = true; a.timer.start = performance.now(); }
  }
  if (a.cube.isSolved()) {
    if (a.timer.running) { a.timer.elapsed = performance.now() - a.timer.start; a.timer.running = false; }
    if (!a.programmatic || a.tutorial.index >= a.tutorial.steps.length) {
      a.stats.solves++;
      celebrate = 1;
      audio.solved();
      toast(`复原完成！${a.history.length} 步 · ${(a.timer.elapsed / 1000).toFixed(1)}s`, 'ok');
    }
  }
  updateHud(true);
}

function runMove(idx, dur, record, done) {
  world.animateMove(idx, dur, world.opts.easing, () => {
    afterMove(idx, record);
    if (done) done();
  }, () => { a.cube.apply(idx, false); });
}

function pump() {
  if (pumping) return;
  const item = queue.shift();
  if (!item) { pumping = false; return; }
  pumping = true;
  audio.turn(1, item.accent);
  runMove(item.idx, item.dur, item.record, () => {
    pumping = false;
    if (item.done) item.done();
    if (a.turnGap > 0 && queue.length) setTimeout(pump, a.turnGap);
    else pump();
  });
}

function enqueue(idx, opts = {}) {
  queue.push({ idx, dur: opts.dur ?? baseDuration(), record: opts.record !== false, accent: !!opts.accent, done: opts.done });
  pump();
}

function enqueueSeq(seq, opts = {}) {
  seq.forEach((idx, i) => enqueue(idx, { ...opts, dur: opts.dur ?? baseDuration(), done: i === seq.length - 1 ? opts.done : undefined }));
}

function clearQueue() { queue = []; world.cancelAnims(); pumping = false; }

function flashNotation(name) {
  const el = $('#bigNotation');
  el.textContent = name;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
}

// -------------------------------------------------------------------- moves
function userMove(idx, opts = {}) {
  if (idx < 0) return;
  const m = MOVES[idx];
  if (m.slice && a.n === 2) { toast('2 阶没有夹层', 'warn'); audio.error(); return; }
  a.programmatic = false;
  flashNotation(m.name);
  enqueue(idx, { accent: true, ...opts });
}

function doScramble() {
  clearQueue();
  a.tutorial.playing = false;
  const len = a.n === 2 ? 14 : 24;
  const seq = randomScramble(a.n, len);
  a.scramble = seq.slice();
  a.programmatic = true;
  a.timer.running = false; a.timer.elapsed = 0;
  invalidateTutorialSilent();
  enqueueSeq(seq, {
    dur: Math.max(0.07, 0.13 / world.opts.speed),
    done: () => {
      a.programmatic = false;
      a.challenge = { target: Math.round(len * (a.n === 2 ? 1.1 : 2.6)), scrambleLen: len };
      toast(`已生成随机 ${a.n} 阶魔方 · ${len} 步打乱`, 'ok');
      updateHud(true); renderRight();
    },
  });
  updateHud(true);
}

function invalidateTutorialSilent() {
  a.tutorial = { steps: [], annotated: [], index: 0, playing: false, speed: a.tutorial.speed, baseKey: '' };
}

function doRewind() {
  if (!a.history.length) { toast('没有可回溯的动作', 'warn'); return; }
  clearQueue();
  a.tutorial.playing = false;
  const seq = invertSeq(a.history);
  a.programmatic = true;
  invalidateTutorialSilent();
  const n = a.history.length;
  enqueueSeq(seq, {
    dur: Math.max(0.05, 0.1 / world.opts.speed), record: false,
    done: () => {
      a.history = [];
      a.programmatic = false;
      a.timer.running = false;
      toast(`回溯还原完成 · 逆序撤销 ${n} 步`, 'ok');
      updateHud(true); renderRight();
    },
  });
}

function doReset() {
  clearQueue();
  a.cube.reset();
  a.history = []; a.scramble = [];
  a.timer = { running: false, start: 0, elapsed: 0 };
  a.challenge = null;
  invalidateTutorialSilent();
  a.programmatic = false;
  syncVisuals();
  audio.tick(660);
  toast('已重置为复原态');
  updateHud(true); renderRight();
}

function doUndo() {
  if (!a.history.length) { toast('没有可撤销的动作', 'warn'); return; }
  const last = a.history[a.history.length - 1];
  a.programmatic = true;
  invalidateTutorialSilent();
  enqueue(inverseMove(last), {
    record: false,
    done: () => { a.history.pop(); a.programmatic = false; updateHud(true); renderRight(); },
  });
}

// ----------------------------------------------------------------- tutorial
async function buildTutorial() {
  if (a.building) return;
  clearQueue();
  a.tutorial.playing = false;
  const startState = a.cube.toFast();
  const baseKey = fastKey(startState, a.n);
  let flat = [];
  if (a.n === 2) {
    a.building = true; a.buildProgress = 0; renderRight();
    await solver2.build((p, d) => {
      a.buildProgress = p; a.buildDepth = d;
      const el = $('#panelTutorial');
      if (el && a.mode === 'tutorial') renderRight();
    });
    a.building = false;
    const res = solver2.solve(startState);
    if (!res) { toast('求解失败', 'bad'); renderRight(); return; }
    const all = [...res.rotations, ...res.moves];
    flat = all.map((m, i) => ({
      move: m, stage: 0,
      macro: i < res.rotations.length ? '整体定向' : `最优第 ${i - res.rotations.length + 1} 步`,
      note: i < res.rotations.length
        ? '2 阶没有中心块，先整体转动把一个角块固定到 DBL，才能用 <U,R,F> 三个生成元搜索最短路径。'
        : `BFS 最短路上的第 ${i - res.rotations.length + 1} 步（共 ${res.moves.length} 步，上帝之数 ${res.godNumber}）。`,
    }));
  } else {
    const res = solve3(startState);
    if (!res.ok) {
      toast('层先法搜索失败，可用回溯还原', 'bad');
      renderRight(); return;
    }
    flat = flattenSteps(res.steps);
  }
  const annotated = annotate(a.cube, flat, a.n);
  a.tutorial = { steps: flat, annotated, index: 0, playing: false, speed: a.tutorial.speed, baseKey };
  a.programmatic = true;
  toast(`教程已生成 · ${flat.length} 步`, 'ok');
  audio.stage();
  renderRight();
  updateHud(true);
}

function tutorialApply(count) {
  // move the cube to tutorial step `count`
  const t = a.tutorial;
  const diff = count - t.index;
  if (!diff) return;
  a.programmatic = true;
  const seq = diff > 0
    ? t.steps.slice(t.index, count).map((s) => s.move)
    : invertSeq(t.steps.slice(count, t.index).map((s) => s.move));
  const dur = Math.max(0.06, 0.2 / (world.opts.speed * t.speed));
  enqueueSeq(seq, {
    dur, record: false,
    done: () => { a.programmatic = false; updateHud(true); },
  });
  t.index = count;
  patchTutorial();
}

function tutorialPlay() {
  const t = a.tutorial;
  if (!t.steps.length) { buildTutorial(); return; }
  if (t.index >= t.steps.length) { tutorialApply(0); }
  t.playing = !t.playing;
  if (t.playing) { a.programmatic = true; audio.tick(880); }
  patchTutorial();
}

let playAcc = 0;
function tutorialTick(dt) {
  const t = a.tutorial;
  if (!t.playing || pumping || queue.length) return;
  playAcc += dt;
  const interval = Math.max(0.05, 0.42 / (world.opts.speed * t.speed));
  if (playAcc < interval) return;
  playAcc = 0;
  if (t.index >= t.steps.length) {
    t.playing = false; a.programmatic = false;
    audio.solved(); celebrate = 1;
    toast('教程演示完成 · 魔方已复原', 'ok');
    patchTutorial(); updateHud(true);
    return;
  }
  const st = t.steps[t.index];
  a.programmatic = true;
  flashNotation(MOVES[st.move].name);
  world.setHighlight(world.layerCubieIds(st.move));
  enqueue(st.move, {
    dur: Math.max(0.06, 0.3 / (world.opts.speed * t.speed)), record: false, accent: true,
    done: () => {
      if (t.index >= t.steps.length) { t.playing = false; a.programmatic = false; }
      patchTutorial(); updateHud(true);
    },
  });
  t.index++;
  patchTutorial();
}

// -------------------------------------------------------------- order demo
function calcOrder(alg) {
  let seq;
  try { seq = parseAlg(alg); } catch (e) { toast('公式非法：' + e.message, 'bad'); return; }
  if (!seq.length) { toast('请输入公式', 'warn'); return; }
  const r = seqOrder(a.cube, seq, 4000);
  a.orderDemo = { alg, seqLen: seq.length, order: r.order, running: false, count: 0 };
  if (r.order > 0) toast(`阶 = ${r.order}（共 ${r.order * seq.length} 步回到原状）`, 'ok');
  else toast('超过 4000 次仍未复原', 'warn');
  renderRight();
}

let orderAcc = 0;
function orderTick(dt) {
  const od = a.orderDemo;
  if (!od.running || pumping || queue.length) return;
  orderAcc += dt;
  if (orderAcc < Math.max(0.03, 0.14 / world.opts.speed)) return;
  orderAcc = 0;
  if (od.count >= od.order) {
    od.running = false;
    audio.solved(); celebrate = 1;
    toast(`重复 ${od.order} 次后回到原状 ✓`, 'ok');
    renderRight(); return;
  }
  let seq;
  try { seq = parseAlg(od.alg); } catch (e) { od.running = false; renderRight(); return; }
  a.programmatic = true;
  enqueueSeq(seq, {
    dur: Math.max(0.04, 0.1 / world.opts.speed), record: false,
    done: () => { od.count++; a.programmatic = false; renderRight(); },
  });
}

// ------------------------------------------------------------------- modes
const MODE_META = {
  play: ['状态', 'STATUS', '拖拽空白处旋转视角 · 在魔方表面滑动即可转层 · 滚轮缩放'],
  tutorial: ['教程', 'TUTORIAL', '播放自动还原 · 每一步都解释作用与意义 · 点击阶段可跳转'],
  mechanism: ['内部机构', 'MECHANISM', '拖动「爆炸拆解 / 外壳透明 / 剖切」滑块 · 点击右侧部件隔离显示'],
  math: ['数学原理', 'MATHEMATICS', '点击展开图贴纸转面 · 拖动「3D 展开程度」看铰链展开 · 试试公式的阶'],
};

function setMode(mode) {
  a.mode = mode;
  $$('.mode').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
  $$('.panel').forEach((p) => { p.hidden = p.dataset.panel !== mode; });
  const [title, sub, hint] = MODE_META[mode];
  $('#rightTitle').textContent = title;
  $('#rightSub').textContent = sub;
  $('#stageHint').textContent = hint;
  world.setMode(mode);
  if (mode === 'mechanism') {
    setOpt('xray', Math.max(world.opts.xray, 0.55));
    setOpt('explode', Math.max(world.opts.explode, 0.18));
    $('#rXray').value = world.opts.xray; $('#vXray').textContent = world.opts.xray.toFixed(2);
    $('#rExplode').value = world.opts.explode; $('#vExplode').textContent = world.opts.explode.toFixed(2);
  }
  if (mode === 'math') {
    world.buildNetRig(a.nets.nets[a.netId], a.cube.facelets());
    world.setUnfold(a.unfold);
    world.frameNet(a.unfold);
  }
  if (mode === 'tutorial' && !a.tutorial.steps.length && !a.cube.isSolved()) buildTutorial();
  world.setHighlight([]);
  a.selectedPart = null;
  renderRight();
  enterPanel(mode);
  audio.tick(mode === 'math' ? 1046 : 784);
}

function setOrder(n) {
  if (a.n === n) return;
  clearQueue();
  a.n = n;
  a.cube = new CubeModel(n);
  a.history = []; a.scramble = []; a.challenge = null;
  a.timer = { running: false, start: 0, elapsed: 0 };
  invalidateTutorialSilent();
  a.selectedPart = null;
  world.buildCube(a.cube);
  if (a.mode === 'math') { world.buildNetRig(a.nets.nets[a.netId], a.cube.facelets()); world.setUnfold(a.unfold); }
  $$('#orderSwitch button').forEach((b) => b.classList.toggle('active', Number(b.dataset.n) === n));
  syncVisuals();
  updateHud(true); renderRight();
  audio.chime(n === 2 ? 659 : 523, [0, 7], 0.3);
  toast(`已切换到 ${n} 阶魔方`, 'ok');
}

// --------------------------------------------------------------------- UI
function setOpt(key, val) {
  world.opts[key] = val;
  if (key === 'particles') world.setParticleCount(val);
  else if (key === 'radius') world.setRadius(val);
  else if (key === 'quality') world.setQuality(val);
  else world.applyMaterialOpts();
  if (key === 'gap' || key === 'explode') world.syncTransforms();
  if (key === 'palette' && a.mode === 'math') world.syncNet(a.cube.facelets());
}

function bindRange(id, key, fmt, after) {
  const el = $(id);
  const lab = $(id.replace('#r', '#v'));
  const upd = () => {
    const v = Number(el.value);
    setOpt(key, v);
    if (lab) lab.textContent = fmt(v);
    if (after) after(v);
  };
  el.addEventListener('input', upd);
  upd();
}

function bindToggle(id, key, after) {
  const el = $(id);
  el.addEventListener('click', () => {
    const on = !el.classList.contains('on');
    el.classList.toggle('on', on);
    el.setAttribute('aria-pressed', String(on));
    if (key) setOpt(key, on);
    if (after) after(on);
    audio.tick(on ? 988 : 622, 0.06);
  });
}

function renderRight() {
  const host = $('#rightScroll');
  const scroll = host.scrollTop;
  const panel = $(`.panel[data-panel="${a.mode}"]`);
  if (!panel) return;
  if (a.mode === 'play') panel.innerHTML = renderPlay(a);
  else if (a.mode === 'tutorial') { panel.innerHTML = renderTutorial(a); panel.dataset.sig = String(a.tutorial.steps.length); }
  else if (a.mode === 'mechanism') panel.innerHTML = renderMechanism(a);
  else panel.innerHTML = renderMath(a);
  host.scrollTop = scroll;
  if (a.mode === 'math') {
    const r = $('#rUnfold');
    if (r) r.addEventListener('input', () => {
      a.unfold = Number(r.value);
      world.setUnfold(a.unfold);
      world.frameNet(a.unfold);
      const l = $('#vUnfold'); if (l) l.textContent = a.unfold.toFixed(2);
    });
  }
  if (a.mode === 'tutorial') {
    const s = $('#tScrub');
    if (s) {
      s.addEventListener('input', () => {
        const el = $('#tProgress');
        if (el) el.textContent = `跳到第 ${s.value} / ${a.tutorial.steps.length} 步`;
      });
      s.addEventListener('change', () => tutorialApply(Number(s.value)));
    }
  }
}

// Incremental step update: rebuilding the whole panel each step re-triggered
// entrance animations and read as flicker during playback.
function patchTutorial() {
  const t = a.tutorial;
  const panel = $('#panelTutorial');
  if (!t.steps.length || !panel.querySelector('.step-card') || panel.dataset.sig !== String(t.steps.length)) { renderRight(); return; }
  const steps = t.annotated;
  const cur = steps[Math.min(t.index, steps.length - 1)];
  const si = stageInfo(cur.stage, a.n);
  const set = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
  set('stepNot', cur.name);
  set('stepCn', cur.cn);
  set('stepMeta', `${cur.macro || '单步'} · 第 ${t.index + 1}/${steps.length} 步`);
  const why = document.getElementById('stepWhy');
  if (why) why.innerHTML = `<b style="color:${si.color}">${si.name}</b> · ${si.goal}`;
  set('stepMeaning', cur.meaning);
  const mini = (fl) => netSVG(a.nets.nets[a.classicId], fl, a.n, a.palette, { unit: 7, pad: 3, width: 86 });
  const mb = document.getElementById('miniBefore'); if (mb) mb.innerHTML = mini(cur.before);
  const ma = document.getElementById('miniAfter'); if (ma) ma.innerHTML = mini(cur.after);
  set('stepScore', `正确贴纸 ${cur.beforeScore} → ${cur.afterScore} / ${cur.total}${cur.gained ? ` （${cur.gained > 0 ? '+' : ''}${cur.gained}）` : ''}`);
  const pb = document.getElementById('playBtn');
  if (pb) { pb.classList.toggle('playing', t.playing); pb.textContent = t.playing ? '⏸ 暂停' : '▶ 播放'; }
  const sc = document.getElementById('tScrub');
  if (sc && document.activeElement !== sc) sc.value = t.index;
  set('tProgress', `进度 ${Math.round((t.index / steps.length) * 100)}% · 播放速度 ${t.speed.toFixed(2)}×`);
  const ids = a.n === 3 ? [0, 1, 2, 3, 4, 5, 6] : [...new Set(t.steps.map((s) => s.stage))];
  panel.querySelectorAll('[data-act="jump-stage"]').forEach((btn) => {
    const id = Number(btn.dataset.stage);
    const first = t.steps.findIndex((s) => s.stage === id);
    const last = t.steps.map((s) => s.stage).lastIndexOf(id);
    let done;
    if (last >= 0) done = t.index > last;
    else {
      const next = ids.slice(ids.indexOf(id) + 1).map((n) => t.steps.findIndex((s) => s.stage === n)).find((i) => i >= 0);
      done = next === undefined ? t.index >= t.steps.length : t.index >= next;
    }
    btn.classList.toggle('done', done);
    btn.classList.toggle('active', id === cur.stage && first >= 0);
  });
}

function enterPanel(mode) {
  const p = $(`.panel[data-panel="${mode}"]`);
  if (!p) return;
  p.classList.add('enter');
  setTimeout(() => p.classList.remove('enter'), 750);
}

function updateHud(force) {
  const now = performance.now();
  if (!force && now - lastHud < 120) return;
  lastHud = now;
  const total = a.n === 2 ? 24 : 54;
  const score = a.cube.solvedCount();
  const pct = Math.round((score / total) * 100);
  const solved = a.cube.isSolved();
  const chip = $('#statusChip');
  chip.classList.toggle('scrambled', !solved && !a.tutorial.playing);
  chip.classList.toggle('solving', a.tutorial.playing || a.orderDemo.running);
  chip.querySelector('span').textContent = solved ? '已复原' : a.tutorial.playing ? '教程演示中' : a.orderDemo.running ? '循环演示中' : '打乱中';
  $('#scrambleChip').textContent = a.scramble.length ? algToString(a.scramble) : '尚未打乱 · Space 生成';
  const el = a.timer.running ? now - a.timer.start : a.timer.elapsed;
  const mm = String(Math.floor(el / 60000)).padStart(2, '0');
  const ss = String(Math.floor(el / 1000) % 60).padStart(2, '0');
  const cs = String(Math.floor(el / 100) % 10);
  $('#timerChip').textContent = `${mm}:${ss}.${cs}`;
  $('#ringPct').textContent = pct + '%';
  $('.progress-ring .fg').style.strokeDashoffset = String(113 * (1 - pct / 100));
  $('#moveCount').textContent = `${a.history.length} 步`;
  const hist = $('#history');
  const want = a.history.slice(-60);
  const hkey = want.join(',');
  if (hist.dataset.key !== hkey) {
    hist.dataset.key = hkey;
    hist.innerHTML = want.length
      ? want.map((m, i) => `<button class="hchip ${i === want.length - 1 ? 'last' : ''}" data-h="${a.history.length - want.length + i}" title="点击撤销到此步之前">${MOVES[m].name}</button>`).join('')
      : '<span class="hchip empty">动作历史会显示在这里</span>';
    hist.scrollLeft = hist.scrollWidth;
  }
}

// ------------------------------------------------------------------ labels
function updateLabels() {
  const host = $('#labels');
  if (a.mode !== 'mechanism' || !a.selectedPart) { if (host.childElementCount) host.innerHTML = ''; return; }
  const want = [];
  const push = (pos, text) => {
    const p = world.project(new THREE.Vector3(...pos));
    if (p.visible) want.push({ x: p.x, y: p.y, text });
  };
  const sp = world.spacing * (1 + world.opts.gap) + world.opts.explode * 1.9;
  if (a.selectedPart === 'center' && a.n === 3) {
    for (let f = 0; f < 6; f++) push(FACE_NORMAL[f].map((v) => v * sp), `${['上', '下', '右', '左', '前', '后'][f]}中心`);
  } else if (a.selectedPart === 'corner') {
    for (const c of a.cube.cubies.filter((x) => x.type === 'corner').slice(0, 4)) push(c.pos.map((v) => v * sp), '角块 · 3 贴纸');
  } else if (a.selectedPart === 'edge' && a.n === 3) {
    for (const c of a.cube.cubies.filter((x) => x.type === 'edge').slice(0, 4)) push(c.pos.map((v) => v * sp), '棱块 · 2 贴纸');
  } else if (a.selectedPart === 'core') {
    push([0, 0, 0], a.n === 3 ? '六臂中心轴' : '球核');
  } else if (a.selectedPart === 'screw' && a.n === 3) {
    for (let f = 0; f < 6; f += 2) push(FACE_NORMAL[f].map((v) => v * sp * 1.05), '螺丝 + 弹簧');
  } else if (a.selectedPart === 'foot') {
    for (const c of a.cube.cubies.slice(0, 3)) push(c.pos.map((v) => v * sp * 0.7), '卡脚');
  }
  if (host.childElementCount !== want.length) host.innerHTML = want.map(() => '<div class="lab"></div>').join('');
  [...host.children].forEach((el, i) => {
    const w = want[i];
    el.style.left = w.x + 'px'; el.style.top = w.y + 'px'; el.textContent = w.text;
  });
}

// ------------------------------------------------------------------- input
function screenDir(worldVec, origin) {
  const p0 = world.project(origin);
  const p1 = world.project(origin.clone().add(worldVec));
  return new THREE.Vector2(p1.x - p0.x, p1.y - p0.y);
}

function gestureToMove(hit, dx, dy) {
  const obj = hit.object;
  const q = new THREE.Quaternion();
  obj.getWorldQuaternion(q);
  const n = new THREE.Vector3(0, 0, 1).applyQuaternion(q);
  n.set(Math.round(n.x), Math.round(n.y), Math.round(n.z));
  if (obj.userData.cubie) {
    const cubie = obj.userData.cubie;
    const axes = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)];
    const tangents = axes.filter((v) => Math.abs(v.dot(n)) < 0.5);
    const drag = new THREE.Vector2(dx, dy).normalize();
    let best = null, bestScore = -1;
    for (const t of tangents) {
      const s = screenDir(t.clone().multiplyScalar(0.6), hit.point);
      if (s.lengthSq() < 1e-6) continue;
      s.normalize();
      const d = s.dot(drag);
      if (Math.abs(d) > bestScore) { bestScore = Math.abs(d); best = { t, sign: Math.sign(d) }; }
    }
    if (!best || bestScore < 0.35) return -1;
    const t = best.t.clone().multiplyScalar(best.sign);
    const axisV = new THREE.Vector3().crossVectors(n, t);
    axisV.set(Math.round(axisV.x), Math.round(axisV.y), Math.round(axisV.z));
    const ax = [axisV.x, axisV.y, axisV.z].findIndex((v) => v !== 0);
    if (ax < 0) return -1;
    const dirA = axisV.getComponent(ax);
    const layerCoord = cubie.pos[ax];
    for (const m of MOVES) {
      if (m.whole || m.axis !== ax || m.q === 2) continue;
      if (!m.layer(cubie.pos)) continue;
      const want = m.q === 1 ? -dirA : dirA;
      if (m.dir === want) return m.idx;
    }
    return -1;
  }
  // net tile: rotate its own face
  const f = obj.userData.face;
  if (f === undefined) return -1;
  const drag = new THREE.Vector2(dx, dy);
  const sign = drag.x + drag.y > 0 ? 1 : -1;
  return f * 3 + (sign > 0 ? 0 : 2);
}

function onPointerDown(e) {
  if (e.button === 2) return;
  a.idleSpin = false;
  audio.ensure();
  const hit = world.pick(e.clientX, e.clientY);
  if (!hit) { gesture = null; return; }
  gesture = { x: e.clientX, y: e.clientY, hit, consumed: false, id: e.pointerId };
  world.controls.enabled = false;
  try { e.target.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
}

function onPointerMove(e) {
  if (!gesture || gesture.id !== e.pointerId || gesture.consumed) return;
  const dx = e.clientX - gesture.x, dy = e.clientY - gesture.y;
  if (Math.hypot(dx, dy) > 9) {
    gesture.consumed = true;
    const idx = gestureToMove(gesture.hit, dx, dy);
    if (idx >= 0) userMove(idx);
  }
}

function onPointerUp(e) {
  if (!gesture || gesture.id !== e.pointerId) return;
  const g = gesture;
  gesture = null;
  world.controls.enabled = true;
  if (g.consumed) return;
  const obj = g.hit.object;
  if (a.mode === 'mechanism' && obj.userData.cubie) {
    selectPart(obj.userData.cubie.type);
    return;
  }
  const f = obj.userData.face;
  if (f !== undefined) {
    const idx = f * 3 + (e.shiftKey ? 2 : 0);
    userMove(idx);
  }
}

function onWheel(e) {
  if (e.shiftKey) { e.preventDefault(); e.stopPropagation(); world.orbitBy(-e.deltaY * 0.0022, 0); }
  else if (e.altKey) { e.preventDefault(); e.stopPropagation(); world.orbitBy(0, -e.deltaY * 0.0022); }
  else if (Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.4 && Math.abs(e.deltaX) > 2) {
    e.preventDefault(); e.stopPropagation(); world.orbitBy(-e.deltaX * 0.0026, 0);
  }
}

const KEY_FACE = { u: 0, d: 1, r: 2, l: 3, f: 4, b: 5, m: 6, e: 7, s: 8, x: 9, y: 10, z: 11 };
function onKeyDown(e) {
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'select' || tag === 'textarea') {
    if (e.key === 'Escape') e.target.blur();
    return;
  }
  a.idleSpin = false;
  audio.ensure();
  const k = e.key;
  if (k === 'Escape') { $('#helpModal').hidden = true; return; }
  if (k.toLowerCase() === 'h') { toggleHelp(); e.preventDefault(); return; }
  if (k.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) { toggleSound(); e.preventDefault(); return; }
  if (e.ctrlKey || e.metaKey) {
    if (['1', '2', '3', '4'].includes(k)) {
      e.preventDefault();
      setMode(['play', 'tutorial', 'mechanism', 'math'][Number(k) - 1]);
    }
    if (k.toLowerCase() === 'z') { e.preventDefault(); doUndo(); }
    return;
  }
  const lower = k.toLowerCase();
  if (KEY_FACE[lower] !== undefined) {
    e.preventDefault();
    const kind = KEY_FACE[lower];
    const q = e.shiftKey ? 3 : 1;
    userMove(kind * 3 + (q - 1));
    return;
  }
  switch (k) {
    case ' ': e.preventDefault(); doScramble(); break;
    case 'Enter': e.preventDefault(); if (a.mode !== 'tutorial') setMode('tutorial'); else tutorialPlay(); break;
    case 'Backspace': e.preventDefault(); doUndo(); break;
    case '0': doReset(); break;
    case '2': setOrder(2); break;
    case '3': setOrder(3); break;
    case 'ArrowLeft': e.preventDefault(); world.orbitBy(-0.09, 0); break;
    case 'ArrowRight': e.preventDefault(); world.orbitBy(0.09, 0); break;
    case 'ArrowUp': e.preventDefault(); world.orbitBy(0, -0.07); break;
    case 'ArrowDown': e.preventDefault(); world.orbitBy(0, 0.07); break;
    case '+': case '=': world.setDistance(Math.max(4.2, world.camera.position.length() - 0.6)); syncDist(); break;
    case '-': case '_': world.setDistance(Math.min(20, world.camera.position.length() + 0.6)); syncDist(); break;
    default: break;
  }
}

function syncDist() {
  const d = world.camera.position.distanceTo(world.controls.target);
  $('#rDist').value = d.toFixed(1);
  $('#vDist').textContent = d.toFixed(1);
}

function selectPart(id) {
  a.selectedPart = a.selectedPart === id ? null : id;
  if (a.selectedPart) {
    const ids = a.cube.cubies.filter((c) => c.type === id || (id === 'foot' && true) || (id === 'core' && false)).map((c) => c.id);
    world.setHighlight(id === 'core' || id === 'screw' ? [] : ids);
    if (world.opts.xray < 0.5) {
      setOpt('xray', 0.6); $('#rXray').value = 0.6; $('#vXray').textContent = '0.60';
    }
    audio.tick(1174, 0.07);
  } else world.setHighlight([]);
  renderRight();
}

function toggleHelp() {
  const m = $('#helpModal');
  m.hidden = !m.hidden;
  if (!m.hidden) $('#helpGrid').innerHTML = renderHelp();
}

function toggleSound() {
  const on = !audio.enabled;
  audio.ensure();
  audio.setEnabled(on);
  const b = $('#soundBtn');
  b.classList.toggle('on', on);
  b.setAttribute('aria-pressed', String(on));
  if (on) audio.tick(1046, 0.09);
  toast(on ? '声音已开启' : '声音已静音', on ? 'ok' : '');
}

// ------------------------------------------------------------------ actions
function onAction(act, el, ev) {
  switch (act) {
    case 'challenge': doScramble(); break;
    case 'copy-scramble': copyScramble(); break;
    case 'build-tutorial': buildTutorial(); break;
    case 'rewind': doRewind(); break;
    case 't-prev': tutorialApply(Math.max(0, a.tutorial.index - 1)); break;
    case 't-next': tutorialApply(Math.min(a.tutorial.steps.length, a.tutorial.index + 1)); break;
    case 't-play': tutorialPlay(); break;
    case 't-reset': a.tutorial.playing = false; tutorialApply(0); break;
    case 't-faster': a.tutorial.speed = Math.min(6, a.tutorial.speed * 1.35); patchTutorial(); break;
    case 't-slower': a.tutorial.speed = Math.max(0.2, a.tutorial.speed / 1.35); patchTutorial(); break;
    case 't-apply': {
      const t = a.tutorial;
      a.programmatic = true;
      enqueueSeq(t.steps.slice(t.index).map((s) => s.move), {
        dur: Math.max(0.05, 0.12 / world.opts.speed), record: false,
        done: () => { t.index = t.steps.length; t.playing = false; a.programmatic = false; patchTutorial(); updateHud(true); },
      });
      t.index = t.steps.length; patchTutorial();
      break;
    }
    case 'jump-stage': {
      const id = Number(el.dataset.stage);
      const idx = a.tutorial.steps.findIndex((s) => s.stage === id);
      if (idx >= 0) tutorialApply(idx);
      break;
    }
    case 'part': selectPart(el.dataset.part); break;
    case 'cut-half': setCut(true, 0); break;
    case 'cut-quarter': setCut(true, 0.8); break;
    case 'cut-off': setCut(false, 0); break;
    case 'explode-full':
      setOpt('explode', 1); $('#rExplode').value = 1; $('#vExplode').textContent = '1.00';
      setOpt('xray', 0.35); $('#rXray').value = 0.35; $('#vXray').textContent = '0.35';
      break;
    case 'net': {
      a.netId = Number(el.dataset.net);
      world.buildNetRig(a.nets.nets[a.netId], a.cube.facelets());
      world.setUnfold(a.unfold);
      world.frameNet(a.unfold);
      audio.tick(880, 0.06);
      renderRight();
      break;
    }
    case 'unfold-play': unfoldAnim = { from: a.unfold, to: 1, t: 0, dur: 2.4 }; break;
    case 'unfold-fold': unfoldAnim = { from: a.unfold, to: 0, t: 0, dur: 1.6 }; break;
    case 'order-preset': calcOrder(el.dataset.alg); break;
    case 'order-calc': calcOrder($('#orderInput').value); break;
    case 'order-run': {
      const od = a.orderDemo;
      if (od.order <= 0) { toast('先计算阶', 'warn'); break; }
      const totalMoves = od.order * od.seqLen;
      if (totalMoves > 400) {
        const seq = parseAlg(od.alg);
        a.cube.reset();
        for (let i = 0; i < od.order; i++) a.cube.applySeq(seq, false);
        a.history = [];
        od.count = od.order; od.running = false;
        syncVisuals(); celebrate = 1; audio.solved();
        toast(`阶 ${od.order}：共 ${totalMoves} 步，已瞬时验证回到原状 ✓`, 'ok');
        renderRight(); updateHud(true);
        break;
      }
      od.running = !od.running;
      if (od.running) { od.count = 0; a.cube.reset(); a.history = []; syncVisuals(); a.programmatic = true; }
      renderRight();
      break;
    }
    case 'order-reset': a.orderDemo.running = false; a.orderDemo.count = 0; doReset(); break;
    case 'demo-sexy': calcOrder("R U R' U'"); a.orderDemo.running = true; a.cube.reset(); a.history = []; syncVisuals(); renderRight(); break;
    case 'demo-conj': {
      const seq = parseAlg("U R U' R' U' F' U F");
      a.programmatic = true;
      enqueueSeq(seq, { dur: baseDuration(), record: false, done: () => { a.programmatic = false; toast('共轭演示：同一插入手法被搬到另一个槽位', 'ok'); } });
      break;
    }
    default: break;
  }
}

function setCut(on, pos) {
  setOpt('cutOn', on);
  setOpt('cut', pos);
  world.clipPlane.constant = pos;
  $('#tCut').classList.toggle('on', on);
  $('#tCut').setAttribute('aria-pressed', String(on));
  $('#rCut').value = pos;
  $('#vCut').textContent = pos.toFixed(2);
}

function copyScramble() {
  const text = a.scramble.length ? algToString(a.scramble) : '(尚未打乱)';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => toast('已复制：' + text, 'ok'), () => fallbackCopy(text));
  } else fallbackCopy(text);
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); toast('已复制：' + text, 'ok'); } catch (e) { toast('复制失败，请手动选择', 'warn'); }
  ta.remove();
}

// -------------------------------------------------------------------- init
function init() {
  world.buildCube(a.cube);
  world.setMode('play');

  const palSel = $('#sPalette');
  palSel.innerHTML = Object.entries(PALETTES).map(([k, v]) => `<option value="${k}">${v.name}</option>`).join('');
  palSel.value = a.palette;
  palSel.addEventListener('change', () => {
    a.palette = palSel.value;
    setOpt('palette', a.palette);
    renderRight();
    audio.tick(784, 0.06);
  });

  bindRange('#rSpeed', 'speed', (v) => v.toFixed(2) + '×');
  bindRange('#rGap', 'gap', (v) => v.toFixed(2));
  bindRange('#rExplode', 'explode', (v) => v.toFixed(2));
  bindRange('#rXray', 'xray', (v) => v.toFixed(2));
  bindRange('#rLight', 'light', (v) => v.toFixed(2));
  bindRange('#rLightAngle', 'lightAngle', (v) => Math.round(v * 180 / Math.PI) + '°');
  bindRange('#rBloom', 'bloom', (v) => v.toFixed(2));
  bindRange('#rGlow', 'glow', (v) => v.toFixed(2));
  bindRange('#rFog', 'fog', (v) => v.toFixed(3));
  bindRange('#rParticles', 'particles', (v) => String(Math.round(v)));
  bindRange('#rRadius', 'radius', (v) => v.toFixed(2));
  $('#rTurnGap').addEventListener('input', (e) => {
    a.turnGap = Number(e.target.value);
    $('#vGap2').textContent = a.turnGap + ' ms';
  });
  $('#sEasing').addEventListener('change', (e) => { world.opts.easing = e.target.value; audio.tick(659, 0.05); });
  $('#sQuality').addEventListener('change', (e) => { setOpt('quality', e.target.value); toast('渲染质量：' + e.target.selectedOptions[0].text); });

  const dist = $('#rDist');
  dist.addEventListener('input', () => {
    world.setDistance(Number(dist.value));
    $('#vDist').textContent = Number(dist.value).toFixed(1);
  });
  world.controls.addEventListener('change', syncDist);
  syncDist();

  bindToggle('#tCut', null, (on) => { world.opts.cutOn = on; world.applyMaterialOpts(); });
  $('#rCut').addEventListener('input', (e) => {
    const v = Number(e.target.value);
    world.opts.cut = v; world.clipPlane.constant = v;
    $('#vCut').textContent = v.toFixed(2);
  });
  bindToggle('#tAuto', 'autoRotate');
  bindToggle('#tWire', 'wireframe');
  bindToggle('#tGrid', 'grid');
  bindToggle('#tAmbient', null, (on) => { audio.ensure(); audio.setAmbient(on); });

  $('#btnScramble').addEventListener('click', doScramble);
  $('#btnRewind').addEventListener('click', doRewind);
  $('#btnTeach').addEventListener('click', () => { setMode('tutorial'); if (!a.tutorial.steps.length) buildTutorial(); else tutorialPlay(); });
  $('#btnReset').addEventListener('click', doReset);
  $('#btnUndo').addEventListener('click', doUndo);
  $('#undoBtn').addEventListener('click', doUndo);
  $('#btnRandomPal').addEventListener('click', () => {
    const keys = Object.keys(PALETTES);
    let k = keys[Math.floor(Math.random() * keys.length)];
    if (k === a.palette) k = keys[(keys.indexOf(k) + 1) % keys.length];
    a.palette = k; palSel.value = k; setOpt('palette', k); renderRight();
    toast('配色：' + PALETTES[k].name);
  });
  $('#btnPng').addEventListener('click', () => {
    download(`rubik-${a.n}x${a.n}-${Date.now()}.png`, world.snapshot());
    toast('已保存当前视角 PNG', 'ok');
  });
  $('#btnJson').addEventListener('click', () => {
    const data = { n: a.n, facelets: a.cube.facelets(), history: algToString(a.history), scramble: algToString(a.scramble), solved: a.cube.isSolved() };
    download(`rubik-state-${Date.now()}.json`, 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)));
    toast('已导出状态 JSON', 'ok');
  });
  $('#btnCopyScramble').addEventListener('click', copyScramble);

  $$('.mode').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  $$('#orderSwitch button').forEach((b) => b.addEventListener('click', () => setOrder(Number(b.dataset.n))));
  $('#soundBtn').addEventListener('click', toggleSound);
  $('#helpBtn').addEventListener('click', toggleHelp);
  $('#helpClose').addEventListener('click', () => { $('#helpModal').hidden = true; });
  $('#helpModal').addEventListener('click', (e) => { if (e.target.id === 'helpModal') $('#helpModal').hidden = true; });

  $('#camPresets').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cam]');
    if (!b) return;
    $$('#camPresets .chip-btn').forEach((x) => x.classList.toggle('active', x === b));
    world.frameCamera(b.dataset.cam);
    syncDist();
    audio.tick(587, 0.05);
  });

  $('#algRun').addEventListener('click', runAlgInput);
  $('#algInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') runAlgInput(); });

  $('#rightDock').addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (el) { onAction(el.dataset.act, el, e); return; }
    const nl = e.target.closest('.nlf');
    if (nl && a.mode === 'math') {
      const f = Number(nl.dataset.face);
      userMove(f * 3 + (e.shiftKey ? 2 : 0));
    }
  });

  $('#history').addEventListener('click', (e) => {
    const b = e.target.closest('[data-h]');
    if (!b) return;
    const target = Number(b.dataset.h);
    const seq = invertSeq(a.history.slice(target));
    if (!seq.length) return;
    a.programmatic = true;
    invalidateTutorialSilent();
    enqueueSeq(seq, {
      dur: Math.max(0.05, 0.1 / world.opts.speed), record: false,
      done: () => { a.history = a.history.slice(0, target); a.programmatic = false; updateHud(true); renderRight(); },
    });
  });

  const canvas = $('#gl');
  // pointer capture can throw for pointers that are no longer active
  const cap = canvas.setPointerCapture.bind(canvas);
  const rel = canvas.releasePointerCapture.bind(canvas);
  canvas.setPointerCapture = (id) => { try { cap(id); } catch (err) { /* inactive pointer */ } };
  canvas.releasePointerCapture = (id) => { try { rel(id); } catch (err) { /* inactive pointer */ } };
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false, capture: true });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('pointerdown', () => audio.ensure(), { once: true });

  const ro = new ResizeObserver(() => {
    const r = $('#stage').getBoundingClientRect();
    world.resize(r.width, r.height);
  });
  ro.observe($('#stage'));
  const r0 = $('#stage').getBoundingClientRect();
  world.resize(r0.width, r0.height);

  renderRight();
  enterPanel('play');
  updateHud(true);
  window.__rubik = { a, world, THREE };
  requestAnimationFrame(loop);
  setTimeout(() => {
    $('#loader').classList.add('hide');
    toast('欢迎来到魔方实验室 · 按 H 查看操作', 'ok');
  }, 420);
}

function runAlgInput() {
  const input = $('#algInput');
  const text = input.value.trim();
  if (!text) return;
  let seq;
  try { seq = parseAlg(text); } catch (err) { toast('公式非法：' + err.message, 'bad'); audio.error(); return; }
  const bad = seq.find((m) => MOVES[m].slice && a.n === 2);
  if (bad !== undefined) { toast('2 阶不支持夹层动作', 'warn'); return; }
  a.programmatic = false;
  invalidateTutorial('手动公式使教程失效');
  enqueueSeq(seq, { dur: baseDuration() });
  input.value = '';
  flashNotation(text.length > 12 ? text.slice(0, 12) + '…' : text);
}

// -------------------------------------------------------------------- loop
let prev = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.12, (now - prev) / 1000);
  prev = now;
  world.update(dt);
  if (a.idleSpin && !gesture && !world.busy && a.mode !== 'math') {
    world.orbitBy(dt * 0.055, Math.sin(now * 0.00013) * 0.00035);
  }
  tutorialTick(dt);
  orderTick(dt);
  if (unfoldAnim) {
    unfoldAnim.t += dt / unfoldAnim.dur;
    const t = Math.min(1, unfoldAnim.t);
    const e = t * t * (3 - 2 * t);
    a.unfold = unfoldAnim.from + (unfoldAnim.to - unfoldAnim.from) * e;
    world.setUnfold(a.unfold);
    world.frameNet(a.unfold);
    const r = $('#rUnfold'); if (r) r.value = a.unfold;
    const l = $('#vUnfold'); if (l) l.textContent = a.unfold.toFixed(2);
    if (t >= 1) { unfoldAnim = null; renderRight(); }
  }
  if (celebrate > 0) {
    celebrate = Math.max(0, celebrate - dt * 0.7);
    world.bloomPass.strength = world.opts.bloom + celebrate * 1.5;
    world.key.intensity = 30 * world.opts.light * (1 + celebrate * 0.6);
    if (celebrate === 0) world.applyMaterialOpts();
  }
  updateLabels();
  updateHud(false);
  world.render();
}

init();