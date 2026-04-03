import { FIXTURE_MANIFEST, FIXTURE_SOURCE_MAP, getFixtureMeta } from './fixture-bundle.js';
import { AUTOSAVE_KEY, EXPORT_PRESETS, HISTORY_LIMIT, getExportPresetById } from './config.js';
import { createImportFileIndex, choosePrimaryHtmlEntry } from './core/asset-resolver.js';
import { normalizeProject } from './core/normalize-project.js';
import { createProjectStore } from './core/project-store.js';
import { createFrameEditor } from './editor/frame-editor.js';
import {
  renderAssetTable,
  renderIssueList,
  renderLayerTree,
  renderLocalModeNotice,
  renderNormalizeStats,
  renderPreflight,
  renderProjectMeta,
  renderSelectionInspector,
  renderSlotList,
  renderSummaryCards,
} from './ui/renderers.js';
import { buildZipBlob, downloadBlob, downloadTextFile, sanitizeFilename } from './utils.js';

const store = createProjectStore();
let activeEditor = null;
let mountedProjectId = '';
let pendingMountOptions = null;
let currentExportPresetId = 'market';
let currentCodeSource = 'edited';
let codeEditorDirty = false;
let geometryCoordMode = 'relative';
let currentSaveFormat = 'linked';
let currentWorkflowStep = 'load';
let lastSaveConversion = null;
let advancedSettingsDirty = false;
let lastFocusedBeforeShortcutHelp = null;
const zoomState = { mode: 'fit', value: 1 };
const WORKFLOW_STEP_GUIDES = Object.freeze({
  load: 'HTML 파일이나 폴더를 먼저 불러오세요.',
  edit: '요소를 클릭한 뒤 드래그하세요.',
  save: '결과를 확인한 뒤 저장/출력을 실행하세요.',
});
const BOOT_LOCAL_POLICY = Object.freeze({
  requiresStartupFetch: false,
  requiresFileSystemAccessApi: false,
  requiresServerEndpoint: false,
});
const BEGINNER_MODE_STORAGE_KEY = 'detail_editor_beginner_mode_v1';
const BEGINNER_MODE_TUTORIAL_SEEN_KEY = 'detail_editor_beginner_tutorial_seen_v1';
const BEGINNER_TUTORIAL_STEPS = Object.freeze([
  {
    title: '1) 선택부터 시작',
    body: '먼저 [선택] 버튼으로 요소를 클릭하세요. 선택 후 드래그하면 이동됩니다.',
  },
  {
    title: '2) 크기 조절/정리',
    body: '요소 테두리 핸들을 잡아 리사이즈하고, 필요하면 [복제]/[삭제]/[텍스트] 버튼만 사용하세요.',
  },
  {
    title: '3) 결과 저장',
    body: '완료하면 상단 [문서 저장] 또는 [PNG] 버튼으로 결과를 바로 내보내세요.',
  },
]);
let isBeginnerMode = false;
let beginnerTutorialStepIndex = 0;

const historyState = {
  baseSnapshot: null,
  undoStack: [],
  redoStack: [],
};

const advancedSettings = {
  geometryCoordMode: 'relative',
  exportScale: 1,
  exportJpgQuality: 0.92,
  selectionExportPadding: 16,
  selectionExportBackground: 'transparent',
};

const elements = {
  fixtureSelect: document.getElementById('fixtureSelect'),
  openHtmlButton: document.getElementById('openHtmlButton'),
  openFolderButton: document.getElementById('openFolderButton'),
  loadFixtureButton: document.getElementById('loadFixtureButton'),
  applyPasteButton: document.getElementById('applyPasteButton'),
  replaceImageButton: document.getElementById('replaceImageButton'),
  manualSlotButton: document.getElementById('manualSlotButton'),
  demoteSlotButton: document.getElementById('demoteSlotButton'),
  toggleHideButton: document.getElementById('toggleHideButton'),
  toggleLockButton: document.getElementById('toggleLockButton'),
  redetectButton: document.getElementById('redetectButton'),
  textEditButton: document.getElementById('textEditButton'),
  duplicateButton: document.getElementById('duplicateButton'),
  deleteButton: document.getElementById('deleteButton'),
  addTextButton: document.getElementById('addTextButton'),
  addBoxButton: document.getElementById('addBoxButton'),
  addSlotButton: document.getElementById('addSlotButton'),
  groupButton: document.getElementById('groupButton'),
  ungroupButton: document.getElementById('ungroupButton'),
  undoButton: document.getElementById('undoButton'),
  redoButton: document.getElementById('redoButton'),
  restoreAutosaveButton: document.getElementById('restoreAutosaveButton'),
  downloadEditedButton: document.getElementById('downloadEditedButton'),
  saveFormatSelect: document.getElementById('saveFormatSelect'),
  saveFormatStatus: document.getElementById('saveFormatStatus'),
  saveFormatGuide: document.getElementById('saveFormatGuide'),
  saveFormatPreview: document.getElementById('saveFormatPreview'),
  saveMetaSummary: document.getElementById('saveMetaSummary'),
  downloadNormalizedButton: document.getElementById('downloadNormalizedButton'),
  downloadLinkedZipButton: document.getElementById('downloadLinkedZipButton'),
  exportPngButton: document.getElementById('exportPngButton'),
  exportJpgButton: document.getElementById('exportJpgButton'),
  exportSectionsZipButton: document.getElementById('exportSectionsZipButton'),
  exportSelectionPngButton: document.getElementById('exportSelectionPngButton'),
  selectionExportPaddingInput: document.getElementById('selectionExportPaddingInput'),
  selectionExportBackgroundSelect: document.getElementById('selectionExportBackgroundSelect'),
  exportPresetSelect: document.getElementById('exportPresetSelect'),
  exportScaleSelectMain: document.getElementById('exportScaleSelectMain'),
  exportScaleSelectSelection: document.getElementById('exportScaleSelectSelection'),
  exportScaleSelectControls: Array.from(document.querySelectorAll('[data-export-scale-control]')),
  exportJpgQualityInputMain: document.getElementById('exportJpgQualityInputMain'),
  exportJpgQualityInputSelection: document.getElementById('exportJpgQualityInputSelection'),
  exportJpgQualityInputs: Array.from(document.querySelectorAll('[data-export-jpg-quality-control]')),
  exportPresetPackageButton: document.getElementById('exportPresetPackageButton'),
  downloadReportButton: document.getElementById('downloadReportButton'),
  htmlFileInput: document.getElementById('htmlFileInput'),
  folderInput: document.getElementById('folderInput'),
  replaceImageInput: document.getElementById('replaceImageInput'),
  htmlPasteInput: document.getElementById('htmlPasteInput'),
  summaryCards: document.getElementById('summaryCards'),
  issueList: document.getElementById('issueList'),
  normalizeStats: document.getElementById('normalizeStats'),
  selectionInspector: document.getElementById('selectionInspector'),
  slotList: document.getElementById('slotList'),
  layerTree: document.getElementById('layerTree'),
  layerFilterInput: document.getElementById('layerFilterInput'),
  preflightContainer: document.getElementById('preflightContainer'),
  preflightRefreshButton: document.getElementById('preflightRefreshButton'),
  assetTableWrap: document.getElementById('assetTableWrap'),
  assetFilterInput: document.getElementById('assetFilterInput'),
  previewFrame: document.getElementById('previewFrame'),
  editedCodeView: document.getElementById('editedCodeView'),
  normalizedCodeView: document.getElementById('normalizedCodeView'),
  originalCodeView: document.getElementById('originalCodeView'),
  jsonReportView: document.getElementById('jsonReportView'),
  projectMeta: document.getElementById('projectMeta'),
  statusText: document.getElementById('statusText'),
  localModeNotice: document.getElementById('localModeNotice'),
  textStyleSummary: document.getElementById('textStyleSummary'),
  textFontSizeInput: document.getElementById('textFontSizeInput'),
  textLineHeightInput: document.getElementById('textLineHeightInput'),
  textLetterSpacingInput: document.getElementById('textLetterSpacingInput'),
  textWeightSelect: document.getElementById('textWeightSelect'),
  textColorInput: document.getElementById('textColorInput'),
  applyTextStyleButton: document.getElementById('applyTextStyleButton'),
  clearTextStyleButton: document.getElementById('clearTextStyleButton'),
  batchSelectionSummary: document.getElementById('batchSelectionSummary'),
  geometryXInput: document.getElementById('geometryXInput'),
  geometryYInput: document.getElementById('geometryYInput'),
  geometryWInput: document.getElementById('geometryWInput'),
  geometryHInput: document.getElementById('geometryHInput'),
  geometryCoordModeSelect: document.getElementById('geometryCoordModeSelect'),
  geometryRuleHint: document.getElementById('geometryRuleHint'),
  applyGeometryButton: document.getElementById('applyGeometryButton'),
  arrangeToggleHideButton: document.getElementById('arrangeToggleHideButton'),
  arrangeToggleLockButton: document.getElementById('arrangeToggleLockButton'),
  basicAttributeSection: document.getElementById('basicAttributeSection'),
  advancedAttributeSection: document.getElementById('advancedAttributeSection'),
  applyAdvancedSettingsButton: document.getElementById('applyAdvancedSettingsButton'),
  advancedSettingsState: document.getElementById('advancedSettingsState'),
  bringForwardButton: document.getElementById('bringForwardButton'),
  sendBackwardButton: document.getElementById('sendBackwardButton'),
  bringToFrontButton: document.getElementById('bringToFrontButton'),
  sendToBackButton: document.getElementById('sendToBackButton'),
  imageNudgeLeftButton: document.getElementById('imageNudgeLeftButton'),
  imageNudgeRightButton: document.getElementById('imageNudgeRightButton'),
  imageNudgeUpButton: document.getElementById('imageNudgeUpButton'),
  imageNudgeDownButton: document.getElementById('imageNudgeDownButton'),
  toggleLeftSidebarButton: document.getElementById('toggleLeftSidebarButton'),
  toggleRightSidebarButton: document.getElementById('toggleRightSidebarButton'),
  focusModeButton: document.getElementById('focusModeButton'),
  workflowGuideLine: document.getElementById('workflowGuideLine'),
  workflowStepButtons: Array.from(document.querySelectorAll('[data-workflow-step]')),
  workflowPanels: Array.from(document.querySelectorAll('[data-workflow-panel]')),
  zoomOutButton: document.getElementById('zoomOutButton'),
  zoomInButton: document.getElementById('zoomInButton'),
  zoomResetButton: document.getElementById('zoomResetButton'),
  zoomFitButton: document.getElementById('zoomFitButton'),
  zoomLabel: document.getElementById('zoomLabel'),
  previewViewport: document.getElementById('previewViewport'),
  previewScaler: document.getElementById('previewScaler'),
  canvasContextBar: document.getElementById('canvasContextBar'),
  miniHud: document.getElementById('miniHud'),
  miniHudPos: document.getElementById('miniHudPos'),
  miniHudSize: document.getElementById('miniHudSize'),
  miniHudLayer: document.getElementById('miniHudLayer'),
  canvasGeometryXInput: document.getElementById('canvasGeometryXInput'),
  canvasGeometryYInput: document.getElementById('canvasGeometryYInput'),
  canvasGeometryWInput: document.getElementById('canvasGeometryWInput'),
  canvasGeometryHInput: document.getElementById('canvasGeometryHInput'),
  applyCanvasGeometryButton: document.getElementById('applyCanvasGeometryButton'),
  codeEditorTextarea: document.getElementById('codeEditorTextarea'),
  codeSearchInput: document.getElementById('codeSearchInput'),
  codeSearchNextButton: document.getElementById('codeSearchNextButton'),
  reloadCodeFromEditorButton: document.getElementById('reloadCodeFromEditorButton'),
  applyCodeToEditorButton: document.getElementById('applyCodeToEditorButton'),
  codeSourceButtons: Array.from(document.querySelectorAll('[data-code-source]')),
  sidebarTabButtons: Array.from(document.querySelectorAll('[data-sidebar-tab]')),
  sidebarPanels: Array.from(document.querySelectorAll('[data-sidebar-panel]')),
  viewButtons: Array.from(document.querySelectorAll('[data-view]')),
  viewPanels: Array.from(document.querySelectorAll('[data-stage-view]')),
  selectionModeButtons: Array.from(document.querySelectorAll('[data-selection-mode]')),
  presetButtons: Array.from(document.querySelectorAll('[data-preset]')),
  actionButtons: Array.from(document.querySelectorAll('[data-action]')),
  batchActionButtons: Array.from(document.querySelectorAll('[data-batch-action]')),
  textAlignButtons: Array.from(document.querySelectorAll('[data-text-align]')),
  canvasActionButtons: Array.from(document.querySelectorAll('[data-canvas-action]')),
  shortcutHelpOverlay: document.getElementById('shortcutHelpOverlay'),
  shortcutHelpCloseButton: document.getElementById('shortcutHelpCloseButton'),
  beginnerModeToggle: document.getElementById('beginnerModeToggle'),
  advancedTopbarPanel: document.getElementById('advancedTopbarPanel'),
  beginnerTutorialTooltip: document.getElementById('beginnerTutorialTooltip'),
  beginnerTutorialTitle: document.getElementById('beginnerTutorialTitle'),
  beginnerTutorialBody: document.getElementById('beginnerTutorialBody'),
  beginnerTutorialStep: document.getElementById('beginnerTutorialStep'),
  beginnerTutorialPrevButton: document.getElementById('beginnerTutorialPrevButton'),
  beginnerTutorialNextButton: document.getElementById('beginnerTutorialNextButton'),
  beginnerTutorialCloseButton: document.getElementById('beginnerTutorialCloseButton'),
};

