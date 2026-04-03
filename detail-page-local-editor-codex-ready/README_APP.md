# 상세페이지 웹앱 로컬 에디터 · 기준 문서 (v0.8.x / Phase 8)

이 문서는 **지금 코드 상태를 판단하는 기준 문서**입니다.  
다른 문서는 이 문서를 기준으로 링크해서 참고해 주세요.

- 기준 버전: `0.8.0` (phase8 기준선)
- 기준 단계명: **Phase 8 (회귀 안정화 + 파이프라인 운영)**
- 기준일: `2026-04-03`

## 왜 0.8.x인가?

초보자용으로 아주 쉽게 설명하면:

- `0.6.x`: Phase 6 중심(핵심 편집 기능 강화)
- `0.7.x`: Phase 7 중심(UX 리부트/작업 구조 재정리)
- `0.8.x`: Phase 8 중심(회귀 테스트 기준·파이프라인·운영 문서 정리)

즉, 지금 코드는 기능 추가만이 아니라 **"망가지지 않게 유지하는 단계"**까지 포함하고 있어서 `0.8.x`가 현재 상태에 더 맞습니다.

## 현재 코드 상태 한눈에 보기

이 프로젝트는 서버 앱이 아니라, 로컬에서 `index.html`을 직접 열어 쓰는 편집기입니다.

### 유지되는 핵심 원칙 (중요)
- `file://`에서 직접 열려야 함
- 서버/도메인/HTTPS가 없어도 실행되어야 함
- `fetch()`/원격 API가 초기 부팅 필수 경로가 되면 안 됨
- File System Access API가 필수 경로가 되면 안 됨
- `uploaded:` / 상대경로 / placeholder 슬롯 감지를 깨뜨리면 안 됨

### 금지 API/의존 목록 (file gate 체크리스트)
- `file://` 직접 실행 환경에서 **필수 경로**로 아래 API를 요구하면 안 됩니다.
  - `fetch()` (초기 부팅에서 네트워크 의존 금지)
  - `showOpenFilePicker`
  - `showSaveFilePicker`
  - `showDirectoryPicker`
- 브라우저 보안 정책(secure context) 때문에 위 API는 환경별로 동작이 달라질 수 있으므로, 현재 앱은 `input[type=file]` + Blob URL 기반 플로우를 기본으로 유지합니다.

### 기능 상태 요약
- Phase 6 기반 기능 유지
  - 슬롯 자동 감지, 이미지 교체, 텍스트 직접 편집, 정렬/간격, undo/redo, autosave
  - 편집 HTML / 정규화 HTML / PNG / ZIP / 리포트 저장 흐름
- Phase 7 리부트 반영
  - 캔버스 중심 UX, 패널 접기, 코드 워크벤치, 줌 컨트롤 구조
- Phase 8 운영 반영
  - Fixture(F01~F05) 회귀 체크 기준
  - 파이프라인 결과 JSON/대시보드 기반 점검 흐름

## 문서 읽는 순서 (중복 최소화)

아래 순서로 보면 됩니다.

1. **현재 기준 문서(이 문서)**: `README_APP.md`
2. 구현 배경(Phase 7): `reports/WEBAPP_PHASE7_REBOOT_IMPLEMENTATION_REPORT.md`
3. 회귀 운영(Phase 8): `reports/WEBAPP_PHASE8_PIPELINE_DASHBOARD.md`
4. 테스트 체크리스트: `reports/WEBAPP_PHASE8_REGRESSION_CHECKLIST.md`, `reports/WEBAPP_PHASE8_FIXTURE_CHECKLIST_2026-04-03.md`

> 규칙: 상세 설명은 각 보고서에 두고, 현재 상태 판단은 `README_APP.md` 기준으로 맞춥니다.

## 실행 방법

압축 해제 후 `index.html`을 브라우저에서 직접 열면 됩니다.

## 개발/검증 명령

```bash
python3 scripts/build_local_bundle.py
node --check app.bundle.js
python3 scripts/validate_phase6.py
python3 scripts/run_phase8_regression_pipeline.py
```

## 폴더 구조

- `index.html` : 로컬 진입점
- `styles.css` : 앱 스타일
- `app.bundle.js` : 로컬 실행 단일 번들
- `src/` : 소스 코드
- `data/fixtures/` : 고정 fixture
- `scripts/build_local_bundle.py` : 번들 생성
- `scripts/validate_phase6.py` : phase6 검증
- `scripts/run_phase8_regression_pipeline.py` : phase8 회귀 파이프라인
- `reports/` : 단계별 보고 문서
- `CHANGELOG.md` : 버전 변경 이력

## 다음 버전 올릴 때 규칙

- `package.json` 버전과 `CHANGELOG.md`를 같은 커밋에서 같이 올립니다.
- Phase 기준이 바뀌면 이 문서 상단의 "기준 버전/기준 단계명"을 먼저 수정합니다.
