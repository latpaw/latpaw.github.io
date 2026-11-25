(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.PeriodicIllustration = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function escapeXml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
    })[character]);
  }

  const drawings = {
    metal: '<ellipse cx="180" cy="181" rx="106" ry="16" fill="#142d35" opacity=".1"/><path d="M76 133 128 91h139l-43 43H83Z" fill="url(#top)"/><path d="M83 134h141v43H83z" fill="url(#front)"/><path d="m224 134 43-43v43l-43 43Z" fill="#75878b"/><path d="m104 118 35-29h87l-29 29Z" fill="#fff" opacity=".3"/><text x="151" y="164" class="specimen-symbol">%SYMBOL%</text>',
    crystal: '<ellipse cx="180" cy="184" rx="99" ry="14" fill="#142d35" opacity=".1"/><path d="m112 156 18-82 49-32 51 30 22 84-70 28Z" fill="url(#crystal)"/><path d="m130 74 49 38 51-30M179 112l3 72M112 156l67-44 73 44M179 42l-49 32 49 38 51-30Z" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><path d="m130 74 49 38 3 72-70-28Z" fill="#fff" opacity=".14"/><text x="157" y="150" class="specimen-symbol">%SYMBOL%</text>',
    gas: '<path d="M151 38h58v45c0 14 46 45 46 74 0 25-32 34-75 34s-75-9-75-34c0-29 46-60 46-74Z" fill="#fff" fill-opacity=".5" stroke="#527179" stroke-width="3"/><path d="M150 38h60" stroke="#344f57" stroke-width="7" stroke-linecap="round"/><path d="M117 143c25 10 93-16 127 0 7 10 10 17 9 24-4 19-35 24-73 24s-70-7-74-25c-1-8 3-15 11-23Z" fill="url(#gas)" opacity=".55"/><g fill="none" stroke="#fff" stroke-width="2" opacity=".85"><circle cx="145" cy="134" r="14"/><circle cx="203" cy="150" r="19"/><circle cx="185" cy="105" r="9"/><circle cx="223" cy="118" r="7"/></g><text x="158" y="174" class="specimen-symbol">%SYMBOL%</text>',
    liquid: '<ellipse cx="180" cy="188" rx="87" ry="13" fill="#142d35" opacity=".1"/><path d="M112 65h136l-15 109c-1 11-19 17-53 17s-52-6-53-17Z" fill="#fff" fill-opacity=".48" stroke="#527179" stroke-width="3"/><path d="M108 65h144" stroke="#344f57" stroke-width="6" stroke-linecap="round"/><path d="m123 120 114-1-8 56c-1 7-18 11-49 11s-47-4-48-11Z" fill="url(#liquid)"/><path d="M123 120q28-14 57 0t57 0" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="3"/><ellipse cx="157" cy="146" rx="14" ry="6" fill="#fff" opacity=".3"/><text x="159" y="171" class="specimen-symbol light">%SYMBOL%</text>',
    powder: '<ellipse cx="180" cy="179" rx="112" ry="19" fill="#142d35" opacity=".1"/><ellipse cx="180" cy="167" rx="106" ry="25" fill="#d5cbbb"/><path d="M87 158q28-17 44-52 13-29 50-31 36 2 49 31 19 38 45 52-24 24-93 24t-95-24Z" fill="url(#powder)"/><path d="m116 136 21-6m22-28 9-5m31 17 16 7m-66 29 11-4m53 7 19-3" stroke="#fff" stroke-opacity=".45" stroke-width="4" stroke-linecap="round"/><text x="157" y="157" class="specimen-symbol">%SYMBOL%</text>',
    rock: '<ellipse cx="180" cy="181" rx="108" ry="15" fill="#142d35" opacity=".1"/><path d="m70 159 26-65 57-25 40 14 29-18 48 71-25 39H93Z" fill="url(#rock)"/><path d="m96 94 57 31 40-42m-40 42-12 50m81-92-29 60 52 32m-52-32-52 32m-45-81 45 31 12 50" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="3"/><path d="m153 125 40-42 29-18-29 78Z" fill="#fff" opacity=".12"/><text x="148" y="158" class="specimen-symbol light">%SYMBOL%</text>',
    molecule: '<g stroke="#5c747c" stroke-width="9" stroke-linecap="round"><path d="m120 128 57-58 66 48M120 128l61 39 62-49M177 70l4 97"/></g><g fill="url(#molecule)" stroke="#fff" stroke-width="4"><circle cx="120" cy="128" r="34"/><circle cx="177" cy="70" r="28"/><circle cx="243" cy="118" r="37"/><circle cx="181" cy="167" r="25"/></g><g fill="#fff" opacity=".35"><circle cx="110" cy="117" r="9"/><circle cx="168" cy="61" r="7"/><circle cx="231" cy="105" r="10"/></g><text x="96" y="136" class="specimen-symbol light">%SYMBOL%</text>',
    synthetic: '<ellipse cx="180" cy="179" rx="99" ry="15" fill="#142d35" opacity=".1"/><circle cx="180" cy="116" r="73" fill="none" stroke="#8ca1a4" stroke-width="2" stroke-dasharray="5 8"/><circle cx="180" cy="116" r="48" fill="none" stroke="#8ca1a4" stroke-width="2"/><path d="M61 116h238M180 24v184" stroke="#8ca1a4" stroke-width="2"/><circle cx="180" cy="116" r="34" fill="url(#synthetic)"/><circle cx="108" cy="74" r="8" fill="#ee795f"/><circle cx="250" cy="149" r="8" fill="#ee795f"/><path d="m180 94 8 16 18 3-13 13 3 18-16-8-16 8 3-18-13-13 18-3Z" fill="#fff" opacity=".75"/><text x="159" y="124" class="specimen-symbol light">%SYMBOL%</text>'
  };

  function createSpecimenSvg(element) {
    const visual = Object.hasOwn(drawings, element.visual) ? element.visual : 'synthetic';
    const id = Math.max(1, Number.parseInt(element.number, 10) || 1);
    const liquidColor = id === 35 ? '#a9432f' : '#8d9da1';
    const drawing = drawings[visual].replace('%SYMBOL%', escapeXml(element.symbol));
    return '<svg viewBox="0 0 360 220" role="img" aria-label="' + escapeXml(element.name) + '的常见形态示意图" data-visual="' + visual + '" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="top" x2="0" y2="1"><stop stop-color="#f5f1da"/><stop offset="1" stop-color="#aebcbd"/></linearGradient><linearGradient id="front"><stop stop-color="#aab9b9"/><stop offset=".45" stop-color="#edf0e9"/><stop offset="1" stop-color="#829598"/></linearGradient><linearGradient id="crystal" x2="1" y2="1"><stop stop-color="#d7f0e8"/><stop offset=".5" stop-color="#78bdb4"/><stop offset="1" stop-color="#397f80"/></linearGradient><linearGradient id="gas" x2="0" y2="1"><stop stop-color="#84d8d1"/><stop offset="1" stop-color="#318c96"/></linearGradient><linearGradient id="liquid" x2="0" y2="1"><stop stop-color="' + liquidColor + '"/><stop offset="1" stop-color="#445e64"/></linearGradient><linearGradient id="powder" x2="0" y2="1"><stop stop-color="#e9d49a"/><stop offset="1" stop-color="#a78355"/></linearGradient><linearGradient id="rock" x2="1" y2="1"><stop stop-color="#b9b8a9"/><stop offset=".5" stop-color="#737d77"/><stop offset="1" stop-color="#394e4e"/></linearGradient><linearGradient id="molecule" x2="1" y2="1"><stop stop-color="#8ed9cd"/><stop offset="1" stop-color="#287b80"/></linearGradient><radialGradient id="synthetic"><stop stop-color="#f5be67"/><stop offset="1" stop-color="#d7674f"/></radialGradient></defs>' +
      '<style>.specimen-symbol{font:700 30px ui-sans-serif,sans-serif;fill:#263f45;text-anchor:middle}.specimen-symbol.light{fill:#fff}</style>' + drawing + '</svg>';
  }

  return { createSpecimenSvg };
});
