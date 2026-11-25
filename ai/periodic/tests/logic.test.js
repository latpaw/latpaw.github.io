const test = require('node:test');
const assert = require('node:assert/strict');
const { filterElements } = require('../logic.js');

const fixtures = [
  { number: 1, symbol: 'H', name: '氢', category: 'nonmetal', state: 'gas', form: '无色气体', property: '最轻', use: '燃料电池', fact: '宇宙常见' },
  { number: 3, symbol: 'Li', name: '锂', category: 'alkali', state: 'solid', form: '银白金属', property: '轻而活泼', use: '充电电池', fact: '金属会浮在水上' },
  { number: 6, symbol: 'C', name: '碳', category: 'nonmetal', state: 'solid', form: '石墨与钻石', property: '成键多样', use: '铅笔与电池', fact: '生命骨架' },
  { number: 26, symbol: 'Fe', name: '铁', category: 'transition', state: 'solid', form: '银灰金属', property: '有磁性', use: '钢材', fact: '血液需要它' },
];

test('搜索忽略符号大小写和首尾空格', () => {
  assert.deepEqual(filterElements(fixtures, { query: '  fe  ' }).map((element) => element.number), [26]);
  assert.deepEqual(filterElements(fixtures, { query: 'LI' }).map((element) => element.number), [3]);
});

test('可用中文名、原子序数、形态和用途搜索', () => {
  assert.deepEqual(filterElements(fixtures, { query: '碳' }).map((element) => element.number), [6]);
  assert.deepEqual(filterElements(fixtures, { query: '26' }).map((element) => element.number), [26]);
  assert.deepEqual(filterElements(fixtures, { query: '石墨' }).map((element) => element.number), [6]);
  assert.deepEqual(filterElements(fixtures, { query: '电池' }).map((element) => element.number), [1, 3, 6]);
});

test('分类与物态筛选可以叠加', () => {
  assert.deepEqual(filterElements(fixtures, { category: 'nonmetal', state: 'solid' }).map((element) => element.number), [6]);
  assert.deepEqual(filterElements(fixtures, { category: 'nonmetal', state: 'gas' }).map((element) => element.number), [1]);
  assert.deepEqual(filterElements(fixtures, { category: 'alkali', state: 'gas' }), []);
});

test('空条件返回全部元素且空结果不报错', () => {
  assert.equal(filterElements(fixtures, {}).length, 4);
  assert.deepEqual(filterElements(fixtures, { query: '不存在的元素' }), []);
});

test('搜索覆盖化合物和关系等扩展百科文本', () => {
  const enriched = fixtures.map((element) => element.number === 20 ? element : { ...element });
  enriched.push({ number: 20, symbol: 'Ca', name: '钙', category: 'alkaline', state: 'solid', form: '银白金属', property: '活泼', use: '建材', fact: '骨骼成分', searchText: '石膏 CaSO₄·2H₂O 砖红色' });
  assert.deepEqual(filterElements(enriched, { query: '石膏' }).map((element) => element.number), [20]);
  assert.deepEqual(filterElements(enriched, { query: 'caso₄·2h₂o' }).map((element) => element.number), [20]);
  assert.deepEqual(filterElements(fixtures, { query: 'undefined' }), []);
});
