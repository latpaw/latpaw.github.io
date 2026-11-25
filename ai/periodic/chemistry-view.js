(function (root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.ChemistryView = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  function escapeXml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'
    })[character]);
  }

  function createElectronShellSvg(element, chemistry) {
    const shells = chemistry.shells;
    const centerX = 260;
    const centerY = 180;
    const colors = ['#e77658', '#4b9f95', '#d6aa45', '#6d8fb1', '#9b7bb0', '#6b9c68', '#c47b72'];
    const rings = [];
    const electrons = [];
    const labels = [];

    shells.forEach((count, index) => {
      const radius = shells.length === 1 ? 70 : 45 + (index * 105) / (shells.length - 1);
      rings.push(`<circle data-shell="${index + 1}" cx="${centerX}" cy="${centerY}" r="${radius}" fill="none" stroke="#9aaca8" stroke-width="1.5"/>`);
      labels.push(`<text data-label="${count}" x="${centerX}" y="${centerY - radius - 5}" text-anchor="middle" fill="#5c7372" font-size="11">${count} 个电子</text>`);
      for (let electron = 0; electron < count; electron += 1) {
        const angle = -Math.PI / 2 + (Math.PI * 2 * electron) / count + Math.PI / count;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        electrons.push(`<circle data-electron="${electron + 1}" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4.5" fill="${colors[index]}" stroke="#fffef9" stroke-width="1.5"/>`);
      }
    });

    return `<svg viewBox="0 0 520 360" role="img" aria-label="${escapeXml(element.name)}原子的电子层示意图" xmlns="http://www.w3.org/2000/svg"><title>${escapeXml(element.name)}：${shells.join('、')} 个电子分层排布</title>${rings.join('')}${electrons.join('')}<circle cx="${centerX}" cy="${centerY}" r="35" fill="#183f43"/><text x="${centerX}" y="${centerY + 9}" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-size="27">${escapeXml(element.symbol)}</text>${labels.join('')}</svg>`;
  }

  function chemistrySearchText(chemistry) {
    return [
      chemistry.config, chemistry.oxidation, chemistry.reactivity, chemistry.nuclearText,
      chemistry.flame.label, chemistry.flame.text, chemistry.compoundNote, chemistry.story,
      chemistry.mass, chemistry.melting, chemistry.density,
      ...chemistry.compounds.flatMap((compound) => [compound.name, compound.formula, compound.note]),
      ...(chemistry.reaction ? [chemistry.reaction.equation, chemistry.reaction.text] : []),
      ...chemistry.relations.flatMap((relation) => [relation.type, relation.text])
    ].join(' ');
  }

  return { createElectronShellSvg, chemistrySearchText };
});
