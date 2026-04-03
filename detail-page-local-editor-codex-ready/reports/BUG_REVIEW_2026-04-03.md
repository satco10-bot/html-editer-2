# 전반 버그 점검 + 코드리뷰 보고서 (2026-04-03)

## 0) 한 줄 결론
- **핵심 기능은 대체로 안정적**입니다.
- 다만 실제 브라우저 자동 스모크 테스트는 Playwright 의존성 부재로 미실행 상태이며, 이 구간은 잠재 리스크로 남아 있습니다.

---

## 1) 이번 점검에서 실제로 확인한 것

### 자동 점검(정적/회귀)
- `node --check app.bundle.js` 통과 (번들 문법 정상)
- `python3 scripts/validate_phase6.py` 실행
- `python3 scripts/validate_phase8.py` 실행
  - 167개 체크 중 166개 통과
  - 실패 1건: `playwright` 모듈 없음으로 file:// 브라우저 스모크 테스트 미실행

### 수동 코드리뷰(핵심 경로)
- 로컬 앱 하드 제약(`file://`, `fetch` 비필수, File System Access API 비필수) 준수 구조 확인
- Export 설정(배율/JPG 품질)이 다중 컨트롤 동기화 방식으로 연결된 점 확인
- 문서/검증 스크립트/실제 UI id 간 불일치가 있었고, 이번에 검증 스크립트 측 호환 처리로 보정

---

## 2) 이번 점검에서 식별한 문제와 조치

### 문제 A. 검증 스크립트가 최신 UI id 구조를 완전히 반영하지 못함
- 증상: 실제 앱은 `exportScaleSelectMain`, `exportScaleSelectSelection`처럼 메인/선택영역 컨트롤을 분리해 쓰는데, 검증 스크립트는 단일 id(`exportScaleSelect`, `exportJpgQualityInput`)만 강제.
- 영향: 실제 기능 정상이어도 검증에서 false fail 발생.
- 조치: `scripts/validate_phase8.py`에서 **alias id 허용**으로 수정.

### 문제 B. README_APP에 금지 API 정책 명시가 약해 자동 검사 fail
- 증상: 금지 API/의존 체크리스트 문구가 누락되어 품질 게이트 실패.
- 영향: 운영 문서 기준 불명확.
- 조치: `README_APP.md`에 금지 API 목록(`fetch()`, `showOpenFilePicker`, `showSaveFilePicker`, `showDirectoryPicker`)과 file gate 설명 추가.

### 문제 C. 앱 메타 표기(타이틀/버전)가 phase6 문자열로 남아 있었음
- 증상: 패키지 버전(0.8.0, phase8)과 config 문자열 간 불일치.
- 영향: 초보 사용자 혼란 가능.
- 조치: `src/config.js`의 앱 타이틀/버전 문자열을 phase8 기준으로 업데이트.

---

## 3) 초보자 관점 사용 제약(꼭 알아야 할 현실 제약)

1. **브라우저/보안 컨텍스트 제약**
   - 이 앱은 `file://` 직접 실행을 전제로 하므로, 일부 최신 파일 API는 의도적으로 필수 경로에서 배제되어 있음.
2. **자동 UI 테스트 환경 의존성**
   - Playwright 미설치 시 브라우저 스모크 테스트가 건너뛰어짐.
   - 즉, 코드상 체크는 통과해도 "실제 클릭 시나리오" 검증은 빈칸으로 남을 수 있음.
3. **고해상도 export 성능 제약**
   - 2x/3x PNG/JPG 출력은 장치 메모리/CPU 영향을 크게 받음.
   - 대형 HTML(긴 상세페이지)에서는 내보내기 시간이 길어질 수 있음.

---

## 4) 개선 제안 (우선순위)

### P0 (즉시)
- CI/로컬 공용으로 `playwright` 설치 스텝을 문서화하거나, 미설치 시 안내 메시지를 더 친절히 출력.

### P1 (단기)
- 검증 스크립트에서 UI id 변경에 강한 "semantic selector"(data-attribute 중심) 검사 비중 확대.
- README/README_APP/검증 스크립트의 "phase 기준 문자열"을 한 곳 상수로 묶어 drift 방지.

### P2 (중기)
- 초보자 모드에서 Export 품질/배율의 권장값 설명(품질 vs 용량 트레이드오프)을 툴팁으로 표준화.
- 대형 문서 export 시 진행률(Progress UI) 고도화.

---

## 5) 회귀 위험도 평가
- **낮음~중간**
  - 이번 변경은 검증 스크립트/문서/메타 문자열 중심이라 런타임 편집 로직 침범이 적음.
  - 단, 번들을 재생성했기 때문에 배포 전 최소 1회 실제 브라우저 스모크는 권장.

