// Synthesised audio: every sound is tied to a visible event. One master mute.
export class Audio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = true;
    this.ambientOn = true;
    this.ambient = null;
    this.lastTick = 0;
  }

  ensure() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return this.ctx; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.enabled ? 0.9 : 0;
    const comp = this.ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 6;
    this.master.connect(comp).connect(this.ctx.destination);
    this.startAmbient();
    return this.ctx;
  }

  setEnabled(on) {
    this.enabled = on;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setTargetAtTime(on ? 0.9 : 0, t, 0.05);
  }

  startAmbient() {
    if (!this.ctx || this.ambient) return;
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.value = 0.0;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 420; filt.Q.value = 3;
    const oscs = [55, 82.5, 110.3].map((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sawtooth';
      o.frequency.value = f;
      const og = ctx.createGain();
      og.gain.value = i === 0 ? 0.5 : 0.22;
      o.connect(og).connect(filt);
      o.start();
      return o;
    });
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.06;
    const lg = ctx.createGain(); lg.gain.value = 160;
    lfo.connect(lg).connect(filt.frequency);
    lfo.start();
    filt.connect(g).connect(this.master);
    g.gain.setTargetAtTime(0.05, ctx.currentTime, 2.5);
    this.ambient = { g, oscs, lfo, filt };
  }

  setAmbient(on) {
    this.ambientOn = on;
    if (!this.ambient) return;
    this.ambient.g.gain.setTargetAtTime(on ? 0.05 : 0, this.ctx.currentTime, 0.6);
  }

  noiseBuffer(dur = 0.12) {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    return buf;
  }

  // layer turn: plastic click + air
  turn(speed = 1, accent = false) {
    const ctx = this.ensure();
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(0.09);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = accent ? 2400 : 1500; bp.Q.value = 1.4;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(accent ? 0.32 : 0.2, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    src.connect(bp).connect(g).connect(this.master);
    src.start(t); src.stop(t + 0.12);

    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(accent ? 320 : 210, t);
    o.frequency.exponentialRampToValueAtTime(accent ? 120 : 90, t + 0.09);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.16, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o.connect(og).connect(this.master);
    o.start(t); o.stop(t + 0.14);
  }

  tick(freq = 880, vol = 0.08) {
    const ctx = this.ensure();
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    if (t - this.lastTick < 0.02) return;
    this.lastTick = t;
    const o = ctx.createOscillator();
    o.type = 'triangle'; o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.connect(g).connect(this.master);
    o.start(t); o.stop(t + 0.08);
  }

  chime(base = 523.25, steps = [0, 4, 7, 12], dur = 0.5) {
    const ctx = this.ensure();
    if (!ctx || !this.enabled) return;
    const t0 = ctx.currentTime;
    steps.forEach((s, i) => {
      const t = t0 + i * 0.075;
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = base * Math.pow(2, s / 12);
      const o2 = ctx.createOscillator();
      o2.type = 'triangle';
      o2.frequency.value = base * Math.pow(2, s / 12) * 2;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      const g2 = ctx.createGain(); g2.gain.value = 0.25;
      o.connect(g); o2.connect(g2).connect(g);
      g.connect(this.master);
      o.start(t); o.stop(t + dur + 0.05);
      o2.start(t); o2.stop(t + dur + 0.05);
    });
  }

  solved() { this.chime(523.25, [0, 4, 7, 12, 16, 19], 0.9); }
  stage() { this.chime(392, [0, 7], 0.35); }
  scramble() { this.turn(1, false); }
  error() { this.tick(160, 0.12); }
}