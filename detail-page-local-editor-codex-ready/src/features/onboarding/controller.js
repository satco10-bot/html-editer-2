import { BEGINNER_TUTORIAL_STEPS } from './tutorial.js';

export const BEGINNER_MODE_STORAGE_KEY = 'detail_editor_beginner_mode_v1';
export const ONBOARDING_COMPLETED_STORAGE_KEY = 'detail_editor_onboarding_completed_v1';
export const ONBOARDING_SAMPLE_CHECKED_STORAGE_KEY = 'detail_editor_onboarding_sample_checked_v1';

function hasStorageFlag(readStorage, key) {
  return readStorage(key, '') === '1';
}

export function createOnboardingController({
  readStorage,
  writeStorage,
  status,
  resolveElements,
  resolveActionElements,
}) {
  let isBeginnerMode = false;
  let beginnerTutorialStepIndex = 0;
  let onboardingCompleted = hasStorageFlag(readStorage, ONBOARDING_COMPLETED_STORAGE_KEY);

  function hasCompletedOnboardingSampleTask() {
    return hasStorageFlag(readStorage, ONBOARDING_SAMPLE_CHECKED_STORAGE_KEY);
  }

  function markOnboardingCompleted() {
    onboardingCompleted = true;
    writeStorage(ONBOARDING_COMPLETED_STORAGE_KEY, '1');
  }

  function clearOnboardingHighlights() {
    document.querySelectorAll('.onboarding-highlight').forEach((target) => target.classList.remove('onboarding-highlight'));
  }

  function applyOnboardingHighlightForCurrentStep() {
    clearOnboardingHighlights();
    if (onboardingCompleted) return;
    const step = BEGINNER_TUTORIAL_STEPS[beginnerTutorialStepIndex] || null;
    const target = step?.targetElementKey ? resolveActionElements()[step.targetElementKey] : null;
    target?.classList.add('onboarding-highlight');
  }

  function closeBeginnerTutorial() {
    const dom = resolveElements();
    if (dom.beginnerTutorialTooltip) dom.beginnerTutorialTooltip.hidden = true;
    clearOnboardingHighlights();
  }

  function renderOnboardingChecklist() {
    const dom = resolveElements();
    if (!dom.onboardingChecklist) return;
    const done = hasCompletedOnboardingSampleTask();
    dom.onboardingChecklist.hidden = !onboardingCompleted;
    if (dom.onboardingChecklistItem) {
      dom.onboardingChecklistItem.textContent = done
        ? '✅ 샘플 작업 1회 실행 완료'
        : '⬜ 샘플(F05)에서 슬롯 선택 → 이미지 교체 → PNG 저장을 1회 실행해 보세요.';
    }
    if (dom.onboardingChecklistDoneButton) {
      dom.onboardingChecklistDoneButton.disabled = done;
      dom.onboardingChecklistDoneButton.textContent = done ? '체크 완료' : '완료 체크';
    }
  }

  function renderBeginnerTutorialStep() {
    const dom = resolveElements();
    const step = BEGINNER_TUTORIAL_STEPS[beginnerTutorialStepIndex] || BEGINNER_TUTORIAL_STEPS[0];
    if (dom.beginnerTutorialTitle) dom.beginnerTutorialTitle.textContent = step.title;
    if (dom.beginnerTutorialBody) dom.beginnerTutorialBody.textContent = step.body;
    if (dom.beginnerTutorialStep) dom.beginnerTutorialStep.textContent = `${beginnerTutorialStepIndex + 1} / ${BEGINNER_TUTORIAL_STEPS.length}`;
    if (dom.beginnerTutorialPrevButton) dom.beginnerTutorialPrevButton.disabled = beginnerTutorialStepIndex < 1;
    if (dom.beginnerTutorialNextButton) {
      const isLast = beginnerTutorialStepIndex >= BEGINNER_TUTORIAL_STEPS.length - 1;
      dom.beginnerTutorialNextButton.textContent = isLast ? '완료' : '다음';
    }
    applyOnboardingHighlightForCurrentStep();
  }

  function openBeginnerTutorial({ force = false } = {}) {
    if (!force && onboardingCompleted) return;
    beginnerTutorialStepIndex = 0;
    renderBeginnerTutorialStep();
    const dom = resolveElements();
    if (dom.beginnerTutorialTooltip) dom.beginnerTutorialTooltip.hidden = false;
  }

  function openBeginnerTutorialIfNeeded() {
    if (onboardingCompleted) return;
    openBeginnerTutorial();
  }

  function completeOnboardingTutorial() {
    markOnboardingCompleted();
    closeBeginnerTutorial();
    renderOnboardingChecklist();
    status('온보딩을 완료했습니다. 아래 체크리스트로 샘플 작업을 1회 실행해 보세요.');
  }

  function advanceOnboardingByAction(actionId) {
    const dom = resolveElements();
    if (onboardingCompleted || dom.beginnerTutorialTooltip?.hidden) return;
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
    const dom = resolveElements();
    document.body.classList.toggle('beginner-mode', isBeginnerMode);
    if (dom.beginnerModeToggle) {
      dom.beginnerModeToggle.textContent = `초보 모드: ${isBeginnerMode ? 'ON' : 'OFF'}`;
      dom.beginnerModeToggle.setAttribute('aria-pressed', isBeginnerMode ? 'true' : 'false');
    }
    if (isBeginnerMode && dom.advancedTopbarPanel) dom.advancedTopbarPanel.open = false;
  }

  function setBeginnerMode(next, { silent = false } = {}) {
    isBeginnerMode = !!next;
    applyBeginnerModeUi();
    writeStorage(BEGINNER_MODE_STORAGE_KEY, isBeginnerMode ? '1' : '0');
    if (!silent) status(`초보 모드를 ${isBeginnerMode ? '켰습니다' : '껐습니다'}.`);
  }

  function markChecklistDone() {
    writeStorage(ONBOARDING_SAMPLE_CHECKED_STORAGE_KEY, '1');
    renderOnboardingChecklist();
    status('샘플 작업 1회 실행 체크리스트를 완료로 기록했습니다.');
  }

  function previousTutorialStep() {
    beginnerTutorialStepIndex = Math.max(0, beginnerTutorialStepIndex - 1);
    renderBeginnerTutorialStep();
  }

  function nextTutorialStep() {
    if (beginnerTutorialStepIndex >= BEGINNER_TUTORIAL_STEPS.length - 1) {
      completeOnboardingTutorial();
      return;
    }
    beginnerTutorialStepIndex += 1;
    renderBeginnerTutorialStep();
  }

  return {
    isBeginnerMode: () => isBeginnerMode,
    setBeginnerMode,
    renderOnboardingChecklist,
    openBeginnerTutorial,
    openBeginnerTutorialIfNeeded,
    closeBeginnerTutorial,
    advanceOnboardingByAction,
    previousTutorialStep,
    nextTutorialStep,
    markChecklistDone,
  };
}
