# 상세페이지 로컬 웹앱 · Codex 준비본

이 폴더는 **GitHub에 그대로 올려서 Codex에게 맡기기 쉽게** 정리한 버전입니다.

## 현재 기준(최신) 핵심 기능 요약
- 이 버전은 **phase8 리부트 로컬 워크플로우를 유지**하면서, 직접 편집/출력 기능을 최신 기준으로 보강한 상태입니다.
- 검증 호환 키워드: **리부트**, **숨김/잠금**, **스냅**, **Preset**.
- 캔버스 직접 편집: 선택/이동/리사이즈, 요소 추가(텍스트/박스/슬롯), 복제/삭제, 그룹 묶기/해제
- 정밀 배치: XYWH 숫자 적용, z-order(앞으로/뒤로), Shift+드래그 다중선택, 스냅 가이드
- 출력: JPG, 선택 PNG, 1x/2x/3x 배율, Export Preset
- 아직 미구현: 고급 템플릿(선택 모음/컴포넌트화)

## 제일 쉬운 사용법
1. 이 폴더를 압축 해제합니다.
2. GitHub에서 **새 비공개 저장소**를 만듭니다.
3. 저장소 화면에서 **Add file → Upload files** 를 누릅니다.
4. **이 폴더 안의 파일과 폴더를 전부 드래그해서 업로드**합니다.
   - `zip 파일 하나`만 올리면 안 됩니다.
   - **압축을 푼 상태의 파일들**을 올려야 Codex가 코드를 읽고 수정할 수 있습니다.
5. ChatGPT의 **Codex** 탭으로 가서 이 저장소를 연결합니다.
6. `PROMPTS/` 폴더 안의 문장을 **복사해서 Ask 또는 Code**로 넣습니다.

## 이 프로젝트의 핵심 제약
- 서버 배포용이 아니라 **로컬 전용 정적 웹앱**입니다.
- `index.html`을 `file://`로 직접 열어 쓰는 흐름을 유지해야 합니다.
- 서버/도메인/HTTPS 전제 기능을 필수 경로로 넣으면 안 됩니다.
- `uploaded:` 이미지, 상대경로 이미지, placeholder 슬롯 감지를 깨뜨리면 안 됩니다.
- 고정 fixture, 특히 `fixture_05_user_melting_cheese_compact.html` 회귀가 나면 안 됩니다.

## 중요한 파일
- `index.html` : 시작 파일
- `styles.css` : 앱 화면 스타일
- `app.bundle.js` : 지금 실행되는 로컬 번들
- `src/` : 실제 수정해야 할 소스 코드
- `data/fixtures/` : 회귀 체크용 샘플 HTML
- `scripts/` : 번들/검증 스크립트
- `AGENTS.md` : Codex 작업 규칙
- `PROMPTS/` : Codex에 붙여넣을 명령문

## 로컬 실행
압축을 푼 뒤 `index.html`을 브라우저에서 직접 열면 됩니다.

초보자 빠른 순서(1~2줄): ① 요소 선택 → ② 드래그/핸들·XYWH 숫자로 수정 → ③ 저장/출력 버튼 실행. 이 3단계만 기억하면 처음 써도 바로 작업할 수 있습니다.

## 개발/검증 명령
```bash
python3 scripts/build_local_bundle.py
node --check app.bundle.js
python3 scripts/validate_phase8.py
```

## 초보자용: HTML 업로드 → 이미지 적용 → PNG 저장 테스트
아래 한 줄로 핵심 워크플로우 자동 점검을 실행할 수 있습니다.
```bash
npm run test:workflow
```

처음 실행 전에 의존성(Playwright)을 설치해야 합니다.
```bash
python3 scripts/install_regression_dependencies.py
python3 -m playwright install chromium
```

만약 실패하면, 테스트 스크립트가 JSON 형태로 `how_to_fix` 항목에 다음 실행 순서를 다시 안내합니다.

## 수동 회귀 체크리스트(초보자용 12개 시나리오)
자동 테스트와 별개로, 실제 사용 흐름을 사람이 직접 점검하려면 아래 문서를 사용하세요.

- `docs/png-export-manual-regression-12-scenarios.md`