function readFromLocalStorage(key, fallback = null) {
  try {
    const value = window.localStorage.getItem(key);
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

function writeToLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

function hasSeenBeginnerTutorial() {
  return readFromLocalStorage(BEGINNER_MODE_TUTORIAL_SEEN_KEY, '') === '1';
}

function markBeginnerTutorialSeen() {
  writeToLocalStorage(BEGINNER_MODE_TUTORIAL_SEEN_KEY, '1');
}

function closeBeginnerTutorial() {
  if (elements.beginnerTutorialTooltip) elements.beginnerTutorialTooltip.hidden = true;
  markBeginnerTutorialSeen();
}

function renderBeginnerTutorialStep() {
  const step = BEGINNER_TUTORIAL_STEPS[beginnerTutorialStepIndex] || BEGINNER_TUTORIAL_STEPS[0];
  if (elements.beginnerTutorialTitle) elements.beginnerTutorialTitle.textContent = step.title;
  if (elements.beginnerTutorialBody) elements.beginnerTutorialBody.textContent = step.body;
  if (elements.beginnerTutorialStep) elements.beginnerTutorialStep.textContent = `${beginnerTutorialStepIndex + 1} / ${BEGINNER_TUTORIAL_STEPS.length}`;
  if (elements.beginnerTutorialPrevButton) elements.beginnerTutorialPrevButton.disabled = beginnerTutorialStepIndex < 1;
  if (elements.beginnerTutorialNextButton) {
    const isLast = beginnerTutorialStepIndex >= BEGINNER_TUTORIAL_STEPS.length - 1;
    elements.beginnerTutorialNextButton.textContent = isLast ? '완료' : '다음';
  }
}

function openBeginnerTutorialIfNeeded() {
  if (!isBeginnerMode || hasSeenBeginnerTutorial()) return;
  beginnerTutorialStepIndex = 0;
  renderBeginnerTutorialStep();
  if (elements.beginnerTutorialTooltip) elements.beginnerTutorialTooltip.hidden = false;
}

function applyBeginnerModeUi() {
  document.body.classList.toggle('beginner-mode', isBeginnerMode);
  if (elements.beginnerModeToggle) {
    elements.beginnerModeToggle.textContent = `초보 모드: ${isBeginnerMode ? 'ON' : 'OFF'}`;
    elements.beginnerModeToggle.setAttribute('aria-pressed', isBeginnerMode ? 'true' : 'false');
  }
  if (isBeginnerMode && elements.advancedTopbarPanel) elements.advancedTopbarPanel.open = false;
  if (!isBeginnerMode && elements.beginnerTutorialTooltip) elements.beginnerTutorialTooltip.hidden = true;
}

function setBeginnerMode(next, { silent = false } = {}) {
  isBeginnerMode = !!next;
  applyBeginnerModeUi();
  writeToLocalStorage(BEGINNER_MODE_STORAGE_KEY, isBeginnerMode ? '1' : '0');
  if (isBeginnerMode) openBeginnerTutorialIfNeeded();
  if (!silent) setStatus(`초보 모드를 ${isBeginnerMode ? '켰습니다' : '껐습니다'}.`);
}

function evaluateWorkflowStepReadiness(step, state) {
  const hasProject = !!state?.project;
  const hasEditor = !!activeEditor;
  const selectionCount = Number(state?.editorMeta?.selectionCount || 0);
  if (step === 'edit' && !hasProject) {
    return { ok: false, message: '[단계 안내] 2) 편집으로 가기 전, 1) 불러오기에서 HTML/폴더를 먼저 열어 주세요.' };
  }
  if (step === 'save' && (!hasProject || !hasEditor)) {
    return { ok: false, message: '[단계 안내] 3) 저장/출력 전, 1) 불러오기와 2) 편집 준비가 필요합니다.' };
  }
  if (step === 'save' && selectionCount < 1) {
    return { ok: true, message: '[단계 안내] 선택 요소가 없습니다. 전체 저장/출력은 가능하며, 선택 PNG는 요소를 선택한 뒤 사용하세요.' };
  }
  return { ok: true, message: '' };
}

function syncWorkflowUi(state, { announce = false } = {}) {
  for (const button of elements.workflowStepButtons) {
    const active = button.dataset.workflowStep === currentWorkflowStep;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-selected', active ? 'true' : 'false');
  }
  for (const panel of elements.workflowPanels) {
    const scope = String(panel.dataset.workflowPanel || '').trim();
    const steps = scope.split(/\s+/).filter(Boolean);
    const visible = steps.length < 1 || steps.includes(currentWorkflowStep);
    panel.classList.toggle('is-hidden', !visible);
  }
  if (elements.workflowGuideLine) {
    elements.workflowGuideLine.textContent = WORKFLOW_STEP_GUIDES[currentWorkflowStep] || WORKFLOW_STEP_GUIDES.load;
  }
  if (announce) {
    const check = evaluateWorkflowStepReadiness(currentWorkflowStep, state);
    if (check.message) setStatus(check.message);
  }
}

function setWorkflowStep(step) {
  const normalized = step === 'edit' || step === 'save' ? step : 'load';
  currentWorkflowStep = normalized;
  syncWorkflowUi(store.getState(), { announce: true });
}

function projectBaseName(project) {
  return sanitizeFilename((project?.sourceName || 'detail-page').replace(/\.html?$/i, '') || 'detail-page');
}

function exportScale() {
  const value = Number.parseFloat(String(advancedSettings.exportScale || 1));
  if (!Number.isFinite(value)) return 1;
  if (value >= 2.5) return 3;
  if (value >= 1.5) return 2;
  return 1;
}

function exportJpgQuality() {
  const raw = Number.parseFloat(String(advancedSettings.exportJpgQuality || DEFAULT_JPG_QUALITY));
  if (!Number.isFinite(raw)) return DEFAULT_JPG_QUALITY;
  return Math.min(1, Math.max(0.1, raw));
}

function selectionExportPadding() {
  const raw = Number.parseFloat(String(advancedSettings.selectionExportPadding || 16));
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(240, Math.round(raw)));
}

function selectionExportBackground() {
  const raw = String(advancedSettings.selectionExportBackground || 'transparent');
  return raw === 'opaque' ? 'opaque' : 'transparent';
}

function setStatus(text, options = undefined) {
  store.setStatus(text, options);
}

function extractErrorMessage(error) {
  if (!error) return '';
  if (typeof error.message === 'string' && error.message.trim()) return error.message.trim();
  if (typeof error === 'string' && error.trim()) return error.trim();
  return '';
}

function setStatusWithError(prefix, error, { logTag = 'APP_ERROR' } = {}) {
  const detail = extractErrorMessage(error);
  if (logTag) console.error(`[${logTag}]`, error);
  store.setLastError(detail);
  setStatus(prefix, { preserveLastError: true });
}

function isTypingInputTarget(target) {
  if (!target || !(target instanceof Element)) return false;
  if (target.closest('[contenteditable="true"]')) return true;
  const tagName = target.tagName;
  if (tagName === 'TEXTAREA' || tagName === 'SELECT') return true;
  if (tagName !== 'INPUT') return false;
  const inputType = String(target.getAttribute('type') || 'text').toLowerCase();
  return inputType !== 'checkbox' && inputType !== 'radio' && inputType !== 'button' && inputType !== 'submit' && inputType !== 'reset';
}

function toggleShortcutHelp(forceOpen = null) {
  const overlay = elements.shortcutHelpOverlay;
  if (!overlay) return false;
  const shouldOpen = forceOpen == null ? overlay.hidden : !!forceOpen;
  overlay.hidden = !shouldOpen;
  if (shouldOpen) {
    lastFocusedBeforeShortcutHelp = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    elements.shortcutHelpCloseButton?.focus();
    setStatus('단축키 치트시트를 열었습니다.');
  } else if (lastFocusedBeforeShortcutHelp && typeof lastFocusedBeforeShortcutHelp.focus === 'function') {
    lastFocusedBeforeShortcutHelp.focus();
  }
  return shouldOpen;
}

function applyShortcutTooltips() {
  for (const [selector, label] of Object.entries(SHORTCUT_TOOLTIP_MAP)) {
    for (const node of Array.from(document.querySelectorAll(selector))) {
      node.title = label;
      const originalAria = node.getAttribute('aria-label') || node.textContent?.trim() || '';
      if (!originalAria.includes('(')) node.setAttribute('aria-label', `${originalAria} ${label.match(/\(.+\)/)?.[0] || ''}`.trim());
    }
  }
}

function evaluateLocalBootEnvironment() {
  const checks = [];
  const add = (level, code, message) => checks.push({ level, code, message });
  const protocol = window.location?.protocol || '';

  if (protocol !== 'file:') {
    add('warning', 'NOT_FILE_PROTOCOL', `현재 실행 경로가 ${protocol || '(알 수 없음)'} 입니다. 필수 기준은 file:// 직접 실행입니다.`);
  }
  if (BOOT_LOCAL_POLICY.requiresStartupFetch) {
    add('error', 'POLICY_BOOT_FETCH', '초기 부팅 경로가 fetch/network를 필수로 요구하도록 설정되어 있습니다.');
  }
  if (BOOT_LOCAL_POLICY.requiresFileSystemAccessApi) {
    add('error', 'POLICY_FS_ACCESS_REQUIRED', 'File System Access API를 필수 경로로 요구하도록 설정되어 있습니다.');
  }
  if (BOOT_LOCAL_POLICY.requiresServerEndpoint) {
    add('error', 'POLICY_SERVER_REQUIRED', '서버/도메인 의존 경로가 필수로 설정되어 있습니다.');
  }
  if (typeof window.FileReader !== 'function') {
    add('error', 'MISSING_FILE_READER', '이 브라우저는 FileReader를 지원하지 않아 로컬 파일 import가 동작하지 않습니다.');
  }
  if (typeof URL?.createObjectURL !== 'function') {
    add('error', 'MISSING_BLOB_URL', '이 브라우저는 Blob URL 미리보기를 지원하지 않습니다.');
  }
  if (typeof window.DOMParser !== 'function') {
    add('error', 'MISSING_DOM_PARSER', '이 브라우저는 DOMParser를 지원하지 않아 HTML 파싱 기능이 제한됩니다.');
  }
  if (!('localStorage' in window)) {
    add('warning', 'NO_LOCAL_STORAGE', 'localStorage를 사용할 수 없어 autosave 복구 기능이 제한될 수 있습니다.');
  }

  return {
    generatedAt: new Date().toISOString(),
    checks,
    errorCount: checks.filter((item) => item.level === 'error').length,
    warningCount: checks.filter((item) => item.level === 'warning').length,
  };
}

function setView(nextView) {
  store.setView(nextView);
}

function populateFixtureSelect() {
  elements.fixtureSelect.innerHTML = FIXTURE_MANIFEST.fixtures
    .map((fixture) => `<option value="${fixture.id}">${fixture.id} · ${fixture.name}</option>`)
    .join('');
  elements.fixtureSelect.value = 'F05';
}

function populateExportPresetSelect() {
  elements.exportPresetSelect.innerHTML = EXPORT_PRESETS
    .map((preset) => `<option value="${preset.id}">${preset.label}</option>`)
    .join('');
  elements.exportPresetSelect.value = currentExportPresetId;
}

function currentExportPreset() {
  return getExportPresetById(currentExportPresetId);
}

function normalizeSaveFormat(value) {
  return value === 'embedded' ? 'embedded' : 'linked';
}

function formatByteSize(bytes) {
  const safeBytes = Number(bytes);
  if (!Number.isFinite(safeBytes) || safeBytes <= 0) return '0 B';
  if (safeBytes < 1024) return `${Math.round(safeBytes)} B`;
  if (safeBytes < 1024 * 1024) return `${(safeBytes / 1024).toFixed(1)} KB`;
  return `${(safeBytes / (1024 * 1024)).toFixed(2)} MB`;
}

function estimateSavePreview(project, format) {
  const sourceHtml = String(activeEditor?.getEditedHtml?.({ persistDetectedSlots: true }) || project?.normalizedHtml || '');
  const htmlBytes = new TextEncoder().encode(sourceHtml).length;
  const resolvedAssets = Number(project?.summary?.assetsResolved || 0);
  const unresolvedAssets = Number(project?.summary?.assetsUnresolved || 0);
  if (format === 'embedded') {
    return {
      fileCountLabel: '1개 (HTML 단일 파일)',
      sizeLabel: `예상 용량: ${formatByteSize(Math.round(htmlBytes * 1.3))} 내외`,
      pathPolicy: '경로 유지: 아니요 (이미지 data URL 내장)',
    };
  }
  return {
    fileCountLabel: `${1 + resolvedAssets}개 내외 (HTML 1 + 자산 ${resolvedAssets})`,
    sizeLabel: `예상 용량: ${formatByteSize(htmlBytes)} + 이미지 원본 합계`,
    pathPolicy: unresolvedAssets > 0 ? `경로 유지: 예 (단, 미해결 ${unresolvedAssets}개 경고 가능)` : '경로 유지: 예',
  };
}

function buildSaveMetaSummary() {
  if (!lastSaveConversion) return `리포트 save 메타: selectedFormat=${currentSaveFormat}, lastConversion=아직 없음`;
  const convertedCount = Number(lastSaveConversion.convertedDataUrlCount || 0);
  const generatedCount = Number(lastSaveConversion.generatedAssetCount || 0);
  const warningCount = Number(lastSaveConversion.brokenLinkedPathWarnings?.length || 0);
  const savedAt = lastSaveConversion.savedAt ? new Date(lastSaveConversion.savedAt).toLocaleString() : '시간 없음';
  return `리포트 save 메타: selectedFormat=${currentSaveFormat}, lastConversion=${lastSaveConversion.format || '-'} · dataURL→file ${convertedCount} · 생성자산 ${generatedCount} · 경고 ${warningCount} · ${savedAt}`;
}

function syncSaveFormatUi() {
  currentSaveFormat = normalizeSaveFormat(elements.saveFormatSelect?.value || currentSaveFormat);
  if (elements.saveFormatSelect && elements.saveFormatSelect.value !== currentSaveFormat) {
    elements.saveFormatSelect.value = currentSaveFormat;
  }
  if (elements.saveFormatStatus) {
    const modeLabel = currentSaveFormat === 'embedded' ? 'embedded (data URL 내장)' : 'linked (경로 유지)';
    elements.saveFormatStatus.textContent = `현재 저장 포맷: ${modeLabel}`;
  }
  if (elements.saveFormatGuide) {
    const purposeGuide = currentSaveFormat === 'embedded'
      ? '추천 안내: 1파일 전달/메신저 공유는 embedded가 편합니다.'
      : '추천 안내: 내 PC에서 재편집(이미지 교체 포함)할 땐 linked가 안전합니다.';
    elements.saveFormatGuide.textContent = purposeGuide;
  }
  if (elements.saveFormatPreview) {
    const preview = estimateSavePreview(store.getState().project, currentSaveFormat);
    elements.saveFormatPreview.textContent = `저장 결과 미리보기 → 파일 수: ${preview.fileCountLabel} · ${preview.sizeLabel} · ${preview.pathPolicy}`;
  }
  if (elements.saveMetaSummary) {
    elements.saveMetaSummary.textContent = buildSaveMetaSummary();
  }
}

function markAdvancedSettingsDirty(isDirty) {
  advancedSettingsDirty = !!isDirty;
  if (!elements.advancedSettingsState) return;
  elements.advancedSettingsState.textContent = advancedSettingsDirty ? '고급값 변경됨 · 적용 필요' : '고급값 대기 없음';
}

function getFirstControlValue(controlList, fallbackValue) {
  const controls = Array.isArray(controlList) ? controlList : [];
  const firstControl = controls.find((control) => control);
  if (!firstControl) return fallbackValue;
  return firstControl.value;
}

function syncMirroredControls(controlList, nextValue, sourceControl = null) {
  const controls = Array.isArray(controlList) ? controlList : [];
  for (const control of controls) {
    if (!control || control === sourceControl) continue;
    if (control.value !== nextValue) control.value = nextValue;
  }
}

function syncAdvancedFormFromState() {
  if (elements.geometryCoordModeSelect) elements.geometryCoordModeSelect.value = advancedSettings.geometryCoordMode;
  for (const control of elements.exportScaleSelectControls) {
    if (control) control.value = String(advancedSettings.exportScale);
  }
  for (const control of elements.exportJpgQualityInputs) {
    if (control) control.value = String(advancedSettings.exportJpgQuality);
  }
  if (elements.selectionExportPaddingInput) elements.selectionExportPaddingInput.value = String(advancedSettings.selectionExportPadding);
  if (elements.selectionExportBackgroundSelect) elements.selectionExportBackgroundSelect.value = advancedSettings.selectionExportBackground;
  markAdvancedSettingsDirty(false);
}

function applyAdvancedSettingsFromForm() {
  const nextCoordMode = elements.geometryCoordModeSelect?.value === 'absolute' ? 'absolute' : 'relative';
  const nextScaleRaw = Number.parseFloat(getFirstControlValue(elements.exportScaleSelectControls, '1'));
  const nextScale = nextScaleRaw >= 2.5 ? 3 : (nextScaleRaw >= 1.5 ? 2 : 1);
  const nextJpgRaw = Number.parseFloat(getFirstControlValue(elements.exportJpgQualityInputs, String(DEFAULT_JPG_QUALITY)));
  const nextJpgQuality = Number.isFinite(nextJpgRaw) ? Math.min(1, Math.max(0.1, nextJpgRaw)) : DEFAULT_JPG_QUALITY;
  const nextPaddingRaw = Number.parseFloat(elements.selectionExportPaddingInput?.value || '16');
  const nextPadding = Number.isFinite(nextPaddingRaw) ? Math.max(0, Math.min(240, Math.round(nextPaddingRaw))) : 16;
  const nextBackground = elements.selectionExportBackgroundSelect?.value === 'opaque' ? 'opaque' : 'transparent';

  advancedSettings.geometryCoordMode = nextCoordMode;
  advancedSettings.exportScale = nextScale;
  advancedSettings.exportJpgQuality = nextJpgQuality;
  advancedSettings.selectionExportPadding = nextPadding;
  advancedSettings.selectionExportBackground = nextBackground;
  geometryCoordMode = nextCoordMode;
  syncGeometryControls();
  syncAdvancedFormFromState();
  return {
    ok: true,
    message: `고급값 적용 완료 (좌표 ${nextCoordMode}, 배율 ${nextScale}x, JPG ${nextJpgQuality.toFixed(2)})`,
  };
}

function applyAdvancedSettingsIfDirty() {
  if (!advancedSettingsDirty) return false;
  applyAdvancedSettingsFromForm();
  return true;
}

function readPanelLayoutState() {
  try {
    const raw = window.localStorage.getItem(PANEL_LAYOUT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      basicOpen: parsed.basicOpen !== false,
      advancedOpen: parsed.advancedOpen === true,
    };
  } catch {
    return null;
  }
}

function persistPanelLayoutState() {
  try {
    window.localStorage.setItem(PANEL_LAYOUT_STORAGE_KEY, JSON.stringify({
      basicOpen: !!elements.basicAttributeSection?.open,
      advancedOpen: !!elements.advancedAttributeSection?.open,
    }));
  } catch {}
}

function restorePanelLayoutState() {
  const saved = readPanelLayoutState();
  if (!saved) return;
  if (elements.basicAttributeSection) elements.basicAttributeSection.open = saved.basicOpen;
  if (elements.advancedAttributeSection) elements.advancedAttributeSection.open = saved.advancedOpen;
}

function setSidebarTab(panelId) {
  const scope = String(panelId || '').startsWith('left-')
    ? 'left'
    : (String(panelId || '').startsWith('right-') ? 'right' : '');
  if (!scope) return;
  for (const button of elements.sidebarTabButtons) {
    const buttonScope = String(button.dataset.sidebarTab || '').startsWith('left-')
      ? 'left'
      : (String(button.dataset.sidebarTab || '').startsWith('right-') ? 'right' : '');
    if (buttonScope !== scope) continue;
    button.classList.toggle('is-active', button.dataset.sidebarTab === panelId);
  }
  for (const panel of elements.sidebarPanels) {
    const panelScope = String(panel.dataset.sidebarPanel || '').startsWith('left-')
      ? 'left'
      : (String(panel.dataset.sidebarPanel || '').startsWith('right-') ? 'right' : '');
    if (panelScope !== scope) continue;
    panel.classList.toggle('is-active', panel.dataset.sidebarPanel === panelId);
  }
}

function setCodeSource(nextSource, { preserveDraft = true } = {}) {
  currentCodeSource = nextSource || 'edited';
  for (const button of elements.codeSourceButtons) {
    button.classList.toggle('is-active', button.dataset.codeSource === currentCodeSource);
  }
  if (!preserveDraft) codeEditorDirty = false;
  refreshCodeEditorFromState({ force: !preserveDraft });
}

function currentProjectHtmlText(state) {
  const project = state?.project || null;
  if (!project) return '';
  if (currentCodeSource === 'normalized') return project.normalizedHtml || '';
  if (currentCodeSource === 'original') return project.originalHtml || '';
  if (currentCodeSource === 'report') return JSON.stringify(buildReportPayload(project, getEditorReport(project)), null, 2);
  return elements.editedCodeView?.textContent || '';
}

function refreshCodeEditorFromState({ force = false } = {}) {
  if (!elements.codeEditorTextarea) return;
  const textarea = elements.codeEditorTextarea;
  if (codeEditorDirty && !force && document.activeElement === textarea) return;
  const nextValue = currentProjectHtmlText(store.getState());
  textarea.value = nextValue;
  textarea.readOnly = currentCodeSource === 'report';
  codeEditorDirty = false;
}

function getCanvasIntrinsicWidth() {
  const doc = elements.previewFrame?.contentDocument;
  return Math.max(860, doc?.documentElement?.scrollWidth || 0, doc?.body?.scrollWidth || 0);
}

function applyPreviewZoom() {
  const viewport = elements.previewViewport;
  const scaler = elements.previewScaler;
  if (!viewport || !scaler) return;
  const intrinsic = getCanvasIntrinsicWidth();
  scaler.style.width = `${intrinsic}px`;
  const fitScale = Math.max(0.35, Math.min(2.25, (viewport.clientWidth - 32) / intrinsic));
  const scale = zoomState.mode === 'fit' ? fitScale : zoomState.value;
  scaler.style.setProperty('--preview-scale', String(scale));
  if (elements.zoomLabel) elements.zoomLabel.textContent = `${Math.round(scale * 100)}%`;
  if (elements.zoomFitButton) elements.zoomFitButton.classList.toggle('is-active', zoomState.mode === 'fit');
}

function setZoom(mode, value = null) {
  if (mode === 'fit') {
    zoomState.mode = 'fit';
  } else {
    zoomState.mode = 'manual';
    const next = Number.isFinite(value) ? value : zoomState.value;
    zoomState.value = Math.max(0.35, Math.min(2.25, next));
  }
  applyPreviewZoom();
}

function nudgeZoom(delta) {
  const current = zoomState.mode === 'fit' ? Number.parseFloat((elements.zoomLabel?.textContent || '100').replace('%', '')) / 100 : zoomState.value;
  setZoom('manual', current + delta);
}

function syncWorkspaceButtons() {
  document.body.classList.toggle('layout--left-collapsed', document.body.classList.contains('layout--left-collapsed'));
  document.body.classList.toggle('layout--right-collapsed', document.body.classList.contains('layout--right-collapsed'));
  if (elements.toggleLeftSidebarButton) elements.toggleLeftSidebarButton.classList.toggle('is-active', !document.body.classList.contains('layout--left-collapsed'));
  if (elements.toggleRightSidebarButton) elements.toggleRightSidebarButton.classList.toggle('is-active', !document.body.classList.contains('layout--right-collapsed'));
  if (elements.focusModeButton) elements.focusModeButton.classList.toggle('is-active', document.body.classList.contains('layout--focus-stage'));
}

function syncExportPresetUi({ forceScale = false } = {}) {
  const preset = currentExportPreset();
  if (elements.exportPresetSelect.value !== preset.id) elements.exportPresetSelect.value = preset.id;
  const shouldSyncScale = forceScale;
  const presetScale = Number.parseFloat(String(preset.scale));
  const normalizedScale = presetScale >= 2.5 ? '3' : presetScale >= 1.5 ? '2' : '1';
  if (shouldSyncScale && EXPORT_SCALE_OPTIONS.includes(Number.parseFloat(normalizedScale))) {
    syncMirroredControls(elements.exportScaleSelectControls, normalizedScale);
    markAdvancedSettingsDirty(true);
  }
  if (elements.exportPresetPackageButton) elements.exportPresetPackageButton.title = preset.description || '';
}

function setSelectionMode(nextMode) {
  store.setSelectionMode(nextMode);
  activeEditor?.setSelectionMode(nextMode);
}

function renderViewButtons(currentView) {
  for (const button of elements.viewButtons) {
    button.classList.toggle('is-active', button.dataset.view === currentView);
  }
  for (const panel of elements.viewPanels) {
    panel.hidden = panel.dataset.stageView !== currentView;
  }
}

function renderSelectionModeButtons(currentMode) {
  for (const button of elements.selectionModeButtons) {
    button.classList.toggle('is-active', button.dataset.selectionMode === currentMode);
  }
}

function renderTextAlignButtons(currentAlign, enabled) {
  for (const button of elements.textAlignButtons) {
    button.classList.toggle('is-active', enabled && button.dataset.textAlign === currentAlign);
    button.disabled = !enabled;
  }
}

function readAutosavePayload() {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistAutosave(snapshot) {
  const project = store.getState().project;
  if (!project || !snapshot) return;
  const payload = {
    savedAt: new Date().toISOString(),
    sourceName: project.sourceName,
    sourceType: project.sourceType,
    fixtureId: project.fixtureId || '',
    snapshot,
  };
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
  } catch {}
}

function refreshHistoryButtons() {
  const hasProject = !!store.getState().project;
  if (elements.undoButton) elements.undoButton.disabled = !hasProject || historyState.undoStack.length === 0;
  if (elements.redoButton) elements.redoButton.disabled = !hasProject || historyState.redoStack.length === 0;
  if (elements.restoreAutosaveButton) elements.restoreAutosaveButton.disabled = !readAutosavePayload();
}

function resetHistory(baseSnapshot = null) {
  historyState.baseSnapshot = baseSnapshot?.html ? baseSnapshot : null;
  historyState.undoStack = [];
  historyState.redoStack = [];
  refreshHistoryButtons();
}

function latestHistorySnapshot() {
  return historyState.undoStack.at(-1)?.after || historyState.baseSnapshot;
}

function recordHistoryCommand(command, { clearRedo = true } = {}) {
  if (!command?.after?.html || !command?.before?.html) return;
  const last = historyState.undoStack.at(-1);
  if (last?.after?.html === command.after.html) {
    persistAutosave(command.after);
    refreshHistoryButtons();
    return;
  }
  historyState.undoStack.push(command);
  if (historyState.undoStack.length > HISTORY_LIMIT) historyState.undoStack.shift();
  if (clearRedo) historyState.redoStack = [];
  persistAutosave(command.after);
  refreshHistoryButtons();
}

function restoreHistorySnapshot(snapshot, label) {
  const project = store.getState().project;
  if (!project || !snapshot) return;
  mountProject(project, { snapshot, preserveHistory: true, force: true });
  setStatus(label);
}

function undoHistory() {
  if (!historyState.undoStack.length) {
    setStatus('되돌릴 작업이 없습니다.');
    return;
  }
  const current = historyState.undoStack.pop();
  historyState.redoStack.push(current);
  refreshHistoryButtons();
  restoreHistorySnapshot(current.before, '이전 작업으로 되돌렸습니다.');
}

function redoHistory() {
  if (!historyState.redoStack.length) {
    setStatus('다시 적용할 작업이 없습니다.');
    return;
  }
  const next = historyState.redoStack.pop();
  historyState.undoStack.push(next);
  refreshHistoryButtons();
  restoreHistorySnapshot(next.after, '되돌린 작업을 다시 적용했습니다.');
}

function buildReportPayload(project, report) {
  return {
    project: {
      id: project.id,
      fixtureId: project.fixtureId,
      sourceName: project.sourceName,
      sourceType: project.sourceType,
    },
    report,
    history: {
      undoDepth: historyState.undoStack.length,
      redoDepth: historyState.redoStack.length,
      autosaveSavedAt: readAutosavePayload()?.savedAt || '',
    },
    summary: project.summary,
    issues: project.issues,
    assets: project.assets,
    preflight: report.preflight || null,
    save: {
      selectedFormat: currentSaveFormat,
      lastConversion: lastSaveConversion,
    },
  };
}

function getEditorReport(project) {
  if (activeEditor) return activeEditor.getReport();
  return {
    sourceName: project.sourceName,
    sourceType: project.sourceType,
    slotSummary: project.slotDetection?.summary || project.summary,
    slots: project.slotDetection?.candidates || [],
    nearMisses: project.slotDetection?.nearMisses || [],
    modifiedSlotCount: 0,
    layerTree: [],
    selectedItems: [],
    selectionCount: 0,
    generatedAt: new Date().toISOString(),
  };
}

function refreshComputedViews(state) {
  const project = state.project;
  if (elements.normalizedCodeView) elements.normalizedCodeView.textContent = project?.normalizedHtml || '';
  if (elements.originalCodeView) elements.originalCodeView.textContent = project?.originalHtml || '';

  if (!project) {
    if (elements.editedCodeView) elements.editedCodeView.textContent = '';
    if (elements.jsonReportView) elements.jsonReportView.textContent = '';
    refreshCodeEditorFromState({ force: true });
    return;
  }

  const editedHtml = activeEditor ? activeEditor.getEditedHtml({ persistDetectedSlots: true }) : project.normalizedHtml;
  if (elements.editedCodeView) elements.editedCodeView.textContent = editedHtml;
  const report = getEditorReport(project);
  if (elements.jsonReportView) elements.jsonReportView.textContent = JSON.stringify(buildReportPayload(project, report), null, 2);
  refreshCodeEditorFromState();
}

function syncTextStyleControls(editorMeta) {
  const style = editorMeta?.textStyle || null;
  const enabled = !!style?.enabled;
  const inputs = [
    elements.textFontSizeInput,
    elements.textLineHeightInput,
    elements.textLetterSpacingInput,
    elements.textWeightSelect,
    elements.textColorInput,
    elements.applyTextStyleButton,
    elements.clearTextStyleButton,
  ];
  for (const input of inputs) {
    if (!input) continue;
    input.disabled = !enabled;
  }
  renderTextAlignButtons(style?.textAlign || '', enabled);
  elements.textStyleSummary.textContent = enabled
    ? `텍스트 ${style.targetCount || 1}개 선택`
    : '텍스트 미선택';

  elements.textFontSizeInput.value = enabled && style.fontSize ? String(style.fontSize) : '';
  elements.textLineHeightInput.value = enabled && style.lineHeight ? String(style.lineHeight) : '';
  elements.textLetterSpacingInput.value = enabled && style.letterSpacing ? String(style.letterSpacing) : '';
  elements.textWeightSelect.value = enabled && style.fontWeight ? String(style.fontWeight) : '';
  elements.textColorInput.value = enabled && style.color ? style.color : '#333333';
}

function syncBatchSummary(editorMeta) {
  const count = Number(editorMeta?.selectionCount || 0);
  elements.batchSelectionSummary.textContent = count > 1 ? `${count}개 동시 선택` : '1개 이하 선택';
}

function syncGeometryControls() {
  const geometry = activeEditor?.getSelectionGeometry?.() || null;
  const enabled = !!geometry;
  const controls = [
    elements.geometryCoordModeSelect,
    elements.geometryXInput,
    elements.geometryYInput,
    elements.geometryWInput,
    elements.geometryHInput,
    elements.applyGeometryButton,
    elements.bringForwardButton,
    elements.sendBackwardButton,
    elements.bringToFrontButton,
    elements.sendToBackButton,
    elements.imageNudgeLeftButton,
    elements.imageNudgeRightButton,
    elements.imageNudgeUpButton,
    elements.imageNudgeDownButton,
  ];
  for (const control of controls) {
    if (!control) continue;
    control.disabled = !enabled;
  }
  if (!enabled) {
    for (const input of [elements.geometryXInput, elements.geometryYInput, elements.geometryWInput, elements.geometryHInput]) {
      if (!input) continue;
      input.value = '';
      input.placeholder = '';
      input.dataset.mixed = '0';
    }
    if (elements.geometryRuleHint) elements.geometryRuleHint.textContent = '요소를 선택하면 좌표/크기를 표시합니다.';
    return;
  }
  const mode = geometryCoordMode === 'absolute' ? 'absolute' : 'relative';
  const group = geometry[mode] || geometry.relative;
  const mapping = [
    [elements.geometryXInput, 'x'],
    [elements.geometryYInput, 'y'],
    [elements.geometryWInput, 'w'],
    [elements.geometryHInput, 'h'],
  ];
  for (const [input, key] of mapping) {
    if (!input) continue;
    const mixed = !!group?.mixed?.[key];
    input.dataset.mixed = mixed ? '1' : '0';
    input.placeholder = mixed ? '혼합' : '';
    input.value = mixed ? '' : String(group?.[key] ?? '');
  }
  const modeText = mode === 'absolute'
    ? '절대 좌표: 문서의 왼쪽/위(0,0) 기준'
    : '상대 좌표: 각 요소의 transform 이동값 기준';
  if (elements.geometryRuleHint) {
    elements.geometryRuleHint.textContent = `${modeText} · Shift=10px, Alt=1px, 기본=2px`;
  }
}

function resolveCanvasContextScope(editorMeta) {
  const count = Number(editorMeta?.selectionCount || 0);
  if (count > 1) return 'multi';
  if (count < 1) return '';
  const selectedType = editorMeta?.selectedItems?.[0]?.type || editorMeta?.selected?.type || '';
  if (selectedType === 'slot') return 'image';
  if (selectedType === 'text') return 'text';
  return '';
}

function executeCanvasContextAction(action) {
  if (!activeEditor) return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
  if (action === 'duplicate' || action === 'delete') return executeEditorCommand(action);
  if (action === 'layer-index-forward') return executeEditorCommand('layer-index-forward');
  if (action === 'layer-index-backward') return executeEditorCommand('layer-index-backward');
  if (action === 'layer-index-front') return executeEditorCommand('layer-index-front');
  if (action === 'layer-index-back') return executeEditorCommand('layer-index-back');
  if (action === 'toggle-text-edit') return executeEditorCommand('toggle-text-edit');
  if (action === 'image-cover') return activeEditor.applyImagePreset('cover');
  if (action === 'image-contain') return activeEditor.applyImagePreset('contain');
  if (action === 'image-nudge-left') return activeEditor.nudgeSelectedImage({ dx: -2, dy: 0 });
  if (action === 'image-nudge-right') return activeEditor.nudgeSelectedImage({ dx: 2, dy: 0 });
  if (action === 'image-nudge-up') return activeEditor.nudgeSelectedImage({ dx: 0, dy: -2 });
  if (action === 'image-nudge-down') return activeEditor.nudgeSelectedImage({ dx: 0, dy: 2 });
  if ([
    'same-width',
    'same-height',
    'same-size',
    'align-left',
    'align-center',
    'align-right',
    'align-top',
    'align-middle',
    'align-bottom',
    'distribute-horizontal',
    'distribute-vertical',
  ].includes(action)) return activeEditor.applyBatchLayout(action);
  return { ok: false, message: `지원하지 않는 명령입니다: ${action}` };
}

function syncCanvasDirectUi(editorMeta) {
  const selectionCount = Number(editorMeta?.selectionCount || 0);
  const hasSelection = selectionCount > 0;
  if (elements.canvasContextBar) elements.canvasContextBar.hidden = !hasSelection;
  if (!hasSelection) return;

  const scope = resolveCanvasContextScope(editorMeta);
  for (const button of elements.canvasActionButtons) {
    const buttonScope = button.dataset.canvasScope || 'common';
    const visible = buttonScope === 'common' || (scope && buttonScope === scope);
    button.hidden = !visible;
    button.disabled = !visible || !activeEditor;
  }

  const geometryEnabled = !!activeEditor?.getSelectionGeometry?.();
  const mirrorPairs = [
    [elements.canvasGeometryXInput, elements.geometryXInput],
    [elements.canvasGeometryYInput, elements.geometryYInput],
    [elements.canvasGeometryWInput, elements.geometryWInput],
    [elements.canvasGeometryHInput, elements.geometryHInput],
  ];
  for (const [canvasInput, sourceInput] of mirrorPairs) {
    if (!canvasInput || !sourceInput) continue;
    canvasInput.value = sourceInput.value;
    canvasInput.placeholder = sourceInput.placeholder || '';
    canvasInput.dataset.mixed = sourceInput.dataset.mixed || '0';
    canvasInput.disabled = !geometryEnabled;
  }
  if (elements.applyCanvasGeometryButton) elements.applyCanvasGeometryButton.disabled = !geometryEnabled;
}

function applyGeometryFromInputs() {
  if (!activeEditor) return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
  const values = {
    x: Number.parseFloat(elements.geometryXInput.value),
    y: Number.parseFloat(elements.geometryYInput.value),
    w: Number.parseFloat(elements.geometryWInput.value),
    h: Number.parseFloat(elements.geometryHInput.value),
  };
  const patch = {};
  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value)) continue;
    patch[key] = value;
  }
  if (!Object.keys(patch).length) return { ok: false, message: '적용할 숫자 값을 입력해 주세요.' };
  return activeEditor.applyGeometryPatch(patch, { coordinateSpace: geometryCoordMode });
}

