# 저장소 1차 파악 메모 (2026-04-03)

## 1) 현재 편집 흐름 요약

최신 기준 요약: 리사이즈, 요소 추가, 복제/삭제, XYWH, z-order, 그룹 묶기/해제, JPG/선택 PNG/3x는 구현 완료다. 현재 미구현 핵심은 선택 모음/컴포넌트 템플릿화와 다중선택 bbox PNG다.

1. 사용자는 `index.html`을 `file://`로 직접 열고, 상단에서 HTML/폴더/fixture/붙여넣기로 입력을 시작한다.
2. `src/main.js`가 입력 경로별로 `normalizeProject()`를 호출해 프로젝트를 만든다.
3. `normalizeProject()`는 script 제거, 자산 경로 해석, 미해결 자산 치환, 슬롯 후보 감지(명시/휴리스틱)를 수행한다.
4. 이후 iframe `srcdoc`에 정규화 HTML을 올리고 `createFrameEditor()`를 붙여 캔버스 상호작용(선택, 드래그, 슬롯 작업, 텍스트 수정, 숨김/잠금, undo/redo)을 처리한다.
5. 저장/출력은 브라우저 다운로드 기반으로 동작하며 편집 HTML, 정규화 HTML, 링크형 ZIP, PNG/섹션 ZIP, preset ZIP, 리포트를 제공한다.
6. 자동저장은 `localStorage`를 사용하고 복구 버튼으로 다시 열 수 있다.

핵심: 서버 API 없이 로컬 파일 입력 + `srcdoc` + 다운로드 중심 구조다.

---

## 릴리즈 동기화 메모
- 이 문서의 미구현 목록은 `src/editor/frame-editor.js`와 `index.html` 실제 기능 기준으로 동기화한다.
- 다음 릴리즈에서도 머지 전 최신 코드 기준으로 같은 항목을 재검증한다.

---

## 2) 핵심 파일 10개

1. `index.html` — 전체 UI 뼈대와 버튼/패널/입력 엘리먼트 정의
2. `src/main.js` — 앱 진입, 상태 연결, 입력/저장/출력/이벤트 라우팅
3. `src/editor/frame-editor.js` — iframe 내부 직접 편집 동작 핵심
4. `src/core/normalize-project.js` — 정규화/자산 재매핑/이슈 생성/슬롯 탐지 실행
5. `src/core/asset-resolver.js` — 상대경로 + `uploaded:` 포함 자산 해석
6. `src/core/slot-detector.js` — placeholder/클래스/스타일 기반 슬롯 감지
7. `src/config.js` — 제약 관련 상수(스킴, 슬롯 정규식, export preset, autosave key)
8. `src/ui/renderers.js` — 우측/좌측 패널 렌더링(슬롯, 레이어, 검수, 자산 등)
9. `scripts/validate_phase6.py` — 로컬 제약 및 fixture 회귀 점검 스크립트
10. `data/WEBAPP_PHASE1_FIXTURE_MANIFEST.json` — fixture 계약(특히 F05 슬롯/자산/출력 계약)

---

## 3) 데스크톱 원본 대비 누락 기능 목록 (당시 1차 파악 기록)

`reports/WEBAPP_GAP_MATRIX.csv` 기준 누락/부분 누락은 아래가 핵심이다.

- 누락: 클립보드 HTML 바로 열기
- 누락: 새 860px 빌더 시작
- 누락: 이미지 확대/축소, 이미지 nudge
- 누락: 리사이즈 핸들
- 누락: 앞으로/뒤로(z-order)
- 구현: 그룹 묶기/해제 (제약: 잠기지 않은 요소 2개 이상 + 공통 조상 규칙 필요)
- 누락: 복사/붙여넣기/복제
- 누락: 삭제(요소 자체)
- 누락: 섹션/박스/텍스트/슬롯 추가
- 누락: X/Y/W/H 숫자 편집
- 누락: 공유용 내장 HTML 저장
- 누락: 내장→링크 전환
- 누락: 선택 영역 PNG
- 누락: JPG 전체
- 부분: 1x/2x/3x 저장 배율(현재 1/1.5/2x)
- 부분: 코드 패널 관련 일부(적용/불러오기/검색은 리부트 셸에서 재도입되었지만 완전 패리티 아님)

---

## 4) 지금 가장 먼저 고쳐야 할 3가지

### 우선순위 1: 리사이즈 핸들
- 이유: 실전 편집에서 요소 크기 조절이 안 되면 배치 수정이 사실상 막힌다.
- 근거: gap matrix에서 “가장 큰 결손”으로 명시.

### 우선순위 2: 복제/삭제 + 앞/뒤(z-order)
- 이유: 구조 편집 기본기. 이게 없으면 구성 변경 속도가 매우 느리다.
- 근거: gap matrix와 reboot 보고서 모두 미해결 핵심으로 반복 언급.

### 우선순위 3: X/Y/W/H 숫자 편집
- 이유: 초보자도 정확한 정렬/수치를 맞추는 데 가장 직관적인 수단.
- 근거: 데스크톱 대비 핵심 직접편집 결손으로 명시.

---

## 5) 각 항목 근거 파일

- 로컬 전용 목적/제약: `AGENTS.md`, `README.md`, `README_APP.md`
- 실제 입력/편집/저장 흐름: `index.html`, `src/main.js`, `src/editor/frame-editor.js`
- `uploaded:`/상대경로/placeholder 슬롯 관련 핵심: `src/core/asset-resolver.js`, `src/core/slot-detector.js`, `src/core/normalize-project.js`
- F05 회귀 계약 근거: `data/WEBAPP_PHASE1_FIXTURE_MANIFEST.json`, `data/fixtures/fixture_05_user_melting_cheese_compact.html`, `scripts/validate_phase6.py`
- 데스크톱 대비 누락 목록 근거: `reports/WEBAPP_GAP_MATRIX.csv`, `reports/WEBAPP_GAP_AUDIT_AND_REBOOT_PLAN.md`, `reports/WEBAPP_PHASE7_REBOOT_IMPLEMENTATION_REPORT.md`
