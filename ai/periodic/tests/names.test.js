const test = require('node:test');
const assert = require('node:assert/strict');
const { elements } = require('../data.js');
const { filterElements } = require('../logic.js');

const modernChineseNames = [
  [104, '𬬻'], [105, '𬭊'], [106, '𬭳'], [107, '𬭛'], [108, '𬭶'],
  [109, '鿏'], [110, '𫟼'], [111, '𬬭'], [112, '鿔'], [113, '鿭'],
  [114, '𫓧'], [115, '镆'], [116, '𫟷'], [117, '鿬'], [118, '鿫'],
];

test('104至118号元素使用规范简体中文名称', () => {
  for (const [number, name] of modernChineseNames) {
    assert.equal(elements[number - 1].name, name, `${number} 号元素中文名`);
  }
});

test('可按超重元素规范中文名搜索', () => {
  for (const [number, name] of modernChineseNames) {
    assert.deepEqual(filterElements(elements, { query: name }).map((element) => element.number), [number]);
  }
});
