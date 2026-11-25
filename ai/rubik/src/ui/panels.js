import { MOVES, FACE_NAMES } from '../core/model.js';
import { STAGES3 } from '../core/solver3.js';
import { SOLVER2_INFO } from '../core/solver2.js';
import { netFacelets, NET_INFO } from '../core/nets.js';
import {
  FACE_CN, COLOR_CN, pieceLabel, moveCN, stageInfo, invariants, stateSpace,
  permCycles, lcm, ORDER_PRESETS,
} from '../core/insight.js';
import { PALETTES } from '../three/world.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function netSVG(net, facelets, N, palette, opts = {}) {
  const cells = netFacelets(net, N);
  const xs = cells.map((c) => c.gx), ys = cells.map((c) => c.gy);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const unit = opts.unit || 15;
  const pad = opts.pad ?? 4;
  const w = (maxX - minX + 1) * unit + pad * 2;
  const h = (maxY - minY + 1) * unit + pad * 2;
  const cols = PALETTES[palette].colors;
  let rects = '';
  for (const c of cells) {
    const col = cols[facelets[c.face][c.row * N + c.col]];
    const x = pad + (c.gx - minX) * unit, y = pad + (maxY - c.gy) * unit;
    const correct = facelets[c.face][c.row * N + c.col] === c.face;
    rects += `<rect x="${x + 0.7}" y="${y + 0.7}" width="${unit - 1.4}" height="${unit - 1.4}" rx="${unit * 0.18}" fill="${col}" opacity="${correct ? 1 : 0.92}" data-face="${c.face}" data-row="${c.row}" data-col="${c.col}" class="nlf${opts.interactive ? ' pick' : ''}"/>`;
  }
  let labels = '';
  if (opts.labels) {
    for (const c of net.cells) {
      const cx = pad + (c.x * N + (N - 1) / 2 - minX) * unit + unit / 2;
      const cy = pad + (maxY - (c.y * N + (N - 1) / 2)) * unit + unit / 2;
      labels += `<text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" font-size="${unit * 0.62}" font-family="JetBrains Mono, monospace" fill="rgba(0,0,0,.42)" font-weight="700">${FACE_NAMES[c.face]}</text>`;
    }
  }
  return `<svg viewBox="0 0 ${w} ${h}" width="${opts.width || w}" xmlns="http://www.w3.org/2000/svg">${rects}${labels}</svg>`;
}

