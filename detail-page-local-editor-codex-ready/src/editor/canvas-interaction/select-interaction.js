export function beginMarqueeInteraction({ event, selectedElements, uniqueConnectedElements }) {
  return {
    mode: 'marquee',
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    additive: !!(event.ctrlKey || event.metaKey || event.shiftKey),
    seedSelection: uniqueConnectedElements(selectedElements()),
  };
}

export function applyMarqueeInteraction({ dragState, endX, endY, showMarqueeRect, collectInteractiveLayers, isLockedElement, isHiddenElement, rectIntersects, uniqueConnectedElements, selectElements }) {
  if (!dragState || dragState.mode !== 'marquee') return;
  const left = Math.min(dragState.startX, endX);
  const top = Math.min(dragState.startY, endY);
  const right = Math.max(dragState.startX, endX);
  const bottom = Math.max(dragState.startY, endY);
  const rect = { left, top, right, bottom, width: right - left, height: bottom - top };
  showMarqueeRect(rect);
  const hits = collectInteractiveLayers()
    .filter((element) => !isLockedElement(element) && !isHiddenElement(element))
    .filter((element) => {
      const box = element.getBoundingClientRect();
      return box.width > 1 && box.height > 1 && rectIntersects(box, rect);
    });
  const next = dragState.additive ? uniqueConnectedElements([...dragState.seedSelection, ...hits]) : uniqueConnectedElements(hits);
  selectElements(next, { silent: true });
}
