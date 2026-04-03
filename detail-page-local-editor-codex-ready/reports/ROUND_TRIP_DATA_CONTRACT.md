# Round-trip 데이터 계약 (UID / Patch / Export)

작성일: 2026-04-03  
적용 범위: 로컬 상세페이지 에디터 전체(`file://` 실행 포함)

---

## 0) 문서 목적 (초보자용 한 줄 요약)
이 문서는 **"원본 HTML은 최대한 보존"** 하면서, 편집기는 **변경점(Patch)만 별도로 기록**해 round-trip(저장→재오픈→재편집) 안정성을 유지하기 위한 팀 공통 규칙이다.

> **해석 금지 규칙**  
> 이 문서에 정의된 용어/규칙(UID, Patch, Round-trip, Export 정책)은 구현/리뷰/테스트에서 임의 해석하지 않는다.  
> 모호한 경우 먼저 문서를 갱신하고, 그 다음 코드를 수정한다.

---

## 1) 핵심 용어

- **UID (`data-node-uid`)**: 편집 대상 HTML 요소를 안정적으로 다시 찾기 위한 고유 식별자.
- **Base HTML**: import 직후의 기준 원본 HTML 문자열(최대한 보존).
- **Patch**: "어떤 UID의 어떤 속성이 어떻게 바뀌었는지"를 담는 변경 이벤트.
- **Round-trip**: `import → edit → save → reopen → edit` 흐름에서 같은 요소를 같은 UID로 식별하고 같은 결과를 재현하는 능력.
- **Final HTML**: Base HTML + Patch를 적용해 만든 최종 출력 HTML.

---

## 2) 정책 표 (고정 규칙)

### 2.1 UID 생성 규칙

| 항목 | 정책 |
|---|---|
| 기본 속성명 | `data-node-uid` |
| 대상 | 편집 가능한 모든 노드(텍스트/이미지/섹션/레이아웃 블록) |
| 생성 시점 | import normalize 단계에서 누락 노드에 부여 |
| 형식 | `n_<timestampBase36>_<counterBase36>` (예: `n_lx2m9a_0f`) |
| 유일성 | 문서 전체에서 중복 금지. preflight에서 중복 강제 정리 |
| 안정성 우선순위 | 사람이 읽기 쉬움보다 충돌 없는 안정 식별을 우선 |

### 2.2 UID 유지/재생성 규칙 (복제/삭제/붙여넣기)

| 상황 | 정책 |
|---|---|
| 단순 편집(위치/스타일/텍스트 변경) | 기존 UID 유지 |
| 노드 복제(Duplicate) | 원본 UID 복사 금지, 복제본은 새 UID 강제 발급 |
| 섹션 추가(Add Section) | 추가된 루트와 하위 편집 노드 모두 새 UID 발급 |
| 붙여넣기(Paste) | 외부/내부 소스 상관없이 충돌 검사 후 필요 시 재발급 |
| 노드 삭제(Delete) | UID 재사용 금지(동일 세션/프로젝트 내) |
| 코드 워크벤치 적용 | 적용 전 preflight에서 UID 누락/충돌 보정 후 반영 |

### 2.3 Patch 스키마 규칙

| patch type | 대상 예시 | 필수 필드 | 비고 |
|---|---|---|---|
| `geometry` | x/y/width/height/z-index | `id`, `type`, `uid`, `changes` | 좌표/크기 계열 |
| `text` | 텍스트 내용 변경 | `id`, `type`, `uid`, `content` | 내용 전용 |
| `style` | 글자색/폰트/정렬/간격 | `id`, `type`, `uid`, `styleDelta` | 변경된 속성만 기록 |
| `image` | src/fit/position | `id`, `type`, `uid`, `imageDelta` | `uploaded:`/상대경로 보존 |
| `section` | 섹션 add/move/delete | `id`, `type`, `uid`, `action`, `payload` | 구조 변경 이벤트 |

공통 필드 권장:
- `id`: patch 고유 ID (`p_<time>_<seq>`)
- `ts`: 생성 시각(ISO 8601)
- `source`: `canvas` 또는 `code-workbench`

### 2.4 Export 시 UID 유지 옵션

| 모드 | UID | 메타데이터 | 사용 목적 |
|---|---|---|---|
| 편집 재개용 | 유지 | 유지(필요 최소) | 다시 열어 계속 편집 |
| 배포용 | 기본 제거(옵션으로 유지 가능) | 런타임/편집 메타 정리 | 업로드/배포/전달 |

---

## 3) Base 보존 vs Final HTML 생성 (예시 2개)

### 예시 A: 텍스트만 변경

- Base HTML: `data-node-uid="hero_title"` 노드의 텍스트가 "봄 신상 출시".
- 사용자 편집: 텍스트를 "여름 신상 출시"로 변경.
- 저장 정책:
  - Base HTML은 그대로 보존.
  - Patch에 `text` 1건만 기록.
- Final HTML 생성 시점에만 Base + Patch를 합성해 결과 문자열을 만든다.

핵심: **원본 문자열 전체를 매번 다시 쓰지 않고, 변경 의도만 기록**한다.

### 예시 B: 섹션 복제 후 이미지 교체

- Base HTML: `section_banner_1` 섹션 존재.
- 사용자 편집:
  1) 섹션 복제(복제본 UID 새로 생성)
  2) 복제 섹션 내 이미지 `src` 변경
- 저장 정책:
  - Base HTML은 그대로 보존.
  - Patch에 `section(add)` + `image` 2건 기록.
- Final HTML 생성 시 Patch 순서대로 적용하여 동일 결과를 재현한다.

핵심: **구조 변경도 patch 이벤트로 표현**해 충돌 원인을 추적 가능하게 만든다.

---

## 4) 충돌/실패 처리 규칙

- Patch 적용 실패는 조용히 skip 금지.
- 실패 항목은 `warningList`에 누적하고 UI 리포트/로그에 노출.
- UID 누락/중복 발견 시 preflight 자동 보정 후, 아래 집계를 리포트 패널에 표시.
  - `uidScanned`: 검사한 노드 수
  - `uidAssigned`: 누락 UID 자동 발급 수
  - `uidDeduped`: 중복 UID 자동 재발급 수
  - `uidDuplicateGroups`: 충돌 그룹 수
- round-trip 테스트에서 아래를 기본 게이트로 사용:
  - UID 보존율
  - HTML 구조 diff 허용치
  - 핵심 시각 결과 일치

---

## 5) 구현 순서 고정 (작업자 공통)
1. 데이터 계약 문서(본 문서) 고정
2. UID 안정화
3. Base+Patch 저장
4. 코드 적용 안전 동기화
5. Minimal Patch Write + Export 모드 분리
6. round-trip 자동 회귀/파이프라인 연결

---

## 6) 초보자 체크리스트

- "왜 원본을 안 고치나요?" → 나중에 문제 추적/되돌리기 쉽기 때문.
- "UID는 왜 중요한가요?" → 같은 요소를 다시 찾는 주소 역할.
- "Patch는 왜 쓰나요?" → 변경 이유와 범위를 작게 기록해 충돌을 줄임.
- "Round-trip 테스트는 왜 필수인가요?" → 저장/재오픈에서 깨지는 버그를 눈이 아니라 자동으로 잡기 위해.