function renderShell(state) {
  renderViewButtons(state.currentView);
  renderSelectionModeButtons(state.selectionMode);
  renderSummaryCards(elements.summaryCards, state.project, state.editorMeta);
  renderIssueList(elements.issueList, state.project);
  renderNormalizeStats(elements.normalizeStats, state.project);
  renderPreflight(elements.preflightContainer, state.editorMeta);
  renderSelectionInspector(elements.selectionInspector, state.editorMeta);
  renderSlotList(elements.slotList, state.editorMeta);
  renderLayerTree(elements.layerTree, state.editorMeta, elements.layerFilterInput.value);
  renderProjectMeta(elements.projectMeta, state.project, {
    selectionMode: state.selectionMode,
    undoDepth: historyState.undoStack.length,
    redoDepth: historyState.redoStack.length,
    autosaveSavedAt: readAutosavePayload()?.savedAt || '',
    textEditing: !!state.editorMeta?.textEditing,
    selectionCount: state.editorMeta?.selectionCount || 0,
    hiddenCount: state.editorMeta?.hiddenCount || 0,
    lockedCount: state.editorMeta?.lockedCount || 0,
    exportPresetLabel: currentExportPreset().label,
    preflightBlockingErrors: state.editorMeta?.preflight?.blockingErrors || 0,
  });
  renderAssetTable(elements.assetTableWrap, state.project, elements.assetFilterInput.value);
  syncTextStyleControls(state.editorMeta);
  syncBatchSummary(state.editorMeta);
  syncGeometryControls();
  syncCanvasDirectUi(state.editorMeta);
  const errorSuffix = state.lastError ? ` · 최근 오류: ${state.lastError}` : '';
  elements.statusText.textContent = `${state.statusText}${errorSuffix}`;
  refreshComputedViews(state);

  const hasProject = !!state.project;
  const hasEditor = !!activeEditor;
  elements.replaceImageButton.disabled = !hasEditor;
  elements.manualSlotButton.disabled = !hasEditor;
  elements.demoteSlotButton.disabled = !hasEditor;
  elements.redetectButton.disabled = !hasEditor;
  elements.toggleHideButton.disabled = !hasEditor || (state.editorMeta?.selectionCount || 0) < 1;
  elements.toggleLockButton.disabled = !hasEditor || (state.editorMeta?.selectionCount || 0) < 1;
  if (elements.arrangeToggleHideButton) elements.arrangeToggleHideButton.disabled = elements.toggleHideButton.disabled;
  if (elements.arrangeToggleLockButton) elements.arrangeToggleLockButton.disabled = elements.toggleLockButton.disabled;
  elements.textEditButton.disabled = !hasEditor;
  elements.groupButton.disabled = !hasEditor || !state.editorMeta?.canGroupSelection;
  elements.ungroupButton.disabled = !hasEditor || !state.editorMeta?.canUngroupSelection;
  elements.preflightRefreshButton.disabled = !hasEditor;
  for (const button of elements.batchActionButtons) {
    const requiresMany = button.dataset.batchAction !== 'reset-transform';
    const needed = requiresMany ? 2 : 1;
    button.disabled = !hasEditor || (state.editorMeta?.selectionCount || 0) < needed;
  }
  elements.downloadEditedButton.disabled = !hasProject;
  elements.downloadNormalizedButton.disabled = !hasProject;
  elements.downloadLinkedZipButton.disabled = !hasEditor;
  elements.exportPngButton.disabled = !hasEditor;
  elements.exportJpgButton.disabled = !hasEditor;
  elements.exportSectionsZipButton.disabled = !hasEditor;
  elements.exportSelectionPngButton.disabled = !hasEditor || (state.editorMeta?.selectionCount || 0) < 1;
  elements.exportPresetPackageButton.disabled = !hasEditor;
  elements.downloadReportButton.disabled = !hasProject;
  if (elements.applyCodeToEditorButton) elements.applyCodeToEditorButton.disabled = !hasProject || currentCodeSource === 'report';
  if (elements.reloadCodeFromEditorButton) elements.reloadCodeFromEditorButton.disabled = !hasProject;
  if (elements.saveFormatSelect) elements.saveFormatSelect.disabled = !hasProject;
  if (elements.applyAdvancedSettingsButton) elements.applyAdvancedSettingsButton.disabled = !hasProject;
  syncExportPresetUi();
  syncSaveFormatUi();
  syncWorkspaceButtons();
  syncWorkflowUi(state);
  applyPreviewZoom();
  refreshHistoryButtons();
}

