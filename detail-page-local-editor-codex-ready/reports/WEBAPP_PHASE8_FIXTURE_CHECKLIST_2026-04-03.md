# Phase 8 Fixture Consistency Checklist (선택/이동/리사이즈/복제/삭제)
- 기준 코드 버전: `0.8.0`
- 기준 커밋: `60b1f586154070c5a2bd456cffa011e1e8ef2b80`
- 기준 날짜: `2026-04-03`
- 현재 기준 문서: [`README_APP.md`](../README_APP.md)

아래 체크리스트는 5개 fixture(F01~F05)에서 **동일 동작**이 같은 기준으로 동작하는지 검증하기 위한 공통 기준입니다.

## Fixture 대상
- F01: blank_builder_860
- F02: sample_shop_builder_860
- F03: sample_template_existing_html
- F04: sample_dring_walk_allinone
- F05: user_melting_cheese_compact (회귀 금지 우선)

## 공통 사전 조건
- fixture 로드 직후, 스마트 선택 모드 유지
- 잠금 상태 레이어는 테스트 전 잠금 해제
- undo/redo 버튼 활성 여부 확인

## 체크 항목

| ID | 시나리오 | 기대 결과 | F01 | F02 | F03 | F04 | F05 |
|---|---|---|---|---|---|---|---|
| C1 | 클릭으로 단일 선택 | 선택 박스 + 리사이즈 핸들 4개 표시 | ☐ | ☐ | ☐ | ☐ | ☐ |
| C2 | Shift+드래그 다중 선택 | 마퀴 박스 표시, 다중 선택 클래스 적용 | ☐ | ☐ | ☐ | ☐ | ☐ |
| C3 | 포인터 드래그 이동 | 선택 요소 이동, 스냅 라인 표시 가능 | ☐ | ☐ | ☐ | ☐ | ☐ |
| C4 | 리사이즈 핸들 드래그 | 폭/높이 변경, 핸들 위치 즉시 갱신 | ☐ | ☐ | ☐ | ☐ | ☐ |
| C5 | Ctrl/Cmd+D 복제 | 선택 요소 1개 복제, 오프셋(+20,+20) | ☐ | ☐ | ☐ | ☐ | ☐ |
| C6 | Delete/Backspace 삭제 | 선택 요소 삭제, 선택 상태 리셋 | ☐ | ☐ | ☐ | ☐ | ☐ |
| C7 | 방향키 Nudge (±1px) | 선택 요소가 1px 단위 이동 | ☐ | ☐ | ☐ | ☐ | ☐ |
| C8 | Shift+방향키 Nudge (±10px) | 선택 요소가 10px 단위 이동 | ☐ | ☐ | ☐ | ☐ | ☐ |
| C9 | 각 동작 직후 Undo 1회 | 직전 동작 1스텝 되돌림 | ☐ | ☐ | ☐ | ☐ | ☐ |
| C10 | Undo 직후 Redo 1회 | 직전 Undo 1스텝 재적용 | ☐ | ☐ | ☐ | ☐ | ☐ |

## 자동 회귀 파이프라인 실행 방법

```bash
python3 scripts/run_phase8_regression_pipeline.py
```

- 파이프라인은 아래를 **순서대로 자동 실행**합니다.
  1. `scripts/validate_phase6.py` (정적/정책/기본 smoke)
  2. `scripts/regression_layer_canvas_sync.py` (F01~F05 + C1~C10 최소 자동 시나리오)
- 의존성(`bs4`, `lxml`, `playwright`) 누락 시 `dependency_missing`으로 실패 원인을 구분해 출력합니다.
- 시나리오 실패 시 `scenario_failed`로 분류하고 실패 케이스 ID(C1~C10)를 JSON에 기록합니다.
- 결과는 날짜별 파일에 누적됩니다.
  - `reports/WEBAPP_PHASE8_PIPELINE_RESULTS_YYYY-MM-DD.json`
  - `reports/WEBAPP_PHASE8_REGRESSION_RESULTS_YYYY-MM-DD.json`

## F05 회귀 금지 게이트

- F05는 별도 게이트(`f05_gate`)로 분리되어 평가됩니다.
- F05에서 C1~C10 중 하나라도 실패하면 즉시 경고(`⚠️`)를 출력하고 파이프라인을 실패 처리합니다.

## 기록 규칙
- C1~C10이 모두 체크되면 해당 fixture PASS.
- 하나라도 실패하면 FAIL로 기록하고, 어떤 command(`duplicate`, `delete`, `nudge-selection`, `drag-move`, `resize-drag`)에서 어긋났는지 메모.

## 자동 회귀 파이프라인 실행 방법
아래 1회 명령으로 Phase 6 검증 + Phase 8 공통 시나리오(C1~C10) 회귀를 함께 실행합니다.

```bash
python3 scripts/run_phase8_regression_pipeline.py
```

### 의존성 설치
```bash
pip install -r requirements-regression.txt
python3 -m playwright install chromium
```

### 자동화 매핑 (최소 테스트 세트)
- `scripts/regression_layer_canvas_sync.py`가 F01~F05 각각에 대해 C1~C10을 자동 검사합니다.
- C1 클릭 단일 선택, C2 Shift+드래그 다중 선택, C3 드래그 이동, C4 리사이즈 드래그, C5 복제, C6 삭제, C7/C8 nudge, C9 undo, C10 redo를 수행합니다.
- F05는 별도 회귀 금지 게이트로 분리되어, 실패 시 대시보드(`reports/WEBAPP_PHASE8_PIPELINE_DASHBOARD.md`)에 즉시 경고가 표시됩니다.

### 결과 파일
- 실행 이력 누적(JSON): `reports/WEBAPP_PHASE8_PIPELINE_HISTORY.json`
- 일자별 실행 결과(JSON): `reports/WEBAPP_PHASE8_PIPELINE_RESULT_YYYY-MM-DD.json`
- 요약 대시보드(Markdown): `reports/WEBAPP_PHASE8_PIPELINE_DASHBOARD.md`
- Phase 8 fixture별 누적 이력(JSON): `reports/WEBAPP_PHASE8_REGRESSION_HISTORY.json`