## 초보자용 QA 실행 순서 (명령 2개 + 결과 판독 2단계)
아래 순서는 **"구조 점검 → 실제 워크플로우 점검 → 실패 원인 분리 → 리포트 확인"** 흐름입니다.

## 수동 QA 체크리스트 (T-01 ~ T-12, 초보자 실행판)
아래 항목은 "코드 자동 테스트"와 별개로, 실제 화면에서 사람이 눌러보며 확인하는 절차입니다.

### 시작 전 준비(공통)
- 브라우저에서 `index.html`을 열어둡니다.
- 테스트용 정상 HTML 1개, 비정상 HTML 1개, 교체용 PNG 여러 장, 큰 HTML 1개를 미리 준비합니다.
- 증거 스크린샷 폴더를 하나 만들고(`manual-qa-evidence/` 권장), T-번호로 파일명을 통일합니다.
  - 예: `T-01-status.png`, `T-02-before.png`, `T-02-after.png`

### T-01. 기본 업로드 성공 확인
- **목적**: HTML 업로드 기본 동작 1차 확인
- **실행**:
  1. 앱 열기
  2. `openHtmlButton`으로 정상 HTML 선택
- **통과 기준**: `statusText`에 "HTML 파일 ... 불러왔습니다" 류 문구 표시
- **증거**: 상태 문구 캡처 1장

### T-02. 업로드 직후 이미지 교체
- **목적**: 업로드 직후 편집 상태 반영 확인
- **실행**:
  1. T-01 직후 `replaceImageButton` 클릭
  2. PNG 이미지 선택
- **통과 기준**:
  - 상태 문구에 이미지 적용 성공 메시지
  - 캔버스 이미지가 실제로 바뀜
- **증거**: 교체 전/후 캡처 2장

### T-03. 첫 PNG 추출
- **목적**: 핵심 결과물(PNG) 생성 확인
- **실행**: `exportPngButton` 클릭
- **통과 기준**:
  - PNG 다운로드 발생
  - 파일 크기 0 초과
- **증거**: 다운로드 파일명 + 파일 크기

### T-04. 텍스트 수정 반영 후 PNG 재추출
- **목적**: 텍스트 편집 반영 여부 확인
- **실행**:
  1. 텍스트 1개 수정
  2. PNG 다시 내보내기
- **통과 기준**: 새 PNG에 수정 문구 반영
- **증거**: 수정 텍스트가 보이는 PNG 1장

### T-05. 다중 슬롯(3개 이상) 이미지 연속 교체
- **목적**: 연속 교체 안정성 확인
- **실행**:
  1. 슬롯 3개 이상 순차 교체
  2. PNG 추출
- **통과 기준**: 모든 교체 결과가 PNG에 반영
- **증거**: 작업 로그(슬롯 번호/파일명) + 결과 PNG

### T-06. Undo/Redo 후 PNG
- **목적**: 히스토리 꼬임 여부 확인
- **실행**:
  1. 수정 2회
  2. Undo 2회 → Redo 2회
  3. PNG 추출
- **통과 기준**: 최종 화면과 PNG가 동일
- **증거**: 최종 화면 캡처 + PNG 비교

### T-07. 큰 HTML 파일 부하 테스트
- **목적**: 느려짐/멈춤 여부 확인
- **실행**:
  1. 큰 HTML 업로드
  2. 이미지 1개 교체
  3. PNG 추출
- **통과 기준**: 브라우저 멈춤 없이 완료
- **증거**: 대략 수행 시간(초) + PNG

### T-08. 잘못된 HTML 방어
- **목적**: 오류 처리/복원력 확인
- **실행**:
  1. 비정상 HTML 업로드 시도
  2. 이후 정상 HTML 재업로드
- **통과 기준**:
  - 앱이 종료되지 않고 오류 안내 표시
  - 정상 HTML 재업로드 성공
- **증거**: 오류 문구 캡처 + 재시도 성공 캡처

### T-09. 상대경로 자산 포함 폴더 import
- **목적**: resolved/unresolved 상태 확인
- **실행**: `openFolderButton`으로 폴더 import
- **통과 기준**: 상태 문구에 resolved/unresolved 정보 표시
- **증거**: 상태 문구 캡처