function renderEmptyPreview() {
  elements.previewFrame.srcdoc = `
    <div class="empty-stage">
      <div>
        <strong>아직 프로젝트가 없습니다.</strong><br />
        HTML 파일, 프로젝트 폴더, 붙여넣기, fixture 중 하나를 불러와 주세요.
      </div>
    </div>`;
}

function handleEditorShortcut(action) {
  if (action === 'undo') return undoHistory();
  if (action === 'redo') return redoHistory();
  if (action === 'save-edited') return downloadEditedHtml().catch((error) => setStatus(`문서 저장 중 오류: ${error?.message || error}`));
  if (action === 'toggle-shortcut-help') return toggleShortcutHelp();
}

function executeEditorCommand(command, payload = {}, { refresh = true } = {}) {
  if (!activeEditor) {
    setStatus('먼저 미리보기를 로드해 주세요.');
    return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
  }
  const result = activeEditor.executeCommand ? activeEditor.executeCommand(command, payload) : { ok: false, message: `지원하지 않는 명령입니다: ${command}` };
  setStatus(result.message);
  if (refresh && (store.getState().currentView === 'edited' || store.getState().currentView === 'report')) refreshComputedViews(store.getState());
  return result;
}

function mountProject(project, { snapshot = null, preserveHistory = false, force = false } = {}) {
  if (activeEditor) {
    try { activeEditor.destroy(); } catch {}
    activeEditor = null;
  }

  if (force) mountedProjectId = '';
  mountedProjectId = project?.id || '';
  if (!project) {
    renderEmptyPreview();
    store.setEditorMeta(null);
    return;
  }

  elements.previewFrame.onload = () => {
    const liveProject = store.getState().project;
    if (!liveProject || liveProject.id !== project.id) return;
    activeEditor = createFrameEditor({
      iframe: elements.previewFrame,
      project,
      selectionMode: snapshot?.selectionMode || store.getState().selectionMode,
      initialSnapshot: snapshot,
      onStateChange: (meta) => store.setEditorMeta(meta),
      onStatus: setStatus,
      onMutation: (command) => {
        recordHistoryCommand(command);
        if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
      },
      onShortcut: handleEditorShortcut,
    });
    if (snapshot?.selectionMode) store.setSelectionMode(snapshot.selectionMode);
    store.setEditorMeta(activeEditor.getMeta());
    applyPreviewZoom();
    if (!preserveHistory) {
      resetHistory(activeEditor.captureSnapshot('initial'));
      persistAutosave(historyState.baseSnapshot);
      refreshHistoryButtons();
    } else {
      persistAutosave(latestHistorySnapshot() || activeEditor.captureSnapshot('restore'));
      refreshHistoryButtons();
    }
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  };
  elements.previewFrame.srcdoc = snapshot?.html || project.normalizedHtml;
}

