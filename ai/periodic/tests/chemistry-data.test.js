const test = require('node:test');
const assert = require('node:assert/strict');
const chemistry = require('../chemistry-data.js');

test('118种元素都有结构、稳定性、焰色、化合物说明、关系与故事', () => {
  assert.deepEqual(Object.keys(chemistry).map(Number).sort((a, b) => a - b), Array.from({ length: 118 }, (_, index) => index + 1));
  for (const element of Object.values(chemistry)) {
    assert.ok(element.config.length >= 2, `${element.number} 缺少电子排布`);
    assert.ok(element.oxidation.length >= 1, `${element.number} 缺少常见化合价`);
    assert.ok(element.reactivity.length >= 4, `${element.number} 缺少化学活泼性`);
    assert.ok(['stable', 'weak', 'radioactive'].includes(element.nuclear), `${element.number} 核稳定性类型无效`);
    assert.ok(element.nuclearText.length >= 4, `${element.number} 缺少核稳定性说明`);
    assert.ok(['typical', 'none', 'unknown'].includes(element.flame.type), `${element.number} 焰色类型无效`);
    assert.ok(element.flame.label.length >= 1, `${element.number} 焰色缺少名称`);
    assert.ok(element.flame.text.length >= 4, `${element.number} 缺少焰色说明`);
    if (element.flame.type === 'typical') {
      assert.match(element.flame.color, /^#[0-9a-f]{6}$/i, `${element.number} 焰色缺少色值`);
    }
    assert.ok(Array.isArray(element.compounds), `${element.number} 化合物不是数组`);
    assert.ok(element.compoundNote.length >= 4, `${element.number} 缺少化合物边界说明`);
    for (const compound of element.compounds) {
      assert.ok(compound.name.length >= 1 && compound.formula.length >= 1 && compound.note.length >= 4, `${element.number} 化合物字段不完整`);
    }
    assert.ok(element.reaction === null || (element.reaction.equation.length >= 3 && element.reaction.text.length >= 4), `${element.number} 反应字段不完整`);
    assert.ok(element.relations.length >= 1, `${element.number} 缺少元素关系`);
    for (const relation of element.relations) {
      assert.ok(Number.isInteger(relation.number) && relation.number >= 1 && relation.number <= 118 && relation.number !== element.number, `${element.number} 关系目标无效`);
      assert.ok(relation.type.length >= 2 && relation.text.length >= 4, `${element.number} 关系说明不完整`);
    }
    assert.ok(element.story.length >= 8, `${element.number} 缺少延伸故事`);
    for (const field of ['mass', 'melting', 'density']) assert.ok(element[field].length >= 1, `${element.number} 缺少 ${field}`);
  }
});

test('电子层数总和等于中性原子的电子数', () => {
  for (const element of Object.values(chemistry)) {
    assert.ok(element.shells.length >= 1 && element.shells.length <= 7, `${element.number} 电子层数无效`);
    assert.equal(element.shells.reduce((sum, count) => sum + count, 0), element.number, `${element.number} 电子层电子总数错误`);
    assert.ok(element.shells.every((count) => Number.isInteger(count) && count > 0));
  }
});

test('过渡金属与镧系等特殊电子层分布准确', () => {
  const expected = {
    24: [2, 8, 13, 1], 29: [2, 8, 18, 1], 41: [2, 8, 18, 12, 1],
    42: [2, 8, 18, 13, 1], 44: [2, 8, 18, 15, 1], 45: [2, 8, 18, 16, 1],
    46: [2, 8, 18, 18], 47: [2, 8, 18, 18, 1], 57: [2, 8, 18, 18, 9, 2],
    58: [2, 8, 18, 19, 9, 2], 64: [2, 8, 18, 25, 9, 2], 71: [2, 8, 18, 32, 9, 2],
    78: [2, 8, 18, 32, 17, 1], 79: [2, 8, 18, 32, 18, 1],
    91: [2, 8, 18, 32, 20, 9, 2], 92: [2, 8, 18, 32, 21, 9, 2],
    96: [2, 8, 18, 32, 25, 9, 2], 103: [2, 8, 18, 32, 32, 8, 3],
    112: [2, 8, 18, 32, 32, 18, 2], 118: [2, 8, 18, 32, 32, 18, 8],
  };
  for (const [number, shells] of Object.entries(expected)) assert.deepEqual(chemistry[number].shells, shells, `${number} 号电子层`);
});

test('铁、钙及其化合物与关系准确', () => {
  assert.deepEqual(chemistry[26].shells, [2, 8, 14, 2]);
  assert.ok(chemistry[26].config.includes('3d⁶') && chemistry[26].config.includes('4s²'));
  assert.equal(chemistry[26].nuclear, 'stable');
  assert.equal(chemistry[26].flame.type, 'none');
  assert.ok(chemistry[26].compounds.some((compound) => compound.formula === 'Fe₂O₃'));
  assert.ok(chemistry[26].compounds.some((compound) => compound.formula === 'Fe₃O₄'));
  assert.ok(chemistry[26].relations.some((relation) => relation.number === 6));

  assert.deepEqual(chemistry[20].shells, [2, 8, 8, 2]);
  assert.equal(chemistry[20].flame.type, 'typical');
  assert.ok(chemistry[20].flame.label.includes('砖红'));
  assert.deepEqual(chemistry[20].compounds.map((compound) => compound.formula), ['CaO', 'Ca(OH)₂', 'CaCO₃', 'CaSO₄·2H₂O']);
});

test('典型焰色与非焰色现象不混淆', () => {
  assert.ok(chemistry[11].flame.label.includes('黄'));
  assert.ok(chemistry[19].flame.label.includes('紫'));
  assert.ok(chemistry[38].flame.label.includes('红'));
  assert.ok(chemistry[56].flame.label.includes('黄绿'));
  assert.equal(chemistry[17].flame.type, 'none');
  assert.equal(chemistry[10].flame.type, 'none');
  assert.ok(chemistry[10].flame.text.includes('放电'));
});

test('非稀有气体的稳定元素均有代表反应', () => {
  for (const element of Object.values(chemistry)) {
    if (element.nuclear === 'stable' && ![2, 10, 18].includes(element.number)) {
      assert.ok(element.reaction && element.reaction.equation.length >= 3, `${element.number} 号稳定元素缺少代表反应`);
    }
  }
});

test('无稳定同位素与超重元素有明确边界', () => {
  assert.equal(chemistry[43].nuclear, 'radioactive');
  assert.equal(chemistry[61].nuclear, 'radioactive');
  assert.equal(chemistry[83].nuclear, 'weak');
  assert.equal(chemistry[92].nuclear, 'radioactive');
  assert.equal(chemistry[118].nuclear, 'radioactive');
  assert.equal(chemistry[118].flame.type, 'unknown');
  assert.ok(Array.isArray(chemistry[118].compounds));
  assert.ok(chemistry[118].compoundNote.includes('未知') || chemistry[118].compoundNote.includes('尚') || chemistry[118].compoundNote.includes('预测'));
});
