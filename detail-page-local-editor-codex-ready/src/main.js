import { FIXTURE_MANIFEST, FIXTURE_SOURCE_MAP, getFixtureMeta } from './fixture-bundle.js';
import {
  AUTOSAVE_KEY,
  EXPORT_PRESETS,
  HISTORY_LIMIT,
  PROJECT_SNAPSHOT_KEY,
  PROJECT_SNAPSHOT_LIMIT,
  getExportPresetById,
} from './config.js';
import { createImportFileIndex, choosePrimaryHtmlEntry } from './core/asset-resolver.js';
import { normalizeProject } from './core/normalize-project.js';
import { createProjectStore } from './core/project-store.js';
import { createFrameEditor } from './editor/frame-editor.js';
import {
  renderAssetTable,
  renderIssueList,
  renderLeftTabStepGuide,
  renderLayerTree,
  renderLocalModeNotice,
  renderNormalizeStats,
  renderPreflight,
  renderProjectMeta,
  renderSectionFilmstrip,
  renderSelectionInspector,
  renderSlotList,
  renderSummaryCards,
} from './ui/renderers.js';
import {
  buildZipBlob,
  downloadBlob,
  downloadTextFile,
  sanitizeFilename,
} from './utils.js';

const store = createProjectStore();
let activeEditor = null;
let mountedProjectId = '';
let pendingMountOptions = null;
let currentExportPresetId = 'market';
let currentCodeSource = 'edited';
let codeEditorDirty = false;
let geometryCoordMode = 'relative';
let currentSaveFormat = 'linked';
let lastSaveConversion = null;
let advancedSettingsDirty = false;
let lastFocusedBeforeShortcutHelp = null;
let lastFocusedBeforeDownloadModal = null;
let importRequestSequence = 0;
let autosaveWriteSequence = 0;
let lastStorageWriteFailureAt = 0;
const zoomState = { mode: 'fit', value: 1 };
const viewFeatureFlags = {
  snap: true,
  guide: true,
  ruler: false,
};
const OPEN_DOWNLOAD_MODAL_BUTTON_LABEL = '저장/출력 열기';
const DEFAULT_JPG_QUALITY = 0.92;
const NUDGE_STEP_RULE = Object.freeze({
  base: 2,
  shift: 10,
  alt: 1,
});
const WORKFLOW_STEP_GUIDES = Object.freeze({
  load: 'HTML 파일이나 폴더를 먼저 불러오세요.',
  edit: '요소를 클릭한 뒤 드래그하세요.',
  save: `결과를 확인한 뒤 [${OPEN_DOWNLOAD_MODAL_BUTTON_LABEL}] 버튼을 눌러 실행하세요.`,
});
const LEFT_TAB_TO_WORKFLOW_STEP = Object.freeze({
  'left-start': 'load',
  'left-image': 'edit',
  'left-text': 'edit',
  'left-layers': 'edit',
  'left-export': 'save',
});
const WORKFLOW_STEP_TO_LEFT_TAB = Object.freeze({
  load: 'left-start',
  edit: 'left-image',
  save: 'left-export',
});
const SHORTCUT_TOOLTIP_MAP = Object.freeze({});
const BOOT_LOCAL_POLICY = Object.freeze({
  requiresStartupFetch: false,
  requiresFileSystemAccessApi: false,
  requiresServerEndpoint: false,
});
const SUPPORTED_IMAGE_EXTENSIONS = Object.freeze(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.avif']);
const SUPPORTED_IMAGE_EXTENSIONS_TEXT = SUPPORTED_IMAGE_EXTENSIONS.join(', ');
const APP_STATES = Object.freeze({
  launch: 'launch',
  editor: 'editor',
});
let currentAppState = APP_STATES.launch;
const BEGINNER_MODE_STORAGE_KEY = 'detail_editor_beginner_mode_v1';
const ONBOARDING_COMPLETED_STORAGE_KEY = 'detail_editor_onboarding_completed_v1';
const ONBOARDING_SAMPLE_CHECKED_STORAGE_KEY = 'detail_editor_onboarding_sample_checked_v1';
const COMMAND_REGISTRY = Object.freeze([
  { id: 'tool-select', label: '선택 도구', shortcut: 'V', keywords: ['선택', '화살표', 'v'], run: () => { setSelectionMode('smart'); return { ok: true, message: '선택 도구(V)로 전환했습니다.' }; } },
  { id: 'tool-text', label: '텍스트 도구', shortcut: 'T', keywords: ['텍스트', '글자', 't'], run: () => { setSelectionMode('text'); return { ok: true, message: '텍스트 도구(T)로 전환했습니다.' }; } },
  { id: 'tool-box', label: '박스 도구', shortcut: 'R', keywords: ['박스', '사각형', 'r'], run: () => { setSelectionMode('box'); return { ok: true, message: '박스 도구(R)로 전환했습니다.' }; } },
  { id: 'duplicate', label: '선택 복제', shortcut: 'Ctrl/Cmd + D', keywords: ['복제', '복사', 'duplicate'], run: () => executeEditorCommand('duplicate') },
  { id: 'delete', label: '선택 삭제', shortcut: 'Delete', keywords: ['삭제', '지우기', 'remove'], run: () => executeEditorCommand('delete') },
  { id: 'group', label: '그룹 묶기', shortcut: 'Ctrl/Cmd + G', keywords: ['그룹', '묶기'], run: () => executeEditorCommand('group-selection') },
  { id: 'ungroup', label: '그룹 해제', shortcut: 'Shift + Ctrl/Cmd + G', keywords: ['그룹해제', '해제', 'ungroup'], run: () => executeEditorCommand('ungroup-selection') },
  { id: 'save-edited', label: '문서 저장', shortcut: 'Ctrl/Cmd + S', keywords: ['저장', '세이브', 'save'], run: () => { downloadEditedHtml().catch((error) => setStatus(`문서 저장 중 오류: ${error?.message || error}`)); return { ok: true, message: '문서 저장을 실행했습니다.' }; } },
  { id: 'export-png', label: '전체 PNG 내보내기', shortcut: '-', keywords: ['png', '내보내기', '이미지'], run: () => { exportFullPng().catch((error) => setStatus(`PNG 내보내기 오류: ${error?.message || error}`)); return { ok: true, message: '전체 PNG 내보내기를 실행했습니다.' }; } },
  { id: 'section-add', label: '섹션 추가', shortcut: '-', keywords: ['섹션 추가', 'section', '블록 추가'], run: () => {
    if (!activeEditor) return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
    const uid = store.getState().editorMeta?.selectedSectionUid || '';
    return activeEditor.addSectionAfterUid(uid);
  } },
  { id: 'stack-horizontal', label: '가로 스택 정렬', shortcut: '-', keywords: ['가로', 'stack', '정렬'], run: () => applyStackCommand('horizontal') },
  { id: 'stack-vertical', label: '세로 스택 정렬', shortcut: '-', keywords: ['세로', 'stack', '정렬'], run: () => applyStackCommand('vertical') },
  { id: 'tidy-horizontal', label: '가로 간격 맞춤', shortcut: '-', keywords: ['가로 간격', 'tidy', '균등'], run: () => applyTidyCommand('x') },
  { id: 'tidy-vertical', label: '세로 간격 맞춤', shortcut: '-', keywords: ['세로 간격', 'tidy', '균등'], run: () => applyTidyCommand('y') },
  { id: 'toggle-shortcut-help', label: '단축키 치트시트 열기/닫기', shortcut: '?', keywords: ['도움말', '단축키', '치트시트'], run: () => ({ ok: true, message: toggleShortcutHelp() ? '단축키 치트시트를 열었습니다.' : '단축키 치트시트를 닫았습니다.' }) },
]);
const BEGINNER_TUTORIAL_STEPS = Object.freeze([
  {
    id: 'slot-select',
    title: '1) 슬롯 선택',
    body: '먼저 [슬롯 지정] 버튼을 눌러 선택한 요소를 슬롯으로 지정하세요.',
    targetElementKey: 'manualSlotButton',
  },
  {
    id: 'replace-image',
    title: '2) 이미지 교체',
    body: '이제 [이미지 넣기] 버튼을 눌러 이미지를 교체하세요.',
    targetElementKey: 'replaceImageButton',
  },
  {
    id: 'save-png',
    title: '3) PNG 저장',
    body: '마지막으로 상단 [PNG] 버튼을 눌러 저장하면 온보딩이 끝나요.',
    targetElementKey: 'exportPngButton',
  },
]);
let isBeginnerMode = false;
let beginnerTutorialStepIndex = 0;
let onboardingCompleted = false;
let lastFocusedBeforeCommandPalette = null;
let commandPaletteResults = [];
let commandPaletteActiveIndex = 0;

const historyState = {
  baseSnapshot: null,
  undoStack: [],
  redoStack: [],
};
const perfState = {
  inputLatencies: [],
  sampleLimit: 240,
  p95InputLatencyMs: 0,
  lastInputLatencyMs: 0,
  slowFrames: 0,
  lastDirtyRect: null,
};
const HISTORY_MERGE_WINDOW_MS = 700;
const LIVE_HISTORY_LABELS = new Set(['geometry-patch', 'apply-text-style', 'clear-text-style']);

const advancedSettings = {
  geometryCoordMode: 'relative',
  exportScale: 1,
  exportJpgQuality: DEFAULT_JPG_QUALITY,
  selectionExportPadding: 16,
  selectionExportBackground: 'transparent',
};

const EXPORT_SCALE_OPTIONS = Object.freeze([1, 2, 3]);
const EXPORT_NEXT_ACTION_HINTS = Object.freeze({
  'export-full-png': '다음: 업로드 화면에서 비율(권장 860px 기준)을 확인해 주세요.',
  'export-full-jpg': '다음: 톤/압축 품질을 확인한 뒤 공유하세요.',
  'export-selection-png': '다음: 선택 범위 경계가 맞는지 바로 확인해 주세요.',
  'export-sections-zip': '다음: ZIP을 풀어 섹션 파일 순서와 누락 여부를 확인해 주세요.',
  'download-export-preset-package': '다음: ZIP을 풀고 목적(업로드/검수/보관)에 맞게 전달해 주세요.',
});
const IMPORT_FAILURE_GUIDES = Object.freeze({
  htmlOpen: '안내: HTML 파일(.html/.htm)인지 확인하고 다시 선택해 주세요.',
  folderNoHtml: '안내: 폴더 안에 대표 HTML 파일(예: index.html)을 넣어 주세요.',
  folderImport: '안내: HTML과 assets 폴더를 같은 루트에서 다시 선택해 주세요.',
  pasteMalformed: '안내: 닫히지 않은 태그(예: </div>)를 확인한 뒤 다시 붙여넣어 주세요.',
});

const elements = {
  appLauncher: document.getElementById('appLauncher'),
  appShell: document.getElementById('appShell'),
  appStatusbar: document.getElementById('appStatusbar'),
  launcherNewButton: document.getElementById('launcherNewButton'),
  launcherUploadButton: document.getElementById('launcherUploadButton'),
  launcherRecentButton: document.getElementById('launcherRecentButton'),
  launcherFixtureButtons: Array.from(document.querySelectorAll('[data-launch-fixture]')),
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
  selectionSmartButton: document.getElementById('selectionSmartButton'),
  groupButton: document.getElementById('groupButton'),
  ungroupButton: document.getElementById('ungroupButton'),
  undoButton: document.getElementById('undoButton'),
  redoButton: document.getElementById('redoButton'),
  restoreAutosaveButton: document.getElementById('restoreAutosaveButton'),
  saveProjectSnapshotButton: document.getElementById('saveProjectSnapshotButton'),
  openDownloadModalButton: document.getElementById('openDownloadModalButton'),
  shareProjectButton: document.getElementById('shareProjectButton'),
  projectNameDisplay: document.getElementById('projectNameDisplay'),
  projectNameInput: document.getElementById('projectNameInput'),
  topbarSaveStatusBadge: document.getElementById('topbarSaveStatusBadge'),
  downloadModal: document.getElementById('downloadModal'),
  closeDownloadModalButton: document.getElementById('closeDownloadModalButton'),
  downloadChoiceSelect: document.getElementById('downloadChoiceSelect'),
  runDownloadChoiceButton: document.getElementById('runDownloadChoiceButton'),
  downloadPresetButtons: Array.from(document.querySelectorAll('[data-download-preset]')),
  saveFormatSelect: document.getElementById('saveFormatSelect'),
  saveFormatStatus: document.getElementById('saveFormatStatus'),
  saveFormatGuide: document.getElementById('saveFormatGuide'),
  saveFormatPreview: document.getElementById('saveFormatPreview'),
  saveMetaSummary: document.getElementById('saveMetaSummary'),
  modalDownloadEditedButton: document.getElementById('modalDownloadEditedButton'),
  downloadEditedButtons: Array.from(document.querySelectorAll('[data-download-action="save-edited"]')),
  downloadNormalizedButton: document.getElementById('downloadNormalizedButton'),
  downloadLinkedZipButton: document.getElementById('downloadLinkedZipButton'),
  modalExportPngButton: document.getElementById('modalExportPngButton'),
  exportPngButton: document.getElementById('exportPngButton'),
  exportPngButtons: Array.from(document.querySelectorAll('[data-download-action="export-full-png"]')),
  modalExportJpgButton: document.getElementById('modalExportJpgButton'),
  exportJpgButtons: Array.from(document.querySelectorAll('[data-download-action="export-full-jpg"]')),
  exportSectionsZipButton: document.getElementById('exportSectionsZipButton'),
  exportSelectionPngButton: document.getElementById('exportSelectionPngButton'),
  exportPresetPackageButton: document.getElementById('exportPresetPackageButton'),
  selectionExportPaddingInput: document.getElementById('selectionExportPaddingInput'),
  selectionExportBackgroundSelect: document.getElementById('selectionExportBackgroundSelect'),
  exportPresetSelect: document.getElementById('exportPresetSelect'),
  exportScaleSelectMain: document.getElementById('exportScaleSelectMain'),
  exportScaleSelectControls: Array.from(document.querySelectorAll('[data-export-scale-control]')),
  exportJpgQualityInputMain: document.getElementById('exportJpgQualityInputMain'),
  exportJpgQualityInputs: Array.from(document.querySelectorAll('[data-export-jpg-quality-control]')),
  downloadReportButton: document.getElementById('downloadReportButton'),
  htmlFileInput: document.getElementById('htmlFileInput'),
  folderInput: document.getElementById('folderInput'),
  replaceImageInput: document.getElementById('replaceImageInput'),
  htmlPasteInput: document.getElementById('htmlPasteInput'),
  summaryCards: document.getElementById('summaryCards'),
  issueList: document.getElementById('issueList'),
  uploadRecentList: document.getElementById('uploadRecentList'),
  uploadDocumentList: document.getElementById('uploadDocumentList'),
  uploadUnassignedList: document.getElementById('uploadUnassignedList'),
  uploadBrokenList: document.getElementById('uploadBrokenList'),
  snapshotNameInput: document.getElementById('snapshotNameInput'),
  saveSnapshotFromPanelButton: document.getElementById('saveSnapshotFromPanelButton'),
  snapshotList: document.getElementById('snapshotList'),
  normalizeStats: document.getElementById('normalizeStats'),
  selectionInspector: document.getElementById('selectionInspector'),
  slotList: document.getElementById('slotList'),
  sectionList: document.getElementById('sectionList'),
  sectionDuplicateButton: document.getElementById('sectionDuplicateButton'),
  sectionMoveUpButton: document.getElementById('sectionMoveUpButton'),
  sectionMoveDownButton: document.getElementById('sectionMoveDownButton'),
  sectionDeleteButton: document.getElementById('sectionDeleteButton'),
  sectionAddButton: document.getElementById('sectionAddButton'),
  selectionEmptyState: document.getElementById('selectionEmptyState'),
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
  documentStatusChip: document.getElementById('documentStatusChip'),
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
  workflowGuideSelect: document.getElementById('workflowGuideSelect'),
  workflowGuideLine: document.getElementById('workflowGuideLine'),
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
  viewSnapToggleButton: document.getElementById('viewSnapToggleButton'),
  viewGuideToggleButton: document.getElementById('viewGuideToggleButton'),
  viewRulerToggleButton: document.getElementById('viewRulerToggleButton'),
  selectionModeButtons: Array.from(document.querySelectorAll('[data-selection-mode]')),
  presetButtons: Array.from(document.querySelectorAll('[data-preset]')),
  actionButtons: Array.from(document.querySelectorAll('[data-action]')),
  batchActionButtons: Array.from(document.querySelectorAll('[data-batch-action]')),
  textAlignButtons: Array.from(document.querySelectorAll('[data-text-align]')),
  canvasActionButtons: Array.from(document.querySelectorAll('[data-canvas-action]')),
  shortcutHelpOverlay: document.getElementById('shortcutHelpOverlay'),
  shortcutHelpList: document.getElementById('shortcutHelpList'),
  shortcutHelpCloseButton: document.getElementById('shortcutHelpCloseButton'),
  commandPaletteOverlay: document.getElementById('commandPaletteOverlay'),
  commandPaletteCloseButton: document.getElementById('commandPaletteCloseButton'),
  commandPaletteInput: document.getElementById('commandPaletteInput'),
  commandPaletteList: document.getElementById('commandPaletteList'),
  commandPaletteRunButton: document.getElementById('commandPaletteRunButton'),
  stackDirectionSelect: document.getElementById('stackDirectionSelect'),
  stackGapInput: document.getElementById('stackGapInput'),
  stackAlignSelect: document.getElementById('stackAlignSelect'),
  stackHorizontalButton: document.getElementById('stackHorizontalButton'),
  stackVerticalButton: document.getElementById('stackVerticalButton'),
  tidyHorizontalButton: document.getElementById('tidyHorizontalButton'),
  tidyVerticalButton: document.getElementById('tidyVerticalButton'),
  beginnerMoreItems: Array.from(document.querySelectorAll('[data-beginner-more-item]')),
  beginnerModeToggle: document.getElementById('beginnerModeToggle'),
  beginnerMoreItems: Array.from(document.querySelectorAll('[data-beginner-more-item]')),
  advancedTopbarPanel: document.getElementById('advancedTopbarPanel'),
  beginnerTutorialTooltip: document.getElementById('beginnerTutorialTooltip'),
  beginnerTutorialTitle: document.getElementById('beginnerTutorialTitle'),
  beginnerTutorialBody: document.getElementById('beginnerTutorialBody'),
  beginnerTutorialStep: document.getElementById('beginnerTutorialStep'),
  beginnerTutorialPrevButton: document.getElementById('beginnerTutorialPrevButton'),
  beginnerTutorialNextButton: document.getElementById('beginnerTutorialNextButton'),
  beginnerTutorialCloseButton: document.getElementById('beginnerTutorialCloseButton'),
  onboardingReplayButton: document.getElementById('onboardingReplayButton'),
  onboardingChecklist: document.getElementById('onboardingChecklist'),
  onboardingChecklistItem: document.getElementById('onboardingChecklistItem'),
  onboardingChecklistDoneButton: document.getElementById('onboardingChecklistDoneButton'),
  beginnerMoreItems: Array.from(document.querySelectorAll('[data-beginner-more-item]')),
};

const beginnerMoreItemAnchors = new WeakMap();

for (const item of elements.beginnerMoreItems || []) {
  beginnerMoreItemAnchors.set(item, {
    parent: item.parentElement,
    nextSibling: item.nextSibling,
  });
}

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

function hasCompletedOnboarding() {
  return readFromLocalStorage(ONBOARDING_COMPLETED_STORAGE_KEY, '') === '1';
}

function hasCompletedOnboardingSampleTask() {
  return readFromLocalStorage(ONBOARDING_SAMPLE_CHECKED_STORAGE_KEY, '') === '1';
}

function markOnboardingCompleted() {
  onboardingCompleted = true;
  writeToLocalStorage(ONBOARDING_COMPLETED_STORAGE_KEY, '1');
}

function clearOnboardingHighlights() {
  document.querySelectorAll('.onboarding-highlight').forEach((target) => target.classList.remove('onboarding-highlight'));
}

function applyOnboardingHighlightForCurrentStep() {
  clearOnboardingHighlights();
  if (onboardingCompleted) return;
  const step = BEGINNER_TUTORIAL_STEPS[beginnerTutorialStepIndex] || null;
  const target = step?.targetElementKey ? elements[step.targetElementKey] : null;
  target?.classList.add('onboarding-highlight');
}

function closeBeginnerTutorial() {
  if (elements.beginnerTutorialTooltip) elements.beginnerTutorialTooltip.hidden = true;
  clearOnboardingHighlights();
}

function renderOnboardingChecklist() {
  if (!elements.onboardingChecklist) return;
  const done = hasCompletedOnboardingSampleTask();
  elements.onboardingChecklist.hidden = !onboardingCompleted;
  if (elements.onboardingChecklistItem) {
    elements.onboardingChecklistItem.textContent = done
      ? '✅ 샘플 작업 1회 실행 완료'
      : '⬜ 샘플(F05)에서 슬롯 선택 → 이미지 교체 → PNG 저장을 1회 실행해 보세요.';
  }
  if (elements.onboardingChecklistDoneButton) {
    elements.onboardingChecklistDoneButton.disabled = done;
    elements.onboardingChecklistDoneButton.textContent = done ? '체크 완료' : '완료 체크';
  }
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
  applyOnboardingHighlightForCurrentStep();
}

function openBeginnerTutorial({ force = false } = {}) {
  if (!force && onboardingCompleted) return;
  beginnerTutorialStepIndex = 0;
  renderBeginnerTutorialStep();
  if (elements.beginnerTutorialTooltip) elements.beginnerTutorialTooltip.hidden = false;
}

function openBeginnerTutorialIfNeeded() {
  if (onboardingCompleted) return;
  openBeginnerTutorial();
}

function completeOnboardingTutorial() {
  markOnboardingCompleted();
  closeBeginnerTutorial();
  renderOnboardingChecklist();
  setStatus('온보딩을 완료했습니다. 아래 체크리스트로 샘플 작업을 1회 실행해 보세요.');
}

function advanceOnboardingByAction(actionId) {
  if (onboardingCompleted || elements.beginnerTutorialTooltip?.hidden) return;
  const step = BEGINNER_TUTORIAL_STEPS[beginnerTutorialStepIndex] || null;
  if (!step || step.id !== actionId) return;
  if (beginnerTutorialStepIndex >= BEGINNER_TUTORIAL_STEPS.length - 1) {
    completeOnboardingTutorial();
    return;
  }
  beginnerTutorialStepIndex += 1;
  renderBeginnerTutorialStep();
}

function applyBeginnerModeUi() {
  document.body.classList.toggle('beginner-mode', isBeginnerMode);
  if (elements.beginnerModeToggle) {
    elements.beginnerModeToggle.textContent = `초보 모드: ${isBeginnerMode ? 'ON' : 'OFF'}`;
    elements.beginnerModeToggle.setAttribute('aria-pressed', isBeginnerMode ? 'true' : 'false');
  }
  if (isBeginnerMode && elements.advancedTopbarPanel) elements.advancedTopbarPanel.open = false;
}

function setBeginnerMode(next, { silent = false } = {}) {
  isBeginnerMode = !!next;
  applyBeginnerModeUi();
  writeToLocalStorage(BEGINNER_MODE_STORAGE_KEY, isBeginnerMode ? '1' : '0');
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

function syncWorkflowGuide(state, { announce = false } = {}) {
  const selectedStep = elements.workflowGuideSelect?.value || 'load';
  if (elements.workflowGuideLine) {
    elements.workflowGuideLine.textContent = WORKFLOW_STEP_GUIDES[selectedStep] || WORKFLOW_STEP_GUIDES.load;
  }
  if (announce) {
    const check = evaluateWorkflowStepReadiness(selectedStep, state);
    if (check.message) setStatus(check.message);
  }
}

function syncWorkflowGuideStepByLeftTab(leftTabId, { announce = false } = {}) {
  const mappedStep = LEFT_TAB_TO_WORKFLOW_STEP[String(leftTabId || '')];
  if (!mappedStep) return;
  if (elements.workflowGuideSelect && elements.workflowGuideSelect.value !== mappedStep) {
    elements.workflowGuideSelect.value = mappedStep;
  }
  syncWorkflowGuide(store.getState(), { announce });
}

function resolveDocumentStatus(state) {
  if (!state?.project || !activeEditor) return { status: 'idle', text: '문서 없음' };
  if (state.lastError) return { status: 'error', text: '오류 있음' };
  if (codeEditorDirty || advancedSettingsDirty || historyState.undoStack.length > 0) return { status: 'dirty', text: '편집 중' };
  return { status: 'ready', text: '저장 가능' };
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

function setImageApplyDiagnostic(diagnostic) {
  store.setImageApplyDiagnostic(diagnostic || null);
}

function setAppState(nextState) {
  const normalized = nextState === APP_STATES.editor ? APP_STATES.editor : APP_STATES.launch;
  currentAppState = normalized;
  const isEditor = normalized === APP_STATES.editor;
  if (elements.appLauncher) elements.appLauncher.hidden = isEditor;
  if (elements.appShell) elements.appShell.hidden = !isEditor;
  if (elements.appStatusbar) elements.appStatusbar.hidden = !isEditor;
}

function refreshLauncherRecentButton() {
  if (!elements.launcherRecentButton) return;
  const payload = readAutosavePayload();
  const hasSnapshot = !!payload?.snapshot?.html;
  elements.launcherRecentButton.disabled = !hasSnapshot;
  elements.launcherRecentButton.dataset.available = hasSnapshot ? 'true' : 'false';
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

function buildImageFailureDiagnostic({ files = [], editorMeta = null, statusMessage = '' } = {}) {
  const firstFile = files[0] || null;
  const fileName = firstFile?.name || '';
  const extension = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase() : '';
  const selected = editorMeta?.selected || null;
  const selectedSlotLabel = selected?.label || selected?.uid || '';
  const selectedSlotLike = !!selected && (selected.type === 'slot' || selected.detectedType === 'slot');
  const mimeUnsupported = !!firstFile && !String(firstFile.type || '').startsWith('image/');
  const extensionUnsupported = !!extension && !SUPPORTED_IMAGE_EXTENSIONS.includes(extension);
  const filenameMismatch = !!fileName && !!selectedSlotLabel && !fileName.toLowerCase().includes(String(selectedSlotLabel).toLowerCase());
  const reasons = {
    slotUnselected: !selectedSlotLike,
    filenameMismatch,
    unsupportedFormat: mimeUnsupported || extensionUnsupported,
  };
  const details = {
    slotUnselected: selectedSlotLike ? '선택된 슬롯이 있습니다.' : '이미지를 적용할 슬롯을 먼저 선택해 주세요.',
    filenameMismatch: filenameMismatch ? `선택 슬롯(${selectedSlotLabel})과 파일명(${fileName})이 다를 수 있습니다.` : '파일명과 슬롯명이 크게 어긋나지 않습니다.',
    unsupportedFormat: reasons.unsupportedFormat ? `현재 파일 형식: ${firstFile.type || 'unknown'}, 확장자: ${extension || '없음'}` : '이미지 파일 형식입니다.',
  };
  return {
    status: 'failed',
    message: statusMessage || '이미지 적용 실패 원인을 확인해 주세요.',
    reasons,
    details,
  };
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

function getDownloadModalFocusable() {
  if (!elements.downloadModal) return [];
  return Array.from(elements.downloadModal.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'))
    .filter((node) => node instanceof HTMLElement && !node.disabled && !node.hidden && node.tabIndex >= 0);
}

function toggleDownloadModal(forceOpen = null) {
  const overlay = elements.downloadModal;
  if (!overlay) return false;
  const shouldOpen = forceOpen == null ? overlay.hidden : !!forceOpen;
  overlay.hidden = !shouldOpen;
  if (shouldOpen) {
    lastFocusedBeforeDownloadModal = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    elements.downloadChoiceSelect?.focus();
    setStatus('저장/출력 모달을 열었습니다.');
  } else if (lastFocusedBeforeDownloadModal && typeof lastFocusedBeforeDownloadModal.focus === 'function') {
    lastFocusedBeforeDownloadModal.focus();
  }
  return shouldOpen;
}

function handleDownloadModalFocusTrap(event) {
  if (!elements.downloadModal || elements.downloadModal.hidden || event.key !== 'Tab') return;
  const focusable = getDownloadModalFocusable();
  if (focusable.length < 1) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
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

function renderShortcutHelpList() {
  if (!elements.shortcutHelpList) return;
  elements.shortcutHelpList.innerHTML = '';
  for (const item of COMMAND_REGISTRY) {
    if (!item.shortcut || item.shortcut === '-') continue;
    const li = document.createElement('li');
    const kbd = document.createElement('kbd');
    kbd.textContent = item.shortcut;
    const label = document.createElement('span');
    label.textContent = item.label;
    li.append(kbd, label);
    elements.shortcutHelpList.append(li);
  }
}

function getCommandPaletteFocusable() {
  if (!elements.commandPaletteOverlay) return [];
  return Array.from(elements.commandPaletteOverlay.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'))
    .filter((node) => node instanceof HTMLElement && !node.disabled && !node.hidden && node.tabIndex >= 0);
}

function handleCommandPaletteFocusTrap(event) {
  if (!elements.commandPaletteOverlay || elements.commandPaletteOverlay.hidden || event.key !== 'Tab') return;
  const focusable = getCommandPaletteFocusable();
  if (focusable.length < 1) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function performCommandAction(commandId) {
  const command = COMMAND_REGISTRY.find((item) => item.id === commandId);
  if (!command) return { ok: false, message: '명령을 찾지 못했습니다.' };
  const result = command.run?.() || { ok: false, message: '명령 실행기를 찾지 못했습니다.' };
  if (result?.message) setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  return result;
}

function filterCommandPalette(query) {
  const normalized = String(query || '').trim().toLowerCase();
  if (!normalized) return [...COMMAND_REGISTRY];
  return COMMAND_REGISTRY.filter((item) => {
    const target = [item.label, item.shortcut, ...(item.keywords || [])].join(' ').toLowerCase();
    return target.includes(normalized);
  });
}

function renderCommandPaletteResults() {
  if (!elements.commandPaletteList) return;
  elements.commandPaletteList.innerHTML = '';
  if (!commandPaletteResults.length) {
    const li = document.createElement('li');
    li.className = 'command-palette__item';
    li.textContent = '검색 결과가 없습니다.';
    elements.commandPaletteList.append(li);
    return;
  }
  commandPaletteActiveIndex = Math.max(0, Math.min(commandPaletteActiveIndex, commandPaletteResults.length - 1));
  commandPaletteResults.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `command-palette__item${index === commandPaletteActiveIndex ? ' is-active' : ''}`;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', index === commandPaletteActiveIndex ? 'true' : 'false');
    li.dataset.commandId = item.id;
    li.innerHTML = `<strong>${item.label}</strong><span class="topbar__sub">${item.shortcut || '-'}</span>`;
    li.addEventListener('click', () => {
      commandPaletteActiveIndex = index;
      runActiveCommandPaletteItem();
    });
    elements.commandPaletteList.append(li);
  });
}

function runActiveCommandPaletteItem() {
  const selected = commandPaletteResults[commandPaletteActiveIndex];
  if (!selected) return;
  const result = performCommandAction(selected.id);
  if (result?.ok) toggleCommandPalette(false);
}

function updateCommandPaletteResults() {
  commandPaletteResults = filterCommandPalette(elements.commandPaletteInput?.value || '');
  commandPaletteActiveIndex = 0;
  renderCommandPaletteResults();
}

function toggleCommandPalette(forceOpen = null) {
  const overlay = elements.commandPaletteOverlay;
  if (!overlay) return false;
  const shouldOpen = forceOpen == null ? overlay.hidden : !!forceOpen;
  overlay.hidden = !shouldOpen;
  if (shouldOpen) {
    lastFocusedBeforeCommandPalette = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (elements.commandPaletteInput) {
      elements.commandPaletteInput.value = '';
      updateCommandPaletteResults();
      elements.commandPaletteInput.focus();
    }
    setStatus('명령 팔레트를 열었습니다. 검색 후 Enter를 누르세요.');
  } else if (lastFocusedBeforeCommandPalette && typeof lastFocusedBeforeCommandPalette.focus === 'function') {
    lastFocusedBeforeCommandPalette.focus();
  }
  return shouldOpen;
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

function nextActionHint(kind) {
  return EXPORT_NEXT_ACTION_HINTS[kind] || '다음: 결과물을 열어 품질과 경로를 확인해 주세요.';
}

function notifySavedWithGuide(kind, fileName, detail = '') {
  const detailText = detail ? ` (${detail})` : '';
  setStatus(`저장 완료: ${fileName}${detailText} · ${nextActionHint(kind)}`);
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

function resolveSidebarTab(panelId) {
  const requested = String(panelId || '');
  const scope = requested.startsWith('left-')
    ? 'left'
    : (requested.startsWith('right-') ? 'right' : '');
  if (!scope) return '';
  const scopedButtons = elements.sidebarTabButtons.filter((button) => String(button.dataset.sidebarTab || '').startsWith(`${scope}-`));
  const scopedPanels = elements.sidebarPanels.filter((panel) => String(panel.dataset.sidebarPanel || '').startsWith(`${scope}-`));
  const hasRequestedButton = scopedButtons.some((button) => button.dataset.sidebarTab === requested);
  const hasRequestedPanel = scopedPanels.some((panel) => panel.dataset.sidebarPanel === requested);
  if (hasRequestedButton && hasRequestedPanel) return requested;
  const fallback = scopedButtons.find((button) => scopedPanels.some((panel) => panel.dataset.sidebarPanel === button.dataset.sidebarTab));
  return fallback?.dataset.sidebarTab || '';
}

function setSidebarTab(panelId, { syncWorkflow = true } = {}) {
  const targetPanelId = resolveSidebarTab(panelId);
  const scope = String(targetPanelId || '').startsWith('left-')
    ? 'left'
    : (String(targetPanelId || '').startsWith('right-') ? 'right' : '');
  if (!scope) return;
  for (const button of elements.sidebarTabButtons) {
    const buttonScope = String(button.dataset.sidebarTab || '').startsWith('left-')
      ? 'left'
      : (String(button.dataset.sidebarTab || '').startsWith('right-') ? 'right' : '');
    if (buttonScope !== scope) continue;
    button.classList.toggle('is-active', button.dataset.sidebarTab === targetPanelId);
  }
  for (const panel of elements.sidebarPanels) {
    const panelScope = String(panel.dataset.sidebarPanel || '').startsWith('left-')
      ? 'left'
      : (String(panel.dataset.sidebarPanel || '').startsWith('right-') ? 'right' : '');
    if (panelScope !== scope) continue;
    panel.classList.toggle('is-active', panel.dataset.sidebarPanel === targetPanelId);
  }
  if (scope === 'left' && syncWorkflow) syncWorkflowGuideStepByLeftTab(targetPanelId);
}

function getSlotRuntimeMeta(slotUid) {
  const doc = elements.previewFrame?.contentDocument;
  const slot = doc?.querySelector?.(`[data-node-uid="${slotUid}"]`);
  if (!slot) return { lastAppliedFileName: '', hasMedia: false };
  const img = slot.querySelector('img');
  const src = String(img?.getAttribute('src') || '').trim();
  const backgroundImage = String(slot.style?.backgroundImage || '').trim();
  const hasMedia = Boolean(
    (src && !src.startsWith('data:image/svg+xml') && !/placeholder/i.test(src))
    || (backgroundImage && backgroundImage !== 'none'),
  );
  return {
    lastAppliedFileName: String(slot.dataset.lastAppliedFileName || ''),
    hasMedia,
  };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderUploadBucket(container, items, selectedUidSet = new Set(), emptyMessage = '항목이 없습니다.') {
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<div class="upload-slot-empty">${emptyMessage}</div>`;
    return;
  }
  container.innerHTML = items.map((item) => `
    <button class="upload-slot-item ${selectedUidSet.has(item.uid) ? 'is-active' : ''}" data-upload-slot-uid="${escapeHtml(item.uid)}">
      <div class="upload-slot-item__title">${escapeHtml(item.label || item.uid)}</div>
      <div class="upload-slot-item__meta">${escapeHtml(item.meta || '슬롯')}</div>
    </button>
  `).join('');
}

function renderUploadLists(state) {
  const editorMeta = state?.editorMeta || {};
  const slots = Array.isArray(editorMeta.slots) ? editorMeta.slots : [];
  const selectedUidSet = new Set((editorMeta.selectedItems || []).map((item) => item.uid));
  const emptySlotUidSet = new Set((editorMeta.preflight?.emptySlots || []).map((slot) => slot.uid));
  const brokenSlotUidSet = new Set((state?.project?.assets || [])
    .filter((asset) => asset.status === 'unresolved' && asset.ownerUid)
    .map((asset) => asset.ownerUid));

  const recent = [];
  const documentUse = [];
  const unassigned = [];
  const broken = [];

  for (const slot of slots) {
    const runtime = getSlotRuntimeMeta(slot.uid);
    const baseItem = {
      uid: slot.uid,
      label: slot.label || slot.uid,
      meta: runtime.lastAppliedFileName || `score ${slot.score ?? '-'}`,
    };
    if (runtime.lastAppliedFileName) recent.push(baseItem);
    if (runtime.hasMedia && !runtime.lastAppliedFileName) documentUse.push(baseItem);
    if (emptySlotUidSet.has(slot.uid)) unassigned.push({ ...baseItem, meta: '빈 슬롯' });
    if (brokenSlotUidSet.has(slot.uid)) broken.push({ ...baseItem, meta: '미해결 자산 연결' });
  }

  renderUploadBucket(elements.uploadRecentList, recent, selectedUidSet, '최근 업로드가 없습니다.');
  renderUploadBucket(elements.uploadDocumentList, documentUse, selectedUidSet, '문서 기본 이미지만 사용 중입니다.');
  renderUploadBucket(elements.uploadUnassignedList, unassigned, selectedUidSet, '미할당 슬롯이 없습니다.');
  renderUploadBucket(elements.uploadBrokenList, broken, selectedUidSet, '깨진 자산 슬롯이 없습니다.');
}

function renderProjectSnapshotList(state) {
  if (!elements.snapshotList) return;
  const entries = getSnapshotEntriesForProject(state?.project || null);
  if (!entries.length) {
    elements.snapshotList.innerHTML = '<div class="upload-slot-empty">저장된 스냅샷이 없습니다.</div>';
    return;
  }
  elements.snapshotList.innerHTML = entries.map((entry) => {
    const createdText = entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '-';
    const previewText = escapeHtml(entry.thumbnail?.text || '미리보기 없음');
    const imageSrc = String(entry.thumbnail?.imageSrc || '').trim();
    const thumb = imageSrc
      ? `<img src="${escapeHtml(imageSrc)}" alt="스냅샷 썸네일" loading="lazy" />`
      : `<span>${previewText}</span>`;
    return `
      <article class="snapshot-item" data-snapshot-id="${escapeHtml(entry.id)}">
        <div class="snapshot-item__top">
          <strong class="snapshot-item__title">${escapeHtml(entry.title || '이름 없음')}</strong>
          <span class="snapshot-item__time">${escapeHtml(createdText)}</span>
        </div>
        <div class="snapshot-item__thumb">${thumb}</div>
        <p class="snapshot-item__desc">${escapeHtml(entry.note || previewText)}</p>
        <div class="snapshot-item__actions">
          <button class="button button--small button--secondary" type="button" data-snapshot-action="restore">복원</button>
          <button class="button button--small button--ghost" type="button" data-snapshot-action="delete">삭제</button>
        </div>
      </article>
    `;
  }).join('');
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
  if (elements.exportPresetSelect) elements.exportPresetSelect.title = preset.description || '';
  for (const button of elements.downloadPresetButtons) {
    button?.classList.toggle('is-active', (button?.dataset?.downloadPreset || '') === preset.id);
  }
}

function setSelectionMode(nextMode) {
  store.setSelectionMode(nextMode);
  activeEditor?.setSelectionMode(nextMode);
}

function syncViewFeatureButtons() {
  const mapping = [
    ['snap', elements.viewSnapToggleButton, '스냅'],
    ['guide', elements.viewGuideToggleButton, '가이드'],
    ['ruler', elements.viewRulerToggleButton, '눈금자'],
  ];
  for (const [key, button, label] of mapping) {
    if (!button) continue;
    const isOn = !!viewFeatureFlags[key];
    button.classList.toggle('is-active', isOn);
    button.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    button.textContent = `${label}: ${isOn ? 'ON' : 'OFF'}`;
  }
}

function toggleViewFeatureFlag(key, label) {
  if (!(key in viewFeatureFlags)) return;
  viewFeatureFlags[key] = !viewFeatureFlags[key];
  syncViewFeatureButtons();
  setStatus(`${label} 표시를 ${viewFeatureFlags[key] ? '켰습니다' : '껐습니다'} (기능 플래그 유지)`);
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

function notifyStorageWriteFailure(context, error) {
  const now = Date.now();
  if (now - lastStorageWriteFailureAt < 2000) return;
  lastStorageWriteFailureAt = now;
  const detail = extractErrorMessage(error) || '브라우저 저장소 용량 초과 또는 접근 제한';
  store.setLastError(detail);
  setStatus(`${context} 저장에 실패했습니다. 용량을 비우고 다시 시도해 주세요.`, { preserveLastError: true });
  console.error('[LOCAL_STORAGE_WRITE_ERROR]', context, error);
}

async function persistAutosave(snapshot) {
  const project = store.getState().project;
  if (!project || !snapshot) return;
  const writeId = ++autosaveWriteSequence;
  let portableHtml = snapshot.html || '';
  if (activeEditor?.getCurrentPortableHtml) {
    try {
      portableHtml = await activeEditor.getCurrentPortableHtml();
    } catch {}
  }
  if (writeId !== autosaveWriteSequence) return;
  const payload = {
    savedAt: new Date().toISOString(),
    sourceName: project.sourceName,
    sourceType: project.sourceType,
    fixtureId: project.fixtureId || '',
    snapshot: {
      ...snapshot,
      html: portableHtml,
    },
  };
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
  } catch (error) {
    notifyStorageWriteFailure('자동저장', error);
  }
}

function resolveSnapshotProjectKey(project) {
  if (!project) return '';
  return [project.fixtureId || '', project.sourceType || '', project.sourceName || ''].join('::');
}

function readProjectSnapshotPayload() {
  try {
    const raw = localStorage.getItem(PROJECT_SNAPSHOT_KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.entries)) return { entries: [] };
    return { entries: parsed.entries.filter((entry) => entry?.snapshot?.html) };
  } catch {
    return { entries: [] };
  }
}

function writeProjectSnapshotPayload(payload) {
  try {
    localStorage.setItem(PROJECT_SNAPSHOT_KEY, JSON.stringify(payload));
    return true;
  } catch (error) {
    notifyStorageWriteFailure('스냅샷', error);
    return false;
  }
}

function buildSnapshotThumbnail(snapshotHtml = '') {
  try {
    const doc = new DOMParser().parseFromString(snapshotHtml, 'text/html');
    const img = doc.querySelector('img[src]');
    const text = (doc.body?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    return {
      imageSrc: String(img?.getAttribute('src') || '').trim(),
      text: text || '텍스트 미리보기가 없습니다.',
    };
  } catch {
    return { imageSrc: '', text: '미리보기를 읽을 수 없습니다.' };
  }
}

function getSnapshotEntriesForProject(project) {
  const key = resolveSnapshotProjectKey(project);
  if (!key) return [];
  return readProjectSnapshotPayload().entries.filter((entry) => entry.projectKey === key);
}

async function createProjectSnapshot({
  title = '',
  note = '',
  auto = false,
  statusMessage = '스냅샷을 저장했습니다.',
} = {}) {
  const project = store.getState().project;
  if (!project || !activeEditor) {
    setStatus('먼저 프로젝트를 불러와 주세요.');
    return null;
  }
  const snapshot = activeEditor.captureSnapshot(auto ? 'snapshot-auto' : 'snapshot-manual');
  if (!snapshot?.html) {
    setStatus('스냅샷 저장에 실패했습니다. 다시 시도해 주세요.');
    return null;
  }
  let portableHtml = snapshot.html;
  try {
    portableHtml = await activeEditor.getCurrentPortableHtml();
  } catch {}
  const portableSnapshot = { ...snapshot, html: portableHtml };
  const now = new Date();
  const thumbnail = buildSnapshotThumbnail(portableSnapshot.html);
  const entry = {
    id: `snap_${Math.random().toString(36).slice(2, 10)}`,
    projectKey: resolveSnapshotProjectKey(project),
    sourceName: project.sourceName || '',
    createdAt: now.toISOString(),
    title: (title || '').trim() || (auto ? `자동백업 ${now.toLocaleString()}` : `수동 스냅샷 ${now.toLocaleString()}`),
    note: (note || '').trim(),
    auto: !!auto,
    thumbnail,
    snapshot: portableSnapshot,
  };
  const payload = readProjectSnapshotPayload();
  payload.entries = [entry, ...payload.entries].slice(0, PROJECT_SNAPSHOT_LIMIT);
  if (!writeProjectSnapshotPayload(payload)) return null;
  renderProjectSnapshotList(store.getState());
  setStatus(statusMessage);
  return entry;
}

async function restoreProjectSnapshotById(snapshotId) {
  const state = store.getState();
  const project = state.project;
  if (!project) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const entry = getSnapshotEntriesForProject(project).find((item) => item.id === snapshotId);
  if (!entry?.snapshot?.html) return setStatus('복원할 스냅샷을 찾지 못했습니다.');
  await createProjectSnapshot({
    auto: true,
    title: `복원 전 자동백업 (${entry.title || '스냅샷'})`,
    statusMessage: '복원 전 자동백업을 저장했습니다.',
  });
  mountProject(project, { snapshot: entry.snapshot, preserveHistory: false, force: true });
  setStatus(`스냅샷 "${entry.title || '이름 없음'}" 상태로 복원했습니다.`);
}

function deleteProjectSnapshotById(snapshotId) {
  const payload = readProjectSnapshotPayload();
  const nextEntries = payload.entries.filter((entry) => entry.id !== snapshotId);
  if (nextEntries.length === payload.entries.length) return;
  payload.entries = nextEntries;
  writeProjectSnapshotPayload(payload);
  renderProjectSnapshotList(store.getState());
  setStatus('스냅샷을 삭제했습니다.');
}

function refreshHistoryButtons() {
  const hasProject = !!store.getState().project;
  if (elements.undoButton) elements.undoButton.disabled = !hasProject || historyState.undoStack.length === 0;
  if (elements.redoButton) elements.redoButton.disabled = !hasProject || historyState.redoStack.length === 0;
  if (elements.restoreAutosaveButton) elements.restoreAutosaveButton.disabled = !readAutosavePayload();
  refreshLauncherRecentButton();
}

function resetHistory(baseSnapshot = null) {
  historyState.baseSnapshot = baseSnapshot?.html ? baseSnapshot : null;
  historyState.undoStack = [];
  historyState.redoStack = [];
  perfState.inputLatencies = [];
  perfState.p95InputLatencyMs = 0;
  perfState.lastInputLatencyMs = 0;
  perfState.slowFrames = 0;
  perfState.lastDirtyRect = null;
  refreshHistoryButtons();
}

function latestHistorySnapshot() {
  const latest = historyState.undoStack.at(-1);
  if (!latest) return historyState.baseSnapshot;
  return resolveHistoryEntrySnapshot(latest, 'after');
}

function createHtmlPatch(fromHtml = '', toHtml = '') {
  if (fromHtml === toHtml) return { start: 0, deleteCount: 0, insert: '' };
  let start = 0;
  const fromLen = fromHtml.length;
  const toLen = toHtml.length;
  while (start < fromLen && start < toLen && fromHtml[start] === toHtml[start]) start += 1;
  let fromEnd = fromLen - 1;
  let toEnd = toLen - 1;
  while (fromEnd >= start && toEnd >= start && fromHtml[fromEnd] === toHtml[toEnd]) {
    fromEnd -= 1;
    toEnd -= 1;
  }
  return {
    start,
    deleteCount: Math.max(0, fromEnd - start + 1),
    insert: toHtml.slice(start, toEnd + 1),
  };
}

function applyHtmlPatch(baseHtml = '', patch = null) {
  if (!patch) return baseHtml;
  const start = Math.max(0, Number(patch.start) || 0);
  const deleteCount = Math.max(0, Number(patch.deleteCount) || 0);
  const insert = String(patch.insert || '');
  return `${baseHtml.slice(0, start)}${insert}${baseHtml.slice(start + deleteCount)}`;
}

function toPatchSnapshot(snapshot, patch) {
  if (!snapshot?.html) return null;
  return { ...snapshot, htmlPatch: patch, html: undefined };
}

function resolvePatchSnapshot(patchedSnapshot, baseHtml = '') {
  if (!patchedSnapshot) return null;
  if (patchedSnapshot.html) return patchedSnapshot;
  return { ...patchedSnapshot, html: applyHtmlPatch(baseHtml, patchedSnapshot.htmlPatch) };
}

function resolveHistoryEntrySnapshot(entry, key) {
  if (!entry) return null;
  const baseHtml = historyState.baseSnapshot?.html || '';
  if (key === 'before') return resolvePatchSnapshot(entry.before, baseHtml);
  if (key === 'after') return resolvePatchSnapshot(entry.after, baseHtml);
  return null;
}

function shouldMergeHistoryCommand(previous, next) {
  if (!previous || !next) return false;
  if (previous.label !== next.label) return false;
  if (!LIVE_HISTORY_LABELS.has(next.label)) return false;
  const prevAt = new Date(previous.at || 0).getTime();
  const nextAt = new Date(next.at || 0).getTime();
  if (!Number.isFinite(prevAt) || !Number.isFinite(nextAt)) return false;
  return Math.max(0, nextAt - prevAt) <= HISTORY_MERGE_WINDOW_MS;
}

function recordHistoryCommand(command, { clearRedo = true } = {}) {
  if (!command?.after?.html || !command?.before?.html) return;
  const beforePatch = createHtmlPatch(historyState.baseSnapshot?.html || '', command.before.html);
  const afterPatch = createHtmlPatch(historyState.baseSnapshot?.html || '', command.after.html);
  const compactCommand = {
    ...command,
    before: toPatchSnapshot(command.before, beforePatch),
    after: toPatchSnapshot(command.after, afterPatch),
  };
  const last = historyState.undoStack.at(-1);
  if (shouldMergeHistoryCommand(last, compactCommand)) {
    last.after = compactCommand.after;
    last.at = compactCommand.at;
    persistAutosave(resolvePatchSnapshot(compactCommand.after, historyState.baseSnapshot?.html || ''));
    refreshHistoryButtons();
    return;
  }
  const lastAfter = resolveHistoryEntrySnapshot(last, 'after');
  if (lastAfter?.html === command.after.html) {
    persistAutosave(resolvePatchSnapshot(compactCommand.after, historyState.baseSnapshot?.html || ''));
    refreshHistoryButtons();
    return;
  }
  historyState.undoStack.push(compactCommand);
  if (historyState.undoStack.length > HISTORY_LIMIT) historyState.undoStack.shift();
  if (clearRedo) historyState.redoStack = [];
  persistAutosave(resolvePatchSnapshot(compactCommand.after, historyState.baseSnapshot?.html || ''));
  updateLatencyDashboard(compactCommand);
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
  restoreHistorySnapshot(resolveHistoryEntrySnapshot(current, 'before'), '이전 작업으로 되돌렸습니다.');
}

function redoHistory() {
  if (!historyState.redoStack.length) {
    setStatus('다시 적용할 작업이 없습니다.');
    return;
  }
  const next = historyState.redoStack.pop();
  historyState.undoStack.push(next);
  refreshHistoryButtons();
  restoreHistorySnapshot(resolveHistoryEntrySnapshot(next, 'after'), '되돌린 작업을 다시 적용했습니다.');
}

function percentile(values, ratio = 0.95) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * ratio) - 1));
  return sorted[index];
}

function updateLatencyDashboard(command) {
  const latency = Number(command?.inputLatencyMs);
  if (!Number.isFinite(latency) || latency < 0) return;
  perfState.inputLatencies.push(latency);
  if (perfState.inputLatencies.length > perfState.sampleLimit) perfState.inputLatencies.shift();
  perfState.lastInputLatencyMs = latency;
  perfState.p95InputLatencyMs = Number(percentile(perfState.inputLatencies, 0.95).toFixed(2));
  perfState.slowFrames = perfState.inputLatencies.filter((item) => item >= 50).length;
  perfState.lastDirtyRect = command?.dirtyRect || null;
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
    sections: [],
    selectedSectionUid: '',
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

function resolvePrimarySelectionType(editorMeta) {
  const count = Number(editorMeta?.selectionCount || 0);
  if (count !== 1) return '';
  const selectedType = editorMeta?.selectedItems?.[0]?.type || editorMeta?.selected?.type || '';
  if (selectedType === 'slot') return 'image';
  if (selectedType === 'text') return 'text';
  if (selectedType === 'box') return 'box';
  return '';
}

function syncRightPanelBySelection(editorMeta) {
  const count = Number(editorMeta?.selectionCount || 0);
  const hasSelection = count > 0;
  if (elements.selectionEmptyState) elements.selectionEmptyState.hidden = hasSelection;
  if (!hasSelection) {
    if (elements.basicAttributeSection) elements.basicAttributeSection.open = false;
    if (elements.advancedAttributeSection) elements.advancedAttributeSection.open = false;
    return;
  }
  const type = resolvePrimarySelectionType(editorMeta);
  if (type === 'text') {
    setSidebarTab('right-text');
    if (elements.basicAttributeSection) elements.basicAttributeSection.open = false;
    if (elements.advancedAttributeSection) elements.advancedAttributeSection.open = false;
    return;
  }
  setSidebarTab('right-arrange');
  if (elements.basicAttributeSection) elements.basicAttributeSection.open = true;
  if (elements.advancedAttributeSection) {
    elements.advancedAttributeSection.open = type === 'image';
  }
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
  if (action === 'image-crop-enter') return executeEditorCommand('image-crop-enter');
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
  const editorMeta = state.editorMeta
    ? {
      ...state.editorMeta,
      performance: {
        sampleCount: perfState.inputLatencies.length,
        p95InputLatencyMs: perfState.p95InputLatencyMs,
        lastInputLatencyMs: perfState.lastInputLatencyMs,
        slowFrames: perfState.slowFrames,
        lastDirtyRect: perfState.lastDirtyRect,
      },
    }
    : null;
  renderSelectionModeButtons(state.selectionMode);
  renderSummaryCards(elements.summaryCards, state.project, editorMeta);
  renderIssueList(elements.issueList, state.project);
  if (elements.normalizeStats) {
    renderNormalizeStats(elements.normalizeStats, state.project);
  }
  renderPreflight(elements.preflightContainer, editorMeta);
  if (elements.selectionInspector) {
    renderSelectionInspector(elements.selectionInspector, editorMeta, state.imageApplyDiagnostic);
  }
  renderSectionFilmstrip(elements.sectionList, editorMeta);
  renderSlotList(elements.slotList, editorMeta);
  renderUploadLists(state);
  renderProjectSnapshotList(state);
  renderLayerTree(elements.layerTree, editorMeta, elements.layerFilterInput?.value || '');
  renderProjectMeta(elements.projectMeta, state.project, {
    selectionMode: state.selectionMode,
    undoDepth: historyState.undoStack.length,
    redoDepth: historyState.redoStack.length,
    autosaveSavedAt: readAutosavePayload()?.savedAt || '',
    textEditing: !!editorMeta?.textEditing,
    selectionCount: editorMeta?.selectionCount || 0,
    hiddenCount: editorMeta?.hiddenCount || 0,
    lockedCount: editorMeta?.lockedCount || 0,
    exportPresetLabel: currentExportPreset().label,
    preflightBlockingErrors: editorMeta?.preflight?.blockingErrors || 0,
  });
  if (elements.assetTableWrap) {
    renderAssetTable(elements.assetTableWrap, state.project, elements.assetFilterInput?.value || '');
  }
  syncTextStyleControls(editorMeta);
  syncBatchSummary(editorMeta);
  syncRightPanelBySelection(editorMeta);
  syncGeometryControls();
  syncCanvasDirectUi(editorMeta);
  const errorSuffix = state.lastError ? ` · 최근 오류: ${state.lastError}` : '';
  elements.statusText.textContent = `${state.statusText}${errorSuffix}`;
  if (elements.documentStatusChip) {
    const docStatus = resolveDocumentStatus(state);
    elements.documentStatusChip.dataset.status = docStatus.status;
    elements.documentStatusChip.textContent = docStatus.text;
    if (elements.topbarSaveStatusBadge) {
      elements.topbarSaveStatusBadge.dataset.status = docStatus.status;
      elements.topbarSaveStatusBadge.textContent = docStatus.text;
    }
  }
  syncTopbarProjectName(state.project);
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
  if (elements.textEditButton) elements.textEditButton.disabled = !hasEditor;
  elements.groupButton.disabled = !hasEditor || !state.editorMeta?.canGroupSelection;
  elements.ungroupButton.disabled = !hasEditor || !state.editorMeta?.canUngroupSelection;
  elements.preflightRefreshButton.disabled = !hasEditor;
  if (elements.saveProjectSnapshotButton) elements.saveProjectSnapshotButton.disabled = !hasEditor;
  if (elements.saveSnapshotFromPanelButton) elements.saveSnapshotFromPanelButton.disabled = !hasEditor;
  for (const button of elements.batchActionButtons) {
    const requiresMany = button.dataset.batchAction !== 'reset-transform';
    const needed = requiresMany ? 2 : 1;
    button.disabled = !hasEditor || (state.editorMeta?.selectionCount || 0) < needed;
  }
  const selectionCount = Number(state.editorMeta?.selectionCount || 0);
  if (elements.stackHorizontalButton) elements.stackHorizontalButton.disabled = !hasEditor || selectionCount < 2;
  if (elements.stackVerticalButton) elements.stackVerticalButton.disabled = !hasEditor || selectionCount < 2;
  if (elements.tidyHorizontalButton) elements.tidyHorizontalButton.disabled = !hasEditor || selectionCount < 3;
  if (elements.tidyVerticalButton) elements.tidyVerticalButton.disabled = !hasEditor || selectionCount < 3;
  for (const button of elements.downloadEditedButtons) {
    button.disabled = !hasProject;
  }
  elements.downloadNormalizedButton.disabled = !hasProject;
  elements.downloadLinkedZipButton.disabled = !hasEditor;
  for (const button of elements.exportPngButtons) {
    button.disabled = !hasEditor;
  }
  for (const button of elements.exportJpgButtons) {
    button.disabled = !hasEditor;
  }
  elements.exportSectionsZipButton.disabled = !hasEditor;
  elements.exportSelectionPngButton.disabled = !hasEditor || (state.editorMeta?.selectionCount || 0) < 1;
  elements.exportPresetPackageButton.disabled = !hasEditor;
  if (elements.sectionDuplicateButton) elements.sectionDuplicateButton.disabled = !hasEditor || !state.editorMeta?.selectedSectionUid;
  if (elements.sectionMoveUpButton) elements.sectionMoveUpButton.disabled = !hasEditor || !state.editorMeta?.selectedSectionUid;
  if (elements.sectionMoveDownButton) elements.sectionMoveDownButton.disabled = !hasEditor || !state.editorMeta?.selectedSectionUid;
  if (elements.sectionDeleteButton) elements.sectionDeleteButton.disabled = !hasEditor || !state.editorMeta?.selectedSectionUid;
  if (elements.sectionAddButton) elements.sectionAddButton.disabled = !hasEditor;
  if (elements.downloadReportButton) elements.downloadReportButton.disabled = !hasProject;
  if (elements.applyCodeToEditorButton) elements.applyCodeToEditorButton.disabled = !hasProject || currentCodeSource === 'report';
  if (elements.reloadCodeFromEditorButton) elements.reloadCodeFromEditorButton.disabled = !hasProject;
  if (elements.saveFormatSelect) elements.saveFormatSelect.disabled = !hasProject;
  if (elements.applyAdvancedSettingsButton) elements.applyAdvancedSettingsButton.disabled = !hasProject;
  syncExportPresetUi();
  syncSaveFormatUi();
  syncWorkspaceButtons();
  syncWorkflowGuide(state);
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

function applyNumberStep(input, direction) {
  if (!input || input.disabled) return;
  try {
    if (direction > 0) input.stepUp();
    else input.stepDown();
  } catch {
    const stepRaw = Number.parseFloat(input.step);
    const step = Number.isFinite(stepRaw) && stepRaw > 0 ? stepRaw : 1;
    const current = Number.parseFloat(input.value);
    const base = Number.isFinite(current) ? current : 0;
    input.value = String(base + (direction > 0 ? step : -step));
  }
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function resolveNudgeStepFromEvent(event) {
  if (event?.shiftKey) return NUDGE_STEP_RULE.shift;
  if (event?.altKey) return NUDGE_STEP_RULE.alt;
  return NUDGE_STEP_RULE.base;
}

function applyKeyboardNudgeToNumberInput(event, input) {
  if (!input || input.disabled) return false;
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return false;
  const direction = event.key === 'ArrowUp' ? 1 : -1;
  const step = resolveNudgeStepFromEvent(event);
  const current = Number.parseFloat(input.value);
  const base = Number.isFinite(current) ? current : 0;
  input.value = String(base + (direction * step));
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  event.preventDefault();
  return true;
}

function attachNumberStepper(input) {
  if (!input || input.dataset.stepperReady === '1') return;
  const wrapper = document.createElement('div');
  wrapper.className = 'number-stepper';
  input.parentNode?.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  const buttonWrap = document.createElement('div');
  buttonWrap.className = 'number-stepper__buttons';
  const plusButton = document.createElement('button');
  plusButton.type = 'button';
  plusButton.className = 'number-stepper__btn';
  plusButton.textContent = '+';
  plusButton.title = '값 증가';
  const minusButton = document.createElement('button');
  minusButton.type = 'button';
  minusButton.className = 'number-stepper__btn';
  minusButton.textContent = '−';
  minusButton.title = '값 감소';

  plusButton.addEventListener('click', () => applyNumberStep(input, 1));
  minusButton.addEventListener('click', () => applyNumberStep(input, -1));
  buttonWrap.append(plusButton, minusButton);
  wrapper.append(buttonWrap);

  input.dataset.stepperReady = '1';
}

function initNumericSteppers() {
  const targets = [
    elements.textFontSizeInput,
    elements.textLineHeightInput,
    elements.textLetterSpacingInput,
    elements.geometryXInput,
    elements.geometryYInput,
    elements.geometryWInput,
    elements.geometryHInput,
    elements.canvasGeometryXInput,
    elements.canvasGeometryYInput,
    elements.canvasGeometryWInput,
    elements.canvasGeometryHInput,
  ];
  for (const input of targets) attachNumberStepper(input);
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
    setAppState(APP_STATES.editor);
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
    setAppState(APP_STATES.editor);
    setStatus(`HTML 파일 ${file.name}을 불러왔습니다. 미해결 자산 ${project.summary.assetsUnresolved}개입니다.`);
  } catch (error) {
    setStatusWithError(`HTML 파일 열기 중 오류가 발생했습니다. ${IMPORT_FAILURE_GUIDES.htmlOpen}`, error, { logTag: 'OPEN_HTML_FILE_ERROR' });
  }
}

async function handleFolderImport(files) {
  const requestId = importRequestSequence += 1;
  try {
    const fileIndex = createImportFileIndex(files, 'folder-import');
    const htmlEntry = choosePrimaryHtmlEntry(fileIndex);
    if (!htmlEntry) {
      setStatus(`선택한 폴더에 HTML 파일이 없습니다. ${IMPORT_FAILURE_GUIDES.folderNoHtml}`);
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
    setAppState(APP_STATES.editor);
    setStatus(`프로젝트 폴더 import 완료: ${htmlEntry.relativePath}. resolved ${project.summary.assetsResolved}개, unresolved ${project.summary.assetsUnresolved}개입니다.`);
  } catch (error) {
    setStatusWithError(`폴더 import 중 오류가 발생했습니다. ${IMPORT_FAILURE_GUIDES.folderImport}`, error, { logTag: 'FOLDER_IMPORT_ERROR' });
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
    setAppState(APP_STATES.editor);
    setStatus(`붙여넣기 HTML을 정규화했습니다. 슬롯 후보 ${project.summary.totalSlotCandidates}개를 찾았습니다.`);
  } catch (error) {
    setStatusWithError(`붙여넣기 적용 중 오류가 발생했습니다. ${IMPORT_FAILURE_GUIDES.pasteMalformed}`, error, { logTag: 'APPLY_PASTED_HTML_ERROR' });
  }
}

async function runDownloadByChoice(choice) {
  if (choice === 'save-edited') return downloadEditedHtml();
  if (choice === 'export-full-png') return exportFullPng();
  if (choice === 'export-full-jpg') return exportFullJpg();
  if (choice === 'export-selection-png') return exportSelectionPng();
  if (choice === 'export-sections-zip') return exportSectionsZip();
  if (choice === 'download-normalized-html') return downloadNormalizedHtml();
  if (choice === 'download-linked-zip') return downloadLinkedZip();
  if (choice === 'download-export-preset-package') return downloadExportPresetPackage();
  throw new Error(`지원하지 않는 저장/출력 선택입니다: ${choice}`);
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
  notifySavedWithGuide('export-full-png', fileName, `${exportScale()}x${autoApplied ? ', 고급값 자동 반영' : ''}`);
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
  notifySavedWithGuide('export-full-jpg', fileName, `${exportScale()}x, 품질 ${quality.toFixed(2)}${autoApplied ? ', 고급값 자동 반영' : ''}`);
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
  notifySavedWithGuide('export-selection-png', fileName, `${exportScale()}x, 여백 ${options.padding}px, 배경 ${bgLabel}, 포함 ${meta?.targetCount || 0}개, 제외 ${skipped}개${autoApplied ? ', 고급값 자동 반영' : ''}`);
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
  notifySavedWithGuide('export-sections-zip', fileName, `${exportScale()}x, 섹션 ${entries.length}개${autoApplied ? ', 고급값 자동 반영' : ''}`);
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
  const fileName = `${baseName}__${preset.id}-preset.zip`;
  downloadBlob(fileName, zip);
  notifySavedWithGuide('download-export-preset-package', fileName, `${preset.label}, 항목 ${entries.length}개`);
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
  setAppState(APP_STATES.editor);
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

function applyTextStyleLive(event) {
  if (!activeEditor) return;
  const sourceControl = event?.currentTarget || null;
  const patch = {};
  if (sourceControl === elements.textFontSizeInput) patch.fontSize = elements.textFontSizeInput?.value?.trim() || '';
  if (sourceControl === elements.textLineHeightInput) patch.lineHeight = elements.textLineHeightInput?.value?.trim() || '';
  if (sourceControl === elements.textLetterSpacingInput) patch.letterSpacing = elements.textLetterSpacingInput?.value?.trim() || '';
  if (sourceControl === elements.textWeightSelect) patch.fontWeight = elements.textWeightSelect?.value || '';
  if (sourceControl === elements.textColorInput) patch.color = elements.textColorInput?.value || '';
  if (!Object.keys(patch).length) return;
  const result = activeEditor.applyTextStyle(patch);
  if (result?.ok) setStatus('텍스트 스타일을 실시간 반영했습니다.');
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
}

function applyBatchAction(action) {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.applyBatchLayout(action);
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
}

function applyStackCommand(direction = 'vertical') {
  if (!activeEditor) return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
  const gap = Number.parseFloat(elements.stackGapInput?.value || '24');
  const align = elements.stackAlignSelect?.value || 'start';
  const result = activeEditor.applyStackLayout({
    direction,
    gap: Number.isFinite(gap) ? gap : 24,
    align,
  });
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  return result;
}

function applyTidyCommand(axis = 'x') {
  if (!activeEditor) return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
  const result = activeEditor.tidySelection({ axis });
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  return result;
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
  const nextProject = normalizeProject({
    html,
    sourceName: project.sourceName || 'edited.html',
    sourceType: 'code-apply',
    fileIndex: project.importFileIndex || null,
    htmlEntryPath: project.htmlEntryPath || project.fileContext?.htmlEntryPath || '',
  });
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
    setAppState(APP_STATES.launch);
    populateFixtureSelect();
    populateExportPresetSelect();
    syncExportPresetUi({ forceScale: true });
    refreshLauncherRecentButton();
    const bootEnvironmentReport = evaluateLocalBootEnvironment();
    renderLocalModeNotice(elements.localModeNotice, bootEnvironmentReport);
    renderShortcutHelpList();
    if (bootEnvironmentReport.errorCount || bootEnvironmentReport.warningCount) {
      setStatus(`환경 점검: 오류 ${bootEnvironmentReport.errorCount}개 · 경고 ${bootEnvironmentReport.warningCount}개`);
    }
    renderEmptyPreview();
    syncWorkflowGuide(store.getState());
  } catch (error) {
    console.error('[BOOT_ERROR]', error);
    setStatusWithError('초기 로딩 중 오류가 발생했습니다. 브라우저 콘솔(F12)을 확인해 주세요.', error, { logTag: '' });
  }
}

safeBoot();
onboardingCompleted = hasCompletedOnboarding();
renderOnboardingChecklist();

function bindEvents() {
  initNumericSteppers();
  const logMissingElement = (elementName, context) => {
    console.warn(`[${context}] 필수 요소 누락: #${elementName}`);
  };
  const bindElementEvent = (elementName, eventName, handler, options) => {
    const target = elements[elementName];
    if (!target) {
      logMissingElement(elementName, 'bindEvents');
      return;
    }
    target.addEventListener(eventName, handler, options);
  };
  const requiredElementNames = [
    'openHtmlButton',
    'openFolderButton',
    'loadFixtureButton',
    'applyPasteButton',
    'replaceImageButton',
    'manualSlotButton',
    'toggleHideButton',
    'toggleLockButton',
    'demoteSlotButton',
    'redetectButton',
    'preflightRefreshButton',
    'applyTextStyleButton',
    'clearTextStyleButton',
    'undoButton',
    'redoButton',
    'restoreAutosaveButton',
    'saveProjectSnapshotButton',
    'saveSnapshotFromPanelButton',
    'downloadReportButton',
    'exportPresetSelect',
    'htmlFileInput',
    'folderInput',
    'replaceImageInput',
    'assetFilterInput',
    'layerFilterInput',
    'slotList',
    'layerTree',
    'snapshotList',
  ];
  for (const elementName of requiredElementNames) {
    if (!elements[elementName]) {
      logMissingElement(elementName, 'bindEvents');
    }
  }

for (const button of elements.selectionModeButtons) button.addEventListener('click', () => {
  setSelectionMode(button.dataset.selectionMode);
});
if (elements.workflowGuideSelect) elements.workflowGuideSelect.addEventListener('change', () => syncWorkflowGuide(store.getState(), { announce: true }));
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
elements.stackHorizontalButton?.addEventListener('click', () => applyStackCommand('horizontal'));
elements.stackVerticalButton?.addEventListener('click', () => applyStackCommand('vertical'));
elements.tidyHorizontalButton?.addEventListener('click', () => applyTidyCommand('x'));
elements.tidyVerticalButton?.addEventListener('click', () => applyTidyCommand('y'));
elements.commandPaletteInput?.addEventListener('input', updateCommandPaletteResults);
elements.commandPaletteInput?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    commandPaletteActiveIndex = Math.min(commandPaletteResults.length - 1, commandPaletteActiveIndex + 1);
    renderCommandPaletteResults();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    commandPaletteActiveIndex = Math.max(0, commandPaletteActiveIndex - 1);
    renderCommandPaletteResults();
  } else if (event.key === 'Enter') {
    event.preventDefault();
    runActiveCommandPaletteItem();
  }
});
elements.commandPaletteRunButton?.addEventListener('click', runActiveCommandPaletteItem);
elements.commandPaletteCloseButton?.addEventListener('click', () => toggleCommandPalette(false));
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
for (const control of [
  elements.textFontSizeInput,
  elements.textLineHeightInput,
  elements.textLetterSpacingInput,
  elements.textWeightSelect,
  elements.textColorInput,
]) {
  const eventName = control?.tagName === 'SELECT' ? 'change' : 'input';
  control?.addEventListener(eventName, applyTextStyleLive);
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
  canvasInput?.addEventListener('keydown', (event) => {
    if (!applyKeyboardNudgeToNumberInput(event, canvasInput)) return;
    if (sourceInput) sourceInput.value = canvasInput.value;
  });
}

elements.openHtmlButton?.addEventListener('click', () => elements.htmlFileInput?.click());
elements.launcherUploadButton?.addEventListener('click', () => elements.htmlFileInput?.click());
elements.launcherRecentButton?.addEventListener('click', () => {
  const payload = readAutosavePayload();
  if (!payload?.snapshot?.html) {
    refreshLauncherRecentButton();
    setStatus('복구할 자동저장본이 없습니다.');
    return;
  }
  restoreAutosave();
});
for (const button of elements.launcherFixtureButtons) {
  button.addEventListener('click', () => {
    const fixtureId = button.dataset.launchFixture || '';
    if (!fixtureId) return;
    loadFixture(fixtureId);
  });
}
elements.openFolderButton?.addEventListener('click', () => elements.folderInput?.click());
elements.loadFixtureButton?.addEventListener('click', () => loadFixture(elements.fixtureSelect?.value));
elements.applyPasteButton?.addEventListener('click', applyPastedHtml);
elements.replaceImageButton?.addEventListener('click', () => {
  elements.replaceImageInput?.click();
  advanceOnboardingByAction('replace-image');
});
elements.manualSlotButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.markSelectedAsSlot();
  setStatus(result.message);
  if (result?.ok !== false) advanceOnboardingByAction('slot-select');
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.toggleHideButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.toggleSelectedHidden();
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.arrangeToggleHideButton?.addEventListener('click', () => elements.toggleHideButton?.click());
elements.toggleLockButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.toggleSelectedLocked();
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.arrangeToggleLockButton?.addEventListener('click', () => elements.toggleLockButton?.click());
elements.demoteSlotButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.demoteSelectedSlot();
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.redetectButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  activeEditor.redetect();
  setStatus('슬롯 자동 감지를 다시 실행했습니다.');
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.textEditButton?.addEventListener('click', () => {
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
  input?.addEventListener('keydown', (event) => {
    applyKeyboardNudgeToNumberInput(event, input);
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
elements.imageNudgeLeftButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: -NUDGE_STEP_RULE.base, dy: 0 })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.imageNudgeRightButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: NUDGE_STEP_RULE.base, dy: 0 })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.imageNudgeUpButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: 0, dy: -NUDGE_STEP_RULE.base })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.imageNudgeDownButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: 0, dy: NUDGE_STEP_RULE.base })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.preflightRefreshButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  activeEditor.refreshDerivedMeta();
  setStatus('출력 전 검수를 다시 계산했습니다.');
});
elements.applyTextStyleButton?.addEventListener('click', () => applyTextStyleFromControls({ clear: false }));
elements.clearTextStyleButton?.addEventListener('click', () => applyTextStyleFromControls({ clear: true }));
elements.undoButton?.addEventListener('click', undoHistory);
elements.redoButton?.addEventListener('click', redoHistory);
elements.restoreAutosaveButton?.addEventListener('click', restoreAutosave);
elements.saveProjectSnapshotButton?.addEventListener('click', () => {
  createProjectSnapshot({
    title: elements.snapshotNameInput?.value || '',
    note: '',
    auto: false,
    statusMessage: '작업 시점을 스냅샷으로 저장했습니다.',
  });
});
elements.saveSnapshotFromPanelButton?.addEventListener('click', () => {
  createProjectSnapshot({
    title: elements.snapshotNameInput?.value || '',
    note: '',
    auto: false,
    statusMessage: '스냅샷 목록에 새 시점을 추가했습니다.',
  });
});
elements.snapshotList?.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const action = target?.closest?.('[data-snapshot-action]')?.getAttribute('data-snapshot-action') || '';
  if (!action) return;
  const card = target.closest('[data-snapshot-id]');
  const snapshotId = card?.getAttribute('data-snapshot-id') || '';
  if (!snapshotId) return;
  if (action === 'restore') return restoreProjectSnapshotById(snapshotId);
  if (action === 'delete') return deleteProjectSnapshotById(snapshotId);
});
elements.openDownloadModalButton?.addEventListener('click', () => toggleDownloadModal(true));
elements.shareProjectButton?.addEventListener('click', () => { shareProjectSummary().catch((error) => setStatus(`공유 중 오류: ${error?.message || error}`)); });
elements.projectNameDisplay?.addEventListener('click', startProjectNameInlineEdit);
elements.projectNameInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    finishProjectNameInlineEdit({ save: true });
    return;
  }
  if (event.key === 'Escape') {
    event.preventDefault();
    finishProjectNameInlineEdit({ save: false });
  }
});
elements.projectNameInput?.addEventListener('blur', () => {
  if (elements.projectNameInput?.hidden) return;
  finishProjectNameInlineEdit({ save: true });
});
elements.closeDownloadModalButton?.addEventListener('click', () => toggleDownloadModal(false));
elements.downloadChoiceSelect?.addEventListener('change', () => renderShell(store.getState()));
elements.runDownloadChoiceButton?.addEventListener('click', async () => {
  const choice = elements.downloadChoiceSelect?.value || 'save-edited';
  try {
    await runDownloadByChoice(choice);
    toggleDownloadModal(false);
  } catch (error) {
    setStatus(`저장/출력 중 오류: ${error?.message || error}`);
  }
});
for (const button of elements.downloadEditedButtons) {
  button?.addEventListener('click', () => { runDownloadByChoice('save-edited').catch((error) => setStatus(`문서 저장 중 오류: ${error?.message || error}`)); });
}
elements.downloadNormalizedButton?.addEventListener('click', () => { runDownloadByChoice('download-normalized-html').catch((error) => setStatus(`정규화 HTML 저장 중 오류: ${error?.message || error}`)); });
elements.downloadLinkedZipButton?.addEventListener('click', () => { runDownloadByChoice('download-linked-zip').catch((error) => setStatus(`ZIP 저장 중 오류: ${error?.message || error}`)); });
for (const button of elements.exportPngButtons) {
  button?.addEventListener('click', () => {
    runDownloadByChoice('export-full-png').catch((error) => setStatus(`PNG 저장 중 오류: ${error?.message || error}`));
    advanceOnboardingByAction('save-png');
  });
}
for (const button of elements.exportJpgButtons) {
  button?.addEventListener('click', () => { runDownloadByChoice('export-full-jpg').catch((error) => setStatus(`JPG 저장 중 오류: ${error?.message || error}`)); });
}
elements.exportSectionsZipButton?.addEventListener('click', () => { runDownloadByChoice('export-sections-zip').catch((error) => setStatus(`섹션 PNG ZIP 저장 중 오류: ${error?.message || error}`)); });
elements.exportSelectionPngButton?.addEventListener('click', () => { runDownloadByChoice('export-selection-png').catch((error) => setStatus(`선택 PNG 저장 중 오류: ${error?.message || error}`)); });
elements.exportPresetPackageButton?.addEventListener('click', () => { runDownloadByChoice('download-export-preset-package').catch((error) => setStatus(`Preset 패키지 저장 중 오류: ${error?.message || error}`)); });
for (const button of elements.downloadPresetButtons) {
  button?.addEventListener('click', () => {
    const presetId = button.dataset.downloadPreset || 'market';
    const recommendedChoice = button.dataset.downloadChoice || '';
    currentExportPresetId = presetId;
    if (recommendedChoice && elements.downloadChoiceSelect) elements.downloadChoiceSelect.value = recommendedChoice;
    syncExportPresetUi({ forceScale: true });
    setStatus(`목적 카드 선택: ${currentExportPreset().label} · 실행할 작업은 ${elements.downloadChoiceSelect?.value || 'save-edited'}로 맞췄습니다.`);
  });
}
elements.saveFormatSelect?.addEventListener('change', () => {
  currentSaveFormat = normalizeSaveFormat(elements.saveFormatSelect.value || 'linked');
  syncSaveFormatUi();
  setStatus(`저장 포맷을 ${currentSaveFormat}로 변경했습니다.`);
});
bindElementEvent('downloadReportButton', 'click', downloadReportJson);
elements.exportPresetSelect?.addEventListener('change', () => {
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

elements.htmlFileInput?.addEventListener('change', async (event) => {
  const fileList = event.target?.files;
  const file = fileList && fileList.length > 0 ? fileList[0] : null;
  try {
    await openHtmlFile(file);
  } finally {
    event.target.value = '';
  }
});

elements.folderInput?.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files || []);
  try {
    if (files.length) await handleFolderImport(files);
  } finally {
    event.target.value = '';
  }
});