function loadFixture(fixtureId) {
  try {
    const fixtureMeta = getFixtureMeta(fixtureId);
    const html = FIXTURE_SOURCE_MAP[fixtureId] || '';
    if (!fixtureMeta || !html) {
      setStatus(`Fixture ${fixtureId}를 찾지 못했습니다.`);
      return;
    }
    pendingMountOptions = { snapshot: null, preserveHistory: false };
    const project = normalizeProject({ html, sourceName: fixtureMeta.name, sourceType: 'fixture', fixtureMeta });
    store.setProject(project);
    setStatus(`Fixture ${fixtureId}를 불러왔습니다. 슬롯 후보 ${project.summary.totalSlotCandidates}개, 자산 ${project.summary.assetsTotal}개입니다.`);
  } catch (error) {
    setStatusWithError('초기 로딩 중 오류가 발생했습니다. 브라우저 콘솔(F12)을 확인해 주세요.', error, { logTag: 'LOAD_FIXTURE_ERROR' });
  }
}

async function openHtmlFile(file) {
  if (!file) return;
  const requestId = importRequestSequence += 1;
  try {
    const html = await file.text();
    if (requestId !== importRequestSequence) return;
    const fileIndex = createImportFileIndex([file], 'html-file');
    pendingMountOptions = { snapshot: null, preserveHistory: false };
    const project = normalizeProject({ html, sourceName: file.name, sourceType: 'html-file', fileIndex, htmlEntryPath: file.name });
    if (requestId !== importRequestSequence) return;
    store.setProject(project);
    setStatus(`HTML 파일 ${file.name}을 불러왔습니다. 미해결 자산 ${project.summary.assetsUnresolved}개입니다.`);
  } catch (error) {
    setStatusWithError('HTML 파일 열기 중 오류가 발생했습니다. 브라우저 콘솔(F12)을 확인해 주세요.', error, { logTag: 'OPEN_HTML_FILE_ERROR' });
  }
}

