(function (root, factory) {
  const data = factory(root, typeof module !== 'undefined' && module.exports ? require : null);
  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  if (root) root.CHEMISTRY_DATA = data;
})(typeof window !== 'undefined' ? window : globalThis, function (root, load) {
  const entries = load ? [
    ...load('./chemistry-data/elements-001-030.js'),
    ...load('./chemistry-data/elements-031-060.js'),
    ...load('./chemistry-data/elements-061-090.js'),
    ...load('./chemistry-data/elements-091-118.js')
  ] : [
    ...root.CHEMISTRY_PART_001_030,
    ...root.CHEMISTRY_PART_031_060,
    ...root.CHEMISTRY_PART_061_090,
    ...root.CHEMISTRY_PART_091_118
  ];
  return Object.fromEntries(entries.map((entry) => [entry.number, entry]));
});
