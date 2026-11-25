/* 魔方迷宫：六面连通迷宫生成 + 可解性验证 + 提示规划（纯逻辑） */
(function (GX) {
  'use strict';
  var C = GX.cube;
  var KEY_ORDER = GX.KEY_ORDER;

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(rng, arr) { return arr[(rng() * arr.length) | 0]; }
  function shuffle(rng, arr) {
    for (var i = arr.length - 1; i > 0; i--) { var j = (rng() * (i + 1)) | 0, t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    return arr;
  }
  var REJECT = {};
  function reject(r) { REJECT[r] = (REJECT[r] || 0) + 1; return null; }

  /* ---------- 坐标 ---------- */
  function faceOf(L, id) { return (id / L.per) | 0; }
  function uvOf(L, id) { var r = id % L.per; return [r % L.N, (r / L.N) | 0]; }
  function baseOf(L, S, cell) {
    var f = (cell / L.per) | 0, r = cell % L.per;
    var b = C.baseCoord(L.N, S.ang[f], r % L.N, (r / L.N) | 0);
    return f * L.per + b[1] * L.N + b[0];
  }
  function curOf(L, S, base) {
    var f = (base / L.per) | 0, r = base % L.per;
    var p = C.rotPoint(L.N, S.ang[f], r % L.N, (r / L.N) | 0);
    return f * L.per + p[1] * L.N + p[0];
  }
  function isRoom(L, id) { var r = id % L.per; return (r % L.N) % 2 === 1 && ((r / L.N) | 0) % 2 === 1; }
  function interior(L, id) {
    var r = id % L.per, u = r % L.N, v = (r / L.N) | 0;
    return u >= 1 && u <= L.N - 2 && v >= 1 && v <= L.N - 2;
  }

  /* ---------- 状态 ---------- */
  function createState(L) {
    return {
      ang: L.scramble.slice(),
      lev: L.levers.map(function () { return 0; }),
      gear: L.gears.map(function (g) { return g.start; }),
      keys: 0, grp: 0, seq: 0, stars: 0,
      pos: curOf(L, { ang: L.scramble }, L.start)
    };
  }
  function cloneState(s) {
    return { ang: s.ang.slice(), lev: s.lev.slice(), gear: s.gear.slice(), keys: s.keys, grp: s.grp, seq: s.seq, stars: s.stars, pos: s.pos };
  }
  function gateOpen(L, S, gi) {
    var g = L.gates[gi];
    if (g.ref < 0) return false;
    if (g.kind === 'key') return !!(S.keys & (1 << g.ref));
    if (g.kind === 'gear') return !!(S.grp & (1 << g.ref));
    if (g.kind === 'lever') return !!S.lev[g.ref];
    if (g.kind === 'seq') return !!(S.seq & (1 << g.ref));
    return true;
  }
  function walkable(L, S, cell) {
    if (cell < 0 || cell >= L.total) return false;
    var base = baseOf(L, S, cell);
    var bi = L.bridgeOf[base];
    if (bi >= 0) { if (!gateOpen(L, S, bi)) return false; }
    else if (!L.t[base]) return false;
    var di = L.doorOf[base];
    if (di >= 0 && !gateOpen(L, S, di)) return false;
    return true;
  }
  // 传送门是「入口」：踩上去立刻被送到另一端，不能停在门格里。
  // 因此 BFS 里门格本身不算可达，可达的是它的目的地。
  function portalAt(L, S, cell) {
    var b = baseOf(L, S, cell);
    var pid = L.portalOf[b];
    if (pid < 0) return null;
    var end = L.portalEnd[b];
    var po = L.portals[pid];
    if (end === 1 && !po.twoWay) return null;   // 单向门的出口端不能再进
    return { id: pid, end: end, dest: end === 0 ? po.b : po.a };
  }
  // 出口落在配对门「旁边」的格子上，而不是门格本身 ——
  // 否则双向门会把人送到另一个入口上，立刻被弹回来，来回死循环。
  function portalExit(L, S, ringBase) {
    var rc = curOf(L, S, ringBase);
    var nbr = L.topo.nbr;
    for (var d = 0; d < 4; d++) {
      var n = nbr[rc * 4 + d];
      if (n < 0) continue;
      if (!walkable(L, S, n)) continue;
      if (L.portalOf[baseOf(L, S, n)] >= 0) continue;
      return n;
    }
    return -1;
  }
  function portalDest(L, S, cell) {
    var p = portalAt(L, S, cell);
    return p ? portalExit(L, S, p.dest) : -1;
  }
  function bfs(L, S, from, target) {
    var dist = new Int32Array(L.total).fill(-1);
    var prev = new Int32Array(L.total).fill(-1);
    var via = new Int8Array(L.total).fill(-1);
    var q = [from]; dist[from] = 0;
    var nbr = L.topo.nbr;
    var hit = target != null && from === target;
    for (var h = 0; h < q.length && !hit; h++) {
      var c = q[h];
      for (var d = 0; d < 4; d++) {
        var n = nbr[c * 4 + d];
        if (n < 0) continue;
        if (!walkable(L, S, n)) continue;
        var arrive = n, kind = d;
        var pp = portalAt(L, S, n);
        if (pp) {
          arrive = portalExit(L, S, pp.dest);
          kind = -2;                             // -2 = 这一步是传送
          if (arrive < 0 || !walkable(L, S, arrive)) continue;
        }
        if (dist[arrive] >= 0) continue;
        dist[arrive] = dist[c] + 1; prev[arrive] = c; via[arrive] = kind; q.push(arrive);
        if (target != null && arrive === target) { hit = true; break; }
      }
    }
    var min = from;
    if (!hit) { for (var i = 0; i < q.length; i++) if (q[i] < min) min = q[i]; }
    return { dist: dist, prev: prev, via: via, cells: q, min: min };
  }
  function region(L, S, from) { return bfs(L, S, from); }
  function reaches(L, S, from, target) { return bfs(L, S, from, target).dist[target] >= 0; }
  function settle(L, S) {
    var reg;
    for (var guard = 0; guard < 12; guard++) {
      reg = region(L, S, S.pos);
      var add = 0, addS = 0;
      for (var i = 0; i < reg.cells.length; i++) {
        var b = baseOf(L, S, reg.cells[i]);
        if (L.keyOf[b] >= 0) add |= 1 << L.keyOf[b];
        if (L.starOf[b] >= 0) addS |= 1 << L.starOf[b];
      }
      var nk = S.keys | add, ns = S.stars | addS;
      if (nk === S.keys && ns === S.stars) return reg;
      S.keys = nk; S.stars = ns;
    }
    return reg;
  }
  function stateKey(L, S, min) {
    return S.ang.join('') + '|' + S.lev.join('') + '|' + S.keys + '|' + S.grp + '|' + S.seq + '|' + min;
  }
  function groupSolved(L, S, gi) {
    var g = L.groups[gi];
    for (var i = 0; i < g.gears.length; i++) if (S.gear[g.gears[i]] !== 0) return false;
    return true;
  }
  function clickGear(L, S, id) {
    var g = L.gears[id];
    for (var i = 0; i < g.links.length; i++) { var j = g.links[i]; S.gear[j] = (S.gear[j] + 1) % L.gears[j].steps; }
  }
  function accessCells(L, S, reg, deviceCell) {
    var out = [], nbr = L.topo.nbr;
    for (var d = 0; d < 4; d++) { var n = nbr[deviceCell * 4 + d]; if (n >= 0 && reg.dist[n] >= 0) out.push(n); }
    return out;
  }
  function nearest(reg, cells) {
    var best = -1, bd = 1e9;
    for (var i = 0; i < cells.length; i++) if (reg.dist[cells[i]] >= 0 && reg.dist[cells[i]] < bd) { bd = reg.dist[cells[i]]; best = cells[i]; }
    return { cell: best, dist: bd };
  }

  /* ---------- 齿轮组初始角度（反向 BFS 控制点击次数） ---------- */
  function gearInitialAngles(rng, n, steps, links, minD, maxD) {
    var total = Math.pow(steps, n);
    var dec = function (c) { var a = []; for (var i = 0; i < n; i++) { a.push(c % steps); c = (c / steps) | 0; } return a; };
    var enc = function (a) { var v = 0, m = 1; for (var i = 0; i < n; i++) { v += a[i] * m; m *= steps; } return v; };
    var depth = new Int32Array(total).fill(-1); depth[0] = 0;
    var q = [0], buckets = {};
    for (var h = 0; h < q.length; h++) {
      var code = q[h], a = dec(code), d = depth[code];
      for (var i = 0; i < n; i++) {
        var b = a.slice();
        for (var k = 0; k < links[i].length; k++) { var j = links[i][k]; b[j] = (b[j] + steps - 1) % steps; }
        var nc = enc(b);
        if (depth[nc] < 0) { depth[nc] = d + 1; q.push(nc); (buckets[d + 1] = buckets[d + 1] || []).push(nc); }
      }
    }
    var want = [];
    for (var dd = minD; dd <= maxD; dd++) if (buckets[dd]) want = want.concat(buckets[dd]);
    if (!want.length) for (var e = 1; e <= maxD + 4; e++) if (buckets[e]) { want = buckets[e]; break; }
    return want.length ? dec(pick(rng, want)) : null;
  }
  function gearPlan(L, S, gi) {
    var g = L.groups[gi], n = g.gears.length, steps = L.gears[g.gears[0]].steps;
    var links = g.gears.map(function (id) { return L.gears[id].links; });
    var enc = function (a) { var v = 0, m = 1; for (var i = 0; i < n; i++) { v += a[i] * m; m *= steps; } return v; };
    var startCode = enc(g.gears.map(function (id) { return S.gear[id]; }));
    if (startCode === 0) return [];
    var total = Math.pow(steps, n);
    var prev = new Int32Array(total).fill(-1), via = new Int32Array(total).fill(-1);
    var seen = new Uint8Array(total); seen[startCode] = 1;
    var q = [startCode];
    for (var h = 0; h < q.length; h++) {
      var code = q[h];
      if (code === 0) { var plan = [], c = 0; while (c !== startCode) { plan.push(via[c]); c = prev[c]; } return plan.reverse(); }
      var a = [], cc = code;
      for (var i = 0; i < n; i++) { a.push(cc % steps); cc = (cc / steps) | 0; }
      for (var i2 = 0; i2 < n; i2++) {
        var b = a.slice();
        for (var k = 0; k < links[i2].length; k++) { var j = links[i2][k]; b[j] = (b[j] + 1) % steps; }
        var nc = enc(b);
        if (!seen[nc]) { seen[nc] = 1; prev[nc] = code; via[nc] = g.gears[i2]; q.push(nc); }
      }
    }
    return null;
  }

  /* ---------- 机关顺序求解（面已对齐后，状态空间很小） ---------- */
  function solveGates(L, from) {
    var s0 = cloneState(from);
    var reg0 = settle(L, s0);
    var nodes = [{ s: s0, parent: -1, act: null }];
    var seen = {}; seen[stateKey(L, s0, reg0.min)] = 1;
    for (var h = 0; h < nodes.length && h < 30000; h++) {
      var node = nodes[h], s = node.s;
      var reg = h === 0 ? reg0 : settle(L, s);
      if (reg.dist[curOf(L, s, L.exit)] >= 0) {
        var acts = [], ch = node;
        while (ch.parent >= 0) { acts.push(ch.act); ch = nodes[ch.parent]; }
        acts.reverse();
        acts.push({ type: 'exit', dist: reg.dist[curOf(L, s, L.exit)] });
        return acts;
      }
      var cand = [];
      for (var gi = 0; gi < L.groups.length; gi++) {
        if (s.grp & (1 << gi)) continue;
        var grp = L.groups[gi], ok = true, best = { cell: -1, dist: 1e9 };
        for (var k = 0; k < grp.gears.length; k++) {
          var acc = accessCells(L, s, reg, curOf(L, s, L.gears[grp.gears[k]].base));
          if (!acc.length) { ok = false; break; }
          var n = nearest(reg, acc); if (n.dist < best.dist) best = n;
        }
        if (ok && best.cell >= 0) cand.push({ type: 'gear', ref: gi, cell: best.cell, dist: best.dist });
      }
      for (var li = 0; li < L.levers.length; li++) {
        var a2 = accessCells(L, s, reg, curOf(L, s, L.levers[li].base));
        if (!a2.length) continue;
        var n2 = nearest(reg, a2);
        cand.push({ type: 'lever', ref: li, cell: n2.cell, dist: n2.dist });
      }
      for (var si = 0; si < L.seqs.length; si++) {
        if (s.seq & (1 << si)) continue;
        var sq = L.seqs[si], ok2 = true, best2 = { cell: -1, dist: 1e9 };
        for (var q2 = 0; q2 < sq.lamps.length; q2++) {
          var a3 = accessCells(L, s, reg, curOf(L, s, sq.lamps[q2]));
          if (!a3.length) { ok2 = false; break; }
          var n3 = nearest(reg, a3); if (n3.dist < best2.dist) best2 = n3;
        }
        if (ok2 && best2.cell >= 0) cand.push({ type: 'seq', ref: si, cell: best2.cell, dist: best2.dist });
      }
      cand.sort(function (a, b) { return a.dist - b.dist; });
      for (var ci = 0; ci < cand.length; ci++) {
        var act = cand[ci], ns = cloneState(s);
        ns.pos = act.cell;
        if (act.type === 'gear') ns.grp |= 1 << act.ref;
        else if (act.type === 'lever') ns.lev[act.ref] ^= 1;
        else if (act.type === 'seq') ns.seq |= 1 << act.ref;
        var nr = settle(L, ns), key = stateKey(L, ns, nr.min);
        if (seen[key]) continue;
        seen[key] = 1;
        nodes.push({ s: ns, parent: h, act: act });
      }
    }
    return null;
  }

  // 面旋转彼此独立且目标恒为 0，所以「先把每个面转回 0」永远是完整解的前缀
  function solve(L, from) {
    var s = cloneState(from);
    var acts = [];
    for (var f = 0; f < 6; f++) {
      var need = (4 - s.ang[f]) % 4;
      for (var k = 0; k < need; k++) {
        var a = { type: 'twist', ref: f, dist: 0 };
        acts.push(a);
        applyAction(L, s, a);
      }
    }
    var rest = solveGates(L, s);
    if (!rest) return null;
    return acts.concat(rest);
  }

  /* ---------- 生成 ---------- */
  function carve(L, rng) {
    var t = L.t, topo = L.topo, per = L.per;
    var rooms = [];
    for (var id = 0; id < L.total; id++) if (isRoom(L, id)) rooms.push(id);
    var visited = new Uint8Array(L.total);
    var startRoom = rooms[0];
    t[startRoom] = 1; visited[startRoom] = 1;
    var stack = [startRoom], count = 1;
    while (stack.length) {
      var cur = stack[stack.length - 1], opts = [];
      for (var d = 0; d < 4; d++) {
        var c = cur, dd = d, path = [];
        for (var step = 0; step < 3; step++) {
          var n = topo.nbr[c * 4 + dd];
          if (n < 0) break;
          path.push(n);
          if (isRoom(L, n)) { if (!visited[n]) opts.push({ room: n, path: path.slice() }); break; }
          dd = topo.nbrDir[c * 4 + dd]; c = n;
        }
      }
      if (!opts.length) { stack.pop(); continue; }
      var o = pick(rng, opts);
      for (var i = 0; i < o.path.length; i++) t[o.path[i]] = 1;
      visited[o.room] = 1; count++;
      stack.push(o.room);
    }
    return { rooms: rooms, visitedCount: count };
  }

  function tryBuild(cfg, diff, seed) {
    var rng = mulberry32(seed);
    var N = cfg.size;
    var topo = C.buildTopology(N);
    var L = {
      N: N, per: topo.per, total: topo.total, topo: topo,
      t: new Uint8Array(topo.total),
      gates: [], keys: [], groups: [], gears: [], levers: [], seqs: [], stars: [], portals: [],
      seed: seed, cfg: cfg, difficulty: diff
    };
    L.keyOf = new Int16Array(L.total).fill(-1);
    L.starOf = new Int16Array(L.total).fill(-1);
    L.doorOf = new Int16Array(L.total).fill(-1);
    L.bridgeOf = new Int16Array(L.total).fill(-1);
    L.gearOf = new Int16Array(L.total).fill(-1);
    L.leverOf = new Int16Array(L.total).fill(-1);
    L.lampOf = new Int16Array(L.total).fill(-1);
    L.portalOf = new Int16Array(L.total).fill(-1);
    L.portalEnd = new Int8Array(L.total).fill(-1);
    var cr = carve(L, rng);
    if (cr.visitedCount !== cr.rooms.length) return reject('rooms not spanned');

    var zero = { ang: [0, 0, 0, 0, 0, 0] };
    L.start = cr.rooms[0];
    var full = bfs(L, { ang: zero.ang, lev: [], keys: 0, grp: 0, seq: 0 }, L.start);
    var exit = -1, best = -1;
    for (var i = 0; i < cr.rooms.length; i++) {
      var r = cr.rooms[i];
      if (full.dist[r] < 0) return reject('room unreachable');
      var f = faceOf(L, r);
      var okFace = cfg.opposite ? (f !== faceOf(L, L.start)) : true;
      if (okFace && full.dist[r] > best) { best = full.dist[r]; exit = r; }
    }
    if (exit < 0) return reject('no exit');
    L.exit = exit;
    var path = [], c = exit;
    while (c !== -1) { path.push(c); c = full.prev[c]; }
    path.reverse();
    L.path = path;
    if (path.length < cfg.gates.length * 4 + 6) return reject('path too short');

    var used = {}; used[L.start] = 1; used[L.exit] = 1;

    var slots = path.filter(function (id) { return !isRoom(L, id) && interior(L, id); });
    if (slots.length < cfg.gates.length) return reject('not enough gate slots');
    var gateCells = [];
    for (var g = 0; g < cfg.gates.length; g++) {
      var idx = Math.max(0, Math.min(slots.length - 1, Math.round((g + 1) / (cfg.gates.length + 1) * slots.length)));
      while (gateCells.indexOf(slots[idx]) >= 0 && idx < slots.length - 1) idx++;
      if (gateCells.indexOf(slots[idx]) >= 0) return reject('gate collision');
      gateCells.push(slots[idx]);
    }
    gateCells.sort(function (a, b) { return path.indexOf(a) - path.indexOf(b); });
    for (var gi0 = 0; gi0 < cfg.gates.length; gi0++) {
      var k0 = cfg.gates[gi0], c0 = gateCells[gi0];
      L.gates.push({ id: gi0, kind: k0, base: c0, ref: -1 });
      if (k0 === 'lever') L.bridgeOf[c0] = gi0; else L.doorOf[c0] = gi0;
      used[c0] = 1;
    }

    function stateBefore(gi) {
      var s = { ang: [0, 0, 0, 0, 0, 0], lev: L.levers.map(function () { return 0; }), gear: [], keys: 0, grp: 0, seq: 0, stars: 0, pos: L.start };
      for (var k = 0; k < gi; k++) {
        var gt = L.gates[k];
        if (gt.kind === 'key') s.keys |= 1 << gt.ref;
        else if (gt.kind === 'gear') s.grp |= 1 << gt.ref;
        else if (gt.kind === 'lever') s.lev[gt.ref] = 1;
        else if (gt.kind === 'seq') s.seq |= 1 << gt.ref;
      }
      return s;
    }
    function floorCands(reg) {
      var out = [];
      for (var i = 0; i < reg.cells.length; i++) {
        var id = reg.cells[i];
        if (used[id] || !isRoom(L, id) || !interior(L, id)) continue;
        if (L.doorOf[id] >= 0 || L.bridgeOf[id] >= 0) continue;
        var open = 0;
        for (var d = 0; d < 4; d++) { var n = L.topo.nbr[id * 4 + d]; if (n >= 0 && L.t[n]) open++; }
        out.push({ cell: id, dead: open === 1, off: path.indexOf(id) < 0 });
      }
      out.sort(function (a, b) { return ((b.dead ? 2 : 0) + (b.off ? 1 : 0)) - ((a.dead ? 2 : 0) + (a.off ? 1 : 0)); });
      return out;
    }
    function wallCands(reg) {
      var set = {}, out = [];
      for (var i = 0; i < reg.cells.length; i++) {
        var id = reg.cells[i];
        for (var d = 0; d < 4; d++) {
          var n = L.topo.nbr[id * 4 + d];
          if (n < 0 || L.t[n] || used[n] || set[n] || !interior(L, n)) continue;
          if (faceOf(L, n) !== faceOf(L, id)) continue;
          if (L.doorOf[n] >= 0 || L.bridgeOf[n] >= 0) continue;
          set[n] = 1; out.push(n);
        }
      }
      return out;
    }
    function cluster(reg, n) {
      var cands = wallCands(reg);
      if (cands.length < n) return null;
      var anchors = shuffle(rng, cands.slice());
      for (var a = 0; a < anchors.length; a++) {
        var af = faceOf(L, anchors[a]), auv = uvOf(L, anchors[a]);
        var same = cands.filter(function (x) { return faceOf(L, x) === af; });
        if (same.length < n) continue;
        same.sort(function (x, y) {
          var xa = uvOf(L, x), ya = uvOf(L, y);
          return (Math.abs(xa[0] - auv[0]) + Math.abs(xa[1] - auv[1])) - (Math.abs(ya[0] - auv[0]) + Math.abs(ya[1] - auv[1]));
        });
        return same.slice(0, n);
      }
      return null;
    }

    for (var gi = 0; gi < cfg.gates.length; gi++) {
      var kind = cfg.gates[gi], gate = L.gates[gi];
      var reg = region(L, stateBefore(gi), L.start);
      if (reg.dist[gate.base] >= 0) return reject('gate bypassable ' + gi);
      if (kind === 'key') {
        var cands = floorCands(reg);
        if (!cands.length) return reject('no key spot');
        var ch = pick(rng, cands.slice(0, Math.max(1, Math.min(5, cands.length))));
        var kid = L.keys.length;
        L.keys.push({ id: kid, base: ch.cell, color: KEY_ORDER[kid % KEY_ORDER.length] });
        L.keyOf[ch.cell] = kid; used[ch.cell] = 1; gate.ref = kid;
      } else if (kind === 'gear') {
        var n = Math.max(1, cfg.gearLinks);
        var walls = cluster(reg, n);
        if (!walls) return reject('no gear wall');
        var links = [];
        for (var a2 = 0; a2 < n; a2++) links.push(n === 1 ? [a2] : [a2, (a2 + 1) % n]);
        var angles = gearInitialAngles(rng, n, cfg.gearSteps, links, diff === 'easy' ? 2 : 3, diff === 'easy' ? 3 : (n === 1 ? 5 : 7));
        if (!angles) return reject('no gear angles');
        var gid = L.groups.length, ids = [];
        for (var b2 = 0; b2 < n; b2++) {
          var id = L.gears.length; ids.push(id);
          L.gears.push({ id: id, base: walls[b2], group: gid, steps: cfg.gearSteps, start: angles[b2], links: links[b2].map(function (x) { return id - b2 + x; }) });
          L.gearOf[walls[b2]] = id; used[walls[b2]] = 1;
        }
        L.groups.push({ id: gid, gears: ids, gate: gi });
        gate.ref = gid;
      } else if (kind === 'lever') {
        var w = wallCands(reg);
        if (!w.length) return reject('no lever wall');
        var wc = pick(rng, w), lid = L.levers.length;
        L.levers.push({ id: lid, base: wc, gate: gi });
        L.leverOf[wc] = lid; used[wc] = 1; gate.ref = lid;
      } else if (kind === 'seq') {
        var lw = cluster(reg, cfg.seq);
        if (!lw) return reject('no lamp wall');
        var sid = L.seqs.length;
        L.seqs.push({ id: sid, lamps: lw, pattern: shuffle(rng, lw.map(function (_, i) { return i; })), gate: gi });
        lw.forEach(function (x, i2) { L.lampOf[x] = sid * 8 + i2; used[x] = 1; });
        gate.ref = sid;
      }
    }

    // 打乱面角度：优先打乱主路经过的面
    var pathFaces = [];
    path.forEach(function (id) { var f = faceOf(L, id); if (pathFaces.indexOf(f) < 0) pathFaces.push(f); });
    var allFaces = shuffle(rng, [0, 1, 2, 3, 4, 5]);
    var order = shuffle(rng, pathFaces.slice()).concat(allFaces.filter(function (f) { return pathFaces.indexOf(f) < 0; }));
    L.scramble = [0, 0, 0, 0, 0, 0];
    var tw = Math.min(6, cfg.twist);
    for (var t2 = 0; t2 < tw; t2++) L.scramble[order[t2]] = 1 + ((rng() * 3) | 0);
    L.twistedFaces = order.slice(0, tw);

    function openStateEarly() {
      return {
        ang: [0, 0, 0, 0, 0, 0], lev: L.levers.map(function () { return 1; }), gear: [],
        keys: (1 << L.keys.length) - 1, grp: (1 << L.groups.length) - 1,
        seq: (1 << L.seqs.length) - 1, stars: 0, pos: L.start
      };
    }
    /* ---------- 传送门：跨面直连，双向 / 单向 ---------- */
    var OPP = [2, 3, 0, 1, 5, 4];   // 前↔后 左↔右 上↔下
    var zeroS = {
      ang: [0, 0, 0, 0, 0, 0], lev: L.levers.map(function () { return 1; }), gear: [],
      keys: (1 << L.keys.length) - 1, grp: (1 << L.groups.length) - 1,
      seq: (1 << L.seqs.length) - 1, stars: 0, pos: L.start
    };
    function roomPool(reg, faceFilter) {
      var out = [];
      for (var i = 0; i < reg.cells.length; i++) {
        var id = reg.cells[i];
        if (used[id] || !isRoom(L, id) || !interior(L, id)) continue;
        if (L.doorOf[id] >= 0 || L.bridgeOf[id] >= 0 || L.portalOf[id] >= 0) continue;
        if (faceFilter != null && faceOf(L, id) !== faceFilter) continue;
        out.push(id);
      }
      return out;
    }
    function addPortal(a, b, twoWay) {
      var pid = L.portals.length;
      L.portals.push({ id: pid, a: a, b: b, twoWay: !!twoWay, hue: pid % 4 });
      L.portalOf[a] = pid; L.portalEnd[a] = 0;
      L.portalOf[b] = pid; L.portalEnd[b] = 1;
      used[a] = 1; used[b] = 1;
      return pid;
    }
    // 「必须走传送门」的关卡：先把主路上的一格堵死，让出口断开，
    // 再用一道传送门把断开的两侧接起来 —— 这样传送门就是唯一通路。
    /* 闸门依赖签名：sig[x] 的第 g 位 = 「只关掉第 g 道闸门时 x 仍可达」。
       两格签名相同 ⇒ 对任意单道闸门，它们要么都可达要么都不可达，
       所以在它们之间开传送门永远不会替玩家绕过某道闸门。
       sig === 0 的格子表示「所有闸门都开了才能到」，必需门的入口只能挑这种。 */
    var sig = new Int32Array(L.total);
    var fullReg0 = region(L, zeroS, L.start);
    for (var si0 = 0; si0 < fullReg0.cells.length; si0++) sig[fullReg0.cells[si0]] = 0;
    var reachableAny = new Uint8Array(L.total);
    for (var si1 = 0; si1 < fullReg0.cells.length; si1++) reachableAny[fullReg0.cells[si1]] = 1;
    for (var sg = 0; sg < L.gates.length; sg++) {
      var ss = openStateEarly(), sgate = L.gates[sg];
      if (sgate.kind === 'key') ss.keys &= ~(1 << sgate.ref);
      else if (sgate.kind === 'gear') ss.grp &= ~(1 << sgate.ref);
      else if (sgate.kind === 'lever') ss.lev[sgate.ref] = 0;
      else if (sgate.kind === 'seq') ss.seq &= ~(1 << sgate.ref);
      var sr = region(L, ss, L.start);
      for (var sj = 0; sj < sr.cells.length; sj++) sig[sr.cells[sj]] |= (1 << sg);
    }

    /* 必需传送门：把出口做成一个「口袋」——出口格 E 只留一个邻格 X，
       X 也只留 E，其余全部砌墙，然后把传送门的出口端放在 X 上。
       封锁写在面的基准图案里，会随面刚性旋转，所以无论怎么转面，
       E 都只能靠传送门抵达（传送落点 = X 的唯一可走邻格 = E）。 */
    if (cfg.portalReq) {
      var eNbr = [];
      for (var ed = 0; ed < 4; ed++) {
        var en = L.topo.nbr[L.exit * 4 + ed];
        if (en >= 0 && faceOf(L, en) === faceOf(L, L.exit)) eNbr.push(en);
      }
      var xCand = shuffle(rng, eNbr.filter(function (x) { return interior(L, x) && !used[x] && !isRoom(L, x); }));
      var sealed = false, chosenX = -1;
      for (var xi = 0; xi < xCand.length && !sealed; xi++) {
        var X = xCand[xi];
        var toWall = [];
        var bad = false;
        for (var k1 = 0; k1 < 4; k1++) {
          var n1 = L.topo.nbr[L.exit * 4 + k1];
          if (n1 < 0 || n1 === X) continue;
          if (used[n1]) { bad = true; break; }
          toWall.push(n1);
        }
        if (bad) continue;
        for (var k2 = 0; k2 < 4; k2++) {
          var n2 = L.topo.nbr[X * 4 + k2];
          if (n2 < 0 || n2 === L.exit) continue;
          if (used[n2]) { bad = true; break; }
          toWall.push(n2);
        }
        if (bad) continue;
        var backup = toWall.map(function (x) { return L.t[x]; });
        var xBackup = L.t[X];
        toWall.forEach(function (x) { L.t[x] = 0; });
        L.t[X] = 1;   // 门格本身必须可走，双向门才能原路返回
        if (reaches(L, zeroS, L.start, L.exit)) {
          toWall.forEach(function (x, i) { L.t[x] = backup[i]; });
          L.t[X] = xBackup;
          continue;
        }
        sealed = true; chosenX = X;
      }
      if (!sealed) return reject('no exit pocket');
      // 入口端：必须「所有闸门都开了才能到」，且落在出口的对面
      var regA2 = region(L, zeroS, L.start);
      var wantFace = OPP[faceOf(L, chosenX)];
      var poolA2 = shuffle(rng, roomPool(regA2, wantFace).filter(function (x) { return sig[x] === 0; }));
      if (!poolA2.length) poolA2 = shuffle(rng, roomPool(regA2).filter(function (x) { return sig[x] === 0 && faceOf(L, x) === wantFace; }));
      if (!poolA2.length) return reject('no pocket entrance');
      addPortal(poolA2[0], chosenX, !cfg.reqOneWay);
      if (!reaches(L, zeroS, L.start, L.exit)) return reject('pocket portal failed');
      L.portalCut = chosenX;
      L.exitPocket = true;
    }

    // 其余传送门是可选捷径，前 cfg.oneWay 道为单向；两端签名必须一致
    var wantPortals = cfg.portals || 0;
    var oneWayLeft = cfg.oneWay || 0;
    var pguard = 0;
    var optReg = region(L, zeroS, L.start);
    while (L.portals.length < wantPortals && pguard++ < 240) {
      var ppool = shuffle(rng, roomPool(optReg));
      if (ppool.length < 2) break;
      var placedOpt = false;
      for (var pi = 0; pi < ppool.length && !placedOpt; pi++) {
        var pA = ppool[pi], pFb = OPP[faceOf(L, pA)];
        var cand2 = shuffle(rng, roomPool(optReg, pFb));
        for (var qi = 0; qi < cand2.length; qi++) {
          if (cand2[qi] === pA || sig[cand2[qi]] !== sig[pA]) continue;
          var tw2 = oneWayLeft <= 0;
          if (!tw2) oneWayLeft--;
          addPortal(pA, cand2[qi], tw2);
          placedOpt = true;
          break;
        }
      }
      if (!placedOpt) break;
    }
    if (L.portals.length < wantPortals) return reject('not enough portal spots');

    // 棱边走廊会形成环路。玩家只能把面转向 0，所以要遍历所有「单调可达」的
    // 角度组合，确认每一种组合下每道闸门都不可替代 —— 否则机关会被绕过。
    function openState() {
      return {
        ang: [0, 0, 0, 0, 0, 0], lev: L.levers.map(function () { return 1; }), gear: [],
        keys: (1 << L.keys.length) - 1, grp: (1 << L.groups.length) - 1,
        seq: (1 << L.seqs.length) - 1, stars: 0, pos: L.start
      };
    }
    var combos = [[]];
    for (var cf = 0; cf < 6; cf++) {
      var opts = [];
      for (var a3 = L.scramble[cf]; ; a3 = (a3 + 1) % 4) { opts.push(a3); if (a3 === 0) break; }
      var next = [];
      for (var ci = 0; ci < combos.length; ci++) for (var oi = 0; oi < opts.length; oi++) next.push(combos[ci].concat([opts[oi]]));
      combos = next;
      if (combos.length > 6000) return reject('too many rotation states');
    }
    for (var cb = 0; cb < combos.length; cb++) {
      var probe = openState();
      probe.ang = combos[cb];
      if (!reaches(L, probe, L.start, L.exit)) continue;   // 全开都到不了，谈不上绕过
      for (var ng = 0; ng < L.gates.length; ng++) {
        var sp = openState();
        sp.ang = combos[cb];
        var gt2 = L.gates[ng];
        if (gt2.kind === 'key') sp.keys &= ~(1 << gt2.ref);
        else if (gt2.kind === 'gear') sp.grp &= ~(1 << gt2.ref);
        else if (gt2.kind === 'lever') sp.lev[gt2.ref] = 0;
        else if (gt2.kind === 'seq') sp.seq &= ~(1 << gt2.ref);
        if (reaches(L, sp, L.start, L.exit)) return reject('gate ' + ng + ' bypassable');
      }
    }

    // 星星：分散在各面的死路
    var allOpen = openState();
    var openReg = region(L, allOpen, L.start);
    if (openReg.dist[L.exit] < 0) return reject('exit sealed');
    var sc = floorCands(openReg);
    if (sc.length < 3) return reject('no star spots');
    var picked = [], pool = sc.slice();
    for (var s2 = 0; s2 < 3; s2++) {
      var bestC = null, bestScore = -1;
      for (var p = 0; p < pool.length; p++) {
        var cd = pool[p], score = (cd.dead ? 3 : 0) + (cd.off ? 2 : 0) + rng();
        var cf = faceOf(L, cd.cell);
        for (var pp = 0; pp < picked.length; pp++) {
          if (faceOf(L, picked[pp]) !== cf) score += 4;
          else { var xa = uvOf(L, cd.cell), ya = uvOf(L, picked[pp]); score += Math.min(Math.abs(xa[0] - ya[0]) + Math.abs(xa[1] - ya[1]), 6) * 0.5; }
        }
        if (score > bestScore) { bestScore = score; bestC = cd; }
      }
      if (!bestC) return reject('star pick failed');
      picked.push(bestC.cell);
      L.starOf[bestC.cell] = picked.length - 1;
      L.stars.push({ id: picked.length - 1, base: bestC.cell });
      used[bestC.cell] = 1;
      pool = pool.filter(function (x) { return x.cell !== bestC.cell; });
    }

    L.name = cfg.name; L.tip = cfg.tip;
    var init = createState(L);
    var plan = solve(L, init);
    if (!plan) return reject('unsolvable');
    if (!verify(L, init, plan)) return reject('plan verify failed');
    L.plan = plan;
    L.parMoves = Math.max(14, estimateMoves(L, plan));
    L.energy = GX.DIFFICULTIES[diff].energy ? Math.round(L.parMoves * 1.75 + 26) : 0;
    return L;
  }

  function applyAction(L, s, a) {
    if (a.type === 'twist') {
      var f = a.ref, on = faceOf(L, s.pos) === f;
      var b = on ? baseOf(L, s, s.pos) : -1;
      s.ang[f] = (s.ang[f] + 1) % 4;
      if (on) s.pos = curOf(L, s, b);
      return;
    }
    if (a.type === 'exit') return;
    s.pos = a.cell;
    if (a.type === 'gear') {
      var plan = gearPlan(L, s, a.ref) || [];
      plan.forEach(function (gid) { clickGear(L, s, gid); });
      s.grp |= 1 << a.ref;
    } else if (a.type === 'lever') s.lev[a.ref] ^= 1;
    else if (a.type === 'seq') s.seq |= 1 << a.ref;
  }

  function verify(L, from, plan) {
    var s = cloneState(from);
    settle(L, s);
    for (var i = 0; i < plan.length; i++) {
      var a = plan[i];
      if (a.type === 'exit') return region(L, s, s.pos).dist[curOf(L, s, L.exit)] >= 0;
      if (a.type !== 'twist') {
        var reg = region(L, s, s.pos);
        if (reg.dist[a.cell] < 0) return false;
      }
      applyAction(L, s, a);
      settle(L, s);
    }
    return false;
  }

  function estimateMoves(L, plan) {
    var s = createState(L), total = 0, guard = 0;
    function grabKeys() {
      var g = 0;
      while (g++ < 40) {
        var reg = region(L, s, s.pos), t = -1, bd = 1e9;
        for (var i = 0; i < L.keys.length; i++) {
          if (s.keys & (1 << i)) continue;
          var d = reg.dist[curOf(L, s, L.keys[i].base)];
          if (d >= 0 && d < bd) { bd = d; t = i; }
        }
        if (t < 0) return;
        total += bd; s.pos = curOf(L, s, L.keys[t].base); s.keys |= 1 << t;
      }
    }
    grabKeys();
    for (var i = 0; i < plan.length && guard++ < 300; i++) {
      var a = plan[i];
      if (a.type === 'twist') { applyAction(L, s, a); total += 1; grabKeys(); continue; }
      var reg = region(L, s, s.pos);
      if (a.type === 'exit') { total += Math.max(0, reg.dist[curOf(L, s, L.exit)]); break; }
      if (reg.dist[a.cell] < 0) return total + 50;
      total += reg.dist[a.cell];
      applyAction(L, s, a);
      if (a.type === 'gear') total += (gearPlan(L, s, a.ref) || []).length + 2;
      else if (a.type === 'seq') total += L.seqs[a.ref].pattern.length;
      else total += 1;
      grabKeys();
    }
    return total;
  }

  function buildLevel(diff, index) {
    var cfg = GX.LEVELS[diff][index];
    var base = (diff === 'easy' ? 2000 : diff === 'medium' ? 7000 : 13000) + index * 211;
    for (var a = 0; a < 420; a++) {
      var L = tryBuild(cfg, diff, base + a * 53 + 11);
      if (L) { L.index = index; L.id = diff + '-' + index; return L; }
    }
    var fb = { name: cfg.name, tip: '转齐六个面，捡起钥匙开门', size: 5, gates: ['key'], gearLinks: 0, gearSteps: 4, seq: 0, twist: 2, opposite: false };
    for (var b = 0; b < 120; b++) {
      var F = tryBuild(fb, diff, 990001 + b * 29);
      if (F) { F.index = index; F.id = diff + '-' + index; F.name = cfg.name; return F; }
    }
    throw new Error('cube level generation failed');
  }

  GX.level = {
    REJECT: REJECT, mulberry32: mulberry32, buildLevel: buildLevel,
    createState: createState, cloneState: cloneState,
    faceOf: faceOf, uvOf: uvOf, baseOf: baseOf, curOf: curOf, isRoom: isRoom, interior: interior,
    walkable: walkable, region: region, settle: settle, gateOpen: gateOpen,
    groupSolved: groupSolved, clickGear: clickGear, gearPlan: gearPlan,
    solve: solve, solveGates: solveGates, applyAction: applyAction, verify: verify,
    accessCells: accessCells, nearest: nearest, portalAt: portalAt, portalDest: portalDest, portalExit: portalExit, reaches: reaches
  };
})(window.GX = window.GX || {});