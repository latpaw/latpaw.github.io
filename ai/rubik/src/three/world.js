import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { MOVES, FACE_NORMAL, FACE_FRAME, moveAngle } from '../core/model.js';
import { COLOR_HEX } from '../core/insight.js';

const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);
const IDENT_Q = new THREE.Quaternion();

export const PALETTES = {
  classic: { name: '经典', colors: COLOR_HEX, glow: 0.16, body: 0x0b0b12 },
  neon: { name: '霓虹', colors: ['#FFE94D', '#FFFFFF', '#FF2D55', '#FF9F0A', '#32FF7E', '#3D8BFF'], glow: 0.62, body: 0x05050c },
  candy: { name: '糖果', colors: ['#FFE9A8', '#FFF6F0', '#FFB3C1', '#FFD8A8', '#B8F2D8', '#BBD9FF'], glow: 0.1, body: 0x2a2438 },
  ember: { name: '熔岩', colors: ['#FFC93C', '#FFE9D6', '#FF3B1F', '#FF7A00', '#C6FF3D', '#FF2D9B'], glow: 0.45, body: 0x140806 },
  ice: { name: '极地', colors: ['#E8F4FF', '#FFFFFF', '#7FB2FF', '#A98BFF', '#5FF0D8', '#2B6BFF'], glow: 0.35, body: 0x060b16 },
  mono: { name: '单色', colors: ['#F5F3FF', '#C9C4E8', '#9A93C9', '#6E67A3', '#453F7A', '#2A2555'], glow: 0.12, body: 0x0a0a12 },
};

