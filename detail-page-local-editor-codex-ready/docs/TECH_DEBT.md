# 기술부채 관리 문서

## Beginner 코드 완전 제거 시점 기준

초보(온보딩) 코드는 사용자 전환을 위해 잠시 유지하지만, 아래 기준을 모두 만족하면 `src/features/onboarding/*` 및 beginner UI 마크업을 완전 제거한다.

1. **사용률 기준 (2주 연속)**
   - `localStorage.editor_mode` 값이 `beginner`인 세션 비율이 **5% 미만**.
   - `detail_editor_beginner_mode_v1=1` 상태로 부팅된 비율이 **5% 미만**.

2. **QA 통과 기준**
   - Pro 기본 부팅(`editor_mode='pro'`)에서 회귀 테스트 전부 통과.
   - 명령팔레트 / 인스펙터 / 정렬 패널이 온보딩 상태와 무관하게 동일 동작함을 수동 체크리스트로 확인.
   - `file://` 직접 실행 경로에서 `fetch()`/원격 API 의존이 없음을 재확인.

3. **문서/릴리즈 기준**
   - README/운영 문서에서 beginner 안내를 제거하거나 Pro 기준으로 교체.
   - 릴리즈 노트에 “beginner 코드 제거” 및 마이그레이션(없으면 없음)을 명시.
