(function () {
  const { elements: baseElements, categories } = window.PERIODIC_DATA;
  const { filterElements } = window.PeriodicLogic;
  const { chemistrySearchText } = window.ChemistryView;
  const elements = baseElements.map((element) => ({
    ...element,
    searchText: chemistrySearchText(window.CHEMISTRY_DATA[element.number])
  }));
  const stateLabels = { solid: '常温固态', liquid: '常温液态', gas: '常温气态', unknown: '宏观物态未知' };
  const filterState = { query: '', category: 'all', state: 'all' };
  const tiles = new Map();
  let currentElement = null;

  const table = document.getElementById('periodic-table');
  const dialog = document.getElementById('element-dialog');
  const search = document.getElementById('element-search');
  const periodicScroll = document.querySelector('.periodic-scroll');
  const emptyState = document.getElementById('empty-state');
  const encyclopedia = window.Encyclopedia.createEncyclopedia({ elements, dialog });

  function createTextElement(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = text;
    return node;
  }

  function openElement(number, tabName) {
    currentElement = number;
    for (const [tileNumber, tile] of tiles) tile.classList.toggle('is-selected', tileNumber === number);
    encyclopedia.open(number, tabName);
  }

  function buildTable() {
    const groupLabels = document.getElementById('group-labels');
    for (let group = 1; group <= 18; group += 1) {
      groupLabels.append(createTextElement('span', '', String(group)));
    }

    for (const [className, label, row] of [
      ['series-lanthanide', '57–71\n镧系', 9],
      ['series-actinide', '89–103\n锕系', 10]
    ]) {
      const placeholder = createTextElement('div', `series-placeholder ${className}`, label);
      placeholder.style.whiteSpace = 'pre-line';
      table.append(placeholder);
      const seriesLabel = createTextElement('div', 'series-label', label.split('\n')[1] + '系列');
      seriesLabel.style.setProperty('--y', row);
      table.append(seriesLabel);
    }

    for (const element of elements) {
      const tile = createTextElement('button', `element-tile category-${element.category}`, '');
      tile.type = 'button';
      tile.style.setProperty('--x', element.x);
      tile.style.setProperty('--y', element.y);
      tile.title = `${element.name}：${element.form}`;
      tile.setAttribute('aria-label', `${element.number}号元素 ${element.name}，${element.symbol}，${stateLabels[element.state]}。点击查看详情`);
      tile.dataset.number = element.number;
      tile.append(
        createTextElement('span', 'element-number', String(element.number).padStart(3, '0')),
        createTextElement('strong', 'element-symbol', element.symbol),
        createTextElement('span', 'element-name', element.name)
      );
      const stateMark = createTextElement('i', 'element-state', '');
      stateMark.dataset.state = element.state;
      stateMark.setAttribute('aria-hidden', 'true');
      tile.append(stateMark);
      tile.addEventListener('click', () => openElement(element.number));
      tiles.set(element.number, tile);
      table.append(tile);
    }
  }

  function buildCategoryFilters() {
    const container = document.getElementById('category-filter');
    const entries = [['all', { label: '全部家族' }], ...Object.entries(categories)];
    for (const [key, category] of entries) {
      const button = createTextElement('button', `category-chip${key === 'all' ? ' is-active' : ` category-${key}`}`, category.label);
      button.type = 'button';
      button.dataset.category = key;
      button.setAttribute('aria-pressed', String(key === 'all'));
      button.addEventListener('click', () => {
        filterState.category = key;
        container.querySelectorAll('button').forEach((chip) => {
          const active = chip.dataset.category === key;
          chip.classList.toggle('is-active', active);
          chip.setAttribute('aria-pressed', String(active));
        });
        updateResults();
      });
      container.append(button);
    }
  }

  function updateResults() {
    const matches = filterElements(elements, filterState);
    const matchingNumbers = new Set(matches.map((element) => element.number));
    const filtering = filterState.query || filterState.category !== 'all' || filterState.state !== 'all';

    for (const [number, tile] of tiles) {
      const match = matchingNumbers.has(number);
      tile.classList.toggle('is-muted', !match);
      tile.classList.toggle('is-match', Boolean(filtering && match));
      tile.disabled = !match;
      tile.tabIndex = match ? 0 : -1;
      if (match) tile.removeAttribute('aria-hidden');
      else tile.setAttribute('aria-hidden', 'true');
    }

    document.getElementById('result-count').textContent = filtering
      ? `找到 ${matches.length} 种元素 · 点击卡片继续探索`
      : `${elements.length} 位元素居民，等你认识`;
    emptyState.hidden = matches.length !== 0;
    periodicScroll.hidden = matches.length === 0;
  }

  function resetFilters() {
    filterState.query = '';
    filterState.category = 'all';
    filterState.state = 'all';
    search.value = '';
    document.querySelectorAll('[data-category]').forEach((button) => {
      const active = button.dataset.category === 'all';
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-state]').forEach((button) => {
      if (!button.matches('.state-filter button')) return;
      const active = button.dataset.state === 'all';
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateResults();
    search.focus();
  }

  search.addEventListener('input', () => {
    filterState.query = search.value;
    updateResults();
  });

  document.querySelectorAll('.state-filter button').forEach((button) => {
    button.addEventListener('click', () => {
      filterState.state = button.dataset.state;
      document.querySelectorAll('.state-filter button').forEach((stateButton) => {
        const active = stateButton === button;
        stateButton.classList.toggle('is-active', active);
        stateButton.setAttribute('aria-pressed', String(active));
      });
      updateResults();
    });
  });

  document.getElementById('random-element').addEventListener('click', () => {
    let number = Math.floor(Math.random() * elements.length) + 1;
    if (number === currentElement) number = (number % elements.length) + 1;
    openElement(number);
  });
  document.getElementById('reset-filters').addEventListener('click', resetFilters);

  dialog.addEventListener('close', () => {
    currentElement = null;
    for (const tile of tiles.values()) tile.classList.remove('is-selected');
  });
  document.addEventListener('keydown', (event) => {
    const typing = event.target.matches('input, textarea, [contenteditable="true"]');
    const onTab = event.target.matches('[role="tab"]');
    if (event.key === '/' && !typing && !dialog.open) {
      event.preventDefault();
      search.focus();
    }
    if (dialog.open && !typing && !onTab && event.key === 'ArrowRight') encyclopedia.move(1);
    if (dialog.open && !typing && !onTab && event.key === 'ArrowLeft') encyclopedia.move(-1);
  });

  buildTable();
  buildCategoryFilters();
  updateResults();
})();
