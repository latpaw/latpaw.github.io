/* ==========================================================================
   世界文明与帝国时空全景图 · Interactive Timeline, Map & Migration Engine
   ========================================================================== */

(function () {
  'use strict';

  const REGIONS = window.HISTORY_REGIONS;
  const ERAS = window.HISTORY_ERAS;
  const LENSES = window.RELIGION_LENSES;
  const EMPIRES = window.HISTORY_EMPIRES;
  const ENRICHMENTS = window.EMPIRE_ENRICHMENTS || {};
  const LANDMARKS = window.GEO_LANDMARKS || {};
  const FLOWS = window.HISTORY_FLOWS;
  const FACTS = window.HISTORY_FACTS;

  const MIN_YEAR = -3500;
  const MAX_YEAR = 2026;
  const TOP_PAD = 28;
  const BOTTOM_PAD = 48;

  // Piecewise adaptive vertical scale (base px per year at zoom=1.0)
  const ADAPTIVE_SEGMENTS = [
    { start: -3500, end: -2000, pxPerYear: 0.24 }, // 360px
    { start: -2000, end: -800, pxPerYear: 0.48 },  // 576px
    { start: -800, end: 500, pxPerYear: 1.15 },    // 1495px
    { start: 500, end: 1500, pxPerYear: 1.25 },    // 1250px
    { start: 1500, end: 1900, pxPerYear: 2.25 },   // 900px
    { start: 1900, end: 2026, pxPerYear: 4.2 }     // 529px -> Total ~5110px
  ];
  const LINEAR_PX_PER_YEAR = 1.05; // 5526 * 1.05 = 5802px

  // Precompute cumulative horizontal column percentages based on weights
  const totalWeight = REGIONS.reduce((acc, r) => acc + r.weight, 0);
  const colEdges = [0];
  let accum = 0;
  for (const r of REGIONS) {
    accum += r.weight / totalWeight;
    colEdges.push(accum * 100);
  }

  function colToPct(colFloat) {
    const clamped = Math.max(0, Math.min(REGIONS.length, colFloat));
    const idx = Math.floor(clamped);
    if (idx >= REGIONS.length) return 100;
    const frac = clamped - idx;
    return colEdges[idx] + frac * (colEdges[idx + 1] - colEdges[idx]);
  }

  // Application State
  const state = {
    scaleMode: 'adaptive', // 'adaptive' | 'linear'
    zoom: 1.0,
    theme: 'archival',
    activeLens: 'all',
    selectedEmpireId: null,
    selectedPeriodIdx: 0,
    pinnedYear: null,
    hoverYear: -140,
    activeFlowId: null,
    activeFlowStepIdx: 0,
    showAllFlows: false,
    activeFactId: null,
    compareIds: ['west_han', 'roman_republic'],
    stageHeight: 5200,
    mapViewMode: 'region', // 'region' | 'world'
    mapShowRivers: true,
    mapShowBorders: true,
    mapShowLandmarks: true
  };

  // DOM References
  const els = {
    chartViewport: document.getElementById('chartViewport'),
    chartFrame: document.getElementById('chartFrame'),
    regionHeaders: document.getElementById('regionHeaders'),
    timeAxis: document.getElementById('timeAxis'),
    timelineStage: document.getElementById('timelineStage'),
    stageGrid: document.getElementById('stageGrid'),
    bcCeDivider: document.getElementById('bcCeDivider'),
    empiresLayer: document.getElementById('empiresLayer'),
    flowsSvg: document.getElementById('flowsSvg'),
    factSpotlightLayer: document.getElementById('factSpotlightLayer'),
    chronoScanner: document.getElementById('chronoScanner'),
    scannerYearPill: document.getElementById('scannerYearPill'),
    pinnedScanner: document.getElementById('pinnedScanner'),
    pinnedYearPill: document.getElementById('pinnedYearPill'),
    eraNav: document.getElementById('eraNav'),
    lensNav: document.getElementById('lensNav'),
    scaleAdaptiveBtn: document.getElementById('scaleAdaptiveBtn'),
    scaleLinearBtn: document.getElementById('scaleLinearBtn'),
    scaleIndicatorText: document.getElementById('scaleIndicatorText'),
    linearBanner: document.getElementById('linearBanner'),
    backToAdaptiveBtn: document.getElementById('backToAdaptiveBtn'),
    zoomInBtn: document.getElementById('zoomInBtn'),
    zoomOutBtn: document.getElementById('zoomOutBtn'),
    zoomLabel: document.getElementById('zoomLabel'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    searchInput: document.getElementById('searchInput'),
    searchClear: document.getElementById('searchClear'),
    searchDropdown: document.getElementById('searchDropdown'),
    yearJumpInput: document.getElementById('yearJumpInput'),
    yearJumpBtn: document.getElementById('yearJumpBtn'),
    minimap: document.getElementById('minimap'),
    minimapTrack: document.getElementById('minimapTrack'),
    minimapBcLine: document.getElementById('minimapBcLine'),
    minimapViewport: document.getElementById('minimapViewport'),

    // Ribbon
    pinYearBtn: document.getElementById('pinYearBtn'),
    unpinYearBtn: document.getElementById('unpinYearBtn'),
    ribbonYear: document.getElementById('ribbonYear'),
    ribbonEraName: document.getElementById('ribbonEraName'),
    ribbonEmpires: document.getElementById('ribbonEmpires'),

    // Detail Drawer
    detailDrawer: document.getElementById('detailDrawer'),
    drawerColorDot: document.getElementById('drawerColorDot'),
    drawerTitle: document.getElementById('drawerTitle'),
    drawerSubtitle: document.getElementById('drawerSubtitle'),
    drawerCompareBtn: document.getElementById('drawerCompareBtn'),
    drawerCloseBtn: document.getElementById('drawerCloseBtn'),
    nameOriginSection: document.getElementById('nameOriginSection'),
    drawerNameOrigin: document.getElementById('drawerNameOrigin'),
    periodTabsSection: document.getElementById('periodTabsSection'),
    periodTabs: document.getElementById('periodTabs'),
    periodSpanBadge: document.getElementById('periodSpanBadge'),
    territoryMapSvg: document.getElementById('territoryMapSvg'),
    mapModeRegionBtn: document.getElementById('mapModeRegionBtn'),
    mapModeWorldBtn: document.getElementById('mapModeWorldBtn'),
    mapExpandBtn: document.getElementById('mapExpandBtn'),
    mapViewBadge: document.getElementById('mapViewBadge'),
    mapCapitalValue: document.getElementById('mapCapitalValue'),
    mapTerritoryDesc: document.getElementById('mapTerritoryDesc'),
    drawerLandmarksWrap: document.getElementById('drawerLandmarksWrap'),
    drawerLandmarks: document.getElementById('drawerLandmarks'),

    // High-res Map Modal
    mapModal: document.getElementById('mapModal'),
    mapModalTitle: document.getElementById('mapModalTitle'),
    mapModalSub: document.getElementById('mapModalSub'),
    modalMapRegionBtn: document.getElementById('modalMapRegionBtn'),
    modalMapWorldBtn: document.getElementById('modalMapWorldBtn'),
    modalLandmarksToggle: document.getElementById('modalLandmarksToggle'),
    modalRiversToggle: document.getElementById('modalRiversToggle'),
    modalBordersToggle: document.getElementById('modalBordersToggle'),
    closeMapModalBtn: document.getElementById('closeMapModalBtn'),
    mapModalPeriods: document.getElementById('mapModalPeriods'),
    modalTerritoryMapSvg: document.getElementById('modalTerritoryMapSvg'),
    mapModalCaption: document.getElementById('mapModalCaption'),
    drawerSummary: document.getElementById('drawerSummary'),
    drawerCivilization: document.getElementById('drawerCivilization'),
    drawerReligionTags: document.getElementById('drawerReligionTags'),
    drawerReligionDetail: document.getElementById('drawerReligionDetail'),
    drawerFunEventsSection: document.getElementById('drawerFunEventsSection'),
    drawerFunEvents: document.getElementById('drawerFunEvents'),
    drawerFigures: document.getElementById('drawerFigures'),
    drawerMigrationsSection: document.getElementById('drawerMigrationsSection'),
    drawerMigrations: document.getElementById('drawerMigrations'),
    drawerContemporaries: document.getElementById('drawerContemporaries'),

    // Flows Panel
    flowsToggleBtn: document.getElementById('flowsToggleBtn'),
    flowsPanel: document.getElementById('flowsPanel'),
    closeFlowsPanelBtn: document.getElementById('closeFlowsPanelBtn'),
    showAllFlowsCheckbox: document.getElementById('showAllFlowsCheckbox'),
    flowSelectorList: document.getElementById('flowSelectorList'),
    flowStoryBox: document.getElementById('flowStoryBox'),
    flowStoryTitle: document.getElementById('flowStoryTitle'),
    flowStorySummary: document.getElementById('flowStorySummary'),
    flowPrevStepBtn: document.getElementById('flowPrevStepBtn'),
    flowNextStepBtn: document.getElementById('flowNextStepBtn'),
    flowStepCounter: document.getElementById('flowStepCounter'),
    flowStepsTimeline: document.getElementById('flowStepsTimeline'),

    // Facts Panel
    factsToggleBtn: document.getElementById('factsToggleBtn'),
    factsCountBadge: document.getElementById('factsCountBadge'),
    factsPanel: document.getElementById('factsPanel'),
    closeFactsPanelBtn: document.getElementById('closeFactsPanelBtn'),
    prevFactBtn: document.getElementById('prevFactBtn'),
    nextFactBtn: document.getElementById('nextFactBtn'),
    factsGrid: document.getElementById('factsGrid'),

    // Compare Modal
    compareToggleBtn: document.getElementById('compareToggleBtn'),
    compareCountBadge: document.getElementById('compareCountBadge'),
    compareModal: document.getElementById('compareModal'),
    closeCompareModalBtn: document.getElementById('closeCompareModalBtn'),
    compareSelectA: document.getElementById('compareSelectA'),
    compareSelectB: document.getElementById('compareSelectB'),
    compareContent: document.getElementById('compareContent')
  };

  /* ------------------------------------------------------------------------
     Year <-> Pixel Coordinate Mapping
     ------------------------------------------------------------------------ */

  function yearToY(year) {
    const yClamped = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
    if (state.scaleMode === 'linear') {
      return TOP_PAD + (yClamped - MIN_YEAR) * LINEAR_PX_PER_YEAR * state.zoom;
    }
    let px = TOP_PAD;
    for (const seg of ADAPTIVE_SEGMENTS) {
      if (yClamped <= seg.start) break;
      const span = Math.min(yClamped, seg.end) - seg.start;
      px += span * seg.pxPerYear * state.zoom;
    }
    return px;
  }

  function yToYear(px) {
    const rel = Math.max(0, px - TOP_PAD);
    if (state.scaleMode === 'linear') {
      return Math.round(MIN_YEAR + rel / (LINEAR_PX_PER_YEAR * state.zoom));
    }
    let acc = 0;
    for (const seg of ADAPTIVE_SEGMENTS) {
      const segPx = (seg.end - seg.start) * seg.pxPerYear * state.zoom;
      if (rel <= acc + segPx) {
        return Math.round(seg.start + (rel - acc) / (seg.pxPerYear * state.zoom));
      }
      acc += segPx;
    }
    return MAX_YEAR;
  }

  function formatYear(y) {
    if (y === 0) return '公元元年';
    return y < 0 ? `前 ${Math.abs(y)} 年` : `公元 ${y} 年`;
  }

  function formatYearShort(y) {
    if (y === 0) return '1 CE';
    return y < 0 ? `-${Math.abs(y)}` : `${y}`;
  }

  function formatSpan(start, end) {
    const s = start < 0 ? `前${Math.abs(start)}` : `${start}`;
    const e = end < 0 ? `前${Math.abs(end)}` : `${end}`;
    return `${s} ~ ${e}`;
  }

  function getEraForYear(y) {
    return ERAS.find((e) => y >= e.startYear && y <= e.endYear) || ERAS[ERAS.length - 1];
  }

  function getEmpireById(id) {
    return EMPIRES.find((e) => e.id === id);
  }

  function getEmpireEnrichment(id) {
    return ENRICHMENTS[id] || null;
  }

  function getEmpireLandmarks(id) {
    const enrich = getEmpireEnrichment(id);
    if (!enrich || !enrich.landmarks) return [];
    return enrich.landmarks.map((lid) => LANDMARKS[lid]).filter(Boolean);
  }

  function getLandmarkTypeColor(type) {
    switch (type) {
      case '关隘山口': return '#c23b22';
      case '黄金水道': return '#1f7a8c';
      case '战略走廊': return '#b8761c';
      case '天然屏障': return '#52647a';
      default: return '#9b3d26';
    }
  }

  /* ------------------------------------------------------------------------
     Render Headers, Subbar, Grid, Time Axis & Empire Blocks
     ------------------------------------------------------------------------ */

  function renderStaticControls() {
    // Region column headers
    els.regionHeaders.innerHTML = '';
    REGIONS.forEach((r, idx) => {
      const div = document.createElement('div');
      div.className = 'region-col-header';
      div.style.width = `${colEdges[idx + 1] - colEdges[idx]}%`;
      div.innerHTML = `<span class="region-col-title">${r.name}</span><span class="region-col-sub">${r.sub}</span>`;
      div.title = `点击查看「${r.name}」列`;
      div.addEventListener('click', () => {
        const targetX = (colEdges[idx] / 100) * els.timelineStage.clientWidth;
        els.chartViewport.scrollTo({ left: Math.max(0, targetX - 60), behavior: 'smooth' });
      });
      els.regionHeaders.appendChild(div);
    });

    // Era nav pills
    ERAS.forEach((era) => {
      const btn = document.createElement('button');
      btn.className = 'pill-btn';
      btn.textContent = era.short;
      btn.title = `${era.name} (${formatSpan(era.startYear, era.endYear)})`;
      btn.addEventListener('click', () => scrollToYear(era.jumpYear, true));
      els.eraNav.appendChild(btn);
    });

    // Religion lens pills
    LENSES.forEach((lens) => {
      const btn = document.createElement('button');
      btn.className = `pill-btn${lens.id === state.activeLens ? ' active' : ''}`;
      btn.dataset.lens = lens.id;
      btn.textContent = lens.label;
      btn.addEventListener('click', () => {
        state.activeLens = lens.id;
        els.lensNav.querySelectorAll('.pill-btn').forEach((b) => {
          b.classList.toggle('active', b.dataset.lens === state.activeLens);
        });
        applyVisualDimming();
      });
      els.lensNav.appendChild(btn);
    });

    // Facts count & cards
    els.factsCountBadge.textContent = String(FACTS.length);
    renderFactsGrid();

    // Flows selector pills
    renderFlowSelector();

    // Compare dropdowns
    renderCompareSelectors();
  }

  function renderTimeline() {
    const totalH = Math.ceil(yearToY(MAX_YEAR) + BOTTOM_PAD);
    state.stageHeight = totalH;
    els.timeAxis.style.height = `${totalH}px`;
    els.timelineStage.style.height = `${totalH}px`;
    els.flowsSvg.setAttribute('height', String(totalH));

    // Scale indicator text
    els.scaleIndicatorText.textContent = state.scaleMode === 'linear' ? '1:1 真实线性' : '自适应比例';
    els.zoomLabel.textContent = `${state.zoom.toFixed(1)}×`;
    els.linearBanner.hidden = state.scaleMode !== 'linear';
    document.body.classList.toggle('linear-mode', state.scaleMode === 'linear');

    // BC / CE Divider
    const yZero = yearToY(0);
    els.bcCeDivider.style.top = `${yZero}px`;

    // Minimap BC line
    const bcPct = (yZero / totalH) * 100;
    els.minimapBcLine.style.top = `${bcPct}%`;

    renderTimeAxisAndGrid();
    renderEmpireBlocks();
    renderFlowsOverlay();
    renderFactSpotlight();
    updatePinnedScannerPosition();
    updateMinimapViewport();
  }

  function buildAxisTicks() {
    const ticks = [];
    if (state.scaleMode === 'linear') {
      const step = state.zoom >= 1.6 ? 100 : 200;
      for (let y = -3400; y <= 2000; y += step) {
        ticks.push({ year: y, major: y % 500 === 0 || y === 0 });
      }
      ticks.push({ year: 2026, major: true });
      return ticks;
    }
    // Adaptive smart ticks
    for (let y = -3500; y < -2000; y += 500) ticks.push({ year: y, major: y % 1000 === 0 });
    for (let y = -2000; y < -800; y += 200) ticks.push({ year: y, major: y % 400 === 0 });
    for (let y = -800; y < 1500; y += 100) ticks.push({ year: y, major: y % 200 === 0 || y === 0 });
    for (let y = 1500; y < 1900; y += 50) ticks.push({ year: y, major: y % 100 === 0 });
    for (let y = 1900; y <= 2020; y += 20) ticks.push({ year: y, major: y % 50 === 0 || y === 1900 || y === 2000 });
    ticks.push({ year: 2026, major: true });
    return ticks;
  }

  function renderTimeAxisAndGrid() {
    els.timeAxis.innerHTML = '';
    els.stageGrid.innerHTML = '';

    // Vertical column guides
    REGIONS.forEach((r, idx) => {
      const col = document.createElement('div');
      col.className = `col-guide${idx % 2 === 1 ? ' alt' : ''}`;
      col.style.left = `${colEdges[idx]}%`;
      col.style.width = `${colEdges[idx + 1] - colEdges[idx]}%`;
      els.stageGrid.appendChild(col);
    });

    // Horizontal year ticks & guide lines
    const ticks = buildAxisTicks();
    const axisFrag = document.createDocumentFragment();
    const gridFrag = document.createDocumentFragment();
    for (const t of ticks) {
      const yPos = yearToY(t.year);
      const tickEl = document.createElement('div');
      tickEl.className = `axis-tick${t.major ? ' major' : ''}${t.year < 0 ? ' bc' : ''}`;
      tickEl.style.top = `${yPos}px`;
      tickEl.textContent = t.year === 0 ? '公元元年' : formatYearShort(t.year);
      axisFrag.appendChild(tickEl);

      const line = document.createElement('div');
      line.className = `year-guide${t.major ? ' major' : ''}`;
      line.style.top = `${yPos}px`;
      gridFrag.appendChild(line);
    }

    // Era watermarks
    ERAS.forEach((era) => {
      const yPos = yearToY(era.startYear) + 8;
      const mark = document.createElement('div');
      mark.className = 'era-watermark';
      mark.style.top = `${yPos}px`;
      mark.textContent = `${era.name} · ${formatSpan(era.startYear, era.endYear)}`;
      gridFrag.appendChild(mark);
    });

    els.timeAxis.appendChild(axisFrag);
    els.stageGrid.appendChild(gridFrag);
  }

  // Fact-pinned empire set (for subtle sparkle icon)
  const factEmpireIds = new Set();
  FACTS.forEach((f) => f.highlightIds.forEach((id) => factEmpireIds.add(id)));

  function renderEmpireBlocks() {
    els.empiresLayer.innerHTML = '';
    const frag = document.createDocumentFragment();

    EMPIRES.forEach((emp) => {
      const parts = emp.rects && emp.rects.length
        ? emp.rects
        : [{ colStart: emp.colStart, colEnd: emp.colEnd, startYear: emp.startYear, endYear: emp.endYear, label: emp.name }];

      parts.forEach((part, partIdx) => {
        const top = yearToY(part.startYear);
        const bottom = yearToY(part.endYear);
        const height = Math.max(14, bottom - top);
        const leftPct = colToPct(part.colStart);
        const rightPct = colToPct(part.colEnd);
        const widthPct = Math.max(1.2, rightPct - leftPct);

        const block = document.createElement('div');
        block.className = 'empire-block';
        if (emp.dashed) block.classList.add('dashed-border');
        if (emp.darkTextOff) block.classList.add('dark-text-off');
        block.dataset.empireId = emp.id;

        block.style.top = `${top}px`;
        block.style.height = `${height}px`;
        block.style.left = `${leftPct}%`;
        block.style.width = `${widthPct}%`;
        block.style.background = emp.color;
        if (emp.zIndex) block.style.zIndex = String(emp.zIndex);

        // Adaptive typography based on rendered block size
        const isNarrow = widthPct < 4.8;
        const isTall = height > 75;
        if (isNarrow && isTall) {
          block.classList.add('vertical-text', 'size-sm');
        } else if (height >= 92 && widthPct >= 9.5) {
          block.classList.add('size-lg');
        } else if (height >= 42 && widthPct >= 6.5) {
          block.classList.add('size-md');
        } else if (height >= 22) {
          block.classList.add('size-sm');
        } else {
          block.classList.add('size-xs');
        }

        const displayTitle = part.label || emp.name;
        const titleEl = document.createElement('div');
        titleEl.className = 'empire-block-name';
        titleEl.textContent = displayTitle;
        block.appendChild(titleEl);

        if (height >= 44 && !isNarrow) {
          const metaEl = document.createElement('div');
          metaEl.className = 'empire-block-meta';
          metaEl.textContent = formatSpan(part.startYear, part.endYear);
          block.appendChild(metaEl);
        }

        if (height >= 74 && widthPct >= 8.2 && emp.keyFigures && emp.keyFigures.length && partIdx === 0) {
          const rulersEl = document.createElement('div');
          rulersEl.className = 'empire-block-rulers';
          rulersEl.textContent = emp.keyFigures.slice(0, 2).map((f) => f.name.split('（')[0]).join(' · ');
          block.appendChild(rulersEl);
        }

        if (partIdx === 0 && factEmpireIds.has(emp.id) && height >= 26 && widthPct >= 5.5) {
          const pin = document.createElement('span');
          pin.className = 'empire-fact-pin';
          pin.textContent = '✦';
          pin.title = '包含反直觉历史冷知识，点击查看详情';
          block.appendChild(pin);
        }

        const empLandmarks = getEmpireLandmarks(emp.id);
        const lmHint = empLandmarks.length ? `\n标志性关隘/地形：${empLandmarks.map((l) => l.shortName).join('、')}` : '';
        block.title = `${emp.name} (${formatSpan(emp.startYear, emp.endYear)})\n势力范围：${emp.sphere}${lmHint}\n点击查看名号释义、版图关隘、人物与趣史`;
        block.addEventListener('click', (ev) => {
          ev.stopPropagation();
          openEmpireDrawer(emp.id);
        });

        frag.appendChild(block);
      });
    });

    els.empiresLayer.appendChild(frag);
    applyVisualDimming();
  }

  /* ------------------------------------------------------------------------
     Visual Highlighting & Dimming (Lens / Flows / Facts / Selection)
     ------------------------------------------------------------------------ */

  function applyVisualDimming() {
    const activeFlow = FLOWS.find((f) => f.id === state.activeFlowId);
    const activeFact = FACTS.find((f) => f.id === state.activeFactId);

    const blocks = els.empiresLayer.querySelectorAll('.empire-block');
    blocks.forEach((b) => {
      const id = b.dataset.empireId;
      const emp = getEmpireById(id);
      b.classList.remove('selected', 'dimmed', 'highlighted');

      if (id === state.selectedEmpireId) {
        b.classList.add('selected');
      }

      if (activeFact) {
        if (activeFact.highlightIds.includes(id)) {
          b.classList.add('highlighted');
        } else {
          b.classList.add('dimmed');
        }
        return;
      }

      if (activeFlow && !state.showAllFlows) {
        if (activeFlow.relatedEmpires.includes(id)) {
          b.classList.add('highlighted');
        } else {
          b.classList.add('dimmed');
        }
        return;
      }

      if (state.activeLens !== 'all') {
        const match = emp && emp.religionTags && emp.religionTags.includes(state.activeLens);
        if (match) {
          b.classList.add('highlighted');
        } else {
          b.classList.add('dimmed');
        }
      }
    });
  }

  /* ------------------------------------------------------------------------
     Empire & Period Inspector Drawer + Interactive SVG World Map
     ------------------------------------------------------------------------ */

  function openEmpireDrawer(empireId, periodIdx = 0) {
    const emp = getEmpireById(empireId);
    if (!emp) return;

    state.selectedEmpireId = empireId;
    state.selectedPeriodIdx = periodIdx;
    els.detailDrawer.classList.add('open');
    els.detailDrawer.setAttribute('aria-hidden', 'false');

    els.drawerColorDot.style.background = emp.color;
    els.drawerTitle.textContent = emp.name;
    els.drawerSubtitle.textContent = `${emp.enName} · ${formatSpan(emp.startYear, emp.endYear)}（约 ${Math.max(1, emp.endYear - emp.startYear)} 年）`;

    const enrich = getEmpireEnrichment(emp.id);
    if (enrich && enrich.nameOrigin) {
      els.nameOriginSection.hidden = false;
      els.drawerNameOrigin.textContent = enrich.nameOrigin;
    } else {
      els.nameOriginSection.hidden = true;
    }

    // Iconic Passes & Strategic Landmarks
    const empLandmarks = getEmpireLandmarks(emp.id);
    if (empLandmarks.length) {
      els.drawerLandmarksWrap.hidden = false;
      els.drawerLandmarks.innerHTML = '';
      empLandmarks.forEach((lm) => {
        const item = document.createElement('div');
        item.className = 'landmark-item';
        const badgeColor = getLandmarkTypeColor(lm.type);
        item.innerHTML = `
          <div class="landmark-item-top">
            <span class="landmark-name">▲ ${lm.name}</span>
            <span class="landmark-type-badge" style="background:${badgeColor}18;color:${badgeColor};border-color:${badgeColor}55;">${lm.type}</span>
          </div>
          <div class="landmark-desc">${lm.desc}</div>
        `;
        item.title = '点击打开高清大地图查看关隘位置';
        item.addEventListener('click', openMapModal);
        els.drawerLandmarks.appendChild(item);
      });
    } else {
      els.drawerLandmarksWrap.hidden = true;
    }

    // Period Tabs
    const periods = emp.periods && emp.periods.length ? emp.periods : [{
      id: 'default', name: '全时期', startYear: emp.startYear, endYear: emp.endYear,
      capital: emp.capital, territoryDesc: emp.sphere, mapRegions: [], highlights: emp.summary
    }];

    els.periodTabs.innerHTML = '';
    periods.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = `period-tab${idx === periodIdx ? ' active' : ''}`;
      btn.textContent = p.name;
      btn.addEventListener('click', () => {
        state.selectedPeriodIdx = idx;
        renderSelectedPeriod(emp, periods[idx]);
        els.periodTabs.querySelectorAll('.period-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
      });
      els.periodTabs.appendChild(btn);
    });

    // Static Empire Sections
    els.drawerCivilization.textContent = emp.civilization;
    els.drawerReligionDetail.textContent = emp.religionDetail;
    els.drawerReligionTags.innerHTML = (emp.religionTags || [])
      .map((t) => `<span class="tag-chip">${t}</span>`)
      .join('');

    // Interesting Events & Linked Counter-Intuitive Facts
    const funList = (enrich && enrich.funEvents) ? enrich.funEvents : [];
    const linkedFacts = FACTS.filter((f) => f.highlightIds.includes(emp.id));
    if (funList.length || linkedFacts.length) {
      els.drawerFunEventsSection.hidden = false;
      els.drawerFunEvents.innerHTML = '';

      funList.forEach((txt) => {
        const div = document.createElement('div');
        div.className = 'fun-event-item';
        div.innerHTML = `<span class="fun-event-bullet">◆</span><span>${txt}</span>`;
        els.drawerFunEvents.appendChild(div);
      });

      linkedFacts.forEach((fact) => {
        const btn = document.createElement('button');
        btn.className = 'linked-fact-btn';
        btn.innerHTML = `
          <div class="linked-fact-top">
            <span class="linked-fact-tag">✦ ${fact.tag}</span>
            <span class="linked-fact-action">在时空图定位 →</span>
          </div>
          <div class="linked-fact-title">${fact.title}</div>
        `;
        btn.addEventListener('click', () => {
          openFactsPanel();
          activateFact(fact.id);
        });
        els.drawerFunEvents.appendChild(btn);
      });
    } else {
      els.drawerFunEventsSection.hidden = true;
    }

    els.drawerFigures.innerHTML = (emp.keyFigures || []).map((f) => `
      <div class="figure-item">
        <div class="figure-top">
          <span class="figure-name">${f.name}</span>
          <span class="figure-role">${f.role} · ${f.years}</span>
        </div>
        <div class="figure-note">${f.note}</div>
      </div>
    `).join('');

    // Related Migration Chains
    const relFlows = FLOWS.filter((fl) => fl.relatedEmpires.includes(emp.id));
    if (relFlows.length) {
      els.drawerMigrationsSection.hidden = false;
      els.drawerMigrations.innerHTML = '';
      relFlows.forEach((fl) => {
        const btn = document.createElement('button');
        btn.className = 'related-flow-btn';
        btn.innerHTML = `<strong style="color:${fl.color}">⟿ ${fl.name}</strong><div style="font-size:11px;color:var(--text-secondary);margin-top:2px;">点击在时空图上高亮此迁徙脉络</div>`;
        btn.addEventListener('click', () => {
          openFlowsPanel(fl.id);
        });
        els.drawerMigrations.appendChild(btn);
      });
    } else {
      els.drawerMigrationsSection.hidden = true;
    }

    renderSelectedPeriod(emp, periods[Math.min(periodIdx, periods.length - 1)]);
    applyVisualDimming();
  }

  function renderSelectedPeriod(emp, period) {
    els.periodSpanBadge.textContent = formatSpan(period.startYear, period.endYear);
    els.mapCapitalValue.textContent = period.capital || emp.capital || '—';
    els.mapTerritoryDesc.textContent = `${period.territoryDesc || emp.sphere} ${period.highlights ? '— ' + period.highlights : ''}`;
    els.drawerSummary.textContent = emp.summary;

    renderTerritoryMap(els.territoryMapSvg, emp, period, {
      viewMode: state.mapViewMode,
      showRivers: state.mapShowRivers,
      showBorders: state.mapShowBorders,
      showLandmarks: state.mapShowLandmarks,
      idSuffix: 'drawer'
    });

    if (!els.mapModal.hidden) {
      syncMapModal(emp, period);
    }

    // Compute exact contemporary empires during THIS period!
    const contemps = EMPIRES.filter(
      (other) => other.id !== emp.id && other.startYear <= period.endYear && other.endYear >= period.startYear
    ).sort((a, b) => a.colStart - b.colStart);

    els.drawerContemporaries.innerHTML = '';
    contemps.forEach((c) => {
      const chip = document.createElement('button');
      chip.className = 'contemp-chip';
      chip.innerHTML = `<span class="contemp-dot" style="background:${c.color}"></span><span>${c.name.split('（')[0]}</span>`;
      chip.title = `${c.name} (${formatSpan(c.startYear, c.endYear)}) — 点击跳转`;
      chip.addEventListener('click', () => {
        const midY = Math.round((Math.max(c.startYear, period.startYear) + Math.min(c.endYear, period.endYear)) / 2);
        scrollToYear(midY, false);
        openEmpireDrawer(c.id);
      });
      els.drawerContemporaries.appendChild(chip);
    });
  }

  // Convert [lon, lat] ring into a smooth closed SVG quadratic spline path
  function geoRingToSmoothPath(ring) {
    const pts = ring.map(([lon, lat]) => window.projectLonLat(lon, lat));
    const n = pts.length;
    if (n < 3) return '';
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const start = mid(pts[n - 1], pts[0]);
    let d = `M ${start[0].toFixed(1)},${start[1].toFixed(1)}`;
    for (let i = 0; i < n; i++) {
      const curr = pts[i];
      const next = pts[(i + 1) % n];
      const m = mid(curr, next);
      d += ` Q ${curr[0].toFixed(1)},${curr[1].toFixed(1)} ${m[0].toFixed(1)},${m[1].toFixed(1)}`;
    }
    return d + ' Z';
  }

  function getPeriodTerritoryRings(emp, period) {
    const customMap = window.PERIOD_CUSTOM_TERRITORIES_GEO || {};
    const exactKey = `${emp.id}:${period.id}`;
    if (customMap[exactKey]) return customMap[exactKey];
    if (customMap[emp.id]) return customMap[emp.id];

    const regionMap = window.MAP_TERRITORY_POLYS_GEO || {};
    const rings = [];
    for (const key of (period.mapRegions || [])) {
      if (regionMap[key]) rings.push(regionMap[key]);
    }
    return rings;
  }

  function computeGeoViewBox(rings, capXY) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const ring of rings) {
      for (const [lon, lat] of ring) {
        const [x, y] = window.projectLonLat(lon, lat);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    if (capXY) {
      minX = Math.min(minX, capXY[0] - 12);
      maxX = Math.max(maxX, capXY[0] + 12);
      minY = Math.min(minY, capXY[1] - 8);
      maxY = Math.max(maxY, capXY[1] + 8);
    }
    if (!Number.isFinite(minX)) {
      return { x: 0, y: 0, w: 1000, h: 500, isGlobal: true };
    }

    const rawW = maxX - minX;
    const rawH = maxY - minY;
    // If empire spans transoceanic/global extent (e.g. British Empire, Colonial Americas), use full world
    if (rawW > 560 || rawH > 310) {
      return { x: 0, y: 0, w: 1000, h: 500, isGlobal: true };
    }

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    // Add generous geographic context padding and maintain 2:1 aspect ratio
    let w = Math.max(165, rawW * 1.85);
    let h = Math.max(82.5, rawH * 1.95);
    if (w / h > 2) {
      h = w / 2;
    } else {
      w = h * 2;
    }
    w = Math.min(1000, w);
    h = Math.min(500, h);

    let x = cx - w / 2;
    let y = cy - h / 2;
    x = Math.max(0, Math.min(1000 - w, x));
    y = Math.max(0, Math.min(500 - h, y));
    return { x, y, w, h, isGlobal: w >= 920 };
  }

  function renderTerritoryMap(svg, emp, period, opts) {
    const color = emp.color;
    const capitalName = period.capital || emp.capital || '';
    const capGeo = window.MAP_CAPITALS_GEO ? window.MAP_CAPITALS_GEO[capitalName] : null;
    const capXY = capGeo ? window.projectLonLat(capGeo[0], capGeo[1]) : null;
    const rings = getPeriodTerritoryRings(emp, period);

    const regionBox = computeGeoViewBox(rings, capXY);
    const useWorld = opts.viewMode === 'world' || regionBox.isGlobal;
    const vb = useWorld ? { x: 0, y: 0, w: 1000, h: 500 } : regionBox;

    svg.setAttribute('viewBox', `${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`);

    if (opts.idSuffix === 'drawer' && els.mapViewBadge) {
      if (regionBox.isGlobal) {
        els.mapViewBadge.textContent = '跨洲/全球版图 · 世界全景';
      } else if (useWorld) {
        els.mapViewBadge.textContent = '世界全景（虚线框为政权区域）';
      } else {
        const zoomFactor = (1000 / vb.w).toFixed(1);
        els.mapViewBadge.textContent = `区域高清地图 · ${zoomFactor}× 聚焦`;
      }
    }

    // Scale vector strokes & labels smoothly with zoom level!
    const s = vb.w / 1000;
    const clipId = `realLandClip-${opts.idSuffix}`;

    // Graticule lines every 30 deg lon / 20 deg lat
    let graticule = '';
    for (let lon = -150; lon <= 150; lon += 30) {
      const [gx] = window.projectLonLat(lon, 0);
      graticule += `<line x1="${gx.toFixed(1)}" y1="0" x2="${gx.toFixed(1)}" y2="500" />`;
    }
    for (let lat = -40; lat <= 60; lat += 20) {
      const [, gy] = window.projectLonLat(0, lat);
      graticule += `<line x1="0" y1="${gy.toFixed(1)}" x2="1000" y2="${gy.toFixed(1)}" />`;
    }

    // Territory paths fused inside a single land-clipped group (ZERO seam overlap + 50m real coastlines!)
    const territoryPaths = rings
      .map((r) => `<path d="${geoRingToSmoothPath(r)}" />`)
      .join('');

    // Rivers layer
    let riversSvg = '';
    if (opts.showRivers && window.WORLD_RIVERS) {
      riversSvg = `<g class="map-rivers-layer">${window.WORLD_RIVERS.map(
        (rv) => `<path class="map-river-path" d="${rv.d}" stroke-width="${(1.15 * s).toFixed(2)}" />`
      ).join('')}</g>`;
    }

    // Faint modern country borders for instant geographic recognition
    const bordersSvg = opts.showBorders && window.WORLD_BORDERS_PATH
      ? `<path class="map-border-path" d="${window.WORLD_BORDERS_PATH}" stroke-width="${(0.65 * s).toFixed(2)}" />`
      : '';

    // Sea / Ocean labels visible within current viewBox
    let waterLabelsSvg = '';
    if (window.WORLD_WATER_LABELS) {
      waterLabelsSvg = window.WORLD_WATER_LABELS.map((wl) => {
        const [wx, wy] = window.projectLonLat(wl.lon, wl.lat);
        if (wx < vb.x - 10 || wx > vb.x + vb.w + 10 || wy < vb.y - 10 || wy > vb.y + vb.h + 10) return '';
        const fontSize = (10.5 * wl.size * s).toFixed(2);
        return `<text class="map-water-label" x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" font-size="${fontSize}">${wl.name}</text>`;
      }).join('');
    }

    // World mode focus indicator box for regional empires
    const focusRectSvg = useWorld && !regionBox.isGlobal
      ? `<rect x="${regionBox.x.toFixed(1)}" y="${regionBox.y.toFixed(1)}" width="${regionBox.w.toFixed(1)}" height="${regionBox.h.toFixed(1)}" fill="none" stroke="var(--gold)" stroke-width="${(1.8 * s).toFixed(2)}" stroke-dasharray="${(5 * s).toFixed(1)} ${(3.5 * s).toFixed(1)}" rx="${(4 * s).toFixed(1)}" opacity="0.88" />`
      : '';

    // Capital city pin (scaled cleanly to current viewBox!)
    const placedBoxes = [];
    let capSvg = '';
    if (capXY) {
      const [cx, cy] = capXY;
      const rPulse1 = (6 * s).toFixed(2);
      const rPulse2 = (14 * s).toFixed(2);
      const rDot = (4.8 * s).toFixed(2);
      const fontSz = (15 * s).toFixed(2);
      const tagH = 23 * s;
      const tagW = Math.max(54, capitalName.length * 16.5 + 26) * s;
      const offsetX = cx + 10 * s + tagW > vb.x + vb.w ? -(tagW + 9 * s) : 9 * s;
      const tagX = cx + offsetX;
      const tagY = cy - tagH / 2;
      placedBoxes.push({ x: tagX, y: tagY, w: tagW, h: tagH });
      placedBoxes.push({ x: cx - 7 * s, y: cy - 7 * s, w: 14 * s, h: 14 * s });

      capSvg = `
        <g>
          <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rPulse1}" fill="${color}" fill-opacity="0.34">
            <animate attributeName="r" values="${rPulse1};${rPulse2};${rPulse1}" dur="2.2s" repeatCount="indefinite" />
          </circle>
          <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rDot}" fill="#fff" stroke="#1c1712" stroke-width="${(2 * s).toFixed(2)}" />
          <rect x="${tagX.toFixed(1)}" y="${tagY.toFixed(1)}" width="${tagW.toFixed(1)}" height="${tagH.toFixed(1)}" rx="${(5 * s).toFixed(1)}" fill="rgba(22,18,14,0.88)" stroke="rgba(255,255,255,0.3)" stroke-width="${(0.9 * s).toFixed(2)}" />
          <text x="${(tagX + 7 * s).toFixed(1)}" y="${(cy + 5.2 * s).toFixed(1)}" font-size="${fontSz}" font-weight="700" fill="#fff">★ ${capitalName}</text>
        </g>
      `;
    }

    // Strategic Passes, Valleys, Straits & Geographic Landmarks Layer
    let landmarksSvg = '';
    if (opts.showLandmarks !== false) {
      const empLandmarks = getEmpireLandmarks(emp.id);
      const boxesOverlap = (a, b) =>
        !(a.x + a.w + 2 * s < b.x || b.x + b.w + 2 * s < a.x || a.y + a.h + 2 * s < b.y || b.y + b.h + 2 * s < a.y);
      const inView = (box) =>
        box.x >= vb.x + 2 * s && box.x + box.w <= vb.x + vb.w - 2 * s && box.y >= vb.y + 2 * s && box.y + box.h <= vb.y + vb.h - 2 * s;

      landmarksSvg = empLandmarks.map((lm) => {
        const [lx, ly] = window.projectLonLat(lm.lon, lm.lat);
        if (lx < vb.x - 10 * s || lx > vb.x + vb.w + 10 * s || ly < vb.y - 10 * s || ly > vb.y + vb.h + 10 * s) {
          return '';
        }
        const pinColor = getLandmarkTypeColor(lm.type);
        const triSize = 5.2 * s;
        const triPoints = `${lx.toFixed(1)},${(ly - triSize).toFixed(1)} ${(lx - triSize * 0.92).toFixed(1)},${(ly + triSize * 0.72).toFixed(1)} ${(lx + triSize * 0.92).toFixed(1)},${(ly + triSize * 0.72).toFixed(1)}`;
        const fontSz = 11.8 * s;
        const tagH = 18.5 * s;
        const labelText = lm.shortName;
        const tagW = Math.max(46, labelText.length * 12.6 + 16) * s;

        const candidates = [
          { x: lx + 8 * s, y: ly - tagH / 2 },
          { x: lx - tagW - 8 * s, y: ly - tagH / 2 },
          { x: lx - tagW / 2, y: ly + 8 * s },
          { x: lx - tagW / 2, y: ly - tagH - 8 * s },
          { x: lx + 8 * s, y: ly + 6 * s },
          { x: lx - tagW - 8 * s, y: ly - tagH - 6 * s }
        ];
        let chosen = candidates[0];
        for (const c of candidates) {
          const box = { x: c.x, y: c.y, w: tagW, h: tagH };
          if (inView(box) && !placedBoxes.some((pb) => boxesOverlap(box, pb))) {
            chosen = c;
            break;
          }
        }
        const finalX = Math.max(vb.x + 2 * s, Math.min(vb.x + vb.w - tagW - 2 * s, chosen.x));
        const finalY = Math.max(vb.y + 2 * s, Math.min(vb.y + vb.h - tagH - 2 * s, chosen.y));
        placedBoxes.push({ x: finalX, y: finalY, w: tagW, h: tagH });
        placedBoxes.push({ x: lx - triSize, y: ly - triSize, w: triSize * 2, h: triSize * 2 });

        const safeTitle = `${lm.name}（${lm.type}）：${lm.desc}`.replace(/"/g, '&quot;');
        return `
          <g class="map-landmark-group">
            <title>${safeTitle}</title>
            <line x1="${lx.toFixed(1)}" y1="${ly.toFixed(1)}" x2="${(finalX + tagW / 2).toFixed(1)}" y2="${(finalY + tagH / 2).toFixed(1)}" stroke="${pinColor}" stroke-width="${(0.9 * s).toFixed(2)}" stroke-dasharray="${(2 * s).toFixed(1)} ${(1.5 * s).toFixed(1)}" opacity="0.65" />
            <polygon points="${triPoints}" fill="${pinColor}" stroke="#fff" stroke-width="${(1.5 * s).toFixed(2)}" stroke-linejoin="round" />
            <rect x="${finalX.toFixed(1)}" y="${finalY.toFixed(1)}" width="${tagW.toFixed(1)}" height="${tagH.toFixed(1)}" rx="${(4 * s).toFixed(1)}" fill="rgba(251,249,244,0.93)" stroke="${pinColor}" stroke-width="${(1.1 * s).toFixed(2)}" />
            <text x="${(finalX + 6 * s).toFixed(1)}" y="${(finalY + tagH * 0.72).toFixed(1)}" font-size="${fontSz.toFixed(2)}" font-weight="700" fill="${pinColor}">▲ ${labelText}</text>
          </g>
        `;
      }).join('');
    }

    svg.innerHTML = `
      <defs>
        <clipPath id="${clipId}">
          <path d="${window.WORLD_LAND_PATH}" />
        </clipPath>
      </defs>
      <g opacity="0.22" stroke="var(--map-land-stroke)" stroke-width="${(0.55 * s).toFixed(2)}" stroke-dasharray="${(3 * s).toFixed(1)} ${(3 * s).toFixed(1)}">
        ${graticule}
      </g>
      ${waterLabelsSvg}
      <path class="map-land-path" d="${window.WORLD_LAND_PATH}" stroke-width="${(0.72 * s).toFixed(2)}" />
      <g clip-path="url(#${clipId})">
        <g fill="${color}" opacity="0.72">
          ${territoryPaths}
        </g>
        <g fill="none" stroke="${color}" stroke-width="${(2.6 * s).toFixed(2)}" opacity="0.92">
          ${territoryPaths}
        </g>
        ${bordersSvg}
        ${riversSvg}
      </g>
      <path d="${window.WORLD_LAND_PATH}" fill="none" stroke="var(--map-land-stroke)" stroke-width="${(0.75 * s).toFixed(2)}" opacity="0.75" />
      ${focusRectSvg}
      ${landmarksSvg}
      ${capSvg}
    `;
  }

  function setMapViewMode(mode) {
    state.mapViewMode = mode;
    els.mapModeRegionBtn.classList.toggle('active', mode === 'region');
    els.mapModeWorldBtn.classList.toggle('active', mode === 'world');
    els.modalMapRegionBtn.classList.toggle('active', mode === 'region');
    els.modalMapWorldBtn.classList.toggle('active', mode === 'world');
    refreshCurrentEmpireMap();
  }

  function refreshCurrentEmpireMap() {
    if (!state.selectedEmpireId) return;
    const emp = getEmpireById(state.selectedEmpireId);
    if (!emp) return;
    const periods = emp.periods && emp.periods.length ? emp.periods : [{
      id: 'default', name: '全时期', startYear: emp.startYear, endYear: emp.endYear,
      capital: emp.capital, territoryDesc: emp.sphere, mapRegions: [], highlights: emp.summary
    }];
    const period = periods[Math.min(state.selectedPeriodIdx, periods.length - 1)];
    renderTerritoryMap(els.territoryMapSvg, emp, period, {
      viewMode: state.mapViewMode,
      showRivers: state.mapShowRivers,
      showBorders: state.mapShowBorders,
      showLandmarks: state.mapShowLandmarks,
      idSuffix: 'drawer'
    });
    if (!els.mapModal.hidden) {
      syncMapModal(emp, period);
    }
  }

  function openMapModal() {
    if (!state.selectedEmpireId) return;
    const emp = getEmpireById(state.selectedEmpireId);
    if (!emp) return;
    const periods = emp.periods && emp.periods.length ? emp.periods : [{
      id: 'default', name: '全时期', startYear: emp.startYear, endYear: emp.endYear,
      capital: emp.capital, territoryDesc: emp.sphere, mapRegions: [], highlights: emp.summary
    }];
    els.mapModal.hidden = false;
    els.mapModalTitle.textContent = `${emp.name} · 历史版图详图`;

    els.mapModalPeriods.innerHTML = '';
    periods.forEach((p, idx) => {
      const btn = document.createElement('button');
      btn.className = `period-tab${idx === state.selectedPeriodIdx ? ' active' : ''}`;
      btn.textContent = `${p.name}（${formatSpan(p.startYear, p.endYear)}）`;
      btn.addEventListener('click', () => {
        state.selectedPeriodIdx = idx;
        els.periodTabs.querySelectorAll('.period-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
        renderSelectedPeriod(emp, periods[idx]);
      });
      els.mapModalPeriods.appendChild(btn);
    });

    syncMapModal(emp, periods[Math.min(state.selectedPeriodIdx, periods.length - 1)]);
  }

  function syncMapModal(emp, period) {
    els.mapModalSub.textContent = `${period.name}（${formatSpan(period.startYear, period.endYear)}）· 都城：${period.capital || emp.capital || '—'} · Natural Earth 50m 海岸线`;
    els.mapModalCaption.textContent = `${period.territoryDesc || emp.sphere}${period.highlights ? ' — ' + period.highlights : ''}`;
    els.mapModalPeriods.querySelectorAll('.period-tab').forEach((t, i) => {
      t.classList.toggle('active', i === state.selectedPeriodIdx);
    });
    renderTerritoryMap(els.modalTerritoryMapSvg, emp, period, {
      viewMode: state.mapViewMode,
      showRivers: state.mapShowRivers,
      showBorders: state.mapShowBorders,
      showLandmarks: state.mapShowLandmarks,
      idSuffix: 'modal'
    });
  }

  function closeEmpireDrawer() {
    state.selectedEmpireId = null;
    els.detailDrawer.classList.remove('open');
    els.detailDrawer.setAttribute('aria-hidden', 'true');
    applyVisualDimming();
  }

  /* ------------------------------------------------------------------------
     Migration & Influence Flows SVG Overlay + Interactive Stepper
     ------------------------------------------------------------------------ */

  function renderFlowSelector() {
    els.flowSelectorList.innerHTML = '';
    FLOWS.forEach((fl) => {
      const btn = document.createElement('button');
      btn.className = 'flow-pill';
      btn.dataset.flowId = fl.id;
      btn.innerHTML = `<span class="flow-color-dot" style="background:${fl.color}"></span><span>${fl.shortName}</span>`;
      btn.addEventListener('click', () => selectFlow(fl.id));
      els.flowSelectorList.appendChild(btn);
    });
  }

  function openFlowsPanel(initialFlowId) {
    els.factsPanel.hidden = true;
    els.factsToggleBtn.classList.remove('active');
    state.activeFactId = null;
    renderFactSpotlight();

    els.flowsPanel.hidden = false;
    els.flowsToggleBtn.classList.add('active');
    selectFlow(initialFlowId || state.activeFlowId || FLOWS[0].id);
  }

  function closeFlowsPanel() {
    els.flowsPanel.hidden = true;
    els.flowsToggleBtn.classList.remove('active');
    state.activeFlowId = null;
    state.showAllFlows = false;
    els.showAllFlowsCheckbox.checked = false;
    renderFlowsOverlay();
    applyVisualDimming();
  }

  function selectFlow(flowId) {
    state.activeFlowId = flowId;
    state.activeFlowStepIdx = 0;

    els.flowSelectorList.querySelectorAll('.flow-pill').forEach((p) => {
      p.classList.toggle('active', p.dataset.flowId === flowId);
    });

    const fl = FLOWS.find((f) => f.id === flowId);
    if (!fl) return;

    els.flowStoryBox.hidden = false;
    els.flowStoryTitle.textContent = fl.name;
    els.flowStoryTitle.style.color = fl.color;
    els.flowStorySummary.textContent = fl.summary;

    renderFlowSteps(fl);
    renderFlowsOverlay();
    applyVisualDimming();
    focusFlowStep(0);
  }

  function renderFlowSteps(fl) {
    els.flowStepsTimeline.innerHTML = '';
    fl.steps.forEach((st, idx) => {
      const card = document.createElement('div');
      card.className = `flow-step-card${idx === state.activeFlowStepIdx ? ' active' : ''}`;
      card.innerHTML = `
        <div class="flow-step-year">${idx + 1}. ${formatYear(st.year)}</div>
        <div class="flow-step-title">${st.title}</div>
        <div class="flow-step-desc">${st.desc}</div>
      `;
      card.addEventListener('click', () => focusFlowStep(idx));
      els.flowStepsTimeline.appendChild(card);
    });
  }

  function focusFlowStep(idx, instant = false) {
    const fl = FLOWS.find((f) => f.id === state.activeFlowId);
    if (!fl) return;
    state.activeFlowStepIdx = (idx + fl.steps.length) % fl.steps.length;
    const step = fl.steps[state.activeFlowStepIdx];

    els.flowStepCounter.textContent = `${state.activeFlowStepIdx + 1} / ${fl.steps.length}`;
    els.flowStepsTimeline.querySelectorAll('.flow-step-card').forEach((c, i) => {
      c.classList.toggle('active', i === state.activeFlowStepIdx);
    });

    scrollToYear(step.year, false, instant);
    renderFlowsOverlay();
  }

  function renderFlowsOverlay() {
    const svg = els.flowsSvg;
    const width = els.timelineStage.clientWidth || 1300;
    svg.setAttribute('width', String(width));
    svg.setAttribute('viewBox', `0 0 ${width} ${state.stageHeight}`);

    const flowsToDraw = state.showAllFlows
      ? FLOWS
      : state.activeFlowId
        ? FLOWS.filter((f) => f.id === state.activeFlowId)
        : [];

    if (!flowsToDraw.length) {
      svg.innerHTML = '';
      return;
    }

    let defs = '<defs>';
    flowsToDraw.forEach((fl) => {
      defs += `
        <marker id="arrow-${fl.id}" markerWidth="10" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L10,4 L0,8 L2.5,4 Z" fill="${fl.color}" />
        </marker>
      `;
    });
    defs += '</defs>';

    let content = '';
    flowsToDraw.forEach((fl) => {
      const isPrimary = fl.id === state.activeFlowId;
      const strokeW = isPrimary ? 4 : 2.6;
      const opacity = isPrimary || !state.activeFlowId ? 0.95 : 0.45;

      const pts = fl.steps.map((st) => ({
        x: (colToPct(st.col) / 100) * width,
        y: yearToY(st.year),
        step: st
      }));

      // Draw curved paths between sequential / branched steps
      for (let i = 1; i < pts.length; i++) {
        const fromIdx = typeof pts[i].step.branchFromStep === 'number' ? pts[i].step.branchFromStep : i - 1;
        const p1 = pts[fromIdx];
        const p2 = pts[i];
        const midX = (p1.x + p2.x) / 2;
        const ctrlY1 = p1.y + (p2.y - p1.y) * 0.45;
        const ctrlY2 = p2.y - (p2.y - p1.y) * 0.35;
        const d = `M ${p1.x},${p1.y} C ${midX},${ctrlY1} ${midX},${ctrlY2} ${p2.x},${p2.y}`;

        content += `<path class="flow-path-bg" d="${d}" stroke-width="${strokeW + 3}" opacity="${opacity * 0.8}" />`;
        content += `<path class="flow-path-line" d="${d}" stroke="${fl.color}" stroke-width="${strokeW}" opacity="${opacity}" marker-end="url(#arrow-${fl.id})" />`;
      }

      // Draw interactive milestone nodes
      pts.forEach((p, idx) => {
        const isActiveNode = isPrimary && idx === state.activeFlowStepIdx;
        const r = isActiveNode ? 9 : 6;
        const label = `${idx + 1}. ${p.step.title.split('（')[0]}`;
        const labelW = Math.min(220, label.length * 10.5 + 16);
        const labelX = p.x + 12 + labelW > width ? p.x - labelW - 12 : p.x + 12;

        content += `
          <g class="flow-node-group" data-flow-id="${fl.id}" data-step-idx="${idx}">
            ${isActiveNode ? `<circle cx="${p.x}" cy="${p.y}" r="16" fill="${fl.color}" fill-opacity="0.24" />` : ''}
            <circle class="flow-node-circle" cx="${p.x}" cy="${p.y}" r="${r}" fill="${fl.color}" stroke="#fff" stroke-width="2.2" />
            ${isPrimary ? `
              <rect class="flow-node-label-bg" x="${labelX}" y="${p.y - 12}" width="${labelW}" height="22" stroke="${fl.color}" />
              <text class="flow-node-label-text" x="${labelX + 8}" y="${p.y + 3}">${label}</text>
            ` : ''}
          </g>
        `;
      });
    });

    svg.innerHTML = defs + content;

    svg.querySelectorAll('.flow-node-group').forEach((g) => {
      g.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const fid = g.dataset.flowId;
        const sidx = Number(g.dataset.stepIdx);
        if (fid !== state.activeFlowId) selectFlow(fid);
        focusFlowStep(sidx);
        const fl = FLOWS.find((f) => f.id === fid);
        if (fl && fl.steps[sidx] && fl.steps[sidx].empireId) {
          openEmpireDrawer(fl.steps[sidx].empireId);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     Mind-Blowing Counter-Intuitive Facts Panel & Spotlight
     ------------------------------------------------------------------------ */

  function renderFactsGrid() {
    els.factsGrid.innerHTML = '';
    FACTS.forEach((fact) => {
      const card = document.createElement('div');
      card.className = `fact-card${fact.id === state.activeFactId ? ' active' : ''}`;
      card.dataset.factId = fact.id;
      card.innerHTML = `
        <span class="fact-card-tag">✦ ${fact.tag}</span>
        <div class="fact-card-title">${fact.title}</div>
        <div class="fact-card-body">${fact.shortDesc}</div>
      `;
      card.addEventListener('click', () => activateFact(fact.id));
      els.factsGrid.appendChild(card);
    });
  }

  function openFactsPanel() {
    els.flowsPanel.hidden = true;
    els.flowsToggleBtn.classList.remove('active');
    state.activeFlowId = null;
    state.showAllFlows = false;
    renderFlowsOverlay();

    els.factsPanel.hidden = false;
    els.factsToggleBtn.classList.add('active');
    if (!state.activeFactId) {
      activateFact(FACTS[0].id);
    }
  }

  function closeFactsPanel() {
    els.factsPanel.hidden = true;
    els.factsToggleBtn.classList.remove('active');
    state.activeFactId = null;
    renderFactSpotlight();
    applyVisualDimming();
  }

  function activateFact(factId, instant = false) {
    const fact = FACTS.find((f) => f.id === factId);
    if (!fact) return;
    state.activeFactId = factId;

    els.factsGrid.querySelectorAll('.fact-card').forEach((c) => {
      c.classList.toggle('active', c.dataset.factId === factId);
    });

    if (fact.recommendLinear && state.scaleMode !== 'linear') {
      setScaleMode('linear', false);
    } else if (!fact.recommendLinear && state.scaleMode === 'linear') {
      setScaleMode('adaptive', false);
    }

    renderFactSpotlight();
    applyVisualDimming();
    scrollToYear(fact.focusYear, false, instant);
    pinYear(fact.focusYear);
  }

  function stepFact(delta) {
    const idx = FACTS.findIndex((f) => f.id === state.activeFactId);
    const nextIdx = (idx === -1 ? 0 : idx + delta + FACTS.length) % FACTS.length;
    activateFact(FACTS[nextIdx].id);
  }

  function renderFactSpotlight() {
    els.factSpotlightLayer.innerHTML = '';
    const fact = FACTS.find((f) => f.id === state.activeFactId);
    if (!fact) return;

    const top = yearToY(fact.bandStart);
    const bottom = yearToY(fact.bandEnd);
    const band = document.createElement('div');
    band.className = 'fact-band';
    band.style.top = `${top}px`;
    band.style.height = `${Math.max(24, bottom - top)}px`;

    const callout = document.createElement('div');
    callout.className = 'fact-callout-box';
    callout.style.top = `${Math.max(12, top + 8)}px`;
    callout.innerHTML = `
      <div class="fact-callout-title">✦ ${fact.title}</div>
      <div class="fact-callout-desc">${fact.detail}</div>
    `;

    els.factSpotlightLayer.appendChild(band);
    els.factSpotlightLayer.appendChild(callout);
  }

  /* ------------------------------------------------------------------------
     Live Chrono-Slice Scanner & Contemporary Ribbon
     ------------------------------------------------------------------------ */

  function updateChronoRibbon(year) {
    els.ribbonYear.textContent = formatYear(year);
    const era = getEraForYear(year);
    els.ribbonEraName.textContent = era ? era.short : '';

    const alive = EMPIRES.filter((e) => year >= e.startYear && year <= e.endYear)
      .sort((a, b) => a.colStart - b.colStart);

    els.ribbonEmpires.innerHTML = '';
    if (!alive.length) {
      els.ribbonEmpires.innerHTML = '<span style="font-size:12px;color:var(--text-muted)">该年份尚处于早期文明萌芽阶段</span>';
      return;
    }

    alive.forEach((emp) => {
      const chip = document.createElement('button');
      chip.className = 'ribbon-chip';
      chip.innerHTML = `<span class="contemp-dot" style="background:${emp.color}"></span><span>${emp.name.split('（')[0]}</span>`;
      chip.addEventListener('click', () => openEmpireDrawer(emp.id));
      els.ribbonEmpires.appendChild(chip);
    });
  }

  function pinYear(year) {
    state.pinnedYear = Math.max(MIN_YEAR, Math.min(MAX_YEAR, year));
    els.pinnedScanner.hidden = false;
    els.unpinYearBtn.hidden = false;
    els.pinYearBtn.textContent = '📌 已锁定同期切片';
    updatePinnedScannerPosition();
    updateChronoRibbon(state.pinnedYear);
  }

  function unpinYear() {
    state.pinnedYear = null;
    els.pinnedScanner.hidden = true;
    els.unpinYearBtn.hidden = true;
    els.pinYearBtn.textContent = '📌 移动鼠标扫描同期世界';
  }

  function updatePinnedScannerPosition() {
    if (state.pinnedYear === null) return;
    const y = yearToY(state.pinnedYear);
    els.pinnedScanner.style.top = `${y}px`;
    els.pinnedYearPill.textContent = `📌 ${formatYear(state.pinnedYear)}`;
  }

  /* ------------------------------------------------------------------------
     Side-by-Side Empire Comparison Modal
     ------------------------------------------------------------------------ */

  function renderCompareSelectors() {
    const opts = EMPIRES.map((e) => `<option value="${e.id}">${e.name} (${formatSpan(e.startYear, e.endYear)})</option>`).join('');
    els.compareSelectA.innerHTML = opts;
    els.compareSelectB.innerHTML = opts;
    els.compareSelectA.value = state.compareIds[0];
    els.compareSelectB.value = state.compareIds[1];
  }

  function openCompareModal(addEmpireId) {
    if (addEmpireId) {
      if (state.compareIds[0] !== addEmpireId) {
        state.compareIds = [addEmpireId, state.compareIds[0]];
      }
      els.compareSelectA.value = state.compareIds[0];
      els.compareSelectB.value = state.compareIds[1];
    }
    els.compareModal.hidden = false;
    renderComparison();
  }

  function renderComparison() {
    const a = getEmpireById(els.compareSelectA.value);
    const b = getEmpireById(els.compareSelectB.value);
    if (!a || !b) return;
    state.compareIds = [a.id, b.id];

    const overlapStart = Math.max(a.startYear, b.startYear);
    const overlapEnd = Math.min(a.endYear, b.endYear);
    const overlapYears = overlapEnd - overlapStart;

    let verdict = '';
    if (overlapYears >= 0) {
      verdict = `⚡ <strong>时空交集！</strong>「${a.name}」与「${b.name}」在历史上<strong>同时存在了约 ${Math.max(1, overlapYears)} 年</strong>（${formatSpan(overlapStart, overlapEnd)}）！`;
    } else {
      const gap = Math.abs(overlapYears);
      const earlier = a.endYear < b.startYear ? a : b;
      const later = earlier === a ? b : a;
      verdict = `⏳ <strong>跨越时空：</strong>「${earlier.name}」灭亡约 <strong>${gap} 年</strong>后，「${later.name}」才正式登上历史舞台。`;
    }

    const minY = Math.min(a.startYear, b.startYear);
    const maxY = Math.max(a.endYear, b.endYear);
    const span = Math.max(1, maxY - minY);
    const pct = (y) => ((y - minY) / span) * 100;

    els.compareContent.innerHTML = `
      <div class="compare-verdict">${verdict}</div>
      <div class="compare-bars">
        <div class="compare-bar-row">
          <div class="compare-bar-label">
            <strong>${a.name}</strong>
            <span>${formatSpan(a.startYear, a.endYear)}（存续约 ${a.endYear - a.startYear} 年）</span>
          </div>
          <div class="compare-bar-track">
            <div class="compare-bar-fill" style="left:${pct(a.startYear)}%;width:${Math.max(1.5, pct(a.endYear) - pct(a.startYear))}%;background:${a.color}"></div>
          </div>
        </div>
        <div class="compare-bar-row">
          <div class="compare-bar-label">
            <strong>${b.name}</strong>
            <span>${formatSpan(b.startYear, b.endYear)}（存续约 ${b.endYear - b.startYear} 年）</span>
          </div>
          <div class="compare-bar-track">
            <div class="compare-bar-fill" style="left:${pct(b.startYear)}%;width:${Math.max(1.5, pct(b.endYear) - pct(b.startYear))}%;background:${b.color}"></div>
          </div>
        </div>
      </div>
      <div class="compare-columns">
        ${[a, b].map((emp) => {
          const enrich = getEmpireEnrichment(emp.id);
          const lms = getEmpireLandmarks(emp.id);
          return `
          <div class="compare-col">
            <h4 style="border-left:4px solid ${emp.color};padding-left:8px;">${emp.name}</h4>
            ${enrich && enrich.nameOrigin ? `<div class="compare-row"><strong>名称由来与释义</strong>${enrich.nameOrigin}</div>` : ''}
            <div class="compare-row"><strong>势力范围与都城</strong>${emp.sphere}（代表都城：${emp.capital}）</div>
            ${lms.length ? `<div class="compare-row"><strong>标志性关隘与地形</strong>${lms.map((l) => `${l.name}（${l.type}）`).join('；')}</div>` : ''}
            <div class="compare-row"><strong>文明与科技成就</strong>${emp.civilization}</div>
            <div class="compare-row"><strong>宗教与思想</strong>${emp.religionDetail}</div>
            <div class="compare-row"><strong>核心人物</strong>${(emp.keyFigures || []).map((f) => f.name).join('、')}</div>
          </div>
        `;
        }).join('')}
      </div>
    `;
  }

  /* ------------------------------------------------------------------------
     Search, Scrolling, Scale Switching & Minimap
     ------------------------------------------------------------------------ */

  function scrollToYear(year, shouldPin, instant = false) {
    const y = yearToY(year);
    const targetTop = Math.max(0, y - els.chartViewport.clientHeight * 0.28);
    if (instant) {
      els.chartViewport.scrollTop = targetTop;
    } else {
      els.chartViewport.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
    if (shouldPin) pinYear(year);
  }

  function setScaleMode(mode, keepCenterYear = true) {
    const centerYear = keepCenterYear
      ? yToYear(els.chartViewport.scrollTop + els.chartViewport.clientHeight * 0.4)
      : null;

    state.scaleMode = mode;
    els.scaleAdaptiveBtn.classList.toggle('active', mode === 'adaptive');
    els.scaleLinearBtn.classList.toggle('active', mode === 'linear');

    renderTimeline();

    if (centerYear !== null) {
      const nextY = yearToY(centerYear);
      els.chartViewport.scrollTop = Math.max(0, nextY - els.chartViewport.clientHeight * 0.4);
    }
  }

  function setZoom(nextZoom) {
    const centerYear = yToYear(els.chartViewport.scrollTop + els.chartViewport.clientHeight * 0.4);
    state.zoom = Math.max(0.6, Math.min(2.6, Math.round(nextZoom * 10) / 10));
    renderTimeline();
    const nextY = yearToY(centerYear);
    els.chartViewport.scrollTop = Math.max(0, nextY - els.chartViewport.clientHeight * 0.4);
  }

  function updateMinimapViewport() {
    const scrollH = els.chartViewport.scrollHeight || 1;
    const viewH = els.chartViewport.clientHeight || 1;
    const topPct = (els.chartViewport.scrollTop / scrollH) * 100;
    const heightPct = Math.max(5, (viewH / scrollH) * 100);
    els.minimapViewport.style.top = `${topPct}%`;
    els.minimapViewport.style.height = `${heightPct}%`;
  }

  function runSearch(query) {
    const q = query.trim().toLowerCase();
    els.searchClear.hidden = !q;
    if (!q) {
      els.searchDropdown.hidden = true;
      return;
    }

    const matches = EMPIRES.filter((e) => {
      const enrich = getEmpireEnrichment(e.id);
      const lms = getEmpireLandmarks(e.id);
      const hay = [
        e.name, e.enName, e.sphere, e.summary, e.civilization, e.religionDetail,
        enrich && enrich.nameOrigin ? enrich.nameOrigin : '',
        ...(enrich && enrich.funEvents ? enrich.funEvents : []),
        ...lms.map((l) => `${l.name} ${l.type} ${l.desc}`),
        ...(e.religionTags || []),
        ...(e.keyFigures || []).map((f) => `${f.name} ${f.note}`),
        ...(e.periods || []).map((p) => `${p.name} ${p.territoryDesc}`)
      ].join(' ').toLowerCase();
      return hay.includes(q);
    }).slice(0, 12);

    const rect = els.searchInput.getBoundingClientRect();
    els.searchDropdown.style.left = `${Math.max(10, rect.left - 18)}px`;
    els.searchDropdown.hidden = false;

    if (!matches.length) {
      els.searchDropdown.innerHTML = '<div style="padding:12px;font-size:12px;color:var(--text-muted)">未找到匹配的历史政权、关隘或名号释义，试试“开伯尔”“函谷关”“独孤”“西汉”“凯撒”</div>';
      return;
    }

    els.searchDropdown.innerHTML = '';
    matches.forEach((emp) => {
      const item = document.createElement('div');
      item.className = 'search-item';
      item.innerHTML = `
        <div class="search-item-main">
          <span class="search-dot" style="background:${emp.color}"></span>
          <span class="search-item-title">${emp.name}</span>
        </div>
        <span class="search-item-meta">${formatSpan(emp.startYear, emp.endYear)}</span>
      `;
      item.addEventListener('click', () => {
        els.searchDropdown.hidden = true;
        const mid = Math.round((emp.startYear + emp.endYear) / 2);
        scrollToYear(mid, false);
        openEmpireDrawer(emp.id);
      });
      els.searchDropdown.appendChild(item);
    });
  }

  function handleYearJump() {
    const raw = els.yearJumpInput.value.trim();
    if (!raw) return;
    let parsed = Number(raw.replace(/公元前|前|bce|bc/gi, '-').replace(/[^0-9-]/g, ''));
    if (Number.isNaN(parsed)) return;
    parsed = Math.max(MIN_YEAR, Math.min(MAX_YEAR, parsed));
    scrollToYear(parsed, true);
  }

  /* ------------------------------------------------------------------------
     Event Bindings & Initialization
     ------------------------------------------------------------------------ */

  function bindEvents() {
    els.scaleAdaptiveBtn.addEventListener('click', () => setScaleMode('adaptive'));
    els.scaleLinearBtn.addEventListener('click', () => setScaleMode('linear'));
    els.backToAdaptiveBtn.addEventListener('click', () => setScaleMode('adaptive'));

    els.zoomInBtn.addEventListener('click', () => setZoom(state.zoom + 0.2));
    els.zoomOutBtn.addEventListener('click', () => setZoom(state.zoom - 0.2));

    els.themeToggleBtn.addEventListener('click', () => {
      state.theme = state.theme === 'archival' ? 'dark' : 'archival';
      document.body.setAttribute('data-theme', state.theme);
      renderFlowsOverlay();
    });

    // Search
    els.searchInput.addEventListener('input', (e) => runSearch(e.target.value));
    els.searchInput.addEventListener('focus', (e) => { if (e.target.value.trim()) runSearch(e.target.value); });
    els.searchClear.addEventListener('click', () => {
      els.searchInput.value = '';
      runSearch('');
      els.searchInput.focus();
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-box')) els.searchDropdown.hidden = true;
    });

    // Year Jumper
    els.yearJumpBtn.addEventListener('click', handleYearJump);
    els.yearJumpInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleYearJump(); });

    // Chrono-slice hover & click to pin
    els.timelineStage.addEventListener('mousemove', (e) => {
      const rect = els.timelineStage.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const year = yToYear(y);
      state.hoverYear = year;
      els.chronoScanner.hidden = false;
      els.chronoScanner.style.top = `${y}px`;
      els.scannerYearPill.textContent = formatYear(year);
      if (state.pinnedYear === null) {
        updateChronoRibbon(year);
      }
    });

    els.timelineStage.addEventListener('mouseleave', () => {
      els.chronoScanner.hidden = true;
    });

    els.timelineStage.addEventListener('click', (e) => {
      if (e.target.closest('.empire-block')) return;
      const rect = els.timelineStage.getBoundingClientRect();
      const year = yToYear(e.clientY - rect.top);
      pinYear(year);
    });

    els.pinYearBtn.addEventListener('click', () => {
      if (state.pinnedYear !== null) {
        unpinYear();
      } else {
        pinYear(state.hoverYear);
      }
    });
    els.unpinYearBtn.addEventListener('click', unpinYear);

    // Drawer
    els.drawerCloseBtn.addEventListener('click', closeEmpireDrawer);
    els.drawerCompareBtn.addEventListener('click', () => openCompareModal(state.selectedEmpireId));

    // Map Controls & High-Res Map Modal
    els.mapModeRegionBtn.addEventListener('click', () => setMapViewMode('region'));
    els.mapModeWorldBtn.addEventListener('click', () => setMapViewMode('world'));
    els.modalMapRegionBtn.addEventListener('click', () => setMapViewMode('region'));
    els.modalMapWorldBtn.addEventListener('click', () => setMapViewMode('world'));
    els.mapExpandBtn.addEventListener('click', openMapModal);
    els.territoryMapSvg.style.cursor = 'zoom-in';
    els.territoryMapSvg.addEventListener('click', openMapModal);
    els.closeMapModalBtn.addEventListener('click', () => { els.mapModal.hidden = true; });
    els.mapModal.addEventListener('click', (e) => {
      if (e.target === els.mapModal) els.mapModal.hidden = true;
    });
    els.modalLandmarksToggle.addEventListener('change', (e) => {
      state.mapShowLandmarks = e.target.checked;
      refreshCurrentEmpireMap();
    });
    els.modalRiversToggle.addEventListener('change', (e) => {
      state.mapShowRivers = e.target.checked;
      refreshCurrentEmpireMap();
    });
    els.modalBordersToggle.addEventListener('change', (e) => {
      state.mapShowBorders = e.target.checked;
      refreshCurrentEmpireMap();
    });

    // Flows Panel
    els.flowsToggleBtn.addEventListener('click', () => {
      if (els.flowsPanel.hidden) openFlowsPanel();
      else closeFlowsPanel();
    });
    els.closeFlowsPanelBtn.addEventListener('click', closeFlowsPanel);
    els.showAllFlowsCheckbox.addEventListener('change', (e) => {
      state.showAllFlows = e.target.checked;
      renderFlowsOverlay();
      applyVisualDimming();
    });
    els.flowPrevStepBtn.addEventListener('click', () => focusFlowStep(state.activeFlowStepIdx - 1));
    els.flowNextStepBtn.addEventListener('click', () => focusFlowStep(state.activeFlowStepIdx + 1));

    // Facts Panel
    els.factsToggleBtn.addEventListener('click', () => {
      if (els.factsPanel.hidden) openFactsPanel();
      else closeFactsPanel();
    });
    els.closeFactsPanelBtn.addEventListener('click', closeFactsPanel);
    els.prevFactBtn.addEventListener('click', () => stepFact(-1));
    els.nextFactBtn.addEventListener('click', () => stepFact(1));

    // Compare Modal
    els.compareToggleBtn.addEventListener('click', () => openCompareModal());
    els.closeCompareModalBtn.addEventListener('click', () => { els.compareModal.hidden = true; });
    els.compareModal.addEventListener('click', (e) => {
      if (e.target === els.compareModal) els.compareModal.hidden = true;
    });
    els.compareSelectA.addEventListener('change', renderComparison);
    els.compareSelectB.addEventListener('change', renderComparison);

    // Scroll & Minimap interaction
    els.chartViewport.addEventListener('scroll', updateMinimapViewport);
    els.minimapTrack.addEventListener('click', (e) => {
      const rect = els.minimapTrack.getBoundingClientRect();
      const ratio = (e.clientY - rect.top) / rect.height;
      els.chartViewport.scrollTo({
        top: Math.max(0, ratio * els.chartViewport.scrollHeight - els.chartViewport.clientHeight * 0.4),
        behavior: 'smooth'
      });
    });

    window.addEventListener('resize', () => {
      renderFlowsOverlay();
      updateMinimapViewport();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
      if (e.key === '/' && !inInput) {
        e.preventDefault();
        els.searchInput.focus();
      } else if (e.key === 'Escape') {
        els.mapModal.hidden = true;
        els.compareModal.hidden = true;
        els.searchDropdown.hidden = true;
        if (!els.flowsPanel.hidden) closeFlowsPanel();
        else if (!els.factsPanel.hidden) closeFactsPanel();
        else if (state.selectedEmpireId) closeEmpireDrawer();
        else if (state.pinnedYear !== null) unpinYear();
      } else if ((e.key === 'l' || e.key === 'L') && !inInput) {
        setScaleMode(state.scaleMode === 'linear' ? 'adaptive' : 'linear');
      } else if (e.key === 'ArrowRight' && !inInput) {
        if (!els.flowsPanel.hidden) focusFlowStep(state.activeFlowStepIdx + 1);
        else if (!els.factsPanel.hidden) stepFact(1);
      } else if (e.key === 'ArrowLeft' && !inInput) {
        if (!els.flowsPanel.hidden) focusFlowStep(state.activeFlowStepIdx - 1);
        else if (!els.factsPanel.hidden) stepFact(-1);
      }
    });
  }

  function init() {
    renderStaticControls();
    renderTimeline();
    bindEvents();

    // Optional URL query/hash deep-linking (?empire=west_han, ?flow=xiongnu_domino, ?fact=western_han_bce, ?scale=linear)
    const params = new URLSearchParams(window.location.search);
    if (params.get('mapmode') === 'world') {
      state.mapViewMode = 'world';
      els.mapModeRegionBtn.classList.remove('active');
      els.mapModeWorldBtn.classList.add('active');
    }
    if (params.get('scale') === 'linear') {
      setScaleMode('linear', false);
    }
    if (params.get('flow')) {
      openFlowsPanel(params.get('flow'));
      focusFlowStep(0, true);
    } else if (params.get('fact')) {
      openFactsPanel();
      activateFact(params.get('fact'), true);
    } else if (params.get('empire')) {
      const emp = getEmpireById(params.get('empire'));
      if (emp) {
        const pIdx = Number(params.get('period') || 0);
        const mid = Math.round((emp.startYear + emp.endYear) / 2);
        els.chartViewport.scrollTop = Math.max(0, yearToY(mid) - 180);
        openEmpireDrawer(emp.id, pIdx);
        if (params.get('mapmodal') === '1') openMapModal();
      }
    } else {
      // Start nicely framed near the Classical Era / BC-CE boundary (Western Han & Rome!)
      const startY = yearToY(-160);
      els.chartViewport.scrollTop = Math.max(0, startY - 140);
      updateChronoRibbon(-140);
    }
    updateMinimapViewport();
  }

  init();
})();
