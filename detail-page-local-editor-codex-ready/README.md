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
