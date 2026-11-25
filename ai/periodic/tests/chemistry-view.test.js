const test = require('node:test');
const assert = require('node:assert/strict');
const { createElectronShellSvg, chemistrySearchText } = require('../chemistry-view.js');

test('电子层插图显示所有电子并带可访问名称', () => {
  const svg = createElectronShellSvg({ name: '铁', symbol: 'Fe', number: 26 }, { shells: [2, 8, 14, 2] });
  assert.match(svg, /role="img"/);
  assert.match(svg, /aria-label="铁原子的电子层示意图"/);
  assert.equal((svg.match(/data-electron=/g) || []).length, 26);
  assert.equal((svg.match(/data-shell=/g) || []).length, 4);
  for (const label of ['2', '8', '14']) assert.match(svg, new RegExp(`data-label="${label}"`));
});

test('电子层插图转义动态文本', () => {
  const svg = createElectronShellSvg({ name: '<img src=x>', symbol: '<script>', number: 1 }, { shells: [1] });
  assert.ok(!svg.includes('<script>'));
  assert.ok(!svg.includes('<img src=x>'));
  assert.ok(svg.includes('&lt;img src=x&gt;'));
});

test('百科搜索覆盖化合物、反应、焰色、关系和故事', () => {
  const text = chemistrySearchText({
    config: '[Ar] 4s²', oxidation: '+2', reactivity: '较活泼', nuclearText: '有稳定同位素',
    flame: { label: '砖红色', text: '钙盐火焰' }, compoundNote: '常见钙盐',
    compounds: [{ name: '石膏', formula: 'CaSO₄·2H₂O', note: '建筑材料' }],
    reaction: { equation: 'CaO + H₂O → Ca(OH)₂', text: '放出热量' },
    relations: [{ type: '材料搭档', text: '与硅酸盐制成水泥' }], story: '贝壳中的碳酸钙',
    mass: '40.078', melting: '842°C', density: '1.54 g/cm³'
  });
  for (const expected of ['石膏', 'CaSO₄·2H₂O', '放出热量', '砖红色', '材料搭档', '贝壳', '842°C']) assert.ok(text.includes(expected), `缺少 ${expected}`);
});
