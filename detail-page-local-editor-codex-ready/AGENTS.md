# AGENTS.md

## Product goal
이 프로젝트는 서버 배포용 SaaS가 아니라, 로컬에서 `index.html`을 직접 열어 쓰는 상세페이지 편집 웹앱이다.
주요 목표는 상세페이지 HTML을 불러와 이미지 슬롯을 자동 감지하고, 이미지를 넣고, 텍스트와 배치를 편집한 뒤 HTML/PNG로 저장하는 것이다.

## Hard constraints
- `file://`로 직접 열 수 있어야 한다.
- 서버/도메인/HTTPS 전제 기능을 필수 경로로 만들지 말 것.
- `fetch()` 또는 원격 API 호출을 초기 부팅 필수 경로에 넣지 말 것.
- File System Access API를 필수 경로로 만들지 말 것.
- `uploaded:` 이미지, 상대경로 이미지, placeholder 기반 슬롯 감지를 깨뜨리지 말 것.
- `data/fixtures/fixture_05_user_melting_cheese_compact.html` 회귀 금지.

## Editing rules
- 기존 구조를 먼저 읽고, 가능한 범위에서 최소 침습 수정으로 진행할 것.
- 새 기능을 추가할 때는 저장/재오픈/export 경로까지 같이 고려할 것.
- 런타임 오버레이 요소가 export/normalize 결과물에 섞이지 않게 할 것.
- UI를 바꿀 때는 캔버스 사용성을 우선할 것. 패널은 과하게 복잡하게 만들지 말 것.

## Validation
작업 후 가능한 범위에서 아래를 점검할 것.
1. `node --check app.bundle.js`
2. `python3 scripts/validate_phase6.py`
3. 번들이 바뀌면 `python3 scripts/build_local_bundle.py`
4. 변경 요약, 남은 위험, 회귀 가능성을 보고할 것.

## Release gate (manual regression, 최소 1회 필수)
릴리즈 전에는 아래 수동 회귀 루틴을 **최소 1회** 반드시 수행하고, 결과를 체크리스트로 남길 것.

- [ ] 초기 부팅 필수 경로에 `fetch()`/원격 API 의존이 없는지 확인
- [ ] File System Access API가 필수 경로인지 여부 확인
- [ ] `uploaded:`/상대경로 이미지가 저장 → 재오픈 후 유지되는지 확인
- [ ] 저장한 HTML을 다시 열었을 때 런타임 오버레이(`data-editor-runtime`)가 결과물에 섞이지 않는지 확인

## Priority order
1. 직접 편집 핵심 UX
2. 저장/재오픈 안정성
3. fixture 회귀 방지
4. 구조 리팩터링
