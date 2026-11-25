/* DOM 界面：屏幕切换、HUD、六面展开图、面选择器、Toast */
(function (GX) {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var C = GX.cube;

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
  }

  function create(game) {
    var screens = { title: $('#title'), levels: $('#levels'), pause: $('#pause'), win: $('#win'), lose: $('#lose'), help: $('#help'), connect: $('#connect'), codex: $('#codex') };
    var hud = $('#hud');
    var current = 'title';
    var pickedDiff = game.save.difficulty || 'easy';
    var mapOn = true;
    var mm = $('#minimap'), mctx = mm.getContext('2d');
    var toastBox = $('#toasts');
    var lastObjKey = '', lastNetKey = '';

    function syncModalFlag() {
      var open = Object.keys(screens).some(function (k) {
        return k !== 'title' && k !== 'levels' && !screens[k].classList.contains('hidden');
      });
      document.body.classList.toggle('modal', open);
    }
    function show(name) {
      Object.keys(screens).forEach(function (k) { screens[k].classList.toggle('hidden', k !== name); });
      current = name;
      if (name === 'title' || name === 'levels') hud.dataset.live = '0';
      hud.classList.toggle('hidden', hud.dataset.live !== '1');
      screens.connect.classList.add('hidden');
      screens.codex.classList.add('hidden'); portalJob++;
      if (name === 'title' || name === 'levels') game.toMenu();
      if (name === 'levels') renderLevels();
      if (name === 'title') renderTitle();
      syncModalFlag();
    }
    function showGame() {
      Object.keys(screens).forEach(function (k) { screens[k].classList.add('hidden'); });
      hud.classList.remove('hidden');
      hud.dataset.live = '1';
      current = 'game';
      lastNetKey = '';
      syncModalFlag();
      drawNet();
    }

    function toast(text, kind) {
      var el = document.createElement('div');
      el.className = 'toast ' + (kind || 'info');
      el.textContent = text;
      toastBox.appendChild(el);
      while (toastBox.children.length > 3) toastBox.removeChild(toastBox.firstChild);
      setTimeout(function () {
        el.classList.add('out');
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
      }, kind === 'tip' ? 3600 : 2400);
    }

    /* ---------- 标题 / 选关 ---------- */
    function starsFor(d) { var n = 0; GX.LEVELS[d].forEach(function (_, i) { n += game.save.stars[d + '-' + i] || 0; }); return n; }
    function renderTitle() {
      var mi = game.modeInfo();
      $$('.mode-btn[data-players]').forEach(function (b) {
        b.classList.toggle('is-active', (b.dataset.players === '2') === mi.coop);
        b.setAttribute('aria-pressed', String((b.dataset.players === '2') === mi.coop));
      });
      $('#btn-tv').classList.toggle('is-active', mi.tv);
      $('#btn-tv').setAttribute('aria-pressed', String(mi.tv));
      $('#title-foot').textContent = mi.coop
        ? '双人合作：机关与钥匙共享，两人都站上传送门才算通关 ｜ P1 WASD+F+G ／ P2 方向键+Enter+Shift ｜ 手柄左摇杆走格 A 转面 B 操作'
        : '拖动旋转魔方 · 滚轮缩放 · 点击地面移动 · 点击面心转面 ｜ 手柄：左摇杆走格 · 右摇杆转视角 · A 转面 · B 操作机关';
      $$('.diff-card').forEach(function (c) {
        c.classList.toggle('is-active', c.dataset.diff === pickedDiff);
        c.setAttribute('aria-pressed', String(c.dataset.diff === pickedDiff));
      });
      ['easy', 'medium', 'hard'].forEach(function (d) {
        var el = document.querySelector('[data-stars="' + d + '"]');
        if (el) el.textContent = '★ ' + starsFor(d) + ' / ' + (GX.LEVELS[d].length * 3);
      });
    }
    function mechTags(cfg) {
      var t = ['🔄×' + cfg.twist];
      if (cfg.gates.indexOf('key') >= 0) t.push('🔑');
      if (cfg.gates.indexOf('gear') >= 0) t.push(cfg.gearLinks > 1 ? '⚙️×' + cfg.gearLinks : '⚙️');
      if (cfg.gates.indexOf('lever') >= 0) t.push('🎚️');
      if (cfg.gates.indexOf('seq') >= 0) t.push('💎');
      if (cfg.portals) t.push('🌀×' + cfg.portals + (cfg.oneWay ? '↦' + cfg.oneWay : ''));
      if (cfg.portalReq) t.push('必需门');
      return t;
    }
    function renderLevels() {
      var d = pickedDiff, cfg = GX.DIFFICULTIES[d];
      $('#levels-sub').textContent = cfg.label + ' · ' + cfg.age + ' · ' + cfg.blurb;
      $$('.diff-tab[data-diff]').forEach(function (t) {
        t.classList.toggle('is-active', t.dataset.diff === d);
        t.setAttribute('aria-selected', String(t.dataset.diff === d));
      });
      var unlocked = game.save.unlocked[d] || 1;
      var grid = $('#level-grid');
      grid.innerHTML = '';
      GX.LEVELS[d].forEach(function (lc, i) {
        var locked = i + 1 > unlocked;
        var got = game.save.stars[d + '-' + i] || 0;
        var best = game.save.best[d + '-' + i];
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'level-card' + (locked ? ' is-locked' : '') + (got > 0 ? ' is-done' : '');
        card.disabled = locked;
        card.setAttribute('aria-label', lc.name + (locked ? '（未解锁）' : '，已获得 ' + got + ' 颗星'));
        card.innerHTML =
          '<span class="lc-num">第 ' + (i + 1) + ' 关 · ' + lc.size + '×' + lc.size + ' 面</span>' +
          '<span class="lc-name">' + lc.name + '</span>' +
          '<span class="lc-tip">' + lc.tip + '</span>' +
          '<span class="lc-mechs">' + mechTags(lc).map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</span>' +
          '<span class="lc-stars">' + [0, 1, 2].map(function (k) { return '<i class="' + (k < got ? 'on' : '') + '">★</i>'; }).join('') + '</span>' +
          '<span class="lc-best">' + (best ? '最佳 ' + best.moves + ' 步 · ' + fmtTime(best.time) : (locked ? '通关上一关解锁' : '还没挑战过')) + '</span>' +
          (locked ? '<span class="lc-lock">🔒</span>' : '');
        if (!locked) card.addEventListener('click', function () { GX.audio.ui(); game.startLevel(d, i); });
        grid.appendChild(card);
      });
      var total = starsFor('easy') + starsFor('medium') + starsFor('hard');
      var max = (GX.LEVELS.easy.length + GX.LEVELS.medium.length + GX.LEVELS.hard.length) * 3;
      $('#levels-total').textContent = '★ ' + total + ' / ' + max;
    }

    /* ---------- HUD ---------- */
    function renderObjectives(list) {
      var key = list.map(function (o) { return o.label + (o.done ? 1 : 0); }).join('|');
      if (key === lastObjKey) return;
      lastObjKey = key;
      var box = $('#hud-objectives');
      box.innerHTML = '';
      list.forEach(function (o) {
        var el = document.createElement('div');
        el.className = 'obj' + (o.done ? ' is-done' : '') + (o.info ? ' is-info' : '');
        el.style.setProperty('--c', o.color);
        el.innerHTML = '<span class="obj-dot"></span><span class="obj-label">' + o.label + '</span>';
        if (o.action === 'replay') {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'obj-act'; b.textContent = '重看';
          b.addEventListener('click', function () { game.replaySequence(); });
          el.appendChild(b);
        }
        box.appendChild(el);
      });
    }

    function measurePadbar() {
      var bar = $('#padbar');
      if (!bar || bar.hidden) { document.body.style.removeProperty('--padbar-h'); return; }
      var h = Math.ceil(bar.getBoundingClientRect().height);
      document.body.style.setProperty('--padbar-h', h + 'px');
    }
    window.addEventListener('resize', function () { setTimeout(measurePadbar, 60); });

    function updateHud(st) {
      if (!st) return;
      $('#hud-moves').textContent = st.moves;
      $('#hud-twists').textContent = st.twists;
      $('#hud-time').textContent = fmtTime(st.time);
      $$('#hud-stars i').forEach(function (el, i) { el.classList.toggle('on', i < st.stars); });
      $('#hud-hints').textContent = st.hints === Infinity ? '∞' : st.hints;
      $('#hud-fps').textContent = st.fps;
      $('#hud-calls').textContent = st.calls;
      $('#hud-perf').classList.toggle('is-slow', st.fps < 26);
      $('#hud-cap').textContent = st.fpsCap === 30 ? ' (限30)' : '';
      renderObjectives(st.objectives);
      var ew = $('#hud-energy-wrap');
      if (st.energyMax > 0) {
        ew.hidden = false;
        $('#hud-energy').textContent = st.energy;
        var pct = Math.max(0, Math.min(1, st.energy / st.energyMax));
        $('#hud-energy-fill').style.width = (pct * 100) + '%';
        $('.energy-bar').classList.toggle('is-low', pct < 0.25);
      } else ew.hidden = true;
      var gb = $('#btn-guide');
      gb.hidden = !GX.DIFFICULTIES[game.diff].guide;
      gb.classList.toggle('is-off', !st.guide);
      gb.setAttribute('aria-pressed', String(st.guide));
      $('#btn-replay-seq').hidden = !st.nearSeq;
      $('#btn-split').hidden = !st.coop;
      $('#btn-split').classList.toggle('is-off', !st.split);
      $('#player-chips').hidden = !st.coop;
      $('#split-divider').hidden = !st.split;
      if (st.coop) {
        $$('.pchip').forEach(function (el, i) {
          var p = st.players[i];
          if (!p) return;
          el.querySelector('.pchip-face').textContent = GX.cube.FACES[p.face].name;
          el.querySelector('.pchip-state').textContent = p.atExit ? '✓ 已到达' : (p.moving ? '移动中' : '');
          el.classList.toggle('is-arrived', p.atExit);
        });
      }
      var padInfo = st.pads || { pads: [] };
      var nConn = padInfo.pads.filter(function (p) { return p.connected; }).length;
      var showBar = st.tv || nConn > 0;
      $('#padbar').hidden = !showBar;
      document.body.classList.toggle('padbar', showBar && current === 'game');
      measurePadbar();
      if (showBar) {
        $('#padbar-name').textContent = nConn > 0
          ? '🎮 ' + padInfo.pads.filter(function (p) { return p.connected; }).map(function (p, i) { return 'P' + (i + 1) + ' ' + p.name; }).join(' ／ ')
          : '🎮 连接手柄后按任意键激活';
        $('#padbar').classList.toggle('is-waiting', nConn === 0);
      }
      $$('.face-btn').forEach(function (b) {
        var f = parseInt(b.dataset.face, 10);
        b.classList.toggle('is-here', f === st.face);
        b.classList.toggle('is-aligned', !!st.aligned[f]);
        b.setAttribute('aria-label', C.FACES[f].name + (f === st.face ? '（小铜豆在这里）' : '') + (st.aligned[f] ? '，已对齐' : ''));
      });
      drawNet(st);
    }

    function setLevel(info) {
      $('#hud-name').textContent = info.name;
      $('#hud-idx').textContent = (info.index + 1) + ' / ' + info.total;
      var chip = $('#hud-diff');
      chip.textContent = info.diffLabel;
      chip.style.background = info.color;
      chip.style.color = info.diff === 'medium' ? '#04303a' : info.diff === 'hard' ? '#3d0630' : '#22300a';
      $('#hud-par').textContent = '参考 ' + info.par;
      lastObjKey = ''; lastNetKey = '';
      showGame();
      updateHud(game.status());
    }

    /* ---------- 六面十字展开图 ---------- */
    function drawNet(st) {
      if (!mapOn || current !== 'game') return;
      var L = game.level, S = game.state;
      if (!L) return;
      var LV = GX.level;
      st = st || game.status();
      var sig = st.moves + '|' + st.twists + '|' + (st.players || []).map(function (p) { return p.face; }).join('') + '|' + st.objectives.map(function (o) { return o.done ? 1 : 0; }).join('') + '|' + st.face + '|' + st.aligned.join('');
      if (sig === lastNetKey) return;
      lastNetKey = sig;

      var W = mm.width, H = mm.height;
      var block = Math.min(W / 4, H / 3);
      var cs = (block - 4) / L.N;
      mctx.clearRect(0, 0, W, H);
      var portalPts = {};
      mctx.fillStyle = 'rgba(16,9,28,.62)';
      mctx.fillRect(0, 0, W, H);

      for (var f = 0; f < 6; f++) {
        var net = C.FACES[f].net;
        var ox = net[0] * block + 2, oy = net[1] * block + 2;
        var tint = GX.FACE_TINTS[f];
        mctx.fillStyle = 'rgba(0,0,0,.3)';
        mctx.fillRect(ox - 1, oy - 1, cs * L.N + 2, cs * L.N + 2);
        for (var v = 0; v < L.N; v++) for (var u = 0; u < L.N; u++) {
          var id = f * L.per + v * L.N + u;
          var base = LV.baseOf(L, S, id);
          var walk = LV.walkable(L, S, id);
          var x = ox + u * cs, y = oy + v * cs;
          if (L.bridgeOf[base] >= 0) mctx.fillStyle = walk ? '#c98b46' : 'rgba(60,40,80,.7)';
          else if (!L.t[base]) mctx.fillStyle = tint.css + '55';
          else mctx.fillStyle = walk ? 'rgba(255,236,208,.9)' : 'rgba(120,90,70,.55)';
          mctx.fillRect(x, y, cs - 0.5, cs - 0.5);
          var di = L.doorOf[base];
          if (di >= 0) {
            var g = L.gates[di], open = LV.gateOpen(L, S, di);
            mctx.fillStyle = open ? 'rgba(124,232,107,.95)'
              : g.kind === 'key' ? GX.KEY_COLORS[L.keys[g.ref].color].css : g.kind === 'gear' ? '#ffc53d' : '#ff53c8';
            mctx.fillRect(x + cs * 0.14, y + cs * 0.14, cs * 0.72, cs * 0.72);
          }
        }
        function dot(base, color, rad) {
          var cur = LV.curOf(L, S, base);
          var ff = LV.faceOf(L, cur), uv = LV.uvOf(L, cur);
          var nt = C.FACES[ff].net;
          var x = nt[0] * block + 2 + uv[0] * cs + cs / 2;
          var y = nt[1] * block + 2 + uv[1] * cs + cs / 2;
          mctx.beginPath(); mctx.arc(x, y, Math.max(1.4, rad * cs), 0, Math.PI * 2);
          mctx.fillStyle = color; mctx.fill();
          mctx.lineWidth = 1; mctx.strokeStyle = 'rgba(0,0,0,.6)'; mctx.stroke();
        }
        L.gears.forEach(function (g) { if (LV.faceOf(L, g.base) === f) dot(g.base, S.gear[g.id] === 0 ? '#9be832' : '#f2a93b', 0.32); });
        L.levers.forEach(function (lv) { if (LV.faceOf(L, lv.base) === f) dot(lv.base, S.lev[lv.id] ? '#9be832' : '#ff4d5e', 0.3); });
        L.seqs.forEach(function (sq) { sq.lamps.forEach(function (b) { if (LV.faceOf(L, b) === f) dot(b, '#31e1f7', 0.28); }); });
        L.keys.forEach(function (k) { if (LV.faceOf(L, k.base) === f && !(S.keys & (1 << k.id))) dot(k.base, GX.KEY_COLORS[k.color].css, 0.36); });
        L.stars.forEach(function (s) { if (LV.faceOf(L, s.base) === f && !(S.stars & (1 << s.id))) dot(s.base, '#ffc53d', 0.32); });
        if (LV.faceOf(L, L.exit) === f) dot(L.exit, '#ff53c8', 0.44);
        (st.players || [{ face: st.face }]).forEach(function (pp, pi) {
          if (pp.face !== f) return;
          var uv2 = LV.uvOf(L, game.world.playerCell(pi));
          var x2 = ox + uv2[0] * cs + cs / 2, y2 = oy + uv2[1] * cs + cs / 2;
          mctx.beginPath(); mctx.arc(x2, y2, Math.max(2, cs * 0.44), 0, Math.PI * 2);
          mctx.fillStyle = '#ffffff'; mctx.fill();
          mctx.beginPath(); mctx.arc(x2, y2, Math.max(1.2, cs * 0.28), 0, Math.PI * 2);
          mctx.fillStyle = pi === 0 ? '#31e1f7' : '#ffc53d'; mctx.fill();
        });
        L.portals.forEach(function (po) {
          [po.a, po.b].forEach(function (bb, ei) {
            if (LV.faceOf(L, bb) !== f) return;
            var cur = LV.curOf(L, S, bb), uv3 = LV.uvOf(L, cur);
            var px = ox + uv3[0] * cs + cs / 2, py = oy + uv3[1] * cs + cs / 2;
            var hue = GX.PORTAL_HUES[po.hue].css;
            mctx.beginPath(); mctx.arc(px, py, Math.max(2, cs * 0.4), 0, Math.PI * 2);
            mctx.lineWidth = 1.6; mctx.strokeStyle = hue; mctx.stroke();
            var canEnter = ei === 0 || po.twoWay;
            mctx.beginPath(); mctx.arc(px, py, Math.max(1, cs * (canEnter ? 0.2 : 0.12)), 0, Math.PI * 2);
            mctx.fillStyle = canEnter ? hue : 'rgba(120,110,140,.75)'; mctx.fill();
          });
        });
        // 面边框：当前面高亮，已对齐绿边
        mctx.lineWidth = here ? 2.4 : 1.4;
        var here = (st.players || []).some(function (pp) { return pp.face === f; });
        mctx.strokeStyle = here ? '#ffffff' : st.aligned[f] ? 'rgba(155,232,50,.9)' : 'rgba(255,217,138,.3)';
        mctx.strokeRect(ox - 1.5, oy - 1.5, cs * L.N + 3, cs * L.N + 3);
        mctx.fillStyle = here ? '#ffffff' : 'rgba(255,244,226,.6)';
        mctx.font = 'bold 9px sans-serif';
        mctx.fillText(C.FACES[f].short, ox + 1.5, oy + 9);
      }
      // 配对连线：同色虚线，单向门画箭头
      L.portals.forEach(function (po) {
        function pt(bb) {
          var cur = LV.curOf(L, S, bb), ff = LV.faceOf(L, cur), uv4 = LV.uvOf(L, cur), nt = C.FACES[ff].net;
          return [nt[0] * block + 2 + uv4[0] * cs + cs / 2, nt[1] * block + 2 + uv4[1] * cs + cs / 2];
        }
        var A = pt(po.a), B = pt(po.b);
        mctx.save();
        mctx.setLineDash([3, 3]);
        mctx.lineWidth = 1.2;
        mctx.strokeStyle = GX.PORTAL_HUES[po.hue].css + 'aa';
        mctx.beginPath(); mctx.moveTo(A[0], A[1]); mctx.lineTo(B[0], B[1]); mctx.stroke();
        mctx.restore();
        if (!po.twoWay) {
          var ang = Math.atan2(B[1] - A[1], B[0] - A[0]);
          var mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
          mctx.save(); mctx.translate(mx, my); mctx.rotate(ang);
          mctx.fillStyle = GX.PORTAL_HUES[po.hue].css;
          mctx.beginPath(); mctx.moveTo(4, 0); mctx.lineTo(-3, 3); mctx.lineTo(-3, -3); mctx.closePath(); mctx.fill();
          mctx.restore();
        }
      });
    }

    /* ---------- 结算 ---------- */
    function showWin(d) {
      $('#win-name').textContent = d.name;
      $('#win-moves').textContent = d.moves;
      $('#win-twists').textContent = d.twists;
      $('#win-time').textContent = fmtTime(d.time);
      var msg = d.coop ? '两人一起出魔方！' : '';
      msg += d.stars === 3 ? '三颗星星全拿到了，完美！'
        : d.stars === 2 ? '很棒！还有一颗星星藏在别的面上。'
          : d.stars === 1 ? '顺利出魔方！再找找另外两颗星星。'
            : '出来了！这次一颗星星都没捡，下次绕远路试试。';
      if (d.moves <= d.par) msg += ' 步数还优于参考路线（' + d.par + ' 步）。';
      $('#win-msg').textContent = msg;
      $('#btn-next').hidden = !d.hasNext;
      $$('#win-stars i').forEach(function (el, i) {
        el.className = '';
        setTimeout(function () {
          el.classList.add('show');
          if (i < d.stars) { el.classList.add('on'); GX.audio.star(); }
        }, 260 + i * 300);
      });
      show('win');
    }

    var codexCat = 'all';
    var portalCache = null, portalJob = 0;
    function mechCounts(m) {
      var out = { easy: 0, medium: 0, hard: 0, total: 0 };
      ['easy', 'medium', 'hard'].forEach(function (d) {
        GX.LEVELS[d].forEach(function (c) { if (m.test(c, d)) { out[d]++; out.total++; } });
      });
      return out;
    }
    function renderCodex() {
      var grid = $('#codex-grid');
      grid.innerHTML = '';
      var shown = 0;
      GX.MECHANICS.forEach(function (m) {
        if (codexCat !== 'all' && m.kind !== codexCat) return;
        shown++;
        var n = mechCounts(m);
        var el = document.createElement('article');
        el.className = 'cx-card';
        el.style.setProperty('--cx', m.color);
        el.innerHTML =
          '<div class="cx-head"><span class="cx-ico">' + m.icon + '</span>' +
          '<div><h3>' + m.name + '</h3><span class="cx-tag">' + m.tag + '</span></div></div>' +
          '<p class="cx-brief">' + m.brief + '</p>' +
          '<p class="cx-detail">' + m.detail + '</p>' +
          '<p class="cx-tell"><b>怎么认：</b>' + m.tell + '</p>' +
          '<p class="cx-cost"><b>代价：</b>' + m.cost + '</p>' +
          '<div class="cx-counts">' +
          '<span style="--cc:#9be832">简单 ' + n.easy + '/6</span>' +
          '<span style="--cc:#31e1f7">中等 ' + n.medium + '/6</span>' +
          '<span style="--cc:#ff53c8">艰难 ' + n.hard + '/6</span>' +
          '</div>';
        grid.appendChild(el);
      });
      $('#codex-sub').textContent = '共 ' + GX.MECHANICS.length + ' 项玩法与规则，当前显示 ' + shown + ' 项 · 覆盖 18 关';
      renderMatrix();
      renderPortalList();
      var tot = 0, one = 0, req = 0, cells = 0;
      ['easy', 'medium', 'hard'].forEach(function (d) {
        GX.LEVELS[d].forEach(function (c) {
          tot += c.portals || 0; one += c.oneWay || 0; if (c.portalReq) req++;
          cells += 6 * c.size * c.size;
        });
      });
      $('#codex-stat').textContent = '18 关 · 合计 ' + cells + ' 格 · ' + tot + ' 对传送门（' + one + ' 对单向）· ' + req + ' 关必须穿门';
    }
    function renderMatrix() {
      var cols = GX.MECHANICS.filter(function (m) { return m.kind === 'core' || m.kind === 'gate' || m.kind === 'reward' || m.kind === 'rule'; });
      var t = $('#codex-matrix');
      var head = '<thead><tr><th class="mx-lv">关卡</th><th>面边长</th>' +
        cols.map(function (m) { return '<th title="' + m.name + '"><span class="mx-ico">' + m.icon + '</span><span class="mx-nm">' + m.name + '</span></th>'; }).join('') +
        '</tr></thead>';
      var body = '';
      ['easy', 'medium', 'hard'].forEach(function (d) {
        var cfg = GX.DIFFICULTIES[d];
        body += '<tr class="mx-group"><td colspan="' + (cols.length + 2) + '" style="--gc:' + cfg.color + '">' + cfg.icon + ' ' + cfg.label + ' · ' + cfg.age + '</td></tr>';
        GX.LEVELS[d].forEach(function (c, i) {
          body += '<tr><td class="mx-lv"><b>' + (i + 1) + '</b> ' + c.name + '</td><td class="mx-n">' + c.size + '×' + c.size + '</td>';
          cols.forEach(function (m) {
            var on = m.test(c, d);
            var extra = '';
            if (m.id === 'portal' && c.portals) extra = c.portals + (c.oneWay ? '<i>↦' + c.oneWay + '</i>' : '') + (c.portalReq ? '<i class="req">必</i>' : '');
            if (m.id === 'twist' && c.twist) extra = c.twist;
            if (m.id === 'gear' && c.gearLinks > 1) extra = '×' + c.gearLinks;
            if (m.id === 'seq' && c.seq) extra = c.seq;
            if (m.id === 'key') { var kn = c.gates.filter(function (g) { return g === 'key'; }).length; if (kn) extra = kn; }
            body += '<td class="mx-cell' + (on ? ' on' : '') + '" style="--mc:' + m.color + '">' + (on ? (extra || '●') : '·') + '</td>';
          });
          body += '</tr>';
        });
      });
      t.innerHTML = head + '<tbody>' + body + '</tbody>';
    }
    function renderPortalList() {
      var box = $('#codex-portals');
      var jobs = [];
      ['easy', 'medium', 'hard'].forEach(function (d) {
        GX.LEVELS[d].forEach(function (c, i) { if (c.portals) jobs.push({ d: d, i: i, c: c }); });
      });
      if (portalCache) { paintPortals(jobs); return; }
      box.innerHTML = '<p class="cx-loading">正在读取各关传送门朝向…</p>';
      portalCache = {};
      var job = ++portalJob, k = 0;
      function step() {
        if (job !== portalJob) return;
        var t0 = Date.now();
        while (k < jobs.length && Date.now() - t0 < 24) {
          var j = jobs[k];
          try {
            var lv = GX.level.buildLevel(j.d, j.i);
            portalCache[j.d + '-' + j.i] = lv.portals.map(function (po) {
              return { fa: GX.level.faceOf(lv, po.a), fb: GX.level.faceOf(lv, po.b), twoWay: po.twoWay, hue: po.hue };
            });
          } catch (e) { portalCache[j.d + '-' + j.i] = []; }
          k++;
        }
        if (k < jobs.length) { paintPortals(jobs, k / jobs.length); setTimeout(step, 0); }
        else paintPortals(jobs);
      }
      setTimeout(step, 0);
    }
    function paintPortals(jobs, prog) {
      var box = $('#codex-portals');
      var html = '';
      jobs.forEach(function (j) {
        var list = portalCache[j.d + '-' + j.i];
        var cfg = GX.DIFFICULTIES[j.d];
        html += '<div class="pl-row"><span class="pl-lv" style="--pc:' + cfg.color + '">' + cfg.label + ' ' + (j.i + 1) + ' · ' + j.c.name + '</span><span class="pl-pairs">';
        if (!list) { html += '<i class="pl-wait">…</i>'; }
        else list.forEach(function (p) {
          var hue = GX.PORTAL_HUES[p.hue].css;
          var arrow = p.twoWay ? '⇄' : '→';
          html += '<i class="pl-pair" style="--ph:' + hue + '">' + GX.cube.FACES[p.fa].short + ' ' + arrow + ' ' + GX.cube.FACES[p.fb].short + '</i>';
        });
        if (j.c.portalReq) html += '<i class="pl-req">必需</i>';
        html += '</span></div>';
      });
      if (prog != null) html += '<p class="cx-loading">读取中 ' + Math.round(prog * 100) + '%</p>';
      box.innerHTML = html;
    }
    function openCodex() { GX.audio.ui(); screens.codex.classList.remove('hidden'); renderCodex(); syncModalFlag(); }
    function closeCodex() { GX.audio.back(); screens.codex.classList.add('hidden'); portalJob++; syncModalFlag(); }

    function syncAudio() {
      var on = GX.audio.enabled;
      $$('[data-audio-icon]').forEach(function (el) { el.textContent = on ? '🔊' : '🔇'; });
      ['#btn-audio', '#btn-audio-title', '#btn-audio-pause'].forEach(function (s) {
        var b = $(s); if (b) b.setAttribute('aria-pressed', String(on));
      });
    }
    function toggleAudio() { game.setAudio(!GX.audio.enabled); syncAudio(); if (GX.audio.enabled) GX.audio.ui(); }
    function syncQuality() {
      $$('.q-tab[data-q]').forEach(function (t) { t.classList.toggle('is-active', t.dataset.q === game.rv.quality); });
      $$('.fps-tab').forEach(function (t) { t.classList.toggle('is-active', parseInt(t.dataset.fps, 10) === game.fpsCap); });
    }

    /* ---------- 绑定 ---------- */
    $$('.diff-card').forEach(function (c) {
      c.addEventListener('click', function () {
        pickedDiff = c.dataset.diff;
        game.save.difficulty = pickedDiff; game.persist();
        renderTitle(); GX.audio.ui();
      });
    });
    $('#btn-play').addEventListener('click', function () {
      GX.audio.start(); GX.audio.ui();
      var d = pickedDiff, unlocked = game.save.unlocked[d] || 1, next = 0;
      for (var i = 0; i < GX.LEVELS[d].length; i++) {
        if (i + 1 > unlocked) break;
        if (!(game.save.stars[d + '-' + i] > 0)) { next = i; break; }
        next = i;
      }
      game.startLevel(d, next);
    });
    $('#btn-levels').addEventListener('click', function () { GX.audio.ui(); show('levels'); });
    $$('.mode-btn[data-players]').forEach(function (b) {
      b.addEventListener('click', function () { GX.audio.ui(); game.setCoop(b.dataset.players === '2'); renderTitle(); });
    });
    $('#btn-tv').addEventListener('click', function () {
      GX.audio.ui(); game.setTV(!game.tv); renderTitle();
      if (game.tv) toast('电视模式已开启：大字幕 + 安全边距 + 手柄操作', 'good');
    });
    $('#btn-split').addEventListener('click', function () { GX.audio.ui(); game.setSplit(!game.split); });
    ['#btn-codex', '#btn-codex-2', '#btn-codex-3'].forEach(function (sel) {
      var b = $(sel); if (b) b.addEventListener('click', openCodex);
    });
    $('#btn-codex-close').addEventListener('click', closeCodex);
    $('#btn-codex-ok').addEventListener('click', function () { closeCodex(); if (game.mode !== 'playing') $('#btn-play').click(); });
    $$('.cx-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        codexCat = t.dataset.cat;
        $$('.cx-tab').forEach(function (x) { x.classList.toggle('is-active', x === t); });
        GX.audio.ui(); renderCodex();
      });
    });
    $('#btn-connect').addEventListener('click', function () { GX.audio.ui(); screens.connect.classList.remove('hidden'); syncModalFlag(); });
    $('#btn-connect-close').addEventListener('click', function () { GX.audio.back(); screens.connect.classList.add('hidden'); syncModalFlag(); });
    $('#btn-connect-ok').addEventListener('click', function () {
      GX.audio.ui(); screens.connect.classList.add('hidden'); syncModalFlag();
      game.setCoop(true); game.setTV(true); renderTitle();
      toast('已切到双人合作 + 电视模式，接上电视就能玩', 'good');
    });
    $$('.diff-tab[data-diff]').forEach(function (t) {
      t.addEventListener('click', function () {
        var d = t.dataset.diff;
        GX.audio.ui();
        if (current === 'pause') {
          pickedDiff = d;
          game.startLevel(d, Math.min(game.index, GX.LEVELS[d].length - 1));
          toast('已切换到「' + GX.DIFFICULTIES[d].label + '」难度', 'tip');
        } else { pickedDiff = d; game.save.difficulty = d; game.persist(); renderLevels(); }
      });
    });
    $$('[data-nav]').forEach(function (b) { b.addEventListener('click', function () { GX.audio.back(); show(b.dataset.nav); }); });
    function openHelp() { GX.audio.ui(); screens.help.classList.remove('hidden'); syncModalFlag(); }
    ['#btn-help', '#btn-help-2', '#btn-help-3'].forEach(function (s) { $(s).addEventListener('click', openHelp); });
    $('#btn-help-close').addEventListener('click', function () { GX.audio.back(); screens.help.classList.add('hidden'); syncModalFlag(); });
    $('#btn-help-ok').addEventListener('click', function () { GX.audio.back(); screens.help.classList.add('hidden'); syncModalFlag(); });
    ['#btn-audio', '#btn-audio-title', '#btn-audio-pause'].forEach(function (s) { $(s).addEventListener('click', toggleAudio); });
    $('#btn-pause').addEventListener('click', function () { GX.audio.ui(); game.pause(); });
    $('#btn-resume').addEventListener('click', function () { GX.audio.ui(); game.resume(); });
    $('#btn-restart').addEventListener('click', function () { GX.audio.ui(); game.restart(); });
    $('#btn-restart-2').addEventListener('click', function () { GX.audio.ui(); game.restart(); });
    $('#btn-hint').addEventListener('click', function () { game.useHint(); });
    $('#btn-guide').addEventListener('click', function () { game.toggleGuide(); });
    $('#btn-camera').addEventListener('click', function () { game.resetCamera(); });
    $('#btn-twist').addEventListener('click', function () { game.twistFace(game.world.robotFace); });
    $('#btn-replay-seq').addEventListener('click', function () { game.replaySequence(); });
    $('#btn-map').addEventListener('click', function () {
      mapOn = !mapOn;
      $('#net-wrap').classList.toggle('hidden', !mapOn);
      $('#btn-map').setAttribute('aria-pressed', String(mapOn));
      GX.audio.ui();
      if (mapOn) { lastNetKey = ''; drawNet(); }
    });
    $$('.face-btn').forEach(function (b) {
      b.addEventListener('click', function () { game.focusFace(parseInt(b.dataset.face, 10)); GX.audio.ui(); });
    });
    $('#btn-next').addEventListener('click', function () { GX.audio.ui(); game.startLevel(game.diff, Math.min(game.index + 1, GX.LEVELS[game.diff].length - 1)); });
    $('#btn-again').addEventListener('click', function () { GX.audio.ui(); game.restart(); });
    $('#btn-retry').addEventListener('click', function () { GX.audio.ui(); game.restart(); });
    $('#btn-easier').addEventListener('click', function () {
      var order = ['easy', 'medium', 'hard'];
      var d = order[Math.max(0, order.indexOf(game.diff) - 1)];
      pickedDiff = d; GX.audio.ui();
      game.startLevel(d, Math.min(game.index, GX.LEVELS[d].length - 1));
    });
    $$('.q-tab[data-q]').forEach(function (t) { t.addEventListener('click', function () { game.setQuality(t.dataset.q); syncQuality(); GX.audio.ui(); }); });
    $$('.fps-tab').forEach(function (t) {
      t.addEventListener('click', function () {
        game.setFpsCap(parseInt(t.dataset.fps, 10)); syncQuality(); GX.audio.ui();
        toast(game.fpsCap === 30 ? '已限到 30 帧，发热和耗电都会明显下降' : '已恢复 60 帧上限', 'good');
      });
    });
    $$('.dpad-btn').forEach(function (b) {
      var d = parseInt(b.dataset.dir, 10);
      b.addEventListener('pointerdown', function (e) { e.preventDefault(); game.stepDir(d); });
    });

    function onEvent(type, data) {
      if (type === 'toast') toast(data.text, data.kind);
      else if (type === 'level') setLevel(data);
      else if (type === 'status') updateHud(data);
      else if (type === 'pause') { updateHud(data); syncQuality(); syncAudio(); show('pause'); }
      else if (type === 'resume') showGame();
      else if (type === 'win') { showWin(data); renderTitle(); }
      else if (type === 'lose') show('lose');
      else if (type === 'title') renderTitle();
      else if (type === 'mode') { renderTitle(); if (current === 'game') updateHud(game.status()); }
      else if (type === 'pads') { if (current === 'game') updateHud(game.status()); renderTitle(); }
      else if (type === 'menuSelect') { pickedDiff = data.diff; renderTitle(); }
      else if (type === 'menuStart') { pickedDiff = data.diff; $('#btn-play').click(); }
      else if (type === 'menuHelp') openHelp();
      else if (type === 'menuNext') { if (!$('#btn-next').hidden) $('#btn-next').click(); else $('#btn-again').click(); }
      else if (type === 'waiting') toast('P' + (data.waiting + 1) + ' 还没到传送门，去接一下同伴', 'tip');
      else if (type === 'quality') { syncQuality(); toast('帧率偏低，已自动切到「' + (data.quality === 'medium' ? '中' : '低') + '」画质', 'warn'); }
    }

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { screens.help.classList.add('hidden'); screens.connect.classList.add('hidden'); screens.codex.classList.add('hidden'); portalJob++; syncModalFlag(); }
    });

    syncAudio(); syncQuality(); renderTitle();
    return { onEvent: onEvent, show: show, showGame: showGame, toast: toast, drawNet: drawNet, syncAudio: syncAudio, openCodex: openCodex, renderCodex: renderCodex };
  }

  GX.ui = { create: create, fmtTime: fmtTime };
})(window.GX = window.GX || {});