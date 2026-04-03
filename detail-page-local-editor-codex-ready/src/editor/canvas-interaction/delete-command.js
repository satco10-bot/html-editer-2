export function deleteSelection({ selectedElements, doc, redetect, emitMutation }) {
  const targets = selectedElements();
  if (!targets.length) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
  let removed = 0;
  for (const element of targets) {
    if (!element.isConnected || element === doc.body || element.tagName === 'HTML' || element.tagName === 'BODY') continue;
    element.remove();
    removed += 1;
  }
  if (!removed) return { ok: false, message: '삭제할 수 있는 요소가 없습니다.' };
  redetect({ preserveSelectionUids: [] });
  emitMutation('delete');
  return { ok: true, message: `선택 요소 ${removed}개를 삭제했습니다.` };
}