export function netThumb(net, N, palette) {
  const cols = PALETTES[palette].colors;
  const xs = net.cells.map((c) => c.x), ys = net.cells.map((c) => c.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const u = 10;
  const w = (maxX - minX + 1) * u + 2, h = (maxY - minY + 1) * u + 2;
  let r = '';
  for (const c of net.cells) {
    r += `<rect x="${1 + (c.x - minX) * u}" y="${1 + (maxY - c.y) * u}" width="${u - 1.6}" height="${u - 1.6}" rx="2" fill="${cols[c.face]}" opacity=".9"/>`;
  }
  return `<svg viewBox="0 0 ${w} ${h}">${r}</svg>`;
}

function kv(k, v, cls = '') { return `<div class="kv"><span>${k}</span><b class="${cls}">${v}</b></div>`; }
function card(title, tag, body, cls = '') {
  return `<section class="card ${cls}"><h4><i class="dot" style="--c:var(--cyan)"></i>${title}${tag ? `<span class="tag">${tag}</span>` : ''}</h4>${body}</section>`;
}

// --------------------------------------------------------------------- PLAY
export function renderPlay(a) {
  const total = a.n === 2 ? 24 : 54;
  const score = a.cube.solvedCount();
  const pct = Math.round((score / total) * 100);
  const solved = a.cube.isSolved();
  const inv = invariants(a.cube.toFast(), a.n);
  const sp = stateSpace(a.n);
  const recent = a.history.slice(-6).reverse();
  const challenge = a.challenge;
  return [
    card('实时状态', 'LIVE', `
      <div class="stat-grid">
        <div class="stat"><i>复原度</i><b style="color:${pct === 100 ? 'var(--acid)' : 'var(--cyan)'}">${pct}%</b></div>
        <div class="stat"><i>已走步数</i><b>${a.history.length}</b></div>
        <div class="stat"><i>正确贴纸</i><b>${score}/${total}</b></div>
        <div class="stat"><i>打乱长度</i><b>${a.scramble.length}</b></div>
      </div>
      <div style="margin-top:9px">
        ${kv('当前状态', solved ? '已复原 ✓' : '打乱中', solved ? 'ok' : 'warn')}
        ${kv('角块扭转和 mod 3', inv.twistMod, inv.twistMod === 0 ? 'ok' : 'bad')}
        ${kv('棱块翻转和 mod 2', a.n === 3 ? inv.flipMod : '—', a.n !== 3 || inv.flipMod === 0 ? 'ok' : 'bad')}
        ${kv('置换奇偶匹配', inv.parityMatch ? '一致 ✓' : '不一致', inv.parityMatch ? 'ok' : 'bad')}
      </div>`),
    card('挑战', 'CHALLENGE', `
      <p class="sub">${challenge ? `目标：用不超过 <b style="color:var(--warm)">${challenge.target}</b> 步还原这个打乱。当前已用 ${a.history.length - a.scramble.length} 步。` : '生成一个随机打乱，试着在限定步数内还原。'}</p>
      <div class="btn-grid two" style="margin-top:9px">
        <button class="btn ghost" data-act="challenge">新挑战</button>
        <button class="btn ghost" data-act="copy-scramble">复制公式</button>
      </div>`),
    card('操作速查', 'INPUT', `
      <div class="help-col"><ul>
        <li><kbd>拖拽空白</kbd>旋转视角</li>
        <li><kbd>表面滑动</kbd>转动该层</li>
        <li><kbd>滚轮</kbd>缩放 · <kbd>Shift+滚轮</kbd>水平环绕</li>
        <li><kbd>U D L R F B</kbd>转层 · <kbd>Shift</kbd>反向</li>
        <li><kbd>M E S</kbd>夹层 · <kbd>X Y Z</kbd>整体旋转</li>
        <li><kbd>方向键</kbd>转视角 · <kbd>Space</kbd>打乱</li>
      </ul></div>`),
    card('最近动作', 'HISTORY', recent.length
      ? recent.map((m) => `<div class="kv"><span>${MOVES[m].name}</span><b>${moveCN(m)}</b></div>`).join('')
      : '<p class="sub">还没有动作。按 Space 生成一个随机魔方。</p>'),
    card('这个魔方有多少种状态？', 'GROUP', `
      <div class="big-num violet">${sp.pretty}</div>
      <p class="sub" style="margin-top:6px">= ${sp.formula}。上帝之数 ${sp.god} 步（HTM）：任何状态都能在 ${sp.god} 步内复原。</p>`),
  ].join('');
}

// ----------------------------------------------------------------- TUTORIAL
export function renderTutorial(a) {
  const t = a.tutorial;
  if (a.building) {
    return card('正在生成最优解表', 'BFS', `
      <p class="sub">2 阶魔方群共 ${SOLVER2_INFO.states.toLocaleString()} 个状态，正在做完整广度优先搜索…</p>
      <div class="scrub"><input type="range" min="0" max="100" value="${Math.round((a.buildProgress || 0) * 100)}" disabled></div>
      <div class="step-count">${Math.round((a.buildProgress || 0) * 100)}% · 已展开最深层 ${a.buildDepth || 0}</div>`);
  }
  if (!t.steps.length) {
    return [
      card('教程求解', 'TUTOR', `
        <p>${a.n === 3
          ? '用<b>层先法（Beginner Method）</b>把魔方一步步还原：底层十字 → 底层角块 → 中层棱块 → 顶层十字 → 顶面朝向 → 顶层角位置 → 顶层棱位置。每一步都会告诉你它在做什么、为什么这么做。'
          : '2 阶用<b>完整 BFS 最优解</b>：3,674,160 个状态全部展开，给出的每一步都在最短路径上。'}</p>
        <p class="sub">先打乱（Space），再生成教程。求解器会读取当前真实状态，任何合法状态都能解。</p>
        <button class="btn accent wide" data-act="build-tutorial">生成教程解法</button>`),
      card('为什么可以「自动还原」？', 'THEORY', `
        <p class="sub">魔方是一个<b>有限群</b>：每个动作都是可逆的置换，所有状态的集合在乘法下封闭。因此「求解」就是在凯莱图上找一条回到单位元的路径。3 阶用分阶段启发式搜索，2 阶直接穷举整张图。</p>`),
    ].join('');
  }
  const steps = t.annotated;
  const cur = steps[Math.min(t.index, steps.length - 1)];
  const stageIdx = cur ? cur.stage : 0;
  const si = stageInfo(stageIdx, a.n);
  const counts = new Map();
  for (const s of steps) counts.set(s.stage, (counts.get(s.stage) || 0) + 1);
  const stageIds = a.n === 3 ? [0, 1, 2, 3, 4, 5, 6] : [...counts.keys()];

  const stageList = stageIds.map((id) => {
    const info = stageInfo(id, a.n);
    const first = steps.findIndex((s) => s.stage === id);
    const last = steps.map((s) => s.stage).lastIndexOf(id);
    let done;
    if (last >= 0) done = t.index > last;
    else {
      const next = stageIds.slice(stageIds.indexOf(id) + 1).map((n) => steps.findIndex((s) => s.stage === n)).find((i) => i >= 0);
      done = next === undefined ? t.index >= steps.length : t.index >= next;
    }
    const active = id === stageIdx && first >= 0;
    return `<button class="stage-item ${done ? 'done' : ''} ${active ? 'active' : ''}" data-act="jump-stage" data-stage="${id}" style="--sc:${info.color}">
      <i class="bar"></i><span class="idx">${String(id + 1).padStart(2, '0')}</span>
      <span class="nm">${info.name}</span><span class="ct">${counts.get(id) || 0} 步</span></button>`;
  }).join('');

  const mini = (fl) => netSVG(a.nets.nets[a.classicId], fl, a.n, a.palette, { unit: 7, pad: 3, width: 86 });
  const pct = Math.round((t.index / steps.length) * 100);

  return [
    card('解法阶段', `${steps.length} 步 · ${a.n === 3 ? 'LBL' : 'OPTIMAL'}`, `<div class="stage-list">${stageList}</div>`),
    cur ? `<section class="card step-card">
      <div class="step-head">
        <div class="step-not" id="stepNot">${cur.name}</div>
        <div class="step-meta"><b id="stepCn">${cur.cn}</b><span id="stepMeta">${cur.macro || '单步'} · 第 ${t.index + 1}/${steps.length} 步</span></div>
      </div>
      <p class="step-why" id="stepWhy"><b style="color:${si.color}">${si.name}</b> · ${si.goal}</p>
      <p class="step-meaning" id="stepMeaning">${esc(cur.meaning)}</p>
      <div class="mini-nets"><span class="mini-wrap" id="miniBefore">${mini(cur.before)}</span><span class="arrow">→</span><span class="mini-wrap" id="miniAfter">${mini(cur.after)}</span></div>
      <div class="step-count" id="stepScore">正确贴纸 ${cur.beforeScore} → ${cur.afterScore} / ${cur.total}${cur.gained ? ` （${cur.gained > 0 ? '+' : ''}${cur.gained}）` : ''}</div>
      <div class="playbar">
        <button class="btn ghost" data-act="t-prev" title="上一步">⏮</button>
        <button class="btn play ${t.playing ? 'playing' : ''}" id="playBtn" data-act="t-play">${t.playing ? '⏸ 暂停' : '▶ 播放'}</button>
        <button class="btn ghost" data-act="t-next" title="下一步">⏭</button>
        <button class="btn ghost" data-act="t-reset" title="回到开头">⟲</button>
      </div>
      <div class="scrub"><input type="range" id="tScrub" min="0" max="${steps.length}" step="1" value="${t.index}"></div>
      <div class="step-count" id="tProgress">进度 ${pct}% · 播放速度 ${t.speed.toFixed(2)}×</div>
      <div class="playbar">
        <button class="btn ghost" data-act="t-slower">− 慢</button>
        <button class="btn ghost" data-act="t-faster">+ 快</button>
        <button class="btn ghost" data-act="t-apply">应用到魔方</button>
      </div>
    </section>` : '',
    card('这一步的意义', 'WHY', `<p>${si.why}</p>`),
    card('背后的数学', 'MATH', `<p class="sub">${si.math}</p>`),
    card('换个解法', 'REBUILD', `
      <div class="btn-grid two">
        <button class="btn ghost" data-act="build-tutorial">重新求解</button>
        <button class="btn ghost" data-act="rewind">回溯还原</button>
      </div>
      <p class="sub" style="margin-top:8px">回溯还原 = 把历史动作逐条取逆，一定成功且最快；教程求解 = 从当前状态重新搜索，会给出有教学意义的分解。</p>`),
  ].join('');
}

// ---------------------------------------------------------------- MECHANISM
const PARTS = [
  { id: 'center', name: '中心块', n: 6, sw: 'linear-gradient(135deg,#F5333F,#B3168A)', desc: '每面 1 个，只有 1 张贴纸。它被螺丝固定在中心轴上，只能自转，永远不改变位置——所以中心块决定了「这一面是什么颜色」。' },
  { id: 'edge', name: '棱块', n: 12, sw: 'linear-gradient(135deg,#14E06A,#2B7BFF)', desc: '每面 4 个，2 张贴纸。底部有一条卡脚，卡在相邻中心块的凸缘下方，因此棱块能跟着层转，却不会掉出来。' },
  { id: 'corner', name: '角块', n: 8, sw: 'linear-gradient(135deg,#FFD400,#FF8A1F)', desc: '8 个顶点，3 张贴纸。三条卡脚互相咬合，把整个魔方「缝合」成一个球状机构——角块是承力的关键。' },
  { id: 'core', name: '中心轴 / 球核', n: 1, sw: 'linear-gradient(135deg,#8a8fa8,#2b2b38)', desc: '3 阶是六臂十字轴（spider），6 个中心块用螺丝+弹簧锁在臂端；2 阶多为球核或四轴，靠弧形轨道约束 8 个角块。' },
  { id: 'screw', name: '螺丝 + 弹簧', n: 6, sw: 'linear-gradient(135deg,#c8a24a,#6b5320)', desc: '弹簧提供张力：拧得紧 → 稳定但费力；拧得松 → 灵活但容易 POP（飞块）。调张力就是调「手感」。' },
  { id: 'foot', name: '卡脚 / 凸缘', n: 26, sw: 'linear-gradient(135deg,#22E3FF,#4B2FD6)', desc: '每个块底部伸出的脚。转动时，脚沿着中心块凸缘的圆弧滑动——这就是「层能转、块不散」的全部秘密。' },
];

export function renderMechanism(a) {
  const sel = a.selectedPart;
  const part = PARTS.find((p) => p.id === sel);
  const counts = a.n === 2
    ? { center: 0, edge: 0, corner: 8, core: 1, screw: 0, foot: 8 }
    : { center: 6, edge: 12, corner: 8, core: 1, screw: 6, foot: 26 };
  return [
    card('结构清单', a.n === 2 ? '2×2 · 8 块' : '3×3 · 26 块', `
      <div class="part-list">
        ${PARTS.map((p) => `<button class="part ${sel === p.id ? 'active' : ''}" data-act="part" data-part="${p.id}">
          <i class="sw" style="background:${p.sw}"></i>
          <span><b>${p.name}</b><span>${counts[p.id] === 0 ? '2 阶没有此部件' : '点击在 3D 中隔离显示'}</span></span>
          <span class="n">${counts[p.id]}</span></button>`).join('')}
      </div>`),
    part ? card(part.name, 'ANATOMY', `<p>${part.desc}</p>
      ${a.n === 2 && (part.id === 'center' || part.id === 'edge' || part.id === 'screw') ? '<p class="sub" style="color:var(--warn)">2 阶魔方没有中心块与棱块：只有 8 个角块，颜色关系完全由角块自身决定，因此整体旋转不改变状态。</p>' : ''}`) : '',
    card('它为什么转得动又散不开？', 'PRINCIPLE', `
      <p><b>1 · 固定参照系。</b>中心轴把 6 个中心块锁死，构成一个不变的「坐标系」。所有转动都是相对于这个坐标系进行的。</p>
      <p><b>2 · 球面滑动。</b>把每个块的卡脚延长，它们都落在同一个球面上。层转动 = 这个球面上的一圈块绕轴旋转，卡脚沿凸缘滑动，径向被约束住，所以不会飞出。</p>
      <p><b>3 · 互锁。</b>角块的三条脚压住棱块，棱块压住中心块凸缘，形成闭环。少任何一类块，机构都会解体。</p>
      <p class="sub">打开左侧「外壳透明」和「剖切平面」，就能看到内部的轴、螺丝、弹簧与卡脚。</p>`),
    card('剖切与拆解', 'CUTAWAY', `
      <div class="btn-grid two">
        <button class="btn ghost" data-act="cut-half">半剖</button>
        <button class="btn ghost" data-act="cut-quarter">四分之一剖</button>
        <button class="btn ghost" data-act="cut-off">关闭剖切</button>
        <button class="btn ghost" data-act="explode-full">完全拆解</button>
      </div>
      <p class="sub" style="margin-top:8px">拖动左侧「爆炸拆解」滑块，26 个块会沿径向散开，露出中心轴；「块间距」则模拟真实魔方的缝隙。</p>`),
    card('容错与 POP', 'TOLERANCE', `
      <p class="sub">现代魔方的卡脚留有圆角与间隙，允许未对齐时强行转动（容错，cutting corner）。间隙过大 → 飞块（POP）；过小 → 卡顿。这也是「倒角半径」滑块在模拟的东西。</p>`),
    card('2 阶 vs 3 阶', 'COMPARE', `
      ${kv('3 阶块数', '8 角 + 12 棱 + 6 中心 = 26')}
      ${kv('2 阶块数', '8 角 = 8')}
      ${kv('3 阶状态数', '4.33 × 10¹⁹')}
      ${kv('2 阶状态数', '3,674,160')}
      ${kv('机构差异', '六臂轴 vs 球核/四轴')}
      <p class="sub" style="margin-top:8px">2 阶可以看作 3 阶「只保留角块」的子群——这也是为什么 3 阶的角块公式可以直接用在 2 阶上。</p>`),
  ].join('');
}

// --------------------------------------------------------------------- MATH
export function renderMath(a) {
  const fast = a.cube.toFast();
  const inv = invariants(fast, a.n);
  const sp = stateSpace(a.n);
  const net = a.nets.nets[a.netId];
  const fl = a.cube.facelets();
  const cc = inv.cornerCycles.map((c) => c.map((i) => ['URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB'][i]).join('→'));
  const ec = inv.edgeCycles.map((c) => c.map((i) => ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR'][i]).join('→'));
  let order = 1;
  for (const c of inv.cornerCycles) order = lcm(order, c.length);
  for (const c of inv.edgeCycles) order = lcm(order, c.length);
  const od = a.orderDemo;

  const cards = [
    card('状态空间', 'GROUP ORDER', `
      <div class="big-num">${sp.pretty}</div>
      <p class="sub" style="margin-top:6px">= ${sp.formula}</p>
      ${kv('上帝之数 (HTM)', sp.god + ' 步')}
      ${kv('上帝之数 (QTM)', sp.godQTM + ' 步')}
      ${kv('生成元', a.n === 3 ? 'U D L R F B（6 个面）' : 'U R F（固定一个角）')}
      ${a.n === 3 ? kv('除以 2 的原因', '角/棱置换奇偶必须一致') : kv('固定角块', 'DBL 不动 → 商掉 24 个整体朝向')}`),
    card('三个不变量', 'INVARIANTS', `
      <p class="sub">无论怎么转，这三条永远成立。它们正是「不可能只翻转一个棱块 / 只扭转一个角块 / 只交换两个块」的数学证明。</p>
      ${kv('角块扭转和 ≡ 0 (mod 3)', `${inv.twistSum} → ${inv.twistMod}`, inv.twistMod === 0 ? 'ok' : 'bad')}
      ${kv('棱块翻转和 ≡ 0 (mod 2)', a.n === 3 ? `${inv.flipSum} → ${inv.flipMod}` : 'n/a', a.n !== 3 || inv.flipMod === 0 ? 'ok' : 'bad')}
      ${kv('角置换奇偶 = 棱置换奇偶', a.n === 3 ? `${inv.cornerParity} = ${inv.edgeParity}` : 'n/a', inv.parityMatch ? 'ok' : 'bad')}
      ${kv('当前状态合法性', '合法 ✓', 'ok')}`),
    card('置换循环分解', 'CYCLES', `
      <p class="sub">把当前状态写成不相交循环的乘积。循环长度的最小公倍数 = 这个置换的阶。</p>
      <div style="font-size:11px;color:var(--muted);margin-top:6px">角块循环</div>
      <div class="cycle-row">${cc.length ? cc.map((c) => `<span class="cyc">(${c})</span>`).join('') : '<span class="cyc">恒等</span>'}</div>
      ${a.n === 3 ? `<div style="font-size:11px;color:var(--muted);margin-top:8px">棱块循环</div>
      <div class="cycle-row">${ec.length ? ec.map((c) => `<span class="cyc e">(${c})</span>`).join('') : '<span class="cyc e">恒等</span>'}</div>` : ''}
      ${kv('置换的阶', order, 'ok')}
      <p class="sub" style="margin-top:6px">注意：这只是「位置」的阶；把朝向也算进去，完整状态的阶可能更大。</p>`),
    card('展开图 · 11 种', 'NETS', `
      <p class="sub">立方体表面沿棱剪开、摊平，共有 <b>11 种</b>本质不同的展开图。它们来自面邻接图（正八面体图 K<sub>2,2,2</sub>）的 <b>384</b> 棵生成树，按旋转/反射去重后剩下 11 个。</p>
      <div class="net-picker">
        ${a.nets.nets.map((n) => `<button class="net-thumb ${n.id === a.netId ? 'active' : ''}" data-act="net" data-net="${n.id}" title="展开图 #${n.id + 1}">${netThumb(n, a.n, a.palette)}</button>`).join('')}
      </div>
      <div class="net-live" id="netLive">${netSVG(net, fl, a.n, a.palette, { unit: 17, labels: true, interactive: true, width: 280 })}</div>
      <label class="ctl" style="margin-top:10px"><span>3D 展开程度<b id="vUnfold">${a.unfold.toFixed(2)}</b></span>
        <input type="range" id="rUnfold" min="0" max="1" step="0.01" value="${a.unfold}"></label>
      <div class="btn-grid two">
        <button class="btn ghost" data-act="unfold-play">播放展开动画</button>
        <button class="btn ghost" data-act="unfold-fold">折回立方体</button>
      </div>
      <p class="sub" style="margin-top:8px">点击展开图上的任意贴纸，可以直接转动那一面；3D 视图会同步铰链展开。</p>`),
    card('拓扑视角', 'TOPOLOGY', `
      ${kv('表面同胚于', '球面 S²')}
      ${kv('亏格 genus', '0（没有洞）')}
      ${kv('顶点 V − 棱 E + 面 F', '8 − 12 + 6 = 2')}
      ${kv('欧拉示性数 χ', '2 ✓')}
      ${kv('面邻接图', NET_INFO.adjacencyGraph)}
      ${kv('生成树数量', NET_INFO.spanningTrees)}
      <p class="sub" style="margin-top:8px">魔方表面是一个剖分成 54 个小正方形的球面。转动不改变拓扑，只改变「着色」——所以魔方群作用在一个固定拓扑空间的着色集合上。展开图则是把这个球面剪开成平面圆盘的过程：剪的棱必须构成一棵生成树，否则剪不断或会散架。</p>`),
    card('公式的阶', 'ORDER', `
      <p class="sub">任何公式重复足够多次一定回到原状——因为群是有限的。重复次数就是该元素的阶。</p>
      <div class="chip-row" style="margin-bottom:9px">
        ${ORDER_PRESETS.map((p) => `<button class="chip-btn ${od.alg === p.alg ? 'active' : ''}" data-act="order-preset" data-alg="${esc(p.alg)}" title="${esc(p.hint)}">${esc(p.label)}</button>`).join('')}
      </div>
      <div class="alg-entry" style="width:100%">
        <input id="orderInput" value="${esc(od.alg)}" spellcheck="false" style="flex:1;width:auto">
        <button class="btn tiny" data-act="order-calc">计算</button>
      </div>
      ${od.order > 0 ? `${kv('阶', od.order, 'ok')}${kv('总步数', od.order * od.seqLen)}` : od.order === -1 ? '<p class="sub" style="color:var(--warn)">超过 20000 次仍未复原（或公式非法）。</p>' : ''}
      <div class="btn-grid two" style="margin-top:9px">
        <button class="btn ghost" data-act="order-run" ${od.order > 0 ? '' : 'disabled'}>${od.running ? '停止演示' : '重复到复原'}</button>
        <button class="btn ghost" data-act="order-reset">重置魔方</button>
      </div>
      ${od.running || od.count > 0 ? `<div class="scrub"><input type="range" min="0" max="${Math.max(1, od.order)}" value="${od.count}" disabled></div>
      <div class="step-count">已重复 ${od.count} / ${od.order} 次</div>` : ''}`),
    card('交换子与共轭', 'COMMUTATOR', `
      <p class="sub"><b>交换子</b> [A,B] = A B A⁻¹ B⁻¹：先做一件事，再撤销它，净效果往往只影响少数块。sexy move (R U R' U') 就是 [R,U]，阶为 6。</p>
      <p class="sub"><b>共轭</b> A B A⁻¹：把公式 B「搬运」到另一个位置去做。所有插入公式都是共轭——这就是为什么同一手法能用在四个不同槽位。</p>
      <div class="btn-grid two" style="margin-top:8px">
        <button class="btn ghost" data-act="demo-sexy">演示 [R,U] ×6</button>
        <button class="btn ghost" data-act="demo-conj">演示共轭</button>
      </div>`),
  ];
  return [cards[0], cards[3], cards[1], cards[2], cards[4], cards[5], cards[6]].join('');
}

export function renderHelp() {
  const cols = [
    ['鼠标 / 触控板', [
      ['左键拖拽空白', '环绕旋转视角'],
      ['在魔方表面拖拽', '转动对应层（含夹层）'],
      ['滚轮 / 双指滚动', '推拉缩放'],
      ['Shift + 滚轮', '水平环绕'],
      ['Alt + 滚轮', '俯仰环绕'],
      ['双指捏合', '缩放（触屏）'],
      ['右键拖拽', '环绕（备用）'],
    ]],
    ['键盘 · 转层', [
      ['U D L R F B', '上/下/左/右/前/后 顺时针'],
      ['Shift + 字母', '逆时针'],
      ['M E S', '三个夹层'],
      ['X Y Z', '整体旋转'],
      ['输入框 + 回车', '执行任意公式'],
    ]],
    ['键盘 · 视角与流程', [
      ['← → ↑ ↓', '环绕视角'],
      ['+ / −', '缩放'],
      ['Space', '随机打乱'],
      ['Enter', '教程求解 / 播放'],
      ['Backspace', '撤销一步'],
      ['0', '重置为复原态'],
      ['2 / 3', '切换 2 阶 / 3 阶'],
      ['1 2 3 4 (Ctrl)', '切换模式'],
      ['S', '静音开关'],
      ['H / Esc', '帮助'],
    ]],
    ['四个模式', [
      ['玩 PLAY', '随机魔方 + 自由操控 + 挑战'],
      ['学 TUTOR', '自动还原，逐步讲解作用与意义'],
      ['拆 MECH', '爆炸 / X-Ray / 剖切，看内部机构'],
      ['理 MATH', '群论不变量、置换循环、11 种展开图与拓扑'],
    ]],
  ];
  return cols.map(([title, rows]) => `<div class="help-col"><h5>${title}</h5><ul>${rows.map(([k, v]) => `<li><kbd>${k}</kbd><span>${v}</span></li>`).join('')}</ul></div>`).join('');
}