async function handleFolderImport(files) {
  const requestId = importRequestSequence += 1;
  try {
    const fileIndex = createImportFileIndex(files, 'folder-import');
    const htmlEntry = choosePrimaryHtmlEntry(fileIndex);
    if (!htmlEntry) {
      setStatus('선택한 폴더에 HTML 파일이 없습니다.');
      return;
    }
    const html = await htmlEntry.file.text();
    if (requestId !== importRequestSequence) return;
    pendingMountOptions = { snapshot: null, preserveHistory: false };
    const project = normalizeProject({
      html,
      sourceName: htmlEntry.relativePath,
      sourceType: 'folder-import',
      fileIndex,
      htmlEntryPath: htmlEntry.relativePath,
    });
    if (fileIndex.htmlEntries.length > 1) {
      project.issues.unshift({
        id: `issue_multi_html_${Date.now()}`,
        level: 'info',
        code: 'MULTI_HTML',
        message: `HTML 파일이 ${fileIndex.htmlEntries.length}개라서 ${htmlEntry.relativePath}를 우선 사용했습니다.`,
      });
    }
    if (requestId !== importRequestSequence) return;
    store.setProject(project);
    setStatus(`프로젝트 폴더 import 완료: ${htmlEntry.relativePath}. resolved ${project.summary.assetsResolved}개, unresolved ${project.summary.assetsUnresolved}개입니다.`);
  } catch (error) {
    setStatusWithError('폴더 import 중 오류가 발생했습니다. 브라우저 콘솔(F12)을 확인해 주세요.', error, { logTag: 'FOLDER_IMPORT_ERROR' });
  }
}

function applyPastedHtml() {
  try {
    const html = elements.htmlPasteInput.value.trim();
    if (!html) {
      setStatus('붙여넣기 HTML이 비어 있습니다.');
      return;
    }
    pendingMountOptions = { snapshot: null, preserveHistory: false };
    const project = normalizeProject({ html, sourceName: 'pasted-html', sourceType: 'paste' });
    store.setProject(project);
    setStatus(`붙여넣기 HTML을 정규화했습니다. 슬롯 후보 ${project.summary.totalSlotCandidates}개를 찾았습니다.`);
  } catch (error) {
    setStatusWithError('붙여넣기 적용 중 오류가 발생했습니다. 브라우저 콘솔(F12)을 확인해 주세요.', error, { logTag: 'APPLY_PASTED_HTML_ERROR' });
  }
}

function downloadNormalizedHtml() {
  const project = store.getState().project;
  if (!project) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const fileName = `${projectBaseName(project)}__normalized.html`;
  downloadTextFile(fileName, project.normalizedHtml, 'text/html;charset=utf-8');
  setStatus(`정규화 HTML을 저장했습니다: ${fileName}`);
}

async function downloadEditedHtml() {
  const project = store.getState().project;
  if (!project) return setStatus('먼저 프로젝트를 불러와 주세요.');
  if (!activeEditor) {
    const fileName = `${projectBaseName(project)}__edited_working.html`;
    downloadTextFile(fileName, project.normalizedHtml, 'text/html;charset=utf-8');
    setStatus(`편집 HTML을 저장했습니다: ${fileName} · 다음: 이 파일을 다시 열 때는 상단 "HTML 열기"를 누른 뒤 방금 저장한 파일을 선택하세요.`);
    return;
  }
  await downloadByFormat(currentSaveFormat);
}

function ensurePreflightBeforeExport(kind) {
  if (!activeEditor) return false;
  const preflight = activeEditor.getPreflightReport();
  if (!preflight?.blockingErrors) return true;
  const proceed = window.confirm(`출력 전 검수에서 오류 ${preflight.blockingErrors}개가 감지되었습니다.\n빈 슬롯 또는 미해결 자산이 포함될 수 있습니다.\n그래도 ${kind}을(를) 계속하시겠습니까?`);
  if (!proceed) {
    setStatus(`출력 전 검수 오류 때문에 ${kind}을(를) 중단했습니다.`);
    return false;
  }
  return true;
}

async function ensureFixtureIntegrityBeforeExport(kind) {
  if (!activeEditor) return false;
  const report = await activeEditor.getExportFixtureIntegrityReport?.();
  if (!report || report.ok) return true;
  const preview = (report.issues || []).slice(0, 3).join('\n- ');
  const proceed = window.confirm(`Fixture 기준 export 검증에서 문제를 찾았습니다.\n- ${preview}\n그래도 ${kind}을(를) 계속하시겠습니까?`);
  if (!proceed) {
    setStatus(`Fixture 기준 export 검증 문제 때문에 ${kind}을(를) 중단했습니다.`);
    return false;
  }
  return true;
}

async function downloadLinkedZip() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  if (!ensurePreflightBeforeExport('링크형 ZIP 저장')) return;
  await downloadByFormat('linked', { forceZip: true });
}

async function downloadByFormat(format, { forceZip = false } = {}) {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const saveFormat = normalizeSaveFormat(format);
  const result = await activeEditor.getSavePackageEntries(saveFormat);
  lastSaveConversion = {
    ...result.conversion,
    savedAt: new Date().toISOString(),
  };

  if (saveFormat === 'embedded' && !forceZip) {
    const entry = result.entries[0];
    const text = new TextDecoder().decode(entry.data);
    downloadTextFile(entry.name, text, 'text/html;charset=utf-8');
    setStatus(`embedded HTML을 저장했습니다: ${entry.name} (blob→data ${result.conversion?.portableRewrite?.blobConvertedToDataUrl || 0}개) · 다음: 파일을 더블클릭하거나, 상단 "HTML 열기"로 재오픈하세요.`);
    syncSaveFormatUi();
    return;
  }

  const zipBlob = await buildZipBlob(result.entries);
  const suffix = saveFormat === 'embedded' ? '__embedded_package.zip' : '__linked_package.zip';
  const fileName = `${projectBaseName(project)}${suffix}`;
  downloadBlob(fileName, zipBlob);
  const warningCount = Number(result.conversion?.brokenLinkedPathWarnings?.length || 0);
  const warningText = warningCount > 0 ? ` · 경고 ${warningCount}건(BROKEN_LINKED_PATH)` : '';
  setStatus(`${saveFormat} 패키지를 저장했습니다: ${fileName}${warningText} · 다음: ZIP 압축을 풀고 HTML + assets 폴더를 같은 위치에 둔 뒤 HTML을 다시 여세요.`);
  syncSaveFormatUi();
}

async function exportFullPng() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const autoApplied = applyAdvancedSettingsIfDirty();
  if (!ensurePreflightBeforeExport('전체 PNG 저장')) return;
  if (!(await ensureFixtureIntegrityBeforeExport('전체 PNG 저장'))) return;
  const blob = await activeEditor.exportFullPngBlob(exportScale());
  const fileName = `${projectBaseName(project)}__full.png`;
  downloadBlob(fileName, blob);
  setStatus(`전체 PNG를 저장했습니다: ${fileName} (${exportScale()}x)${autoApplied ? ' · 변경된 고급값 자동 반영' : ''}`);
}

async function exportFullJpg() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const autoApplied = applyAdvancedSettingsIfDirty();
  if (!ensurePreflightBeforeExport('전체 JPG 저장')) return;
  if (!(await ensureFixtureIntegrityBeforeExport('전체 JPG 저장'))) return;
  const quality = exportJpgQuality();
  const blob = await activeEditor.exportFullJpgBlob(exportScale(), quality);
  const fileName = `${projectBaseName(project)}__full.jpg`;
  downloadBlob(fileName, blob);
  setStatus(`전체 JPG를 저장했습니다: ${fileName} (${exportScale()}x, 품질 ${quality.toFixed(2)})${autoApplied ? ' · 변경된 고급값 자동 반영' : ''}`);
}

async function exportSelectionPng() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const autoApplied = applyAdvancedSettingsIfDirty();
  if (!(await ensureFixtureIntegrityBeforeExport('선택 영역 PNG 저장'))) return;
  const options = {
    padding: selectionExportPadding(),
    background: selectionExportBackground(),
  };
  const { blob, meta } = await activeEditor.exportSelectionPngBlob(exportScale(), options);
  const fileName = `${projectBaseName(project)}__selection.png`;
  downloadBlob(fileName, blob);
  const skipped = meta?.policy?.skippedHidden + meta?.policy?.skippedLocked || 0;
  const bgLabel = options.background === 'opaque' ? '불투명(흰색)' : '투명';
  setStatus(
    `선택 영역 PNG를 저장했습니다: ${fileName} (${exportScale()}x, union bbox, 여백 ${options.padding}px, 배경 ${bgLabel}, 포함 ${meta?.targetCount || 0}개, 제외 ${skipped}개·숨김 제외 ${meta?.policy?.excludeHidden ? 'ON' : 'OFF'}·잠금 제외 ${meta?.policy?.excludeLocked ? 'ON' : 'OFF'})${autoApplied ? ' · 변경된 고급값 자동 반영' : ''}`,
  );
}

async function exportSectionsZip() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const autoApplied = applyAdvancedSettingsIfDirty();
  if (!ensurePreflightBeforeExport('섹션 PNG ZIP 저장')) return;
  if (!(await ensureFixtureIntegrityBeforeExport('섹션 PNG ZIP 저장'))) return;
  const entries = await activeEditor.exportSectionPngEntries(exportScale());
  const zipBlob = await buildZipBlob(entries);
  const fileName = `${projectBaseName(project)}__sections_png.zip`;
  downloadBlob(fileName, zipBlob);
  setStatus(`섹션 PNG ZIP을 저장했습니다: ${fileName}${autoApplied ? ' · 변경된 고급값 자동 반영' : ''}`);
}

function downloadReportJson() {
  const project = store.getState().project;
  if (!project) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const report = getEditorReport(project);
  const fileName = `${projectBaseName(project)}__editor-report.json`;
  downloadTextFile(fileName, JSON.stringify(buildReportPayload(project, report), null, 2), 'application/json;charset=utf-8');
  setStatus(`리포트 JSON을 저장했습니다: ${fileName}`);
}

async function downloadExportPresetPackage() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  applyAdvancedSettingsIfDirty();
  const preset = currentExportPreset();
  const baseName = projectBaseName(project);
  const report = getEditorReport(project);
  const entries = [];

  const addBlobEntry = async (name, blob) => {
    if (!blob) return;
    entries.push({ name, data: new Uint8Array(await blob.arrayBuffer()) });
  };

  if (preset.bundleMode === 'basic') {
    entries.push({ name: `${baseName}__edited.html`, data: new TextEncoder().encode(activeEditor.getEditedHtml({ persistDetectedSlots: true })) });
    await addBlobEntry(`${baseName}__full.png`, await activeEditor.exportFullPngBlob(preset.scale));
    entries.push({ name: `${baseName}__report.json`, data: new TextEncoder().encode(JSON.stringify(buildReportPayload(project, report), null, 2)) });
  } else if (preset.bundleMode === 'market') {
    const linked = await activeEditor.getLinkedPackageEntries();
    for (const entry of linked) entries.push({ name: `linked/${entry.name}`, data: entry.data });
    const sections = await activeEditor.exportSectionPngEntries(preset.scale);
    for (const entry of sections) entries.push({ name: `sections/${entry.name}`, data: entry.data });
    entries.push({ name: `${baseName}__report.json`, data: new TextEncoder().encode(JSON.stringify(buildReportPayload(project, report), null, 2)) });
  } else if (preset.bundleMode === 'hires') {
    entries.push({ name: `${baseName}__edited.html`, data: new TextEncoder().encode(activeEditor.getEditedHtml({ persistDetectedSlots: true })) });
    await addBlobEntry(`${baseName}__full@2x.png`, await activeEditor.exportFullPngBlob(preset.scale));
    const sections = await activeEditor.exportSectionPngEntries(preset.scale);
    for (const entry of sections) entries.push({ name: `sections@2x/${entry.name}`, data: entry.data });
  } else if (preset.bundleMode === 'review') {
    entries.push({ name: `${baseName}__normalized.html`, data: new TextEncoder().encode(project.normalizedHtml) });
    await addBlobEntry(`${baseName}__review.png`, await activeEditor.exportFullPngBlob(preset.scale));
    entries.push({ name: `${baseName}__report.json`, data: new TextEncoder().encode(JSON.stringify(buildReportPayload(project, report), null, 2)) });
  }

  const zip = await buildZipBlob(entries);
  downloadBlob(`${baseName}__${preset.id}-preset.zip`, zip);
  setStatus(`Export preset 패키지를 저장했습니다: ${preset.label}`);
}

