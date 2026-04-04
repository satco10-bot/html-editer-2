export const EDITOR_MODE_STORAGE_KEY = 'editor_mode';
export const EDITOR_MODE_PRO = 'pro';

export function ensureProEditorModePolicy({ readStorage, writeStorage }) {
  const raw = String(readStorage(EDITOR_MODE_STORAGE_KEY, '') || '').trim().toLowerCase();
  const nextMode = raw === 'pro' || raw === 'beginner' ? raw : EDITOR_MODE_PRO;
  if (!raw) {
    writeStorage(EDITOR_MODE_STORAGE_KEY, EDITOR_MODE_PRO);
    return EDITOR_MODE_PRO;
  }
  if (nextMode !== raw) {
    writeStorage(EDITOR_MODE_STORAGE_KEY, nextMode);
  }
  return nextMode;
}