export const EASINGS = {
  linear: (t) => t,
  smooth: (t) => t * t * (3 - 2 * t),
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  outBack: (t) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2),
  outElastic: (t) => (t === 0 || t === 1 ? t : Math.pow(2, -9 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
};

function gradientTexture(stops, size = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function floorTexture() {
  const s = 1024;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const g = c.getContext('2d');
  g.fillStyle = '#0a0812';
  g.fillRect(0, 0, s, s);
  const grad = g.createRadialGradient(s / 2, s / 2, 40, s / 2, s / 2, s / 2);
  grad.addColorStop(0, 'rgba(120,90,255,0.42)');
  grad.addColorStop(0.45, 'rgba(60,40,140,0.18)');
  grad.addColorStop(1, 'rgba(6,5,14,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  g.strokeStyle = 'rgba(150,130,255,0.16)';
  g.lineWidth = 1.5;
  for (let i = 1; i <= 9; i++) {
    g.beginPath(); g.arc(s / 2, s / 2, (s / 2) * (i / 9), 0, Math.PI * 2); g.stroke();
  }
  g.strokeStyle = 'rgba(120,200,255,0.10)';
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    g.beginPath(); g.moveTo(s / 2, s / 2);
    g.lineTo(s / 2 + Math.cos(a) * s / 2, s / 2 + Math.sin(a) * s / 2); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.98;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.localClippingEnabled = true;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x080611, 0.028);
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 220);
    this.camera.position.set(5.4, 4.6, 6.6);

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.075;
    this.controls.enablePan = false;
    this.controls.minDistance = 4.2;
    this.controls.maxDistance = 30;
    this.controls.rotateSpeed = 0.85;
    this.controls.zoomSpeed = 0.9;
    this.controls.target.set(0, 0, 0);
    this.controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE };

    this.clock = new THREE.Clock();
    this.time = 0;
    this.anims = [];
    this.opts = {
      speed: 1, easing: 'outCubic', gap: 0, explode: 0, xray: 0, cut: 0, cutOn: false,
      bloom: 0.5, light: 1, lightAngle: 0.9, fog: 0.028, particles: 620,
      palette: 'classic', wireframe: false, grid: true, glow: 1, quality: 'high',
      autoRotate: false, radius: 0.09,
    };
    this.clipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 3);
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.highlight = new Set();
    this.hoverCubie = null;

    this._buildEnvironment();
    this._buildLights();
    this._buildBackdrop();
    this._buildComposer();

    this.cubeGroup = new THREE.Group();
    this.scene.add(this.cubeGroup);
    this.mechGroup = new THREE.Group();
    this.scene.add(this.mechGroup);
    this.netGroup = new THREE.Group();
    this.netGroup.visible = false;
    this.scene.add(this.netGroup);

    this.cubies = [];
    this.n = 3;
    this.mode = 'play';
    this.onTurnEnd = null;
    this._tmpM = new THREE.Matrix4();
    this._tmpQ = new THREE.Quaternion();
    this._tmpV = new THREE.Vector3();
  }

  // ------------------------------------------------------------- environment
  _buildEnvironment() {
    const envScene = new THREE.Scene();
    const mk = (col, intensity, pos, scale) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
      m.material.color.multiplyScalar(intensity);
      m.position.set(...pos); m.scale.set(...scale); m.lookAt(0, 0, 0);
      envScene.add(m);
    };
    envScene.background = new THREE.Color(0x0a0816);
    mk(0xffe6c0, 1.5, [6, 7, 5], [9, 9, 1]);
    mk(0x2b7bff, 1.1, [-8, 2, -6], [10, 8, 1]);
    mk(0xff2d9b, 0.7, [-5, -4, 6], [8, 6, 1]);
    mk(0x22e3ff, 0.55, [5, -5, -5], [7, 5, 1]);
    mk(0x14e06a, 0.25, [0, 8, -8], [6, 4, 1]);
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.envMap = pmrem.fromScene(envScene, 0.04).texture;
    this.scene.environment = this.envMap;
    this.scene.environmentIntensity = 0.42;
    pmrem.dispose();
    envScene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  }

  _buildLights() {
    this.hemi = new THREE.HemisphereLight(0x5a4a9a, 0x08060f, 0.38);
    this.scene.add(this.hemi);
    this.key = new THREE.SpotLight(0xfff0d8, 30, 34, 0.7, 0.95, 1.8);
    this.key.position.set(6, 9, 6);
    this.key.castShadow = true;
    this.key.shadow.mapSize.set(1024, 1024);
    this.key.shadow.bias = -0.0006;
    this.key.shadow.camera.near = 2;
    this.key.shadow.camera.far = 30;
    this.scene.add(this.key);
    this.scene.add(this.key.target);
    this.rim = new THREE.DirectionalLight(0x3d8bff, 1.35);
    this.rim.position.set(-7, 3.5, -6);
    this.scene.add(this.rim);
    this.fill = new THREE.PointLight(0xff2d9b, 10, 22, 2);
    this.fill.position.set(-4.5, -2.2, 5);
    this.scene.add(this.fill);
    this.accent = new THREE.PointLight(0x22e3ff, 7, 20, 2);
    this.accent.position.set(4.5, -3, -4.5);
    this.scene.add(this.accent);
  }

  _buildBackdrop() {
    const geo = new THREE.SphereGeometry(80, 32, 24);
    this.skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { uTime: { value: 0 }, uA: { value: new THREE.Color(0x1a1040) }, uB: { value: new THREE.Color(0x05040c) }, uC: { value: new THREE.Color(0x2a1060) } },
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uTime; uniform vec3 uA,uB,uC; varying vec3 vP;
        float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,45.164)))*43758.5453); }
        void main(){
          vec3 d = normalize(vP);
          float h = d.y*0.5+0.5;
          vec3 col = mix(uB, uA, smoothstep(0.0,0.85,h));
          float band = sin(d.x*2.4 + uTime*0.12) * cos(d.z*2.0 - uTime*0.09);
          col += uC * smoothstep(0.55,1.0,band) * 0.55 * (1.0-abs(d.y));
          float aur = sin(d.x*4.0 + uTime*0.2 + d.y*3.0)*0.5+0.5;
          col += vec3(0.10,0.05,0.28) * pow(aur,4.0) * smoothstep(0.1,0.9,h);
          col += (hash(d*180.0)-0.5)*0.018;
          gl_FragColor = vec4(col,1.0);
        }`,
    });
    this.sky = new THREE.Mesh(geo, this.skyMat);
    this.scene.add(this.sky);

    // floor + baked contact shadow
    this.floor = new THREE.Mesh(
      new THREE.CircleGeometry(16, 72),
      new THREE.MeshStandardMaterial({ map: floorTexture(), roughness: 0.55, metalness: 0.35, transparent: true, opacity: 0.95, color: 0xffffff }),
    );
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -2.9;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    this.contact = new THREE.Mesh(
      new THREE.PlaneGeometry(7.4, 7.4),
      new THREE.MeshBasicMaterial({ map: gradientTexture([[0, 'rgba(0,0,0,0.72)'], [0.45, 'rgba(0,0,0,0.30)'], [1, 'rgba(0,0,0,0)']]), transparent: true, depthWrite: false }),
    );
    this.contact.rotation.x = -Math.PI / 2;
    this.contact.position.y = -2.88;
    this.scene.add(this.contact);

    this.gridHelper = new THREE.GridHelper(30, 30, 0x4a3f8a, 0x241d44);
    this.gridHelper.position.y = -2.89;
    this.gridHelper.material.transparent = true;
    this.gridHelper.material.opacity = 0.22;
    this.scene.add(this.gridHelper);

    // drifting motes
    this.particleGeo = new THREE.BufferGeometry();
    this.particleMat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      uniforms: { uTime: { value: 0 }, uSize: { value: 26 }, uColor: { value: new THREE.Color(0x9a86ff) } },
      vertexShader: `
        uniform float uTime, uSize; attribute float aSeed; varying float vA;
        void main(){
          vec3 p = position;
          p.y += sin(uTime*0.25 + aSeed*6.28)*0.6;
          p.x += cos(uTime*0.18 + aSeed*12.0)*0.5;
          vec4 mv = modelViewMatrix * vec4(p,1.0);
          vA = 0.35 + 0.65*abs(sin(uTime*0.6 + aSeed*20.0));
          gl_PointSize = uSize * (1.0/ -mv.z) * (0.5+aSeed);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColor; varying float vA;
        void main(){
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(uColor, a*vA*0.55);
        }`,
    });
    this.particles = new THREE.Points(this.particleGeo, this.particleMat);
    this.scene.add(this.particles);
    this.setParticleCount(this.opts.particles);

    // light shafts
    this.shafts = new THREE.Group();
    const shaftTex = gradientTexture([[0, 'rgba(255,235,200,0.55)'], [0.4, 'rgba(180,150,255,0.16)'], [1, 'rgba(0,0,0,0)']]);
    for (let i = 0; i < 4; i++) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 16),
        new THREE.MeshBasicMaterial({ map: shaftTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.085, side: THREE.DoubleSide }),
      );
      m.position.set(-3 + i * 2.1, 3.4, -5.5 - i * 0.6);
      m.rotation.set(0.32, 0.2 - i * 0.12, 0.16 + i * 0.05);
      this.shafts.add(m);
    }
    this.scene.add(this.shafts);
  }

  _buildComposer() {
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.65, 0.92);
    this.outputPass = new OutputPass();
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.outputPass);
  }

  setParticleCount(n) {
    const count = Math.max(0, Math.floor(n));
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 12;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = -3 + Math.random() * 12;
      pos[i * 3 + 2] = Math.sin(a) * r;
      seed[i] = Math.random();
    }
    this.particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.particleGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    this.particleGeo.computeBoundingSphere();
  }

  // ------------------------------------------------------------------- cube
  buildCube(model) {
    this.disposeCube();
    this.model = model;
    this.n = model.n;
    const n = this.n;
    const size = n === 2 ? 1.42 : 0.94;
    this.cubieSize = size;
    this.spacing = size * 1.03;
    this.bodyGeo = new RoundedBoxGeometry(size, size, size, 4, size * this.opts.radius);
    this.stickerGeo = new THREE.ShapeGeometry(roundedRectShape(size * 0.84, size * 0.84, size * 0.13));
    this.bodyMat = new THREE.MeshPhysicalMaterial({ color: PALETTES[this.opts.palette].body, roughness: 0.42, metalness: 0.18, clearcoat: 0.7, clearcoatRoughness: 0.32 });
    this.stickerMats = [];
    const pal = PALETTES[this.opts.palette];
    for (let f = 0; f < 6; f++) {
      this.stickerMats.push(new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(pal.colors[f]), roughness: 0.46, metalness: 0.04,
        clearcoat: 0.35, clearcoatRoughness: 0.42,
        emissive: new THREE.Color(pal.colors[f]), emissiveIntensity: pal.glow * this.opts.glow,
      }));
    }
    this.outlineMat = new THREE.MeshBasicMaterial({ color: 0x22e3ff, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide });
    this.outlineGeo = new RoundedBoxGeometry(size * 1.09, size * 1.09, size * 1.09, 2, size * 0.12);
    this.footMat = new THREE.MeshPhysicalMaterial({ color: 0x2b2b38, roughness: 0.5, metalness: 0.4, clearcoat: 0.3 });

    for (const c of model.cubies) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(this.bodyGeo, this.bodyMat);
      body.castShadow = true; body.receiveShadow = true;
      g.add(body);
      const outline = new THREE.Mesh(this.outlineGeo, this.outlineMat.clone());
      outline.visible = false;
      g.add(outline);
      const stickers = [];
      for (let f = 0; f < 6; f++) {
        if (c.stickers[f] === null) continue;
        const m = new THREE.Mesh(this.stickerGeo, this.stickerMats[c.stickers[f]]);
        const nrm = V3(FACE_NORMAL[f]);
        m.position.copy(nrm).multiplyScalar(size / 2 + 0.004);
        m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), nrm);
        m.userData = { cubie: c, face: f, pickable: true };
        g.add(m);
        stickers.push(m);
      }
      // internal feet / stalks
      const feet = new THREE.Group();
      const stalk = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.16, size * 0.2, size * 0.42, 12), this.footMat);
      const dirs = [];
      for (let f = 0; f < 6; f++) if (c.stickers[f] !== null) dirs.push(V3(FACE_NORMAL[f]));
      const inward = dirs.reduce((a, b) => a.add(b), new THREE.Vector3()).normalize().multiplyScalar(-1);
      stalk.position.copy(inward).multiplyScalar(size * 0.42);
      stalk.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), inward);
      feet.add(stalk);
      const flange = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.3, size * 0.3, size * 0.08, 16), this.footMat);
      flange.position.copy(inward).multiplyScalar(size * 0.6);
      flange.quaternion.copy(stalk.quaternion);
      feet.add(flange);
      feet.visible = false;
      g.add(feet);

      this.cubeGroup.add(g);
      this.cubies.push({ model: c, group: g, body, outline, stickers, feet });
    }
    this._buildMechanism();
    this.syncTransforms();
    this.applyMaterialOpts();
  }

  disposeCube() {
    for (const c of this.cubies) {
      this.cubeGroup.remove(c.group);
      c.outline.material.dispose();
    }
    this.cubies = [];
    if (this.bodyGeo) this.bodyGeo.dispose();
    if (this.stickerGeo) this.stickerGeo.dispose();
    if (this.outlineGeo) this.outlineGeo.dispose();
    if (this.bodyMat) this.bodyMat.dispose();
    if (this.stickerMats) this.stickerMats.forEach((m) => m.dispose());
    this._disposeMech();
  }

  _disposeMech() {
    this.mechGroup.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    this.mechGroup.clear();
    this.mechParts = null;
  }

  _buildMechanism() {
    this._disposeMech();
    const metal = new THREE.MeshPhysicalMaterial({ color: 0x8a8fa8, roughness: 0.3, metalness: 0.95, clearcoat: 0.4 });
    const dark = new THREE.MeshPhysicalMaterial({ color: 0x1a1a24, roughness: 0.45, metalness: 0.6 });
    const spring = new THREE.MeshPhysicalMaterial({ color: 0xc8a24a, roughness: 0.28, metalness: 1 });
    const parts = { core: [], arms: [], screws: [], springs: [], rails: [] };
    const n = this.n;
    if (n === 3) {
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 18), dark);
      this.mechGroup.add(core); parts.core.push(core);
      for (let f = 0; f < 6; f++) {
        const dir = V3(FACE_NORMAL[f]);
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.86, 14), metal);
        arm.position.copy(dir).multiplyScalar(0.5);
        arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        this.mechGroup.add(arm); parts.arms.push(arm);
        const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.09, 18), metal);
        screw.position.copy(dir).multiplyScalar(0.95);
        screw.quaternion.copy(arm.quaternion);
        this.mechGroup.add(screw); parts.screws.push(screw);
        const slot = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.03, 0.04), dark);
        slot.position.copy(dir).multiplyScalar(1.0);
        slot.quaternion.copy(arm.quaternion);
        this.mechGroup.add(slot); parts.screws.push(slot);
        // helical spring around the arm
        const pts = [];
        for (let i = 0; i <= 90; i++) {
          const t = i / 90;
          const a = t * Math.PI * 2 * 4.5;
          pts.push(new THREE.Vector3(Math.cos(a) * 0.15, 0.24 + t * 0.5, Math.sin(a) * 0.15));
        }
        const curve = new THREE.CatmullRomCurve3(pts);
        const sp = new THREE.Mesh(new THREE.TubeGeometry(curve, 90, 0.022, 6, false), spring);
        sp.quaternion.copy(arm.quaternion);
        this.mechGroup.add(sp); parts.springs.push(sp);
      }
    } else {
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.62, 32, 24), dark);
      this.mechGroup.add(core); parts.core.push(core);
      for (let ax = 0; ax < 3; ax++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.78, 0.055, 10, 48), metal);
        if (ax === 0) ring.rotation.y = Math.PI / 2;
        if (ax === 1) ring.rotation.x = Math.PI / 2;
        this.mechGroup.add(ring); parts.rails.push(ring);
      }
      for (const c of this.model.cubies) {
        const dir = V3(c.home).normalize();
        const peg = new THREE.Mesh(new THREE.SphereGeometry(0.12, 14, 10), spring);
        peg.position.copy(dir).multiplyScalar(0.78);
        this.mechGroup.add(peg); parts.rails.push(peg);
      }
    }
    this.mechParts = parts;
    this.mechGroup.visible = false;
  }

  syncTransforms() {
    const sp = this.spacing * (1 + this.opts.gap);
    const ex = this.opts.explode;
    for (const c of this.cubies) {
      if (c.animating) continue;
      const p = c.model.pos;
      const radial = this._tmpV.set(p[0], p[1], p[2]);
      const len = radial.length() || 1;
      radial.multiplyScalar((sp * len + ex * 1.9) / len);
      c.group.position.copy(radial);
      const m = c.model.rot;
      this._tmpM.set(m[0], m[1], m[2], 0, m[3], m[4], m[5], 0, m[6], m[7], m[8], 0, 0, 0, 0, 1);
      c.group.quaternion.setFromRotationMatrix(this._tmpM);
    }
    if (this.mechGroup) {
      const s = 1 + ex * 0.15;
      this.mechGroup.scale.setScalar(s);
    }
    this.contact.scale.setScalar(1 + ex * 0.5 + this.opts.gap * 0.6);
  }

  applyMaterialOpts() {
    const o = this.opts;
    const pal = PALETTES[o.palette];
    if (this.bodyMat) {
      this.bodyMat.color.setHex(pal.body);
      this.bodyMat.wireframe = o.wireframe;
      const op = 1 - o.xray * 0.86;
      this.bodyMat.transparent = o.xray > 0.01;
      this.bodyMat.opacity = op;
      this.bodyMat.depthWrite = op > 0.55;
      this.bodyMat.clippingPlanes = o.cutOn ? [this.clipPlane] : [];
      this.bodyMat.needsUpdate = true;
    }
    if (this.stickerMats) {
      for (let f = 0; f < 6; f++) {
        const m = this.stickerMats[f];
        m.color.set(pal.colors[f]);
        m.emissive.set(pal.colors[f]);
        m.emissiveIntensity = pal.glow * o.glow;
        m.wireframe = o.wireframe;
        m.transparent = o.xray > 0.01;
        m.opacity = 1 - o.xray * 0.45;
        m.clippingPlanes = o.cutOn ? [this.clipPlane] : [];
        m.needsUpdate = true;
      }
    }
    if (this.footMat) {
      this.footMat.clippingPlanes = o.cutOn ? [this.clipPlane] : [];
      this.footMat.needsUpdate = true;
    }
    const showInner = o.xray > 0.08 || o.explode > 0.08;
    for (const c of this.cubies) c.feet.visible = showInner;
    if (this.mechGroup) this.mechGroup.visible = showInner && this.mode !== 'math';
    if (this.mechParts) {
      for (const s of this.mechParts.springs) s.visible = o.xray > 0.25 || o.explode > 0.4;
    }
    this.gridHelper.visible = o.grid;
    this.bloomPass.strength = o.bloom;
    this.scene.fog.density = o.fog;
    this.key.intensity = 30 * o.light;
    this.rim.intensity = 1.35 * o.light;
    this.fill.intensity = 10 * o.light;
    this.accent.intensity = 7 * o.light;
    const a = o.lightAngle;
    this.key.position.set(Math.cos(a) * 8.5, 9, Math.sin(a) * 8.5);
    this.shafts.visible = o.bloom > 0.05;
    this.contact.material.opacity = 0.85 * (1 - o.explode * 0.5);
  }

  setRadius(r) {
    this.opts.radius = r;
    if (!this.model) return;
    const size = this.cubieSize;
    const old = this.bodyGeo;
    this.bodyGeo = new RoundedBoxGeometry(size, size, size, 4, size * r);
    for (const c of this.cubies) c.body.geometry = this.bodyGeo;
    old.dispose();
    const oldO = this.outlineGeo;
    this.outlineGeo = new RoundedBoxGeometry(size * 1.09, size * 1.09, size * 1.09, 2, size * (r + 0.03));
    for (const c of this.cubies) c.outline.geometry = this.outlineGeo;
    oldO.dispose();
  }

  // ------------------------------------------------------------- animation
  animateMove(moveIdx, duration, easingName, onDone, applyModel) {
    const m = MOVES[moveIdx];
    if (m.slice && this.n === 2) { if (applyModel) applyModel(); if (onDone) onDone(); return; }
    const affected = this.cubies.filter((c) => m.layer(c.model.pos));
    if (!affected.length) { if (applyModel) applyModel(); if (onDone) onDone(); return; }
    const pivot = new THREE.Group();
    this.cubeGroup.add(pivot);
    const axis = new THREE.Vector3();
    axis.setComponent(m.axis, 1);
    const baseQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis);
    pivot.quaternion.copy(baseQ);
    for (const c of affected) { c.animating = true; pivot.attach(c.group); }
    if (applyModel) applyModel();
    const angle = moveAngle(m);
    this.anims.push({ pivot, affected, baseQ, axis, angle, start: performance.now(), dur: Math.max(0.05, duration), ease: EASINGS[easingName] || EASINGS.outCubic, onDone, moveIdx });
  }

  _finishAnim(a, skipCb) {
    for (const c of a.affected) {
      this.cubeGroup.attach(c.group);
      c.animating = false;
    }
    this.cubeGroup.remove(a.pivot);
    this.syncTransforms();
    if (a.onDone && !skipCb) a.onDone();
  }

  get busy() { return this.anims.length > 0; }

  cancelAnims() {
    for (const a of this.anims) this._finishAnim(a, true);
    this.anims = [];
  }

  setHighlight(cubieIds) {
    this.highlight = new Set(cubieIds);
    for (const c of this.cubies) {
      const on = this.highlight.has(c.model.id);
      c.outline.visible = on;
      c.outline.material.opacity = on ? 0.5 : 0;
    }
  }

  layerCubieIds(moveIdx) {
    const m = MOVES[moveIdx];
    return this.cubies.filter((c) => m.layer(c.model.pos)).map((c) => c.model.id);
  }

  // ---------------------------------------------------------------- picking
  pick(clientX, clientY) {
    const r = this.canvas.getBoundingClientRect();
    this.pointer.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const targets = [];
    if (this.netGroup.visible) {
      this.netGroup.traverse((o) => { if (o.userData && o.userData.pickable) targets.push(o); });
    } else {
      for (const c of this.cubies) for (const s of c.stickers) targets.push(s);
    }
    const hits = this.raycaster.intersectObjects(targets, false);
    return hits.length ? hits[0] : null;
  }

  project(v) {
    const p = v.clone().project(this.camera);
    const r = this.canvas.getBoundingClientRect();
    return { x: (p.x * 0.5 + 0.5) * r.width, y: (-p.y * 0.5 + 0.5) * r.height, visible: p.z < 1 };
  }

  // -------------------------------------------------------------- net rig
  buildNetRig(net, facelets) {
    this.disposeNet();
    const n = this.n;
    const size = this.n === 2 ? 2.9 : 2.9;
    const h = size / 2;
    const cell = size / n;
    this.netFaces = [];
    this.netPivots = [];
    const plateMat = new THREE.MeshPhysicalMaterial({ color: 0x0c0c16, roughness: 0.5, metalness: 0.2, clearcoat: 0.5 });
    this.netPlateMat = plateMat;
    this.netTileMats = [];
    const pal = PALETTES[this.opts.palette];
    for (let f = 0; f < 6; f++) {
      this.netTileMats.push(new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(pal.colors[f]), roughness: 0.46, metalness: 0.04, clearcoat: 0.35, clearcoatRoughness: 0.42,
        emissive: new THREE.Color(pal.colors[f]), emissiveIntensity: pal.glow * this.opts.glow,
      }));
    }
    const tileGeo = new THREE.ShapeGeometry(roundedRectShape(cell * 0.88, cell * 0.88, cell * 0.14));
    this.netTileGeo = tileGeo;
    for (let f = 0; f < 6; f++) {
      const g = new THREE.Group();
      const plate = new THREE.Mesh(new THREE.BoxGeometry(size * 0.995, size * 0.995, 0.07), plateMat);
      plate.position.z = -0.045;
      g.add(plate);
      const [u, v] = FACE_FRAME[f];
      const nrm = V3(FACE_NORMAL[f]);
      const uV = V3(u), vV = V3(v);
      const m = new THREE.Matrix4().makeBasis(uV, vV, nrm);
      g.quaternion.setFromRotationMatrix(m);
      g.position.copy(nrm).multiplyScalar(h);
      const tiles = [];
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        const tile = new THREE.Mesh(tileGeo, this.netTileMats[facelets[f][r * n + c]]);
        tile.position.set((c - (n - 1) / 2) * cell, ((n - 1) / 2 - r) * cell, 0.012);
        tile.userData = { face: f, row: r, col: c, pickable: true };
        g.add(tile);
        tiles.push(tile);
      }
      this.netGroup.add(g);
      this.netFaces.push({ group: g, tiles, face: f, plate });
    }
    // hinge tree
    const depth = new Array(6).fill(0);
    for (const hinge of net.hinges) depth[hinge.face] = depth[hinge.parent] + 1;
    this.netMaxDepth = Math.max(...depth);
    for (const hinge of net.hinges) {
      const pivot = new THREE.Group();
      const axis = V3(hinge.axis).normalize();
      pivot.position.copy(V3(hinge.point)).multiplyScalar(h);
      const baseQ = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), axis);
      pivot.quaternion.copy(baseQ);
      this.netGroup.add(pivot);
      const parent = this.netFaces[hinge.parent].group;
      parent.attach(pivot);
      // local basis after attach: rotating about local X composes correctly at
      // every depth (overwriting it would discard the parent's frame)
      const localBase = pivot.quaternion.clone();
      pivot.attach(this.netFaces[hinge.face].group);
      this.netPivots.push({ pivot, baseQ: localBase, angle: hinge.angle, face: hinge.face, depth: depth[hinge.face] });
    }
    this.netGroup.updateMatrixWorld(true);
    const cx = net.cells.reduce((s, c) => s + c.x, 0) / 6 * size;
    const cy = net.cells.reduce((s, c) => s + c.y, 0) / 6 * size;
    this.netCentroid = new THREE.Vector3(cx, cy, 0);
    this.setUnfold(this.unfoldT || 0);
  }

  frameNet(t) {
    if (!this.netFaces || !this.netFaces.length) return;
    const s = 1 / (1 + 1.9 * t);
    this.netGroup.scale.setScalar(s);
    this.netGroup.position.set(-this.netCentroid.x * s, -this.netCentroid.y * s, 0);
    const D = 5.4 + 5.6 * t;
    const dir = new THREE.Vector3(0.42 * (1 - t), 0.3 * (1 - t), 1).normalize();
    this.camera.position.copy(dir.multiplyScalar(D));
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  disposeNet() {
    this.netGroup.traverse((o) => { if (o.geometry && o.geometry !== this.netTileGeo) o.geometry.dispose(); });
    if (this.netTileGeo) this.netTileGeo.dispose();
    if (this.netPlateMat) this.netPlateMat.dispose();
    if (this.netTileMats) this.netTileMats.forEach((m) => m.dispose());
    this.netGroup.clear();
    this.netFaces = [];
    this.netPivots = [];
  }

  setUnfold(t) {
    this.unfoldT = t;
    const q = new THREE.Quaternion();
    const ax = new THREE.Vector3(1, 0, 0);
    const md = this.netMaxDepth || 1;
    const span = 1 + md * 0.18;
    for (const p of this.netPivots) {
      const local = Math.max(0, Math.min(1, t * span - p.depth * 0.18));
      q.setFromAxisAngle(ax, p.angle * local);
      p.pivot.quaternion.copy(p.baseQ).multiply(q);
    }
    if (this.netPlateMat) {
      this.netPlateMat.transparent = t > 0.02;
      this.netPlateMat.opacity = 1 - t * 0.75;
    }
  }

  syncNet(facelets) {
    if (!this.netFaces) return;
    const n = this.n;
    for (const f of this.netFaces) {
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        const tile = f.tiles[r * n + c];
        tile.material = this.netTileMats[facelets[f.face][r * n + c]];
      }
    }
    const pal = PALETTES[this.opts.palette];
    for (let f = 0; f < 6; f++) {
      this.netTileMats[f].color.set(pal.colors[f]);
      this.netTileMats[f].emissive.set(pal.colors[f]);
      this.netTileMats[f].emissiveIntensity = pal.glow * this.opts.glow;
    }
  }

  setMode(mode) {
    this.mode = mode;
    const math = mode === 'math';
    this.netGroup.visible = math;
    this.cubeGroup.visible = !math;
    this.mechGroup.visible = !math && (this.opts.xray > 0.08 || this.opts.explode > 0.08);
    this.contact.visible = !math || this.unfoldT < 0.5;
    this.applyMaterialOpts();
  }

  // ------------------------------------------------------------------ loop
  resize(w, h) {
    if (w <= 0 || h <= 0) return;
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.bloomPass.resolution.set(w, h);
  }

  setQuality(q) {
    this.opts.quality = q;
    const cap = q === 'high' ? 1.75 : q === 'medium' ? 1.25 : 1;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    this.bloomPass.enabled = q !== 'low';
    this.renderer.shadowMap.enabled = q !== 'low';
    const r = this.canvas.getBoundingClientRect();
    this.resize(r.width, r.height);
  }

  update(dt) {
    this.time += dt;
    this.skyMat.uniforms.uTime.value = this.time;
    this.particleMat.uniforms.uTime.value = this.time;
    this.shafts.rotation.y = Math.sin(this.time * 0.05) * 0.08;
    for (let i = this.anims.length - 1; i >= 0; i--) {
      const a = this.anims[i];
      const t = Math.min(1, (performance.now() - a.start) / (a.dur * 1000));
      const e = a.ease(t);
      const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), a.angle * e);
      a.pivot.quaternion.copy(a.baseQ).multiply(q);
      if (t >= 1) {
        this.anims.splice(i, 1);
        this._finishAnim(a);
      }
    }
    for (const c of this.cubies) {
      if (c.outline.visible) c.outline.material.opacity = 0.34 + Math.sin(this.time * 5) * 0.16;
    }
    if (this.opts.autoRotate && !this.busy) {
      const a = dt * 0.16;
      const p = this.camera.position.clone().sub(this.controls.target);
      p.applyAxisAngle(new THREE.Vector3(0, 1, 0), a);
      this.camera.position.copy(this.controls.target).add(p);
    }
    this.controls.update();
  }

  render() {
    if (this.bloomPass.enabled) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }

  snapshot() {
    this.render();
    return this.canvas.toDataURL('image/png');
  }

  frameCamera(preset) {
    const d = this.camera.position.distanceTo(this.controls.target);
    const dirs = {
      iso: [5.4, 4.6, 6.6], front: [0, 0, 9], top: [0.01, 9, 0.01],
      corner: [7, 7, 7], side: [9, 1.2, 0.01], low: [4.5, -3.4, 6.5],
    };
    const v = dirs[preset] || dirs.iso;
    const len = Math.hypot(...v);
    this.camera.position.set(v[0] / len * d, v[1] / len * d, v[2] / len * d);
    this.controls.update();
  }

  setDistance(d) {
    const dir = this.camera.position.clone().sub(this.controls.target).normalize();
    this.camera.position.copy(this.controls.target).add(dir.multiplyScalar(d));
    this.controls.update();
  }

  orbitBy(dAz, dPol) {
    const off = this.camera.position.clone().sub(this.controls.target);
    const sph = new THREE.Spherical().setFromVector3(off);
    sph.theta += dAz;
    sph.phi = Math.max(0.12, Math.min(Math.PI - 0.12, sph.phi + dPol));
    off.setFromSpherical(sph);
    this.camera.position.copy(this.controls.target).add(off);
    this.controls.update();
  }
}