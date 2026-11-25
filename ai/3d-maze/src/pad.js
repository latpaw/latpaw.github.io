/* 输入层：手柄（Gamepad API）+ 双人键盘，统一成每个玩家一份动作指令。
   电视上没有鼠标，所有操作都必须能用手柄完成。 */
(function (GX) {
  'use strict';

  var DEAD = 0.28;
  var REPEAT_FIRST = 0.26, REPEAT_NEXT = 0.13;

  // 标准映射手柄按键索引
  var B = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7, BACK: 8, START: 9, UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15 };

  function dz(v) { return Math.abs(v) < DEAD ? 0 : (v - Math.sign(v) * DEAD) / (1 - DEAD); }

  function blank() {
    return {
      step: -1, orbitX: 0, orbitY: 0, zoom: 0,
      twist: false, interact: false, facePrev: false, faceNext: false,
      hint: false, pause: false, split: false, confirm: false, back: false, restart: false
    };
  }

  function create() {
    var pads = [null, null];
    var prevBtn = [[], []];
    var repeatT = [0, 0];
    var lastDir = [-1, -1];
    var listeners = [];
    var keys = {};
    var keyEdge = {};
    var connected = [false, false];
    var names = ['', ''];
    var anyPadSeen = false;

    function fire() { listeners.forEach(function (f) { f(info()); }); }
    function info() {
      return {
        pads: [0, 1].map(function (i) { return { connected: connected[i], name: names[i] }; }),
        anyPadSeen: anyPadSeen
      };
    }

    function onConnect(e) {
      anyPadSeen = true;
      var gp = e.gamepad;
      var slot = gp.index === 0 ? 0 : gp.index === 1 ? 1 : (connected[0] ? 1 : 0);
      connected[slot] = true;
      names[slot] = (gp.id || '手柄').replace(/\(.*?\)/g, '').trim().slice(0, 26);
      fire();
    }
    function onDisconnect(e) {
      for (var i = 0; i < 2; i++) if (names[i] && e.gamepad.id.indexOf(names[i]) >= 0) { connected[i] = false; }
      var live = navigator.getGamepads ? navigator.getGamepads() : [];
      connected = [false, false];
      for (var j = 0; j < live.length && j < 2; j++) if (live[j]) { connected[j] = true; }
      fire();
    }
    window.addEventListener('gamepadconnected', onConnect);
    window.addEventListener('gamepaddisconnected', onDisconnect);

    function onKeyDown(e) {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (!keys[k]) keyEdge[k] = true;
      keys[k] = true;
    }
    function onKeyUp(e) {
      var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      keys[k] = false;
    }
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', function () { keys = {}; });

    function edge(slot, i, gp) {
      var now = gp.buttons[i] ? (gp.buttons[i].pressed || gp.buttons[i].value > 0.5) : false;
      var was = prevBtn[slot][i] || false;
      prevBtn[slot][i] = now;
      return now && !was;
    }
    function held(gp, i) { return gp.buttons[i] ? (gp.buttons[i].pressed || gp.buttons[i].value > 0.5) : false; }

    // 方向：优先十字键，其次左摇杆；转成面内 0上 1右 2下 3左
    function stickDir(gp) {
      if (held(gp, B.UP)) return 0;
      if (held(gp, B.RIGHT)) return 1;
      if (held(gp, B.DOWN)) return 2;
      if (held(gp, B.LEFT)) return 3;
      var x = dz(gp.axes[0] || 0), y = dz(gp.axes[1] || 0);
      if (x === 0 && y === 0) return -1;
      if (Math.abs(x) > Math.abs(y)) return x > 0 ? 1 : 3;
      return y > 0 ? 2 : 0;
    }

    function pollPad(slot, gp, out, dt) {
      var d = stickDir(gp);
      if (d < 0) { repeatT[slot] = 0; lastDir[slot] = -1; }
      else if (d !== lastDir[slot]) { out.step = d; lastDir[slot] = d; repeatT[slot] = REPEAT_FIRST; }
      else {
        repeatT[slot] -= dt;
        if (repeatT[slot] <= 0) { out.step = d; repeatT[slot] = REPEAT_NEXT; }
      }
      out.orbitX = dz(gp.axes[2] || 0);
      out.orbitY = dz(gp.axes[3] || 0);
      var lt = gp.buttons[B.LT] ? gp.buttons[B.LT].value : 0;
      var rt = gp.buttons[B.RT] ? gp.buttons[B.RT].value : 0;
      out.zoom = (lt > 0.15 ? 1 : 0) - (rt > 0.15 ? 1 : 0);
      out.twist = edge(slot, B.A, gp);
      out.interact = edge(slot, B.B, gp);
      out.faceNext = edge(slot, B.RB, gp);
      out.facePrev = edge(slot, B.LB, gp);
      out.hint = edge(slot, B.Y, gp);
      out.pause = edge(slot, B.START, gp);
      out.split = edge(slot, B.BACK, gp);
      out.confirm = out.twist;
      out.back = edge(slot, B.B, gp);
      edge(slot, B.X, gp);
    }

    // 键盘：单人 WASD/方向键都行；双人 P1=WASD，P2=方向键
    function pollKeys(slot, coop, out) {
      function e(k) { if (keyEdge[k]) { keyEdge[k] = false; return true; } return false; }
      var p1 = slot === 0;
      var up = p1 ? 'w' : 'ArrowUp', dn = p1 ? 's' : 'ArrowDown', lf = p1 ? 'a' : 'ArrowLeft', rt = p1 ? 'd' : 'ArrowRight';
      var useArrows = p1 && !coop;
      if (keys[up] || (useArrows && keys.ArrowUp)) out.step = 0;
      else if (keys[rt] || (useArrows && keys.ArrowRight)) out.step = 1;
      else if (keys[dn] || (useArrows && keys.ArrowDown)) out.step = 2;
      else if (keys[lf] || (useArrows && keys.ArrowLeft)) out.step = 3;
      if (p1) {
        out.twist = e('f'); out.interact = e('g');
        out.facePrev = e('q'); out.faceNext = e('e');
        out.hint = e('h'); out.zoom = (keys.z ? 1 : 0) - (keys.x ? 1 : 0);
        out.orbitX = (keys.c ? 1 : 0) - (keys.v ? 1 : 0);
      } else {
        out.twist = e('Enter'); out.interact = e('Shift');
        out.facePrev = e('['); out.faceNext = e(']');
        out.hint = e('p'); out.zoom = (keys['-'] ? 1 : 0) - (keys['='] ? 1 : 0);
        out.orbitX = (keys[';'] ? 1 : 0) - (keys["'"] ? 1 : 0);
      }
      out.confirm = out.twist;
      out.back = out.interact;
    }

    function poll(dt, coop) {
      var live = navigator.getGamepads ? navigator.getGamepads() : [];
      var res = [blank(), blank()];
      var seen = [false, false];
      for (var i = 0; i < live.length && i < 2; i++) {
        var gp = live[i];
        if (!gp) continue;
        seen[i] = true;
        if (!connected[i]) { connected[i] = true; names[i] = (gp.id || '手柄').replace(/\(.*?\)/g, '').trim().slice(0, 26); anyPadSeen = true; fire(); }
        pollPad(i, gp, res[i], dt);
      }
      for (var s = 0; s < 2; s++) {
        if (!seen[s] && connected[s]) { connected[s] = false; fire(); }
        if (s === 1 && !coop) continue;
        var k = blank();
        pollKeys(s, coop, k);
        // 键盘与手柄合并：任一有输入即生效
        if (k.step >= 0 && res[s].step < 0) res[s].step = k.step;
        ['twist', 'interact', 'facePrev', 'faceNext', 'hint', 'confirm', 'back'].forEach(function (f) { if (k[f]) res[s][f] = true; });
        res[s].orbitX += k.orbitX; res[s].orbitY += k.orbitY; res[s].zoom += k.zoom;
      }
      // 全局键（不分玩家）
      res[0].pause = res[0].pause || !!keyEdge.Escape;
      res[0].restart = !!keyEdge.r;
      res[0].split = res[0].split || !!keyEdge.t;
      keyEdge.Escape = false; keyEdge.r = false; keyEdge.t = false;
      for (var kk in keyEdge) keyEdge[kk] = false;
      return res;
    }

    return {
      poll: poll, info: info,
      onChange: function (f) { listeners.push(f); },
      dispose: function () {
        window.removeEventListener('gamepadconnected', onConnect);
        window.removeEventListener('gamepaddisconnected', onDisconnect);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
      }
    };
  }

  GX.pad = { create: create };
})(window.GX = window.GX || {});