# WEBAPP 저장 포맷 분리 회귀 체크 (F05 기준)

대상 fixture: `data/fixtures/fixture_05_user_melting_cheese_compact.html`

## 체크 목적
- 저장 포맷(`linked`/`embedded`)을 분리해도 F05의 핵심 계약(슬롯, `uploaded:` 경로, 재오픈 안정성)이 깨지지 않는지 확인한다.

## 수동 체크 시나리오
1. 앱 실행 후 Fixture `F05` 로드.
2. 상단 `저장 포맷`을 `linked`로 선택하고 `문서 저장` 실행.
   - 기대: `__linked_package.zip` 생성.
   - 기대: ZIP 안의 HTML에서 기존 `uploaded:`/상대경로는 그대로 유지되고, data URL만 `assets/...`로 분리됨.
   - 기대: 깨진 경로가 있으면 상태 메시지/리포트 `BROKEN_LINKED_PATH` 경고에 포함됨.
3. 같은 상태에서 `저장 포맷`을 `embedded`로 바꿔 `문서 저장` 실행.
   - 기대: `__embedded.html` 단일 파일 생성.
   - 기대: 편집 중 `blob:` 참조가 있으면 data URL로 변환됨.
4. 3번에서 저장한 embedded HTML을 다시 열고, 저장 포맷을 `linked`로 선택 후 `문서 저장` 실행.
   - 기대: 내장(data URL) 자산이 `assets/...` 파일로 다시 분리됨 (`convertEmbeddedToLinked` 경로).
5. 리포트 다운로드(`리포트 JSON`) 후 `save.selectedFormat`, `save.lastConversion` 필드 확인.
   - 기대: 마지막 저장 포맷과 변환 통계가 기록됨.

## 자동 체크(가능한 범위)
- `python3 scripts/validate_phase6.py`
- fixture 슬롯 계약/미해결 자산/기본 회귀를 재검증.