### T-10. 일부 자산 누락 폴더 import
- **목적**: 누락 자산 상황에서의 안내 품질 확인
- **실행**:
  1. 일부 이미지가 없는 폴더 import
  2. PNG 추출
- **통과 기준**:
  - import는 진행됨
  - 누락 안내 표시 + 앱 멈춤 없음
- **증거**: 안내 문구 캡처 + PNG 결과

### T-11. 연속 PNG 3회 추출
- **목적**: 2~3회차 추출 실패 버그 탐지
- **실행**:
  1. 1회 PNG 추출
  2. 수정 후 2회차 추출
  3. 수정 후 3회차 추출
- **통과 기준**: 3회 모두 다운로드 성공
- **증거**: 파일 3개 이름/크기 목록

### T-12. 다운로드 모달 프리셋 ZIP 확인
- **목적**: PNG 외 패키지 다운로드 경로 확인
- **실행**:
  1. 다운로드 모달 열기
  2. 기본 프리셋 패키지 선택 후 실행
- **통과 기준**: ZIP 다운로드 성공
- **증거**: ZIP 파일명 + 파일 크기

### 기록 템플릿(복사해서 사용)
아래를 메모장에 복붙해 두면, 초보자도 누락 없이 결과를 기록하기 쉽습니다.

```text
[T-01] PASS/FAIL - 증거: (파일명)
[T-02] PASS/FAIL - 증거: (before/after 파일명)
[T-03] PASS/FAIL - 증거: (파일명, 파일크기)
[T-04] PASS/FAIL - 증거: (파일명)
[T-05] PASS/FAIL - 증거: (로그, 파일명)
[T-06] PASS/FAIL - 증거: (화면캡처, PNG)
[T-07] PASS/FAIL - 증거: (소요시간, PNG)
[T-08] PASS/FAIL - 증거: (오류캡처, 재시도성공캡처)
[T-09] PASS/FAIL - 증거: (상태캡처)
[T-10] PASS/FAIL - 증거: (안내캡처, PNG)
[T-11] PASS/FAIL - 증거: (3개 파일명/크기)
[T-12] PASS/FAIL - 증거: (ZIP 파일명/크기)
```

### 1) 정적 구조 점검
목적: 앱의 핵심 구조/규칙이 깨지지 않았는지 빠르게 확인합니다.
```bash
python3 scripts/validate_phase8.py
```
실패 시 다음 행동(재시도 명령): 의존성 설치 후 같은 검증을 다시 실행합니다.
```bash
python3 scripts/install_regression_dependencies.py
python3 scripts/validate_phase8.py
```

### 2) 워크플로우 스모크 테스트
목적: "HTML 불러오기 → 이미지 반영 → PNG 저장"의 실제 사용자 흐름이 동작하는지 확인합니다.
```bash
python3 scripts/test_workflow_html_image_png.py
```
실패 시 다음 행동(재시도 명령): 브라우저 테스트 의존성 재설치 후 동일 테스트를 다시 실행합니다.
```bash
python3 scripts/install_regression_dependencies.py
python3 -m playwright install chromium
python3 scripts/test_workflow_html_image_png.py
```

### 3) 실패 원인 분리 판독(Dependency 부족 vs 시나리오 실패)
목적: "실행 환경 문제"와 "앱 동작 문제"를 분리해서, 초보자도 다음 액션을 정확히 고릅니다.
- **Dependency 부족(환경 문제)** 신호
  - 로그에 `ModuleNotFoundError`, `No module named ...`, `playwright` 설치 관련 오류가 보입니다.
  - 이 경우는 코드 버그가 아니라 설치 문제일 가능성이 큽니다.
  - 재시도 명령:
    ```bash
    python3 scripts/install_regression_dependencies.py
    python3 -m playwright install chromium
    python3 scripts/validate_phase8.py
    python3 scripts/test_workflow_html_image_png.py
    ```
  - 리눅스에서 `libatk-1.0.so.0` 같은 공유 라이브러리 오류가 보이면, 브라우저 런타임 패키지를 먼저 설치합니다.
    ```bash
    apt-get update
    apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libcups2t64 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2t64 libpango-1.0-0 libcairo2 libnss3 libx11-xcb1 libxcursor1 libxext6 libxi6 libxtst6 libgtk-3-0
    python3 -m playwright install chromium
    python3 scripts/validate_phase8.py
    ```
