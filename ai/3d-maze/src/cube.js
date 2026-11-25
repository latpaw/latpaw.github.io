/* 魔方拓扑：六个面的局部坐标、跨棱相邻关系、面旋转数学
   面局部坐标系与世界一致：localX = u 轴, localY = 面法线, localZ = v 轴
   因此面上的网格计算与平面迷宫完全同构，跨棱时只需换父节点。 */
(function (GX) {
  'use strict';

  // n = 外法线, u = 列增方向, v = 行增方向；满足 v = u × n（右手系，det = +1）
  var FACES = [
    { id: 0, name: '前面', short: '前', n: [0, 0, 1], u: [1, 0, 0], v: [0, -1, 0], net: [1, 1] },
    { id: 1, name: '右面', short: '右', n: [1, 0, 0], u: [0, 0, -1], v: [0, -1, 0], net: [2, 1] },
    { id: 2, name: '后面', short: '后', n: [0, 0, -1], u: [-1, 0, 0], v: [0, -1, 0], net: [3, 1] },
    { id: 3, name: '左面', short: '左', n: [-1, 0, 0], u: [0, 0, 1], v: [0, -1, 0], net: [0, 1] },
    { id: 4, name: '顶面', short: '上', n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1], net: [1, 0] },
    { id: 5, name: '底面', short: '下', n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, -1], net: [1, 2] }
  ];

  var DIRS = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // 上 右 下 左（局部 du,dv）

  function key(x, y, z) { return x + ',' + y + ',' + z; }
  var BY_NORMAL = {};
  FACES.forEach(function (f) { BY_NORMAL[key(f.n[0], f.n[1], f.n[2])] = f.id; });

  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

  // tile = 1，立方体半边长 = N/2，格心局部坐标为整数或半整数，取整无误差
  function worldPos(N, f, u, v) {
    var F = FACES[f], h = (N - 1) / 2, s = N / 2;
    var a = u - h, b = v - h;
    return [
      F.n[0] * s + F.u[0] * a + F.v[0] * b,
      F.n[1] * s + F.u[1] * a + F.v[1] * b,
      F.n[2] * s + F.u[2] * a + F.v[2] * b
    ];
  }

  function buildTopology(N) {
    var per = N * N, total = per * 6;
    var nbr = new Int32Array(total * 4);
    var nbrDir = new Int8Array(total * 4);
    for (var f = 0; f < 6; f++) {
      var F = FACES[f];
      for (var v = 0; v < N; v++) for (var u = 0; u < N; u++) {
        var id = f * per + v * N + u;
        for (var d = 0; d < 4; d++) {
          var du = DIRS[d][0], dv = DIRS[d][1];
          var nu = u + du, nv = v + dv;
          if (nu >= 0 && nu < N && nv >= 0 && nv < N) {
            nbr[id * 4 + d] = f * per + nv * N + nu;
            nbrDir[id * 4 + d] = d;
            continue;
          }
          // 越过棱：世界方向即目标面法线，绕过棱后行进方向转为 -原法线
          var dir = [F.u[0] * du + F.v[0] * dv, F.u[1] * du + F.v[1] * dv, F.u[2] * du + F.v[2] * dv];
          var g = BY_NORMAL[key(dir[0], dir[1], dir[2])];
          var G = FACES[g];
          var P = worldPos(N, f, u, v);
          var Q = [
            P[0] + dir[0] * 0.5 - F.n[0] * 0.5,
            P[1] + dir[1] * 0.5 - F.n[1] * 0.5,
            P[2] + dir[2] * 0.5 - F.n[2] * 0.5
          ];
          var s = N / 2;
          var rel = [Q[0] - G.n[0] * s, Q[1] - G.n[1] * s, Q[2] - G.n[2] * s];
          var h = (N - 1) / 2;
          var gu = Math.round(dot(rel, G.u) + h);
          var gv = Math.round(dot(rel, G.v) + h);
          nbr[id * 4 + d] = (gu >= 0 && gu < N && gv >= 0 && gv < N) ? g * per + gv * N + gu : -1;
          // 直行方向在新面局部系中的编号
          var back = [-F.n[0], -F.n[1], -F.n[2]];
          var nd = d;
          for (var e = 0; e < 4; e++) {
            var w = [G.u[0] * DIRS[e][0] + G.v[0] * DIRS[e][1],
                     G.u[1] * DIRS[e][0] + G.v[1] * DIRS[e][1],
                     G.u[2] * DIRS[e][0] + G.v[2] * DIRS[e][1]];
            if (w[0] === back[0] && w[1] === back[1] && w[2] === back[2]) { nd = e; break; }
          }
          nbrDir[id * 4 + d] = nd;
        }
      }
    }
    return { N: N, per: per, total: total, nbr: nbr, nbrDir: nbrDir };
  }

  function faceOf(id, per) { return (id / per) | 0; }
  function uvOf(id, per, N) { var r = id % per; return [r % N, (r / N) | 0]; }
  function cellId(f, u, v, N) { return f * N * N + v * N + u; }

  // 顺时针（从面外看）旋转 angle 次后，(u,v) 处显示的是基准网格的哪一格
  function baseCoord(N, angle, u, v) {
    for (var k = 0; k < angle; k++) { var nu = v, nv = N - 1 - u; u = nu; v = nv; }
    return [u, v];
  }
  // 面上一点顺时针旋转 angle 次后落到哪里
  function rotPoint(N, angle, u, v) {
    for (var k = 0; k < angle; k++) { var nu = N - 1 - v, nv = u; u = nu; v = nv; }
    return [u, v];
  }
  function patternAt(grid, N, angle, u, v) {
    var b = baseCoord(N, angle, u, v);
    return grid[b[1] * N + b[0]];
  }

  GX.cube = {
    FACES: FACES, DIRS: DIRS, buildTopology: buildTopology,
    worldPos: worldPos, faceOf: faceOf, uvOf: uvOf, cellId: cellId,
    baseCoord: baseCoord, rotPoint: rotPoint, patternAt: patternAt, dot: dot
  };
})(window.GX = window.GX || {});