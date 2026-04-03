export function duplicateSelection({
  selectedElement,
  readTransformState,
  writeTransformState,
  nextId,
  modifiedSlots,
  redetect,
  emitMutation,
}) {
  const target = selectedElement();
  if (!target) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
  const clone = target.cloneNode(true);
  clone.dataset.nodeUid = nextId('node');
  clone.removeAttribute('id');
  target.after(clone);
  const state = readTransformState(target);
  writeTransformState(clone, state.tx + 20, state.ty + 20);
  clone.dataset.editorModified = '1';
  modifiedSlots().add(clone.dataset.nodeUid);
  redetect({ preserveSelectionUids: [clone.dataset.nodeUid] });
  emitMutation('duplicate');
  return { ok: true, message: '선택 요소를 복제했습니다.' };
}
