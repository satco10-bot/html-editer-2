# Frame Editor 메서드 중심 기능 점검표

이 문서는 `createFrameEditor()`가 외부로 노출하는 메서드(예: `applyGeometryPatch`, `bringSelectedForward`, `duplicateSelected`, `deleteSelected`)를 기준으로, 사람이 수동으로 재현해서 확인할 수 있는 점검표입니다.

> 초보자용 한 줄 배경: **"선택 → 조작(메서드 호출) → 레이어/좌표/상태 변화 확인"** 순서로 보면 됩니다.

---

## 1) 단일 선택 vs 다중 선택(Shift 드래그) 분리

### 1-1. 단일 선택 기본 동작 (`selectNodeByUid` + 단일 클릭)
재현 절차
1. 편집 화면에서 겹치지 않는 요소 2개(예: 텍스트 1개, 박스 1개)를 눈으로 확인한다.
2. 첫 번째 요소를 한 번 클릭해 단일 선택 상태를 만든다.
3. 우측 정보(선택 개수/선택 대상) 또는 `getReport().selectionCount` 값을 확인한다.

기대결과: 선택 개수는 1이고, 선택 하이라이트가 1개 요소에만 표시된다.

### 1-2. Shift 드래그 다중 선택(`beginMarqueeInteraction` 경유)
재현 절차
1. 빈 배경에서 **Shift를 누른 상태로** 마우스를 드래그해 마키(점선 박스)를 만든다.
2. 최소 2개 요소가 마키 영역 안에 들어가게 드래그를 끝낸다.
3. 상태 메시지(예: "드래그로 N개 레이어를 선택")와 `getReport().selectionCount`를 확인한다.
4. 선택된 요소에 다중 선택 스타일(`__phase5_selected_multi`)이 들어갔는지 확인한다.

기대결과: 마키 안 요소만 복수 선택되며 선택 개수가 2 이상으로 반영된다.

---

## 2) XYWH 숫자 입력과 드래그 조작 결과 일치 확인

### 2-1. XYWH 숫자 입력 적용 (`applyGeometryPatch`)
재현 절차
1. 요소 1개를 선택하고 현재 `getSelectionGeometry()` 값을 기록한다.
2. `applyGeometryPatch({ x: 120, y: 80, width: 300, height: 160 })`를 실행한다.
3. 다시 `getSelectionGeometry()`를 조회해 x/y/width/height 값을 확인한다.
4. 화면에서 실제 박스 위치·크기가 숫자 입력과 같은지 눈으로 확인한다.

기대결과: 입력한 XYWH 값과 선택 요소의 최종 위치/크기가 동일해야 한다.

### 2-2. 드래그 이동 후 수치 일치(드래그 + `getSelectionGeometry`)
재현 절차
1. 같은 요소를 마우스로 오른쪽/아래로 드래그해 위치를 바꾼다.
2. 드래그 직후 `getSelectionGeometry()`를 확인한다.
3. 이어서 `applyGeometryPatch({ x: 현재x, y: 현재y })`처럼 같은 좌표를 다시 적용한다.

기대결과: 드래그로 바뀐 좌표가 수치로 정확히 반영되고, 같은 값을 재적용해도 추가 위치 변화가 없어야 한다.

---

## 3) z-order 명령(앞/뒤/맨앞/맨뒤) 전후 레이어 트리 변화 확인

### 3-1. 한 단계 앞/뒤 (`bringSelectedForward`, `sendSelectedBackward`)
재현 절차
1. 같은 부모를 가진 형제 요소 3개를 만든 뒤 가운데 요소를 선택한다.
2. 실행 전 `getReport().layerTree`에서 해당 uid의 index(또는 형제 순서)를 기록한다.
3. `bringSelectedForward()`를 1회 실행하고 레이어 트리를 다시 확인한다.
4. 이어서 `sendSelectedBackward()`를 1회 실행해 원위치되는지 본다.

