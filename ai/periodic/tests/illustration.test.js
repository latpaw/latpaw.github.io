const test = require('node:test');
const assert = require('node:assert/strict');
const { createSpecimenSvg } = require('../illustration.js');

test('为不同元素生成可访问的本地 SVG 形态插图', () => {
  const gold = { number: 79, symbol: 'Au', name: '金', visual: 'metal', state: 'solid' };
  const oxygen = { number: 8, symbol: 'O', name: '氧', visual: 'gas', state: 'gas' };

  const goldSvg = createSpecimenSvg(gold);
  const oxygenSvg = createSpecimenSvg(oxygen);

  assert.match(goldSvg, /^<svg[^>]+role="img"/);
  assert.match(goldSvg, /aria-label="金的常见形态示意图"/);
  assert.match(goldSvg, /data-visual="metal"/);
  assert.match(oxygenSvg, /aria-label="氧的常见形态示意图"/);
  assert.match(oxygenSvg, /data-visual="gas"/);
  assert.notEqual(goldSvg, oxygenSvg);
});

test('SVG 不执行元素数据中的标记', () => {
  const svg = createSpecimenSvg({ number: 1, symbol: '<script>', name: '<img src=x>', visual: 'gas', state: 'gas' });
  assert.ok(!svg.includes('<script>'));
  assert.ok(!svg.includes('<img src=x>'));
  assert.match(svg, /&lt;img src=x&gt;/);
});
