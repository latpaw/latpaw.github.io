(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.PeriodicLogic = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function filterElements(elements, options) {
    const query = String(options.query || '').trim().toLowerCase();
    const category = options.category || 'all';
    const state = options.state || 'all';

    return elements.filter((element) => {
      if (category !== 'all' && element.category !== category) return false;
      if (state !== 'all' && element.state !== state) return false;
      if (!query) return true;

      return [element.number, element.symbol, element.name, element.form, element.property, element.use, element.fact, element.searchText]
        .some((value) => String(value ?? '').toLowerCase().includes(query));
    });
  }

  return { filterElements };
});