- **시나리오 실패(기능 문제)** 신호
  - 의존성 오류 없이 테스트가 실행되었지만 `assert`, `FAILED`, `gate failed` 같은 실패 결과가 나옵니다.
  - 이 경우는 앱 동작/회귀 이슈 가능성이 큽니다.
  - 재시도 명령(1회 재검증):
    ```bash
    python3 scripts/validate_phase8.py
    python3 scripts/test_workflow_html_image_png.py
    ```

### 4) 결과 리포트(`reports/`) 확인 위치 + 합격 기준
목적: 터미널 출력만 보지 않고, 저장된 결과 파일로 "최종 합격/불합격"을 명확히 판단합니다.
- 확인 폴더: `reports/`
- 대표 파일:
  - `reports/WEBAPP_PHASE8_VALIDATION_RESULTS.json`
  - `reports/WEBAPP_PHASE8_REGRESSION_RESULTS_YYYY-MM-DD.json` (날짜별 결과)
- 초보자용 합격 기준(간단판):
  1. 1단계 명령(`validate_phase8.py`)이 **종료 코드 0**으로 끝난다.
  2. 2단계 명령(`test_workflow_html_image_png.py`)이 **종료 코드 0**으로 끝난다.
  3. 최신 리포트 JSON에서 실패 카운트가 0이거나, 요약이 `passed`로 표시된다.
- 불합격 기준:
  - 의존성 누락으로 테스트가 미실행(`not_run`)이거나,
  - 시나리오 실패(`failed`)가 1개라도 있으면 불합격으로 보고 원인 분리를 먼저 진행합니다.

### `build_local_bundle` 실행 기준(입력/출력)
- 입력(Entry): `src/main.js` (내부에서 `src/` 상대 import를 따라가며 하나로 합칩니다)
- 출력(Output): `app.bundle.js` (브라우저가 `index.html`에서 직접 읽는 단일 번들 파일)
- 주의: `src/` 안의 JS를 수정했다면 **반드시** 아래 명령을 다시 실행해 `app.bundle.js`를 최신 상태로 맞춰야 합니다.
  ```bash
  python3 scripts/build_local_bundle.py
  ```

## Phase8 파이프라인 실행 가이드 (처음 실행도 바로 동작)
1. 먼저 아래 **한 줄**만 실행합니다.
   ```bash
   python3 scripts/install_regression_dependencies.py
   ```
2. 이후 로컬/CI 모두 동일하게 아래 명령을 실행합니다.
   ```bash
   python3 scripts/run_phase8_regression_pipeline.py
   ```
3. 파이프라인은 시작 전에 dependency precheck를 먼저 수행합니다.
   - 누락 패키지가 있으면 목록을 명확히 출력합니다.
   - 같은 화면에 설치/재시도 명령 2줄을 즉시 안내합니다.
     - `python3 scripts/install_regression_dependencies.py`
     - `python3 scripts/run_phase8_regression_pipeline.py`
4. 결과 JSON/대시보드는 **dependency 실패**와 **scenario 실패**를 분리 기록합니다.
   - `dependency_precheck.status`: 의존성 상태
   - `scenario_execution.status`: 시나리오 실행/미실행 상태
   - `summary.step_fail` / `summary.step_not_run`: 실패와 미실행을 분리 집계
5. 결과 JSON에는 환경 정보도 함께 저장됩니다.
   - `environment.python_version`
   - `environment.packages` (beautifulsoup4/lxml/playwright)
6. F05 gate 표시는 다음처럼 구분됩니다.
   - `passed`: 통과
   - `failed`: 실행은 되었지만 실패
   - `not_run`: 의존성 문제 등으로 미실행

### quality_confidence가 low로 떨어지는 조건
- dependency precheck 실패(필수 패키지 누락)
- F05 gate가 `not_run`인 경우(즉, 게이트 자체가 미실행)

## 왜 zip 하나만 올리면 안 되나요?
Codex는 저장소 안의 **실제 파일들**을 읽고 바꾸는 방식입니다.
그래서 `프로젝트.zip` 하나만 올리면, HTML/JS/CSS를 바로 고치기 어렵습니다.
반드시 **압축 해제된 파일 상태**로 올리셔야 합니다.