function restoreAutosave() {
  const payload = readAutosavePayload();
  if (!payload?.snapshot?.html) return setStatus('복구할 자동저장본이 없습니다.');
  pendingMountOptions = { snapshot: payload.snapshot, preserveHistory: false };
  const project = normalizeProject({
    html: payload.snapshot.html,
    sourceName: payload.sourceName || 'autosave.html',
    sourceType: 'autosave',
  });
  store.setProject(project);
  setStatus(`자동저장본을 복구했습니다. 저장 시각: ${payload.savedAt || '-'}`);
}

function applyTextStyleFromControls({ clear = false } = {}) {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const patch = clear ? {
    fontSize: '',
    lineHeight: '',
    letterSpacing: '',
    fontWeight: '',
    color: '',
    textAlign: '',
  } : (() => {
    const next = {};
    const fontSize = elements.textFontSizeInput.value.trim();
    const lineHeight = elements.textLineHeightInput.value.trim();
    const letterSpacing = elements.textLetterSpacingInput.value.trim();
    const fontWeight = elements.textWeightSelect.value;
    if (fontSize) next.fontSize = fontSize;
    if (lineHeight) next.lineHeight = lineHeight;
    if (letterSpacing) next.letterSpacing = letterSpacing;
    if (fontWeight) next.fontWeight = fontWeight;
    if (elements.textColorInput.value) next.color = elements.textColorInput.value;
    return next;
  })();
  const result = activeEditor.applyTextStyle(patch, { clear });
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
}

function applyBatchAction(action) {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.applyBatchLayout(action);
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
}

async function reloadCodeFromEditor() {
  const project = store.getState().project;
  if (!project) return setStatus('먼저 프로젝트를 열어 주세요.');
  if (!activeEditor) return refreshCodeEditorFromState({ force: true });
  if (currentCodeSource === 'edited') {
    const html = await activeEditor.getCurrentPortableHtml();
    elements.editedCodeView.textContent = html;
  }
  refreshCodeEditorFromState({ force: true });
  setStatus('현재 편집 상태를 코드 워크벤치로 다시 불러왔습니다.');
}

function applyCodeToEditor() {
  const project = store.getState().project;
  if (!project) return setStatus('먼저 프로젝트를 열어 주세요.');
  if (currentCodeSource === 'report') return setStatus('리포트 JSON은 편집기에 적용할 수 없습니다.');
  const html = elements.codeEditorTextarea?.value || '';
  if (!html.trim()) return setStatus('적용할 코드가 비어 있습니다.');
  pendingMountOptions = { snapshot: null, preserveHistory: false };
  const nextProject = normalizeProject({ html, sourceName: project.sourceName || 'edited.html', sourceType: 'code-apply' });
  store.setProject(nextProject);
  codeEditorDirty = false;
  setStatus('코드 워크벤치 내용을 다시 편집기에 적용했습니다.');
}

function searchCodeNext() {
  const textarea = elements.codeEditorTextarea;
  const keyword = elements.codeSearchInput?.value || '';
  if (!textarea || !keyword) return setStatus('검색어를 입력해 주세요.');
  const source = textarea.value || '';
  const start = textarea.selectionEnd || 0;
  let index = source.indexOf(keyword, start);
  if (index < 0 && start > 0) index = source.indexOf(keyword, 0);
  if (index < 0) return setStatus('일치하는 코드가 없습니다.');
  textarea.focus();
  textarea.setSelectionRange(index, index + keyword.length);
  const line = source.slice(0, index).split('\n').length;
  setStatus(`코드 검색 결과 ${line}번째 줄로 이동했습니다.`);
}

store.subscribe((state) => {
  const shouldMount = pendingMountOptions || (state.project?.id || '') !== mountedProjectId;
  if (shouldMount) {
    const options = pendingMountOptions || {};
    pendingMountOptions = null;
    mountProject(state.project, options);
  }
  renderShell(store.getState());
});

function safeBoot() {
  try {
    populateFixtureSelect();
    populateExportPresetSelect();
    syncExportPresetUi({ forceScale: true });
    const bootEnvironmentReport = evaluateLocalBootEnvironment();
    renderLocalModeNotice(elements.localModeNotice, bootEnvironmentReport);
    if (bootEnvironmentReport.errorCount || bootEnvironmentReport.warningCount) {
      setStatus(`환경 점검: 오류 ${bootEnvironmentReport.errorCount}개 · 경고 ${bootEnvironmentReport.warningCount}개`);
    }
    renderEmptyPreview();
    syncWorkflowUi(store.getState());
    loadFixture('F05');
  } catch (error) {
    console.error('[BOOT_ERROR]', error);
    setStatusWithError('초기 로딩 중 오류가 발생했습니다. 브라우저 콘솔(F12)을 확인해 주세요.', error, { logTag: '' });
  }
}

safeBoot();

for (const button of elements.viewButtons) button.addEventListener('click', () => setView(button.dataset.view));
for (const button of elements.selectionModeButtons) button.addEventListener('click', () => setSelectionMode(button.dataset.selectionMode));
for (const button of elements.workflowStepButtons) {
  button.addEventListener('click', () => setWorkflowStep(button.dataset.workflowStep));
}
for (const button of elements.presetButtons) {
  button.addEventListener('click', () => {
    if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
    const result = activeEditor.applyImagePreset(button.dataset.preset);
    setStatus(result.message);
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  });
}
for (const button of elements.actionButtons) {
  button.addEventListener('click', () => {
    if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
    if (button.dataset.action === 'remove-image') {
      const result = activeEditor.removeImageFromSelected();
      setStatus(result.message);
      if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
    }
  });
}
for (const button of elements.batchActionButtons) button.addEventListener('click', () => applyBatchAction(button.dataset.batchAction));
for (const button of elements.canvasActionButtons) {
  button.addEventListener('click', () => {
    const result = executeCanvasContextAction(button.dataset.canvasAction);
    if (result?.message) setStatus(result.message);
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  });
}
for (const button of elements.textAlignButtons) {
  button.addEventListener('click', () => {
    if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
    const result = activeEditor.applyTextStyle({ textAlign: button.dataset.textAlign });
    setStatus(result.message);
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  });
}
elements.applyCanvasGeometryButton?.addEventListener('click', () => {
  if (elements.geometryXInput) elements.geometryXInput.value = elements.canvasGeometryXInput?.value || '';
  if (elements.geometryYInput) elements.geometryYInput.value = elements.canvasGeometryYInput?.value || '';
  if (elements.geometryWInput) elements.geometryWInput.value = elements.canvasGeometryWInput?.value || '';
  if (elements.geometryHInput) elements.geometryHInput.value = elements.canvasGeometryHInput?.value || '';
  const result = applyGeometryFromInputs();
  setStatus(result.message);
});
for (const [canvasInput, sourceInput] of [
  [elements.canvasGeometryXInput, elements.geometryXInput],
  [elements.canvasGeometryYInput, elements.geometryYInput],
  [elements.canvasGeometryWInput, elements.geometryWInput],
  [elements.canvasGeometryHInput, elements.geometryHInput],
]) {
  canvasInput?.addEventListener('input', () => {
    if (!sourceInput) return;
    sourceInput.value = canvasInput.value;
    const result = applyGeometryFromInputs();
    if (result.ok) setStatus(result.message);
  });
}

elements.openHtmlButton.addEventListener('click', () => elements.htmlFileInput.click());
elements.openFolderButton.addEventListener('click', () => elements.folderInput.click());
elements.loadFixtureButton.addEventListener('click', () => loadFixture(elements.fixtureSelect.value));
elements.applyPasteButton.addEventListener('click', applyPastedHtml);
elements.replaceImageButton.addEventListener('click', () => elements.replaceImageInput.click());
elements.manualSlotButton.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.markSelectedAsSlot();
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.toggleHideButton.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.toggleSelectedHidden();
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.arrangeToggleHideButton?.addEventListener('click', () => elements.toggleHideButton?.click());
elements.toggleLockButton.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.toggleSelectedLocked();
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.arrangeToggleLockButton?.addEventListener('click', () => elements.toggleLockButton?.click());
elements.demoteSlotButton.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.demoteSelectedSlot();
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.redetectButton.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  activeEditor.redetect();
  setStatus('슬롯 자동 감지를 다시 실행했습니다.');
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.textEditButton.addEventListener('click', () => {
  executeEditorCommand('toggle-text-edit');
});
elements.duplicateButton?.addEventListener('click', () => { executeEditorCommand('duplicate'); });
elements.deleteButton?.addEventListener('click', () => { executeEditorCommand('delete'); });
elements.groupButton?.addEventListener('click', () => { executeEditorCommand('group-selection'); });
elements.ungroupButton?.addEventListener('click', () => { executeEditorCommand('ungroup-selection'); });
elements.addTextButton?.addEventListener('click', () => {
  executeEditorCommand('add-element-text');
});
elements.addBoxButton?.addEventListener('click', () => {
  executeEditorCommand('add-element-box');
});
elements.addSlotButton?.addEventListener('click', () => {
  executeEditorCommand('add-element-slot');
});
elements.applyGeometryButton?.addEventListener('click', () => {
  const result = applyGeometryFromInputs();
  setStatus(result.message);
});
elements.geometryCoordModeSelect?.addEventListener('change', () => {
  markAdvancedSettingsDirty(true);
  setStatus('좌표 기준 변경 대기 중입니다. "고급값 적용" 버튼을 눌러 반영하세요.');
});
for (const input of [elements.geometryXInput, elements.geometryYInput, elements.geometryWInput, elements.geometryHInput]) {
  input?.addEventListener('input', () => {
    if (!activeEditor) return;
    const result = applyGeometryFromInputs();
    if (result.ok) setStatus(result.message);
  });
}
elements.bringForwardButton?.addEventListener('click', () => {
  executeEditorCommand('layer-index-forward');
});
elements.sendBackwardButton?.addEventListener('click', () => {
  executeEditorCommand('layer-index-backward');
});
elements.bringToFrontButton?.addEventListener('click', () => {
  executeEditorCommand('layer-index-front');
});
elements.sendToBackButton?.addEventListener('click', () => {
  executeEditorCommand('layer-index-back');
});
elements.imageNudgeLeftButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: -2, dy: 0 })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.imageNudgeRightButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: 2, dy: 0 })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.imageNudgeUpButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: 0, dy: -2 })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.imageNudgeDownButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: 0, dy: 2 })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.preflightRefreshButton.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  activeEditor.refreshDerivedMeta();
  setStatus('출력 전 검수를 다시 계산했습니다.');
});
elements.applyTextStyleButton.addEventListener('click', () => applyTextStyleFromControls({ clear: false }));
elements.clearTextStyleButton.addEventListener('click', () => applyTextStyleFromControls({ clear: true }));
elements.undoButton.addEventListener('click', undoHistory);
elements.redoButton.addEventListener('click', redoHistory);
elements.restoreAutosaveButton.addEventListener('click', restoreAutosave);
elements.downloadEditedButton.addEventListener('click', () => { downloadEditedHtml().catch((error) => setStatus(`문서 저장 중 오류: ${error?.message || error}`)); });
elements.downloadNormalizedButton.addEventListener('click', downloadNormalizedHtml);
elements.downloadLinkedZipButton.addEventListener('click', () => { downloadLinkedZip().catch((error) => setStatus(`ZIP 저장 중 오류: ${error?.message || error}`)); });
elements.saveFormatSelect?.addEventListener('change', () => {
  currentSaveFormat = normalizeSaveFormat(elements.saveFormatSelect.value || 'linked');
  syncSaveFormatUi();
  setStatus(`저장 포맷을 ${currentSaveFormat}로 변경했습니다.`);
});
elements.exportPngButton.addEventListener('click', () => { exportFullPng().catch((error) => setStatus(`PNG 저장 중 오류: ${error?.message || error}`)); });
elements.exportJpgButton?.addEventListener('click', () => { exportFullJpg().catch((error) => setStatus(`JPG 저장 중 오류: ${error?.message || error}`)); });
elements.exportSectionsZipButton.addEventListener('click', () => { exportSectionsZip().catch((error) => setStatus(`섹션 PNG ZIP 저장 중 오류: ${error?.message || error}`)); });
elements.exportSelectionPngButton?.addEventListener('click', () => { exportSelectionPng().catch((error) => setStatus(`선택 PNG 저장 중 오류: ${error?.message || error}`)); });
elements.exportPresetPackageButton.addEventListener('click', () => { downloadExportPresetPackage().catch((error) => setStatus(`Preset 패키지 저장 중 오류: ${error?.message || error}`)); });
elements.downloadReportButton.addEventListener('click', downloadReportJson);
elements.exportPresetSelect.addEventListener('change', () => {
  currentExportPresetId = elements.exportPresetSelect.value || 'default';
  syncExportPresetUi({ forceScale: true });
  setStatus(`Export preset: ${currentExportPreset().label} (배율은 고급값 적용 버튼으로 반영)`);
});
for (const control of elements.exportScaleSelectControls) {
  control?.addEventListener('change', (event) => {
    const sourceControl = event?.currentTarget || null;
    syncMirroredControls(elements.exportScaleSelectControls, sourceControl?.value || '1', sourceControl);
    markAdvancedSettingsDirty(true);
  });
}
for (const control of elements.exportJpgQualityInputs) {
  control?.addEventListener('input', (event) => {
    const sourceControl = event?.currentTarget || null;
    syncMirroredControls(elements.exportJpgQualityInputs, sourceControl?.value || String(DEFAULT_JPG_QUALITY), sourceControl);
    markAdvancedSettingsDirty(true);
  });
}
elements.selectionExportPaddingInput?.addEventListener('input', () => markAdvancedSettingsDirty(true));
elements.selectionExportBackgroundSelect?.addEventListener('change', () => markAdvancedSettingsDirty(true));
elements.applyAdvancedSettingsButton?.addEventListener('click', () => {
  const result = applyAdvancedSettingsFromForm();
  setStatus(result.message);
});

