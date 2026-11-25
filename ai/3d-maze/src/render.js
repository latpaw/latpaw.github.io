/* 渲染器：烘焙环境光照 + 精简 Bloom 后期 + 自由轨道相机 + 自适应画质 */
(function (GX) {
  'use strict';
  var T = window.THREE;
  var QUAD_VS = 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }';

  function create(canvas, onQuality) {
    var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false });
    renderer.setClearColor(0x140e26, 1);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.NoToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.info.autoReset = false;

    var scene = new T.Scene();
    scene.fog = new T.Fog(0x3a2a5c, 40, 120);
    var camera = new T.PerspectiveCamera(40, 1, 0.1, 400);
    var cameraB = new T.PerspectiveCamera(40, 1, 0.1, 400);
    var splitOn = false;

    var quality = 'high', dpr = 1, W = 1, H = 1;
    var lastSize = 0, autoDrop = true;

    var sky = GX.models.skyDome();
    scene.add(sky);

    // 环境贴图只烘焙一次
    var pmrem = new T.PMREMGenerator(renderer);
    var envScene = new T.Scene();
    var envSky = GX.models.skyDome();
    envSky.scale.setScalar(0.05);
    envScene.add(envSky);
    var envGeo = new T.PlaneGeometry(6, 6);
    var envMats = [];
    [[0xfff0c0, 6, 5, 3, 2.6], [0xff6fc8, -6, 2, -4, 1.5], [0x4fe3ff, 5, -1, -6, 1.2]].forEach(function (d) {
      var mm = new T.MeshBasicMaterial({ color: d[0], side: T.DoubleSide });
      envMats.push(mm);
      var m = new T.Mesh(envGeo, mm);
      m.position.set(d[1], d[2], d[3]); m.lookAt(0, 0, 0); m.scale.setScalar(d[4]);
      envScene.add(m);
    });
    var envRT = pmrem.fromScene(envScene, 0.03);
    scene.environment = envRT.texture;
    envSky.geometry.dispose(); envSky.material.dispose(); envGeo.dispose();
    envMats.forEach(function (m) { m.dispose(); });
    pmrem.dispose();

    var hemi = new T.HemisphereLight(0xffd9a0, 0x5a4890, 0.9);
    scene.add(hemi);
    var key = new T.DirectionalLight(0xfff2d8, 2.2);
    key.position.set(14, 20, 12);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1; key.shadow.camera.far = 90;
    key.shadow.bias = -0.0014;
    key.shadow.normalBias = 0.04;
    scene.add(key, key.target);
    var rim = new T.DirectionalLight(0xff5ec8, 1.2);
    rim.position.set(-12, 6, -14);
    scene.add(rim);
    var fill = new T.DirectionalLight(0x4fe3ff, 0.75);
    fill.position.set(-14, -4, 10);
    scene.add(fill);

    var shaftMat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false,
      uniforms: { uTime: { value: 0 }, uColor: { value: new T.Color(0xffdca8) }, uOpacity: { value: 0.062 } },
      vertexShader: 'varying vec2 vUv; varying vec3 vN; void main(){ vUv=uv; vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: [
        'varying vec2 vUv; varying vec3 vN; uniform float uTime; uniform vec3 uColor; uniform float uOpacity;',
        'void main(){',
        '  float fade = smoothstep(0.0,0.35,vUv.y)*smoothstep(1.0,0.55,vUv.y);',
        '  float edge = pow(1.0-abs(dot(normalize(vN),vec3(0.0,0.0,1.0))),1.4);',
        '  float flick = 0.82+0.18*sin(uTime*0.7+vUv.x*9.0);',
        '  gl_FragColor = vec4(uColor, fade*edge*uOpacity*flick);',
        '}'
      ].join('\n')
    });
    var shafts = new T.Group();
    for (var si = 0; si < 2; si++) {
      var cg = new T.ConeGeometry(2.6 + si * 0.9, 30, 12, 1, true);
      var mesh = new T.Mesh(cg, shaftMat);
      mesh.position.set(-6 + si * 11, 13, -4 + si * 6);
      mesh.rotation.set(0.2, si * 0.8, 0.24 - si * 0.14);
      mesh.renderOrder = 3;
      shafts.add(mesh);
    }
    scene.add(shafts);

    var dust = GX.models.dustField(170, 46);
    scene.add(dust);

    /* ---- 后期：亮部提取 + 单次可分离模糊 + 合成 ---- */
    var sceneRT = new T.WebGLRenderTarget(1, 1, { type: T.HalfFloatType, depthBuffer: true });
    var brightRT = new T.WebGLRenderTarget(1, 1, { type: T.HalfFloatType, depthBuffer: false });
    var blurA = new T.WebGLRenderTarget(1, 1, { type: T.HalfFloatType, depthBuffer: false });
    var blurB = new T.WebGLRenderTarget(1, 1, { type: T.HalfFloatType, depthBuffer: false });
    var quadScene = new T.Scene();
    var quadCam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var quadGeo = new T.PlaneGeometry(2, 2);
    var quad = new T.Mesh(quadGeo, null);
    quad.frustumCulled = false;
    quadScene.add(quad);

    var brightMat = new T.ShaderMaterial({
      uniforms: { tSrc: { value: null }, uThreshold: { value: 0.74 }, uKnee: { value: 0.4 } },
      vertexShader: QUAD_VS,
      fragmentShader: 'varying vec2 vUv; uniform sampler2D tSrc; uniform float uThreshold; uniform float uKnee; void main(){ vec3 c=texture2D(tSrc,vUv).rgb; float l=dot(c,vec3(0.2126,0.7152,0.0722)); gl_FragColor=vec4(c*smoothstep(uThreshold,uThreshold+uKnee,l),1.0); }'
    });
    var blurMat = new T.ShaderMaterial({
      uniforms: { tSrc: { value: null }, uDir: { value: new T.Vector2(1, 0) } },
      vertexShader: QUAD_VS,
      fragmentShader: [
        'varying vec2 vUv; uniform sampler2D tSrc; uniform vec2 uDir;',
        'void main(){',
        '  vec3 s = texture2D(tSrc,vUv).rgb*0.227027;',
        '  s += (texture2D(tSrc,vUv+uDir*1.3846).rgb + texture2D(tSrc,vUv-uDir*1.3846).rgb)*0.316216;',
        '  s += (texture2D(tSrc,vUv+uDir*3.2307).rgb + texture2D(tSrc,vUv-uDir*3.2307).rgb)*0.070270;',
        '  gl_FragColor = vec4(s,1.0); }'
      ].join('\n')
    });
    var compMat = new T.ShaderMaterial({
      uniforms: {
        tScene: { value: null }, tBloom: { value: null },
        uBloom: { value: 0.6 }, uTime: { value: 0 }, uExposure: { value: 1.05 },
        uVignette: { value: 0.4 }, uGrain: { value: 0.03 }, uAberration: { value: 0.0014 },
        uFlash: { value: 0 }, uFlashColor: { value: new T.Color(0xffffff) }, uSat: { value: 1.16 }
      },
      vertexShader: QUAD_VS,
      fragmentShader: [
        'varying vec2 vUv; uniform sampler2D tScene; uniform sampler2D tBloom;',
        'uniform float uBloom,uTime,uExposure,uVignette,uGrain,uAberration,uFlash,uSat;',
        'uniform vec3 uFlashColor;',
        'vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.0,1.0); }',
        'vec3 toSRGB(vec3 c){ return mix(c*12.92, 1.055*pow(max(c,vec3(0.0)),vec3(1.0/2.4))-0.055, step(0.0031308,c)); }',
        'float hash(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }',
        'void main(){',
        '  vec2 d = vUv-0.5; float r2 = dot(d,d);',
        '  vec2 off = d*uAberration*(0.4+r2*2.0);',
        '  vec3 col;',
        '  col.r = texture2D(tScene, vUv+off).r;',
        '  col.g = texture2D(tScene, vUv).g;',
        '  col.b = texture2D(tScene, vUv-off).b;',
        '  col += texture2D(tBloom, vUv).rgb*uBloom;',
        '  col *= uExposure;',
        '  col = aces(col);',
        '  float lum = dot(col, vec3(0.2126,0.7152,0.0722));',
        '  col = mix(vec3(lum), col, uSat);',
        '  col = toSRGB(col);',
        '  col *= 1.0 - uVignette*smoothstep(0.15,0.78,r2);',
        '  col += (hash(vUv*vec2(1024.0,768.0)+fract(uTime)*97.0)-0.5)*uGrain;',
        '  col = mix(col, uFlashColor, uFlash);',
        '  gl_FragColor = vec4(col,1.0); }'
      ].join('\n')
    });

    /* ---- 相机：完全自由的轨道 ---- */
    function makeCamState() {
      return {
        theta: -Math.PI * 0.28, phi: 1.06, radius: 24,
        tTheta: -Math.PI * 0.28, tPhi: 1.06, tRadius: 24,
        target: new T.Vector3(0, 0, 0), tTarget: new T.Vector3(0, 0, 0),
        minR: 8, maxR: 70, shake: 0, idle: 0, drift: 0
      };
    }
    var cam = makeCamState();
    var camB = makeCamState();
    function applyOne(cs, co, dt) {
      var k = 1 - Math.pow(0.0016, dt);
      cs.theta += (cs.tTheta - cs.theta) * k;
      cs.phi += (cs.tPhi - cs.phi) * k;
      cs.radius += (cs.tRadius - cs.radius) * k;
      cs.target.lerp(cs.tTarget, 1 - Math.pow(0.0009, dt));
      cs.idle += dt;
      var driftAmt = Math.min(1, Math.max(0, (cs.idle - 6) / 3));
      cs.drift += dt * 0.15;
      var th = cs.theta + Math.sin(cs.drift) * 0.03 * driftAmt;
      var ph = Math.max(0.03, Math.min(Math.PI - 0.03, cs.phi + Math.sin(cs.drift * 0.73) * 0.016 * driftAmt));
      var sp = Math.sin(ph), cp = Math.cos(ph);
      co.position.set(
        cs.target.x + cs.radius * sp * Math.sin(th),
        cs.target.y + cs.radius * cp,
        cs.target.z + cs.radius * sp * Math.cos(th)
      );
      if (cs.shake > 0.0001) {
        co.position.x += (Math.random() - 0.5) * cs.shake;
        co.position.y += (Math.random() - 0.5) * cs.shake;
        co.position.z += (Math.random() - 0.5) * cs.shake;
        cs.shake *= Math.pow(0.02, dt);
      }
      co.up.set(0, 1, 0);
      co.lookAt(cs.target);
      co.updateMatrixWorld();
    }
    function applyCamera(dt) {
      applyOne(cam, camera, dt);
      if (splitOn) applyOne(camB, cameraB, dt);
    }

    // 把某个面转到镜头前，保留一点斜角以维持立体感
    function focusFace(n, which) {
      var phi, theta;
      if (Math.abs(n[1]) > 0.9) {
        phi = n[1] > 0 ? 0.36 : Math.PI - 0.36;
        theta = cam.tTheta;
      } else {
        phi = Math.PI / 2 - 0.3;
        theta = Math.atan2(n[0], n[2]) + 0.3;
      }
      // 始终走最短角路径，避免绕远路导致切面半天转不到位
      var targets = which === 1 ? [camB] : which === 0 ? [cam] : [cam, camB];
      targets.forEach(function (cs) {
        var useTheta = Math.abs(n[1]) > 0.9 ? cs.tTheta : theta;
        var d = useTheta - cs.tTheta;
        d -= Math.PI * 2 * Math.round(d / (Math.PI * 2));
        cs.tTheta += d;
        cs.tPhi = phi;
        cs.idle = 0;
      });
    }

    function fitDistance(N, aspectOverride) {
      var h = N / 2 + 0.5;
      var pts = [];
      for (var x = -1; x <= 1; x += 2) for (var y = -1; y <= 1; y += 2) for (var z = -1; z <= 1; z += 2) pts.push(new T.Vector3(x * h, y * h, z * h));
      var tmp = new T.PerspectiveCamera(camera.fov, aspectOverride || camera.aspect, 0.1, 500);
      var d = N * 2.6;
      for (var it = 0; it < 6; it++) {
        var sp = Math.sin(cam.tPhi), cp = Math.cos(cam.tPhi);
        tmp.position.set(d * sp * Math.sin(cam.tTheta), d * cp, d * sp * Math.cos(cam.tTheta));
        tmp.lookAt(0, 0, 0);
        tmp.updateMatrixWorld(); tmp.updateProjectionMatrix();
        var m = 0.001;
        for (var i = 0; i < pts.length; i++) {
          var v = pts[i].clone().project(tmp);
          var limX = splitOn ? 0.80 : 0.95, limY = splitOn ? 0.76 : 0.92;
          m = Math.max(m, Math.abs(v.x) / limX, Math.abs(v.y) / limY);
        }
        d *= m;
      }
      return Math.max(8, Math.min(160, d));
    }

    function frameCube(N) {
      lastSize = N;
      var r = fitDistance(N);
      cam.minR = N * 1.15;
      cam.maxR = N * 6;
      cam.tRadius = r; cam.radius = r * 1.18;
      cam.tTarget.set(0, 0, 0); cam.target.set(0, 0, 0);
      cam.minR = N * 1.15; cam.maxR = N * 6;
      camB.tRadius = r; camB.radius = r * 1.18;
      camB.tTarget.set(0, 0, 0); camB.target.set(0, 0, 0);
      camB.minR = N * 1.15; camB.maxR = N * 6;
      var s = N * 0.95;
      key.shadow.camera.left = -s; key.shadow.camera.right = s;
      key.shadow.camera.top = s; key.shadow.camera.bottom = -s;
      key.shadow.camera.updateProjectionMatrix();
      key.position.set(N * 1.1, N * 1.7, N * 0.95);
      scene.fog.near = N * 4;
      scene.fog.far = N * 13;
      shafts.scale.setScalar(Math.max(0.8, N / 9));
      renderer.shadowMap.needsUpdate = true;
    }

    function setQuality(q, user, silent) {
      quality = q;
      if (user) autoDrop = false;
      var cap = q === 'high' ? 1.5 : q === 'medium' ? 1.25 : 1.0;
      dpr = Math.min(window.devicePixelRatio || 1, cap);
      renderer.setPixelRatio(dpr);
      var sm = q === 'low' ? 512 : 1024;
      if (key.shadow.mapSize.x !== sm) {
        key.shadow.mapSize.set(sm, sm);
        if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; }
      }
      renderer.shadowMap.enabled = q !== 'low';
      shafts.visible = q === 'high';
      dust.visible = q !== 'low';
      compMat.uniforms.uGrain.value = q === 'low' ? 0 : 0.03;
      compMat.uniforms.uAberration.value = q === 'low' ? 0 : 0.0014;
      var want = q === 'high' ? 2 : 0;
      if (sceneRT.samples !== want) { sceneRT.samples = want; sceneRT.dispose(); }
      resize();
      renderer.shadowMap.needsUpdate = true;
      if (onQuality && !silent) onQuality(q, !user);
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      renderer.setSize(W, H, false);
      var a = splitOn ? (W / 2) / H : W / H;
      camera.aspect = a; camera.updateProjectionMatrix();
      cameraB.aspect = a; cameraB.updateProjectionMatrix();
      var pw = Math.max(1, Math.round(W * dpr)), ph = Math.max(1, Math.round(H * dpr));
      sceneRT.setSize(pw, ph);
      brightRT.setSize(Math.max(1, pw >> 1), Math.max(1, ph >> 1));
      blurA.setSize(Math.max(1, pw >> 2), Math.max(1, ph >> 2));
      blurB.setSize(Math.max(1, pw >> 2), Math.max(1, ph >> 2));
      if (lastSize) { var fr = fitDistance(lastSize, splitOn ? (W / 2) / H : W / H); cam.tRadius = fr; camB.tRadius = fr; }
    }

    var time = 0, ema = 16.7, slowTime = 0, fps = 60;
    function renderFrame(dt, raw, budgetMs) {
      time += dt;
      renderer.info.reset();
      var real = Math.min(0.5, raw || dt);
      var ms = real * 1000;
      ema += (ms - ema) * 0.12;
      fps = 1000 / Math.max(1, ema);
      if (autoDrop && quality !== 'low') {
        var limit = Math.max(32, (budgetMs || 16.7) * 1.4);
        if (ema > limit) slowTime += real; else slowTime = Math.max(0, slowTime - real * 2);
        if (slowTime > 1.1) { slowTime = 0; ema = 20; setQuality(quality === 'high' ? 'medium' : 'low', false); }
      }
      applyCamera(dt);
      sky.userData.mat.uniforms.uTime.value = time;
      if (dust.visible) dust.userData.mat.uniforms.uTime.value = time;
      if (shafts.visible) shaftMat.uniforms.uTime.value = time;
      compMat.uniforms.uTime.value = time;
      compMat.uniforms.uFlash.value *= Math.pow(0.008, dt);

      renderer.setRenderTarget(sceneRT);
      if (splitOn) {
        var pw = sceneRT.width, phh = sceneRT.height, half = Math.floor(pw / 2);
        // 阴影贴图必须在全幅视口下刷新：半幅 scissor 会把深度图也裁掉一半，
        // 留下的旧深度会在砖块上投出方形假黑影
        if (renderer.shadowMap.enabled && renderer.shadowMap.needsUpdate) {
          renderer.setScissorTest(false);
          renderer.setViewport(0, 0, pw, phh);
          renderer.render(scene, camera);
        }
        renderer.setScissorTest(true);
        renderer.setViewport(0, 0, half, phh);
        renderer.setScissor(0, 0, half, phh);
        renderer.render(scene, camera);
        renderer.setViewport(half, 0, pw - half, phh);
        renderer.setScissor(half, 0, pw - half, phh);
        renderer.render(scene, cameraB);
        renderer.setScissorTest(false);
        renderer.setViewport(0, 0, pw, phh);
      } else {
        renderer.render(scene, camera);
      }

      if (quality !== 'low') {
        quad.material = brightMat;
        brightMat.uniforms.tSrc.value = sceneRT.texture;
        renderer.setRenderTarget(brightRT);
        renderer.render(quadScene, quadCam);
        var spread = quality === 'high' ? 1.7 : 1.2;
        quad.material = blurMat;
        blurMat.uniforms.tSrc.value = brightRT.texture;
        blurMat.uniforms.uDir.value.set(spread / blurA.width, 0);
        renderer.setRenderTarget(blurA);
        renderer.render(quadScene, quadCam);
        blurMat.uniforms.tSrc.value = blurA.texture;
        blurMat.uniforms.uDir.value.set(0, spread / blurA.height);
        renderer.setRenderTarget(blurB);
        renderer.render(quadScene, quadCam);
        compMat.uniforms.tBloom.value = blurB.texture;
        compMat.uniforms.uBloom.value = 0.6;
      } else {
        compMat.uniforms.uBloom.value = 0;
      }
      quad.material = compMat;
      compMat.uniforms.tScene.value = sceneRT.texture;
      renderer.setRenderTarget(null);
      renderer.render(quadScene, quadCam);
    }

    function flash(color, amount) {
      compMat.uniforms.uFlashColor.value.set(color);
      compMat.uniforms.uFlash.value = amount;
    }

    setQuality('high', false, true);
    autoDrop = true;

    return {
      renderer: renderer, scene: scene, camera: camera, cameraB: cameraB, cam: cam, camB: camB, key: key,
      get splitOn() { return splitOn; },
      setSplit: function (v) { splitOn = !!v; resize(); },
      renderFrame: renderFrame, resize: resize, setQuality: setQuality,
      frameCube: frameCube, fitDistance: fitDistance, focusFace: focusFace, flash: flash,
      get quality() { return quality; },
      get fps() { return fps; },
      get drawCalls() { return renderer.info.render.calls; },
      shake: function (a) { cam.shake = Math.max(cam.shake, a); camB.shake = Math.max(camB.shake, a); },
      bumpIdle: function () { cam.idle = 0; camB.idle = 0; },
      dispose: function () {
        sceneRT.dispose(); brightRT.dispose(); blurA.dispose(); blurB.dispose();
        envRT.dispose(); quadGeo.dispose();
        brightMat.dispose(); blurMat.dispose(); compMat.dispose(); shaftMat.dispose();
        renderer.dispose();
      }
    };
  }

  GX.render = { create: create };
})(window.GX = window.GX || {});