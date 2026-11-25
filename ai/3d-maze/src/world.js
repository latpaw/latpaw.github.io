/* 魔方场景装配与动画：每面独立实例化 + 背面剔除 + 角色随面转动 */
(function (GX) {
  'use strict';
  var T = window.THREE;
  var P = GX.PALETTE;
  var M = GX.models;
  var LV = GX.level;
  var C = GX.cube;
  var TAU = Math.PI * 2;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeBack(t) { var c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }

  function create(rv) {
    var root = new T.Group();
    rv.scene.add(root);

    var L = null, S = null;
    var owned = [];
    var anims = [];
    var faces = [];
    var pickables = [];
    var activePlanes = [];
    var dev = { gears: [], levers: [], lamps: [], doors: [], bridges: [], keys: [], stars: [], portals: [] };
    var portal = null, portalFace = -1;
    var players = [];
    var hoverMesh = null, hintMesh = null, pathDots = [], guideDots = [], pathInst = null, guideInst = null;
    var dotMtx = new T.Matrix4(), dotScale = new T.Vector3();
    var burst = null, burstData = [], burstMax = 300;
    var time = 0;
    function newPlayer(i) {
      return { index: i, robot: null, shadow: null, tag: null, cell: 0, face: 0, path: [], segT: 0,
        moving: false, crossing: false, speed: 6, facing: 0, onArrive: null, onStep: null,
        blink: 2 + Math.random(), cross: null, offX: 0, arrived: false, scale: 1, lastTeleport: false };
    }
    var scratchA = new T.Vector3(), scratchB = new T.Vector3(), scratchQ = new T.Quaternion(), scratchQ2 = new T.Quaternion();
    var camDir = new T.Vector3();

    function track(o) { owned.push(o); return o; }
    function localX(base) { return (base % L.per) % L.N - (L.N - 1) / 2; }
    function localZ(base) { return (((base % L.per) / L.N) | 0) - (L.N - 1) / 2; }
    function baseLocal(cell, out) {
      var b = LV.baseOf(L, S, cell);
      return out.set(localX(b), 0, localZ(b));
    }
    function cellWorld(cell, y, out) {
      var f = LV.faceOf(L, cell);
      baseLocal(cell, out);
      out.y = y || 0;
      return faces[f].spin.localToWorld(out);
    }
    function faceQuat(f) {
      var F = C.FACES[f];
      var m = new T.Matrix4().makeBasis(
        new T.Vector3(F.u[0], F.u[1], F.u[2]),
        new T.Vector3(F.n[0], F.n[1], F.n[2]),
        new T.Vector3(F.v[0], F.v[1], F.v[2])
      );
      return new T.Quaternion().setFromRotationMatrix(m);
    }

    function clear() {
      anims.length = 0; pickables.length = 0; activePlanes.length = 0; burstData.length = 0;
      Object.keys(dev).forEach(function (k) { dev[k].length = 0; });
      root.traverse(function (o) { if (o.isInstancedMesh) o.dispose(); });
      while (root.children.length) root.remove(root.children[0]);
      owned.forEach(function (o) { if (o && o.dispose) o.dispose(); });
      owned = [];
      faces = [];
      portal = null; portalFace = -1; players = []; hoverMesh = null; hintMesh = null;
      pathDots = []; guideDots = []; pathInst = null; guideInst = null; burst = null;

    }

    function load(level, state, playerCount) {
      clear();
      L = level; S = state;
      var nPlayers = Math.max(1, Math.min(2, playerCount || 1));
      var N = L.N, per = L.per;

      var core = M.cubeCore(N);
      core.userData.ownGeo.forEach(track);
      root.add(core);
      var frame = M.cubeFrame(N);
      frame.userData.ownGeo.forEach(track);
      root.add(frame);

      var tileGeo = M.geo('tile', function () { return M.brickGeo(0.95, 0.26, 0.95, 0.07); });
      var bodyGeo = M.geo('wallBody', function () { return M.brickGeo(0.96, 0.9, 0.96, 0.14); });
      var capGeo = M.geo('wallCap', function () { return M.brickGeo(0.88, 0.14, 0.88, 0.05); });
      var qUp = new T.Quaternion();
      var mtx = new T.Matrix4(), one = new T.Vector3(1, 1, 1), col = new T.Color();

      for (var f = 0; f < 6; f++) {
        var F = C.FACES[f], tint = GX.FACE_TINTS[f];
        var fg = new T.Group();
        fg.quaternion.copy(faceQuat(f));
        fg.position.set(F.n[0] * N / 2, F.n[1] * N / 2, F.n[2] * N / 2);
        var spin = new T.Group();
        spin.rotation.y = -S.ang[f] * Math.PI / 2;
        fg.add(spin);
        root.add(fg);

        var wallMat = track(M.candy(tint.wall, { rough: 0.6 }));
        var capMat = track(M.candy(tint.cap, { rough: 0.45 }));
        var floorCells = [], wallCells = [];
        for (var v = 0; v < N; v++) for (var u = 0; u < N; u++) {
          var b = f * per + v * N + u;
          if (L.bridgeOf[b] >= 0) continue;
          if (L.t[b]) floorCells.push(b); else wallCells.push(b);
        }
        var fi = new T.InstancedMesh(tileGeo, M.MAT.floorA(), floorCells.length);
        fi.receiveShadow = true;
        floorCells.forEach(function (b, n) {
          mtx.compose(new T.Vector3(localX(b), -0.26, localZ(b)), qUp, one);
          fi.setMatrixAt(n, mtx);
          var uv = LV.uvOf(L, b);
          col.set((uv[0] + uv[1]) % 2 ? P.creamAlt : P.cream);
          fi.setColorAt(n, col);
        });
        fi.instanceMatrix.needsUpdate = true;
        if (fi.instanceColor) fi.instanceColor.needsUpdate = true;
        spin.add(fi);

        var wi = new T.InstancedMesh(bodyGeo, wallMat, wallCells.length);
        var ci = new T.InstancedMesh(capGeo, capMat, wallCells.length);
        wi.castShadow = true; wi.receiveShadow = true; ci.castShadow = true;
        wallCells.forEach(function (b, n) {
          mtx.compose(new T.Vector3(localX(b), 0, localZ(b)), qUp, one);
          wi.setMatrixAt(n, mtx);
          mtx.compose(new T.Vector3(localX(b), 0.88, localZ(b)), qUp, one);
          ci.setMatrixAt(n, mtx);
        });
        wi.instanceMatrix.needsUpdate = true; ci.instanceMatrix.needsUpdate = true;
        spin.add(wi, ci);

        var rim = M.faceRim(N, tint.cap);
        rim.userData.ownGeo.forEach(track);
        spin.add(rim);

        var hub = M.rotorHub();
        hub.scale.setScalar(1.15);
        hub.position.y = 0.02;
        hub.userData.pick = { kind: 'twist', face: f };
        spin.add(hub);
        pickables.push(hub);

        // 旋转几何体而非 mesh，使 mesh 局部坐标与面的 XZ 网格一致
        var planeGeo = track(new T.PlaneGeometry(N, N));
        planeGeo.rotateX(-Math.PI / 2);
        var plane = new T.Mesh(planeGeo, track(new T.MeshBasicMaterial({ visible: false })));
        plane.userData.face = f;
        fg.add(plane);

        faces.push({ group: fg, spin: spin, rim: rim, hub: hub, plane: plane, angle: S.ang[f], visual: -S.ang[f] * Math.PI / 2, normal: new T.Vector3(F.n[0], F.n[1], F.n[2]), front: true });
      }

      function place(mesh, base, y) {
        var f = LV.faceOf(L, base);
        mesh.position.set(localX(base), y || 0, localZ(base));
        faces[f].spin.add(mesh);
        return f;
      }

      function horizontal(base) {
        var f = LV.faceOf(L, base);
        for (var k = 1; k <= 3; k += 2) {
          var n = L.topo.nbr[base * 4 + k];
          if (n >= 0 && LV.faceOf(L, n) === f && L.t[n]) return true;
        }
        return false;
      }

      L.gates.forEach(function (g) {
        if (g.kind === 'lever') {
          var bg = M.bridgeMesh();
          place(bg, g.base, -0.8);
          if (horizontal(g.base)) bg.rotation.y = Math.PI / 2;
          var pit = new T.Mesh(M.geo('pit', function () { return M.slabGeo(0.94, 0.1, 0.94, 0.05, 1); }), M.MAT.rockDark());
          pit.rotation.x = -Math.PI / 2;
          place(pit, g.base, -0.5);
          dev.bridges.push({ group: bg, gate: g.id, open: false });
        } else {
          var hex = g.kind === 'key' ? GX.KEY_COLORS[L.keys[g.ref].color].hex : g.kind === 'gear' ? P.amber : P.magenta;
          var dm = M.doorMesh(hex);
          place(dm, g.base, 0);
          if (horizontal(g.base)) dm.rotation.y = Math.PI / 2;
          dev.doors.push({ group: dm, gate: g.id, open: false, hex: hex, base: g.base });
        }
      });

      L.gears.forEach(function (g) {
        var d = M.gearDial(g.steps);
        d.scale.setScalar(1.06);
        place(d, g.base, 1.02);
        d.userData.pick = { kind: 'gear', id: g.id };
        d.userData.spinner.rotation.y = -S.gear[g.id] * TAU / g.steps;
        track(d.userData.lamp.material);
        pickables.push(d);
        dev.gears.push({ group: d, gear: g, visual: -S.gear[g.id] * TAU / g.steps, target: -S.gear[g.id] * TAU / g.steps });
      });
      L.levers.forEach(function (lv) {
        var d = M.leverDevice();
        d.scale.setScalar(1.1);
        place(d, lv.base, 0.16);
        d.userData.pick = { kind: 'lever', id: lv.id };
        pickables.push(d);
        dev.levers.push({ group: d, lever: lv });
      });
      var lampHues = [P.cyan, P.amber, P.lime, P.magenta];
      L.seqs.forEach(function (sq) {
        sq.lamps.forEach(function (base, li) {
          var d = M.lampDevice(lampHues[li % 4]);
          d.scale.setScalar(1.05);
          place(d, base, 0.26);
          d.userData.pick = { kind: 'lamp', id: sq.id, lamp: li };
          track(d.userData.crystal.material); track(d.userData.halo.material);
          pickables.push(d);
          dev.lamps.push({ group: d, seq: sq, index: li, lit: 0, hex: lampHues[li % 4] });
        });
      });
      L.portals.forEach(function (po) {
        var hue = GX.PORTAL_HUES[po.hue].hex;
        [[po.a, 0], [po.b, 1]].forEach(function (pair) {
          var canEnter = pair[1] === 0 || po.twoWay;
          var g = M.portalGate(hue, canEnter, po.twoWay);
          place(g, pair[0], 0.02);
          dev.portals.push({ group: g, portal: po, end: pair[1], base: pair[0], canEnter: canEnter, hue: hue });
        });
      });
      L.keys.forEach(function (k) {
        var hex = GX.KEY_COLORS[k.color].hex;
        var km = M.keyMesh(hex);
        km.scale.setScalar(1.15);
        place(km, k.base, 0.66);
        dev.keys.push({ group: km, key: k, taken: false, base: 0.66 });
      });
      L.stars.forEach(function (st) {
        var sm = M.starMesh();
        sm.scale.setScalar(1.15);
        place(sm, st.base, 0.7);
        dev.stars.push({ group: sm, star: st, taken: false, base: 0.7 });
      });

      portal = M.portalMesh();
      portal.scale.setScalar(0.92);
      portalFace = place(portal, L.exit, 0);
      track(portal.userData.swirlMat);
      var pl = new T.PointLight(0xff6fd0, 3.4, 6, 1.8);
      pl.position.set(0, 0.8, 0);
      portal.add(pl);

      var pad = new T.Mesh(M.geo('startPad', function () { return new T.TorusGeometry(0.36, 0.045, 8, 22); }), M.MAT.glow(P.lime, 1.1));
      pad.rotation.x = Math.PI / 2;
      place(pad, L.start, 0.03);

      var PLAYER_HEX = [0x8ff2ff, 0xffc53d];
      for (var pi = 0; pi < nPlayers; pi++) {
        var pl = newPlayer(pi);
        var rb = M.robotMesh();
        pl.scale = nPlayers > 1 ? 0.94 : 1.02;
        rb.scale.setScalar(pl.scale);
        rb.traverse(function (o) { if (o.isMesh) o.castShadow = false; });
        track(rb.userData.jet.material);
        if (pi === 1) {
          // 二号机换成琥珀配色，两个孩子一眼能分清谁是谁
          var tintTo = P.amber;
          [rb.userData.hover, rb.userData.antBall, rb.userData.eyes[0], rb.userData.eyes[1]].forEach(function (m) {
            m.material = track(m.material.clone());
            m.material.color.set(tintTo); m.material.emissive.set(tintTo);
          });
          rb.userData.jet.material.color.set(tintTo);
        }
        var bl = new T.PointLight(PLAYER_HEX[pi], 2.6, 4.5, 1.7);
        bl.position.set(0, 0.7, 0);
        rb.add(bl);
        var sh = new T.Mesh(M.geo('blob', function () { return new T.CircleGeometry(0.26, 18); }),
          track(new T.MeshBasicMaterial({ color: 0x1a1030, transparent: true, opacity: 0.3, depthWrite: false })));
        sh.rotation.x = -Math.PI / 2;
        var tag = M.playerTag(pi + 1, PLAYER_HEX[pi]);
        track(tag.material.map); track(tag.material);
        rb.add(tag);
        tag.position.set(0, 1.15, 0);
        pl.robot = rb; pl.shadow = sh; pl.tag = tag;
        pl.cell = S.pos; pl.face = LV.faceOf(L, S.pos);
        players.push(pl);
        attachRobot(pl, pl.face);
        baseLocal(pl.cell, scratchA);
        rb.position.set(scratchA.x, 0.16, scratchA.z);
        sh.position.set(scratchA.x, 0.015, scratchA.z);
        pl.facing = 0;
      }

      hoverMesh = new T.Mesh(M.geo('hoverRing', function () { return M.slabGeo(0.98, 0.06, 0.98, 0.14, 2); }),
        track(new T.MeshBasicMaterial({ color: P.cyan, transparent: true, opacity: 0.45, depthWrite: false })));
      hoverMesh.rotation.x = -Math.PI / 2;
      hoverMesh.visible = false;
      hoverMesh.renderOrder = 2;
      root.add(hoverMesh);

      var dotGeo = M.geo('pathDot', function () { return new T.CircleGeometry(0.17, 12); });
      var dotMat = track(new T.MeshBasicMaterial({ color: 0xff7a1a, transparent: true, opacity: 0.92, depthWrite: false }));
      var guideMat = track(new T.MeshBasicMaterial({ color: 0x2fae2f, transparent: true, opacity: 0.9, depthWrite: false }));
      pathInst = new T.InstancedMesh(dotGeo, dotMat, 64);
      guideInst = new T.InstancedMesh(dotGeo, guideMat, 64);
      [pathInst, guideInst].forEach(function (im) {
        im.count = 0; im.frustumCulled = false; im.renderOrder = 2;
        im.instanceMatrix.setUsage(T.DynamicDrawUsage);
        root.add(im);
      });
      for (var d2 = 0; d2 < 64; d2++) {
        pathDots.push({ pos: new T.Vector3(), quat: new T.Quaternion(), s: 1 });
        guideDots.push({ pos: new T.Vector3(), quat: new T.Quaternion(), s: 1 });
      }

      hintMesh = new T.Group();
      var ha = new T.Mesh(M.geo('hintArrow', function () { return new T.ConeGeometry(0.19, 0.36, 4); }), M.MAT.glow(P.amber, 2.0));
      ha.rotation.x = Math.PI;
      hintMesh.add(ha);
      hintMesh.visible = false;
      root.add(hintMesh);

      burst = M.burstSystem(burstMax);
      track(burst.geometry); track(burst.material);
      root.add(burst);

      rv.frameCube(N);
      root.updateMatrixWorld(true);
      syncState(state, true);
      rv.renderer.shadowMap.needsUpdate = true;
    }

    function attachRobot(pl, f) {
      faces[f].spin.add(pl.robot);
      faces[f].spin.add(pl.shadow);
      pl.face = f;
    }

    /* ---------- 粒子 ---------- */
    function emit(pos, hex, count, power) {
      var c = new T.Color(hex);
      for (var i = 0; i < count; i++) {
        if (burstData.length >= burstMax) break;
        var a = Math.random() * TAU, el = Math.random() * Math.PI * 0.6;
        var sp = (0.5 + Math.random() * 1.3) * (power || 1);
        burstData.push({
          x: pos.x, y: pos.y, z: pos.z,
          vx: Math.cos(a) * Math.cos(el) * sp, vy: Math.sin(el) * sp * 1.3 + 0.6, vz: Math.sin(a) * Math.cos(el) * sp,
          life: 0, max: 0.5 + Math.random() * 0.6, r: c.r, g: c.g, b: c.b, size: 0.03 + Math.random() * 0.045
        });
      }
    }
    function updateBurst(dt) {
      if (!burst) return;
      var pa = burst.geometry.attributes.position.array;
      var ca = burst.geometry.attributes.aColor.array;
      var sa = burst.geometry.attributes.aSize.array;
      for (var i = burstData.length - 1; i >= 0; i--) {
        var p = burstData[i];
        p.life += dt;
        if (p.life >= p.max) { burstData.splice(i, 1); continue; }
        p.vy -= 2.6 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
        p.vx *= 0.985; p.vz *= 0.985;
      }
      var n = 0;
      for (var j = 0; j < burstData.length && n < burstMax; j++, n++) {
        var q = burstData[j], fr = 1 - q.life / q.max;
        pa[n * 3] = q.x; pa[n * 3 + 1] = q.y; pa[n * 3 + 2] = q.z;
        ca[n * 3] = q.r; ca[n * 3 + 1] = q.g; ca[n * 3 + 2] = q.b;
        sa[n] = q.size * fr;
      }
      burst.geometry.setDrawRange(0, n);
      burst.geometry.attributes.position.needsUpdate = true;
      burst.geometry.attributes.aColor.needsUpdate = true;
      burst.geometry.attributes.aSize.needsUpdate = true;
    }

    /* ---------- 状态同步 ---------- */
    function syncState(state, instant) {
      S = state;
      dev.gears.forEach(function (d) {
        d.target = -S.gear[d.gear.id] * TAU / d.gear.steps;
        while (d.target - d.visual > Math.PI) d.target -= TAU;
        while (d.visual - d.target > Math.PI) d.visual += TAU;
        if (instant) d.visual = d.target;
        var ok = S.gear[d.gear.id] === 0, lm = d.group.userData.lamp.material;
        lm.color.set(ok ? P.lime : P.ruby); lm.emissive.set(ok ? P.lime : P.ruby);
        lm.emissiveIntensity = ok ? 2.2 : 1.0;
      });
      dev.levers.forEach(function (d) {
        var on = !!S.lev[d.lever.id];
        d.group.userData.pivot.userData.target = on ? 0.62 : -0.62;
        d.group.userData.knob.material = M.MAT.glow(on ? P.lime : P.ruby, 0.9);
        if (instant) d.group.userData.pivot.rotation.x = on ? 0.62 : -0.62;
      });
      dev.doors.forEach(function (d) {
        var open = LV.gateOpen(L, S, d.gate);
        if (open === d.open) return;
        d.open = open;
        var from = d.group.position.y, to = open ? -1.05 : 0;
        if (instant) d.group.position.y = to;
        else {
          anims.push({ t: 0, dur: 0.55, fn: function (p) { d.group.position.y = from + (to - from) * easeInOut(p); }, end: function () { rv.renderer.shadowMap.needsUpdate = true; } });
          if (open) emit(cellWorld(d.base, 0.5, new T.Vector3()), d.hex, 20, 1.0);
        }
        rv.renderer.shadowMap.needsUpdate = true;
      });
      dev.bridges.forEach(function (d) {
        var open = LV.gateOpen(L, S, d.gate);
        if (open === d.open) return;
        d.open = open;
        var from = d.group.position.y, to = open ? 0 : -0.8;
        if (instant) d.group.position.y = to;
        else anims.push({ t: 0, dur: 0.6, fn: function (p) { d.group.position.y = from + (to - from) * easeBack(Math.min(1, p)); }, end: function () { rv.renderer.shadowMap.needsUpdate = true; } });
        rv.renderer.shadowMap.needsUpdate = true;
      });
      dev.keys.forEach(function (d) {
        if (!(S.keys & (1 << d.key.id)) || d.taken) return;
        d.taken = true;
        if (instant) { d.group.visible = false; return; }
        emit(d.group.getWorldPosition(new T.Vector3()), GX.KEY_COLORS[d.key.color].hex, 26, 1.3);
        var y0 = d.group.position.y;
        anims.push({
          t: 0, dur: 0.42,
          fn: function (p) { d.group.position.y = y0 + p * 1.0; d.group.scale.setScalar(1.15 * (1 + p * 0.7)); d.group.rotation.y += 0.3; },
          end: function () { d.group.visible = false; }
        });
      });
      dev.stars.forEach(function (d) {
        if (!(S.stars & (1 << d.star.id)) || d.taken) return;
        d.taken = true;
        if (instant) { d.group.visible = false; return; }
        emit(d.group.getWorldPosition(new T.Vector3()), P.amber, 24, 1.4);
        var y0 = d.group.position.y;
        anims.push({
          t: 0, dur: 0.46,
          fn: function (p) { d.group.position.y = y0 + p * 1.3; d.group.scale.setScalar(1.15 * (1 + p)); d.group.rotation.y += 0.4; },
          end: function () { d.group.visible = false; }
        });
      });
      if (portal) portal.userData.open = L.gates.every(function (g, i) { return LV.gateOpen(L, S, i); });
      updateAlignGlow();
    }

    function updateAlignGlow() {
      var mode = GX.DIFFICULTIES[L.difficulty].alignGlow;
      var allOk = S.ang.every(function (a) { return a === 0; });
      faces.forEach(function (fc, i) {
        var lit = mode === 'each' ? S.ang[i] === 0 : mode === 'all' ? allOk : false;
        var mk = fc.rim.userData.mark;
        mk.material = M.MAT.glow(lit ? P.lime : GX.FACE_TINTS[i].cap, lit ? 2.4 : 1.2);
        fc.hub.userData.knob.material = M.MAT.glow(lit ? P.lime : P.cyan, lit ? 2.0 : 1.2);
      });
    }

    /* ---------- 面旋转 ---------- */
    function twistFace(f, done) {
      var fc = faces[f];
      var from = fc.visual, to = from - Math.PI / 2;
      fc.angle = S.ang[f];
      fc.visual = to;
      rv.renderer.shadowMap.needsUpdate = true;
      anims.push({
        t: 0, dur: 0.5,
        fn: function (p) { fc.spin.rotation.y = from + (to - from) * easeInOut(p); },
        end: function () {
          fc.spin.rotation.y = -S.ang[f] * Math.PI / 2;
          fc.visual = fc.spin.rotation.y;
          rv.renderer.shadowMap.needsUpdate = true;
          if (done) done();
        }
      });
    }

    /* ---------- 角色移动（每个玩家独立） ---------- */
    function walkPath(idx, cells, speed, onArrive, onStep) {
      var pl = players[idx];
      if (!pl) return;
      if (!cells.length) { if (onArrive) onArrive(); return; }
      pl.path = cells.slice(); pl.segT = 0; pl.moving = true; pl.speed = speed;
      pl.onArrive = onArrive; pl.onStep = onStep;
      beginSegment(pl);
    }
    function stopWalk(idx) {
      var list = idx == null ? players : [players[idx]];
      list.forEach(function (pl) {
        if (!pl) return;
        pl.path = []; pl.moving = false; pl.crossing = false; pl.cross = null;
        pl.onArrive = null; pl.onStep = null;
      });
    }
    function teleport(idx, cell) {
      var pl = players[idx];
      if (!pl) return;
      pl.cell = cell;
      var f = LV.faceOf(L, cell);
      if (f !== pl.face) attachRobot(pl, f);
      baseLocal(cell, scratchA);
      pl.robot.position.set(scratchA.x, 0.16, scratchA.z);
      pl.shadow.position.set(scratchA.x, 0.015, scratchA.z);
      pl.robot.quaternion.identity();
      pl.shadow.quaternion.setFromEuler(new T.Euler(-Math.PI / 2, 0, 0));
      pl.shadow.visible = true;
      pl.crossing = false; pl.cross = null;
    }
    function beginSegment(pl) {
      var next = pl.path[0];
      var nf = LV.faceOf(L, next);
      var dstep = dirBetween(pl.cell, next);
      if (dstep < 0) {
        // 这一步不是相邻格 —— 是踩传送门被送过去的
        var ent = -1, hue = 0x31e1f7;
        for (var k = 0; k < 4; k++) {
          var nb = L.topo.nbr[pl.cell * 4 + k];
          if (nb < 0) continue;
          if (LV.portalDest(L, S, nb) === next) {
            ent = nb;
            var pp = LV.portalAt(L, S, nb);
            if (pp) hue = GX.PORTAL_HUES[L.portals[pp.id].hue].hex;
            break;
          }
        }
        var A0 = cellWorld(pl.cell, 0.16, new T.Vector3());
        var E0 = ent >= 0 ? cellWorld(ent, 0.16, new T.Vector3()) : A0.clone();
        var B0 = cellWorld(next, 0.16, new T.Vector3());
        pl.robot.getWorldQuaternion(scratchQ);
        var qq0 = scratchQ.clone();
        faces[nf].spin.getWorldQuaternion(scratchQ2);
        var qq1 = scratchQ2.clone();
        root.attach(pl.robot); root.attach(pl.shadow);
        pl.crossing = true;
        pl.cross = { teleport: true, A: A0, E: E0, B: B0, q0: qq0, q1: qq1, target: next, face: nf, yaw: 0, hue: hue, fired: false };
        return;
      }
      if (nf === pl.face) { pl.crossing = false; pl.cross = null; return; }
      var A = cellWorld(pl.cell, 0.16, new T.Vector3());
      var B = cellWorld(next, 0.16, new T.Vector3());
      pl.robot.getWorldQuaternion(scratchQ);
      var q0 = scratchQ.clone();
      var d = L.topo.nbrDir[pl.cell * 4 + dstep];
      var yaw = Math.atan2(C.DIRS[d][0], C.DIRS[d][1]);
      faces[nf].spin.getWorldQuaternion(scratchQ2);
      var q1 = scratchQ2.clone().multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), yaw));
      root.attach(pl.robot);
      root.attach(pl.shadow);
      pl.crossing = true;
      pl.cross = { A: A, B: B, q0: q0, q1: q1, target: next, face: nf, yaw: yaw };
    }
    function dirBetween(a, b) {
      for (var d = 0; d < 4; d++) if (L.topo.nbr[a * 4 + d] === b) return d;
      return -1;
    }
    function shellProject(v, rad) {
      var m = Math.max(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));
      if (m > 0.0001) v.multiplyScalar(rad / m);
      return v;
    }
    function finishSegment(pl) {
      var next = pl.path.shift();
      pl.lastTeleport = !!(pl.cross && pl.cross.teleport);
      pl.cell = next;
      if (pl.crossing) {
        var cr = pl.cross;
        attachRobot(pl, cr.face);
        baseLocal(next, scratchA);
        pl.robot.position.set(scratchA.x, 0.16, scratchA.z);
        pl.robot.quaternion.identity();
        pl.facing = cr.yaw;
        pl.shadow.position.set(scratchA.x, 0.015, scratchA.z);
        pl.shadow.quaternion.setFromEuler(new T.Euler(-Math.PI / 2, 0, 0));
        pl.shadow.visible = true;
        pl.robot.scale.setScalar(pl.scale);
        pl.crossing = false; pl.cross = null;
      }
      if (pl.onStep) pl.onStep(next, pl.index);
      if (!pl.path.length) {
        pl.moving = false;
        var cb = pl.onArrive; pl.onArrive = null; pl.onStep = null;
        if (cb) cb();
        return;
      }
      beginSegment(pl);
    }
    function updateRobot(pl, dt) {
      var robot = pl.robot, robotShadow = pl.shadow;
      if (!robot) return;
      if (pl.moving && pl.path.length) {
        pl.segT += dt * pl.speed;
        var guard = 0;
        while (pl.segT >= 1 && pl.path.length && guard++ < 8) { pl.segT -= 1; finishSegment(pl); }
        if (pl.moving && pl.path.length) {
          var e = easeInOut(Math.min(1, pl.segT));
          if (pl.crossing && pl.cross.teleport) {
            var ct = pl.cross;
            if (e < 0.5) {
              var t1 = easeOut(e / 0.5);
              scratchA.copy(ct.A).lerp(ct.E, t1);
              shellProject(scratchA, L.N / 2 + 0.16);
              robot.position.copy(scratchA);
              robot.quaternion.copy(ct.q0).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), t1 * 7));
              robot.scale.setScalar(pl.scale * Math.max(0.06, 1 - t1 * 0.94));
            } else {
              if (!ct.fired) {
                ct.fired = true;
                emit(ct.E, ct.hue, 22, 1.5);
                emit(ct.B, ct.hue, 26, 1.7);
              }
              var t2 = easeBack(Math.min(1, (e - 0.5) / 0.5));
              robot.position.copy(ct.B);
              robot.quaternion.copy(ct.q1);
              robot.scale.setScalar(pl.scale * Math.max(0.06, t2));
            }
            robotShadow.visible = false;
          } else if (pl.crossing) {
            var cr = pl.cross;
            scratchA.copy(cr.A).lerp(cr.B, e);
            shellProject(scratchA, L.N / 2 + 0.16 + Math.sin(e * Math.PI) * 0.16);
            robot.position.copy(scratchA);
            robot.quaternion.copy(cr.q0).slerp(cr.q1, e);
            robotShadow.visible = false;
          } else {
            var next = pl.path[0];
            baseLocal(pl.cell, scratchA);
            baseLocal(next, scratchB);
            robot.position.x = scratchA.x + (scratchB.x - scratchA.x) * e + pl.offX;
            robot.position.z = scratchA.z + (scratchB.z - scratchA.z) * e;
            var want2 = Math.atan2(scratchB.x - scratchA.x, scratchB.z - scratchA.z);
            var diff = ((want2 - pl.facing + Math.PI * 3) % TAU) - Math.PI;
            pl.facing += diff * Math.min(1, dt * 14);
            robot.rotation.set(0, pl.facing, -diff * 0.16);
            robotShadow.visible = true;
            robotShadow.position.set(robot.position.x, 0.015, robot.position.z);
          }
        }
      } else if (!pl.crossing) {
        robot.rotation.z *= Math.pow(0.02, dt);
        robot.rotation.x *= Math.pow(0.02, dt);
      }
      if (!pl.crossing) {
        // 两人站在同一格时左右让开一点，避免重叠
        var share = players.length > 1 && players[0].cell === players[1].cell && !players[0].crossing && !players[1].crossing;
        var wantOff = share ? (pl.index === 0 ? -0.19 : 0.19) : 0;
        pl.offX += (wantOff - pl.offX) * Math.min(1, dt * 9);
        var bob = Math.sin(time * 3.4 + pl.index) * 0.032 + (pl.moving ? Math.abs(Math.sin(time * 11)) * 0.04 : 0);
        // 偏移量每帧从当前格基准重算再加，绝不能逐帧累加（否则角色会一直漂走）
        if (!pl.moving) {
          baseLocal(pl.cell, scratchA);
          robot.position.x = scratchA.x + pl.offX;
          robot.position.z = scratchA.z;
        }
        robot.position.y = 0.16 + bob;
        robot.rotation.y = pl.facing;
        robotShadow.position.set(robot.position.x, 0.015, robot.position.z);
        robotShadow.scale.setScalar(1 - bob * 0.8);
        robotShadow.material.opacity = 0.3 - bob * 0.5;
      }
      var ud = robot.userData;
      ud.hover.rotation.z = time * 1.6;
      ud.jet.scale.set(1, 0.8 + Math.sin(time * 18) * 0.16 + (pl.moving ? 0.35 : 0), 1);
      ud.jet.material.opacity = 0.2 + (pl.moving ? 0.16 : 0) + Math.sin(time * 15) * 0.04;
      ud.antBall.material.emissiveIntensity = 1.6 + Math.sin(time * 4 + pl.index) * 0.5;
      ud.arms[0].rotation.x = pl.moving ? Math.sin(time * 12) * 0.45 : Math.sin(time * 2) * 0.1;
      ud.arms[1].rotation.x = pl.moving ? -Math.sin(time * 12) * 0.45 : -Math.sin(time * 2) * 0.1;
      ud.head.rotation.z = Math.sin(time * 1.7 + pl.index) * 0.045;
      pl.blink -= dt;
      if (pl.blink < 0) pl.blink = 2.4 + Math.random() * 3;
      var bl = pl.blink < 0.12 ? 0.12 : 1;
      ud.eyes[0].scale.y = bl; ud.eyes[1].scale.y = bl;
      if (pl.tag) pl.tag.material.opacity = 0.75 + Math.sin(time * 2.2 + pl.index) * 0.2;
    }

    /* ---------- 视觉辅助（世界空间，贴合各面） ---------- */
    function orientOnFace(mesh, cell, y) {
      var f = LV.faceOf(L, cell);
      cellWorld(cell, y, scratchA);
      mesh.position.copy(scratchA);
      faces[f].spin.getWorldQuaternion(scratchQ);
      mesh.quaternion.copy(scratchQ).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), -Math.PI / 2));
    }
    function setHover(cell, ok) {
      if (!hoverMesh) return;
      if (cell == null || cell < 0) { hoverMesh.visible = false; return; }
      hoverMesh.visible = true;
      orientOnFace(hoverMesh, cell, 0.04);
      hoverMesh.material.color.set(ok ? P.cyan : P.ruby);
      hoverMesh.material.opacity = ok ? 0.45 : 0.25;
    }
    function showDots(pool, inst, cells, y) {
      var n = Math.min(cells.length, pool.length);
      for (var i = 0; i < n; i++) {
        var f = LV.faceOf(L, cells[i]);
        cellWorld(cells[i], y, pool[i].pos);
        faces[f].spin.getWorldQuaternion(pool[i].quat);
        pool[i].quat.multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), -Math.PI / 2));
      }
      inst.count = n;
      writeDots(pool, inst, n);
    }
    function writeDots(pool, inst, n) {
      for (var i = 0; i < n; i++) {
        dotScale.setScalar(pool[i].s);
        dotMtx.compose(pool[i].pos, pool[i].quat, dotScale);
        inst.setMatrixAt(i, dotMtx);
      }
      inst.instanceMatrix.needsUpdate = true;
    }
    function showPath(cells) { showDots(pathDots, pathInst, cells, 0.05); }
    function showGuide(cells) { showDots(guideDots, guideInst, cells, 0.042); }
    function setHint(cell) {
      if (!hintMesh) return;
      if (cell == null || cell < 0) { hintMesh.visible = false; return; }
      hintMesh.visible = true;
      hintMesh.userData.cell = cell;
      var f = LV.faceOf(L, cell);
      cellWorld(cell, 0, scratchA);
      hintMesh.userData.base = scratchA.clone();
      hintMesh.userData.normal = faces[f].normal.clone();
      faces[f].spin.getWorldQuaternion(scratchQ);
      hintMesh.quaternion.copy(scratchQ);
      hintMesh.position.copy(scratchA).addScaledVector(faces[f].normal, 1.7);
    }
    function pulseLamp(seqId, li, strength) {
      dev.lamps.forEach(function (d) {
        if (d.seq.id === seqId && d.index === li) {
          d.lit = strength == null ? 1 : strength;
          emit(d.group.getWorldPosition(new T.Vector3()), d.hex, 6, 0.5);
        }
      });
    }
    function clearLamps(seqId) { dev.lamps.forEach(function (d) { if (d.seq.id === seqId) d.lit = 0; }); }
    function deviceWorldPos(kind, id, li) {
      var arr = kind === 'gear' ? dev.gears : kind === 'lever' ? dev.levers : dev.lamps;
      for (var i = 0; i < arr.length; i++) {
        var d = arr[i];
        var hit = kind === 'lamp' ? (d.seq.id === id && d.index === li)
          : kind === 'gear' ? d.gear.id === id : d.lever.id === id;
        if (hit) return d.group.getWorldPosition(new T.Vector3());
      }
      return new T.Vector3();
    }
    function celebrate() {
      if (!portal) return;
      var pos = portal.getWorldPosition(new T.Vector3());
      var hues = [P.magenta, P.amber, P.cyan, P.lime, P.ruby];
      for (var i = 0; i < 5; i++) {
        (function (k) {
          anims.push({ t: -k * 0.13, dur: 0.08, fn: function () {}, end: function () { emit(pos, hues[k], 34, 1.9); } });
        })(i);
      }
    }

    /* ---------- 每帧 ---------- */
    function update(dt) {
      if (!L || !faces.length) return;
      time += dt;
      for (var i = anims.length - 1; i >= 0; i--) {
        var a = anims[i];
        a.t += dt;
        if (a.t < 0) continue;
        var p = Math.min(1, a.t / a.dur);
        a.fn(p);
        if (p >= 1) { if (a.end) a.end(); anims.splice(i, 1); }
      }
      // 背面剔除：核心不透明，背面完全被遮挡，直接隐藏省一半绘制
      camDir.copy(rv.camera.position).normalize();
      var camB = rv.cameraB, camDirB = null;
      if (camB && rv.splitOn) { camDirB = camB.position.clone().normalize(); }
      activePlanes.length = 0;
      for (var f = 0; f < 6; f++) {
        var fc = faces[f];
        var d = fc.normal.dot(camDir);
        if (camDirB) d = Math.max(d, fc.normal.dot(camDirB));
        fc.front = d > -0.06;
        var show = fc.front || players.some(function (pl) { return pl.face === f; });
        fc.group.visible = show;
        if (fc.front) activePlanes.push(fc.plane);
      }
      dev.gears.forEach(function (d) {
        d.visual += (d.target - d.visual) * Math.min(1, dt * 11);
        d.group.userData.spinner.rotation.y = d.visual;
      });
      dev.levers.forEach(function (d) {
        var pv = d.group.userData.pivot, tg = pv.userData.target == null ? -0.62 : pv.userData.target;
        pv.rotation.x += (tg - pv.rotation.x) * Math.min(1, dt * 12);
      });
      dev.lamps.forEach(function (d) {
        d.lit = Math.max(0, d.lit - dt * 1.9);
        d.group.userData.crystal.material.emissiveIntensity = 0.45 + d.lit * 3.2;
        d.group.userData.halo.material.emissiveIntensity = 0.8 + d.lit * 3;
        d.group.userData.crystal.scale.setScalar(1 + d.lit * 0.32);
        d.group.userData.crystal.rotation.y = time * 0.8 + d.index;
        d.group.userData.halo.rotation.z = time * 1.2;
      });
      dev.portals.forEach(function (d, i5) {
        d.group.userData.swirl.uniforms.uTime.value = time * (d.canEnter ? 1 : 0.4);
        d.group.userData.glow.rotation.z = time * (d.canEnter ? 1.1 : 0.35);
        var ar = d.group.userData.arrow;
        ar.position.y = (d.canEnter ? 0.42 : 0.34) + Math.sin(time * 2.6 + i5) * 0.06;
        ar.rotation.y = time * 1.3;
        if (d.group.userData.arrow2) {
          d.group.userData.arrow2.position.y = 0.16 - Math.sin(time * 2.6 + i5) * 0.05;
          d.group.userData.arrow2.rotation.y = -time * 1.1;
        }
        d.group.userData.beamMat.uniforms.uTime.value = time;
        d.group.userData.beamMat.uniforms.uOn.value = (d.canEnter ? 0.5 : 0.18) * (0.85 + Math.sin(time * 1.9 + i5) * 0.15);
      });
      dev.keys.forEach(function (d) {
        if (d.taken) return;
        d.group.rotation.y = time * 1.3;
        d.group.position.y = d.base + Math.sin(time * 2.1 + d.key.id) * 0.08;
        d.group.userData.halo.rotation.z = time * 1.8;
      });
      dev.stars.forEach(function (d) {
        if (d.taken) return;
        d.group.rotation.y = time * 1.9;
        d.group.rotation.z = Math.sin(time * 1.4 + d.star.id) * 0.22;
        d.group.position.y = d.base + Math.sin(time * 2.6 + d.star.id * 2) * 0.09;
      });
      dev.doors.forEach(function (d) {
        d.group.userData.lock.rotation.y = time * 1.1;
        d.group.userData.ring.rotation.z = time * 0.9;
      });
      if (portal) {
        portal.userData.swirlMat.uniforms.uTime.value = time;
        portal.userData.swirlMat.uniforms.uOpen.value = portal.userData.open ? 1 : 0.32;
        portal.userData.ring2.rotation.z = time * 0.6;
        portal.userData.disc.scale.setScalar(portal.userData.open ? 1 + Math.sin(time * 2) * 0.04 : 0.7);
      }
      faces.forEach(function (fc, i2) {
        fc.hub.userData.knob.scale.setScalar(1 + Math.sin(time * 2.4 + i2) * 0.06);
      });
      if (pathInst && pathInst.count) {
        for (var i3 = 0; i3 < pathInst.count; i3++) pathDots[i3].s = 0.62 + (0.55 + 0.45 * Math.sin(time * 5 - i3 * 0.5)) * 0.55;
        writeDots(pathDots, pathInst, pathInst.count);
      }
      if (guideInst && guideInst.count) {
        for (var i4 = 0; i4 < guideInst.count; i4++) guideDots[i4].s = 0.72 + (0.55 + 0.45 * Math.sin(time * 3.2 - i4 * 0.42)) * 0.42;
        writeDots(guideDots, guideInst, guideInst.count);
      }
      if (hintMesh && hintMesh.visible) {
        hintMesh.position.copy(hintMesh.userData.base).addScaledVector(hintMesh.userData.normal, 1.65 + Math.sin(time * 3.4) * 0.15);
        hintMesh.rotation.y = time * 1.4;
      }
      for (var up = 0; up < players.length; up++) updateRobot(players[up], dt);
      updateBurst(dt);
    }

    return {
      root: root, load: load, update: update, syncState: syncState,
      cellWorld: function (c, y) { return cellWorld(c, y, new T.Vector3()); },
      faces: function () { return faces; },
      faceNormal: function (f) { return faces[f].normal; },
      get pickables() { return pickables; },
      get planes() { return activePlanes; },
      playerCount: function () { return players.length; },
      playerCell: function (i) { return players[i] ? players[i].cell : 0; },
      playerFace: function (i) { return players[i] ? players[i].face : 0; },
      playerObj: function (i) { return players[i] ? players[i].robot : null; },
      playerMoving: function (i) { return players[i] ? players[i].moving : false; },
      anyMoving: function () { return players.some(function (p) { return p.moving; }); },
      playerWorld: function (i) { return players[i] ? players[i].robot.getWorldPosition(new T.Vector3()) : new T.Vector3(); },
      lastStepTeleport: function (i) { return players[i] ? players[i].lastTeleport : false; },
      portalEnds: function () { return dev.portals; },
      get robotCell() { return players[0] ? players[0].cell : 0; },
      get robotFace() { return players[0] ? players[0].face : 0; },
      get robot() { return players[0] ? players[0].robot : null; },
      get isMoving() { return players[0] ? players[0].moving : false; },
      isBusy: function () { return this.anyMoving() || anims.some(function (a) { return a.dur >= 0.4; }); },
      walkPath: walkPath, stopWalk: stopWalk, teleport: teleport, twistFace: twistFace,
      setHover: setHover, showPath: showPath, showGuide: showGuide, setHint: setHint,
      pulseLamp: pulseLamp, clearLamps: clearLamps, emit: emit, celebrate: celebrate,
      deviceWorldPos: deviceWorldPos, updateAlignGlow: updateAlignGlow,
      dispose: function () { clear(); rv.scene.remove(root); }
    };
  }

  GX.world = { create: create };
})(window.GX = window.GX || {});