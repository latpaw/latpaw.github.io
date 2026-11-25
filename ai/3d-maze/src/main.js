/* 启动 */
(function (GX) {
  'use strict';

  function fatal(msg) {
    var boot = document.getElementById('boot');
    if (boot) boot.classList.add('hidden');
    var f = document.getElementById('fatal');
    document.getElementById('fatal-text').textContent = msg;
    f.classList.remove('hidden');
  }

  function boot() {
    var canvas = document.getElementById('scene');
    if (!window.THREE) { fatal('3D 引擎没有加载成功，请确认 vendor/three.js 与 index.html 在同一目录下。'); return; }
    try {
      var probe = document.createElement('canvas');
      var gl = probe.getContext('webgl2') || probe.getContext('webgl');
      if (!gl) throw new Error('no webgl');
    } catch (e) {
      fatal('这台设备的浏览器没有开启 WebGL，暂时玩不了 3D 迷宫。请换用较新的 Chrome / Edge / Safari，或在浏览器设置里打开硬件加速。');
      return;
    }

    // ?quiet=1 —— 调试用：开局静音 + 30 帧上限，避免测试时把机器烤热
    var quiet = /[?&]quiet=1/.test(location.search);
    var ui = null;
    var game;
    try {
      game = GX.game.create(canvas, function (type, data) { if (ui) ui.onEvent(type, data); });
    } catch (e) {
      fatal('初始化 3D 场景时出错：' + (e && e.message ? e.message : e));
      throw e;
    }
    if (quiet) { game.setAudio(false); game.setFpsCap(30); }
    ui = GX.ui.create(game);
    game.loadTitleScene();
    ui.show('title');
    ui.syncAudio();

    requestAnimationFrame(function () {
      document.getElementById('boot').classList.add('hidden');
    });

    // 首次任意交互后开启声音（浏览器策略要求用户手势）
    var kick = function () {
      if (quiet) return;
      GX.audio.start();
      ui.syncAudio();
      window.removeEventListener('pointerdown', kick);
      window.removeEventListener('keydown', kick);
    };
    window.addEventListener('pointerdown', kick);
    window.addEventListener('keydown', kick);

    window.GX.debug = { game: game, ui: ui };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})(window.GX = window.GX || {});