export function beginMoveInteraction({ target, event, isLockedElement, selectedElements, selectElements, uniqueConnectedElements, readTransformState, unionRect, buildSnapCandidates }) {
  if (!target || isLockedElement(target)) return null;
  if (!selectedElements().some((element) => element.dataset.nodeUid === target.dataset.nodeUid)) {
    selectElements([target], { silent: true });
  }
  const elements = uniqueConnectedElements(selectedElements()).filter((element) => !isLockedElement(element));
  if (!elements.length) return null;
  const snapshots = elements.map((element) => ({
    element,
    rect: element.getBoundingClientRect(),
    transform: readTransformState(element),
  }));
  const union = unionRect(snapshots.map((item) => item.rect));
  const excluded = new Set(elements.map((element) => element.dataset.nodeUid));
  return {
    mode: 'move',
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false,
    snapshots,
    union,
    snapCandidates: buildSnapCandidates(excluded),
  };
}

export function applyMoveInteraction({ dragState, clientX, clientY, computeSnapAdjustment, writeTransformState, showSnapLines, doc }) {
  if (!dragState || dragState.mode !== 'move') return;
  const rawDx = clientX - dragState.startX;
  const rawDy = clientY - dragState.startY;
  const snapped = computeSnapAdjustment(dragState.union, rawDx, rawDy, dragState.snapCandidates);
  for (const item of dragState.snapshots) {
    writeTransformState(item.element, item.transform.tx + snapped.dx, item.transform.ty + snapped.dy);
  }
  showSnapLines({ x: snapped.guideX, y: snapped.guideY });
  doc.documentElement.classList.add('__phase6_dragging_cursor');
  doc.body.classList.add('__phase6_dragging_cursor');
}
