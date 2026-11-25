/* WebAudio 合成音效 + 发条环境音（无外部素材） */
(function (GX) {
  'use strict';

  var ctx = null, master = null, musicGain = null, sfxGain = null;
  var enabled = true, started = false, ambientNodes = [], tickTimer = null, active = true;

  function ensure() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain(); master.gain.value = enabled ? 0.9 : 0;
    master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0.32; musicGain.connect(master);
    sfxGain = ctx.createGain(); sfxGain.gain.value = 0.85; sfxGain.connect(master);
    return ctx;
  }

  function now() { return ctx.currentTime; }

  function tone(opts) {
    if (!ensure() || !enabled || !active || ctx.state !== 'running') return;
    var t0 = now() + (opts.delay || 0);
    var osc = ctx.createOscillator();
    var g = ctx.createGain();
    osc.type = opts.type || 'sine';
    osc.frequency.setValueAtTime(opts.f0, t0);
    if (opts.f1) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.f1), t0 + opts.dur);
    var peak = (opts.gain == null ? 0.25 : opts.gain);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + (opts.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    var node = osc;
    if (opts.filter) {
      var f = ctx.createBiquadFilter();
      f.type = opts.filter; f.frequency.value = opts.cutoff || 1200; f.Q.value = opts.q || 1;
      osc.connect(f); node = f;
    }
    node.connect(g); g.connect(opts.bus || sfxGain);
    osc.start(t0); osc.stop(t0 + opts.dur + 0.05);
  }

  var noiseBuf = null;
  function noiseBuffer() {
    if (noiseBuf) return noiseBuf;
    var len = ctx.sampleRate * 1.2;
    noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return noiseBuf;
  }
  function noise(opts) {
    if (!ensure() || !enabled || !active || ctx.state !== 'running') return;
    var t0 = now() + (opts.delay || 0);
    var src = ctx.createBufferSource(); src.buffer = noiseBuffer();
    var f = ctx.createBiquadFilter();
    f.type = opts.filter || 'bandpass';
    f.frequency.setValueAtTime(opts.c0 || 900, t0);
    if (opts.c1) f.frequency.exponentialRampToValueAtTime(opts.c1, t0 + opts.dur);
    f.Q.value = opts.q || 1.2;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(opts.gain == null ? 0.2 : opts.gain, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    src.connect(f); f.connect(g); g.connect(opts.bus || sfxGain);
    src.start(t0); src.stop(t0 + opts.dur + 0.05);
  }

  function startTick() {
    if (tickTimer || !ctx) return;
    tickTimer = setInterval(function () {
      if (!enabled || !active || ctx.state !== 'running') return;
      noise({ c0: 2400, c1: 1500, dur: 0.035, gain: 0.045, q: 3, bus: musicGain });
    }, 1000);
  }
  function stopTick() { if (tickTimer) { clearInterval(tickTimer); tickTimer = null; } }

  var SCALE = [0, 2, 4, 7, 9, 12, 14, 16];
  function hz(semi) { return 261.63 * Math.pow(2, semi / 12); }

  var API = {
    get enabled() { return enabled; },
    get state() { return ctx ? ctx.state : 'none'; },
    get active() { return active; },
    setEnabled: function (v) {
      enabled = !!v;
      if (!enabled) {
        stopTick();
        if (ctx && ctx.state === 'running') ctx.suspend();
        return;
      }
      if (!ensure()) return;
      master.gain.setTargetAtTime(0.9, now(), 0.05);
      if (active && ctx.state === 'suspended') ctx.resume();
      API.start();
    },
    // 页面隐藏 / 窗口失焦时挂起，回来再恢复
    setActive: function (v) {
      active = !!v;
      if (!ctx) return;
      if (!active) { stopTick(); if (ctx.state === 'running') ctx.suspend(); }
      else if (enabled) { if (ctx.state === 'suspended') ctx.resume(); if (started) startTick(); }
    },
    start: function () {
      if (!enabled || !active) return;
      if (!ensure()) return;
      if (ctx.state === 'suspended') ctx.resume();
      if (started) return;
      started = true;
      // 温暖的双音垫底
      [0, 7, 12].forEach(function (semi, i) {
        var o = ctx.createOscillator(); o.type = i === 2 ? 'triangle' : 'sawtooth';
        o.frequency.value = hz(semi - 12);
        o.detune.value = (i - 1) * 7;
        var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 420; f.Q.value = 0.7;
        var g = ctx.createGain(); g.gain.value = 0.0001;
        g.gain.setTargetAtTime(0.13 - i * 0.03, now(), 2.5);
        var lfo = ctx.createOscillator(); lfo.frequency.value = 0.05 + i * 0.021;
        var lg = ctx.createGain(); lg.gain.value = 110;
        lfo.connect(lg); lg.connect(f.frequency);
        o.connect(f); f.connect(g); g.connect(musicGain);
        o.start(); lfo.start();
        ambientNodes.push(o, lfo);
      });
      // 钟摆滴答
      var tick = function () {
        if (!enabled || !active || !ctx || ctx.state !== 'running') return;
        noise({ c0: 2400, c1: 1500, dur: 0.035, gain: 0.045, q: 3, bus: musicGain });
      };
      startTick();
    },
    step: function () { noise({ c0: 620, c1: 300, dur: 0.07, gain: 0.09, q: 1.6 }); tone({ type: 'sine', f0: 180, f1: 120, dur: 0.07, gain: 0.05 }); },
    ui: function () { tone({ type: 'triangle', f0: 660, f1: 880, dur: 0.09, gain: 0.12 }); },
    back: function () { tone({ type: 'triangle', f0: 520, f1: 330, dur: 0.11, gain: 0.1 }); },
    key: function () {
      [0, 4, 7, 12].forEach(function (s, i) { tone({ type: 'triangle', f0: hz(s + 12), dur: 0.3, gain: 0.16, delay: i * 0.055 }); });
      noise({ c0: 5200, c1: 2600, dur: 0.25, gain: 0.06 });
    },
    star: function () {
      [12, 16, 19, 24].forEach(function (s, i) { tone({ type: 'sine', f0: hz(s), dur: 0.34, gain: 0.17, delay: i * 0.05 }); });
    },
    gear: function () {
      noise({ c0: 1500, c1: 420, dur: 0.11, gain: 0.16, q: 2.2 });
      tone({ type: 'square', f0: 150, f1: 92, dur: 0.1, gain: 0.07, filter: 'lowpass', cutoff: 700 });
    },
    solved: function () {
      [0, 7, 12, 16].forEach(function (s, i) { tone({ type: 'triangle', f0: hz(s), dur: 0.42, gain: 0.15, delay: i * 0.06 }); });
    },
    door: function () {
      noise({ c0: 300, c1: 1500, dur: 0.5, gain: 0.11, q: 0.8 });
      tone({ type: 'sawtooth', f0: 90, f1: 220, dur: 0.45, gain: 0.07, filter: 'lowpass', cutoff: 900 });
      [0, 5, 9].forEach(function (s, i) { tone({ type: 'sine', f0: hz(s + 12), dur: 0.5, gain: 0.1, delay: 0.16 + i * 0.05 }); });
    },
    lever: function () {
      noise({ c0: 900, c1: 260, dur: 0.13, gain: 0.18, q: 2 });
      tone({ type: 'square', f0: 220, f1: 130, dur: 0.12, gain: 0.06, filter: 'lowpass', cutoff: 800 });
    },
    bridge: function () {
      noise({ c0: 240, c1: 900, dur: 0.55, gain: 0.1, q: 0.9 });
      tone({ type: 'triangle', f0: 130, f1: 260, dur: 0.5, gain: 0.08 });
    },
    rotor: function () {
      noise({ c0: 380, c1: 1700, dur: 0.6, gain: 0.12, q: 0.7 });
      tone({ type: 'sawtooth', f0: 70, f1: 140, dur: 0.55, gain: 0.06, filter: 'lowpass', cutoff: 600 });
    },
    lamp: function (i) { tone({ type: 'triangle', f0: hz([0, 4, 7, 11][i % 4] + 12), dur: 0.34, gain: 0.2 }); },
    wrong: function () { tone({ type: 'sine', f0: 220, f1: 150, dur: 0.24, gain: 0.12 }); tone({ type: 'sine', f0: 165, f1: 110, dur: 0.28, gain: 0.08, delay: 0.05 }); },
    win: function () {
      [0, 4, 7, 12, 16, 19, 24].forEach(function (s, i) {
        tone({ type: 'triangle', f0: hz(s), dur: 0.6, gain: 0.17, delay: i * 0.085 });
        tone({ type: 'sine', f0: hz(s + 12), dur: 0.5, gain: 0.07, delay: i * 0.085 });
      });
      noise({ c0: 6000, c1: 2000, dur: 0.9, gain: 0.05, delay: 0.2 });
    },
    lose: function () {
      [12, 8, 5, 0].forEach(function (s, i) { tone({ type: 'triangle', f0: hz(s), dur: 0.5, gain: 0.14, delay: i * 0.13 }); });
      noise({ c0: 700, c1: 160, dur: 0.9, gain: 0.07, delay: 0.1 });
    },
    bump: function () { tone({ type: 'sine', f0: 120, f1: 80, dur: 0.1, gain: 0.07 }); },
    warp: function () {
      tone({ type: 'sawtooth', f0: 180, f1: 1500, dur: 0.26, gain: 0.09, filter: 'lowpass', cutoff: 2200 });
      noise({ c0: 500, c1: 5200, dur: 0.3, gain: 0.09, q: 0.8 });
      [0, 7, 12, 19].forEach(function (s, i) {
        tone({ type: 'sine', f0: hz(s + 12), dur: 0.34, gain: 0.11, delay: 0.2 + i * 0.045 });
      });
      tone({ type: 'sine', f0: 90, f1: 60, dur: 0.2, gain: 0.07, delay: 0.2 });
    }
  };

  GX.audio = API;
})(window.GX = window.GX || {});