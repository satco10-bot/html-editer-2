export function createProjectStore() {
  const listeners = new Set();
  const state = {
    project: null,
    editorMeta: null,
    statusText: '대기 중',
    lastError: '',
    imageApplyDiagnostic: null,
    currentView: 'preview',
    selectionMode: 'smart',
  };

  function notify() {
    const snapshot = getState();
    for (const listener of listeners) {
      try {
        listener(snapshot);
      } catch (error) {
        console.error('[project-store] listener failed:', error);
      }
    }
  }

  function getState() {
    return {
      project: state.project,
      editorMeta: state.editorMeta,
      statusText: state.statusText,
      lastError: state.lastError,
      imageApplyDiagnostic: state.imageApplyDiagnostic,
      currentView: state.currentView,
      selectionMode: state.selectionMode,
    };
  }

  function setProject(project) {
    if (state.project?.releaseResources) {
      try { state.project.releaseResources(); } catch {}
    }
    state.project = project;
    state.editorMeta = null;
    state.imageApplyDiagnostic = null;
    notify();
  }

  function updateProject(mutator) {
    if (!state.project) return;
    const result = typeof mutator === 'function' ? mutator(state.project) : null;
    if (result && typeof result === 'object') state.project = result;
    notify();
  }

  function setEditorMeta(meta) {
    state.editorMeta = meta || null;
    notify();
  }

  function setStatus(text, { preserveLastError = false } = {}) {
    state.statusText = String(text || '대기 중');
    if (!preserveLastError) state.lastError = '';
    notify();
  }

  function setLastError(text) {
    state.lastError = String(text || '');
    notify();
  }

  function setImageApplyDiagnostic(diagnostic) {
    state.imageApplyDiagnostic = diagnostic ? { ...diagnostic } : null;
    notify();
  }

  function setView(view) {
    state.currentView = view || 'preview';
    notify();
  }

  function setSelectionMode(mode) {
    state.selectionMode = mode || 'smart';
    notify();
  }

  function subscribe(listener) {
    listeners.add(listener);
    try {
      listener(getState());
    } catch (error) {
      console.error('[project-store] initial listener failed:', error);
    }
    return () => listeners.delete(listener);
  }

  return {
    getState,
    setProject,
    updateProject,
    setEditorMeta,
    setStatus,
    setLastError,
    setImageApplyDiagnostic,
    setView,
    setSelectionMode,
    subscribe,
  };
}
