# 딥 코드리뷰 보고서 (직접 코드 훑어본 결과) · 2026-04-03

> 대상: `src/*.js` 전체 + 핵심 실행 경로(`index.html`, `scripts/validate_phase8.py`)

## 1) 무엇을 "직접" 점검했는가

아래 파일을 실제로 열어서 구조를 확인했습니다.

- 앱 진입/상태관리: `src/main.js`, `src/core/project-store.js`
- 에디터 핵심 런타임: `src/editor/frame-editor.js`
- 상호작용 모듈: `src/editor/canvas-interaction/*.js`
- 정규화/자산/슬롯: `src/core/normalize-project.js`, `src/core/asset-resolver.js`, `src/core/slot-detector.js`, `src/core/editor-model.js`, `src/core/serialize-layer.js`
- UI 렌더링: `src/ui/renderers.js`
- 공통 유틸: `src/utils.js`, `src/config.js`, `src/fixture-bundle.js`
- 품질 게이트: `scripts/validate_phase8.py`

## 2) 초보자 버전 핵심 결론

- **좋은 점:** 로컬 `file://` 중심 구조가 잘 지켜져 있습니다. 서버가 없어도 실행되는 설계가 일관적입니다.
- **주의점:** 코드가 큰 파일(`frame-editor.js`, `main.js`)에 많이 모여 있어, 나중에 기능 추가 시 작은 수정이 예상 외 부작용을 낼 수 있습니다.
- **이번 실제 수정:** 상태 구독자(listener) 한 개가 에러를 내도 앱 전체 반응이 멈추지 않도록 store 알림 로직을 강화했습니다.

## 3) 이번에 고친 실제 안정성 이슈

### 이슈: store listener 하나가 throw하면 다른 listener 업데이트가 끊길 수 있음
- 위치: `src/core/project-store.js`
- 원인: `notify()`가 listener를 그대로 순회 호출해서 예외 격리가 없었음.
- 위험: 특정 패널 렌더러 에러가 전체 상태 반영 흐름에 연쇄 영향을 줄 수 있음.
- 조치: `notify()`/`subscribe()`의 초기 호출에 예외 격리를 추가해 다른 listener는 계속 동작하도록 변경.

## 4) 사용 제약(실사용 전에 꼭 알아야 함)

1. **브라우저 환경 제약**
   - `file://` 직접 실행을 전제로 설계됨.
   - 보안 컨텍스트 API(`showOpenFilePicker` 등)는 필수 경로가 아님.
2. **자동 브라우저 테스트 제약**
   - Playwright 미설치 환경에서는 스모크 테스트가 미실행으로 남음.
3. **대형 문서 성능 제약**
   - 긴 상세페이지 + 2x/3x export는 메모리/시간 부담이 큼.

## 5) 개선 우선순위 제안

### P0 (바로)
- `frame-editor.js`와 `main.js`의 기능군 분리(Export/Selection/Keyboard/Panel 단위).
- 스모크 테스트 의존성(Playwright) 설치 여부를 시작 시 더 명확하게 안내.

### P1 (단기)
- store 계층에 최소 단위 테스트(구독/해제/예외 격리) 추가.
- 렌더러 업데이트 실패 시 사용자용 안내(“패널 일부 업데이트 실패”)를 상태바에 노출.

### P2 (중기)
- 초보자 모드에 “고해상도 export 예상 소요/용량” 안내 추가.
- 긴 문서 export에 단계별 진행률(progress) 표시 강화.

## 6) 회귀 위험도

- **낮음**
  - 이번 코드 수정 범위는 `project-store`의 예외 격리 로직으로 제한되어 핵심 편집 알고리즘에는 영향이 적습니다.
