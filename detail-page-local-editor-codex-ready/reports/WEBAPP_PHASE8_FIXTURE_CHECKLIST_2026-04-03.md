# Phase 8 Fixture Consistency Checklist (선택/이동/리사이즈/복제/삭제)

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

## 기록 규칙
- C1~C10이 모두 체크되면 해당 fixture PASS.
- 하나라도 실패하면 FAIL로 기록하고, 어떤 command(`duplicate`, `delete`, `nudge-selection`, `drag-move`, `resize-drag`)에서 어긋났는지 메모.
