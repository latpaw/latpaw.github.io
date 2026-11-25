const test = require('node:test');
const assert = require('node:assert/strict');
const { elements, categories } = require('../data.js');

test('包含原子序数 1 到 118 的全部元素且顺序正确', () => {
  assert.equal(elements.length, 118);
  assert.deepEqual(elements.map((element) => element.number), Array.from({ length: 118 }, (_, index) => index + 1));
});

test('每种元素都有面向大众的中文形态、特性、用途与趣味知识', () => {
  const categoryKeys = new Set(Object.keys(categories));
  const visualKinds = new Set(['metal', 'crystal', 'gas', 'liquid', 'powder', 'rock', 'molecule', 'synthetic']);
  const states = new Set(['solid', 'liquid', 'gas', 'unknown']);

  for (const element of elements) {
    assert.ok(element.symbol, `${element.number} 缺少符号`);
    assert.ok(element.name, `${element.number} 缺少中文名`);
    assert.ok(categoryKeys.has(element.category), `${element.number} 分类无效`);
    assert.ok(states.has(element.state), `${element.number} 物态无效`);
    assert.ok(visualKinds.has(element.visual), `${element.number} 插图类型无效`);
    for (const field of ['form', 'property', 'use', 'fact']) {
      assert.equal(typeof element[field], 'string', `${element.number} 的 ${field} 不是文本`);
      assert.ok(element[field].trim().length >= 4, `${element.number} 的 ${field} 内容过短`);
    }
  }
});

test('代表元素的符号、中文名与位置准确', () => {
  const expected = [
    [1, 'H', '氢', 1, 1, 1],
    [2, 'He', '氦', 18, 1, 1],
    [6, 'C', '碳', 14, 2, 2],
    [8, 'O', '氧', 16, 2, 2],
    [26, 'Fe', '铁', 8, 4, 4],
    [29, 'Cu', '铜', 11, 4, 4],
    [54, 'Xe', '氙', 18, 5, 5],
    [57, 'La', '镧', 3, 6, 9],
    [58, 'Ce', '铈', 4, 6, 9],
    [71, 'Lu', '镥', 17, 6, 9],
    [79, 'Au', '金', 11, 6, 6],
    [86, 'Rn', '氡', 18, 6, 6],
    [89, 'Ac', '锕', 3, 7, 10],
    [103, 'Lr', '铹', 17, 7, 10],
    [118, 'Og', '鿫', 18, 7, 7],
  ];

  for (const [number, symbol, name, x, period, y] of expected) {
    const element = elements[number - 1];
    assert.equal(element.symbol, symbol);
    assert.equal(element.name, name);
    assert.deepEqual([element.x, element.period, element.y], [x, period, y]);
  }
});

test('所有周期表格子坐标唯一且都在有效网格内', () => {
  const positions = new Set();
  for (const element of elements) {
    const position = `${element.x},${element.y}`;
    assert.ok(!positions.has(position), `坐标重复：${position}`);
    positions.add(position);
    assert.ok(Number.isInteger(element.x) && element.x >= 1 && element.x <= 18);
    assert.ok(Number.isInteger(element.y) && element.y >= 1 && element.y <= 10);
    assert.ok(Number.isInteger(element.period) && element.period >= 1 && element.period <= 7);
  }
});

test('常温液态与气态元素清单准确', () => {
  assert.deepEqual(elements.filter((element) => element.state === 'liquid').map((element) => element.symbol), ['Br', 'Hg']);
  assert.deepEqual(elements.filter((element) => element.state === 'gas').map((element) => element.symbol), ['H', 'He', 'N', 'O', 'F', 'Ne', 'Cl', 'Ar', 'Kr', 'Xe', 'Rn']);
});

test('主族与稀土等易混元素采用正确分类', () => {
  assert.equal(elements[56].category, 'lanthanide');
  assert.equal(elements[70].category, 'lanthanide');
  assert.equal(elements[88].category, 'actinide');
  assert.equal(elements[102].category, 'actinide');
  assert.equal(elements[48].category, 'post');
  assert.equal(elements[31].category, 'metalloid');
  assert.equal(elements[5].category, 'nonmetal');
  assert.equal(elements[8].category, 'halogen');
  assert.equal(elements[9].category, 'noble');
});
