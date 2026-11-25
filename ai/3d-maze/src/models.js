/* 3D 零件工厂：几何体与材质全局复用，避免每关重建 */
(function (GX) {
  'use strict';
  var T = window.THREE;
  var P = GX.PALETTE;
  var TAU = Math.PI * 2;

  var geoCache = {}, matCache = {};
  function geo(key, make) { return geoCache[key] || (geoCache[key] = make()); }
  function mat(key, make) { return matCache[key] || (matCache[key] = make()); }

  function roundedBoxGeo(w, h, d, r, seg) {
    r = Math.min(r, w / 2 - 0.001, h / 2 - 0.001, d / 2 - 0.001);
    seg = seg || 2;
    var s = new T.Shape();
    var hw = w / 2, hh = h / 2;
    s.moveTo(-hw + r, -hh);
    s.lineTo(hw - r, -hh);
    s.quadraticCurveTo(hw, -hh, hw, -hh + r);
    s.lineTo(hw, hh - r);
    s.quadraticCurveTo(hw, hh, hw - r, hh);
    s.lineTo(-hw + r, hh);
    s.quadraticCurveTo(-hw, hh, -hw, hh - r);
    s.lineTo(-hw, -hh + r);
    s.quadraticCurveTo(-hw, -hh, -hw + r, -hh);
    var g = new T.ExtrudeGeometry(s, {
      depth: Math.max(0.001, d - 2 * r), bevelEnabled: true,
      bevelSize: r, bevelThickness: r, bevelSegments: seg, curveSegments: seg + 1, steps: 1
    });
    g.translate(0, 0, -(d - 2 * r) / 2);
    g.computeVertexNormals();
    return g;
  }

  // 供 rotation.x = -PI/2 的「平放」盒子使用：参数按世界坐标 (宽, 高, 深) 传入
  function slabGeo(w, h, d, r, seg) { return roundedBoxGeo(w, d, h, r, seg); }

  // 20 三角形的倒角砖块：远处看和圆角盒几乎一样，但便宜近十倍
  function brickGeo(w, h, d, ch) {
    ch = Math.min(ch, h * 0.4, w * 0.3, d * 0.3);
    var hw = w / 2, hd = d / 2, iw = hw - ch, id = hd - ch;
    var pos = new Float32Array([
      -hw, 0, -hd, hw, 0, -hd, hw, 0, hd, -hw, 0, hd,
      -hw, h - ch, -hd, hw, h - ch, -hd, hw, h - ch, hd, -hw, h - ch, hd,
      -iw, h, -id, iw, h, -id, iw, h, id, -iw, h, id
    ]);
    var idx = [0, 1, 2, 0, 2, 3, 8, 10, 9, 8, 11, 10];
    for (var i = 0; i < 4; i++) {
      var j = (i + 1) % 4;
      idx.push(i, 4 + j, j, i, 4 + i, 4 + j);
      idx.push(4 + i, 8 + j, 4 + j, 4 + i, 8 + i, 8 + j);
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    return g;
  }

  function gearGeo(R, teeth, thick, toothH) {
    var s = new T.Shape();
    var w = TAU / teeth;
    for (var i = 0; i < teeth; i++) {
      var a = i * w;
      var pts = [[a, R], [a + w * 0.16, R + toothH], [a + w * 0.34, R + toothH], [a + w * 0.5, R], [a + w * 0.99, R]];
      for (var k = 0; k < pts.length; k++) {
        var x = Math.cos(pts[k][0]) * pts[k][1], y = Math.sin(pts[k][0]) * pts[k][1];
        if (i === 0 && k === 0) s.moveTo(x, y); else s.lineTo(x, y);
      }
    }
    s.closePath();
    var hole = new T.Path(); hole.absarc(0, 0, R * 0.24, 0, TAU, true); s.holes.push(hole);
    for (var h = 0; h < 4; h++) {
      var ang = h / 4 * TAU + 0.4;
      var hp = new T.Path();
      hp.absarc(Math.cos(ang) * R * 0.58, Math.sin(ang) * R * 0.58, R * 0.15, 0, TAU, true);
      s.holes.push(hp);
    }
    var g = new T.ExtrudeGeometry(s, {
      depth: thick, bevelEnabled: true, bevelSize: thick * 0.16, bevelThickness: thick * 0.16,
      bevelSegments: 1, curveSegments: 5, steps: 1
    });
    g.translate(0, 0, -thick / 2);
    g.computeVertexNormals();
    return g;
  }

  function starGeo(R, r, thick) {
    var s = new T.Shape();
    for (var i = 0; i < 10; i++) {
      var a = i / 10 * TAU - Math.PI / 2, rad = i % 2 ? r : R;
      var x = Math.cos(a) * rad, y = Math.sin(a) * rad;
      if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
    }
    s.closePath();
    var g = new T.ExtrudeGeometry(s, {
      depth: thick, bevelEnabled: true, bevelSize: thick * 0.3, bevelThickness: thick * 0.3,
      bevelSegments: 2, curveSegments: 1, steps: 1
    });
    g.translate(0, 0, -thick / 2);
    g.computeVertexNormals();
    return g;
  }

  /* ---------- 材质 ---------- */
  function candy(color, opts) {
    opts = opts || {};
    return new T.MeshStandardMaterial({
      color: color,
      roughness: opts.rough == null ? 0.55 : opts.rough,
      metalness: opts.metal == null ? 0.05 : opts.metal,
      emissive: opts.emissive == null ? 0x000000 : opts.emissive,
      emissiveIntensity: opts.ei == null ? 1 : opts.ei,
      transparent: !!opts.transparent,
      opacity: opts.opacity == null ? 1 : opts.opacity
    });
  }
  var MAT = {
    floorA: function () { return mat('floorA', function () { return candy(P.cream, { rough: 0.78 }); }); },
    floorB: function () { return mat('floorB', function () { return candy(P.creamAlt, { rough: 0.78 }); }); },
    rotorFloor: function () { return mat('rotorFloor', function () { return candy(0xffcf8d, { rough: 0.62, emissive: 0x4a2a00, ei: 0.35 }); }); },
    wall: function () { return mat('wall', function () { return candy(P.mintDark, { rough: 0.6 }); }); },
    wallTop: function () { return mat('wallTop', function () { return candy(P.mint, { rough: 0.45 }); }); },
    brass: function () { return mat('brass', function () { return candy(P.brass, { rough: 0.28, metal: 0.9 }); }); },
    brassDark: function () { return mat('brassDark', function () { return candy(P.brassDark, { rough: 0.42, metal: 0.85 }); }); },
    brassLight: function () { return mat('brassLight', function () { return candy(P.brassLight, { rough: 0.3, metal: 0.8 }); }); },
    rock: function () { return mat('rock', function () { return candy(P.rock, { rough: 0.95 }); }); },
    rockDark: function () { return mat('rockDark', function () { return candy(P.rockDark, { rough: 1 }); }); },
    wood: function () { return mat('wood', function () { return candy(0xc98b46, { rough: 0.8 }); }); },
    white: function () { return mat('white', function () { return candy(0xfff6e8, { rough: 0.4 }); }); },
    dark: function () { return mat('dark', function () { return candy(0x2c2040, { rough: 0.6 }); }); },
    glow: function (hex, ei) {
      return mat('glow' + hex + '_' + (ei || 1), function () {
        return candy(hex, { rough: 0.3, emissive: hex, ei: ei == null ? 1.4 : ei });
      });
    },
    // 不用 transmission：那会让 three 每帧把整个不透明场景多渲染一遍
    gem: function (hex) {
      return mat('gem' + hex, function () {
        return candy(hex, { rough: 0.1, metal: 0.2, emissive: hex, ei: 0.9, transparent: true, opacity: 0.93 });
      });
    }
  };

  /* ---------- 零件 ---------- */
  function floorTile(alt) {
    var g = geo('tile', function () { return slabGeo(0.94, 0.26, 0.94, 0.1, 2); });
    var m = new T.Mesh(g, alt ? MAT.floorB() : MAT.floorA());
    m.rotation.x = -Math.PI / 2;
    m.position.y = -0.13;
    m.receiveShadow = true;
    return m;
  }

  function wallBlock() {
    var grp = new T.Group();
    var body = new T.Mesh(geo('wallBody', function () { return slabGeo(0.96, 0.72, 0.96, 0.14, 2); }), MAT.wall());
    body.rotation.x = -Math.PI / 2; body.position.y = 0.36;
    body.castShadow = true; body.receiveShadow = true;
    var cap = new T.Mesh(geo('wallCap', function () { return slabGeo(0.86, 0.14, 0.86, 0.07, 2); }), MAT.wallTop());
    cap.rotation.x = -Math.PI / 2; cap.position.y = 0.76;
    cap.castShadow = true;
    grp.add(body, cap);
    return grp;
  }

  function rivetRing(radius, count, y) {
    var rg = geo('rivet', function () { return new T.SphereGeometry(0.045, 8, 6); });
    var inst = new T.InstancedMesh(rg, MAT.brassLight(), count);
    var m = new T.Matrix4(), q = new T.Quaternion(), one = new T.Vector3(1, 1, 1);
    for (var i = 0; i < count; i++) {
      var a = i / count * TAU;
      m.compose(new T.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius), q, one);
      inst.setMatrixAt(i, m);
    }
    inst.instanceMatrix.needsUpdate = true;
    return inst;
  }

  function gearMesh(R, teeth, thick, material) {
    var key = 'gear' + R + '_' + teeth + '_' + thick;
    var g = geo(key, function () { return gearGeo(R, teeth, thick, R * 0.22); });
    var m = new T.Mesh(g, material || MAT.brass());
    m.castShadow = true;
    return m;
  }

  // 壁挂齿轮装置：底座 + 齿轮 + 指针 + 状态灯
  function gearDevice(steps) {
    var grp = new T.Group();
    var mount = new T.Mesh(geo('gearMount', function () { return roundedBoxGeo(0.78, 0.78, 0.16, 0.09, 2); }), MAT.brassDark());
    mount.position.set(0, 0.5, 0);
    mount.castShadow = true;
    grp.add(mount);

    var spinner = new T.Group();
    spinner.position.set(0, 0.5, 0.14);
    var gm = gearMesh(0.26, steps * 2, 0.1, MAT.brass());
    spinner.add(gm);
    // 缺口标记：对准上方指针即正确
    var notch = new T.Mesh(geo('notch', function () { return roundedBoxGeo(0.09, 0.2, 0.13, 0.03, 1); }), MAT.glow(P.amber, 1.8));
    notch.position.set(0, 0.2, 0.02);
    spinner.add(notch);
    var hub = new T.Mesh(geo('gearHub', function () { return new T.CylinderGeometry(0.06, 0.06, 0.2, 12); }), MAT.brassLight());
    hub.rotation.x = Math.PI / 2; hub.position.z = 0.04;
    spinner.add(hub);
    grp.add(spinner);

    var pointer = new T.Mesh(geo('pointer', function () { return new T.ConeGeometry(0.07, 0.16, 4); }), MAT.white());
    pointer.position.set(0, 0.94, 0.16);
    pointer.rotation.z = Math.PI;
    grp.add(pointer);

    var lamp = new T.Mesh(geo('statusLamp', function () { return new T.SphereGeometry(0.062, 12, 10); }), MAT.glow(P.ruby, 1.6).clone());
    lamp.position.set(0.29, 0.87, 0.14);
    grp.add(lamp);

    grp.userData.spinner = spinner;
    grp.userData.lamp = lamp;
    grp.userData.pickTag = true;
    return grp;
  }

  function leverDevice() {
    var grp = new T.Group();
    var base = new T.Mesh(geo('leverBase', function () { return roundedBoxGeo(0.5, 0.22, 0.4, 0.07, 2); }), MAT.brassDark());
    base.position.y = 0.82; base.castShadow = true;
    grp.add(base);
    var pivot = new T.Group(); pivot.position.set(0, 0.9, 0);
    var rod = new T.Mesh(geo('leverRod', function () { return new T.CylinderGeometry(0.045, 0.055, 0.52, 10); }), MAT.brassLight());
    rod.position.y = 0.26; rod.castShadow = true;
    var knob = new T.Mesh(geo('leverKnob', function () { return new T.SphereGeometry(0.115, 16, 12); }), MAT.glow(P.ruby, 0.7));
    knob.position.y = 0.54; knob.castShadow = true;
    pivot.add(rod, knob);
    pivot.rotation.x = -0.62;
    grp.add(pivot);
    grp.userData.pivot = pivot;
    grp.userData.knob = knob;
    grp.userData.pickTag = true;
    return grp;
  }

  function lampDevice(hex) {
    var grp = new T.Group();
    var post = new T.Mesh(geo('lampPost', function () { return new T.CylinderGeometry(0.07, 0.1, 0.34, 10); }), MAT.brassDark());
    post.position.y = 0.92; post.castShadow = true;
    grp.add(post);
    var crystal = new T.Mesh(geo('lampCrystal', function () { return new T.OctahedronGeometry(0.19, 0); }), MAT.glow(hex, 0.5).clone());
    crystal.position.y = 1.24; crystal.castShadow = true;
    grp.add(crystal);
    var halo = new T.Mesh(geo('lampHalo', function () { return new T.TorusGeometry(0.24, 0.022, 6, 20); }), MAT.glow(hex, 1.2).clone());
    halo.position.y = 1.24; halo.rotation.x = Math.PI / 2;
    grp.add(halo);
    grp.userData.crystal = crystal;
    grp.userData.halo = halo;
    grp.userData.pickTag = true;
    return grp;
  }

  function doorMesh(hex) {
    var grp = new T.Group();
    var frameMat = MAT.brassDark();
    var slab = new T.Mesh(geo('doorSlab', function () { return roundedBoxGeo(0.92, 0.8, 0.2, 0.08, 2); }), MAT.brass());
    slab.position.y = 0.4; slab.castShadow = true;
    grp.add(slab);
    for (var i = -1; i <= 1; i++) {
      var bar = new T.Mesh(geo('doorBar', function () { return roundedBoxGeo(0.1, 0.62, 0.26, 0.04, 1); }), frameMat);
      bar.position.set(i * 0.26, 0.4, 0);
      grp.add(bar);
    }
    var lock = new T.Mesh(geo('doorLock', function () { return new T.OctahedronGeometry(0.15, 0); }), MAT.gem(hex));
    lock.position.set(0, 0.46, 0.16);
    grp.add(lock);
    var ring = new T.Mesh(geo('doorRing', function () { return new T.TorusGeometry(0.2, 0.03, 6, 18); }), MAT.glow(hex, 1.1));
    ring.position.set(0, 0.46, 0.14);
    grp.add(ring);
    grp.userData.lock = lock;
    grp.userData.ring = ring;
    grp.userData.slab = slab;
    return grp;
  }

  function bridgeMesh() {
    var grp = new T.Group();
    for (var i = 0; i < 3; i++) {
      var plank = new T.Mesh(geo('plank', function () { return roundedBoxGeo(0.9, 0.12, 0.26, 0.05, 1); }), MAT.wood());
      plank.position.set(0, -0.06, (i - 1) * 0.31);
      plank.castShadow = true; plank.receiveShadow = true;
      grp.add(plank);
    }
    var rail = new T.Mesh(geo('bridgeRail', function () { return roundedBoxGeo(0.14, 0.1, 0.94, 0.04, 1); }), MAT.brassDark());
    rail.position.set(0, -0.14, 0);
    grp.add(rail);
    return grp;
  }

  function keyMesh(hex) {
    var grp = new T.Group();
    var gem = new T.Mesh(geo('keyGem', function () { return new T.OctahedronGeometry(0.19, 0); }), MAT.gem(hex));
    gem.position.y = 0.2; gem.castShadow = true;
    grp.add(gem);
    var shaft = new T.Mesh(geo('keyShaft', function () { return new T.CylinderGeometry(0.032, 0.032, 0.3, 8); }), MAT.brassLight());
    shaft.position.y = -0.06;
    grp.add(shaft);
    for (var i = 0; i < 2; i++) {
      var tooth = new T.Mesh(geo('keyTooth', function () { return roundedBoxGeo(0.11, 0.05, 0.05, 0.02, 1); }), MAT.brassLight());
      tooth.position.set(0.06, -0.13 - i * 0.08, 0);
      grp.add(tooth);
    }
    var halo = new T.Mesh(geo('keyHalo', function () { return new T.TorusGeometry(0.28, 0.02, 6, 22); }), MAT.glow(hex, 1.6));
    halo.rotation.x = Math.PI / 2; halo.position.y = -0.2;
    grp.add(halo);
    grp.userData.gem = gem;
    grp.userData.halo = halo;
    return grp;
  }

  function starMesh() {
    var m = new T.Mesh(geo('star', function () { return starGeo(0.24, 0.11, 0.09); }), MAT.glow(P.amber, 1.5));
    m.castShadow = true;
    return m;
  }

  function rotorHub() {
    var grp = new T.Group();
    var plate = new T.Mesh(geo('hubPlate', function () { return new T.CylinderGeometry(0.3, 0.34, 0.09, 20); }), MAT.brassDark());
    plate.position.y = 0.02; plate.receiveShadow = true;
    grp.add(plate);
    var cog = gearMesh(0.2, 10, 0.08, MAT.brass());
    cog.rotation.x = -Math.PI / 2; cog.position.y = 0.09;
    grp.add(cog);
    var knob = new T.Mesh(geo('hubKnob', function () { return new T.SphereGeometry(0.09, 14, 10); }), MAT.glow(P.cyan, 1.2));
    knob.position.y = 0.16;
    grp.add(knob);
    var arrow = new T.Mesh(geo('hubArrow', function () { return new T.ConeGeometry(0.07, 0.15, 3); }), MAT.glow(P.cyan, 1.4));
    arrow.position.set(0.26, 0.1, 0); arrow.rotation.z = -Math.PI / 2;
    grp.add(arrow);
    grp.add(rivetRing(0.31, 8, 0.06));
    grp.userData.knob = knob;
    grp.userData.pickTag = true;
    return grp;
  }

  function portalMesh() {
    var grp = new T.Group();
    var ring = new T.Mesh(geo('portalRing', function () { return new T.TorusGeometry(0.44, 0.075, 10, 30); }), MAT.brass());
    ring.position.y = 0.62; ring.castShadow = true;
    grp.add(ring);
    var ring2 = new T.Mesh(geo('portalRing2', function () { return new T.TorusGeometry(0.52, 0.03, 8, 30); }), MAT.glow(P.magenta, 1.6));
    ring2.position.y = 0.62;
    grp.add(ring2);
    var swirlMat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, side: T.DoubleSide,
      uniforms: { uTime: { value: 0 }, uColorA: { value: new T.Color(P.magenta) }, uColorB: { value: new T.Color(P.cyan) }, uOpen: { value: 1 } },
      vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: [
        'varying vec2 vUv; uniform float uTime; uniform vec3 uColorA; uniform vec3 uColorB; uniform float uOpen;',
        'void main(){',
        '  vec2 p = vUv*2.0-1.0; float r = length(p); if(r>1.0) discard;',
        '  float a = atan(p.y,p.x);',
        '  float s = sin(a*3.0 + uTime*2.2 - r*7.0)*0.5+0.5;',
        '  float s2 = sin(a*5.0 - uTime*1.4 + r*11.0)*0.5+0.5;',
        '  vec3 col = mix(uColorA,uColorB,s*0.7+s2*0.3);',
        '  float edge = smoothstep(1.0,0.55,r);',
        '  float core = smoothstep(0.0,0.85,1.0-r);',
        '  gl_FragColor = vec4(col*(0.7+core*1.5), edge*(0.55+core*0.45)*uOpen);',
        '}'
      ].join('\n')
    });
    var disc = new T.Mesh(geo('portalDisc', function () { return new T.CircleGeometry(0.42, 32); }), swirlMat);
    disc.position.y = 0.62;
    grp.add(disc);
    var base = new T.Mesh(geo('portalBase', function () { return new T.CylinderGeometry(0.46, 0.52, 0.12, 20); }), MAT.brassDark());
    base.position.y = 0.04; base.receiveShadow = true;
    grp.add(base);
    grp.add(rivetRing(0.48, 10, 0.1));
    grp.userData.swirlMat = swirlMat;
    grp.userData.ring2 = ring2;
    grp.userData.disc = disc;
    return grp;
  }

  function robotMesh() {
    var grp = new T.Group();
    var body = new T.Mesh(geo('botBody', function () { return roundedBoxGeo(0.44, 0.4, 0.38, 0.16, 3); }), MAT.white());
    body.position.y = 0.3; body.castShadow = true;
    grp.add(body);
    var belt = new T.Mesh(geo('botBelt', function () { return roundedBoxGeo(0.46, 0.1, 0.4, 0.04, 2); }), MAT.brass());
    belt.position.y = 0.24;
    grp.add(belt);
    var chest = new T.Mesh(geo('botChest', function () { return new T.CircleGeometry(0.075, 16); }), MAT.glow(P.amber, 1.6));
    chest.position.set(0, 0.34, 0.196);
    grp.add(chest);

    var head = new T.Group(); head.position.y = 0.62;
    var skull = new T.Mesh(geo('botHead', function () { return roundedBoxGeo(0.46, 0.36, 0.4, 0.16, 3); }), MAT.white());
    skull.castShadow = true;
    head.add(skull);
    var face = new T.Mesh(geo('botFace', function () { return roundedBoxGeo(0.36, 0.22, 0.06, 0.09, 2); }), MAT.dark());
    face.position.z = 0.19;
    head.add(face);
    var eyeGeo = geo('botEye', function () { return new T.SphereGeometry(0.052, 12, 10); });
    var eyeL = new T.Mesh(eyeGeo, MAT.glow(P.cyan, 2.2));
    eyeL.position.set(-0.085, 0.01, 0.225);
    var eyeR = new T.Mesh(eyeGeo, MAT.glow(P.cyan, 2.2));
    eyeR.position.set(0.085, 0.01, 0.225);
    head.add(eyeL, eyeR);
    var cheekGeo = geo('botCheek', function () { return new T.CircleGeometry(0.035, 12); });
    [-0.16, 0.16].forEach(function (x) {
      var c = new T.Mesh(cheekGeo, MAT.glow(P.ruby, 0.9));
      c.position.set(x, -0.08, 0.205);
      head.add(c);
    });
    var ear = geo('botEar', function () { return new T.CylinderGeometry(0.055, 0.055, 0.07, 12); });
    [-0.24, 0.24].forEach(function (x) {
      var e = new T.Mesh(ear, MAT.brass());
      e.rotation.z = Math.PI / 2; e.position.set(x, 0, 0);
      head.add(e);
    });
    var ant = new T.Mesh(geo('botAnt', function () { return new T.CylinderGeometry(0.016, 0.02, 0.2, 8); }), MAT.brassDark());
    ant.position.y = 0.27; head.add(ant);
    var antBall = new T.Mesh(geo('botAntBall', function () { return new T.SphereGeometry(0.062, 14, 10); }), MAT.glow(P.magenta, 2.0));
    antBall.position.y = 0.4; head.add(antBall);
    grp.add(head);

    var armGeo = geo('botArm', function () { return new T.CapsuleGeometry(0.055, 0.14, 4, 8); });
    var armL = new T.Mesh(armGeo, MAT.brassLight()); armL.position.set(-0.27, 0.32, 0); armL.castShadow = true;
    var armR = new T.Mesh(armGeo, MAT.brassLight()); armR.position.set(0.27, 0.32, 0); armR.castShadow = true;
    grp.add(armL, armR);

    var hover = new T.Mesh(geo('botHover', function () { return new T.TorusGeometry(0.19, 0.035, 8, 20); }), MAT.glow(P.cyan, 1.8));
    hover.rotation.x = Math.PI / 2; hover.position.y = 0.07;
    grp.add(hover);
    var jet = new T.Mesh(geo('botJet', function () { return new T.ConeGeometry(0.15, 0.26, 14, 1, true); }), new T.MeshBasicMaterial({
      color: P.cyan, transparent: true, opacity: 0.3, depthWrite: false, side: T.DoubleSide, blending: T.AdditiveBlending
    }));
    jet.position.y = -0.06; jet.rotation.x = Math.PI;
    grp.add(jet);

    grp.userData.head = head;
    grp.userData.eyes = [eyeL, eyeR];
    grp.userData.arms = [armL, armR];
    grp.userData.hover = hover;
    grp.userData.jet = jet;
    grp.userData.antBall = antBall;
    grp.userData.body = body;
    return grp;
  }

  function islandBase(W, H) {
    var grp = new T.Group();
    var w = W + 0.7, h = H + 0.7;
    var top = new T.Mesh(slabGeo(w, 0.7, h, 0.3, 3), MAT.rock());
    top.rotation.x = -Math.PI / 2; top.position.y = -0.62;
    top.receiveShadow = true; top.castShadow = true;
    grp.add(top);
    var trim = new T.Mesh(slabGeo(w + 0.16, 0.16, h + 0.16, 0.07, 2), MAT.brassDark());
    trim.rotation.x = -Math.PI / 2; trim.position.y = -0.3;
    grp.add(trim);
    var coneH = Math.min(w, h) * 0.44;
    var cone = new T.Mesh(new T.ConeGeometry(Math.min(w, h) * 0.42, coneH, 9, 1), MAT.rockDark());
    cone.rotation.x = Math.PI; cone.position.y = -0.95 - coneH / 2;
    cone.castShadow = true;
    grp.add(cone);
    var band = new T.Mesh(new T.TorusGeometry(Math.min(w, h) * 0.4, 0.09, 8, 28), MAT.brass());
    band.rotation.x = Math.PI / 2; band.position.y = -1.5;
    grp.add(band);
    // 岛底悬挂的装饰齿轮
    var spinners = [];
    for (var i = 0; i < 5; i++) {
      var a = i / 5 * TAU + 0.3;
      var rad = Math.min(w, h) * 0.4;
      var g = gearMesh(0.34 + (i % 3) * 0.12, 10 + (i % 3) * 2, 0.12, i % 2 ? MAT.brass() : MAT.brassDark());
      g.position.set(Math.cos(a) * rad, -1.05 - (i % 3) * 0.42, Math.sin(a) * rad);
      g.rotation.y = -a;
      g.userData.spin = (i % 2 ? 1 : -1) * (0.25 + i * 0.06);
      grp.add(g); spinners.push(g);
    }
    grp.userData.spinners = spinners;
    grp.userData.ownGeo = [top.geometry, trim.geometry, cone.geometry, band.geometry];
    return grp;
  }

  function skyDome() {
    var m = new T.ShaderMaterial({
      side: T.BackSide, depthWrite: false, fog: false,
      uniforms: {
        uTop: { value: new T.Color(0x140c33) },
        uMid: { value: new T.Color(0x53307f) },
        uBot: { value: new T.Color(0xd9646b) },
        uTime: { value: 0 }
      },
      vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: [
        'varying vec3 vP; uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uBot; uniform float uTime;',
        'float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }',
        'void main(){',
        '  vec3 d = normalize(vP);',
        '  float y = d.y*0.5+0.5;',
        '  vec3 col = mix(uBot, uMid, smoothstep(0.02,0.28,y));',
        '  col = mix(col, uTop, smoothstep(0.28,0.66,y));',
        '  float band = sin(d.x*2.4 + uTime*0.06)*sin(d.z*2.0 - uTime*0.045);',
        '  col += vec3(0.10,0.04,0.14)*smoothstep(0.3,1.0,band)*smoothstep(0.25,0.8,y);',
        '  vec2 sp = floor(d.xz*90.0 + d.y*40.0);',
        '  float st = step(0.9975, hash(sp));',
        '  col += vec3(1.0,0.95,0.85)*st*smoothstep(0.35,0.9,y)*(0.6+0.4*sin(uTime*2.0+hash(sp)*30.0));',
        '  gl_FragColor = vec4(col,1.0);',
        '}'
      ].join('\n')
    });
    var mesh = new T.Mesh(new T.SphereGeometry(140, 32, 20), m);
    mesh.userData.mat = m;
    return mesh;
  }

  function dustField(count, span) {
    var pos = new Float32Array(count * 3);
    var seed = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * span;
      pos[i * 3 + 1] = Math.random() * 14 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * span;
      seed[i] = Math.random() * TAU;
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new T.BufferAttribute(seed, 1));
    var m = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uSize: { value: 26 }, uColor: { value: new T.Color(0xffd98a) } },
      vertexShader: [
        'attribute float aSeed; uniform float uTime; uniform float uSize; varying float vA;',
        'void main(){',
        '  vec3 p = position;',
        '  p.y += sin(uTime*0.32 + aSeed)*1.4 + mod(uTime*0.22 + aSeed, 1.0)*0.6;',
        '  p.x += sin(uTime*0.21 + aSeed*2.0)*0.9;',
        '  p.z += cos(uTime*0.17 + aSeed*1.7)*0.9;',
        '  vec4 mv = modelViewMatrix*vec4(p,1.0);',
        '  vA = 0.35 + 0.65*(0.5+0.5*sin(uTime*1.6+aSeed*5.0));',
        '  gl_PointSize = uSize/max(1.0,-mv.z);',
        '  gl_Position = projectionMatrix*mv;',
        '}'
      ].join('\n'),
      fragmentShader: [
        'varying float vA; uniform vec3 uColor;',
        'void main(){ vec2 c = gl_PointCoord-0.5; float d=length(c); if(d>0.5) discard;',
        '  float a = smoothstep(0.5,0.0,d); gl_FragColor = vec4(uColor, a*a*vA*0.55); }'
      ].join('\n')
    });
    var pts = new T.Points(g, m);
    pts.frustumCulled = false;
    pts.userData.mat = m;
    return pts;
  }

  // 一次性粒子爆发（收集/开门/胜利）
  function burstSystem(max) {
    var pos = new Float32Array(max * 3);
    var col = new Float32Array(max * 3);
    var siz = new Float32Array(max);
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new T.BufferAttribute(col, 3));
    g.setAttribute('aSize', new T.BufferAttribute(siz, 1));
    g.setDrawRange(0, 0);
    var m = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      uniforms: {},
      vertexShader: [
        'attribute vec3 aColor; attribute float aSize; varying vec3 vC;',
        'void main(){ vC=aColor; vec4 mv=modelViewMatrix*vec4(position,1.0);',
        '  gl_PointSize=aSize*300.0/max(1.0,-mv.z); gl_Position=projectionMatrix*mv; }'
      ].join('\n'),
      fragmentShader: [
        'varying vec3 vC;',
        'void main(){ vec2 c=gl_PointCoord-0.5; float d=length(c); if(d>0.5) discard;',
        '  float a=smoothstep(0.5,0.0,d); gl_FragColor=vec4(vC,a*a); }'
      ].join('\n')
    });
    var pts = new T.Points(g, m);
    pts.frustumCulled = false;
    return pts;
  }

  /* ---------- 魔方结构 ---------- */
  // 实心内核：让立方体不透明，背面才能安全剔除
  function cubeCore(N) {
    var side = N - 0.52;
    var g = roundedBoxGeo(side, side, side, 0.16, 2);
    var m = new T.Mesh(g, MAT.rockDark());
    m.receiveShadow = true;
    m.userData.ownGeo = [g];
    return m;
  }

  // 12 条棱轨 + 8 个角块，实例化，不随面转动
  function cubeFrame(N) {
    var grp = new T.Group();
    var h = N / 2 - 0.05;
    var railGeo = roundedBoxGeo(0.2, 0.2, N - 0.24, 0.06, 1);
    var rails = new T.InstancedMesh(railGeo, MAT.brass(), 12);
    rails.castShadow = true;
    var mtx = new T.Matrix4(), q = new T.Quaternion(), one = new T.Vector3(1, 1, 1);
    var n = 0;
    for (var a = 0; a < 3; a++) {
      for (var s1 = -1; s1 <= 1; s1 += 2) for (var s2 = -1; s2 <= 1; s2 += 2) {
        var p = [0, 0, 0];
        p[a] = 0;
        p[(a + 1) % 3] = s1 * h;
        p[(a + 2) % 3] = s2 * h;
        // 几何长轴为 Z，需转到自由轴 a 上
        var e = [0, 0, 0];
        if (a === 0) e[1] = Math.PI / 2;      // Z -> X
        else if (a === 1) e[0] = Math.PI / 2; // Z -> Y
        q.setFromEuler(new T.Euler(e[0], e[1], e[2]));
        mtx.compose(new T.Vector3(p[0], p[1], p[2]), q, one);
        rails.setMatrixAt(n++, mtx);
      }
    }
    rails.instanceMatrix.needsUpdate = true;
    grp.add(rails);
    var cornerGeo = roundedBoxGeo(0.34, 0.34, 0.34, 0.11, 2);
    var corners = new T.InstancedMesh(cornerGeo, MAT.brassLight(), 8);
    corners.castShadow = true;
    n = 0;
    q.identity();
    for (var x = -1; x <= 1; x += 2) for (var y = -1; y <= 1; y += 2) for (var z = -1; z <= 1; z += 2) {
      mtx.compose(new T.Vector3(x * h, y * h, z * h), q, one);
      corners.setMatrixAt(n++, mtx);
    }
    corners.instanceMatrix.needsUpdate = true;
    grp.add(corners);
    grp.userData.ownGeo = [railGeo, cornerGeo];
    return grp;
  }

  // 随面转动的面板边框 + 方位标记，让「转了 90°」看得出来
  function faceRim(N, tint) {
    var grp = new T.Group();
    var s = N - 0.34, t = 0.07;
    var barGeo = roundedBoxGeo(s, t, t, 0.03, 1);
    var bars = new T.InstancedMesh(barGeo, MAT.brassDark(), 4);
    var bm = new T.Matrix4(), bq = new T.Quaternion(), bone = new T.Vector3(1, 1, 1);
    var rotY = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), Math.PI / 2);
    [[0, -s / 2, false], [0, s / 2, false], [-s / 2, 0, true], [s / 2, 0, true]].forEach(function (p, i) {
      bm.compose(new T.Vector3(p[0], 0.015, p[1]), p[2] ? rotY : bq, bone);
      bars.setMatrixAt(i, bm);
    });
    bars.instanceMatrix.needsUpdate = true;
    grp.add(bars);
    var mark = new T.Mesh(geo('rimMark', function () { return new T.ConeGeometry(0.13, 0.26, 3); }), MAT.glow(tint, 1.3));
    mark.rotation.x = -Math.PI / 2;
    mark.position.set(0, 0.06, -s / 2 + 0.2);
    grp.add(mark);
    grp.add(rivetRing(s / 2 - 0.02, 4, 0.05));
    grp.userData.mark = mark;
    grp.userData.ownGeo = [barGeo];
    return grp;
  }

  // 平躺朝外的齿轮盘：缺口对准固定指针即正确
  function gearDial(steps) {
    var grp = new T.Group();
    var plate = new T.Mesh(geo('dialPlate', function () { return new T.CylinderGeometry(0.44, 0.48, 0.11, 20); }), MAT.brassDark());
    plate.position.y = 0.05; plate.castShadow = true; plate.receiveShadow = true;
    grp.add(plate);
    var spinner = new T.Group();
    spinner.position.y = 0.15;
    var gm = gearMesh(0.3, steps * 2, 0.1, MAT.brass());
    gm.rotation.x = -Math.PI / 2;
    spinner.add(gm);
    var notch = new T.Mesh(geo('dialNotch', function () { return roundedBoxGeo(0.1, 0.12, 0.2, 0.03, 1); }), MAT.glow(P.amber, 2.0));
    notch.position.set(0, 0.04, -0.26);
    spinner.add(notch);
    var hub = new T.Mesh(geo('dialHub', function () { return new T.CylinderGeometry(0.07, 0.07, 0.2, 12); }), MAT.brassLight());
    hub.position.y = 0.06;
    spinner.add(hub);
    grp.add(spinner);
    var pointer = new T.Mesh(geo('dialPointer', function () { return new T.ConeGeometry(0.09, 0.2, 4); }), MAT.white());
    pointer.rotation.x = Math.PI / 2;
    pointer.position.set(0, 0.16, -0.5);
    grp.add(pointer);
    var lamp = new T.Mesh(geo('dialLamp', function () { return new T.SphereGeometry(0.07, 12, 10); }), MAT.glow(P.ruby, 1.6).clone());
    lamp.position.set(0.33, 0.14, 0.33);
    grp.add(lamp);
    grp.add(rivetRing(0.45, 6, 0.1));
    grp.userData.spinner = spinner;
    grp.userData.lamp = lamp;
    grp.userData.pickTag = true;
    return grp;
  }

  // 玩家编号牌：始终朝向镜头，且穿透立方体可见 —— 合作时永远找得到彼此
  function playerTag(num, hex) {
    var c = document.createElement('canvas');
    c.width = c.height = 96;
    var x = c.getContext('2d');
    var css = '#' + ('000000' + hex.toString(16)).slice(-6);
    x.beginPath(); x.arc(48, 48, 38, 0, Math.PI * 2);
    x.fillStyle = 'rgba(18,10,30,.82)'; x.fill();
    x.lineWidth = 7; x.strokeStyle = css; x.stroke();
    x.fillStyle = css;
    x.font = 'bold 52px system-ui, sans-serif';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(String(num), 48, 52);
    var tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    var mat = new T.SpriteMaterial({ map: tex, transparent: true, depthTest: false, depthWrite: false, fog: false });
    var sp = new T.Sprite(mat);
    sp.scale.setScalar(0.46);
    sp.renderOrder = 20;
    return sp;
  }

  // 传送门：地面上的发光圆环 + 漩涡 + 方向箭头 + 光柱
  // canEnter=false 表示这是单向门的出口端，踩上去不会有反应
  function portalGate(hex, canEnter, twoWay) {
    var grp = new T.Group();
    var ring = new T.Mesh(geo('pgRing', function () { return new T.TorusGeometry(0.4, 0.055, 8, 26); }), MAT.brass());
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.05;
    grp.add(ring);
    var glow = new T.Mesh(geo('pgGlow', function () { return new T.TorusGeometry(0.4, 0.022, 6, 26); }), MAT.glow(hex, canEnter ? 2.0 : 0.7));
    glow.rotation.x = Math.PI / 2; glow.position.y = 0.1;
    grp.add(glow);

    var swirl = mat('pgSwirl' + hex + (canEnter ? 1 : 0), function () {
      return new T.ShaderMaterial({
        transparent: true, depthWrite: false, side: T.DoubleSide,
        uniforms: { uTime: { value: 0 }, uCol: { value: new T.Color(hex) }, uOn: { value: canEnter ? 1 : 0.34 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader: [
          'varying vec2 vUv; uniform float uTime; uniform vec3 uCol; uniform float uOn;',
          'void main(){',
          '  vec2 p = vUv*2.0-1.0; float r = length(p); if(r>1.0) discard;',
          '  float a = atan(p.y,p.x);',
          '  float s = sin(a*4.0 - uTime*3.0 + r*9.0)*0.5+0.5;',
          '  float core = smoothstep(0.0,0.9,1.0-r);',
          '  float edge = smoothstep(1.0,0.6,r);',
          '  vec3 c = uCol*(0.55+s*0.7+core*1.1);',
          '  gl_FragColor = vec4(c, edge*(0.5+core*0.5)*uOn);',
          '}'
        ].join('\n')
      });
    });
    var disc = new T.Mesh(geo('pgDisc', function () { return new T.CircleGeometry(0.37, 24); }), swirl);
    disc.rotation.x = -Math.PI / 2; disc.position.y = 0.055;
    grp.add(disc);

    // 方向箭头：可进入 = 向下扎进环里；单向出口 = 向上冒出来
    var arrowGeo = geo('pgArrow', function () { return new T.ConeGeometry(0.11, 0.24, 4); });
    var arrow = new T.Mesh(arrowGeo, MAT.glow(hex, canEnter ? 2.2 : 0.8));
    arrow.position.y = canEnter ? 0.42 : 0.34;
    arrow.rotation.x = canEnter ? Math.PI : 0;
    grp.add(arrow);
    if (twoWay) {
      var a2 = new T.Mesh(arrowGeo, MAT.glow(hex, 1.6));
      a2.position.y = 0.16; a2.rotation.x = 0; a2.scale.setScalar(0.72);
      grp.add(a2);
      grp.userData.arrow2 = a2;
    }
    var beamMat = mat('pgBeam' + hex + (canEnter ? 1 : 0), function () {
      return new T.ShaderMaterial({
        transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false,
        uniforms: { uCol: { value: new T.Color(hex) }, uOn: { value: canEnter ? 0.5 : 0.18 }, uTime: { value: 0 } },
        vertexShader: 'varying vec2 vUv; varying vec3 vN; void main(){ vUv=uv; vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
        fragmentShader: [
          'varying vec2 vUv; varying vec3 vN; uniform vec3 uCol; uniform float uOn; uniform float uTime;',
          'void main(){',
          '  float up = pow(1.0 - vUv.y, 2.2);',
          '  float rim = pow(1.0 - abs(dot(normalize(vN), vec3(0.0,0.0,1.0))), 1.6);',
          '  float flick = 0.85 + 0.15*sin(uTime*2.0 + vUv.y*6.0);',
          '  gl_FragColor = vec4(uCol, up*rim*uOn*flick);',
          '}'
        ].join('\n')
      });
    });
    var beam = new T.Mesh(geo('pgBeam', function () { return new T.CylinderGeometry(0.1, 0.34, 1.9, 12, 1, true); }), beamMat);
    beam.position.y = 0.95; beam.renderOrder = 2;
    grp.add(beam);

    grp.userData.swirl = swirl;
    grp.userData.glow = glow;
    grp.userData.arrow = arrow;
    grp.userData.beam = beam;
    grp.userData.beamMat = beamMat;
    grp.userData.canEnter = canEnter;
    return grp;
  }

  GX.models = {
    MAT: MAT, candy: candy, roundedBoxGeo: roundedBoxGeo, slabGeo: slabGeo, brickGeo: brickGeo, gearGeo: gearGeo, starGeo: starGeo,
    floorTile: floorTile, wallBlock: wallBlock, gearMesh: gearMesh, gearDevice: gearDevice,
    leverDevice: leverDevice, lampDevice: lampDevice, doorMesh: doorMesh, bridgeMesh: bridgeMesh,
    keyMesh: keyMesh, starMesh: starMesh, rotorHub: rotorHub, portalMesh: portalMesh,
    robotMesh: robotMesh, islandBase: islandBase, skyDome: skyDome, dustField: dustField,
    cubeCore: cubeCore, cubeFrame: cubeFrame, faceRim: faceRim, gearDial: gearDial, playerTag: playerTag, portalGate: portalGate,
    burstSystem: burstSystem, rivetRing: rivetRing, geo: geo, mat: mat
  };
})(window.GX = window.GX || {});