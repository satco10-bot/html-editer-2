# 입력 시나리오 3축 매트릭스 (`src/main.js` 기준)

이 문서는 아래 5개 UI 연결을 기준으로 테스트 시나리오를 정리합니다.

- 버튼: `openHtmlButton`, `openFolderButton`, `applyPasteButton`
- 입력요소: `htmlFileInput`, `folderInput`
- 상태 기준: `statusText`

---

## 축 1) 단일 HTML 파일 업로드 (`openHtmlButton` → `htmlFileInput`)

### 1-A. 성공 케이스
- **행동**: 정상 HTML 파일 선택
- **기대 `statusText`**:
  - `HTML 파일 {파일명}을 불러왔습니다. 미해결 자산 {N}개입니다.`
- **의미**: 편집기 진입 성공 + 상대경로 자산 중 미해결 개수 즉시 확인 가능

### 1-B. 실패 케이스
- **행동**: 파일 읽기/정규화 중 예외 발생
- **기대 `statusText`**:
  - `HTML 파일 열기 중 오류가 발생했습니다. 안내: HTML 파일(.html/.htm)인지 확인하고 다시 선택해 주세요.`
- **최소 안내 문구(사용자 노출 필수)**:
  - `HTML 파일(.html/.htm)인지 확인하고 다시 선택해 주세요.`

---

## 축 2) 폴더 업로드 + 상대경로 에셋 연결 (`openFolderButton` → `folderInput`)

### 2-A. 성공 케이스 (에셋 연결 성공)
- **행동**: HTML + assets 구조가 맞는 폴더 선택
- **기대 `statusText`**:
  - `프로젝트 폴더 import 완료: {대표HTML상대경로}. resolved {R}개, unresolved {U}개입니다.`
- **판정 포인트**:
  - `resolved > 0` 이면 상대경로 에셋 연결 성공으로 판단 가능

### 2-B. 누락 케이스 (에셋 일부/전체 미연결)
- **행동**: 폴더는 열렸지만 자산 파일 일부 누락
- **기대 `statusText`**:
  - 동일하게 import 완료 문구가 출력되며 `unresolved` 값으로 누락을 확인
  - `프로젝트 폴더 import 완료: ... resolved {R}개, unresolved {U}개입니다.`
- **최소 안내 문구(사용자 노출 권장)**:
  - `assets 폴더/파일 누락 여부를 확인해 주세요. (unresolved 값 참고)`

### 2-C. 실패 케이스 (HTML 자체가 없는 폴더)
- **행동**: HTML 파일 없는 폴더 선택
- **기대 `statusText`**:
  - `선택한 폴더에 HTML 파일이 없습니다. 안내: 폴더 안에 대표 HTML 파일(예: index.html)을 넣어 주세요.`
- **최소 안내 문구(사용자 노출 필수)**:
  - `대표 HTML 파일(예: index.html)을 폴더 루트에 넣어 주세요.`

### 2-D. 실패 케이스 (import 예외)
- **행동**: 폴더 읽기/정규화 중 예외 발생
- **기대 `statusText`**:
  - `폴더 import 중 오류가 발생했습니다. 안내: HTML과 assets 폴더를 같은 루트에서 다시 선택해 주세요.`
- **최소 안내 문구(사용자 노출 필수)**:
  - `HTML과 assets 폴더를 같은 루트에서 다시 선택해 주세요.`

---

## 축 3) HTML 붙여넣기 (`applyPasteButton`)

### 3-A. 성공 케이스
- **행동**: 유효한 HTML 문자열 붙여넣기 후 적용
- **기대 `statusText`**:
  - `붙여넣기 HTML을 정규화했습니다. 슬롯 후보 {N}개를 찾았습니다.`

### 3-B. 실패 케이스 (빈 입력)
- **행동**: 공백/빈 문자열 붙여넣기
- **기대 `statusText`**:
  - `붙여넣기 HTML이 비어 있습니다.`
- **최소 안내 문구(사용자 노출 필수)**:
  - `HTML 코드를 1줄 이상 붙여넣어 주세요.`

### 3-C. 방어 케이스 (malformed markup)
- **행동**: 닫히지 않은 태그 등 비정상 마크업 입력
- **기대 `statusText`**:
  - 예외 발생 시
    - `붙여넣기 적용 중 오류가 발생했습니다. 안내: 닫히지 않은 태그(예: </div>)를 확인한 뒤 다시 붙여넣어 주세요.`
  - 예외 없이 브라우저가 자동 보정한 경우
    - `붙여넣기 HTML을 정규화했습니다. 슬롯 후보 {N}개를 찾았습니다.`
- **최소 안내 문구(사용자 노출 필수)**:
  - `닫히지 않은 태그(예: </div>)를 확인한 뒤 다시 붙여넣어 주세요.`

---

## 빠른 체크리스트 (초보용)

1. 버튼 클릭 후 파일 선택창이 열리는지 확인
   - HTML: `openHtmlButton` → `htmlFileInput`
   - 폴더: `openFolderButton` → `folderInput`
2. 적용/업로드 직후 `statusText` 문구가 위 기대값과 일치하는지 확인
3. 폴더 import는 `resolved / unresolved` 숫자를 꼭 기록
4. 붙여넣기는 정상 HTML 1회 + malformed HTML 1회 둘 다 실행