elements.htmlFileInput.addEventListener('change', async (event) => {
  const [file] = event.target.files || [];
  try {
    await openHtmlFile(file);
  } finally {
    event.target.value = '';
  }
});

elements.folderInput.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files || []);
  try {
    if (files.length) await handleFolderImport(files);
  } finally {
    event.target.value = '';
  }
});

elements.replaceImageInput.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files || []);
  try {
    if (!files.length) return;
    if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
    const applied = await activeEditor.applyFiles(files);
    setStatus(applied ? `${applied}개 이미지를 적용했습니다.` : '이미지를 적용하지 못했습니다.');
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  } catch (error) {
    setStatus(`이미지 적용 중 오류: ${error?.message || error}`);
  } finally {
    event.target.value = '';
  }
});

elements.assetFilterInput.addEventListener('input', () => renderAssetTable(elements.assetTableWrap, store.getState().project, elements.assetFilterInput.value));
elements.layerFilterInput.addEventListener('input', () => renderLayerTree(elements.layerTree, store.getState().editorMeta, elements.layerFilterInput.value));
elements.slotList.addEventListener('click', (event) => {
  const button = event.target.closest('[data-slot-uid]');
  if (!button || !activeEditor) return;
  const ok = activeEditor.selectNodeByUid(button.dataset.slotUid, { additive: event.ctrlKey || event.metaKey || event.shiftKey, toggle: event.ctrlKey || event.metaKey, scroll: true });
  if (ok) setStatus('슬롯을 선택했습니다.');
});
elements.layerTree.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-layer-action][data-layer-uid]');
  if (actionButton && activeEditor) {
    event.preventDefault();
    event.stopPropagation();
    const uid = actionButton.dataset.layerUid;
    const result = actionButton.dataset.layerAction === 'hide'
      ? activeEditor.toggleLayerHiddenByUid(uid)
      : activeEditor.toggleLayerLockedByUid(uid);
    setStatus(result.message);
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
    return;
  }
  const button = event.target.closest('[data-layer-uid]');
  if (!button || !activeEditor) return;
  const ok = activeEditor.selectNodeByUid(button.dataset.layerUid, { additive: event.ctrlKey || event.metaKey || event.shiftKey, toggle: event.ctrlKey || event.metaKey, scroll: true });
  if (ok) setStatus('레이어를 선택했습니다.');
});
elements.layerTree.addEventListener('keydown', (event) => {
  const key = String(event.key || '');
  if (key !== 'Enter' && key !== ' ') return;
  const row = event.target.closest?.('[data-layer-uid]');
  if (!row || !activeEditor) return;
  event.preventDefault();
  const ok = activeEditor.selectNodeByUid(row.dataset.layerUid, { additive: event.ctrlKey || event.metaKey || event.shiftKey, toggle: event.ctrlKey || event.metaKey, scroll: true });
  if (ok) setStatus('레이어를 선택했습니다.');
});
for (const button of elements.sidebarTabButtons) {
  button.addEventListener('click', () => setSidebarTab(button.dataset.sidebarTab));
}
for (const button of elements.codeSourceButtons) {
  button.addEventListener('click', () => setCodeSource(button.dataset.codeSource, { preserveDraft: false }));
}
if (elements.codeEditorTextarea) {
  elements.codeEditorTextarea.addEventListener('input', () => { codeEditorDirty = true; });
}
elements.codeSearchNextButton?.addEventListener('click', searchCodeNext);
elements.codeSearchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') { event.preventDefault(); searchCodeNext(); }
});
elements.reloadCodeFromEditorButton?.addEventListener('click', () => { reloadCodeFromEditor().catch((error) => setStatus(`코드 다시 불러오기 오류: ${error?.message || error}`)); });
elements.applyCodeToEditorButton?.addEventListener('click', applyCodeToEditor);
elements.toggleLeftSidebarButton?.addEventListener('click', () => {
  document.body.classList.toggle('layout--left-collapsed');
  document.body.classList.remove('layout--focus-stage');
  syncWorkspaceButtons();
  applyPreviewZoom();
});
elements.toggleRightSidebarButton?.addEventListener('click', () => {
  document.body.classList.toggle('layout--right-collapsed');
  document.body.classList.remove('layout--focus-stage');
  syncWorkspaceButtons();
  applyPreviewZoom();
});
elements.focusModeButton?.addEventListener('click', () => {
  document.body.classList.toggle('layout--focus-stage');
  if (document.body.classList.contains('layout--focus-stage')) {
    document.body.classList.add('layout--left-collapsed', 'layout--right-collapsed');
  }
  syncWorkspaceButtons();
  applyPreviewZoom();
});
elements.zoomOutButton?.addEventListener('click', () => nudgeZoom(-0.1));
elements.zoomInButton?.addEventListener('click', () => nudgeZoom(0.1));
elements.zoomResetButton?.addEventListener('click', () => setZoom('manual', 1));
elements.zoomFitButton?.addEventListener('click', () => setZoom('fit'));
window.addEventListener('resize', applyPreviewZoom);
elements.basicAttributeSection?.addEventListener('toggle', persistPanelLayoutState);
elements.advancedAttributeSection?.addEventListener('toggle', persistPanelLayoutState);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !elements.shortcutHelpOverlay?.hidden) {
    event.preventDefault();
    toggleShortcutHelp(false);
    return;
  }
  const questionMarkPressed = event.key === '?' || (event.key === '/' && event.shiftKey);
  if (questionMarkPressed) {
    if (isTypingInputTarget(event.target)) return;
    event.preventDefault();
    toggleShortcutHelp();
    return;
  }
  if (!elements.shortcutHelpOverlay?.hidden && event.key === 'Tab') {
    const focusable = Array.from(elements.shortcutHelpOverlay.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'))
      .filter((node) => node instanceof HTMLElement && !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true');
    if (focusable.length < 1) {
      event.preventDefault();
      elements.shortcutHelpCloseButton?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
      return;
    }
  }
  if (!elements.shortcutHelpOverlay?.hidden) return;

  const withModifier = event.ctrlKey || event.metaKey;
  if (!withModifier && !isTypingInputTarget(event.target)) {
    const key = String(event.key || '').toLowerCase();
    if (key === 'v') {
      event.preventDefault();
      setSelectionMode('smart');
      return setStatus('선택 도구(V)로 전환했습니다.');
    }
    if (key === 't') {
      event.preventDefault();
      setSelectionMode('text');
      return setStatus('텍스트 도구(T)로 전환했습니다.');
    }
    if (key === 'r') {
      event.preventDefault();
      setSelectionMode('box');
      return setStatus('박스 도구(R)로 전환했습니다.');
    }
  }

  if (!withModifier || event.altKey) return;
  if (isTypingInputTarget(event.target)) return;
  const key = String(event.key || '').toLowerCase();
  if (key === 'd') {
    event.preventDefault();
    return executeEditorCommand('duplicate');
  }
  if (key === 'g') {
    event.preventDefault();
    return executeEditorCommand(event.shiftKey ? 'ungroup-selection' : 'group-selection');
  }
  if (key === 'z') {
    event.preventDefault();
    return event.shiftKey ? redoHistory() : undoHistory();
  }
  if (key === 'y') {
    event.preventDefault();
    return redoHistory();
  }
  if (key === 's') {
    event.preventDefault();
    return downloadEditedHtml().catch((error) => setStatus(`문서 저장 중 오류: ${error?.message || error}`));
  }
  if (key === '=') {
    event.preventDefault();
    return nudgeZoom(0.1);
  }
  if (key === '-') {
    event.preventDefault();
    return nudgeZoom(-0.1);
  }
  if (key === '0') {
    event.preventDefault();
    return setZoom('manual', 1);
  }
  if (key === 'b') {
    event.preventDefault();
    document.body.classList.toggle('layout--left-collapsed');
    syncWorkspaceButtons();
    return applyPreviewZoom();
  }
  if (key === 'i') {
    event.preventDefault();
    document.body.classList.toggle('layout--right-collapsed');
    syncWorkspaceButtons();
    return applyPreviewZoom();
  }
  if (key === 'f') {
    event.preventDefault();
    return setZoom('fit');
  }
  if (key === 'k') {
    event.preventDefault();
    setSidebarTab('left-code');
    elements.codeSearchInput?.focus();
    return;
  }
});

elements.shortcutHelpOverlay?.addEventListener('click', (event) => {
  if (event.target === elements.shortcutHelpOverlay) toggleShortcutHelp(false);
});
elements.shortcutHelpCloseButton?.addEventListener('click', () => toggleShortcutHelp(false));
elements.beginnerModeToggle?.addEventListener('click', () => setBeginnerMode(!isBeginnerMode));
elements.beginnerTutorialPrevButton?.addEventListener('click', () => {
  beginnerTutorialStepIndex = Math.max(0, beginnerTutorialStepIndex - 1);
  renderBeginnerTutorialStep();
});
elements.beginnerTutorialNextButton?.addEventListener('click', () => {
  if (beginnerTutorialStepIndex >= BEGINNER_TUTORIAL_STEPS.length - 1) {
    closeBeginnerTutorial();
    setStatus('초보 모드 튜토리얼을 완료했습니다.');
    return;
  }
  beginnerTutorialStepIndex += 1;
  renderBeginnerTutorialStep();
});
elements.beginnerTutorialCloseButton?.addEventListener('click', closeBeginnerTutorial);

setSidebarTab('left-import');
setSidebarTab('right-inspect');
setCodeSource('edited', { preserveDraft: false });
syncSaveFormatUi();
restorePanelLayoutState();
syncAdvancedFormFromState();
syncWorkspaceButtons();
applyShortcutTooltips();
setBeginnerMode(readFromLocalStorage(BEGINNER_MODE_STORAGE_KEY, '0') === '1', { silent: true });
