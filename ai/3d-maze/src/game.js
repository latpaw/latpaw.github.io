/* 游戏控制器：单人 / 双人合作、手柄与键盘、电视模式、分屏、提示、发条能量、胜负与存档 */
(function (GX) {
  'use strict';
  var T = window.THREE;
  var P = GX.PALETTE;
  var LV = GX.level;
  var C = GX.cube;
  var SAVE_KEY = 'gx-mazecube-save-v2';

  function loadSave() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* 隐私模式 */ }
    return { stars: {}, best: {}, unlocked: { easy: 1, medium: 1, hard: 1 }, difficulty: 'easy', audio: true, quality: 'high', guide: true, coop: false, tv: false };
  }

  function create(canvas, emitEvent) {
    var rv = GX.render.create(canvas, function (q, auto) {
      if (auto) { save.quality = q; persist(); if (mode === 'playing') emit('quality', { quality: q, auto: true }); }
    });
    var world = GX.world.create(rv);
    var pad = GX.pad.create();
    var save = loadSave();
    var mode = 'title';
    var L = null, S = null;
    var diff = save.difficulty || 'easy', index = 0;
    var coop = !!save.coop, tvMode = !!save.tv, splitOn = false;
    var fpsCap = save.fpsCap === 30 ? 30 : 60;
    var moves = 0, elapsed = 0, energy = 0, hintsLeft = 0, twists = 0;
    var seqShown = {}, seqProgress = 0, activeSeq = -1, seqPlaying = false;
    var guideOn = save.guide !== false;
    var twisting = false, lastFace = [-1, -1], userCameraAt = -99, levelToken = 0;
    var raycaster = new T.Raycaster();
    var ndc = new T.Vector2();
    var pointers = {}, dragId = null, dragged = false, downX = 0, downY = 0, downT = 0, pinchDist = 0;
    var rafId = 0, lastTime = 0, running = true;
    var scratch = new T.Vector3();
    var menuDiff = diff;

    function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) { /* 忽略 */ } }
    function emit(t, d) { if (emitEvent) emitEvent(t, d); }
    function toast(text, kind) { emit('toast', { text: text, kind: kind || 'info' }); }
    function countBits(v) { var n = 0; while (v) { n += v & 1; v >>= 1; } return n; }
    function centerCell(f) { var h = (L.N - 1) / 2; return f * L.per + h * L.N + h; }
    function nPlayers() { return coop ? 2 : 1; }
    function exitCell() { return LV.curOf(L, S, L.exit); }
    function atExit(i) { return world.playerCell(i) === exitCell(); }

    /* ---------------- 模式 ---------------- */
    function setCoop(v) {
      var was = coop;
      coop = !!v; save.coop = coop; persist();
      if (!coop && splitOn) setSplit(false);
      emit('mode', modeInfo());
      if (mode === 'title' || mode === 'menu') loadTitleScene();
      else if (was !== coop && L) {
        // 人数变了必须重建角色，本关重来一次，避免场上留下多余的小铜豆
        startLevel(diff, index);
        toast(coop ? '已切换为双人合作，本关重新开始' : '已切换为单人，本关重新开始', 'tip');
      }
    }
    function setTV(v) {
      tvMode = !!v; save.tv = tvMode; persist();
      document.body.classList.toggle('tv', tvMode);
      emit('mode', modeInfo());
      rv.resize();
    }
    function setSplit(v) {
      splitOn = !!v && coop;
      rv.setSplit(splitOn);
      document.body.classList.toggle('split', splitOn);
      if (splitOn) { focusFace(world.playerFace(0), 0); focusFace(world.playerFace(1), 1); }
      emit('mode', modeInfo());
    }
    function modeInfo() { return { coop: coop, tv: tvMode, split: splitOn, pads: pad.info() }; }

    /* ---------------- 关卡 ---------------- */
    function startLevel(d, i) {
      diff = d; index = i; levelToken++;
      save.difficulty = d; persist();
      L = LV.buildLevel(d, i);
      S = LV.createState(L);
      moves = 0; elapsed = 0; twists = 0;
      seqShown = {}; seqProgress = 0; activeSeq = -1; seqPlaying = false;
      twisting = false; lastFace = [-1, -1];
      var cfg = GX.DIFFICULTIES[d];
      hintsLeft = cfg.hints;
      energy = cfg.energy ? Math.round(L.energy * (coop ? 1.7 : 1)) : 0;
      world.load(L, S, nPlayers());
      for (var k = 0; k < nPlayers(); k++) { world.teleport(k, S.pos); lastFace[k] = LV.faceOf(L, S.pos); }
      rv.cam.tTheta = -Math.PI * 0.28; rv.cam.tPhi = 1.06;
      rv.frameCube(L.N);
      focusFace(LV.faceOf(L, S.pos));
      rv.cam.tRadius = rv.fitDistance(L.N, splitOn ? undefined : undefined);
      if (splitOn) { focusFace(world.playerFace(0), 0); focusFace(world.playerFace(1), 1); }
      mode = 'playing';
      emit('level', levelInfo());
      refreshGuide();
      toast(coop ? '两人一起：钥匙机关共享，两人都站上传送门才算通关' : L.tip, 'tip');
      GX.audio.start();
    }

    function loadTitleScene() {
      L = LV.buildLevel('medium', 1);
      S = LV.createState(L);
      world.load(L, S, nPlayers());
      for (var k = 0; k < nPlayers(); k++) world.teleport(k, S.pos);
      rv.cam.tPhi = 1.02;
      rv.cam.tTheta = -Math.PI * 0.3;
      rv.cam.tRadius = rv.fitDistance(L.N) * 1.28;
      mode = 'title';
      emit('title', {});
    }

    function restart() { startLevel(diff, index); }

    function levelInfo() {
      var cfg = GX.DIFFICULTIES[diff];
      return {
        id: L.id, name: L.name, tip: L.tip, diff: diff, index: index,
        diffLabel: cfg.label, age: cfg.age, color: cfg.color, size: L.N,
        par: L.parMoves, energyMax: cfg.energy ? Math.round(L.energy * (coop ? 1.7 : 1)) : 0,
        total: GX.LEVELS[diff].length, coop: coop,
        twisted: L.scramble.filter(function (a) { return a !== 0; }).length
      };
    }

    function focusFace(f, which) {
      rv.focusFace(C.FACES[f].n, splitOn ? which : undefined);
    }

    /* ---------------- 目标 ---------------- */
    function objectives() {
      if (!L) return [];
      var out = [];
      var aligned = S.ang.filter(function (a) { return a === 0; }).length;
      out.push({ icon: 'cube', color: '#a986f0', label: '面对齐 ' + aligned + '/6', done: aligned === 6 });
      L.keys.forEach(function (k) {
        out.push({ icon: 'key', color: GX.KEY_COLORS[k.color].css, label: GX.KEY_COLORS[k.color].name + '钥匙', done: !!(S.keys & (1 << k.id)) });
      });
      L.groups.forEach(function (g) {
        var ok = g.gears.filter(function (id) { return S.gear[id] === 0; }).length;
        out.push({ icon: 'gear', color: '#ffc53d', label: '齿轮组 ' + ok + '/' + g.gears.length, done: !!(S.grp & (1 << g.id)) });
      });
      L.levers.forEach(function (lv) { out.push({ icon: 'lever', color: '#9be832', label: '木桥拉杆', done: !!S.lev[lv.id] }); });
      L.seqs.forEach(function (sq) {
        out.push({
          icon: 'seq', color: '#31e1f7',
          label: '水晶顺序 ' + (S.seq & (1 << sq.id) ? sq.pattern.length : (activeSeq === sq.id ? seqProgress : 0)) + '/' + sq.pattern.length,
          done: !!(S.seq & (1 << sq.id)), action: (S.seq & (1 << sq.id)) ? null : 'replay'
        });
      });
      if (L.portals.length) {
        var oneN = L.portals.filter(function (p) { return !p.twoWay; }).length;
        out.push({
          icon: 'portal', color: '#31e1f7', info: true, done: false,
          label: '传送门 ' + L.portals.length + ' 对' + (oneN ? '（' + oneN + ' 单向）' : '（全双向）')
        });
      }
      out.push({ icon: 'star', color: '#ffc53d', label: '星星 ' + countBits(S.stars) + '/3', done: countBits(S.stars) === 3 });
      var exitLabel = '抵达传送门';
      if (coop) {
        exitLabel = '传送门 P' + (atExit(0) ? '1✓' : '1…') + ' P' + (atExit(1) ? '2✓' : '2…');
      }
      out.push({ icon: 'exit', color: '#ff53c8', label: exitLabel, done: false });
      return out;
    }

    function status() {
      var pl = [];
      for (var i = 0; i < nPlayers(); i++) {
        pl.push({ face: world.playerFace(i), atExit: L ? atExit(i) : false, moving: world.playerMoving(i) });
      }
      return {
        mode: mode, moves: moves, twists: twists, time: elapsed, stars: countBits(S ? S.stars : 0),
        energy: energy, energyMax: L && GX.DIFFICULTIES[diff].energy ? Math.round(L.energy * (coop ? 1.7 : 1)) : 0,
        hints: hintsLeft, guide: guideOn && GX.DIFFICULTIES[diff].guide,
        objectives: objectives(), nearSeq: activeSeq >= 0,
        face: world.playerFace(0), players: pl, coop: coop, tv: tvMode,
        split: splitOn && mode !== 'title' && mode !== 'menu',
        aligned: S ? S.ang.map(function (a) { return a === 0; }) : [],
        fps: Math.round(rv.fps), calls: rv.drawCalls, quality: rv.quality, pads: pad.info(), fpsCap: fpsCap
      };
    }

    /* ---------------- 行走 ---------------- */
    function regionOf(i) { return LV.region(L, S, world.playerCell(i)); }
    function pathTo(i, cell) {
      var reg = regionOf(i);
      if (reg.dist[cell] < 0) return null;
      var out = [], cur = cell, guard = 0;
      while (cur !== world.playerCell(i) && cur >= 0 && guard++ < 4000) { out.push(cur); cur = reg.prev[cur]; }
      out.reverse();
      return out;
    }
    function tryWalkTo(i, cell, after) {
      var path = pathTo(i, cell);
      if (!path) return false;
      if (i === 0) world.showPath(path);
      if (!path.length) { if (after) after(); return true; }
      world.walkPath(i, path, GX.DIFFICULTIES[diff].moveSpeed, function () {
        if (i === 0) world.showPath([]);
        if (after) after();
      }, onStepCell);
      return true;
    }

    function onStepCell(cell, idx) {
      moves++;
      if (GX.DIFFICULTIES[diff].energy) {
        energy--;
        if (energy <= 0) { energy = 0; lose(); return; }
        if (energy === Math.round(L.energy * 0.2)) toast('发条快松了，走近路！', 'warn');
      }
      if (world.lastStepTeleport(idx)) {
        GX.audio.warp();
        rv.flash(P.cyan, 0.2);
        rv.shake(0.07);
        toast((coop ? 'P' + (idx + 1) + ' ' : '') + '穿过传送门 → ' + C.FACES[LV.faceOf(L, cell)].name, 'good');
      } else {
        GX.audio.step();
      }
      var f = LV.faceOf(L, cell);
      if (f !== lastFace[idx]) {
        lastFace[idx] = f;
        var n = C.FACES[f].n;
        var camPos = (splitOn && idx === 1) ? rv.cameraB.position : rv.camera.position;
        scratch.copy(camPos).normalize();
        if (new T.Vector3(n[0], n[1], n[2]).dot(scratch) < 0.45 && elapsed - userCameraAt > 2.5) {
          focusFace(f, idx);
          if (!coop) toast('走到' + C.FACES[f].name + '了', 'info');
        }
        emit('face', { face: f, player: idx });
      }
      var base = LV.baseOf(L, S, cell);
      var changed = false;
      var ki = L.keyOf[base];
      if (ki >= 0 && !(S.keys & (1 << ki))) {
        S.keys |= 1 << ki; changed = true;
        GX.audio.key();
        rv.flash(GX.KEY_COLORS[L.keys[ki].color].hex, 0.16);
        toast((coop ? 'P' + (idx + 1) + ' ' : '') + '拿到' + GX.KEY_COLORS[L.keys[ki].color].name + '钥匙！', 'good');
      }
      var si = L.starOf[base];
      if (si >= 0 && !(S.stars & (1 << si))) {
        S.stars |= 1 << si; changed = true;
        GX.audio.star(); rv.flash(P.amber, 0.13); rv.shake(0.05);
        toast('星星 +1  (' + countBits(S.stars) + '/3)', 'good');
      }
      if (changed) { world.syncState(S); refreshGuide(); }
      emit('status', status());
      checkWin();
    }

    function checkWin() {
      if (mode !== 'playing') return;
      for (var i = 0; i < nPlayers(); i++) if (!atExit(i)) {
        if (coop) {
          var other = atExit(1 - i);
          if (other) emit('waiting', { waiting: i });
        }
        return;
      }
      win();
    }

    function nearestAccess(baseCell, i) {
      var reg = regionOf(i);
      var acc = LV.accessCells(L, S, reg, LV.curOf(L, S, baseCell));
      if (!acc.length) return null;
      return LV.nearest(reg, acc).cell;
    }
    function spendEnergy(n) {
      if (!GX.DIFFICULTIES[diff].energy) return;
      energy -= n;
      if (energy <= 0) { energy = 0; lose(); }
    }

    /* ---------------- 机关 ---------------- */
    function twistFace(f, idx) {
      if (twisting || world.anyMoving()) return;
      twisting = true;
      var wasAligned = S.ang[f] === 0;
      var riders = [];
      for (var i = 0; i < nPlayers(); i++) {
        if (LV.faceOf(L, world.playerCell(i)) === f) riders.push({ i: i, base: LV.baseOf(L, S, world.playerCell(i)) });
      }
      S.ang[f] = (S.ang[f] + 1) % 4;
      riders.forEach(function (r) { S.pos = LV.curOf(L, S, r.base); });
      moves++; twists++;
      spendEnergy(1);
      GX.audio.rotor();
      rv.shake(0.055);
      world.twistFace(f, function () {
        twisting = false;
        riders.forEach(function (r) { world.teleport(r.i, LV.curOf(L, S, r.base)); });
        world.updateAlignGlow();
        refreshGuide();
        emit('status', status());
        if (S.ang.every(function (a) { return a === 0; })) {
          GX.audio.solved(); rv.flash(P.lime, 0.18);
          toast('六个面全部对齐！通道连通了', 'good');
        } else if (!wasAligned && S.ang[f] === 0 && GX.DIFFICULTIES[diff].alignGlow === 'each') {
          GX.audio.solved();
          toast(C.FACES[f].name + '对齐了', 'good');
        }
        checkWin();
      });
      world.updateAlignGlow();
      emit('status', status());
    }

    function interactGear(id, idx) {
      var g = L.gears[id];
      var spot = nearestAccess(g.base, idx);
      if (spot == null) { toast('还走不到那个齿轮，先转齐面', 'warn'); GX.audio.bump(); return; }
      tryWalkTo(idx, spot, function () {
        LV.clickGear(L, S, id);
        moves++; spendEnergy(1);
        GX.audio.gear(); rv.shake(0.03);
        world.emit(world.deviceWorldPos('gear', id), P.amber, 7, 0.6);
        if (!(S.grp & (1 << g.group)) && LV.groupSolved(L, S, g.group)) {
          S.grp |= 1 << g.group;
          GX.audio.solved(); rv.flash(P.lime, 0.2);
          toast('齿轮对齐了，门开了！', 'good');
          setTimeout(function () { GX.audio.door(); }, 180);
        }
        world.syncState(S); refreshGuide(); emit('status', status());
      });
    }
    function interactLever(id, idx) {
      var lv = L.levers[id];
      var spot = nearestAccess(lv.base, idx);
      if (spot == null) { toast('还走不到那个拉杆', 'warn'); GX.audio.bump(); return; }
      tryWalkTo(idx, spot, function () {
        S.lev[id] ^= 1;
        moves++; spendEnergy(1);
        GX.audio.lever();
        setTimeout(function () { GX.audio.bridge(); }, 120);
        rv.shake(0.045);
        toast(S.lev[id] ? '木桥升起来了！' : '木桥收回去了', S.lev[id] ? 'good' : 'info');
        world.syncState(S); refreshGuide(); emit('status', status());
      });
    }
    function playSequence(sq, then) {
      if (seqPlaying) return;
      seqPlaying = true; activeSeq = sq.id; seqProgress = 0;
      world.clearLamps(sq.id);
      emit('status', status());
      toast('记住水晶亮起的顺序', 'tip');
      var k = 0, token = levelToken;
      var step = function () {
        if (token !== levelToken) { seqPlaying = false; return; }
        if (k >= sq.pattern.length) {
          seqPlaying = false; world.clearLamps(sq.id);
          toast('该你了！按顺序点水晶', 'tip');
          emit('status', status());
          if (then) then();
          return;
        }
        var li = sq.pattern[k];
        world.pulseLamp(sq.id, li, 1.25);
        GX.audio.lamp(li);
        k++;
        setTimeout(step, 540);
      };
      setTimeout(step, 400);
    }
    function interactLamp(seqId, li, idx) {
      var sq = L.seqs[seqId];
      if (S.seq & (1 << seqId)) { toast('这道水晶锁已经解开啦', 'info'); return; }
      if (seqPlaying) return;
      var spot = nearestAccess(sq.lamps[li], idx);
      if (spot == null) { toast('还走不到那颗水晶', 'warn'); GX.audio.bump(); return; }
      tryWalkTo(idx, spot, function () {
        activeSeq = seqId;
        if (!seqShown[seqId]) { seqShown[seqId] = true; playSequence(sq); return; }
        if (li === sq.pattern[seqProgress]) {
          seqProgress++;
          world.pulseLamp(seqId, li, 1.25);
          GX.audio.lamp(li);
          moves++;
          if (seqProgress >= sq.pattern.length) {
            S.seq |= 1 << seqId; seqProgress = 0; activeSeq = -1;
            GX.audio.solved(); rv.flash(P.cyan, 0.22);
            toast('水晶锁解开了！', 'good');
            setTimeout(function () { GX.audio.door(); }, 200);
            world.syncState(S); refreshGuide();
          }
          emit('status', status());
        } else {
          seqProgress = 0;
          GX.audio.wrong(); rv.shake(0.06); rv.flash(P.ruby, 0.14);
          toast('顺序不对，再看一次吧', 'warn');
          emit('status', status());
          var tk = levelToken;
          setTimeout(function () { if (tk === levelToken) playSequence(sq); }, 480);
        }
      });
    }
    function replaySequence() {
      if (!L || !L.seqs.length) return;
      if (activeSeq < 0 || (S.seq & (1 << activeSeq))) {
        activeSeq = -1;
        for (var i = 0; i < L.seqs.length; i++) if (!(S.seq & (1 << i))) { activeSeq = i; break; }
        if (activeSeq < 0) return;
      }
      playSequence(L.seqs[activeSeq]);
    }

    // 手柄没有指针：B 键自动找最近且还没解开的机关，走过去并操作
    function interactNearest(idx) {
      if (mode !== 'playing' || world.playerMoving(idx) || twisting) return;
      var reg = regionOf(idx), here = world.playerCell(idx);
      var cands = [];
      function consider(base, kind, id, lamp, done) {
        var cur = LV.curOf(L, S, base);
        var acc = LV.accessCells(L, S, reg, cur);
        if (!acc.length) return;
        var n = LV.nearest(reg, acc);
        var adjacent = acc.indexOf(here) >= 0;
        cands.push({ kind: kind, id: id, lamp: lamp, dist: n.dist, done: done, adjacent: adjacent });
      }
      L.gears.forEach(function (g) { consider(g.base, 'gear', g.id, 0, S.gear[g.id] === 0); });
      L.levers.forEach(function (lv) { consider(lv.base, 'lever', lv.id, 0, !!S.lev[lv.id] && LV.gateOpen(L, S, lv.gate)); });
      L.seqs.forEach(function (sq) {
        if (S.seq & (1 << sq.id)) return;
        var next = sq.pattern[seqProgress] || 0;
        consider(sq.lamps[activeSeq === sq.id ? next : 0], 'lamp', sq.id, activeSeq === sq.id ? next : 0, false);
      });
      if (!cands.length) { toast('附近没有可操作的机关', 'info'); GX.audio.bump(); return; }
      cands.sort(function (a, b) {
        if (a.adjacent !== b.adjacent) return a.adjacent ? -1 : 1;
        if (a.done !== b.done) return a.done ? 1 : -1;
        return a.dist - b.dist;
      });
      var t = cands[0];
      if (t.kind === 'gear') interactGear(t.id, idx);
      else if (t.kind === 'lever') interactLever(t.id, idx);
      else interactLamp(t.id, t.lamp, idx);
    }

    /* ---------------- 提示与指路 ---------------- */
    function planFor(i) {
      var probe = LV.cloneState(S);
      probe.pos = world.playerCell(i);
      return LV.solve(L, probe);
    }
    function hintTarget() {
      var best = null, bd = 1e9, who = 0;
      for (var p = 0; p < nPlayers(); p++) {
        var reg = regionOf(p);
        for (var i = 0; i < L.keys.length; i++) {
          if (S.keys & (1 << i)) continue;
          var cc = LV.curOf(L, S, L.keys[i].base);
          var d = reg.dist[cc];
          if (d >= 0 && d < bd) { bd = d; best = { cell: cc, text: '先去拿' + GX.KEY_COLORS[L.keys[i].color].name + '钥匙', kind: 'key', who: p }; who = p; }
        }
      }
      if (best) return best;
      var plan = planFor(0), src = 0;
      if (!plan && coop) { plan = planFor(1); src = 1; }
      if (!plan || !plan.length) return null;
      var a = plan[0];
      if (a.type === 'twist') return { cell: centerCell(a.ref), text: '转动' + C.FACES[a.ref].name + '，让棱边通道接上', kind: 'twist', face: a.ref, who: src };
      if (a.type === 'exit') return { cell: exitCell(), text: '机关都解开了，去传送门！', kind: 'exit', who: src };
      if (a.type === 'gear') {
        var probe = LV.cloneState(S); probe.pos = world.playerCell(src);
        var gp = LV.gearPlan(L, probe, a.ref);
        var gid = gp && gp.length ? gp[0] : L.groups[a.ref].gears[0];
        return { cell: LV.curOf(L, S, L.gears[gid].base), text: '转动这个齿轮，缺口对准白指针', kind: 'gear', who: src };
      }
      if (a.type === 'lever') return { cell: LV.curOf(L, S, L.levers[a.ref].base), text: '扳下拉杆，升起木桥', kind: 'lever', who: src };
      if (a.type === 'seq') return { cell: LV.curOf(L, S, L.seqs[a.ref].lamps[0]), text: '记住水晶顺序再照着点', kind: 'seq', who: src };
      return null;
    }
    function useHint() {
      if (mode !== 'playing') return;
      if (hintsLeft <= 0) { toast('这一关提示用完啦，自己试试！', 'warn'); GX.audio.wrong(); return; }
      var t = hintTarget();
      if (!t) { toast('已经全部解开，去传送门吧！', 'good'); return; }
      if (hintsLeft !== Infinity) hintsLeft--;
      world.setHint(t.cell);
      if (t.kind === 'twist') focusFace(t.face, t.who);
      var pp = pathTo(t.who || 0, t.cell);
      var needWarp = false;
      if (pp && pp.length) {
        var prevC = world.playerCell(t.who || 0);
        for (var pi = 0; pi < pp.length; pi++) {
          var adj = false;
          for (var pd = 0; pd < 4; pd++) if (L.topo.nbr[prevC * 4 + pd] === pp[pi]) adj = true;
          if (!adj) { needWarp = true; break; }
          prevC = pp[pi];
        }
      }
      toast('提示' + (coop ? '（P' + (t.who + 1) + '）' : '') + '：' + t.text + (needWarp ? '（路上要穿传送门）' : ''), 'tip');
      GX.audio.ui();
      var tk = levelToken;
      setTimeout(function () { if (tk === levelToken) world.setHint(-1); }, 6500);
      emit('status', status());
    }
    function refreshGuide() {
      if (!L) return;
      if (!(guideOn && GX.DIFFICULTIES[diff].guide) || mode !== 'playing') { world.showGuide([]); return; }
      var t = hintTarget();
      if (!t) { world.showGuide([]); return; }
      var dest = t.cell, who = t.who || 0;
      if (t.kind === 'gear' || t.kind === 'lever' || t.kind === 'seq') {
        var spot = nearestAccess(LV.baseOf(L, S, dest), who);
        if (spot != null) dest = spot;
      }
      world.showGuide(pathTo(who, dest) || []);
    }
    function toggleGuide() {
      guideOn = !guideOn;
      save.guide = guideOn; persist();
      refreshGuide(); emit('status', status()); GX.audio.ui();
      toast(guideOn ? '指路已开启' : '指路已关闭', 'info');
    }

    /* ---------------- 胜负 ---------------- */
    function win() {
      if (mode !== 'playing') return;
      mode = 'won';
      world.stopWalk(); world.showPath([]); world.showGuide([]); world.setHint(-1);
      world.celebrate();
      rv.flash(0xffffff, 0.32); rv.shake(0.12);
      GX.audio.win();
      var stars = countBits(S.stars);
      var key = L.id + (coop ? '-coop' : '');
      if (stars > (save.stars[key] || 0)) save.stars[key] = stars;
      var bt = save.best[key];
      if (!bt || moves < bt.moves) save.best[key] = { moves: moves, time: Math.round(elapsed) };
      var un = save.unlocked[diff] || 1;
      if (index + 2 > un && index + 1 < GX.LEVELS[diff].length) save.unlocked[diff] = index + 2;
      persist();
      emit('win', {
        stars: stars, moves: moves, twists: twists, time: Math.round(elapsed), par: L.parMoves,
        hasNext: index + 1 < GX.LEVELS[diff].length, diff: diff, index: index, name: L.name,
        totalStars: totalStars(), coop: coop
      });
    }
    function lose() {
      if (mode !== 'playing') return;
      mode = 'lost';
      world.stopWalk(); world.showPath([]); world.showGuide([]);
      rv.flash(P.ruby, 0.28); rv.shake(0.16);
      GX.audio.lose();
      emit('lose', { moves: moves, stars: countBits(S.stars), name: L.name });
    }
    function totalStars() { var n = 0; Object.keys(save.stars).forEach(function (k) { n += save.stars[k]; }); return n; }
    function pause() { if (mode === 'playing') { mode = 'paused'; emit('pause', status()); } }
    function resume() { if (mode === 'paused') { mode = 'playing'; emit('resume', status()); } }
    function toMenu() { mode = 'menu'; world.stopWalk(); world.showPath([]); world.showGuide([]); world.setHint(-1); emit('menu', {}); }

    /* ---------------- 指针输入（单人 / 鼠标仍可用） ---------------- */
    function pickAt(cx, cy) {
      var rect = canvas.getBoundingClientRect();
      var cam = rv.camera, vx = cx - rect.left, vw = rect.width;
      if (splitOn) {
        if (vx > rect.width / 2) { cam = rv.cameraB; vx -= rect.width / 2; }
        vw = rect.width / 2;
      }
      ndc.x = (vx / vw) * 2 - 1;
      ndc.y = -((cy - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, cam);
      var hits = raycaster.intersectObjects(world.pickables, true);
      for (var i = 0; i < hits.length; i++) {
        var o = hits[i].object, vis = true, p = o;
        while (p) { if (p.visible === false) { vis = false; break; } p = p.parent; }
        if (!vis) continue;
        while (o && !o.userData.pick) o = o.parent;
        if (o && o.userData.pick) return { pick: o.userData.pick };
      }
      var gh = raycaster.intersectObjects(world.planes, false);
      if (gh.length) {
        var pl = gh[0].object, f = pl.userData.face;
        var lp = pl.worldToLocal(gh[0].point.clone());
        var u = Math.round(lp.x + (L.N - 1) / 2), v = Math.round(lp.z + (L.N - 1) / 2);
        if (u >= 0 && u < L.N && v >= 0 && v < L.N) return { cell: f * L.per + v * L.N + u };
      }
      return null;
    }

    function handleTap(x, y) {
      if (mode !== 'playing' || twisting) return;
      var hit = pickAt(x, y);
      if (!hit) return;
      GX.audio.start();
      var rect = canvas.getBoundingClientRect();
      var idx = (splitOn && x - rect.left > rect.width / 2) ? 1 : 0;
      if (world.playerMoving(idx)) return;
      if (hit.pick) {
        var pk = hit.pick;
        if (pk.kind === 'twist') twistFace(pk.face, idx);
        else if (pk.kind === 'gear') interactGear(pk.id, idx);
        else if (pk.kind === 'lever') interactLever(pk.id, idx);
        else if (pk.kind === 'lamp') interactLamp(pk.id, pk.lamp, idx);
        return;
      }
      var cell = hit.cell;
      if (cell === centerCell(LV.faceOf(L, cell))) { twistFace(LV.faceOf(L, cell), idx); return; }
      var pInfo = LV.portalAt(L, S, cell);
      if (pInfo) {
        var out = LV.portalDest(L, S, cell);
        if (out < 0) { toast('这道门现在被挡住了', 'warn'); GX.audio.bump(); return; }
        if (!tryWalkTo(idx, out)) { toast('还走不到这道传送门', 'warn'); GX.audio.bump(); }
        return;
      }
      if (L.portalOf[LV.baseOf(L, S, cell)] >= 0) { toast('这是单向门的出口，只能出不能进', 'info'); GX.audio.bump(); return; }
      if (!LV.walkable(L, S, cell)) {
        var base = LV.baseOf(L, S, cell);
        var di = L.doorOf[base];
        if (di >= 0) {
          var g = L.gates[di];
          var need = g.kind === 'key' ? GX.KEY_COLORS[L.keys[g.ref].color].name + '钥匙' : g.kind === 'gear' ? '把齿轮组对齐' : '解开水晶顺序';
          toast('这扇门锁着，需要' + need, 'warn');
        } else if (L.bridgeOf[base] >= 0) toast('这里是缺口，先扳拉杆升起木桥', 'warn');
        else toast('那是墙，走不过去哦', 'info');
        GX.audio.bump(); rv.shake(0.025);
        return;
      }
      if (!tryWalkTo(idx, cell)) { toast('现在走不到那里，先转齐面或解开机关', 'warn'); GX.audio.bump(); }
    }

    function stepDir(idx, d) {
      if (mode !== 'playing' || world.playerMoving(idx) || twisting) return;
      var cur = world.playerCell(idx);
      var cell = L.topo.nbr[cur * 4 + d];
      if (cell < 0) return;
      if (!LV.walkable(L, S, cell)) { GX.audio.bump(); rv.shake(0.022); return; }
      // 门格不能停留：朝门走一步 = 直接被送到落点
      var pd = LV.portalDest(L, S, cell);
      if (pd >= 0) { tryWalkTo(idx, pd); return; }
      if (L.portalOf[LV.baseOf(L, S, cell)] >= 0) { GX.audio.bump(); rv.shake(0.022); return; }
      tryWalkTo(idx, cell);
    }

    function camFor(idx) { return (splitOn && idx === 1) ? rv.camB : rv.cam; }
    function orbitBy(dx, dy, idx) {
      var cs = camFor(idx == null ? 0 : idx);
      cs.tTheta -= dx * 0.0062;
      cs.tPhi = Math.max(0.05, Math.min(Math.PI - 0.05, cs.tPhi - dy * 0.0052));
      cs.idle = 0;
      userCameraAt = elapsed;
    }
    function zoomBy(f, idx) {
      var cs = camFor(idx == null ? 0 : idx);
      cs.tRadius = Math.max(cs.minR, Math.min(cs.maxR, cs.tRadius * f));
      cs.idle = 0;
      userCameraAt = elapsed;
    }
    function resetCamera() {
      focusFace(world.playerFace(0), 0);
      if (splitOn) focusFace(world.playerFace(1), 1);
      var r = rv.fitDistance(L.N);
      rv.cam.tRadius = r; rv.camB.tRadius = r;
      GX.audio.ui();
    }

    function onDown(e) {
      pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pointers);
      if (ids.length === 1) {
        dragId = e.pointerId; dragged = false;
        downX = e.clientX; downY = e.clientY; downT = performance.now();
        try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* 忽略 */ }
      } else if (ids.length === 2) {
        var a = pointers[ids[0]], b = pointers[ids[1]];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
        dragId = null; dragged = true;
      }
      rv.bumpIdle();
    }
    function onMove(e) {
      var prev = pointers[e.pointerId];
      if (prev) {
        var dx = e.clientX - prev.x, dy = e.clientY - prev.y;
        prev.x = e.clientX; prev.y = e.clientY;
        var ids = Object.keys(pointers);
        if (ids.length >= 2) {
          var a = pointers[ids[0]], b = pointers[ids[1]];
          var d = Math.hypot(a.x - b.x, a.y - b.y);
          if (pinchDist > 0) zoomBy(pinchDist / Math.max(1, d));
          pinchDist = d;
          return;
        }
        if (e.pointerId === dragId) {
          if (!dragged && Math.hypot(e.clientX - downX, e.clientY - downY) > 7) dragged = true;
          if (dragged) {
            var rect = canvas.getBoundingClientRect();
            orbitBy(dx, dy, (splitOn && downX - rect.left > rect.width / 2) ? 1 : 0);
            world.setHover(-1);
          }
        }
      } else if (e.pointerType === 'mouse' && mode === 'playing') {
        var hit = pickAt(e.clientX, e.clientY);
        if (hit && hit.cell != null) {
          var ok = LV.walkable(L, S, hit.cell);
          world.setHover(hit.cell, ok);
          canvas.style.cursor = ok ? 'pointer' : 'not-allowed';
        } else if (hit && hit.pick) { world.setHover(-1); canvas.style.cursor = 'pointer'; }
        else { world.setHover(-1); canvas.style.cursor = 'grab'; }
      }
    }
    function onUp(e) {
      var wasDrag = dragged, quick = performance.now() - downT < 600;
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length < 2) pinchDist = 0;
      if (e.pointerId === dragId) {
        dragId = null;
        if (!wasDrag && quick) handleTap(e.clientX, e.clientY);
      }
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* 已释放 */ }
    }
    function onWheel(e) {
      e.preventDefault();
      var rect = canvas.getBoundingClientRect();
      zoomBy(Math.exp(e.deltaY * 0.0012), (splitOn && e.clientX - rect.left > rect.width / 2) ? 1 : 0);
    }
    function onKeyGlobal(e) {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      var k = e.key.toLowerCase();
      if (k === 'escape') { if (mode === 'playing') pause(); else if (mode === 'paused') resume(); }
      else if (k === 'c' && mode === 'playing') resetCamera();
      else if (k >= '1' && k <= '6' && mode === 'playing') focusFace(parseInt(k, 10) - 1, 0);
    }

    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyGlobal);
    canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    window.addEventListener('resize', function () { rv.resize(); });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (mode === 'playing') pause(); GX.audio.setActive(false); }
      else { GX.audio.setActive(true); lastTime = performance.now(); }
    });
    window.addEventListener('blur', function () { GX.audio.setActive(false); });
    window.addEventListener('focus', function () { GX.audio.setActive(true); });
    pad.onChange(function (info) { emit('pads', info); });

    /* ---------------- 手柄 / 键盘轮询 ---------------- */
    function applyPad(inp, idx) {
      if (mode === 'title' || mode === 'menu') {
        if (idx !== 0) return;
        if (inp.step === 0 || inp.step === 3) { menuDiff = cycleDiff(-1); emit('menuSelect', { diff: menuDiff }); GX.audio.ui(); }
        if (inp.step === 2 || inp.step === 1) { menuDiff = cycleDiff(1); emit('menuSelect', { diff: menuDiff }); GX.audio.ui(); }
        if (inp.confirm) { emit('menuStart', { diff: menuDiff }); }
        if (inp.hint) emit('menuHelp', {});
        return;
      }
      if (mode === 'won') { if (inp.confirm) emit('menuNext', {}); return; }
      if (mode === 'lost') { if (inp.confirm) restart(); return; }
      if (inp.pause) { if (mode === 'playing') pause(); else if (mode === 'paused') resume(); return; }
      if (mode === 'paused') { if (inp.confirm) resume(); return; }
      if (mode !== 'playing') return;
      if (inp.split && coop) setSplit(!splitOn);
      if (inp.restart) { restart(); return; }
      if (inp.orbitX || inp.orbitY) orbitBy(inp.orbitX * 340 * lastDt, inp.orbitY * 300 * lastDt, idx);
      if (inp.zoom) zoomBy(Math.exp(inp.zoom * 1.1 * lastDt), idx);
      if (inp.facePrev) { focusFace((world.playerFace(idx) + 5) % 6, idx); GX.audio.ui(); }
      if (inp.faceNext) { focusFace((world.playerFace(idx) + 1) % 6, idx); GX.audio.ui(); }
      if (inp.hint) useHint();
      if (inp.twist) twistFace(world.playerFace(idx), idx);
      if (inp.interact) interactNearest(idx);
      if (inp.step >= 0) stepDir(idx, inp.step);
    }
    function cycleDiff(d) {
      var order = ['easy', 'medium', 'hard'];
      var i = order.indexOf(menuDiff);
      return order[(i + d + 3) % 3];
    }

    /* ---------------- 主循环 ---------------- */
    var statAcc = 0, lastDt = 0.016;
    function frame(now) {
      rafId = requestAnimationFrame(frame);
      if (!running) return;
      // 页面不可见时一帧都不画，风扇不该为后台标签页转
      if (document.hidden) { lastTime = now; return; }
      var raw = (now - lastTime) / 1000 || 0.016;
      var cap = fpsCap;
      if (mode === 'paused' || mode === 'title' || mode === 'menu') cap = Math.min(cap, 30);
      if (rv.quality === 'low') cap = Math.min(cap, 30);
      if (raw < 1 / cap - 0.002) return;
      var dt = Math.min(0.05, raw);
      lastTime = now; lastDt = dt;
      var wantSplit = splitOn && mode !== 'title' && mode !== 'menu';
      if (rv.splitOn !== wantSplit) rv.setSplit(wantSplit);
      var inputs = pad.poll(dt, coop);
      applyPad(inputs[0], 0);
      if (coop) applyPad(inputs[1], 1);
      if (mode === 'playing') {
        elapsed += dt;
        statAcc += dt;
        if (statAcc > 0.25) { statAcc = 0; emit('status', status()); }
      }
      if (mode === 'title') { rv.cam.tTheta += dt * 0.085; rv.bumpIdle(); }
      if (mode === 'won') { rv.cam.tTheta += dt * 0.14; rv.bumpIdle(); }
      world.update(mode === 'paused' ? 0 : dt);
      rv.renderFrame(dt, raw, 1000 / cap);
    }
    rafId = requestAnimationFrame(frame);
    rv.setQuality(save.quality || 'high', false, true);
    if (save.audio === false) GX.audio.setEnabled(false);
    document.body.classList.toggle('tv', tvMode);

    return {
      rv: rv, world: world, save: save, pad: pad,
      startLevel: startLevel, loadTitleScene: loadTitleScene, restart: restart,
      pause: pause, resume: resume, toMenu: toMenu,
      useHint: useHint, toggleGuide: toggleGuide, replaySequence: replaySequence,
      resetCamera: resetCamera, orbitBy: orbitBy, zoomBy: zoomBy, stepDir: stepDir,
      twistFace: twistFace, focusFace: focusFace, interactNearest: interactNearest,
      setCoop: setCoop, setTV: setTV, setSplit: setSplit, modeInfo: modeInfo,
      status: status, levelInfo: levelInfo, totalStars: totalStars, persist: persist,
      get mode() { return mode; },
      get level() { return L; },
      get state() { return S; },
      get diff() { return diff; },
      get index() { return index; },
      get coop() { return coop; },
      get tv() { return tvMode; },
      get split() { return splitOn; },
      get fpsCap() { return fpsCap; },
      setMenuDiff: function (d) { menuDiff = d; },
      setQuality: function (q) { save.quality = q; persist(); rv.setQuality(q, true); },
      setFpsCap: function (v) { fpsCap = v === 30 ? 30 : 60; save.fpsCap = fpsCap; persist(); emit('status', status()); },
      setAudio: function (v) { save.audio = v; persist(); GX.audio.setEnabled(v); },
      dispose: function () {
        running = false; cancelAnimationFrame(rafId);
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        canvas.removeEventListener('wheel', onWheel);
        window.removeEventListener('keydown', onKeyGlobal);
        pad.dispose(); world.dispose(); rv.dispose();
      }
    };
  }

  GX.game = { create: create, loadSave: loadSave };
})(window.GX = window.GX || {});