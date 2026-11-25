(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.Encyclopedia = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function createEncyclopedia({ elements, dialog }) {
    const chemistryData = window.CHEMISTRY_DATA;
    const { createSpecimenSvg } = window.PeriodicIllustration;
    const { createElectronShellSvg } = window.ChemistryView;
    const nuclearLabels = { stable: '存在稳定同位素', weak: '极弱放射性', radioactive: '没有稳定同位素' };
    const tabs = [...dialog.querySelectorAll('[role="tab"]')];
    let currentElement = null;
    let currentTab = 'overview';

    function setText(id, value) {
      document.getElementById(id).textContent = value;
    }

    function createText(tag, className, text) {
      const node = document.createElement(tag);
      node.className = className;
      node.textContent = text;
      return node;
    }

    function switchTab(tabName, moveFocus = false) {
      currentTab = tabName;
      for (const tab of tabs) {
        const selected = tab.dataset.tab === tabName;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        document.getElementById(`panel-${tab.dataset.tab}`).hidden = !selected;
        if (selected && moveFocus) tab.focus({ preventScroll: true });
      }
      dialog.scrollTop = 0;
    }

    function renderCompounds(chemistry) {
      const container = document.getElementById('compound-cards');
      container.replaceChildren();
      if (chemistry.compounds.length === 0) {
        container.append(createText('p', 'compound-empty', '暂无可展示的代表化合物；请查看上方的研究边界说明。'));
      } else {
        for (const compound of chemistry.compounds) {
          const card = createText('article', 'compound-card', '');
          card.append(
            createText('strong', '', compound.formula),
            createText('h4', '', compound.name),
            createText('p', '', compound.note)
          );
          container.append(card);
        }
      }
      document.getElementById('reaction-card').hidden = !chemistry.reaction;
      if (chemistry.reaction) {
        setText('detail-equation', chemistry.reaction.equation);
        setText('detail-reaction', chemistry.reaction.text);
      }
    }

    function renderRelations(chemistry) {
      const container = document.getElementById('relation-cards');
      container.replaceChildren();
      for (const relation of chemistry.relations) {
        const related = elements[relation.number - 1];
        const button = createText('button', 'relation-card', '');
        button.type = 'button';
        button.setAttribute('aria-label', `${relation.type}：${related.name}。${relation.text} 点击查看${related.name}`);
        const content = createText('div', '', '');
        content.append(
          createText('small', '', relation.type),
          createText('h4', '', `${related.name} · ${related.symbol}`),
          createText('p', '', relation.text)
        );
        button.append(createText('span', 'relation-symbol', related.symbol), content);
        button.addEventListener('click', () => open(related.number, 'relations', true));
        container.append(button);
      }
      setText('detail-story', chemistry.story);
    }

    function open(number, tabName = 'overview', focusTab = false) {
      const element = elements[number - 1];
      const chemistry = chemistryData[number];
      currentElement = number;

      setText('detail-index', `ELEMENT No. ${String(number).padStart(3, '0')} / PERIOD ${element.period}`);
      setText('detail-category', window.PERIODIC_DATA.categories[element.category].label);
      setText('detail-state', { solid: '常温固态', liquid: '常温液态', gas: '常温气态', unknown: '宏观物态未知' }[element.state]);
      setText('detail-symbol', element.symbol);
      setText('detail-name', element.name);
      setText('detail-english', `ATOMIC NUMBER ${number}`);
      setText('detail-form', element.form);
      setText('detail-property', element.property);
      setText('detail-use', element.use);
      setText('detail-fact', element.fact);
      setText('detail-position', `${number} / ${elements.length}`);
      setText('detail-reactivity', chemistry.reactivity);
      setText('detail-nuclear', nuclearLabels[chemistry.nuclear]);
      setText('detail-nuclear-text', chemistry.nuclearText);
      setText('detail-flame', chemistry.flame.label);
      setText('detail-flame-text', chemistry.flame.text);
      setText('detail-mass', chemistry.mass);
      setText('detail-melting', chemistry.melting);
      setText('detail-density', chemistry.density);
      setText('detail-config', chemistry.config);
      setText('detail-shells', `${chemistry.shells.join(' · ')}（从内到外）`);
      setText('detail-oxidation', chemistry.oxidation);
      setText('detail-compound-note', chemistry.compoundNote);
      document.getElementById('detail-safety').hidden = !(number === 43 || number === 61 || number >= 84);
      document.getElementById('detail-illustration').innerHTML = createSpecimenSvg(element);
      document.getElementById('electron-shells').innerHTML = createElectronShellSvg(element, chemistry);
      document.getElementById('nuclear-card').className = `status-card is-${chemistry.nuclear}`;
      document.getElementById('flame-swatch').style.background = chemistry.flame.color || '#c4cbc7';
      renderCompounds(chemistry);
      renderRelations(chemistry);

      const alreadyOpen = dialog.open;
      switchTab(tabName, alreadyOpen && focusTab);
      if (!alreadyOpen) dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('dialog-open');
    }

    function close() {
      dialog.close();
    }

    function move(step) {
      const next = ((currentElement - 1 + step + elements.length) % elements.length) + 1;
      open(next, currentTab);
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => switchTab(tab.dataset.tab));
      tab.addEventListener('keydown', (event) => {
        let targetIndex = null;
        if (event.key === 'ArrowRight') targetIndex = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') targetIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') targetIndex = 0;
        if (event.key === 'End') targetIndex = tabs.length - 1;
        if (targetIndex !== null) {
          event.preventDefault();
          switchTab(tabs[targetIndex].dataset.tab, true);
        }
      });
    });
    document.getElementById('dialog-close').addEventListener('click', close);
    document.getElementById('previous-element').addEventListener('click', () => move(-1));
    document.getElementById('next-element').addEventListener('click', () => move(1));
    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
    });

    return { open, close, move };
  }

  return { createEncyclopedia };
});