elements.replaceImageInput?.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files || []);
  try {
    if (!files.length) return;
    if (!activeEditor) {
      const message = '먼저 미리보기를 로드해 주세요.';
      setStatus(message);
      store.setImageApplyDiagnostic(buildImageFailureDiagnostic({ files, editorMeta: store.getState().editorMeta, statusMessage: message }));
      return;
    }
    const applied = await activeEditor.applyFiles(files);
    if (applied) {
      setStatus(`${applied}개 이미지를 적용했습니다.`);
      store.setImageApplyDiagnostic(null);
    } else {
      const message = '이미지를 적용하지 못했습니다.';
      setStatus(message);
      store.setImageApplyDiagnostic(buildImageFailureDiagnostic({ files, editorMeta: store.getState().editorMeta, statusMessage: message }));
    }
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  } catch (error) {
    const message = `이미지 적용 중 오류: ${error?.message || error}`;
    setStatus(message);
    store.setImageApplyDiagnostic(buildImageFailureDiagnostic({ files, editorMeta: store.getState().editorMeta, statusMessage: message }));
  } finally {
    event.target.value = '';
  }
});

bindElementEvent('assetFilterInput', 'input', () => {
  if (!elements.assetTableWrap) {
    logMissingElement('assetTableWrap', 'assetFilterInput');
    return;
  }
  renderAssetTable(elements.assetTableWrap, store.getState().project, elements.assetFilterInput?.value || '');
});
elements.layerFilterInput?.addEventListener('input', () => renderLayerTree(elements.layerTree, store.getState().editorMeta, elements.layerFilterInput?.value || ''));
elements.slotList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-slot-uid]');
  if (!button || !activeEditor) return;
  const ok = activeEditor.selectNodeByUid(button.dataset.slotUid, { additive: event.ctrlKey || event.metaKey || event.shiftKey, toggle: event.ctrlKey || event.metaKey, scroll: true });
  if (ok) setStatus('슬롯을 선택했습니다.');
});
elements.sectionList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-section-uid]');
  if (!button || !activeEditor) return;
  const ok = activeEditor.selectNodeByUid(button.dataset.sectionUid, { scroll: true });
  if (ok) setStatus('섹션으로 이동했습니다.');
});
elements.selectionInspector?.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-image-diagnostic-action]');
  if (!actionButton) return;
  const action = actionButton.dataset.imageDiagnosticAction || '';
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  if (action === 'select-first-slot') {
    const firstSlotUid = store.getState().editorMeta?.slots?.[0]?.uid || '';
    if (!firstSlotUid) return setStatus('선택할 슬롯이 없습니다.');
    const ok = activeEditor.selectSlotByUid(firstSlotUid);
    return setStatus(ok ? '첫 슬롯을 선택했습니다. 이제 이미지를 다시 넣어보세요.' : '첫 슬롯 선택에 실패했습니다.');
  }
  if (action === 'show-filename-rule') {
    return setStatus('파일명 규칙: 슬롯 라벨(또는 uid) 일부를 파일명에 넣어 주세요. 예) hero-slot.jpg');
  }
  if (action === 'show-supported-extensions') {
    return setStatus(`지원 확장자: ${SUPPORTED_IMAGE_EXTENSIONS_TEXT}`);
  }
});
elements.sectionDuplicateButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const uid = store.getState().editorMeta?.selectedSectionUid || '';
  const result = activeEditor.duplicateSectionByUid(uid);
  setStatus(result.message);
});
elements.sectionMoveUpButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const uid = store.getState().editorMeta?.selectedSectionUid || '';
  const result = activeEditor.moveSectionByUid(uid, 'up');
  setStatus(result.message);
});
elements.sectionMoveDownButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const uid = store.getState().editorMeta?.selectedSectionUid || '';
  const result = activeEditor.moveSectionByUid(uid, 'down');
  setStatus(result.message);
});
elements.sectionDeleteButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const uid = store.getState().editorMeta?.selectedSectionUid || '';
  const result = activeEditor.deleteSectionByUid(uid);
  setStatus(result.message);
});
elements.sectionAddButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const uid = store.getState().editorMeta?.selectedSectionUid || '';
  const result = activeEditor.addSectionAfterUid(uid);
  setStatus(result.message);
});
elements.layerTree?.addEventListener('click', (event) => {
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
elements.layerTree?.addEventListener('keydown', (event) => {
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
  if (event.key === 'Escape' && !elements.commandPaletteOverlay?.hidden) {
    event.preventDefault();
    toggleCommandPalette(false);
    return;
  }
  handleCommandPaletteFocusTrap(event);
  if (!elements.commandPaletteOverlay?.hidden) return;

  if (event.key === 'Escape' && !elements.downloadModal?.hidden) {
    event.preventDefault();
    toggleDownloadModal(false);
    return;
  }
  handleDownloadModalFocusTrap(event);
  if (!elements.downloadModal?.hidden) return;

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
      return performCommandAction('tool-select');
    }
    if (key === 't') {
      event.preventDefault();
      return performCommandAction('tool-text');
    }
    if (key === 'r') {
      event.preventDefault();
      return performCommandAction('tool-box');
    }
  }

  if (!withModifier || event.altKey) return;
  const key = String(event.key || '').toLowerCase();
  if (key === 'k') {
    event.preventDefault();
    toggleCommandPalette(true);
    return;
  }
  if (isTypingInputTarget(event.target)) return;
  if (key === 'd') {
    event.preventDefault();
    return performCommandAction('duplicate');
  }
  if (key === 'g') {
    event.preventDefault();
    return performCommandAction(event.shiftKey ? 'ungroup' : 'group');
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
    return performCommandAction('save-edited');
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
});

elements.shortcutHelpOverlay?.addEventListener('click', (event) => {
  if (event.target === elements.shortcutHelpOverlay) toggleShortcutHelp(false);
});
elements.shortcutHelpCloseButton?.addEventListener('click', () => toggleShortcutHelp(false));
elements.commandPaletteOverlay?.addEventListener('click', (event) => {
  if (event.target === elements.commandPaletteOverlay) toggleCommandPalette(false);
});
elements.downloadModal?.addEventListener('click', (event) => {
  if (event.target === elements.downloadModal) toggleDownloadModal(false);
});
elements.beginnerModeToggle?.addEventListener('click', () => setBeginnerMode(!isBeginnerMode));
elements.beginnerTutorialPrevButton?.addEventListener('click', () => {
  beginnerTutorialStepIndex = Math.max(0, beginnerTutorialStepIndex - 1);
  renderBeginnerTutorialStep();
});
elements.beginnerTutorialNextButton?.addEventListener('click', () => {
  if (beginnerTutorialStepIndex >= BEGINNER_TUTORIAL_STEPS.length - 1) {
    completeOnboardingTutorial();
    return;
  }
  beginnerTutorialStepIndex += 1;
  renderBeginnerTutorialStep();
});
elements.beginnerTutorialCloseButton?.addEventListener('click', () => {
  closeBeginnerTutorial();
  setStatus('온보딩을 건너뛰었습니다. 언제든 [온보딩 다시보기] 버튼으로 재시작할 수 있어요.');
});
elements.onboardingReplayButton?.addEventListener('click', () => {
  openBeginnerTutorial({ force: true });
  setStatus('온보딩을 다시 시작했습니다.');
});
elements.onboardingChecklistDoneButton?.addEventListener('click', () => {
  writeToLocalStorage(ONBOARDING_SAMPLE_CHECKED_STORAGE_KEY, '1');
  renderOnboardingChecklist();
  setStatus('샘플 작업 1회 실행 체크리스트를 완료로 기록했습니다.');
});
elements.viewSnapToggleButton?.addEventListener('click', () => toggleViewFeatureFlag('snap', '스냅'));
elements.viewGuideToggleButton?.addEventListener('click', () => toggleViewFeatureFlag('guide', '가이드'));
elements.viewRulerToggleButton?.addEventListener('click', () => toggleViewFeatureFlag('ruler', '눈금자'));
}

bindEvents();

for (const guideContainer of document.querySelectorAll('[data-left-tab-guide-for]')) {
  renderLeftTabStepGuide(guideContainer, guideContainer.getAttribute('data-left-tab-guide-for') || '');
}
setSidebarTab('left-start');
setSidebarTab('right-inspect');
setCodeSource('edited', { preserveDraft: false });
syncSaveFormatUi();
restorePanelLayoutState();
syncAdvancedFormFromState();
syncViewFeatureButtons();
syncWorkspaceButtons();
applyShortcutTooltips();
setBeginnerMode(readFromLocalStorage(BEGINNER_MODE_STORAGE_KEY, '0') === '1', { silent: true });
openBeginnerTutorialIfNeeded();
