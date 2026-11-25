/* 发条魔方 — 调色板、难度、关卡与玩法图鉴数据 */
(function (GX) {
  'use strict';

  var PALETTE = {
    brass: 0xf2a93b, brassLight: 0xffd98a, brassDark: 0xb06d1c,
    cream: 0xffeacb, creamAlt: 0xffdcb0,
    mint: 0x4fd6b8, mintDark: 0x2a9d8f,
    ruby: 0xff4d5e, cyan: 0x31e1f7, lime: 0x9be832,
    magenta: 0xff53c8, amber: 0xffc53d, grape: 0x6c4bb6,
    night: 0x241a33, deep: 0x1a1230, rock: 0x4a3a6b, rockDark: 0x32254c
  };

  var FACE_TINTS = [
    { wall: 0x2a9d8f, cap: 0x4fd6b8, css: '#4fd6b8' }, // 前 薄荷
    { wall: 0xc2453f, cap: 0xff6b62, css: '#ff6b62' }, // 右 珊瑚红
    { wall: 0x2f7fc4, cap: 0x5ac8ff, css: '#5ac8ff' }, // 后 电蓝
    { wall: 0xb07d1c, cap: 0xffc53d, css: '#ffc53d' }, // 左 琥珀
    { wall: 0x6c4bb6, cap: 0xa986f0, css: '#a986f0' }, // 上 葡萄紫
    { wall: 0xb03a86, cap: 0xff6fd0, css: '#ff6fd0' }  // 下 洋红
  ];

  // 传送门配色：同一对门共用一色，单向门额外画箭头
  var PORTAL_HUES = [
    { hex: 0x31e1f7, css: '#31e1f7', name: '青蓝门' },
    { hex: 0xff53c8, css: '#ff53c8', name: '洋红门' },
    { hex: 0x9be832, css: '#9be832', name: '酸绿门' },
    { hex: 0xffc53d, css: '#ffc53d', name: '琥珀门' }
  ];

  var KEY_COLORS = {
    ruby: { hex: PALETTE.ruby, css: '#ff4d5e', name: '红宝石' },
    cyan: { hex: PALETTE.cyan, css: '#31e1f7', name: '蓝水晶' },
    lime: { hex: PALETTE.lime, css: '#9be832', name: '绿宝石' }
  };
  var KEY_ORDER = ['ruby', 'cyan', 'lime'];

  var DIFFICULTIES = {
    easy: {
      id: 'easy', label: '简单', age: '5 - 8 岁',
      blurb: '转对的面亮绿边，地面指路，提示无限。',
      color: '#9be832', hints: Infinity, guide: true, energy: false,
      alignGlow: 'each', moveSpeed: 5.5, icon: '🌱'
    },
    medium: {
      id: 'medium', label: '中等', age: '9 - 12 岁',
      blurb: '大立方跨棱走，联动齿轮与单向传送门，提示 5 次。',
      color: '#31e1f7', hints: 5, guide: false, energy: false,
      alignGlow: 'all', moveSpeed: 6.5, icon: '⚙️'
    },
    hard: {
      id: 'hard', label: '艰难', age: '13 岁以上',
      blurb: '六面全乱无对齐提示，发条会松，提示 3 次。',
      color: '#ff53c8', hints: 3, guide: false, energy: true,
      alignGlow: 'none', moveSpeed: 7.5, icon: '🔥'
    }
  };

  // size = 每面边长（格）; twist = 打乱几个面; opposite = 出口必须在别的面
  // portals = 传送门对数; portalReq = 必须走传送门才能到出口; oneWay = 其中几对是单向
  var LEVELS = {
    easy: [
      { name: '六面初启', tip: '点面心铜把手转动这一面，让通道接上', size: 7, gates: ['key'], gearLinks: 0, gearSteps: 4, seq: 0, twist: 2, opposite: false, portals: 0, oneWay: 0 },
      { name: '铜齿前庭', tip: '齿轮缺口对准指针，门就开了', size: 7, gates: ['key', 'gear'], gearLinks: 1, gearSteps: 4, seq: 0, twist: 2, opposite: true, portals: 0, oneWay: 0 },
      { name: '顶底穿梭', tip: '踩上发光圆环，直接传到对面去', size: 9, gates: ['key', 'key'], gearLinks: 0, gearSteps: 4, seq: 0, twist: 3, opposite: true, portals: 1, oneWay: 0, portalReq: true },
      { name: '星屑回廊', tip: '棱边和传送门都能换面，挑近的走', size: 9, gates: ['gear', 'key', 'key'], gearLinks: 1, gearSteps: 4, seq: 0, twist: 3, opposite: true, portals: 1, oneWay: 0 },
      { name: '转轴小院', tip: '扳下拉杆升木桥，再穿门去底面', size: 9, gates: ['key', 'lever', 'gear'], gearLinks: 1, gearSteps: 4, seq: 0, twist: 3, opposite: true, portals: 1, oneWay: 0, portalReq: true },
      { name: '立方出口', tip: '钥匙、齿轮、拉杆、传送门一起上', size: 11, gates: ['key', 'gear', 'lever'], gearLinks: 1, gearSteps: 4, seq: 0, twist: 4, opposite: true, portals: 2, oneWay: 0, portalReq: true }
    ],
    medium: [
      { name: '蒸汽立方', tip: '三道锁，跨面找钥匙', size: 9, gates: ['key', 'key', 'gear'], gearLinks: 1, gearSteps: 6, seq: 0, twist: 3, opposite: true, portals: 1, oneWay: 0 },
      { name: '双面跃迁', tip: '出口被封住了，只能靠传送门过去', size: 9, gates: ['key', 'gear', 'key'], gearLinks: 2, gearSteps: 4, seq: 0, twist: 4, opposite: true, portals: 2, oneWay: 1, portalReq: true },
      { name: '棱桥车间', tip: '木桥连棱边，圆环连对面', size: 11, gates: ['key', 'lever', 'key', 'gear'], gearLinks: 1, gearSteps: 6, seq: 0, twist: 4, opposite: true, portals: 2, oneWay: 1 },
      { name: '水晶密语', tip: '记住水晶闪烁的顺序', size: 11, gates: ['key', 'seq', 'gear', 'key'], gearLinks: 2, gearSteps: 4, seq: 3, twist: 5, opposite: true, portals: 2, oneWay: 1, portalReq: true },
      { name: '单向钟室', tip: '单向门只能去不能回，想好再踩', size: 11, gates: ['gear', 'key', 'lever', 'seq'], gearLinks: 2, gearSteps: 4, seq: 3, twist: 5, opposite: true, portals: 3, oneWay: 2 },
      { name: '六面核心', tip: '六面全乱，五道机关，三道传送门', size: 13, gates: ['key', 'gear', 'seq', 'lever', 'key'], gearLinks: 2, gearSteps: 4, seq: 3, twist: 6, opposite: true, portals: 3, oneWay: 2, portalReq: true }
    ],
    hard: [
      { name: '三重齿轮', tip: '三齿轮互相牵动，想清楚再点', size: 11, gates: ['key', 'gear', 'key', 'lever'], gearLinks: 3, gearSteps: 4, seq: 0, twist: 5, opposite: true, portals: 2, oneWay: 1, portalReq: true },
      { name: '全乱立方', tip: '六面全乱，没有任何对齐提示', size: 13, gates: ['key', 'lever', 'key', 'gear'], gearLinks: 2, gearSteps: 4, seq: 0, twist: 6, opposite: true, portals: 3, oneWay: 1 },
      { name: '幽蓝机芯', tip: '发条有限，别乱转面也别乱穿门', size: 13, gates: ['gear', 'key', 'lever', 'key', 'seq'], gearLinks: 3, gearSteps: 4, seq: 4, twist: 6, opposite: true, portals: 3, oneWay: 2, portalReq: true },
      { name: '记忆熔炉', tip: '四颗水晶的长顺序，单向门有去无回', size: 13, gates: ['key', 'seq', 'gear', 'lever'], gearLinks: 3, gearSteps: 4, seq: 4, twist: 6, opposite: true, portals: 3, oneWay: 2, portalReq: true, reqOneWay: true },
      { name: '发条深渊', tip: '五道锁、四道门，分布在六个面上', size: 15, gates: ['key', 'gear', 'lever', 'seq', 'key'], gearLinks: 3, gearSteps: 4, seq: 4, twist: 6, opposite: true, portals: 4, oneWay: 2, portalReq: true },
      { name: '时间之心', tip: '立方最后一道锁：六锁四门', size: 15, gates: ['key', 'gear', 'seq', 'lever', 'key', 'gear'], gearLinks: 3, gearSteps: 4, seq: 4, twist: 6, opposite: true, portals: 4, oneWay: 3, portalReq: true, reqOneWay: true }
    ]
  };

  /* ---------- 玩法图鉴：单一数据源，图鉴页与选关标签都读这里 ---------- */
  var MECHANICS = [
    {
      id: 'twist', icon: '🔄', name: '转面', color: '#a986f0', kind: 'core',
      tag: '核心', brief: '整面顺时针转 90°，棱边通道口要两侧对上',
      detail: '点面心铜把手、按 A 键或「转这一面」，整面 N×N 格一起转。站在这一面的小铜豆会被一起带着转。六个面都被转乱时，必须逐面转回正确朝向，棱边两侧的通道口才会连通。',
      tell: '面边框上的三角标记指出当前朝向；简单难度转对会亮绿边，中等要六面全对才亮，艰难完全不提示。',
      cost: '艰难难度每转一次扣 1 格发条能量',
      test: function (c) { return c.twist > 0; }
    },
    {
      id: 'edge', icon: '🧊', name: '跨棱行走', color: '#4fd6b8', kind: 'core',
      tag: '核心', brief: '走到面的边缘会自动翻到相邻面',
      detail: '六个面拼成一个立方体，通道跨过 12 条棱互相连接。走到边界格再往前一步，小铜豆会沿着立方体表面滚过去，镜头也会自动跟到新的面。',
      tell: '展开图上六个面按十字排布，相邻关系就是真实立方体的相邻关系。',
      cost: '每走一格算 1 步',
      test: function () { return true; }
    },
    {
      id: 'portal', icon: '🌀', name: '传送门', color: '#31e1f7', kind: 'core',
      tag: '新玩法', brief: '踩上圆环立刻送到对面，分双向与单向',
      detail: '成对出现的发光圆环，通常开在互为对面的两个面上（顶↔底、前↔后、左↔右）。踩上去不能停留，会立刻被送到配对的另一端。双向门两头都能进；单向门只有入口端能进，出口端踩上去没反应——有去无回，进去前先想好退路。',
      tell: '同一对门共用一种颜色；单向门中心画一个箭头指向出口，双向门画两个对向箭头。展开图上会用同色虚线把两端连起来。',
      cost: '一次传送算 1 步；部分关卡出口被墙封死，传送门是唯一通路',
      test: function (c) { return (c.portals || 0) > 0; }
    },
    {
      id: 'key', icon: '🔑', name: '钥匙与色门', color: '#ff4d5e', kind: 'gate',
      tag: '闸门', brief: '捡起同色钥匙，对应颜色的门自动开',
      detail: '红宝石 / 蓝水晶 / 绿宝石三种钥匙，走到格子上自动捡起。门会沉进地板让路。钥匙常常藏在别的面上，得跨棱或穿门去找。',
      tell: '门中央的宝石颜色就是要的钥匙颜色；目标条会列出还缺哪把。',
      cost: '捡钥匙不额外扣能量，只算走路的步数',
      test: function (c) { return c.gates.indexOf('key') >= 0; }
    },
    {
      id: 'gear', icon: '⚙️', name: '齿轮盘', color: '#ffc53d', kind: 'gate',
      tag: '闸门', brief: '缺口对准白指针，指示灯变绿就开锁',
      detail: '墙顶上的黄铜齿轮盘，点一下转一格。黄色缺口转到正对白指针时指示灯变绿，这一组对应的门就开了。艰难难度里 2~3 个齿轮互相联动：点一个会同时带动邻居，必须算好顺序。',
      tell: '每个齿轮盘右上角有红/绿指示灯；目标条显示「齿轮组 x/y」。',
      cost: '每点一次扣 1 格发条能量（艰难）',
      test: function (c) { return c.gates.indexOf('gear') >= 0; }
    },
    {
      id: 'lever', icon: '🎚️', name: '拉杆木桥', color: '#9be832', kind: 'gate',
      tag: '闸门', brief: '扳拉杆，缺口上升起木桥；再扳一次收回',
      detail: '迷宫里有的格是缺口，走不过去。找到对应拉杆扳一下，木桥从下方升起来补上缺口。这是唯一可以反复开关的机关——收回去也能用来断路。',
      tell: '拉杆球头绿色＝已升起，红色＝未升起；展开图上缺口亮起木色就是通了。',
      cost: '每扳一次扣 1 格发条能量（艰难）',
      test: function (c) { return c.gates.indexOf('lever') >= 0; }
    },
    {
      id: 'seq', icon: '💎', name: '水晶顺序锁', color: '#5ac8ff', kind: 'gate',
      tag: '闸门', brief: '看一遍闪烁顺序，再照着点一次',
      detail: '3~4 颗水晶柱。第一次点任意一颗会演示一遍顺序，然后按同样顺序点回来。点错不扣分，会重新演示一遍。中等难度 3 颗，艰难 4 颗。',
      tell: '目标条上有「重看」按钮，随时可以再看一次演示。',
      cost: '每点一颗算 1 步，点错不额外惩罚',
      test: function (c) { return c.gates.indexOf('seq') >= 0; }
    },
    {
      id: 'star', icon: '⭐', name: '星星收集', color: '#ffc53d', kind: 'reward',
      tag: '奖励', brief: '每关藏 3 颗，决定通关评价',
      detail: '三颗星星分散在不同面的死路里，完全可选。收集数量决定这一关的星级评价，会存进本地存档。想拿满星就得绕远路，和「最少步数」是一对矛盾目标。',
      tell: '展开图上金色圆点就是还没捡的星星。',
      cost: '绕路的步数；艰难难度会挤占发条能量预算',
      test: function () { return true; }
    },
    {
      id: 'energy', icon: '🔋', name: '发条能量', color: '#ff5a5f', kind: 'rule',
      tag: '规则', brief: '仅艰难难度：走一步 / 转一次面 / 点一次机关都扣 1 格',
      detail: '艰难难度独有的失败条件。能量条按这一关的参考路线宽松给出（双人合作再乘 1.7），走完就「发条松了」，需要重来或降难度。它逼你先看展开图规划路线，而不是乱走乱转。',
      tell: '左下统计卡里的能量条，低于 25% 会闪红。',
      cost: '耗尽即失败',
      test: function (c, d) { return d === 'hard'; }
    },
    {
      id: 'coop', icon: '👥', name: '双人合作', color: '#ff6fd0', kind: 'mode',
      tag: '模式', brief: '两个小铜豆共享机关，两人都到传送门才算通关',
      detail: '标题页可切换。钥匙、齿轮、木桥、水晶、星星全部共享，两人可以分头行动：一个去拿钥匙，一个去转齿轮。出口要两人都站上去才结算，一人先到会提示去接同伴。',
      tell: '头顶编号牌穿透立方体可见，永远找得到彼此；可切分屏各看一面。',
      cost: '能量预算 ×1.7',
      test: function () { return true; }
    }
  ];

  GX.PALETTE = PALETTE;
  GX.FACE_TINTS = FACE_TINTS;
  GX.PORTAL_HUES = PORTAL_HUES;
  GX.KEY_COLORS = KEY_COLORS;
  GX.KEY_ORDER = KEY_ORDER;
  GX.DIFFICULTIES = DIFFICULTIES;
  GX.LEVELS = LEVELS;
  GX.MECHANICS = MECHANICS;
})(window.GX = window.GX || {});