기대결과: forward는 한 단계 앞으로, backward는 한 단계 뒤로 이동하며 레이어 트리 순서가 그만큼만 바뀐다.

### 3-2. 맨앞/맨뒤 (`bringSelectedToFront`, `sendSelectedToBack`)
재현 절차
1. 맨 앞/맨 뒤가 아닌 요소를 선택한다.
2. `bringSelectedToFront()` 실행 후 `getReport().layerTree`에서 같은 부모 내 마지막 순서인지 확인한다.
3. 이어서 `sendSelectedToBack()` 실행 후 같은 부모 내 첫 순서인지 확인한다.

기대결과: front/back 명령은 선택 레이어를 부모 기준 최상단/최하단으로 즉시 이동시킨다.

---

## 4) hide/lock 상태에서 편집 차단 여부 확인

### 4-1. lock 상태에서 수정 차단 (`toggleSelectedLocked` + 편집 메서드)
재현 절차
1. 요소 1개 선택 후 `toggleSelectedLocked()`로 잠금 상태를 켠다.
2. `applyGeometryPatch(...)`, `duplicateSelected()`, `deleteSelected()` 중 하나씩 실행해 본다.
3. 각 호출의 반환값(`ok`, `message`)과 실제 화면 변화 여부를 확인한다.

기대결과: 잠긴 요소는 수정/이동/복제/삭제가 차단되고, 실패 메시지가 반환된다.

### 4-2. hide 상태에서 선택/편집 제한 (`toggleSelectedHidden`)
재현 절차
1. 요소 1개를 선택하고 `toggleSelectedHidden()`을 실행해 숨김 처리한다.
2. 캔버스에서 해당 요소를 직접 클릭해 재선택 가능한지 확인한다.
3. `getReport().layerTree`에서 hidden 플래그와 `getReport().hiddenCount`를 확인한다.

기대결과: 숨김된 요소는 화면에서 직접 조작하기 어렵거나 불가해야 하며, 레이어 트리에는 hidden 상태가 정확히 표시된다.

---

## 5) undo/redo로 직전 상태 복원 여부 확인

### 5-1. 복제/삭제 직후 Undo·Redo (`duplicateSelected`, `deleteSelected`, `executeCommand`)
재현 절차
1. 요소 1개 선택 후 `duplicateSelected()`를 실행해 사본이 생겼는지 확인한다.
2. 이어서 `deleteSelected()` 또는 원본/사본 중 하나를 삭제한다.
3. `executeCommand('undo')`를 1~2회 호출해 직전 상태(삭제 전/복제 후)로 돌아오는지 본다.
4. `executeCommand('redo')`를 호출해 다시 삭제 상태가 재현되는지 확인한다.

기대결과: undo/redo를 누를 때마다 직전 편집 상태가 순서대로 정확히 복원/재적용되어야 한다.

### 5-2. 좌표 변경 Undo·Redo (`applyGeometryPatch` + `executeCommand`)
재현 절차
1. 요소를 선택하고 `applyGeometryPatch({ x, y, width, height })`로 눈에 띄는 위치/크기 변화를 준다.
2. `executeCommand('undo')` 실행 후 변화 전 좌표/크기로 돌아왔는지 확인한다.
3. `executeCommand('redo')` 실행 후 다시 변경 좌표/크기로 돌아왔는지 확인한다.

기대결과: XYWH 편집도 undo/redo 히스토리에 포함되어 이전 상태와 변경 상태를 정확히 왕복해야 한다.

---

## 빠른 확인 포인트(실무용)
- 선택 검증: `getReport().selectionCount`, `getReport().selectedItems`
- 레이어 검증: `getReport().layerTree`, `getReport().hiddenCount`, `getReport().lockedCount`
- 좌표 검증: `getSelectionGeometry()`
- 명령 호출: `executeCommand('layer-index-forward' | 'layer-index-backward' | 'layer-index-front' | 'layer-index-back' | 'undo' | 'redo')`

위 4개만 보면 대부분의 조작 회귀를 빠르게 확인할 수 있습니다.
