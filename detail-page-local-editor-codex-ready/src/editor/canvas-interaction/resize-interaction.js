export function beginResizeInteraction({ event, corner, selectedElement, isLockedElement, readTransformState, win }) {
  const target = selectedElement();
  if (!target || isLockedElement(target)) return null;
  const rect = target.getBoundingClientRect();
  const transform = readTransformState(target);
  const width = Number.parseFloat(win.getComputedStyle(target).width || String(rect.width)) || rect.width;
  const height = Number.parseFloat(win.getComputedStyle(target).height || String(rect.height)) || rect.height;
  return {
    pointerId: event.pointerId,
    corner,
    target,
    startX: event.clientX,
    startY: event.clientY,
    startWidth: width,
    startHeight: height,
    startTx: transform.tx,
    startTy: transform.ty,
    moved: false,
  };
}

export function applyResizeInteraction({ event, resizeState, setInlineStyle, writeTransformState, modifiedSlots, updateResizeOverlay }) {
  if (!resizeState || resizeState.pointerId !== event.pointerId) return false;
  const dx = event.clientX - resizeState.startX;
  const dy = event.clientY - resizeState.startY;
  if (!resizeState.moved && Math.hypot(dx, dy) < 2) return false;
  resizeState.moved = true;
  const { corner, target } = resizeState;
  let width = resizeState.startWidth;
  let height = resizeState.startHeight;
  let tx = resizeState.startTx;
  let ty = resizeState.startTy;
  if (corner.includes('e')) width += dx;
  if (corner.includes('s')) height += dy;
  if (corner.includes('w')) {
    width -= dx;
    tx += dx;
  }
  if (corner.includes('n')) {
    height -= dy;
    ty += dy;
  }
  width = Math.max(8, width);
  height = Math.max(8, height);
  setInlineStyle(target, { width: `${Math.round(width)}px`, height: `${Math.round(height)}px` });
  writeTransformState(target, tx, ty);
  target.dataset.editorModified = '1';
  if (target.dataset.nodeUid) modifiedSlots().add(target.dataset.nodeUid);
  updateResizeOverlay();
  return true;
}
