/* Auto-generated local bundle. Open index.html directly. */
(function () {
'use strict';

/* ===== src/fixture-bundle.js ===== */

const FIXTURE_MANIFEST = {
  "manifest_version": "phase1-2026-04-02",
  "project_goal": "HTML 상세페이지를 로컬-퍼스트 웹앱에서 미리캔버스/피그마급 사용성으로 편집하고, linked HTML / embedded HTML / 전체 PNG / 분할 PNG로 안정적으로 저장한다.",
  "fixture_freeze_policy": {
    "baseline_version": "v1",
    "rules": [
      "Fixture HTML은 원본을 보존한다. 슬롯 테스트를 위해 HTML 본문을 임의로 수정하지 않는다.",
      "새 fixture를 추가할 때는 manifest와 acceptance matrix를 함께 갱신한다.",
      "기존 fixture를 변경할 때는 변경 이유, 영향 범위, 예상 슬롯 수 변경 여부를 changelog에 기록한다."
    ]
  },
  "fixtures": [
    {
      "id": "F01",
      "name": "blank_builder_860",
      "file": "fixtures/fixture_01_blank_builder_860.html",
      "source_type": "internal_sample",
      "category": "explicit_slots_template",
      "priority": "P0",
      "page_width_px": 860,
      "slot_contract": {
        "detection_mode": "explicit",
        "required_exact_count": 3,
        "required_selectors": [
          "[data-image-slot='hero-main']",
          "[data-image-slot='detail-slot-1']",
          "[data-image-slot='detail-slot-2']"
        ],
        "false_positive_budget_max": 0
      },
      "asset_contract": {
        "existing_img_count": 0,
        "custom_scheme_required": false,
        "background_image_required": false
      },
      "save_export_contract": {
        "linked_html_required": true,
        "embedded_html_required": true,
        "full_png_required": true,
        "segmented_png_required": true
      },
      "notes": "가장 단순한 860px 기준 빌더. explicit data-image-slot이 깨지지 않는지 확인하는 기준 fixture."
    },
    {
      "id": "F02",
      "name": "sample_shop_builder_860",
      "file": "fixtures/fixture_02_sample_shop_builder_860.html",
      "source_type": "internal_sample",
      "category": "explicit_slots_long_detail",
      "priority": "P0",
      "page_width_px": 860,
      "slot_contract": {
        "detection_mode": "explicit",
        "required_exact_count": 6,
        "required_selectors": [
          "[data-image-slot='hero-main']",
          "[data-image-slot='fit-main']",
          "[data-image-slot='fit-sub-1']",
          "[data-image-slot='fit-sub-2']",
          "[data-image-slot='detail-long-1']",
          "[data-image-slot='detail-long-2']"
        ],
        "false_positive_budget_max": 0
      },
      "asset_contract": {
        "existing_img_count": 0,
        "custom_scheme_required": false,
        "background_image_required": false
      },
      "save_export_contract": {
        "linked_html_required": true,
        "embedded_html_required": true,
        "full_png_required": true,
        "segmented_png_required": true
      },
      "notes": "긴 상세컷과 복수 슬롯을 가진 내부 샘플. 다중 드롭, 순차 배치, 분할 PNG 기준 fixture."
    },
    {
      "id": "F03",
      "name": "sample_template_existing_html",
      "file": "fixtures/fixture_03_sample_template_existing_html.html",
      "source_type": "internal_sample",
      "category": "legacy_existing_html_explicit_mixed",
      "priority": "P0",
      "page_width_px": 1200,
      "slot_contract": {
        "detection_mode": "explicit_mixed",
        "required_exact_count": 4,
        "required_pattern_groups": {
          "[data-image-slot='hero-main']": 1,
          ".card-image.image-slot": 3
        },
        "false_positive_budget_max": 0
      },
      "asset_contract": {
        "existing_img_count": 0,
        "custom_scheme_required": false,
        "background_image_required": false
      },
      "save_export_contract": {
        "linked_html_required": true,
        "embedded_html_required": true,
        "full_png_required": true,
        "segmented_png_required": false
      },
      "notes": "기존 HTML을 가져왔을 때 explicit slot과 class 기반 slot이 함께 살아야 하는 기준 fixture."
    },
    {
      "id": "F04",
      "name": "sample_dring_walk_allinone",
      "file": "fixtures/fixture_04_sample_dring_walk_allinone.html",
      "source_type": "internal_sample",
      "category": "heuristic_placeholder_storytelling",
      "priority": "P0",
      "page_width_px": 860,
      "slot_contract": {
        "detection_mode": "heuristic",
        "required_min_count": 16,
        "required_pattern_groups": {
          ".ph.hero-visual": 1,
          ".ph.visual": 3,
          ".ph.c-box": 6,
          ".warn-card .ph.img": 2,
          ".step-wrap .ph.img": 3,
          ".cta-char": 1
        },
        "false_positive_budget_max": 2
      },
      "asset_contract": {
        "existing_img_count": 0,
        "custom_scheme_required": false,
        "background_image_required": false
      },
      "save_export_contract": {
        "linked_html_required": true,
        "embedded_html_required": true,
        "full_png_required": true,
        "segmented_png_required": true
      },
      "notes": "플레이스홀더 문구, 카드 콜라주, 스토리텔링 섹션이 섞인 고난도 fixture. heuristic auto-detect의 성능 기준."
    },
    {
      "id": "F05",
      "name": "user_melting_cheese_compact",
      "file": "fixtures/fixture_05_user_melting_cheese_compact.html",
      "source_type": "user_real_world_sample",
      "category": "heuristic_mixed_existing_images_custom_scheme",
      "priority": "P0",
      "page_width_px": 860,
      "slot_contract": {
        "detection_mode": "heuristic_mixed",
        "required_exact_count": 13,
        "required_pattern_groups": {
          ".hero-shot.media-shell": 1,
          ".option-list .opt-thumb.media-shell": 2,
          "section.bg-ivory > .media-shell": 1,
          ".ba-wrap .media-shell": 2,
          ".set-grid .thumb.media-shell": 3,
          ".point-hero .visual.media-shell": 4
        },
        "false_positive_budget_max": 1
      },
      "asset_contract": {
        "existing_img_count": 2,
        "custom_scheme_required": true,
        "supported_custom_schemes": [
          "uploaded:"
        ],
        "background_image_required": false
      },
      "save_export_contract": {
        "linked_html_required": true,
        "embedded_html_required": true,
        "full_png_required": true,
        "segmented_png_required": true,
        "must_preserve_existing_images": true
      },
      "notes": "실사용자가 제공한 실제 상세페이지. placeholder와 기존 img, uploaded: 커스텀 경로가 섞인 핵심 기준 fixture."
    }
  ]
};
const FIXTURE_SOURCE_MAP = {
  "F01": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>새 860px 빌더</title>\n  <style>\n    * { box-sizing: border-box; }\n    body {\n      margin: 0;\n      background: #f8fafc;\n      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n      color: #111827;\n      padding: 32px 0 80px;\n    }\n    .detail-builder-canvas {\n      width: 860px;\n      margin: 0 auto;\n      background: #fff;\n      box-shadow: 0 24px 60px rgba(15, 23, 42, 0.10);\n    }\n    .builder-section {\n      position: relative;\n      width: 100%;\n      min-height: 620px;\n      height: 620px;\n      padding: 52px;\n      border-top: 1px dashed #e2e8f0;\n    }\n    .section-hero {\n      background: linear-gradient(180deg, #fff7ed 0%, #ffffff 56%);\n    }\n    .section-product {\n      background: #ffffff;\n    }\n    .eyebrow {\n      display: inline-flex;\n      align-items: center;\n      padding: 10px 16px;\n      border-radius: 999px;\n      background: rgba(255,255,255,0.85);\n      color: #c2410c;\n      font-size: 14px;\n      font-weight: 800;\n      letter-spacing: 0.04em;\n    }\n    .headline {\n      margin: 18px 0 0;\n      font-size: 58px;\n      line-height: 1.02;\n      letter-spacing: -0.04em;\n      font-weight: 900;\n    }\n    .subcopy {\n      margin: 18px 0 0;\n      max-width: 340px;\n      color: #475569;\n      font-size: 20px;\n      line-height: 1.65;\n    }\n    .cta-box {\n      border-radius: 28px;\n      background: #111827;\n      color: #fff;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      font-size: 20px;\n      font-weight: 800;\n    }\n    .price-box {\n      border-radius: 22px;\n      border: 1px solid #e2e8f0;\n      background: #fff;\n      padding: 24px 26px;\n    }\n    .price-box strong {\n      font-size: 38px;\n      letter-spacing: -0.03em;\n    }\n    .price-box span {\n      display: block;\n      margin-top: 8px;\n      font-size: 15px;\n      color: #64748b;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"detail-builder-canvas editable-box\" data-builder-canvas=\"860px 캔버스\" data-editable-box=\"860px 캔버스\" data-box-lock-move=\"1\" data-box-lock-resize=\"1\">\n    <section class=\"builder-section section-hero editable-box\" data-builder-section=\"히어로 섹션\" data-editable-box=\"히어로 섹션\" data-box-lock-move=\"1\" data-box-lock-width=\"1\">\n      <div class=\"editable-box editable-text eyebrow\" data-editable-box=\"상단 태그\" data-editable-text=\"상단 태그\" style=\"position:absolute; left:56px; top:54px; width:160px;\">NEW DROP</div>\n      <div class=\"editable-box editable-text headline\" data-editable-box=\"메인 타이틀\" data-editable-text=\"메인 타이틀\" style=\"position:absolute; left:56px; top:108px; width:360px;\">새 상세페이지를 바로 시작하세요</div>\n      <div class=\"editable-box editable-text subcopy\" data-editable-box=\"메인 설명\" data-editable-text=\"메인 설명\" style=\"position:absolute; left:56px; top:298px; width:330px;\">텍스트는 클릭해서 수정하고, 이미지 슬롯에는 파일을 드래그해서 넣으시면 됩니다.</div>\n      <div class=\"image-slot editable-box\" data-image-slot=\"hero-main\" data-slot-label=\"메인 이미지\" data-editable-box=\"메인 이미지 슬롯\" style=\"position:absolute; left:430px; top:52px; width:360px; height:480px; border-radius:30px; background:#f1f5f9; overflow:hidden;\"></div>\n      <div class=\"editable-box cta-box\" data-editable-box=\"버튼 박스\" style=\"position:absolute; left:56px; top:436px; width:240px; height:84px;\">여기에 CTA 배치</div>\n    </section>\n    <section class=\"builder-section section-product editable-box\" data-builder-section=\"상품 정보 섹션\" data-editable-box=\"상품 정보 섹션\" data-box-lock-move=\"1\" data-box-lock-width=\"1\" style=\"height:540px; min-height:540px;\">\n      <div class=\"editable-box price-box\" data-editable-box=\"가격 정보 박스\" style=\"position:absolute; left:54px; top:58px; width:300px; height:160px;\">\n        <div class=\"editable-box editable-text\" data-editable-box=\"가격\" data-editable-text=\"가격\" style=\"font-size:38px; font-weight:900;\">₩ 49,000</div>\n        <div class=\"editable-box editable-text\" data-editable-box=\"가격 설명\" data-editable-text=\"가격 설명\" style=\"margin-top:8px; color:#64748b; font-size:15px;\">여기에 할인, 배송 문구를 넣어보세요.</div>\n      </div>\n      <div class=\"image-slot editable-box\" data-image-slot=\"detail-slot-1\" data-slot-label=\"상세 이미지 1\" data-editable-box=\"상세 이미지 슬롯 1\" style=\"position:absolute; left:414px; top:56px; width:180px; height:220px; border-radius:20px; background:#f1f5f9; overflow:hidden;\"></div>\n      <div class=\"image-slot editable-box\" data-image-slot=\"detail-slot-2\" data-slot-label=\"상세 이미지 2\" data-editable-box=\"상세 이미지 슬롯 2\" style=\"position:absolute; left:612px; top:56px; width:180px; height:220px; border-radius:20px; background:#f1f5f9; overflow:hidden;\"></div>\n      <div class=\"editable-box editable-text\" data-editable-box=\"하단 안내문\" data-editable-text=\"하단 안내문\" style=\"position:absolute; left:54px; top:286px; width:738px; font-size:28px; font-weight:800; line-height:1.32;\">오른쪽 패널에서 새 텍스트/박스/이미지 슬롯을 계속 추가하면서 상세페이지를 완성해 보세요.</div>\n    </section>\n  </div>\n</body>\n</html>\n",
  "F02": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>쇼핑몰 860 샘플 빌더</title>\n  <style>\n    * { box-sizing: border-box; }\n    body {\n      margin: 0;\n      background: #f8fafc;\n      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n      color: #111827;\n      padding: 36px 0 90px;\n    }\n    .detail-builder-canvas {\n      width: 860px;\n      margin: 0 auto;\n      background: #fff;\n      box-shadow: 0 30px 70px rgba(15, 23, 42, 0.12);\n      overflow: hidden;\n    }\n    .builder-section {\n      position: relative;\n      width: 100%;\n      border-top: 1px solid #edf2f7;\n    }\n    .hero {\n      height: 760px;\n      background: linear-gradient(160deg, #fff7ed 0%, #ffffff 55%);\n    }\n    .summary {\n      height: 440px;\n      background: #fff;\n    }\n    .fit-detail {\n      height: 620px;\n      background: #fcfcfd;\n    }\n    .detail-cut {\n      height: 860px;\n      background: #ffffff;\n    }\n    .title-badge {\n      display: inline-flex;\n      align-items: center;\n      gap: 8px;\n      padding: 10px 16px;\n      border-radius: 999px;\n      background: rgba(255,255,255,0.84);\n      color: #c2410c;\n      font-size: 14px;\n      font-weight: 900;\n      letter-spacing: 0.05em;\n    }\n    .shadow-card {\n      border-radius: 28px;\n      background: #fff;\n      box-shadow: 0 24px 48px rgba(15, 23, 42, 0.08);\n      border: 1px solid #eef2f7;\n    }\n    .soft-chip {\n      border-radius: 999px;\n      padding: 10px 14px;\n      background: #f8fafc;\n      color: #475569;\n      font-weight: 700;\n      font-size: 14px;\n    }\n  </style>\n</head>\n<body>\n  <div class=\"detail-builder-canvas editable-box\" data-builder-canvas=\"메인 860 캔버스\" data-editable-box=\"메인 860 캔버스\" data-box-lock-move=\"1\" data-box-lock-resize=\"1\">\n    <section class=\"builder-section hero editable-box\" data-builder-section=\"상단 히어로\" data-editable-box=\"상단 히어로\" data-box-lock-move=\"1\" data-box-lock-width=\"1\">\n      <div class=\"editable-box editable-text title-badge\" data-editable-box=\"배지\" data-editable-text=\"배지\" style=\"position:absolute; left:58px; top:58px; width:182px;\">SPRING DROP</div>\n      <div class=\"editable-box editable-text\" data-editable-box=\"메인 타이틀\" data-editable-text=\"메인 타이틀\" style=\"position:absolute; left:58px; top:128px; width:350px; font-size:64px; line-height:1.0; font-weight:900; letter-spacing:-0.05em;\">봄 신상 메인 룩북</div>\n      <div class=\"editable-box editable-text\" data-editable-box=\"메인 설명\" data-editable-text=\"메인 설명\" style=\"position:absolute; left:58px; top:328px; width:330px; font-size:21px; line-height:1.7; color:#475569;\">대표 착용컷, 소재 포인트, 컬러감 설명을 이 한 섹션에서 바로 보여줄 수 있게 만든 샘플입니다.</div>\n      <div class=\"editable-box shadow-card\" data-editable-box=\"혜택 카드\" style=\"position:absolute; left:58px; top:510px; width:320px; height:132px; padding:24px 26px;\">\n        <div class=\"editable-box editable-text\" data-editable-box=\"혜택 제목\" data-editable-text=\"혜택 제목\" style=\"font-size:28px; font-weight:900; letter-spacing:-0.03em;\">오늘만 10% 할인</div>\n        <div class=\"editable-box editable-text\" data-editable-box=\"혜택 설명\" data-editable-text=\"혜택 설명\" style=\"margin-top:8px; font-size:15px; color:#64748b;\">무료배송 / 당일 출고 문구를 여기에 넣으세요.</div>\n      </div>\n      <div class=\"image-slot editable-box\" data-image-slot=\"hero-main\" data-slot-label=\"대표 착용컷\" data-editable-box=\"대표 착용컷 슬롯\" style=\"position:absolute; left:438px; top:56px; width:364px; height:610px; border-radius:34px; background:#f1f5f9; overflow:hidden;\"></div>\n    </section>\n\n    <section class=\"builder-section summary editable-box\" data-builder-section=\"요약 카드\" data-editable-box=\"요약 카드\" data-box-lock-move=\"1\" data-box-lock-width=\"1\">\n      <div class=\"editable-box editable-text\" data-editable-box=\"섹션 제목\" data-editable-text=\"섹션 제목\" style=\"position:absolute; left:56px; top:52px; width:340px; font-size:44px; font-weight:900; letter-spacing:-0.04em;\">이 페이지에서 보여줄 핵심</div>\n      <div class=\"editable-box shadow-card\" data-editable-box=\"요약 카드 1\" style=\"position:absolute; left:56px; top:152px; width:238px; height:220px; padding:24px;\">\n        <div class=\"editable-box editable-text soft-chip\" data-editable-box=\"칩 1\" data-editable-text=\"칩 1\" style=\"display:inline-flex; width:auto;\">POINT 01</div>\n        <div class=\"editable-box editable-text\" data-editable-box=\"요약 제목 1\" data-editable-text=\"요약 제목 1\" style=\"margin-top:18px; font-size:28px; font-weight:800; line-height:1.18;\">핏감 포인트</div>\n        <div class=\"editable-box editable-text\" data-editable-box=\"요약 설명 1\" data-editable-text=\"요약 설명 1\" style=\"margin-top:10px; font-size:15px; line-height:1.7; color:#64748b;\">허리선, 기장감, 실루엣 설명을 짧게 정리합니다.</div>\n      </div>\n      <div class=\"editable-box shadow-card\" data-editable-box=\"요약 카드 2\" style=\"position:absolute; left:312px; top:152px; width:238px; height:220px; padding:24px;\">\n        <div class=\"editable-box editable-text soft-chip\" data-editable-box=\"칩 2\" data-editable-text=\"칩 2\" style=\"display:inline-flex; width:auto;\">POINT 02</div>\n        <div class=\"editable-box editable-text\" data-editable-box=\"요약 제목 2\" data-editable-text=\"요약 제목 2\" style=\"margin-top:18px; font-size:28px; font-weight:800; line-height:1.18;\">소재감 포인트</div>\n        <div class=\"editable-box editable-text\" data-editable-box=\"요약 설명 2\" data-editable-text=\"요약 설명 2\" style=\"margin-top:10px; font-size:15px; line-height:1.7; color:#64748b;\">두께, 촉감, 비침, 신축성 같은 문구를 넣습니다.</div>\n      </div>\n      <div class=\"editable-box shadow-card\" data-editable-box=\"요약 카드 3\" style=\"position:absolute; left:568px; top:152px; width:238px; height:220px; padding:24px;\">\n        <div class=\"editable-box editable-text soft-chip\" data-editable-box=\"칩 3\" data-editable-text=\"칩 3\" style=\"display:inline-flex; width:auto;\">POINT 03</div>\n        <div class=\"editable-box editable-text\" data-editable-box=\"요약 제목 3\" data-editable-text=\"요약 제목 3\" style=\"margin-top:18px; font-size:28px; font-weight:800; line-height:1.18;\">컬러감 포인트</div>\n        <div class=\"editable-box editable-text\" data-editable-box=\"요약 설명 3\" data-editable-text=\"요약 설명 3\" style=\"margin-top:10px; font-size:15px; line-height:1.7; color:#64748b;\">실물에 가까운 색감 설명을 넣으시면 좋습니다.</div>\n      </div>\n    </section>\n\n    <section class=\"builder-section fit-detail editable-box\" data-builder-section=\"핏/디테일 섹션\" data-editable-box=\"핏/디테일 섹션\" data-box-lock-move=\"1\" data-box-lock-width=\"1\">\n      <div class=\"image-slot editable-box\" data-image-slot=\"fit-main\" data-slot-label=\"핏 디테일 메인\" data-editable-box=\"핏 디테일 메인 슬롯\" style=\"position:absolute; left:58px; top:58px; width:360px; height:480px; border-radius:28px; background:#f1f5f9; overflow:hidden;\"></div>\n      <div class=\"image-slot editable-box\" data-image-slot=\"fit-sub-1\" data-slot-label=\"핏 서브 1\" data-editable-box=\"핏 서브 슬롯 1\" style=\"position:absolute; left:438px; top:58px; width:164px; height:220px; border-radius:20px; background:#f1f5f9; overflow:hidden;\"></div>\n      <div class=\"image-slot editable-box\" data-image-slot=\"fit-sub-2\" data-slot-label=\"핏 서브 2\" data-editable-box=\"핏 서브 슬롯 2\" style=\"position:absolute; left:620px; top:58px; width:164px; height:220px; border-radius:20px; background:#f1f5f9; overflow:hidden;\"></div>\n      <div class=\"editable-box editable-text\" data-editable-box=\"핏 섹션 제목\" data-editable-text=\"핏 섹션 제목\" style=\"position:absolute; left:438px; top:316px; width:320px; font-size:42px; line-height:1.08; font-weight:900; letter-spacing:-0.04em;\">디테일 컷과 함께 실루엣을 설명하세요</div>\n      <div class=\"editable-box editable-text\" data-editable-box=\"핏 섹션 설명\" data-editable-text=\"핏 섹션 설명\" style=\"position:absolute; left:438px; top:426px; width:320px; font-size:17px; line-height:1.75; color:#475569;\">바로 옆 텍스트 박스는 클릭하면 수정되고, 드래그하면 위치를 옮길 수 있습니다. 스냅 라인도 함께 동작합니다.</div>\n    </section>\n\n    <section class=\"builder-section detail-cut editable-box\" data-builder-section=\"상세컷 섹션\" data-editable-box=\"상세컷 섹션\" data-box-lock-move=\"1\" data-box-lock-width=\"1\">\n      <div class=\"editable-box editable-text\" data-editable-box=\"상세컷 제목\" data-editable-text=\"상세컷 제목\" style=\"position:absolute; left:58px; top:54px; width:740px; text-align:center; font-size:46px; font-weight:900; letter-spacing:-0.04em;\">상세 컷을 아래로 길게 쌓아주세요</div>\n      <div class=\"image-slot editable-box\" data-image-slot=\"detail-long-1\" data-slot-label=\"긴 상세컷 1\" data-editable-box=\"긴 상세컷 1\" style=\"position:absolute; left:58px; top:146px; width:356px; height:620px; border-radius:26px; background:#f1f5f9; overflow:hidden;\"></div>\n      <div class=\"image-slot editable-box\" data-image-slot=\"detail-long-2\" data-slot-label=\"긴 상세컷 2\" data-editable-box=\"긴 상세컷 2\" style=\"position:absolute; left:446px; top:146px; width:356px; height:620px; border-radius:26px; background:#f1f5f9; overflow:hidden;\"></div>\n    </section>\n  </div>\n</body>\n</html>\n",
  "F03": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>기존 HTML 샘플</title>\n  <style>\n    * { box-sizing: border-box; }\n    body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%); color: #0f172a; }\n    .page { width: 1200px; margin: 40px auto 80px; background: white; border-radius: 28px; overflow: hidden; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12); }\n    .hero { display: grid; grid-template-columns: 1.1fr 0.9fr; min-height: 620px; }\n    .hero-copy { padding: 72px 64px; background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); display: flex; flex-direction: column; justify-content: center; }\n    .eyebrow { display: inline-block; padding: 8px 14px; border-radius: 999px; background: #fff; color: #c2410c; font-weight: 700; margin-bottom: 18px; width: fit-content; }\n    h1 { font-size: 64px; line-height: 1.05; margin: 0 0 18px; letter-spacing: -0.04em; }\n    p { font-size: 21px; line-height: 1.65; margin: 0 0 28px; color: #475569; }\n    .hero-slot-wrap { display: flex; align-items: center; justify-content: center; padding: 40px; background: #fff; }\n    .hero-image-frame { width: 100%; height: 100%; min-height: 540px; border-radius: 26px; background: #f8fafc; overflow: hidden; }\n    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding: 28px; background: #fff; }\n    .card { border-radius: 22px; overflow: hidden; border: 1px solid #e2e8f0; background: #fff; }\n    .card-image { height: 280px; background: #f1f5f9; overflow: hidden; }\n    .card-copy { padding: 18px 18px 20px; }\n    .card-copy h2 { margin: 0 0 8px; font-size: 24px; }\n    .card-copy span { color: #64748b; font-size: 15px; }\n  </style>\n</head>\n<body>\n  <div class=\"page editable-box\" data-editable-box=\"전체 페이지\">\n    <section class=\"hero editable-box\" data-editable-box=\"상단 히어로 섹션\">\n      <div class=\"hero-copy editable-box\" data-editable-box=\"왼쪽 카피 박스\">\n        <span class=\"eyebrow editable-box editable-text\" data-editable-box=\"태그\" data-editable-text=\"태그\">SPRING COLLECTION</span>\n        <h1 class=\"editable-box editable-text\" data-editable-box=\"메인 타이틀\" data-editable-text=\"메인 타이틀\">이번 시즌 메인 배너</h1>\n        <p class=\"editable-box editable-text\" data-editable-box=\"설명\" data-editable-text=\"설명\">오른쪽 큰 슬롯에 대표 이미지를 넣고, 아래 3개 슬롯에는 서브 컷을 넣어서 바로 배너 시안을 만들 수 있습니다.</p>\n      </div>\n      <div class=\"hero-slot-wrap editable-box\" data-editable-box=\"오른쪽 메인 이미지 영역\">\n        <div class=\"hero-image-frame\" data-image-slot=\"hero-main\" data-slot-label=\"메인 이미지\"></div>\n      </div>\n    </section>\n    <section class=\"grid editable-box\" data-editable-box=\"하단 카드 영역\">\n      <article class=\"card editable-box\" data-editable-box=\"카드 1\">\n        <div class=\"card-image image-slot\" data-slot-label=\"서브 이미지 1\"></div>\n        <div class=\"card-copy\">\n          <h2 class=\"editable-box editable-text\" data-editable-box=\"카드 1 제목\" data-editable-text=\"카드 1 제목\">LOOK 01</h2>\n          <span class=\"editable-box editable-text\" data-editable-box=\"카드 1 설명\" data-editable-text=\"카드 1 설명\">베스트 상품 컷</span>\n        </div>\n      </article>\n      <article class=\"card editable-box\" data-editable-box=\"카드 2\">\n        <div class=\"card-image image-slot\" data-slot-label=\"서브 이미지 2\"></div>\n        <div class=\"card-copy\">\n          <h2 class=\"editable-box editable-text\" data-editable-box=\"카드 2 제목\" data-editable-text=\"카드 2 제목\">LOOK 02</h2>\n          <span class=\"editable-box editable-text\" data-editable-box=\"카드 2 설명\" data-editable-text=\"카드 2 설명\">코디 상세 컷</span>\n        </div>\n      </article>\n      <article class=\"card editable-box\" data-editable-box=\"카드 3\">\n        <div class=\"card-image image-slot\" data-slot-label=\"서브 이미지 3\"></div>\n        <div class=\"card-copy\">\n          <h2 class=\"editable-box editable-text\" data-editable-box=\"카드 3 제목\" data-editable-text=\"카드 3 제목\">LOOK 03</h2>\n          <span class=\"editable-box editable-text\" data-editable-box=\"카드 3 설명\" data-editable-text=\"카드 3 설명\">포인트 연출 컷</span>\n        </div>\n      </article>\n    </section>\n  </div>\n</body>\n</html>\n",
  "F04": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>가벼운 마실형 D링 올인원</title>\n<style>\n  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');\n\n  :root {\n    --page-width: 860px;\n    --bg-ivory: #FDFBF7;\n    --bg-warm: #F5F3ED;\n    --bg-soft: #EEF5FA;\n    --bg-cream: #FBF3D9;\n    --bg-gray: #F2F2F2;\n    --bg-navy: #1A2B56;\n\n    --text-main: #4A3320;\n    --text-sub: #7A6959;\n    --text-light: #B5A89A;\n\n    --line: #E8E2D9;\n    --line-strong: #D6CDBF;\n\n    --point-green: #7A9A5E;\n    --point-yellow: #E8B953;\n    --point-red: #C0392B;\n    --point-blue: #5C9AD4;\n\n    --shadow-sm: 0 4px 12px rgba(74, 51, 32, 0.04);\n    --shadow-md: 0 10px 24px rgba(74, 51, 32, 0.06);\n    --shadow-lg: 0 16px 40px rgba(74, 51, 32, 0.08);\n\n    --radius-xl: 32px;\n    --radius-lg: 24px;\n    --radius-md: 16px;\n  }\n\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n  body {\n    background: #d5d5d5;\n    display: flex;\n    justify-content: center;\n    font-family: 'Pretendard', sans-serif;\n    color: var(--text-main);\n    letter-spacing: -0.02em;\n    line-height: 1.6;\n    padding: 60px 0;\n  }\n  .page {\n    width: var(--page-width);\n    background: var(--bg-ivory);\n    box-shadow: 0 25px 60px rgba(0,0,0,0.12);\n    overflow: hidden;\n  }\n\n  .section { padding: 100px 50px; position: relative; }\n  .bg-white { background: #fff; }\n  .bg-warm { background: var(--bg-warm); }\n  .bg-soft { background: var(--bg-soft); }\n  .bg-cream { background: var(--bg-cream); }\n\n  .sec-label {\n    display: inline-flex; align-items: center; justify-content: center;\n    padding: 6px 18px; border-radius: 30px;\n    font-size: 14px; font-weight: 800;\n    background: #fff; border: 1px solid var(--line-strong); color: var(--text-sub);\n    margin-bottom: 24px;\n  }\n  .sec-title {\n    font-size: 40px; line-height: 1.35; font-weight: 900;\n    letter-spacing: -0.04em; color: var(--text-main); margin-bottom: 16px;\n  }\n  .sec-desc {\n    font-size: 18px; line-height: 1.6; font-weight: 500;\n    color: var(--text-sub); word-break: keep-all;\n  }\n  .center { text-align: center; }\n\n  .ph {\n    background: #EFECE7;\n    border: 1px dashed #CFC5B6;\n    border-radius: var(--radius-md);\n    display: flex; align-items: center; justify-content: center;\n    text-align: center; color: var(--text-sub);\n    font-size: 15px; font-weight: 700; padding: 20px; line-height: 1.5;\n  }\n\n  .editorial-hero { text-align: center; }\n  .editorial-hero .badges { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin: 24px 0; }\n  .editorial-hero .badge { padding: 8px 16px; border-radius: 14px; background: #fff; border: 1px solid var(--line); font-size: 14px; font-weight: 800; color: var(--text-main); }\n  .hero-visual { height: 500px; margin-top: 24px; border-radius: var(--radius-xl); }\n\n  .bubble-wrap { display: flex; flex-direction: column; gap: 14px; margin-top: 36px; }\n  .bubble {\n    max-width: 560px; background: #fff; border: 1px solid var(--line-strong);\n    border-radius: 18px; padding: 18px 24px; box-shadow: var(--shadow-sm);\n    font-weight: 800; color: var(--text-main); font-size: 18px; line-height: 1.5;\n  }\n  .bubble.left { align-self: flex-start; border-bottom-left-radius: 4px; }\n  .bubble.right { align-self: flex-end; border-bottom-right-radius: 4px; }\n\n  .checkpoint-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 40px; }\n  .checkpoint-card { background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: 32px 24px; text-align: center; box-shadow: var(--shadow-sm); }\n  .checkpoint-card .t { font-size: 26px; font-weight: 900; line-height: 1.3; margin-bottom: 12px; color: var(--text-main); }\n  .checkpoint-card .b { font-size: 17px; line-height: 1.6; color: var(--text-sub); font-weight: 600; }\n\n  .point-hero { border-radius: var(--radius-xl); background: #fff; padding: 60px 40px; box-shadow: var(--shadow-md); margin-top: 40px; }\n  .point-hero .visual { height: 420px; margin-top: 30px; border-radius: var(--radius-lg); }\n\n  .collage-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; margin-top: 40px; }\n  .collage-col { display: flex; flex-direction: column; gap: 20px; }\n  .collage-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }\n  .c-box.xl { height: 460px; }\n  .c-box.lg { height: 280px; }\n  .c-box.md { height: 200px; }\n\n  .warn-center { text-align: center; margin-bottom: 40px; }\n  .warn-icon { width: 70px; height: 70px; border-radius: 50%; background: var(--point-red); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 40px; font-weight: 900; }\n  .warn-text { margin-top: 18px; font-size: 24px; font-weight: 900; color: var(--point-red); letter-spacing: 2px; }\n  .q-chip { margin: 0 auto 25px; width: max-content; background: #fff; border: 2px solid var(--point-red); border-radius: 30px; padding: 15px 30px; font-size: 22px; font-weight: 900; color: var(--text-main); box-shadow: var(--shadow-sm); }\n  .warn-card { margin-top: 20px; border: 1px solid var(--line); background: #fff; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); display: flex; }\n  .warn-card .img { width: 320px; height: auto; border-radius: 0; border-right: 1px solid var(--line); }\n  .warn-card .txt { padding: 34px; display: flex; flex-direction: column; justify-content: center; flex: 1; }\n  .warn-card .num { color: var(--text-light); font-size: 18px; font-weight: 900; margin-bottom: 10px; }\n  .warn-card p { margin: 0; font-size: 20px; line-height: 1.6; font-weight: 800; color: var(--text-main); }\n\n  .step-wrap { margin-top: 40px; border: 1px solid var(--line); border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-sm); background: #fff; }\n  .step-row { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--line); }\n  .step-row:first-child { border-top: none; }\n  .step-row .img { height: 300px; border-radius: 0; border-right: 1px solid var(--line); }\n  .step-row .txt { padding: 0 40px; display: flex; flex-direction: column; justify-content: center; }\n  .step-row .num { color: var(--point-yellow); font-size: 18px; font-weight: 900; margin-bottom: 12px; letter-spacing: 1px; }\n  .step-row .body { font-size: 22px; font-weight: 800; color: var(--text-main); line-height: 1.5; }\n\n  .faq { background: var(--point-yellow); padding: 80px 50px; border-radius: var(--radius-xl) var(--radius-xl) 0 0; }\n  .faq h3 { margin: 0 0 10px; text-align: center; font-size: 42px; font-weight: 900; color: var(--text-main); }\n  .faq .sub { text-align: center; color: var(--text-main); font-size: 18px; font-weight: 600; margin-bottom: 50px; }\n  .qa-row { display: flex; gap: 15px; align-items: flex-start; margin-top: 25px; }\n  .qa-row.r { justify-content: flex-end; }\n  .qa-av { width: 50px; height: 50px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; color: var(--text-main); font-size: 20px; font-weight: 900; box-shadow: var(--shadow-sm); flex-shrink: 0; }\n  .qa-bubble { max-width: 600px; background: #fff; border-radius: 24px; padding: 20px 30px; font-size: 18px; line-height: 1.6; font-weight: 700; color: var(--text-main); box-shadow: var(--shadow-sm); }\n  .qa-row.r .qa-bubble { background: var(--text-main); color: #fff; }\n\n  .guide-card { margin-top: 30px; background: #fff; border: 1px solid var(--line); border-radius: 24px; padding: 30px; box-shadow: var(--shadow-sm); }\n  .guide-card h4 { margin: 0 0 14px; font-size: 26px; font-weight: 900; }\n  .guide-card p { margin: 0; color: var(--text-sub); font-size: 18px; line-height: 1.7; font-weight: 600; }\n\n  .wash { padding: 70px 50px; background: var(--bg-ivory); border-bottom: 1px solid var(--line); }\n  .wash h3 { margin: 0 0 24px; font-size: 32px; font-weight: 900; }\n  .wash ul { margin: 0; padding-left: 20px; color: var(--text-sub); line-height: 1.8; font-size: 16px; font-weight: 600; }\n\n  .info { background: #fff; padding: 80px 50px; border-radius: 0 0 var(--radius-xl) var(--radius-xl); border: 1px solid var(--line); border-top: none; }\n  .info h3 { margin: 0 0 30px; color: var(--text-main); font-size: 32px; font-weight: 900; }\n  .info-table { width: 100%; border-collapse: collapse; border-top: 2px solid var(--text-main); }\n  .info-table td { padding: 20px 10px; font-size: 16px; line-height: 1.6; border-bottom: 1px solid var(--line); }\n  .info-table td:first-child { width: 160px; color: var(--text-main); font-weight: 800; }\n  .info-table td:last-child { color: var(--text-sub); font-weight: 600; }\n\n  .cta-banner { background: var(--bg-navy); border-radius: var(--radius-xl); padding: 50px; display: flex; align-items: center; justify-content: space-between; box-shadow: var(--shadow-lg); }\n  .cta-banner .tit { color: #fff; font-size: 50px; line-height: 1.2; letter-spacing: -0.03em; font-weight: 900; margin-bottom: 15px; }\n  .cta-banner .sub { color: rgba(255,255,255,.8); font-size: 18px; font-weight: 500; margin-bottom: 30px; }\n  .cta-btn { display: inline-flex; align-items: center; gap: 10px; background: var(--point-yellow); color: var(--text-main); border-radius: 30px; padding: 16px 32px; font-size: 20px; font-weight: 900; text-decoration: none; }\n  .cta-char { width: 220px; height: 220px; border-radius: 50%; background: rgba(255,255,255,.1); display: flex; align-items: center; justify-content: center; font-weight: 900; border: 1px dashed rgba(255,255,255,0.3); color: #fff; font-size: 15px; text-align: center; }\n</style>\n</head>\n<body>\n\n<div class=\"page\">\n  <section class=\"section bg-white\">\n    <div class=\"editorial-hero\">\n      <div class=\"sec-label\">가벼운 마실형</div>\n      <div class=\"sec-title\">가볍게 입히고<br>바로 나가는 올인원</div>\n      <div class=\"sec-desc\">짧고 잦은 산책이 많은 노령견에게, 덧입힘 부담을 줄인 가벼운 외출복.</div>\n      <div class=\"badges\">\n        <div class=\"badge\">똑딱 앞단추</div>\n        <div class=\"badge\">일체형 D링</div>\n        <div class=\"badge\">뒷다리 밴딩</div>\n        <div class=\"badge\">실내-마실 루틴</div>\n      </div>\n      <div class=\"ph hero-visual\">[이미지] 정면 또는 45도 정면 풀착용컷<br>(D링과 전체 핏이 함께 보이는 밝은 야외 산책 컷)</div>\n    </div>\n  </section>\n\n  <section class=\"section bg-warm\">\n    <div class=\"center\">\n      <div class=\"sec-label\">산책 준비</div>\n      <div class=\"sec-title\">짧게 나갈 때마다<br>또 챙기기 번거롭죠</div>\n      <div class=\"sec-desc\">노령견 산책은 자주 짧게. 그래서 준비도 무리 없이 끝나야 합니다.</div>\n    </div>\n    <div class=\"bubble-wrap\">\n      <div class=\"bubble left\">“집 앞 한 바퀴인데 하네스까지 다시 챙기려니 손이 두 번 가요.”</div>\n      <div class=\"bubble right\">“여러 겹 입히는 날보다, 가볍게 입고 바로 나가는 날이 루틴이 더 편해져요.”</div>\n    </div>\n  </section>\n\n  <section class=\"section bg-soft\">\n    <div class=\"center\">\n      <div class=\"sec-label\">CHECK POINT</div>\n      <div class=\"sec-title\">가볍게 나가기 좋은<br>네 가지 이유</div>\n    </div>\n    <div class=\"checkpoint-grid\">\n      <div class=\"checkpoint-card\">\n        <div class=\"t\">앞단추 오픈</div>\n        <div class=\"b\">입히는 시간을 짧게</div>\n      </div>\n      <div class=\"checkpoint-card\">\n        <div class=\"t\">일체형 D링</div>\n        <div class=\"b\">연결하면 바로 출발</div>\n      </div>\n      <div class=\"checkpoint-card\">\n        <div class=\"t\">뒷다리 밴딩</div>\n        <div class=\"b\">말림과 들뜸 완화</div>\n      </div>\n      <div class=\"checkpoint-card\">\n        <div class=\"t\">가벼운 원단감</div>\n        <div class=\"b\">실내부터 집 앞까지</div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-white\">\n    <div class=\"point-hero center\">\n      <div class=\"sec-label\">POINT 1</div>\n      <div class=\"sec-title\">입히기 편한 앞단추</div>\n      <div class=\"sec-desc\">앞가슴 단추 구조라 여닫는 과정이 간단해, 산책 전 손이 덜 갑니다.</div>\n      <div class=\"ph visual\">[이미지/영상] 앞가슴 단추를 가볍게 열고 닫는 손 클로즈업 컷</div>\n    </div>\n  </section>\n\n  <section class=\"section bg-warm\">\n    <div class=\"point-hero center\" style=\"box-shadow: none; border: 1px solid var(--line);\">\n      <div class=\"sec-label\">POINT 2</div>\n      <div class=\"sec-title\">덧입힘 없는 출발</div>\n      <div class=\"sec-desc\">짧고 차분한 산책은 리드줄만 연결해, 하네스를 한 번 더 덧입히는 번거로움을 줄일 수 있어요.</div>\n      <div class=\"ph visual\">[이미지] 등판 D링에 리드줄을 연결하는 근접 컷 + 출발 직전 강아지의 뒷모습</div>\n    </div>\n  </section>\n\n  <section class=\"section bg-white\">\n    <div class=\"point-hero center\">\n      <div class=\"sec-label\">POINT 3</div>\n      <div class=\"sec-title\">들뜸을 덜어주는 밴딩</div>\n      <div class=\"sec-desc\">뒷다리 밴딩 디테일이 걷는 동안 옷이 말리거나 붕 뜨는 느낌을 줄여줍니다.</div>\n      <div class=\"ph visual\">[이미지] 걷는 옆모습 (후면 3/4 컷) 및 뒷다리 밴딩 부분 클로즈업</div>\n    </div>\n  </section>\n\n  <section class=\"section bg-cream\">\n    <div class=\"sec-label\">DETAILS</div>\n    <div class=\"sec-title\">디테일이 살아야<br>매일 손이 갑니다</div>\n    <div class=\"sec-desc\">보기 좋은 것에서 끝나지 않고, 자주 입히는 루틴까지 생각한 포인트들입니다.</div>\n    <div class=\"collage-grid\">\n      <div class=\"collage-col\">\n        <div class=\"ph c-box xl\">[이미지] 등 위 D링이 바로 보이는 후면 구조 (메인)</div>\n        <div class=\"collage-row\">\n          <div class=\"ph c-box md\">[이미지] 기린 캐릭터 포인트</div>\n          <div class=\"ph c-box md\">[이미지] 하의 마감과 꼬리 오픈</div>\n        </div>\n      </div>\n      <div class=\"collage-col\">\n        <div class=\"ph c-box lg\">[이미지] 뒷다리 밴딩 착용핏</div>\n        <div class=\"ph c-box md\">[이미지] 앞가슴 단추 오픈 디테일</div>\n        <div class=\"ph c-box md\">[이미지] 가벼운 골지 원단 결</div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-white\">\n    <div class=\"warn-center\">\n      <div class=\"warn-icon\">!</div>\n      <div class=\"warn-text\">CHECK POINT</div>\n    </div>\n    <div class=\"q-chip\">이런 산책에는 맞지 않아요</div>\n\n    <div class=\"warn-card\">\n      <div class=\"ph img\">[이미지] 줄을 강하게 당기며 앞서나가는 견인 산책 연출컷 (흑백/톤다운)</div>\n      <div class=\"txt\">\n        <div class=\"num\">Check 01</div>\n        <p>갑자기 튀어나가거나 줄을 강하게 당기는 아이에게는 이 제품만으로 산책하는 것을 권하지 않습니다.</p>\n      </div>\n    </div>\n    <div class=\"warn-card\">\n      <div class=\"ph img\">[이미지] 사람이 많은 복잡한 거리나 장시간 외출하는 연출컷 (흑백/톤다운)</div>\n      <div class=\"txt\">\n        <div class=\"num\">Check 02</div>\n        <p>사람 많은 길, 장시간 외출, 통제가 중요한 산책이라면 전용 하네스형 제품이 더 잘 맞을 수 있어요.</p>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-soft\">\n    <div class=\"sec-label\">HOW TO WEAR</div>\n    <div class=\"sec-title\">준비를 줄이고<br>바로 집 앞으로</div>\n\n    <div class=\"step-wrap\">\n      <div class=\"step-row\">\n        <div class=\"ph img\">[이미지] 앞단추를 열고 강아지에게 입히는 첫 단계 컷</div>\n        <div class=\"txt\">\n          <div class=\"num\">STEP 01</div>\n          <div class=\"body\">앞단추를 열고 아이의 앞가슴과 다리 위치를 편하게 맞춰주세요.</div>\n        </div>\n      </div>\n      <div class=\"step-row\">\n        <div class=\"ph img\">[이미지] 앞가슴 똑딱 단추를 잠그는 손 클로즈업</div>\n        <div class=\"txt\">\n          <div class=\"num\">STEP 02</div>\n          <div class=\"body\">앞가슴 단추를 순서대로 잠가 몸에 무리 없이 핏을 맞춰주세요.</div>\n        </div>\n      </div>\n      <div class=\"step-row\">\n        <div class=\"ph img\">[이미지] 등판 D링에 리드줄을 찰칵 연결하는 컷</div>\n        <div class=\"txt\">\n          <div class=\"num\">STEP 03</div>\n          <div class=\"body\">등 위 D링에 리드줄을 연결하면 가벼운 산책 준비가 끝납니다.</div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-white\" style=\"padding-bottom: 0;\">\n    <div class=\"faq\">\n      <h3>QUESTIONS</h3>\n      <div class=\"sub\">구매 전에 많이 묻는 내용만 먼저 정리했어요.</div>\n\n      <div class=\"qa-row\">\n        <div class=\"qa-av\">Q</div>\n        <div class=\"qa-bubble\">이 제품만으로 산책해도 되나요?</div>\n      </div>\n      <div class=\"qa-row r\">\n        <div class=\"qa-av\">A</div>\n        <div class=\"qa-bubble\">짧고 차분한 집 앞 산책이라면 일체형 D링을 바로 연결해 사용할 수 있습니다. 다만 갑자기 튀거나 강하게 당기는 아이에게는 전용 하네스형 제품을 권합니다.</div>\n      </div>\n\n      <div class=\"qa-row\">\n        <div class=\"qa-av\">Q</div>\n        <div class=\"qa-bubble\">노령견에게 왜 잘 맞나요?</div>\n      </div>\n      <div class=\"qa-row r\">\n        <div class=\"qa-av\">A</div>\n        <div class=\"qa-bubble\">짧게 자주 나가는 루틴에서 입히는 과정과 준비 단계를 줄여주기 때문입니다. 산책 전 스트레스를 덜고 싶은 아이에게 잘 어울립니다.</div>\n      </div>\n\n      <div class=\"qa-row\">\n        <div class=\"qa-av\">Q</div>\n        <div class=\"qa-bubble\">실내에서도 입혀둘 수 있나요?</div>\n      </div>\n      <div class=\"qa-row r\">\n        <div class=\"qa-av\">A</div>\n        <div class=\"qa-bubble\">두껍게 방한하는 타입보다는 가벼운 마실형에 가깝습니다. 실내 적응 후 집 앞 산책으로 이어지는 루틴에 활용해 주세요.</div>\n      </div>\n    </div>\n\n    <div class=\"guide-card\">\n      <h4>GUIDE</h4>\n      <p>가슴둘레와 등길이를 먼저 확인해 주세요. 털이 많은 아이는 여유 핏을 함께 체크하면 더 편안합니다.</p>\n    </div>\n\n    <div class=\"wash\">\n      <h3>CAUTION</h3>\n      <ul>\n        <li>심한 당김이나 도약이 많은 산책용으로는 권장하지 않습니다.</li>\n        <li>외출 전 D링과 단추가 제대로 잠겼는지 한 번 더 확인해 주세요.</li>\n        <li>사이즈가 크면 걷는 동안 말림이나 들뜸이 생길 수 있습니다.</li>\n        <li>장시간 외출이나 훈련용은 전용 하네스형 제품이 더 적합할 수 있습니다.</li>\n      </ul>\n    </div>\n\n    <div class=\"info\">\n      <h3>INFORMATION</h3>\n      <table class=\"info-table\">\n        <tr><td>제품명</td><td>가벼운 마실형 D링 올인원</td></tr>\n        <tr><td>활용 상황</td><td>실내 적응 후 집 앞 짧은 산책</td></tr>\n        <tr><td>핵심 디테일</td><td>앞단추 오픈 · 일체형 D링 · 뒷다리 밴딩</td></tr>\n        <tr><td>권장 대상</td><td>짧게 자주 걷는 소형 노령견</td></tr>\n        <tr><td>비권장 대상</td><td>갑자기 튀거나 줄을 심하게 당기는 강아지</td></tr>\n      </table>\n    </div>\n  </section>\n\n  <section class=\"section bg-white\" style=\"padding-top: 40px; padding-bottom: 120px;\">\n    <div class=\"cta-banner\">\n      <div>\n        <div class=\"tit\">가벼운 마실형<br>D링 올인원</div>\n        <div class=\"sub\">똑딱 단추로 입히고, 리드줄만 연결해 바로 나가는 데일리 산책복.</div>\n        <a href=\"#\" class=\"cta-btn\">제품 보러가기 <span>›</span></a>\n      </div>\n      <div class=\"cta-char\">[이미지]<br>가장 귀엽고 밝은<br>전신 컷 1장 누끼</div>\n    </div>\n  </section>\n</div>\n\n</body>\n</html>\n",
  "F05": "<!DOCTYPE html>\n<html lang=\"ko\">\n<head>\n<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n<title>멜팅치즈 세라믹 식기 세트 모바일 상세페이지 (컴팩트 버전)</title>\n<style>\n@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');\n\n:root {\n  --page-width: 860px;\n  --bg-ivory: #FFFDF8;\n  --bg-cream: #FFF8E1;\n  --bg-soft: #FFFDF8;\n  --bg-warm: #FFF5D1;\n  --bg-card: #FFFFFF;\n  \n  --butter: #FFD54F;\n  --butter-deep: #FFC107;\n  \n  --text-main: #4A3320;\n  --text-sub: #7A6959;\n  --text-light: #AC9F91;\n  \n  --line: #FFE082;\n  --line-strong: #FFD54F;\n  \n  --brick: #FF8F00;\n  --brick-soft: #FFB300;\n  --brown: #5D4037;\n  \n  --shadow-sm: 0 8px 20px rgba(255, 193, 7, 0.12);\n  --shadow-md: 0 16px 36px rgba(255, 193, 7, 0.15);\n}\n\n* { box-sizing: border-box; margin: 0; padding: 0; }\nhtml, body { width: 100%; background: #EFEFEF; display: flex; justify-content: center; font-family: 'Pretendard', sans-serif; color: var(--text-main); letter-spacing: -0.03em; }\nimg { display: block; width: 100%; height: auto; }\n\n.page { width: var(--page-width); background: var(--bg-ivory); overflow: hidden; box-shadow: 0 0 30px rgba(0,0,0,.1); }\n\n/* 압축된 여백 */\n.section { padding: 90px 40px; position: relative; }\n.bg-cream { background: var(--bg-cream); }\n.bg-warm { background: var(--bg-warm); }\n.bg-ivory { background: var(--bg-ivory); }\n.bg-soft { background: var(--bg-soft); }\n.center { text-align: center; }\n\n/* 폰트 스케일 압축 (가독성은 유지) */\n.sec-label { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 24px; border-radius: 999px; font-size: 20px; font-weight: 900; color: var(--brown); background: var(--butter); border: 2px solid var(--line-strong); letter-spacing: .05em; margin-bottom: 20px; box-shadow: var(--shadow-sm); }\n.sec-title { font-size: 46px; line-height: 1.35; font-weight: 900; color: var(--text-main); letter-spacing: -0.04em; margin-bottom: 24px; word-break: keep-all; }\n.sec-desc { font-size: 24px; line-height: 1.6; color: var(--text-sub); font-weight: 600; word-break: keep-all; }\n\n/* 플레이스홀더 */\n.media-shell { position: relative; overflow: hidden; border-radius: 32px; border: 3px dashed var(--line-strong); background: var(--bg-cream); display:flex; align-items:center; justify-content:center; color: var(--brick); font-weight: 800; font-size: 22px; text-align: center; padding: 24px; }\n\n/* 1. HERO */\n.hero { padding: 100px 40px 80px; text-align: center; background: linear-gradient(180deg, #FFFDF8 0%, #FFF8E1 100%); }\n.hero h1 { margin: 24px 0 20px; font-size: 60px; line-height: 1.25; letter-spacing: -0.05em; font-weight: 1000; color: var(--text-main); word-break: keep-all; }\n.hero p { font-size: 24px; line-height: 1.6; font-weight: 600; color: var(--text-sub); word-break: keep-all; }\n.hero-shot { margin-top: 40px; height: 500px; border-style: solid; box-shadow: var(--shadow-md); }\n\n/* 2. SET OPTIONS (컴팩트 스택) */\n.option-list { display: flex; flex-direction: column; gap: 24px; margin-top: 40px; }\n.option-card { display: flex; flex-direction: column; background: var(--bg-card); border: 3px solid var(--line-strong); border-radius: 32px; padding: 36px; box-shadow: var(--shadow-sm); }\n.opt-thumb { height: 360px; border-radius: 20px; border-style: solid; margin-bottom: 24px; order: -1; }\n.opt-badge { display: inline-flex; align-items: center; min-height: 36px; padding: 0 16px; border-radius: 999px; background: var(--bg-warm); color: var(--brick); font-size: 18px; font-weight: 900; letter-spacing: .06em; margin-bottom: 16px; }\n.opt-title { font-size: 34px; line-height: 1.35; font-weight: 900; color: var(--text-main); margin-bottom: 16px; word-break: keep-all; }\n.opt-title span.sub { display: block; font-size: 22px; color: var(--text-sub); font-weight: 700; margin-top: 8px; }\n.opt-price { display: flex; align-items: baseline; gap: 12px; margin-top: 10px; }\n.opt-price .origin { font-size: 24px; font-weight: 700; color: var(--text-light); text-decoration: line-through; }\n.opt-price .final { font-size: 48px; line-height: 1; font-weight: 1000; color: var(--brick); }\n.opt-price .percent { display: inline-flex; align-items: center; justify-content: center; height: 38px; padding: 0 12px; background: var(--brick); color: #fff; border-radius: 10px; font-size: 24px; font-weight: 900; transform: translateY(-4px); }\n\n/* 3. INTRO NARRATIVE */\n.intro-q { font-size: 40px; font-weight: 900; color: var(--text-main); margin-bottom: 30px; line-height: 1.4; word-break: keep-all; }\n.intro-desc { font-size: 24px; font-weight: 600; color: var(--text-sub); line-height: 1.6; margin-bottom: 40px; word-break: keep-all; }\n.intro-bridge { font-size: 32px; font-weight: 900; color: var(--brick); margin-bottom: 40px; line-height: 1.5; word-break: keep-all; }\n.intro-box { background: var(--bg-cream); border: 3px solid var(--line-strong); border-radius: 32px; padding: 40px 30px; box-shadow: var(--shadow-sm); }\n.intro-box-kicker { font-size: 24px; font-weight: 900; color: var(--brick-soft); margin-bottom: 16px; }\n.intro-box-title { font-size: 36px; font-weight: 900; color: var(--text-main); margin-bottom: 30px; line-height: 1.4; word-break: keep-all; }\n.intro-bubbles { display: flex; flex-direction: column; gap: 16px; }\n.intro-bubble { background: #fff; border-radius: 999px; padding: 18px 24px; font-size: 22px; font-weight: 800; color: var(--text-main); border: 2px solid var(--line); box-shadow: var(--shadow-sm); text-align: center; word-break: keep-all; }\n\n/* COLOR MATCH SECTION (톤온톤 컬러 소개) */\n.color-wrap { margin-top: 24px; display: flex; flex-direction: column; gap: 20px; }\n.color-card { \n  display: flex; align-items: center; gap: 30px; \n  background: var(--bg-card); border: 3px solid var(--line); \n  border-radius: 32px; padding: 30px; box-shadow: var(--shadow-sm); \n}\n.color-circle { \n  width: 100px; height: 100px; border-radius: 50%; flex-shrink: 0; \n  border: 3px solid rgba(0,0,0,0.05); box-shadow: inset 0 6px 12px rgba(0,0,0,0.1);\n}\n.color-info { text-align: left; }\n.color-name { font-size: 32px; font-weight: 900; color: var(--text-main); margin-bottom: 8px; }\n.color-mat { font-size: 22px; font-weight: 600; color: var(--text-sub); }\n\n/* 4. SAFE MATERIAL (BA + 세라믹 스펙) */\n.ba-wrap { display: flex; flex-direction: column; gap: 24px; margin-top: 40px; }\n.ba-card { background: #fff; border-radius: 32px; overflow: hidden; border: 3px solid var(--line); box-shadow: var(--shadow-sm); position: relative; }\n.ba-badge { position: absolute; top: 20px; left: 20px; z-index: 10; padding: 8px 20px; border-radius: 999px; font-size: 20px; font-weight: 900; color: #fff; box-shadow: var(--shadow-md); }\n.ba-badge.before { background: #AC9F91; }\n.ba-badge.after { background: var(--brick); }\n.ba-desc { padding: 24px; text-align: center; font-size: 24px; font-weight: 800; color: var(--text-main); word-break: keep-all; line-height: 1.5; }\n.ceramic-benefits { display: flex; flex-direction: column; gap: 16px; margin-top: 40px; }\n.ceramic-benefits .c-badge { display: flex; align-items: flex-start; padding: 24px; background: #fff; border: 3px solid var(--line-strong); border-radius: 24px; font-size: 22px; font-weight: 600; color: var(--text-main); box-shadow: var(--shadow-sm); line-height: 1.5; word-break: keep-all; }\n.ceramic-benefits .c-badge .icon { font-size: 32px; margin-right: 16px; flex-shrink: 0; }\n.ceramic-benefits .c-badge strong { font-weight: 900; color: var(--brick); }\n\n/* 5. SYNERGY SET (3코어 요약) */\n.set-grid { display: flex; flex-direction: column; gap: 24px; margin-top: 40px; }\n.set-item { padding: 30px; border-radius: 32px; border: 3px solid var(--line); background: #fff; box-shadow: var(--shadow-sm); text-align: center; }\n.set-item .thumb { height: 320px; border-radius: 20px; border-style: solid; margin-bottom: 24px; }\n.set-item .name { font-size: 28px; line-height: 1.4; font-weight: 900; color: var(--text-main); word-break: keep-all; }\n\n/* 6. CHECK POINT (4포인트 스택) */\n.checkpoint-grid { display: flex; flex-direction: column; gap: 20px; margin-top: 40px; }\n.checkpoint-card { text-align: left; padding: 36px 30px; border-radius: 32px; background: var(--bg-card); border: 3px solid var(--line); box-shadow: var(--shadow-sm); }\n.checkpoint-card .k { display:inline-block; font-size: 20px; font-weight: 900; color: var(--brick); background: var(--bg-cream); padding: 6px 18px; border-radius: 999px; margin-bottom: 16px; }\n.checkpoint-card .t { font-size: 32px; line-height: 1.35; font-weight: 900; color: var(--text-main); margin-bottom: 16px; word-break: keep-all; }\n.checkpoint-card .b { font-size: 22px; line-height: 1.6; font-weight: 600; color: var(--text-sub); word-break: keep-all;}\n\n/* 7. POINT DEEP DIVE */\n.point-hero { text-align: center; }\n.point-hero .visual { margin-top: 36px; height: 480px; border-style: solid; box-shadow: var(--shadow-md); border-radius: 32px; }\n\n/* 8. FAQ CHAT */\n.chat-wrap { margin-top: 40px; display: flex; flex-direction: column; gap: 20px; }\n.chat-row { display: flex; align-items: flex-start; gap: 16px; }\n.chat-row.right { flex-direction: row-reverse; }\n.chat-avatar { flex: 0 0 64px; width: 64px; height: 64px; border-radius: 50%; background: var(--butter); border: 3px solid var(--butter-deep); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 1000; color: var(--brown); box-shadow: var(--shadow-sm); }\n.chat-content { max-width: 80%; display: flex; flex-direction: column; gap: 8px; }\n.chat-row.right .chat-content { align-items: flex-end; }\n.chat-name { font-size: 20px; font-weight: 900; color: var(--text-light); }\n.chat-bubble { padding: 20px 24px; border-radius: 28px; background: #fff; border: 2px solid var(--line); color: var(--text-main); font-size: 22px; line-height: 1.6; font-weight: 600; box-shadow: var(--shadow-sm); word-break: keep-all; }\n.chat-row.right .chat-bubble { background: var(--bg-warm); border-color: var(--line-strong); }\n\n/* 9. INFORMATION TABLE */\n.hb-info-wrap { padding: 80px 40px; background: #fff; }\n.hb-info-head { display: flex; align-items: center; justify-content: center; min-height: 80px; border-radius: 24px; background: var(--butter-deep); color: var(--text-main); font-size: 32px; font-weight: 1000; letter-spacing: .05em; margin-bottom: 30px; box-shadow: var(--shadow-sm); }\n.hb-table { width: 100%; border-collapse: collapse; border-radius: 24px; overflow: hidden; border: 3px solid var(--line-strong); }\n.hb-table tr { display: block; border-bottom: 3px solid var(--line-strong); }\n.hb-table tr:last-child { border-bottom: none; }\n.hb-table th, .hb-table td { display: block; width: 100%; padding: 24px; font-size: 22px; line-height: 1.6; text-align: left; }\n.hb-table th { background: var(--bg-cream); font-weight: 900; color: var(--brown); }\n.hb-table td { background: #fff; font-weight: 600; color: var(--text-main); }\n.hb-table ol { margin-left: 24px; display: flex; flex-direction: column; gap: 8px; }\n\n/* 10. FINALE CTA */\n.finale-mascot .badge { width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: #fff; border: 3px solid var(--line-strong); box-shadow: var(--shadow-md); font-size: 50px; margin: 0 auto 30px; }\n.finale-btn { margin-top: 40px; display: inline-flex; align-items: center; justify-content: center; gap: 12px; width: 100%; min-height: 84px; border-radius: 999px; background: var(--brick-soft); color: #fff; text-decoration: none; font-size: 32px; font-weight: 1000; letter-spacing: -0.02em; box-shadow: 0 16px 30px rgba(255, 143, 0, 0.25); }\n</style>\n</head>\n<body>\n<div class=\"page\">\n\n  <section class=\"hero\">\n    <div class=\"sec-label\">소형·노령견 맞춤 케어</div>\n    <h1>치즈처럼 귀엽게,<br/>식사는 더 편안하게</h1>\n    <p>\n      11.5cm 높은 밥그릇과 넓은 물그릇, 정리가 쉬운 옐로우 매트까지.<br/>\n      반려견의 관절건강과 위생, 집안 인테리어까지 고려한 세라믹 식기 세트\n    </p>\n    <div class=\"hero-shot media-shell\">\n      [이미지 삽입부]<br/>전체 세트 연출 컷\n    </div>\n  </section>\n\n  <section class=\"section bg-warm\" id=\"option-top\">\n    <div class=\"center\">\n      <div class=\"sec-label\">SET OPTIONS</div>\n      <div class=\"sec-title\">원하는 구성으로<br/>고르세요</div>\n    </div>\n    <div class=\"option-list\">\n      <div class=\"option-card\">\n        <div class=\"opt-thumb media-shell\">\n          [이미지 삽입부]<br/>단품 썸네일\n        </div>\n        <div>\n          <div class=\"opt-badge\">OPTION 01</div>\n          <div class=\"opt-title\">높은 밥그릇 단품</div>\n          <div class=\"opt-price\">\n            <span class=\"origin\">17,800원</span>\n            <span class=\"final\">12,800원</span>\n            <span class=\"percent\">28%</span>\n          </div>\n        </div>\n      </div>\n      <div class=\"option-card\">\n        <div class=\"opt-thumb media-shell\">\n          [이미지 삽입부]<br/>풀세트 썸네일\n        </div>\n        <div>\n          <div class=\"opt-badge\">OPTION 02</div>\n          <div class=\"opt-title\">멜팅치즈 풀세트<span class=\"sub\">(밥그릇 + 물그릇 + 패드)</span></div>\n          <div class=\"opt-price\">\n            <span class=\"origin\">34,800원</span>\n            <span class=\"final\">24,800원</span>\n            <span class=\"percent\">28%</span>\n          </div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-ivory\">\n    <div class=\"center\">\n      <div class=\"intro-q\">매일 먹는 밥과 물,<br/>노령 소형견에게<br/>진짜로 편안할까요?</div>\n      <div class=\"intro-desc\">\n        너무 낮은 식기는 목 관절에 부담을 주어,<br/>켁켁거림이나 관절 문제를 유발할 수 있습니다.<br/><br/>\n        가볍고 좁은 물 그릇은 쉽게 엎지르고,<br/>사방에 물이 튀어 주변이 금방 지저분해지기 쉽죠.<br/><br/>\n        \"흘려도 괜찮아요\" 노란 매트가 주변 정리를 도와주어 매일 위생적인 식사 환경을 유지해 줍니다.\n      </div>\n      <div class=\"intro-bridge\">\n        노령견의 건강, 위생, 보호자의 편의성 까지 한번에 챙겼어요.<br/>\n        이쁜데, 깨끗하고, 편한, 멜팅 치즈 식기세트\n      </div>\n      <div class=\"intro-box\">\n        <div class=\"intro-box-kicker\">단순히 귀여운 그릇이 아닙니다</div>\n        <div class=\"intro-box-title\">높이, 넓이, 동선까지<br/>완벽하게 챙긴 세트</div>\n        <div class=\"intro-bubbles\">\n          <div class=\"intro-bubble\">목 관절을 보호하는 11.5cm 맞춤 높이</div>\n          <div class=\"intro-bubble\">물 튈 걱정 없는 넉넉한 와이드 입구</div>\n          <div class=\"intro-bubble\">청소가 1초면 끝나는 위생 매트</div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-ivory\">\n    <div class=\"center\">\n      <div class=\"sec-label\">COLOR MATCH</div>\n      <div class=\"sec-title\">치즈와 꼭 닮은<br/>기분 좋은 옐로우</div>\n      <div class=\"sec-desc\">\n        치즈 색상의 세라믹 식기와 밝은 노란색 매트.<br/>\n        공간을 환하게 밝히는 따뜻한 톤온톤 배색입니다.\n      </div>\n    </div>\n    \n    <div class=\"media-shell\" style=\"height: 480px; margin-top: 40px; border-radius: 32px; border-style: solid; box-shadow: var(--shadow-sm); padding: 0;\">\n      <img src=\"uploaded:Gemini_Generated_Image_fw20axfw20axfw20 (1).png\" alt=\"식기와 매트의 컬러 매치\" style=\"object-fit: cover;\" />\n    </div>\n\n    <div class=\"color-wrap\">\n      <div class=\"color-card\">\n        <div class=\"color-circle\" style=\"background: #FFB300;\"></div>\n        <div class=\"color-info\">\n          <div class=\"color-name\">멜팅 치즈</div>\n          <div class=\"color-mat\">세라믹 식기 색상</div>\n        </div>\n      </div>\n      <div class=\"color-card\">\n        <div class=\"color-circle\" style=\"background: #FFE082;\"></div>\n        <div class=\"color-info\">\n          <div class=\"color-name\">브라이트 옐로우</div>\n          <div class=\"color-mat\">실리콘 매트 색상</div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-soft\">\n    <div class=\"center\">\n      <div class=\"sec-label\">SAFE MATERIAL</div>\n      <div class=\"sec-title\">표면의 차이가<br/>위생의 차이입니다</div>\n      <div class=\"sec-desc\">미세한 흠집 사이로 세균이 번식하는 일반 식기와 달리, 고온에서 구운 세라믹은 압도적으로 매끄럽고 청결합니다.</div>\n    </div>\n    \n    <div class=\"ba-wrap\">\n      <div class=\"ba-card\">\n        <div class=\"ba-badge before\">플라스틱 / 스텐</div>\n        <div class=\"media-shell\" style=\"height: 300px; border:none; border-radius:0;\">\n          [이미지 삽입부]<br/>스크래치 표면 확대 컷\n        </div>\n        <div class=\"ba-desc\">스크래치 틈으로 스며든 찌꺼기가<br/>냄새와 턱드름을 유발합니다.</div>\n      </div>\n      <div class=\"ba-card\" style=\"border-color: var(--brick-soft);\">\n        <div class=\"ba-badge after\">멜팅치즈 세라믹</div>\n        <div class=\"media-shell\" style=\"height: 300px; border:none; border-radius:0; background:#fff;\">\n          [이미지 삽입부]<br/>매끄러운 세라믹 표면 컷\n        </div>\n        <div class=\"ba-desc\" style=\"color: var(--brick);\">고온 소성으로 표면을 완벽히 코팅해<br/>세균 번식을 원천 차단합니다.</div>\n      </div>\n    </div>\n    \n    <div class=\"ceramic-benefits\">\n      <div class=\"c-badge\">\n        <span class=\"icon\">🔥</span>\n        <div>정제된 도토(陶土)를 800℃ 1차 소성 후, <strong>1300~1400℃의 고온에서 2차 소성</strong>한 최고급 세라믹입니다.</div>\n      </div>\n      <div class=\"c-badge\">\n        <span class=\"icon\">✨</span>\n        <div>미세 스크래치는 <strong>치약으로 가볍게 문질러</strong> 얼룩을 닦아내고 새것처럼 관리할 수 있습니다.</div>\n      </div>\n      <div class=\"c-badge\">\n        <span class=\"icon\">🧼</span>\n        <div>열탕 소독 및 식기세척기 사용이 가능하며, <strong>pH 11~11.5 사이의 세제 사용을 권장</strong>합니다.</div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-cream\">\n    <div class=\"center\">\n      <div class=\"sec-label\">완벽한 시너지</div>\n      <div class=\"sec-title\">밥과 물을 나누면<br/>식사 자리가 차분해집니다</div>\n    </div>\n    <div class=\"set-grid\">\n      <div class=\"set-item\">\n        <div class=\"thumb media-shell\">[이미지 삽입부]<br/>높은 밥그릇</div>\n        <div class=\"name\">관절에 무리 없는<br/>높은 밥그릇</div>\n      </div>\n      <div class=\"set-item\">\n        <div class=\"thumb media-shell\">[이미지 삽입부]<br/>넓은 물그릇</div>\n        <div class=\"name\">쏟을 걱정 없는<br/>넉넉한 물그릇</div>\n      </div>\n      <div class=\"set-item\">\n        <div class=\"thumb media-shell\">[이미지 삽입부]<br/>옐로우 매트</div>\n        <div class=\"name\">청소가 쉬워지는<br/>위생적인 옐로우 매트</div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-ivory\">\n    <div class=\"center\">\n      <div class=\"sec-label\">핵심 포인트</div>\n      <div class=\"sec-title\">멜팅치즈 식기,<br/>무엇이 특별할까요?</div>\n    </div>\n    <div class=\"checkpoint-grid\">\n      <div class=\"checkpoint-card\">\n        <div class=\"k\">POINT 1</div>\n        <div class=\"t\">목 관절에 좋은<br/>11.5cm 맞춤 높이</div>\n        <div class=\"b\">바닥에 바짝 엎드리지 않아 식도 막힘과 관절 부담을 크게 줄여줍니다.</div>\n      </div>\n      <div class=\"checkpoint-card\">\n        <div class=\"k\">POINT 2</div>\n        <div class=\"t\">사각지대 없는<br/>둥근 곡면 구조</div>\n        <div class=\"b\">안쪽을 완만한 호형 곡면으로 마감해 사료가 자연스럽게 가운데로 모입니다.</div>\n      </div>\n      <div class=\"checkpoint-card\">\n        <div class=\"k\">POINT 3</div>\n        <div class=\"t\">밀리지 않는<br/>묵직한 세라믹 바디</div>\n        <div class=\"b\">묵직한 무게와 넓은 하부 덕분에 열정적으로 먹어도 그릇이 도망가지 않습니다.</div>\n      </div>\n      <div class=\"checkpoint-card\">\n        <div class=\"k\">POINT 4</div>\n        <div class=\"t\">쏟을 걱정 없는<br/>넓은 입구의 물그릇</div>\n        <div class=\"b\">넉넉한 와이드 설계와 안정적인 디자인으로 물 튀김을 막아줍니다.</div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-soft\">\n    <div class=\"point-hero center\">\n      <div class=\"sec-label\">편안한 식사 구조</div>\n      <div class=\"sec-title\">목관절에 딱 좋은<br/>11.5cm 맞춤 높이</div>\n      <div class=\"sec-desc\">\n        고개를 바닥까지 푹 숙이는 자세는 관절에 무리를 줍니다. 체형을 고려해 입구를 11.5cm 위로 올려, 켁켁거림 없이 편안하게 식사할 수 있도록 설계했습니다.<br>\n        바닥 그릇보다 입구가 위로 올라와 있다는 점이 핵심 포인트입니다.\n      </div>\n      <div class=\"visual media-shell\">\n        <img src=\"uploaded:image_9c2a24.png\" alt=\"강아지가 높은 밥그릇으로 편안하게 밥 먹는 모습\" />\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-cream\">\n    <div class=\"point-hero center\">\n      <div class=\"sec-label\">부드러운 식사 흐름</div>\n      <div class=\"sec-title\">먹기힘든 사각지대 없는<br/>둥근 곡면 구조</div>\n      <div class=\"sec-desc\">\n        사료가 한쪽에 오래 남지 않도록 설계된 둥근 곡면입니다.<br>\n        사료가 자연스럽게 가운데로 모여, 끝까지 편안하게 먹을 수 있습니다.<br>\n        먹는 자리까지 덜 흔들리게 설계되었습니다.\n      </div>\n      <div class=\"visual media-shell\">\n        [이미지 삽입부]<br/>둥근 곡면 클로즈업\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-soft\">\n    <div class=\"point-hero center\">\n      <div class=\"sec-label\">밀리지 않는 안정감</div>\n      <div class=\"sec-title\">밀리지 않는 묵직한<br/>세라믹 바디로 편안한 식사</div>\n      <div class=\"sec-desc\">\n        가벼운 플라스틱 식기는 아이들의 코끝에 쉽게 밀립니다.<br>\n        밀도 높은 세라믹 특유의 묵직함과 넓게 받쳐 주는 형태로 언제나 든든하게 자리를 지켜줍니다.\n      </div>\n      <div class=\"visual media-shell\">\n        [이미지 삽입부]<br/>거친 하부 마감 디테일\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-ivory\">\n    <div class=\"point-hero center\">\n      <div class=\"sec-label\">넉넉한 여유</div>\n      <div class=\"sec-title\">넓은 입구, 낮은 높이로<br/>쏟을 걱정 없는 물그릇</div>\n      <div class=\"sec-desc\">\n        입구가 좁고 가벼우면 물을 엎지르기 쉽고 부담을 느낍니다.<br>\n        17cm 와이드 입구 설계와 안정적인 디자인으로 주변에 물이 튀는 것을 막고 자연스러운 수분 섭취를 돕습니다.<br>\n        놓아두기만 해도 기분 좋아지는 사랑스러운 디자인입니다.\n      </div>\n      <div class=\"visual media-shell\">\n        [이미지 삽입부]<br/>와이드 물그릇 연출 컷\n      </div>\n    </div>\n  </section>\n\n  <section class=\"section bg-cream\">\n    <div class=\"center\">\n      <div class=\"sec-label\">자주 묻는 질문</div>\n      <div class=\"sec-title\">궁금해하시는 점들</div>\n    </div>\n    <div class=\"chat-wrap\">\n      <div class=\"chat-row\">\n        <div class=\"chat-avatar\">Q</div>\n        <div class=\"chat-content\">\n          <div class=\"chat-name\">고객님</div>\n          <div class=\"chat-bubble\">식기세척기나 전자레인지 사용이 가능한가요?</div>\n        </div>\n      </div>\n      <div class=\"chat-row right\">\n        <div class=\"chat-avatar\">A</div>\n        <div class=\"chat-content\">\n          <div class=\"chat-name\">멜팅치즈</div>\n          <div class=\"chat-bubble\">네, 1300도 이상 고온에서 구워낸 도자기라 식기세척기, 열탕 소독 모두 가능합니다. 급격한 온도 변화만 주의해 주세요.</div>\n        </div>\n      </div>\n      <div class=\"chat-row\">\n        <div class=\"chat-avatar\">Q</div>\n        <div class=\"chat-content\">\n          <div class=\"chat-name\">고객님</div>\n          <div class=\"chat-bubble\">그릇이 밀리지는 않을까요?</div>\n        </div>\n      </div>\n      <div class=\"chat-row right\">\n        <div class=\"chat-avatar\">A</div>\n        <div class=\"chat-content\">\n          <div class=\"chat-name\">멜팅치즈</div>\n          <div class=\"chat-bubble\">밥그릇은 약 397g으로, 아이들이 코로 밀어도 끄떡없는 묵직함을 가졌습니다. 매트와 함께 쓰시면 더욱 튼튼합니다.</div>\n        </div>\n      </div>\n    </div>\n  </section>\n\n  <section class=\"hb-info-wrap\">\n    <div class=\"hb-info-head\">상품 정보</div>\n    <table class=\"hb-table\">\n      <tr><th>제품명</th><td>멜팅치즈 세라믹 식기 세트</td></tr>\n      <tr><th>세트 구성</th><td>노란 패드 + 높은 밥그릇 + 넓은 물그릇<br/>(높은 밥그릇 단품 구매 가능)</td></tr>\n      <tr><th>재질</th><td>도자기제 (세라믹)</td></tr>\n      <tr><th>높은 밥그릇</th><td>입구 12.5cm · 높이 11.5cm<br/>250mL · 397g</td></tr>\n      <tr><th>넓은 물그릇</th><td>입구 17cm · 높이 7.5cm<br/>470mL · 419g</td></tr>\n      <tr><th>제조 공정</th><td>800℃ 1차 / 1300~1400℃ 2차 소성</td></tr>\n      <tr>\n        <th>주의사항</th>\n        <td>\n          <ol>\n            <li>수작업 공정상 미세한 크기 오차가 있을 수 있습니다.</li>\n            <li>급랭/급가열 등 급격한 온도 변화는 파손의 원인이 됩니다.</li>\n          </ol>\n        </td>\n      </tr>\n    </table>\n  </section>\n\n  <section class=\"section bg-soft\">\n    <div class=\"center\">\n      <div class=\"finale-mascot\"><div class=\"badge\">🧀</div></div>\n      <div class=\"sec-title\">편안한 식사 시간,<br/>망설일 필요 없습니다</div>\n      <div class=\"sec-desc\">멜팅치즈 식기와 함께 매일의 일상을<br/>더 귀엽고 건강하게 바꿔보세요.</div>\n      <a href=\"#option-top\" class=\"finale-btn\">세트 구성 선택하러 가기 <span>›</span></a>\n    </div>\n  </section>\n\n</div>\n</body>\n</html>\n",
};
function getFixtureMeta(fixtureId) {
  return FIXTURE_MANIFEST.fixtures.find((item) => item.id === fixtureId) || null;
}


/* ===== src/config.js ===== */

const APP_TITLE = '상세페이지 웹앱 로컬 에디터 · 8단계';
const APP_VERSION = 'phase8-local-2026-04-03';
const EXPLICIT_SLOT_SELECTOR = '[data-image-slot], .image-slot, .drop-slot';
const PLACEHOLDER_TEXT_RE = /(\[[^\]]*(이미지|영상)[^\]]*\]|이미지\s*삽입부|삽입부|드래그\s*이미지|image\s*slot|image\s*area|누끼|클로즈업|착용컷|연출컷|상세컷|대표\s*이미지|메인\s*이미지|썸네일|thumbnail|visual|hero|shot)/i;
const STRONG_SLOT_CLASS_RE = /(^|\s)(media-shell|hero-shot|hero-visual|visual|opt-thumb|thumb|thumb-box|thumb-item|image-slot|drop-slot|image-wrap|photo-wrap|poster|cover|ph|c-box|cta-char|frame|hero-image|hero-media)(\s|$)/i;
const LAYOUT_CLASS_RE = /(^|\s)(page|section|row|col|wrap|grid|container|inner|list|group|content|body|card|table|table-row|table-cell|layout|shell)(\s|$)/i;
const BLOCKED_TAGS = new Set(['HTML', 'HEAD', 'BODY', 'SCRIPT', 'STYLE', 'META', 'LINK']);
const CUSTOM_LOCAL_SCHEMES = new Set(['uploaded', 'asset', 'assets', 'local', 'image', 'img', 'media']);
const COMMON_ASSET_DIRS = ['assets', 'uploaded', 'images', 'image', 'img', 'media', 'static'];
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg', '.avif']);
const TEXTISH_TAGS = new Set(['P', 'SPAN', 'SMALL', 'STRONG', 'EM', 'B', 'I', 'U', 'LI', 'TD', 'TH', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LABEL', 'A', 'BUTTON', 'BLOCKQUOTE']);
const TEXT_CLASS_RE = /(title|desc|copy|text|note|label|kicker|caption|eyebrow|micro|body|tag|badge|question|answer|guide|summary|lead|message|headline|name|price)/i;
const BOX_CLASS_RE = /(box|card|panel|wrap|layout|grid|collage|bubble|holder|banner|section|row|group|list|content|body|item|area|container|shell)/i;
const SLOT_SCORE_THRESHOLD = 72;
const SLOT_NEAR_MISS_MIN = 48;
const FRAME_STYLE_ID = '__phase5_local_editor_style';
const FRAME_OVERLAY_ID = '__phase5_local_editor_overlay';
const AUTOSAVE_KEY = 'detail-local-webapp-autosave-v6';
const PROJECT_SNAPSHOT_KEY = 'detail-local-webapp-project-snapshots-v1';
const HISTORY_LIMIT = 80;
const PROJECT_SNAPSHOT_LIMIT = 30;
const EXPORT_PRESETS = [
  { id: 'default', label: '기본 패키지', scale: 1, bundleMode: 'basic', description: '편집 HTML + 전체 PNG + 리포트' },
  { id: 'market', label: '마켓 업로드', scale: 1, bundleMode: 'market', description: '링크형 HTML + 섹션 PNG + 리포트' },
  { id: 'hires', label: '고해상도', scale: 2, bundleMode: 'hires', description: '전체 PNG 2x + 섹션 PNG 2x + 편집 HTML' },
  { id: 'review', label: '검수용', scale: 1, bundleMode: 'review', description: '정규화 HTML + 전체 PNG 1x + 리포트' },
];
function getExportPresetById(id) {
  return EXPORT_PRESETS.find((item) => item.id === id) || EXPORT_PRESETS[0];
}


/* ===== src/utils.js ===== */

const counters = new Map();
function nextId(prefix = 'id') {
  const current = (counters.get(prefix) || 0) + 1;
  counters.set(prefix, current);
  return `${prefix}_${String(current).padStart(4, '0')}`;
}
function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
function escapeXml(value) {
  return escapeHtml(value);
}
function truncate(value, length = 120) {
  const text = String(value ?? '');
  if (text.length <= length) return text;
  return `${text.slice(0, Math.max(0, length - 1))}…`;
}
function formatNumber(value) {
  return Number(value || 0).toLocaleString('ko-KR');
}
function formatDateTime(value) {
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).format(new Date(value));
  } catch {
    return String(value || '');
  }
}
function basename(path) {
  const normalized = String(path || '').replaceAll('\\', '/');
  return normalized.split('/').filter(Boolean).pop() || normalized;
}
function stripQueryHash(value) {
  const text = String(value || '');
  const q = text.indexOf('?');
  const h = text.indexOf('#');
  let end = text.length;
  if (q >= 0) end = Math.min(end, q);
  if (h >= 0) end = Math.min(end, h);
  return text.slice(0, end);
}
function tryDecodeURIComponent(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
function normalizeRelativePath(value) {
  const raw = String(value || '').replaceAll('\\', '/');
  const parts = [];
  for (const part of raw.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') {
      parts.pop();
      continue;
    }
    parts.push(part);
  }
  return parts.join('/');
}
function joinRelativePath(baseDir, relativePath) {
  return normalizeRelativePath([baseDir, relativePath].filter(Boolean).join('/'));
}
function classifyReference(ref) {
  const value = String(ref || '').trim();
  if (!value) return { kind: 'empty', scheme: '' };
  if (value.startsWith('data:')) return { kind: 'data', scheme: 'data' };
  if (value.startsWith('blob:')) return { kind: 'blob', scheme: 'blob' };
  if (value.startsWith('#')) return { kind: 'fragment', scheme: 'fragment' };
  if (/^https?:\/\//i.test(value) || value.startsWith('//')) {
    return { kind: 'remote', scheme: value.startsWith('//') ? 'scheme-relative' : value.split(':', 1)[0].toLowerCase() };
  }
  const match = value.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):/);
  if (match) return { kind: 'custom', scheme: match[1].toLowerCase() };
  return { kind: 'relative', scheme: 'relative' };
}
function buildSvgPlaceholderDataUrl(label, detail = '') {
  const title = escapeXml(label || '미해결 이미지');
  const body = escapeXml(detail || '폴더 import로 다시 연결해 주세요.');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFF7ED" />
          <stop offset="100%" stop-color="#FDE7D1" />
        </linearGradient>
      </defs>
      <rect width="1200" height="720" fill="url(#g)" />
      <rect x="36" y="36" width="1128" height="648" rx="36" fill="none" stroke="#F59E0B" stroke-width="8" stroke-dasharray="18 16" />
      <text x="600" y="310" text-anchor="middle" font-family="Pretendard, Noto Sans KR, sans-serif" font-size="42" font-weight="800" fill="#9A3412">${title}</text>
      <text x="600" y="380" text-anchor="middle" font-family="Pretendard, Noto Sans KR, sans-serif" font-size="24" font-weight="600" fill="#B45309">${body}</text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function sanitizeFilename(value, fallback = 'file') {
  const cleaned = String(value || '').trim().replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, ' ');
  return cleaned || fallback;
}
function downloadTextFile(filename, content, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type });
  downloadBlob(filename, blob);
}
function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = sanitizeFilename(filename || 'download.bin');
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 800);
}
async function readFileAsDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('FileReader failed'));
    reader.readAsDataURL(file);
  });
}
async function readBlobAsDataUrl(blob) {
  return await readFileAsDataUrl(blob);
}
function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'slot';
}
function createDoctypeHtml(doc) {
  return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
}
function removeEditorCssClasses(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((name) => !name.startsWith('__phase3_') && !name.startsWith('__phase4_') && !name.startsWith('__phase5_') && !name.startsWith('__phase6_'))
    .join(' ');
}
function parseSrcsetCandidates(value) {
  const input = String(value || '').trim();
  if (!input) return [];
  const chunks = [];
  let current = '';
  let sawWhitespace = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === ',') {
      const startsWithData = current.trimStart().toLowerCase().startsWith('data:');
      if (!sawWhitespace && startsWithData) {
        current += char;
        continue;
      }
      if (current.trim()) chunks.push(current.trim());
      current = '';
      sawWhitespace = false;
      continue;
    }
    current += char;
    if (!sawWhitespace && /\s/.test(char)) sawWhitespace = true;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.map((item) => {
    const tokens = item.split(/\s+/);
    if (tokens.length <= 1) return { url: item, descriptor: '' };
    return { url: tokens.slice(0, -1).join(' '), descriptor: tokens.at(-1) };
  });
}
function serializeSrcsetCandidates(items) {
  return (items || [])
    .filter(Boolean)
    .map((item) => [item.url, item.descriptor].filter(Boolean).join(' '))
    .join(', ');
}
function canvasToBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('canvas toBlob 실패'));
    }, type, quality);
  });
}

function createCrc32Table() {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let c = index;
    for (let shift = 0; shift < 8; shift += 1) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[index] = c >>> 0;
  }
  return table;
}

const CRC32_TABLE = createCrc32Table();
function crc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (const byte of bytes) crc = CRC32_TABLE[(crc ^ byte) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const dosTime = ((date.getHours() & 31) << 11) | ((date.getMinutes() & 63) << 5) | Math.floor((date.getSeconds() & 63) / 2);
  const dosDate = (((year - 1980) & 127) << 9) | (((date.getMonth() + 1) & 15) << 5) | (date.getDate() & 31);
  return { dosDate, dosTime };
}

function setZipUint16(view, offset, value) {
  view.setUint16(offset, value & 0xFFFF, true);
}

function setZipUint32(view, offset, value) {
  view.setUint32(offset, value >>> 0, true);
}
async function buildZipBlob(entries) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(String(entry.name || 'file.bin'));
    const data = entry.data instanceof Uint8Array ? entry.data : new Uint8Array(await entry.data.arrayBuffer());
    const checksum = crc32(data);
    const { dosDate, dosTime } = dosDateTime(entry.date || new Date());

    const localHeader = new Uint8Array(30);
    const localView = new DataView(localHeader.buffer);
    setZipUint32(localView, 0, 0x04034b50);
    setZipUint16(localView, 4, 20);
    setZipUint16(localView, 6, 0);
    setZipUint16(localView, 8, 0);
    setZipUint16(localView, 10, dosTime);
    setZipUint16(localView, 12, dosDate);
    setZipUint32(localView, 14, checksum);
    setZipUint32(localView, 18, data.length);
    setZipUint32(localView, 22, data.length);
    setZipUint16(localView, 26, nameBytes.length);
    setZipUint16(localView, 28, 0);
    localParts.push(localHeader, nameBytes, data);

    const centralHeader = new Uint8Array(46);
    const centralView = new DataView(centralHeader.buffer);
    setZipUint32(centralView, 0, 0x02014b50);
    setZipUint16(centralView, 4, 20);
    setZipUint16(centralView, 6, 20);
    setZipUint16(centralView, 8, 0);
    setZipUint16(centralView, 10, 0);
    setZipUint16(centralView, 12, dosTime);
    setZipUint16(centralView, 14, dosDate);
    setZipUint32(centralView, 16, checksum);
    setZipUint32(centralView, 20, data.length);
    setZipUint32(centralView, 24, data.length);
    setZipUint16(centralView, 28, nameBytes.length);
    setZipUint16(centralView, 30, 0);
    setZipUint16(centralView, 32, 0);
    setZipUint16(centralView, 34, 0);
    setZipUint16(centralView, 36, 0);
    setZipUint32(centralView, 38, 0);
    setZipUint32(centralView, 42, offset);
    centralParts.push(centralHeader, nameBytes);

    offset += localHeader.length + nameBytes.length + data.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  setZipUint32(endView, 0, 0x06054b50);
  setZipUint16(endView, 8, entries.length);
  setZipUint16(endView, 10, entries.length);
  setZipUint32(endView, 12, centralSize);
  setZipUint32(endView, 16, offset);
  setZipUint16(endView, 20, 0);

  return new Blob([...localParts, ...centralParts, endRecord], { type: 'application/zip' });
}
function guessExtensionFromMime(mime, fallback = '.bin') {
  const value = String(mime || '').toLowerCase();
  if (value.includes('png')) return '.png';
  if (value.includes('jpeg') || value.includes('jpg')) return '.jpg';
  if (value.includes('webp')) return '.webp';
  if (value.includes('gif')) return '.gif';
  if (value.includes('svg')) return '.svg';
  if (value.includes('avif')) return '.avif';
  if (value.includes('bmp')) return '.bmp';
  return fallback;
}


/* ===== src/core/asset-resolver.js ===== */

function createImportFileIndex(files = [], mode = 'folder-import') {
  const byRelativePath = new Map();
  const byBasename = new Map();
  const htmlEntries = [];

  for (const file of Array.from(files || [])) {
    const relativePath = normalizeRelativePath(file.webkitRelativePath || file.relativePath || file.name || '');
    if (!relativePath) continue;
    const entry = { file, relativePath, name: file.name };
    byRelativePath.set(relativePath.toLowerCase(), entry);
    const base = basename(relativePath).toLowerCase();
    if (!byBasename.has(base)) byBasename.set(base, []);
    byBasename.get(base).push(entry);
    if (/\.html?$/i.test(relativePath)) htmlEntries.push(entry);
  }

  return {
    mode,
    byRelativePath,
    byBasename,
    htmlEntries,
    totalFiles: Array.from(files || []).length,
  };
}
function choosePrimaryHtmlEntry(fileIndex) {
  if (!fileIndex?.htmlEntries?.length) return null;
  const candidates = [...fileIndex.htmlEntries].sort((a, b) => {
    const aScore = scoreHtmlEntry(a.relativePath);
    const bScore = scoreHtmlEntry(b.relativePath);
    return bScore - aScore || a.relativePath.localeCompare(b.relativePath, 'ko');
  });
  return candidates[0] || null;
}

function scoreHtmlEntry(relativePath) {
  const lower = String(relativePath || '').toLowerCase();
  let score = 0;
  if (/(^|\/)index\.html?$/.test(lower)) score += 60;
  if (/detail|builder|template|shop|sample/.test(lower)) score += 24;
  if (/test|backup|copy|old/.test(lower)) score -= 18;
  score -= lower.split('/').length;
  return score;
}

function buildCandidatePaths(ref, htmlDirPath) {
  const info = classifyReference(ref);
  if (info.kind !== 'relative' && info.kind !== 'custom') return [];

  let relative = stripQueryHash(tryDecodeURIComponent(String(ref || '').trim()));
  if (info.kind === 'custom' && CUSTOM_LOCAL_SCHEMES.has(info.scheme)) {
    relative = relative.slice(info.scheme.length + 1);
  }

  relative = relative.replace(/^\/+/, '');
  relative = normalizeRelativePath(relative);
  const name = basename(relative);
  const candidates = new Set();
  if (htmlDirPath) candidates.add(joinRelativePath(htmlDirPath, relative));
  if (relative) candidates.add(relative);
  if (name && name !== relative) candidates.add(name);
  if (name) {
    for (const dir of COMMON_ASSET_DIRS) {
      candidates.add(joinRelativePath(dir, name));
      if (htmlDirPath) candidates.add(joinRelativePath(htmlDirPath, joinRelativePath(dir, name)));
    }
  }
  return Array.from(candidates).filter(Boolean);
}
function createAssetResolver(fileIndex, htmlEntryRelativePath = '') {
  const blobUrlCache = new Map();
  const htmlDirPath = normalizeRelativePath(htmlEntryRelativePath.split('/').slice(0, -1).join('/'));

  function getBlobUrl(file) {
    const cacheKey = `${file.name}__${file.size}__${file.lastModified}`;
    if (!blobUrlCache.has(cacheKey)) blobUrlCache.set(cacheKey, URL.createObjectURL(file));
    return blobUrlCache.get(cacheKey);
  }

  function resolve(ref) {
    const originalRef = String(ref || '').trim();
    const refInfo = classifyReference(originalRef);

    if (refInfo.kind === 'data' || refInfo.kind === 'blob' || refInfo.kind === 'remote' || refInfo.kind === 'fragment') {
      return {
        status: 'passthrough',
        previewUrl: originalRef,
        scheme: refInfo.scheme,
        matchedPath: '',
        method: refInfo.kind,
      };
    }

    const candidates = buildCandidatePaths(originalRef, htmlDirPath);
    for (const candidate of candidates) {
      const hit = fileIndex?.byRelativePath?.get(candidate.toLowerCase());
      if (hit) {
        return {
          status: 'resolved',
          previewUrl: getBlobUrl(hit.file),
          scheme: refInfo.scheme,
          matchedPath: candidate,
          method: 'relative-path',
          fileName: hit.file.name,
        };
      }
    }

    const name = basename(stripQueryHash(originalRef)).toLowerCase();
    if (name && fileIndex?.byBasename?.has(name)) {
      const [first] = fileIndex.byBasename.get(name);
      if (first?.file) {
        return {
          status: 'resolved',
          previewUrl: getBlobUrl(first.file),
          scheme: refInfo.scheme,
          matchedPath: first.relativePath,
          method: 'basename-fallback',
          fileName: first.file.name,
        };
      }
    }

    const cleaned = stripQueryHash(originalRef);
    const idx = cleaned.lastIndexOf('.');
    const extension = idx >= 0 ? cleaned.slice(idx).toLowerCase() : '';
    return {
      status: 'unresolved',
      previewUrl: '',
      scheme: refInfo.scheme,
      matchedPath: '',
      method: 'unresolved',
      likelyImage: IMAGE_EXTENSIONS.has(extension) || refInfo.scheme === 'relative' || CUSTOM_LOCAL_SCHEMES.has(refInfo.scheme),
    };
  }

  function release() {
    for (const url of blobUrlCache.values()) URL.revokeObjectURL(url);
    blobUrlCache.clear();
  }

  return {
    htmlDirPath,
    resolve,
    release,
    getBlobUrlCount: () => blobUrlCache.size,
  };
}


/* ===== src/core/node-uid.js ===== */

function normalizeUid(value) {
  return String(value || '').trim();
}
function ensureUniqueNodeUids(doc, { selector = '*', attribute = 'data-node-uid' } = {}) {
  if (!doc?.querySelectorAll) {
    return {
      scanned: 0,
      assigned: 0,
      deduped: 0,
      unchanged: 0,
      duplicateGroups: 0,
    };
  }

  const elements = Array.from(doc.querySelectorAll(selector));
  const used = new Set();
  const duplicateCounter = new Map();
  let assigned = 0;
  let deduped = 0;
  let unchanged = 0;

  for (const element of elements) {
    const rawUid = normalizeUid(element.getAttribute(attribute));
    if (!rawUid) {
      const nextUid = nextId('node');
      element.setAttribute(attribute, nextUid);
      used.add(nextUid);
      assigned += 1;
      continue;
    }
    if (!used.has(rawUid)) {
      used.add(rawUid);
      unchanged += 1;
      continue;
    }
    duplicateCounter.set(rawUid, (duplicateCounter.get(rawUid) || 0) + 1);
    const nextUid = nextId('node');
    element.setAttribute(attribute, nextUid);
    used.add(nextUid);
    deduped += 1;
  }

  return {
    scanned: elements.length,
    assigned,
    deduped,
    unchanged,
    duplicateGroups: duplicateCounter.size,
  };
}


/* ===== src/core/slot-detector.js ===== */

function directTextContent(element) {
  return Array.from(element.childNodes || [])
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function placeholderText(element) {
  return [
    directTextContent(element),
    element.getAttribute('aria-label') || '',
    element.getAttribute('title') || '',
    element.getAttribute('alt') || '',
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function hasInlineBackground(element) {
  const style = (element.getAttribute('style') || '').toLowerCase();
  return style.includes('background-image') || style.includes('background:url(') || style.includes('background: url(');
}

function hasVisualInlineStyle(element) {
  const style = (element.getAttribute('style') || '').toLowerCase();
  return style.includes('height:') || style.includes('min-height:') || style.includes('aspect-ratio') || style.includes('border-style:') || style.includes('border-radius:') || style.includes('box-shadow');
}

function hasSlotLikeBorder(element) {
  const style = (element.getAttribute('style') || '').toLowerCase();
  return style.includes('dashed') || style.includes('border-style: solid') || style.includes('border: 2px') || style.includes('border:3px') || style.includes('border: 3px');
}

function shallowDescendantMedia(element) {
  const queue = [{ node: element, depth: 0 }];
  while (queue.length) {
    const { node, depth } = queue.shift();
    if (depth > 2) continue;
    for (const child of Array.from(node.children || [])) {
      if (child.tagName === 'IMG' || child.tagName === 'PICTURE') return child;
      const style = (child.getAttribute('style') || '').toLowerCase();
      if (style.includes('background-image')) return child;
      queue.push({ node: child, depth: depth + 1 });
    }
  }
  return null;
}

function countMeaningfulChildren(element) {
  return Array.from(element.children || []).filter((child) => !['BR', 'SPAN', 'SMALL', 'B', 'STRONG', 'EM', 'I'].includes(child.tagName)).length;
}

function buildLabel(element) {
  return (
    element.getAttribute('data-slot-label') ||
    element.getAttribute('data-image-slot') ||
    element.getAttribute('aria-label') ||
    element.id ||
    (typeof element.className === 'string' ? element.className : '') ||
    truncate(placeholderText(element), 48) ||
    element.tagName.toLowerCase()
  );
}

function groupKeyFor(element) {
  const className = typeof element.className === 'string' ? element.className : '';
  return className
    ? className.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => `.${part}`).join('')
    : element.tagName.toLowerCase();
}

function evaluateCandidate(element) {
  const className = typeof element.className === 'string' ? element.className : '';
  const text = placeholderText(element);
  const hasPlaceholder = PLACEHOLDER_TEXT_RE.test(text);
  const strongClass = STRONG_SLOT_CLASS_RE.test(className);
  const inlineBackground = hasInlineBackground(element);
  const descendantMedia = shallowDescendantMedia(element);
  const visualStyle = hasVisualInlineStyle(element);
  const slotBorder = hasSlotLikeBorder(element);
  const childCount = countMeaningfulChildren(element);
  const layoutWrapper = LAYOUT_CLASS_RE.test(className);
  const textHeavy = text.length > 140 && !hasPlaceholder;
  const tagPenalty = ['SECTION', 'ARTICLE', 'MAIN'].includes(element.tagName) ? -14 : 0;
  const fixedHeight = (() => {
    const style = (element.getAttribute('style') || '').toLowerCase();
    return /(?:^|;)\s*(?:height|min-height)\s*:\s*\d/.test(style);
  })();

  let score = 0;
  const reasons = [];
  const add = (value, reason) => {
    score += value;
    reasons.push(`${reason} ${value > 0 ? `+${value}` : value}`);
  };

  if (strongClass) add(52, '강한 클래스 힌트');
  if (hasPlaceholder) add(82, '플레이스홀더 문구');
  if (inlineBackground) add(56, 'inline 배경 이미지');
  if (descendantMedia?.tagName === 'IMG' || descendantMedia?.tagName === 'PICTURE') add(48, '얕은 자식 IMG/Picture');
  if (descendantMedia && descendantMedia !== element && descendantMedia.tagName !== 'IMG' && descendantMedia.tagName !== 'PICTURE') add(42, '얕은 자식 배경 이미지');
  if (visualStyle) add(18, '비주얼 스타일');
  if (slotBorder) add(12, '슬롯형 보더');
  if (fixedHeight) add(8, '고정 높이');
  if (layoutWrapper && !strongClass && !hasPlaceholder && !inlineBackground && !descendantMedia) add(-44, '레이아웃 래퍼');
  if (childCount >= 6 && !strongClass && !hasPlaceholder && !inlineBackground && !descendantMedia) add(-28, '자식 수 과다');
  if (textHeavy) add(-36, '텍스트 과다');
  if (tagPenalty) add(tagPenalty, '큰 구조 태그');

  const qualified = score >= SLOT_SCORE_THRESHOLD || (strongClass && (hasPlaceholder || inlineBackground || descendantMedia || visualStyle || slotBorder));
  const nearMiss = !qualified && score >= SLOT_NEAR_MISS_MIN;

  return {
    qualified,
    nearMiss,
    score,
    reasons,
    strongClass,
    hasPlaceholder,
    inlineBackground,
    descendantMedia: !!descendantMedia,
    groupKey: groupKeyFor(element),
  };
}

function clearExistingMarkers(doc) {
  for (const element of Array.from(doc.querySelectorAll('[data-detected-slot], [data-detected-slot-score], [data-detected-slot-label], [data-detected-slot-reasons], [data-slot-near-miss]'))) {
    element.removeAttribute('data-detected-slot');
    element.removeAttribute('data-detected-slot-score');
    element.removeAttribute('data-detected-slot-label');
    element.removeAttribute('data-detected-slot-reasons');
    element.removeAttribute('data-slot-near-miss');
  }
}

function applyMarker(element, record, type) {
  element.dataset.detectedSlot = type;
  element.dataset.detectedSlotScore = String(record.score ?? 0);
  element.dataset.detectedSlotLabel = record.label || '';
  element.dataset.detectedSlotReasons = (record.reasons || []).join(' | ');
}
function collectSlotCandidates(doc, { markDom = true } = {}) {
  clearExistingMarkers(doc);
  const candidates = [];
  const nearMisses = [];
  const groups = new Map();
  const seen = new WeakSet();

  Array.from(doc.querySelectorAll('*')).forEach((element) => {
    if (!element.dataset.nodeUid) element.dataset.nodeUid = nextId('node');
  });

  doc.querySelectorAll(EXPLICIT_SLOT_SELECTOR).forEach((element) => {
    if (seen.has(element) || element.dataset.slotIgnore === '1') return;
    seen.add(element);
    const record = {
      id: nextId('slot'),
      uid: element.dataset.nodeUid,
      type: element.dataset.manualSlot === '1' ? 'manual' : 'explicit',
      label: buildLabel(element),
      score: 999,
      reasons: [element.dataset.manualSlot === '1' ? '수동 지정 슬롯' : '명시적 슬롯 선택자'],
      className: typeof element.className === 'string' ? element.className : '',
      groupKey: groupKeyFor(element),
    };
    candidates.push(record);
    groups.set(record.groupKey || '[explicit]', (groups.get(record.groupKey || '[explicit]') || 0) + 1);
    if (markDom) applyMarker(element, record, record.type);
  });

  const elements = Array.from(doc.body?.querySelectorAll('*') || []);
  for (const element of elements) {
    if (seen.has(element)) continue;
    if (element.dataset.slotIgnore === '1' || element.dataset.editorRuntime === '1') continue;
    if (BLOCKED_TAGS.has(element.tagName) || ['IMG', 'SOURCE', 'LINK'].includes(element.tagName)) continue;
    const result = evaluateCandidate(element);
    const label = buildLabel(element);
    const record = {
      id: nextId('slot'),
      uid: element.dataset.nodeUid,
      type: result.qualified ? 'heuristic' : 'near-miss',
      label,
      score: result.score,
      reasons: result.reasons,
      className: typeof element.className === 'string' ? element.className : '',
      groupKey: result.groupKey,
    };
    if (result.qualified) {
      candidates.push(record);
      groups.set(record.groupKey, (groups.get(record.groupKey) || 0) + 1);
      seen.add(element);
      if (markDom) applyMarker(element, record, 'heuristic');
    } else if (result.nearMiss) {
      nearMisses.push(record);
      if (markDom) {
        element.dataset.slotNearMiss = String(result.score);
        element.dataset.detectedSlotLabel = label;
        element.dataset.detectedSlotReasons = result.reasons.join(' | ');
      }
    }
  }

  const groupedPatterns = Array.from(groups.entries())
    .map(([group, count]) => ({ group, count }))
    .sort((a, b) => b.count - a.count || a.group.localeCompare(b.group, 'ko'));

  const summary = {
    explicitCount: candidates.filter((item) => item.type === 'explicit' || item.type === 'manual').length,
    heuristicCount: candidates.filter((item) => item.type === 'heuristic').length,
    nearMissCount: nearMisses.length,
    totalCount: candidates.length,
    sectionCount: doc.body?.querySelectorAll('section').length || 0,
  };

  return { candidates, nearMisses, groupedPatterns, summary };
}


/* ===== src/core/normalize-project.js ===== */

const CSS_URL_RE = /url\((['"]?)([^"'()]+)\1\)/gi;

function ensureHead(doc) {
  if (!doc.head) {
    const head = doc.createElement('head');
    doc.documentElement.insertBefore(head, doc.body || null);
  }
  return doc.head;
}

function createIssue(level, code, message) {
  return { id: nextId('issue'), level, code, message };
}

function mapCssUrls(text, mapper) {
  return String(text || '').replace(CSS_URL_RE, (full, quote, url) => {
    const mapped = mapper(url);
    return `url(${quote || '"'}${mapped}${quote || '"'})`;
  });
}

function parseSrcsetCandidates(value) {
  const input = String(value || '').trim();
  if (!input) return [];
  const chunks = [];
  let current = '';
  let sawWhitespace = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (char === ',') {
      const startsWithData = current.trimStart().toLowerCase().startsWith('data:');
      if (!sawWhitespace && startsWithData) {
        current += char;
        continue;
      }
      if (current.trim()) chunks.push(current.trim());
      current = '';
      sawWhitespace = false;
      continue;
    }
    current += char;
    if (!sawWhitespace && /\s/.test(char)) sawWhitespace = true;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.map((item) => {
    const tokens = item.split(/\s+/);
    if (tokens.length <= 1) return { url: item, descriptor: '' };
    const descriptor = tokens.at(-1);
    const url = tokens.slice(0, -1).join(' ');
    return { url, descriptor };
  });
}

function serializeSrcsetCandidates(items) {
  return items
    .filter(Boolean)
    .map((item) => [item.url, item.descriptor].filter(Boolean).join(' '))
    .join(', ');
}

function registerAsset(registry, payload) {
  const record = { id: nextId('asset'), ...payload };
  registry.push(record);
  return record;
}

function buildNodeLabel(element) {
  return (
    element.getAttribute('data-slot-label') ||
    element.getAttribute('data-image-slot') ||
    element.getAttribute('alt') ||
    element.getAttribute('aria-label') ||
    element.id ||
    (typeof element.className === 'string' ? element.className : '') ||
    element.tagName.toLowerCase()
  );
}

function removeScripts(doc, issues) {
  const scripts = Array.from(doc.querySelectorAll('script'));
  for (const script of scripts) script.remove();
  if (scripts.length) {
    issues.push(createIssue('warning', 'SCRIPT_REMOVED', `미리보기 안전성을 위해 script ${scripts.length}개를 제거했습니다.`));
  }
  let inlineHandlerCount = 0;
  for (const element of Array.from(doc.querySelectorAll('*'))) {
    for (const attr of Array.from(element.attributes || [])) {
      if (!/^on/i.test(attr.name)) continue;
      element.removeAttribute(attr.name);
      inlineHandlerCount += 1;
    }
  }
  if (inlineHandlerCount) {
    issues.push(createIssue('warning', 'INLINE_HANDLER_REMOVED', `미리보기/재오픈 안전성을 위해 inline 이벤트 핸들러 ${inlineHandlerCount}개를 제거했습니다.`));
  }
  return scripts.length;
}
function normalizeProject({
  html,
  sourceName = 'untitled.html',
  sourceType = 'paste',
  fileIndex = null,
  htmlEntryPath = '',
  fixtureMeta = null,
}) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(String(html || ''), 'text/html');
  const resolver = createAssetResolver(fileIndex, htmlEntryPath);
  const assets = [];
  const issues = [];
  const remoteStylesheets = [];
  const unresolvedRefs = new Set();
  let existingImageCount = 0;

  const scriptsRemoved = removeScripts(doc, issues);
  ensureHead(doc);

  const uidRepair = ensureUniqueNodeUids(doc);
  if (uidRepair.assigned > 0) {
    issues.push(createIssue('warning', 'UID_MISSING_REPAIRED', `data-node-uid 누락 ${uidRepair.assigned}건을 자동 보정했습니다.`));
  }
  if (uidRepair.deduped > 0) {
    issues.push(createIssue('warning', 'UID_DUPLICATE_REPAIRED', `data-node-uid 중복 ${uidRepair.deduped}건(${uidRepair.duplicateGroups}개 그룹)을 자동 보정했습니다.`));
  }

  const imgElements = Array.from(doc.querySelectorAll('img'));
  for (const img of imgElements) {
    const ownerLabel = buildNodeLabel(img.parentElement || img);
    const originalSrc = img.getAttribute('src') || '';
    if (originalSrc) {
      existingImageCount += 1;
      const resolution = resolver.resolve(originalSrc);
      const asset = registerAsset(assets, {
        ownerUid: img.dataset.nodeUid,
        ownerTag: img.tagName.toLowerCase(),
        ownerLabel,
        attribute: 'src',
        kind: 'img-src',
        originalRef: originalSrc,
        previewRef: resolution.previewUrl || originalSrc,
        status: resolution.status,
        scheme: resolution.scheme,
        matchedPath: resolution.matchedPath || '',
        resolutionMethod: resolution.method,
      });
      img.dataset.normalizedAssetId = asset.id;
      img.dataset.originalSrc = originalSrc;
      if (resolution.status === 'unresolved') {
        unresolvedRefs.add(originalSrc);
        img.dataset.normalizedUnresolvedImage = '1';
        img.dataset.normalizedAssetLabel = truncate(originalSrc, 80);
        img.setAttribute('src', buildSvgPlaceholderDataUrl('미해결 이미지', truncate(originalSrc, 56)));
      } else {
        img.setAttribute('src', resolution.previewUrl || originalSrc);
      }
    }

    const srcsetValue = img.getAttribute('srcset') || '';
    if (srcsetValue) {
      const serialized = serializeSrcsetCandidates(parseSrcsetCandidates(srcsetValue).map((item) => {
        const resolution = resolver.resolve(item.url);
        registerAsset(assets, {
          ownerUid: img.dataset.nodeUid,
          ownerTag: img.tagName.toLowerCase(),
          ownerLabel,
          attribute: 'srcset',
          descriptor: item.descriptor,
          kind: 'img-srcset',
          originalRef: item.url,
          previewRef: resolution.previewUrl || item.url,
          status: resolution.status,
          scheme: resolution.scheme,
          matchedPath: resolution.matchedPath || '',
          resolutionMethod: resolution.method,
        });
        if (resolution.status === 'unresolved') {
          unresolvedRefs.add(item.url);
          return { url: buildSvgPlaceholderDataUrl('미해결 srcset', truncate(item.url, 56)), descriptor: item.descriptor };
        }
        return { url: resolution.previewUrl || item.url, descriptor: item.descriptor };
      }));
      img.dataset.originalSrcset = srcsetValue;
      img.setAttribute('srcset', serialized);
    }
  }

  for (const source of Array.from(doc.querySelectorAll('source[srcset]'))) {
    const srcsetValue = source.getAttribute('srcset') || '';
    const ownerLabel = buildNodeLabel(source.parentElement || source);
    const serialized = serializeSrcsetCandidates(parseSrcsetCandidates(srcsetValue).map((item) => {
      const resolution = resolver.resolve(item.url);
      registerAsset(assets, {
        ownerUid: source.dataset.nodeUid,
        ownerTag: source.tagName.toLowerCase(),
        ownerLabel,
        attribute: 'srcset',
        descriptor: item.descriptor,
        kind: 'source-srcset',
        originalRef: item.url,
        previewRef: resolution.previewUrl || item.url,
        status: resolution.status,
        scheme: resolution.scheme,
        matchedPath: resolution.matchedPath || '',
        resolutionMethod: resolution.method,
      });
      if (resolution.status === 'unresolved') unresolvedRefs.add(item.url);
      return { url: resolution.status === 'unresolved' ? buildSvgPlaceholderDataUrl('미해결 source', truncate(item.url, 56)) : (resolution.previewUrl || item.url), descriptor: item.descriptor };
    }));
    source.dataset.originalSrcset = srcsetValue;
    source.setAttribute('srcset', serialized);
  }

  for (const element of Array.from(doc.querySelectorAll('[style]'))) {
    const originalStyle = element.getAttribute('style') || '';
    if (!/background/i.test(originalStyle)) continue;
    const ownerLabel = buildNodeLabel(element);
    const rewritten = mapCssUrls(originalStyle, (url) => {
      const resolution = resolver.resolve(url);
      registerAsset(assets, {
        ownerUid: element.dataset.nodeUid,
        ownerTag: element.tagName.toLowerCase(),
        ownerLabel,
        attribute: 'style',
        kind: 'inline-style-url',
        originalRef: url,
        previewRef: resolution.previewUrl || url,
        status: resolution.status,
        scheme: resolution.scheme,
        matchedPath: resolution.matchedPath || '',
        resolutionMethod: resolution.method,
      });
      if (resolution.status === 'unresolved') {
        unresolvedRefs.add(url);
        element.dataset.normalizedUnresolvedImage = '1';
        element.dataset.normalizedAssetLabel = truncate(url, 80);
        return buildSvgPlaceholderDataUrl('미해결 배경 이미지', truncate(url, 56));
      }
      return resolution.previewUrl || url;
    });
    element.dataset.originalStyle = originalStyle;
    element.setAttribute('style', rewritten);
  }

  for (const styleBlock of Array.from(doc.querySelectorAll('style'))) {
    const originalCss = styleBlock.textContent || '';
    if (!/url\(/i.test(originalCss)) continue;
    const ownerLabel = 'style-block';
    const rewrittenCss = mapCssUrls(originalCss, (url) => {
      const resolution = resolver.resolve(url);
      registerAsset(assets, {
        ownerUid: styleBlock.dataset.nodeUid,
        ownerTag: 'style',
        ownerLabel,
        attribute: 'textContent',
        kind: 'style-block-url',
        originalRef: url,
        previewRef: resolution.previewUrl || url,
        status: resolution.status,
        scheme: resolution.scheme,
        matchedPath: resolution.matchedPath || '',
        resolutionMethod: resolution.method,
      });
      if (resolution.status === 'unresolved') unresolvedRefs.add(url);
      return resolution.status === 'unresolved' ? buildSvgPlaceholderDataUrl('미해결 CSS 자산', truncate(url, 56)) : (resolution.previewUrl || url);
    });
    styleBlock.dataset.originalCss = encodeURIComponent(originalCss);
    styleBlock.textContent = rewrittenCss;
  }

  for (const link of Array.from(doc.querySelectorAll('link[rel~="stylesheet"][href]'))) {
    const href = link.getAttribute('href') || '';
    if (/^https?:\/\//i.test(href) || href.startsWith('//')) remoteStylesheets.push(href);
  }
  if (remoteStylesheets.length) {
    issues.push(createIssue('info', 'REMOTE_STYLESHEET', `원격 stylesheet ${remoteStylesheets.length}개가 포함되어 있습니다.`));
  }

  if (unresolvedRefs.size) {
    const sourceHint = sourceType === 'folder-import'
      ? '선택한 폴더 안에서 못 찾은 자산이 있습니다.'
      : 'HTML 파일만 열면 상대경로나 uploaded: 자산은 연결되지 않을 수 있습니다. 프로젝트 폴더 import를 권장합니다.';
    issues.push(createIssue('warning', 'UNRESOLVED_ASSET', `미해결 자산 ${unresolvedRefs.size}개가 있습니다. ${sourceHint}`));
  }

  const slotDetection = collectSlotCandidates(doc, { markDom: true });
  const expectedSlotText = fixtureMeta?.slot_contract?.required_exact_count
    ? `기준 ${fixtureMeta.slot_contract.required_exact_count}개`
    : fixtureMeta?.slot_contract?.required_min_count
      ? `기준 최소 ${fixtureMeta.slot_contract.required_min_count}개`
      : '';
  if (fixtureMeta && expectedSlotText) {
    issues.push(createIssue('info', 'FIXTURE_EXPECTATION', `${fixtureMeta.id} ${fixtureMeta.name}: ${expectedSlotText}`));
  }

  const summary = {
    sourceName,
    sourceType,
    normalizedAt: new Date().toISOString(),
    elementCount: doc.querySelectorAll('*').length,
    sectionCount: doc.body?.querySelectorAll('section').length || 0,
    styleBlockCount: doc.querySelectorAll('style').length,
    scriptCountRemoved: scriptsRemoved,
    assetsTotal: assets.length,
    assetsResolved: assets.filter((item) => item.status === 'resolved').length,
    assetsPassthrough: assets.filter((item) => item.status === 'passthrough').length,
    assetsUnresolved: assets.filter((item) => item.status === 'unresolved').length,
    existingImageCount,
    explicitSlotCount: slotDetection.summary.explicitCount,
    heuristicSlotCount: slotDetection.summary.heuristicCount,
    nearMissCount: slotDetection.summary.nearMissCount,
    totalSlotCandidates: slotDetection.summary.totalCount,
    remoteStylesheetCount: remoteStylesheets.length,
    unresolvedReferenceCount: unresolvedRefs.size,
    linkedSlotCount: doc.querySelectorAll(EXPLICIT_SLOT_SELECTOR).length,
    uidScanned: uidRepair.scanned,
    uidAssigned: uidRepair.assigned,
    uidDeduped: uidRepair.deduped,
    uidDuplicateGroups: uidRepair.duplicateGroups,
  };

  const normalizedHtml = `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
  const project = {
    id: nextId('project'),
    fixtureId: fixtureMeta?.id || '',
    fixtureMeta,
    sourceName,
    sourceType,
    originalHtml: String(html || ''),
    normalizedHtml,
    summary,
    uidRepair,
    issues,
    assets,
    slotDetection,
    remoteStylesheets,
    releaseResources: () => resolver.release(),
    fileContext: {
      mode: fileIndex?.mode || sourceType,
      htmlEntryPath,
      totalFiles: fileIndex?.totalFiles || 0,
      blobUrlCount: resolver.getBlobUrlCount(),
    },
  };

  return project;
}


/* ===== src/core/project-store.js ===== */

function createProjectStore() {
  const listeners = new Set();
  const state = {
    project: null,
    editorMeta: null,
    statusText: '대기 중',
    lastError: '',
    imageApplyDiagnostic: null,
    currentView: 'preview',
    selectionMode: 'smart',
  };

  function notify() {
    const snapshot = getState();
    for (const listener of listeners) {
      try {
        listener(snapshot);
      } catch (error) {
        console.error('[project-store] listener failed:', error);
      }
    }
  }

  function getState() {
    return {
      project: state.project,
      editorMeta: state.editorMeta,
      statusText: state.statusText,
      lastError: state.lastError,
      imageApplyDiagnostic: state.imageApplyDiagnostic,
      currentView: state.currentView,
      selectionMode: state.selectionMode,
    };
  }

  function setProject(project) {
    if (state.project?.releaseResources) {
      try { state.project.releaseResources(); } catch {}
    }
    state.project = project;
    state.editorMeta = null;
    state.imageApplyDiagnostic = null;
    notify();
  }

  function updateProject(mutator) {
    if (!state.project) return;
    const result = typeof mutator === 'function' ? mutator(state.project) : null;
    if (result && typeof result === 'object') state.project = result;
    notify();
  }

  function setEditorMeta(meta) {
    state.editorMeta = meta || null;
    notify();
  }

  function setStatus(text, { preserveLastError = false } = {}) {
    state.statusText = String(text || '대기 중');
    if (!preserveLastError) state.lastError = '';
    notify();
  }

  function setLastError(text) {
    state.lastError = String(text || '');
    notify();
  }

  function setImageApplyDiagnostic(diagnostic) {
    state.imageApplyDiagnostic = diagnostic ? { ...diagnostic } : null;
    notify();
  }

  function setView(view) {
    state.currentView = view || 'preview';
    notify();
  }

  function setSelectionMode(mode) {
    state.selectionMode = mode || 'smart';
    notify();
  }

  function subscribe(listener) {
    listeners.add(listener);
    try {
      listener(getState());
    } catch (error) {
      console.error('[project-store] initial listener failed:', error);
    }
    return () => listeners.delete(listener);
  }

  return {
    getState,
    setProject,
    updateProject,
    setEditorMeta,
    setStatus,
    setLastError,
    setImageApplyDiagnostic,
    setView,
    setSelectionMode,
    subscribe,
  };
}


/* ===== src/core/editor-model.js ===== */

function parseStyle(styleText = '') {
  const map = new Map();
  for (const raw of String(styleText || '').split(';')) {
    const [key, ...rest] = raw.split(':');
    if (!key || !rest.length) continue;
    map.set(key.trim().toLowerCase(), rest.join(':').trim());
  }
  return map;
}

function serializeStyle(map) {
  return Array.from(map.entries()).map(([key, value]) => `${key}: ${value}`).join('; ');
}

function pxValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const match = raw.match(/^-?\d+(\.\d+)?/);
  if (!match) return null;
  const num = Number.parseFloat(match[0]);
  return Number.isFinite(num) ? num : null;
}

function readNodeState(element) {
  const uid = element.dataset.nodeUid || '';
  const styleMap = parseStyle(element.getAttribute('style') || '');
  const tx = pxValue(element.dataset.editorTx) || 0;
  const ty = pxValue(element.dataset.editorTy) || 0;
  return {
    uid,
    bounds: {
      x: tx,
      y: ty,
      width: pxValue(styleMap.get('width')),
      height: pxValue(styleMap.get('height')),
    },
    style: Object.fromEntries(styleMap.entries()),
    slotMeta: {
      detectedType: element.getAttribute('data-detected-slot') || '',
      label: element.getAttribute('data-slot-label') || '',
      score: Number.parseFloat(element.getAttribute('data-detected-slot-score') || '0') || 0,
      reasons: (element.getAttribute('data-detected-slot-reasons') || '').split('|').map((item) => item.trim()).filter(Boolean),
    },
  };
}
function createEditorModel(doc) {
  ensureUniqueNodeUids(doc, { selector: '[data-node-uid]' });
  const nodes = new Map();
  for (const element of Array.from(doc.querySelectorAll('[data-node-uid]'))) {
    const state = readNodeState(element);
    if (state.uid) nodes.set(state.uid, state);
  }
  return { version: 1, nodes };
}
function patchModelNode(model, uid, patch = {}) {
  if (!model || !uid) return null;
  const current = model.nodes.get(uid) || {
    uid,
    bounds: { x: 0, y: 0, width: null, height: null },
    style: {},
    slotMeta: { detectedType: '', label: '', score: 0, reasons: [] },
  };
  const next = {
    ...current,
    bounds: { ...current.bounds, ...(patch.bounds || {}) },
    style: { ...current.style, ...(patch.style || {}) },
    slotMeta: { ...current.slotMeta, ...(patch.slotMeta || {}) },
  };
  model.nodes.set(uid, next);
  model.version += 1;
  return next;
}
function applyModelNodesToDom(doc, model, uids = []) {
  if (!model || !doc) return;
  const targets = uids.length ? uids : Array.from(model.nodes.keys());
  for (const uid of targets) {
    const state = model.nodes.get(uid);
    if (!state) continue;
    const element = doc.querySelector(`[data-node-uid="${uid}"]`);
    if (!element) continue;
    const styleMap = parseStyle(element.getAttribute('style') || '');
    if (state.bounds.width != null) styleMap.set('width', `${Math.round(state.bounds.width)}px`);
    if (state.bounds.height != null) styleMap.set('height', `${Math.round(state.bounds.height)}px`);
    for (const [key, value] of Object.entries(state.style || {})) {
      if (value == null || value === '') styleMap.delete(String(key).toLowerCase());
      else styleMap.set(String(key).toLowerCase(), String(value));
    }
    const styleText = serializeStyle(styleMap);
    if (styleText) element.setAttribute('style', styleText);
    else element.removeAttribute('style');
    if (styleText) element.dataset.exportStyle = styleText;
    else element.removeAttribute('data-export-style');
    element.dataset.editorTx = String(Math.round(state.bounds.x || 0));
    element.dataset.editorTy = String(Math.round(state.bounds.y || 0));
    if (state.slotMeta?.label) element.setAttribute('data-slot-label', state.slotMeta.label);
    if (state.slotMeta?.detectedType) element.setAttribute('data-detected-slot', state.slotMeta.detectedType);
  }
}


/* ===== src/core/serialize-layer.js ===== */

function restoreSerializedAssetRefs(exportDoc, { keepEditedAssets = true } = {}) {
  for (const img of Array.from(exportDoc.querySelectorAll('img'))) {
    if (keepEditedAssets) {
      if (img.dataset.exportSrc) img.setAttribute('src', img.dataset.exportSrc);
      else if (img.dataset.originalSrc) img.setAttribute('src', img.dataset.originalSrc);
    } else if (img.dataset.originalSrc) {
      img.setAttribute('src', img.dataset.originalSrc);
    }
    if (img.dataset.originalSrcset && !img.dataset.exportSrcset) img.setAttribute('srcset', img.dataset.originalSrcset);
    else if (!img.dataset.originalSrcset && !img.dataset.exportSrcset) img.removeAttribute('srcset');
    if (keepEditedAssets && img.dataset.exportSrcset) img.setAttribute('srcset', img.dataset.exportSrcset);
    img.removeAttribute('sizes');
  }

  for (const source of Array.from(exportDoc.querySelectorAll('source'))) {
    if (keepEditedAssets && source.dataset.exportSrcset) source.setAttribute('srcset', source.dataset.exportSrcset);
    else if (source.dataset.originalSrcset) source.setAttribute('srcset', source.dataset.originalSrcset);
  }

  for (const element of Array.from(exportDoc.querySelectorAll('[style]'))) {
    if (keepEditedAssets && element.dataset.exportStyle) element.setAttribute('style', element.dataset.exportStyle);
    else if (element.dataset.originalStyle) element.setAttribute('style', element.dataset.originalStyle);
  }

  for (const styleBlock of Array.from(exportDoc.querySelectorAll('style'))) {
    if (!styleBlock.dataset.originalCss) continue;
    try { styleBlock.textContent = decodeURIComponent(styleBlock.dataset.originalCss); } catch {}
  }
}


/* ===== src/editor/frame-editor.js ===== */

const FRAME_CSS_URL_RE = /url\((['"]?)([^"'()]+)\1\)/gi;
const UNSUPPORTED_COMMAND_MESSAGE_PREFIX = '지원하지 않는 명령입니다:';
const FRAME_NUDGE_STEP_RULE = Object.freeze({
  base: 2,
  shift: 10,
  alt: 1,
});
const ADD_ELEMENT_PRESETS = {
  text: {
    tagName: 'p',
    className: 'editor-added-text',
    textContent: '새 텍스트',
    style: {
      minHeight: '32px',
      padding: '6px 8px',
      color: '#111827',
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.5',
      background: 'rgba(255,255,255,0.5)',
    },
  },
  box: {
    tagName: 'div',
    className: 'editor-added-box',
    style: {
      width: '220px',
      height: '120px',
      border: '2px solid #93c5fd',
      borderRadius: '12px',
      background: 'rgba(147,197,253,0.2)',
      boxSizing: 'border-box',
    },
  },
  slot: {
    tagName: 'div',
    className: 'editor-added-slot',
    textContent: '[이미지 삽입부]',
    dataset: {
      manualSlot: '1',
      imageSlot: 'new-slot',
      slotLabel: '새 슬롯',
    },
    style: {
      width: '240px',
      height: '160px',
      border: '2px dashed #22c55e',
      borderRadius: '12px',
      color: '#14532d',
      background: 'rgba(220,252,231,0.48)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
    },
  },
};

function isElement(node) {
  return !!node && node.nodeType === Node.ELEMENT_NODE;
}

function closestElement(node) {
  if (isElement(node)) return node;
  return node?.parentElement || null;
}

function isTypingInputTarget(target) {
  if (!target || !isElement(target)) return false;
  if (target.closest('[contenteditable="true"]')) return true;
  const tagName = target.tagName;
  if (tagName === 'TEXTAREA' || tagName === 'SELECT') return true;
  if (tagName !== 'INPUT') return false;
  const inputType = String(target.getAttribute('type') || 'text').toLowerCase();
  return inputType !== 'checkbox' && inputType !== 'radio' && inputType !== 'button' && inputType !== 'submit' && inputType !== 'reset';
}

function buildLabel(element) {
  return (
    element?.getAttribute?.('data-slot-label') ||
    element?.getAttribute?.('data-image-slot') ||
    element?.getAttribute?.('aria-label') ||
    element?.getAttribute?.('alt') ||
    element?.id ||
    (typeof element?.className === 'string' ? element.className : '') ||
    truncate(element?.textContent?.replace(/\s+/g, ' ').trim() || '', 48) ||
    element?.tagName?.toLowerCase?.() ||
    'element'
  );
}

function isTextyElement(element) {
  if (!element || !isElement(element)) return false;
  if (TEXTISH_TAGS.has(element.tagName)) return true;
  const className = typeof element.className === 'string' ? element.className : '';
  const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
  return TEXT_CLASS_RE.test(className) && text.length > 0 && text.length < 240;
}

function isBoxyElement(element) {
  if (!element || !isElement(element)) return false;
  if (element.matches(EXPLICIT_SLOT_SELECTOR) || element.hasAttribute('data-detected-slot')) return false;
  const className = typeof element.className === 'string' ? element.className : '';
  return BOX_CLASS_RE.test(className) || ['DIV', 'SECTION', 'ARTICLE', 'LI'].includes(element.tagName);
}

function shallowDescendantMedia(element) {
  const queue = [{ node: element, depth: 0 }];
  while (queue.length) {
    const { node, depth } = queue.shift();
    if (depth > 2) continue;
    for (const child of Array.from(node.children || [])) {
      if (child.tagName === 'IMG' || child.tagName === 'PICTURE') return { kind: 'img', element: child.tagName === 'IMG' ? child : child.querySelector('img') };
      const style = (child.getAttribute('style') || '').toLowerCase();
      if (style.includes('background-image')) return { kind: 'background', element: child };
      queue.push({ node: child, depth: depth + 1 });
    }
  }
  return null;
}

function hasBackgroundImage(element) {
  const style = (element.getAttribute('style') || '').toLowerCase();
  return style.includes('background-image') || style.includes('background:url(') || style.includes('background: url(');
}

function resolveNudgeStep(event) {
  if (event?.shiftKey) return FRAME_NUDGE_STEP_RULE.shift;
  if (event?.altKey) return FRAME_NUDGE_STEP_RULE.alt;
  return FRAME_NUDGE_STEP_RULE.base;
}

function isSimpleSlotContainer(element) {
  const children = Array.from(element.children || []);
  if (!children.length) return true;
  return children.every((child) => ['BR', 'IMG'].includes(child.tagName));
}

function setInlineStyle(element, patch) {
  const styleMap = new Map();
  const current = element.getAttribute('style') || '';
  for (const raw of current.split(';')) {
    const [key, ...rest] = raw.split(':');
    if (!key || !rest.length) continue;
    styleMap.set(key.trim().toLowerCase(), rest.join(':').trim());
  }
  for (const [key, value] of Object.entries(patch)) {
    if (value == null || value === '') styleMap.delete(String(key).toLowerCase());
    else styleMap.set(String(key).toLowerCase(), String(value));
  }
  const next = Array.from(styleMap.entries()).map(([key, value]) => `${key}: ${value}`).join('; ');
  if (next) element.setAttribute('style', next);
  else element.removeAttribute('style');
  if (element?.dataset) {
    if (next) element.dataset.exportStyle = next;
    else element.removeAttribute('data-export-style');
  }
  return next;
}

function encodeData(value) {
  return encodeURIComponent(String(value ?? ''));
}

function decodeData(value) {
  try {
    return decodeURIComponent(String(value || ''));
  } catch {
    return String(value || '');
  }
}

function stripTransientRuntime(doc) {
  doc.getElementById(FRAME_STYLE_ID)?.remove();
  for (const runtimeNode of Array.from(doc.querySelectorAll('[data-editor-runtime="1"]'))) runtimeNode.remove();
  for (const element of Array.from(doc.querySelectorAll('*'))) {
    const nextClass = removeEditorCssClasses(element.getAttribute('class') || '');
    if (nextClass) element.setAttribute('class', nextClass);
    else element.removeAttribute('class');
    element.removeAttribute('contenteditable');
    element.removeAttribute('spellcheck');
    element.removeAttribute('data-detected-slot');
    element.removeAttribute('data-detected-slot-label');
    element.removeAttribute('data-detected-slot-score');
    element.removeAttribute('data-detected-slot-reasons');
    element.removeAttribute('data-slot-near-miss');
    element.removeAttribute('data-editor-crop-active');
    element.removeAttribute('data-editor-crop-zoom');
    element.removeAttribute('data-editor-crop-offset-x');
    element.removeAttribute('data-editor-crop-offset-y');
  }
}

function stripFinalEditorRuntime(doc) {
  stripTransientRuntime(doc);
  for (const element of Array.from(doc.querySelectorAll('*'))) {
    for (const attr of Array.from(element.attributes)) {
      const name = attr.name;
      if (name.startsWith('data-export-')) element.removeAttribute(name);
      if (name.startsWith('data-editor-')) element.removeAttribute(name);
      if (name.startsWith('data-normalized-')) element.removeAttribute(name);
      if (name.startsWith('data-original-')) element.removeAttribute(name);
      if (name === 'data-last-applied-file-name') element.removeAttribute(name);
    }
  }
}

function ensureFrameStyle(doc) {
  if (doc.getElementById(FRAME_STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = FRAME_STYLE_ID;
  style.textContent = `
    [data-detected-slot] { position: relative; }
    [data-detected-slot="explicit"], [data-detected-slot="manual"] {
      outline: 2px solid rgba(47, 109, 246, 0.92);
      outline-offset: -2px;
    }
    [data-detected-slot="heuristic"] {
      outline: 2px dashed rgba(15, 159, 110, 0.92);
      outline-offset: -2px;
    }
    [data-slot-near-miss] {
      box-shadow: inset 0 0 0 2px rgba(217, 119, 6, 0.32);
    }
    [data-detected-slot]::after {
      content: attr(data-detected-slot) ' · ' attr(data-detected-slot-label);
      position: absolute;
      left: 8px;
      top: 8px;
      z-index: 999999;
      max-width: calc(100% - 16px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 999px;
      background: rgba(255,255,255,0.95);
      color: #10213a;
      border: 1px solid rgba(16,33,58,0.18);
      box-shadow: 0 8px 20px rgba(16,33,58,0.12);
      padding: 4px 8px;
      font: 700 11px/1.35 Pretendard, Noto Sans KR, sans-serif;
      pointer-events: none;
    }
    .__phase5_selected_slot {
      outline: 3px solid rgba(220, 38, 38, 0.96) !important;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.14) inset;
    }
    .__phase5_selected_text {
      outline: 3px solid rgba(16, 185, 129, 0.96) !important;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.14) inset;
    }
    .__phase5_selected_box {
      outline: 3px solid rgba(37, 99, 235, 0.96) !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14) inset;
    }
    .__phase5_selected_multi {
      outline: 2px dashed rgba(139, 92, 246, 0.96) !important;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12) inset;
    }
    .__phase5_drop_hover {
      outline: 3px dashed rgba(37, 99, 235, 0.98) !important;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12) inset;
    }
    .__phase5_runtime_image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 50%;
      user-select: none;
      -webkit-user-drag: none;
    }
    .__phase5_text_editing {
      outline: 3px solid rgba(245, 158, 11, 0.96) !important;
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.16) inset;
      caret-color: #111827;
      background: rgba(255,255,255,0.02);
    }
    .__phase6_locked_outline {
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.24) inset;
    }
    .__phase6_marquee_box {
      position: fixed;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 999997;
      border: 1px dashed rgba(37, 99, 235, 0.94);
      background: rgba(59, 130, 246, 0.12);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.4) inset;
      display: none;
    }
    .__phase6_snap_line_x, .__phase6_snap_line_y {
      position: fixed;
      pointer-events: none;
      z-index: 999996;
      display: none;
      background: rgba(14, 165, 233, 0.92);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.35);
    }
    .__phase6_snap_line_x { width: 1px; top: 0; bottom: 0; }
    .__phase6_snap_line_y { height: 1px; left: 0; right: 0; }
    .__phase6_dragging_cursor, .__phase6_dragging_cursor * {
      cursor: grabbing !important;
      user-select: none !important;
    }
  `;
  doc.head.appendChild(style);
}
function createFrameEditor({
  iframe,
  project,
  selectionMode = 'smart',
  initialSnapshot = null,
  onStateChange = () => {},
  onStatus = () => {},
  onMutation = () => {},
  onShortcut = () => {},
}) {
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  ensureFrameStyle(doc);

  let destroyed = false;
  let currentSelectionMode = initialSnapshot?.selectionMode || selectionMode;
  let detection = { candidates: [], nearMisses: [], summary: { totalCount: 0, nearMissCount: 0 } };
  let slotMap = new Map();
  let selectedElements = [];
  let selectedElement = null;
  let selectedInfo = null;
  let hoverSlot = null;
  let editingTextElement = null;
  let editingTextOriginalHtml = '';
  let imageCropRuntime = null;
  let dragState = null;
  let resizeState = null;
  let suppressClickUntil = 0;
  let overlayNodes = null;
  const slotBackupMap = new Map();
  const modifiedSlots = new Set();
  const editorModel = createEditorModel(doc);
  let lastCommittedSnapshot = initialSnapshot?.html ? { ...initialSnapshot } : null;

  function uniqueConnectedElements(items) {
    const seen = new Set();
    const result = [];
    for (const element of items || []) {
      if (!element || !element.isConnected) continue;
      const uid = element.dataset?.nodeUid || nextId('node');
      element.dataset.nodeUid = uid;
      if (seen.has(uid)) continue;
      seen.add(uid);
      result.push(element);
    }
    return result;
  }

  function isGroupElement(element) {
    return !!element && isElement(element) && element.dataset?.nodeRole === 'group';
  }

  function filterTopLevelSelection(items) {
    const selected = uniqueConnectedElements(items);
    return selected.filter((element) => !selected.some((other) => other !== element && other.contains(element)));
  }

  function buildAncestorChain(element) {
    const chain = [];
    let cursor = element;
    while (cursor && cursor !== doc && isElement(cursor)) {
      chain.push(cursor);
      cursor = cursor.parentElement;
    }
    return chain;
  }

  function lowestCommonAncestor(elements) {
    const targets = uniqueConnectedElements(elements).filter((element) => element !== doc.documentElement && element !== doc.body);
    if (!targets.length) return null;
    if (targets.length === 1) return targets[0].parentElement || null;
    const baseChain = buildAncestorChain(targets[0]);
    for (const candidate of baseChain) {
      const shared = targets.every((element) => element === candidate || candidate.contains(element));
      if (shared) return candidate;
    }
    return null;
  }

  function resolveGroupScope(targets) {
    const orderedTargets = filterTopLevelSelection(targets).filter((element) => !isLockedElement(element));
    if (orderedTargets.length < 2) return { ok: false, message: '그룹은 2개 이상 선택해야 합니다.' };
    const lca = lowestCommonAncestor(orderedTargets);
    if (!lca || ['HTML', 'BODY'].includes(lca.tagName) || lca === doc.body) {
      return { ok: false, message: '그룹을 만들 공통 부모를 찾지 못했습니다.' };
    }
    if (isGroupElement(lca)) {
      return { ok: false, message: '이미 그룹 내부입니다. 하위 요소를 직접 선택해 주세요.' };
    }
    if (orderedTargets.some((element) => element === lca)) {
      return { ok: false, message: '공통 조상 자체는 그룹 대상으로 선택할 수 없습니다.' };
    }
    return { ok: true, targets: orderedTargets, parent: lca };
  }

  function resolveDirectChildUnderParent(element, parent) {
    let cursor = element;
    while (cursor && cursor.parentElement && cursor.parentElement !== parent) cursor = cursor.parentElement;
    if (cursor?.parentElement === parent) return cursor;
    return null;
  }

  function stabilizeGroupedChildLayout(child, beforeRect) {
    if (!child || !beforeRect) return;
    const afterRect = child.getBoundingClientRect();
    const dx = beforeRect.left - afterRect.left;
    const dy = beforeRect.top - afterRect.top;
    if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
    shiftElementBy(child, dx, dy);
  }

  function buildGroupRestoreMeta(records) {
    return encodeData(JSON.stringify(records.map((record) => ({
      uid: record.uid,
      parentUid: record.parentUid,
      nextSiblingUid: record.nextSiblingUid,
      index: record.index,
    }))));
  }

  function readGroupRestoreMeta(group) {
    try {
      return JSON.parse(decodeData(group?.dataset?.groupRestoreMeta || '[]'));
    } catch {
      return [];
    }
  }

  function runGroupLayerSyncValidation({ action = 'group', expectedSelectionUids = [] } = {}) {
    const layerTree = buildLayerTree();
    const layerUids = new Set(layerTree.map((item) => item.uid));
    const selectedUids = uniqueConnectedElements(selectedElements).map((element) => element.dataset.nodeUid).filter(Boolean);
    const missingSelection = selectedUids.filter((uid) => !layerUids.has(uid));
    const expectedMissing = expectedSelectionUids.filter((uid) => uid && !selectedUids.includes(uid));
    if (!missingSelection.length && !expectedMissing.length) return;
    onStatus(
      `[검증:${action}] 레이어/선택 동기화 확인 필요 · layer누락:${missingSelection.length} · selection누락:${expectedMissing.length}`
    );
  }

  function canGroupSelection() {
    return resolveGroupScope(selectedElements).ok;
  }

  function canUngroupSelection() {
    const targets = filterTopLevelSelection(selectedElements);
    if (!targets.length) return false;
    if (targets.some((element) => isGroupElement(element) && !isLockedElement(element))) return true;
    return targets.some((element) => isGroupElement(element.parentElement) && !isLockedElement(element.parentElement));
  }

  function placeholderTextValue(element) {
    return [
      element?.getAttribute?.('data-slot-label') || '',
      element?.getAttribute?.('aria-label') || '',
      element?.getAttribute?.('title') || '',
      element?.getAttribute?.('alt') || '',
      element?.textContent || '',
    ].join(' ').replace(/\s+/g, ' ').trim();
  }

  function isSectionLike(element) {
    if (!element || !isElement(element)) return false;
    const className = typeof element.className === 'string' ? element.className : '';
    return element.tagName === 'SECTION' || /(^|\s)(hero|section|hb-info-wrap|page)(\s|$)/i.test(className);
  }

  function isHiddenElement(element) {
    return !!element && isElement(element) && (element.dataset.editorHidden === '1' || !!element.closest?.('[data-editor-hidden="1"]'));
  }

  function isLockedElement(element) {
    return !!element && isElement(element) && (element.dataset.editorLocked === '1' || !!element.closest?.('[data-editor-locked="1"]'));
  }

  function ensureOverlayNodes() {
    if (overlayNodes) return overlayNodes;
    const marquee = doc.createElement('div');
    marquee.className = '__phase6_marquee_box';
    marquee.dataset.editorRuntime = '1';
    const lineX = doc.createElement('div');
    lineX.className = '__phase6_snap_line_x';
    lineX.dataset.editorRuntime = '1';
    const lineY = doc.createElement('div');
    lineY.className = '__phase6_snap_line_y';
    lineY.dataset.editorRuntime = '1';
    const resizeBox = doc.createElement('div');
    resizeBox.className = '__phase7_resize_box';
    resizeBox.dataset.editorRuntime = '1';
    resizeBox.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;display:none;z-index:999998;border:1px solid rgba(14,165,233,0.95);pointer-events:none;box-shadow:0 0 0 1px rgba(255,255,255,0.55)';
    const handles = {};
    for (const corner of ['nw', 'ne', 'sw', 'se']) {
      const handle = doc.createElement('button');
      handle.type = 'button';
      handle.className = '__phase7_resize_handle';
      handle.dataset.editorRuntime = '1';
      handle.dataset.resizeCorner = corner;
      handle.style.cssText = 'position:fixed;width:12px;height:12px;border-radius:999px;border:2px solid #fff;background:#0ea5e9;z-index:999999;display:none;padding:0;cursor:nwse-resize';
      if (corner === 'ne' || corner === 'sw') handle.style.cursor = 'nesw-resize';
      handles[corner] = handle;
    }
    doc.body.append(marquee, lineX, lineY, resizeBox, handles.nw, handles.ne, handles.sw, handles.se);
    overlayNodes = { marquee, lineX, lineY, resizeBox, handles };
    return overlayNodes;
  }

  function hideInteractionOverlay() {
    const nodes = ensureOverlayNodes();
    nodes.marquee.style.display = 'none';
    nodes.lineX.style.display = 'none';
    nodes.lineY.style.display = 'none';
    doc.documentElement.classList.remove('__phase6_dragging_cursor');
    doc.body.classList.remove('__phase6_dragging_cursor');
  }

  function hideResizeOverlay() {
    const nodes = ensureOverlayNodes();
    nodes.resizeBox.style.display = 'none';
    for (const handle of Object.values(nodes.handles)) handle.style.display = 'none';
  }

  function updateResizeOverlay() {
    const target = selectedElement;
    if (!target || !target.isConnected || selectedElements.length !== 1 || editingTextElement || isHiddenElement(target)) {
      hideResizeOverlay();
      return;
    }
    const rect = target.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      hideResizeOverlay();
      return;
    }
    const nodes = ensureOverlayNodes();
    const box = nodes.resizeBox;
    box.style.display = 'block';
    box.style.left = `${rect.left}px`;
    box.style.top = `${rect.top}px`;
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;

    const map = {
      nw: { x: rect.left, y: rect.top },
      ne: { x: rect.right, y: rect.top },
      sw: { x: rect.left, y: rect.bottom },
      se: { x: rect.right, y: rect.bottom },
    };
    for (const [corner, handle] of Object.entries(nodes.handles)) {
      const point = map[corner];
      handle.style.display = 'block';
      handle.style.left = `${point.x - 6}px`;
      handle.style.top = `${point.y - 6}px`;
    }
  }

  function showMarqueeRect(rect) {
    const nodes = ensureOverlayNodes();
    nodes.marquee.style.display = 'block';
    nodes.marquee.style.left = `${rect.left}px`;
    nodes.marquee.style.top = `${rect.top}px`;
    nodes.marquee.style.width = `${Math.max(0, rect.width)}px`;
    nodes.marquee.style.height = `${Math.max(0, rect.height)}px`;
  }

  function showSnapLines({ x = null, y = null } = {}) {
    const nodes = ensureOverlayNodes();
    nodes.lineX.style.display = Number.isFinite(x) ? 'block' : 'none';
    nodes.lineY.style.display = Number.isFinite(y) ? 'block' : 'none';
    if (Number.isFinite(x)) nodes.lineX.style.left = `${x}px`;
    if (Number.isFinite(y)) nodes.lineY.style.top = `${y}px`;
  }

  function normalizeClientRect(startX, startY, endX, endY) {
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const right = Math.max(startX, endX);
    const bottom = Math.max(startY, endY);
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }

  function rectIntersects(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  function unionRect(records) {
    if (!records?.length) return null;
    const left = Math.min(...records.map((item) => item.left));
    const top = Math.min(...records.map((item) => item.top));
    const right = Math.max(...records.map((item) => item.right));
    const bottom = Math.max(...records.map((item) => item.bottom));
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }

  function collectInteractiveLayers() {
    const root = doc.querySelector('.page') || doc.body;
    const items = [];
    function walk(parent, depth) {
      for (const child of Array.from(parent.children || [])) {
        if (!child.dataset.nodeUid) child.dataset.nodeUid = nextId('node');
        const expose = shouldExposeLayer(child, depth);
        if (expose && !isHiddenElement(child)) items.push(child);
        if (depth < 4) walk(child, expose ? depth + 1 : depth);
      }
    }
    walk(root, 0);
    return items;
  }

  function buildSnapCandidates(excludedUids = new Set()) {
    return collectInteractiveLayers()
      .filter((element) => !excludedUids.has(element.dataset.nodeUid) && !isLockedElement(element) && !isHiddenElement(element))
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter((item) => item.rect.width > 0 && item.rect.height > 0);
  }

  function computeSnapAdjustment(box, dx, dy, candidates) {
    const tolerance = 8;
    const movingX = [box.left + dx, box.left + box.width / 2 + dx, box.right + dx];
    const movingY = [box.top + dy, box.top + box.height / 2 + dy, box.bottom + dy];
    let bestX = { diff: tolerance + 1, guide: null, adjust: 0 };
    let bestY = { diff: tolerance + 1, guide: null, adjust: 0 };

    for (const candidate of candidates) {
      const rect = candidate.rect;
      const targetX = [rect.left, rect.left + rect.width / 2, rect.right];
      const targetY = [rect.top, rect.top + rect.height / 2, rect.bottom];
      for (const line of targetX) {
        for (const current of movingX) {
          const diff = line - current;
          if (Math.abs(diff) < Math.abs(bestX.diff) && Math.abs(diff) <= tolerance) bestX = { diff, guide: line, adjust: diff };
        }
      }
      for (const line of targetY) {
        for (const current of movingY) {
          const diff = line - current;
          if (Math.abs(diff) < Math.abs(bestY.diff) && Math.abs(diff) <= tolerance) bestY = { diff, guide: line, adjust: diff };
        }
      }
    }

    return {
      dx: dx + (Number.isFinite(bestX.adjust) ? bestX.adjust : 0),
      dy: dy + (Number.isFinite(bestY.adjust) ? bestY.adjust : 0),
      guideX: Number.isFinite(bestX.guide) ? bestX.guide : null,
      guideY: Number.isFinite(bestY.guide) ? bestY.guide : null,
      snappedX: Number.isFinite(bestX.guide),
      snappedY: Number.isFinite(bestY.guide),
    };
  }

  function layerTypeOf(element) {
    if (!element || !isElement(element)) return 'box';
    if (isGroupElement(element)) return 'group';
    if (element.hasAttribute('data-detected-slot') || element.matches(EXPLICIT_SLOT_SELECTOR) || element.dataset.manualSlot === '1') return 'slot';
    if (isTextyElement(element)) return 'text';
    if (isSectionLike(element)) return 'section';
    return 'box';
  }

  function shouldExposeLayer(element, depth = 0) {
    if (!element || !isElement(element)) return false;
    if (['IMG', 'SOURCE', 'SCRIPT', 'STYLE', 'META', 'LINK'].includes(element.tagName)) return false;
    const type = layerTypeOf(element);
    if (type === 'slot' || type === 'text' || type === 'section') return true;
    const className = typeof element.className === 'string' ? element.className : '';
    if (depth <= 1 && isBoxyElement(element)) return true;
    return depth <= 2 && /(card|wrap|holder|group|item|content|body|box|visual|thumb|media|title|desc|question|answer)/i.test(className);
  }

  function buildLayerTree() {
    const root = doc.querySelector('.page') || doc.body;
    const items = [];
    const selectedUids = new Set(selectedElements.map((element) => element.dataset.nodeUid));

    function walk(parent, depth) {
      for (const child of Array.from(parent.children || [])) {
        if (!child.dataset.nodeUid) child.dataset.nodeUid = nextId('node');
        const expose = shouldExposeLayer(child, depth);
        if (expose) {
          const selectedViaGroup = selectedElements.some((selected) => isGroupElement(selected) && selected !== child && selected.contains(child));
          items.push({
            uid: child.dataset.nodeUid,
            label: buildLabel(child),
            type: layerTypeOf(child),
            tagName: child.tagName.toLowerCase(),
            depth,
            childCount: child.children?.length || 0,
            selected: selectedUids.has(child.dataset.nodeUid),
            selectedViaGroup,
            hidden: child.dataset.editorHidden === '1',
            locked: child.dataset.editorLocked === '1',
          });
        }
        if (depth < 4) walk(child, expose ? depth + 1 : depth);
      }
    }

    walk(root, 0);
    return items.slice(0, 400);
  }

  function rgbToHex(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.startsWith('#')) {
      if (raw.length === 4) return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toLowerCase();
      return raw.toLowerCase();
    }
    const match = raw.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (!match) return '';
    const toHex = (num) => Number(num).toString(16).padStart(2, '0');
    return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`;
  }

  function formatNumberString(value, precision = 2) {
    const num = Number.parseFloat(value);
    if (!Number.isFinite(num)) return '';
    const rounded = Number(num.toFixed(precision));
    return String(rounded);
  }

  function getTextTargets() {
    const targets = selectedElements.filter((element) => selectionTypeOf(element) === 'text');
    if (targets.length) return targets;
    if (selectedElement && selectionTypeOf(selectedElement) === 'text') return [selectedElement];
    return [];
  }

  function getTextStyleState() {
    const targets = getTextTargets();
    if (!targets.length) return { enabled: false, targetCount: 0 };
    const styles = targets.map((element) => win.getComputedStyle(element));
    const pick = (getter) => {
      const first = getter(styles[0]);
      return styles.every((style) => getter(style) === first) ? first : '';
    };
    const fontSize = pick((style) => formatNumberString(style.fontSize, 2).replace(/\.0+$/, ''));
    const lineHeight = pick((style) => {
      const fs = Number.parseFloat(style.fontSize || '0');
      const lh = Number.parseFloat(style.lineHeight || '0');
      if (!Number.isFinite(fs) || !Number.isFinite(lh) || !fs) return '';
      return formatNumberString(lh / fs, 2);
    });
    const letterSpacing = pick((style) => {
      const fs = Number.parseFloat(style.fontSize || '0');
      const ls = Number.parseFloat(style.letterSpacing || '0');
      if (!Number.isFinite(fs) || !fs || !Number.isFinite(ls)) return '';
      return formatNumberString(ls / fs, 3);
    });
    return {
      enabled: true,
      targetCount: targets.length,
      fontSize,
      lineHeight,
      letterSpacing,
      fontWeight: pick((style) => String(style.fontWeight || '')),
      color: pick((style) => rgbToHex(style.color || '')),
      textAlign: pick((style) => String(style.textAlign || '')),
    };
  }

  function pickSharedStyleValue(elements, getter) {
    if (!elements.length) return { mixed: false, value: '' };
    const first = getter(win.getComputedStyle(elements[0]));
    const same = elements.every((element) => getter(win.getComputedStyle(element)) === first);
    return {
      mixed: !same,
      value: same ? first : '',
    };
  }

  function buildObjectInspectorProfile() {
    const targets = uniqueConnectedElements(selectedElements).filter(Boolean);
    if (!targets.length) return null;
    const geometry = summarizeGeometryForSelection(targets);
    const typeSet = new Set(targets.map((element) => selectionTypeOf(element)));
    const sharedOpacity = pickSharedStyleValue(targets, (style) => formatNumberString(style.opacity, 2));
    const sharedDisplay = pickSharedStyleValue(targets, (style) => style.display || '');
    const sharedVisibility = pickSharedStyleValue(targets, (style) => style.visibility || '');
    const sharedPosition = pickSharedStyleValue(targets, (style) => style.position || '');
    const sharedZIndex = pickSharedStyleValue(targets, (style) => style.zIndex || '');
    const primary = selectedElement || targets[0];
    const imageElement = primary?.querySelector?.('img') || (primary?.tagName === 'IMG' ? primary : null);
    const primaryStyle = primary ? win.getComputedStyle(primary) : null;
    const imageStyle = imageElement ? win.getComputedStyle(imageElement) : null;
    const textState = getTextStyleState();
    return {
      common: {
        transform: {
          x: geometry?.relative?.x ?? '',
          y: geometry?.relative?.y ?? '',
          w: geometry?.relative?.w ?? '',
          h: geometry?.relative?.h ?? '',
          mixed: geometry?.relative?.mixed || {},
        },
        appearance: {
          opacity: sharedOpacity.mixed ? '' : sharedOpacity.value,
          display: sharedDisplay.mixed ? '' : sharedDisplay.value,
          visibility: sharedVisibility.mixed ? '' : sharedVisibility.value,
          mixed: {
            opacity: sharedOpacity.mixed,
            display: sharedDisplay.mixed,
            visibility: sharedVisibility.mixed,
          },
        },
        layout: {
          position: sharedPosition.mixed ? '' : sharedPosition.value,
          zIndex: sharedZIndex.mixed ? '' : sharedZIndex.value,
          mixed: {
            position: sharedPosition.mixed,
            zIndex: sharedZIndex.mixed,
          },
        },
      },
      plugins: {
        text: textState.enabled ? {
          targetCount: textState.targetCount,
          fontSize: textState.fontSize,
          lineHeight: textState.lineHeight,
          letterSpacing: textState.letterSpacing,
          color: textState.color,
          fontWeight: textState.fontWeight,
          textAlign: textState.textAlign,
        } : null,
        image: typeSet.has('slot') ? {
          fit: imageStyle?.objectFit || primaryStyle?.backgroundSize || '',
          position: imageStyle?.objectPosition || primaryStyle?.backgroundPosition || '',
        } : null,
        vector: typeSet.has('box') ? {
          borderRadius: primaryStyle?.borderRadius || '',
          background: primaryStyle?.backgroundColor || '',
          border: primaryStyle?.border || '',
        } : null,
      },
    };
  }

  function getDerivedMeta() {
    const selectedItems = selectedElements.map((element) => buildSelectionInfo(element)).filter(Boolean);
    const layerTree = buildLayerTree();
    const sectionRecords = listEditableSections();
    const sections = sectionRecords.map((section) => ({ uid: section.uid, name: section.name, index: section.index }));
    const selectedSectionUid = selectedElements.map((element) => {
      const uid = element?.dataset?.nodeUid || '';
      const exact = sectionRecords.find((section) => section.uid === uid);
      if (exact) return exact.uid;
      return sectionRecords.find((section) => section.element.contains(element))?.uid || '';
    }).find(Boolean) || '';
    return {
      selected: selectedInfo,
      selectedItems,
      selectionCount: selectedItems.length,
      sections,
      selectedSectionUid,
      slots: detection.candidates,
      nearMisses: detection.nearMisses,
      slotSummary: detection.summary,
      modifiedSlotCount: modifiedSlots.size,
      selectionMode: currentSelectionMode,
      textEditing: !!editingTextElement,
      hiddenCount: layerTree.filter((item) => item.hidden).length,
      lockedCount: layerTree.filter((item) => item.locked).length,
      interaction: dragState ? { mode: dragState.mode, moved: !!dragState.moved } : null,
      layerTree,
      textStyle: getTextStyleState(),
      preflight: buildPreflightReport(),
      canGroupSelection: canGroupSelection(),
      canUngroupSelection: canUngroupSelection(),
      objectInspector: buildObjectInspectorProfile(),
    };
  }

  function emitState() {
    updateResizeOverlay();
    onStateChange(getDerivedMeta());
  }

  function refreshDerivedMeta() {
    emitState();
  }

  function emitMutation(label) {
    const before = lastCommittedSnapshot || captureSnapshot('before-command');
    const after = captureSnapshot(label);
    lastCommittedSnapshot = after;
    onMutation({ type: 'command', id: nextId('cmd'), label, before, after, modelVersion: editorModel.version, at: new Date().toISOString() });
  }

  function unsupportedCommandResult(command) {
    return { ok: false, message: `${UNSUPPORTED_COMMAND_MESSAGE_PREFIX} ${command}` };
  }

  function getElementByUid(uid) {
    if (!uid) return null;
    return doc.querySelector(`[data-node-uid="${uid}"]`);
  }

  function getSelectedSlotElement() {
    const current = selectedElement;
    if (current && (current.hasAttribute('data-detected-slot') || current.matches(EXPLICIT_SLOT_SELECTOR))) return current;
    if (current) {
      const match = current.closest?.('[data-detected-slot], [data-image-slot], .image-slot, .drop-slot');
      if (match) return match;
    }
    return selectedElements.find((element) => element.hasAttribute('data-detected-slot') || element.matches(EXPLICIT_SLOT_SELECTOR)) || null;
  }

  function selectionTypeOf(element) {
    if (!element) return '';
    if (isGroupElement(element)) return 'group';
    if (element.hasAttribute('data-detected-slot') || element.matches(EXPLICIT_SLOT_SELECTOR) || element.dataset.manualSlot === '1') return 'slot';
    if (isTextyElement(element)) return 'text';
    return 'box';
  }

  function buildSelectionInfo(element) {
    if (!element) return null;
    const detectedType = element.getAttribute('data-detected-slot') || (element.matches(EXPLICIT_SLOT_SELECTOR) ? 'explicit' : '');
    const score = Number(element.getAttribute('data-detected-slot-score') || 0) || (detectedType ? 999 : 0);
    const reasons = (element.getAttribute('data-detected-slot-reasons') || '').split('|').map((item) => item.trim()).filter(Boolean);
    return {
      uid: element.dataset.nodeUid || '',
      type: selectionTypeOf(element),
      label: buildLabel(element),
      detectedType,
      score,
      reasons,
      tagName: element.tagName.toLowerCase(),
      hidden: element.dataset.editorHidden === '1',
      locked: isLockedElement(element),
      textEditing: editingTextElement === element,
    };
  }

  function clearSelectionClasses() {
    for (const element of Array.from(doc.querySelectorAll('.__phase5_selected_slot, .__phase5_selected_text, .__phase5_selected_box, .__phase5_selected_multi'))) {
      element.classList.remove('__phase5_selected_slot', '__phase5_selected_text', '__phase5_selected_box', '__phase5_selected_multi');
    }
  }

  function syncSelectionInfo() {
    selectedElements = uniqueConnectedElements(selectedElements);
    selectedElement = selectedElements[0] || null;
    selectedInfo = buildSelectionInfo(selectedElement);
  }

  function applySelectionClasses() {
    selectedElements.forEach((element, index) => {
      if (!element) return;
      if (index === 0) {
        const type = selectionTypeOf(element);
        element.classList.add(type === 'slot' ? '__phase5_selected_slot' : type === 'text' ? '__phase5_selected_text' : '__phase5_selected_box');
      } else {
        element.classList.add('__phase5_selected_multi');
      }
    });
  }

  function selectElements(nextElements, { silent = false } = {}) {
    if (imageCropRuntime) {
      const nextSingle = uniqueConnectedElements(nextElements)[0] || null;
      if (!nextSingle || nextSingle !== imageCropRuntime.slot) finishImageCropMode({ apply: true, emit: false });
    }
    clearSelectionClasses();
    selectedElements = uniqueConnectedElements(nextElements);
    syncSelectionInfo();
    applySelectionClasses();
    if (!silent) emitState();
  }

  function selectElement(element, { silent = false, additive = false, toggle = false } = {}) {
    if (!element) {
      if (!additive) selectElements([], { silent });
      return;
    }
    if (!additive) return selectElements([element], { silent });
    const current = uniqueConnectedElements(selectedElements);
    const uid = element.dataset.nodeUid || nextId('node');
    element.dataset.nodeUid = uid;
    const exists = current.some((item) => item.dataset.nodeUid === uid);
    if (exists && toggle) {
      const next = current.filter((item) => item.dataset.nodeUid !== uid);
      return selectElements(next, { silent });
    }
    const next = [element, ...current.filter((item) => item.dataset.nodeUid !== uid)];
    return selectElements(next, { silent });
  }

  function clearHover() {
    if (hoverSlot) hoverSlot.classList.remove('__phase5_drop_hover');
    hoverSlot = null;
  }

  function resolveSelectionTarget(rawTarget) {
    const target = closestElement(rawTarget);
    if (!target || ['HTML', 'BODY'].includes(target.tagName)) return null;
    if (isLockedElement(target)) return null;
    const slotTarget = target.closest?.('[data-detected-slot], [data-image-slot], .image-slot, .drop-slot') || null;
    if (currentSelectionMode === 'image') return slotTarget || target;
    if (currentSelectionMode === 'text') {
      const textTarget = target.closest?.('h1, h2, h3, h4, h5, h6, p, span, small, strong, em, b, i, u, li, td, th, label, a, button, blockquote') || (isTextyElement(target) ? target : null);
      return textTarget || slotTarget || target;
    }
    if (currentSelectionMode === 'box') {
      if (slotTarget) return slotTarget;
      let cursor = target;
      while (cursor && !['BODY', 'HTML'].includes(cursor.tagName)) {
        if (isBoxyElement(cursor)) return cursor;
        cursor = cursor.parentElement;
      }
      return target;
    }
    return slotTarget || (isTextyElement(target) ? target : null) || target;
  }

  function rememberSlotBackup(slot) {
    const uid = slot.dataset.nodeUid || nextId('node');
    slot.dataset.nodeUid = uid;
    if (slotBackupMap.has(uid)) return uid;
    const backup = { innerHTML: slot.innerHTML, style: slot.getAttribute('style') || '' };
    slotBackupMap.set(uid, backup);
    slot.dataset.editorBackupHtml = encodeData(backup.innerHTML);
    slot.dataset.editorBackupStyle = encodeData(backup.style);
    return uid;
  }

  function getPersistedBackup(slot) {
    const uid = slot?.dataset?.nodeUid || '';
    if (!uid) return null;
    if (slotBackupMap.has(uid)) return slotBackupMap.get(uid);
    if (!slot.hasAttribute('data-editor-backup-html') && !slot.hasAttribute('data-editor-backup-style')) return null;
    const backup = {
      innerHTML: decodeData(slot.dataset.editorBackupHtml || ''),
      style: decodeData(slot.dataset.editorBackupStyle || ''),
    };
    slotBackupMap.set(uid, backup);
    return backup;
  }

  function rehydratePersistentState() {
    slotBackupMap.clear();
    modifiedSlots.clear();
    for (const element of Array.from(doc.querySelectorAll('[data-editor-backup-html], [data-editor-backup-style]'))) {
      if (!element.dataset.nodeUid) continue;
      slotBackupMap.set(element.dataset.nodeUid, {
        innerHTML: decodeData(element.dataset.editorBackupHtml || ''),
        style: decodeData(element.dataset.editorBackupStyle || ''),
      });
    }
    for (const element of Array.from(doc.querySelectorAll('[data-editor-modified="1"]'))) {
      if (element.dataset.nodeUid) modifiedSlots.add(element.dataset.nodeUid);
    }
  }

  function redetect({ preserveSelectionUid = '', preserveSelectionUids = null } = {}) {
    const keepUids = preserveSelectionUids || selectedElements.map((element) => element.dataset.nodeUid).filter(Boolean) || [];
    detection = collectSlotCandidates(doc, { markDom: true });
    slotMap = new Map(detection.candidates.map((item) => [item.uid, item]));
    const refreshedModel = createEditorModel(doc);
    editorModel.nodes.clear();
    for (const [uid, node] of refreshedModel.nodes.entries()) editorModel.nodes.set(uid, node);
    editorModel.version = refreshedModel.version;
    const keepElements = uniqueConnectedElements(keepUids.map((uid) => getElementByUid(uid)));
    if (keepElements.length) selectElements(keepElements, { silent: true });
    else if (preserveSelectionUid || initialSnapshot?.selectedUid) {
      const keepElement = getElementByUid(preserveSelectionUid || initialSnapshot?.selectedUid || '');
      if (keepElement) selectElements([keepElement], { silent: true });
      else selectElements([], { silent: true });
    } else {
      syncSelectionInfo();
      applySelectionClasses();
    }
    emitState();
  }

  function setSelectionMode(mode) {
    currentSelectionMode = mode || 'smart';
    emitState();
    onStatus(`선택 우선 모드: ${currentSelectionMode}`);
  }

  function setElementHidden(element, hidden) {
    if (!element) return false;
    const uid = element.dataset.nodeUid || nextId('node');
    element.dataset.nodeUid = uid;
    if (!element.hasAttribute('data-editor-base-display')) element.dataset.editorBaseDisplay = encodeData(element.style.display || '');
    if (hidden) element.dataset.editorHidden = '1';
    else element.removeAttribute('data-editor-hidden');
    const baseDisplay = decodeData(element.dataset.editorBaseDisplay || '');
    patchModelNode(editorModel, uid, { style: { display: hidden ? 'none' : (baseDisplay && baseDisplay !== 'none' ? baseDisplay : null) } });
    applyModelNodesToDom(doc, editorModel, [uid]);
    element.dataset.editorModified = '1';
    modifiedSlots.add(uid);
    return true;
  }

  function setElementLocked(element, locked) {
    if (!element) return false;
    const uid = element.dataset.nodeUid || nextId('node');
    element.dataset.nodeUid = uid;
    if (locked) element.dataset.editorLocked = '1';
    else element.removeAttribute('data-editor-locked');
    patchModelNode(editorModel, uid, {});
    element.dataset.editorModified = '1';
    modifiedSlots.add(uid);
    return true;
  }

  function toggleSelectedHidden() {
    const targets = uniqueConnectedElements(selectedElements);
    if (!targets.length) return { ok: false, message: '먼저 레이어를 선택해 주세요.' };
    const nextHidden = targets.some((element) => element.dataset.editorHidden !== '1');
    targets.forEach((element) => setElementHidden(element, nextHidden));
    emitState();
    emitMutation(nextHidden ? 'hide-layer' : 'show-layer');
    return { ok: true, message: nextHidden ? `선택 레이어 ${targets.length}개를 숨겼습니다.` : `선택 레이어 ${targets.length}개를 다시 표시했습니다.` };
  }

  function toggleSelectedLocked() {
    const targets = uniqueConnectedElements(selectedElements);
    if (!targets.length) return { ok: false, message: '먼저 레이어를 선택해 주세요.' };
    const nextLocked = targets.some((element) => element.dataset.editorLocked !== '1');
    targets.forEach((element) => setElementLocked(element, nextLocked));
    emitState();
    emitMutation(nextLocked ? 'lock-layer' : 'unlock-layer');
    return { ok: true, message: nextLocked ? `선택 레이어 ${targets.length}개를 잠갔습니다.` : `선택 레이어 ${targets.length}개 잠금을 해제했습니다.` };
  }

  function toggleLayerHiddenByUid(uid) {
    const element = getElementByUid(uid);
    if (!element) return { ok: false, message: '레이어를 찾지 못했습니다.' };
    selectElements([element], { silent: true });
    return toggleSelectedHidden();
  }

  function toggleLayerLockedByUid(uid) {
    const element = getElementByUid(uid);
    if (!element) return { ok: false, message: '레이어를 찾지 못했습니다.' };
    selectElements([element], { silent: true });
    return toggleSelectedLocked();
  }

  function findSlotMediaTarget(slot) {
    const shallow = shallowDescendantMedia(slot);
    if (shallow?.kind === 'img' && shallow.element) return shallow;
    if (slot.dataset.slotMode === 'background') return { kind: 'background', element: slot };
    if (hasBackgroundImage(slot) && !isSimpleSlotContainer(slot)) return { kind: 'background', element: slot };
    if (shallow?.kind === 'background' && shallow.element && !isSimpleSlotContainer(slot)) return shallow;
    return { kind: 'img', element: slot.querySelector('img.__phase5_runtime_image, img') || null };
  }

  function clearSimplePlaceholder(slot) {
    if (!isSimpleSlotContainer(slot)) return;
    slot.innerHTML = '';
  }

  async function applyFileToSlot(slot, file, { emit = true } = {}) {
    if (!slot || !file || isLockedElement(slot)) return false;
    rememberSlotBackup(slot);
    const uid = slot.dataset.nodeUid;
    const dataUrl = await readFileAsDataUrl(file);
    const target = findSlotMediaTarget(slot);

    if (target.kind === 'background') {
      const styleTarget = target.element || slot;
      const nextStyle = setInlineStyle(styleTarget, {
        'background-image': `url("${dataUrl}")`,
        'background-size': 'cover',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
      });
      styleTarget.dataset.editorStyleModified = '1';
      styleTarget.dataset.exportStyle = nextStyle;
      slot.dataset.editorModified = '1';
    } else {
      let img = target.element;
      if (!img || !img.isConnected || img === slot) {
        clearSimplePlaceholder(slot);
        img = doc.createElement('img');
        img.className = '__phase5_runtime_image';
        slot.appendChild(img);
      }
      img.classList.add('__phase5_runtime_image');
      img.setAttribute('src', dataUrl);
      img.dataset.exportSrc = dataUrl;
      img.dataset.editorImageModified = '1';
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      setInlineStyle(img, {
        width: '100%',
        height: '100%',
        display: 'block',
        'object-fit': 'cover',
        'object-position': '50% 50%',
      });
      setInlineStyle(slot, { overflow: 'hidden' });
      slot.dataset.editorModified = '1';
    }

    modifiedSlots.add(uid);
    slot.dataset.lastAppliedFileName = file.name;
    if (emit) {
      selectElements([slot], { silent: true });
      emitState();
      onStatus(`이미지를 적용했습니다: ${file.name}`);
      emitMutation('apply-image');
    }
    return true;
  }

  async function applyFilesStartingAtSlot(slot, files) {
    const imageFiles = Array.from(files || []).filter((file) => /^image\//i.test(file.type || '') || /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(file.name || ''));
    if (!slot || !imageFiles.length) return 0;
    const slots = detection.candidates.map((item) => getElementByUid(item.uid)).filter(Boolean);
    const start = Math.max(0, slots.indexOf(slot));
    let applied = 0;
    for (let index = 0; index < imageFiles.length && start + index < slots.length; index += 1) {
      // eslint-disable-next-line no-await-in-loop
      await applyFileToSlot(slots[start + index], imageFiles[index], { emit: false });
      applied += 1;
    }
    selectElements([slot], { silent: true });
    emitState();
    onStatus(applied > 1 ? `${applied}개 이미지를 순차 배치했습니다.` : `이미지를 적용했습니다: ${imageFiles[0].name}`);
    emitMutation(applied > 1 ? 'apply-multiple-images' : 'apply-image');
    return applied;
  }

  function applyImagePreset(preset) {
    const slot = getSelectedSlotElement();
    if (!slot) return { ok: false, message: '먼저 이미지 슬롯을 선택해 주세요.' };
    const target = findSlotMediaTarget(slot);
    if (target.kind === 'background') {
      const position = preset === 'top' ? 'center top' : preset === 'bottom' ? 'center bottom' : 'center center';
      const size = preset === 'contain' ? 'contain' : 'cover';
      const nextStyle = setInlineStyle(target.element || slot, {
        'background-size': size,
        'background-position': position,
        'background-repeat': 'no-repeat',
      });
      (target.element || slot).dataset.editorStyleModified = '1';
      (target.element || slot).dataset.exportStyle = nextStyle;
      slot.dataset.editorModified = '1';
      modifiedSlots.add(slot.dataset.nodeUid);
      emitState();
      emitMutation(`preset-${preset}`);
      return { ok: true, message: `배경 이미지 프리셋 적용: ${preset}` };
    }

    const img = target.element || slot.querySelector('img');
    if (!img) return { ok: false, message: '슬롯 안에 이미지가 없습니다.' };
    const objectPosition = preset === 'top' ? '50% 0%' : preset === 'bottom' ? '50% 100%' : '50% 50%';
    const objectFit = preset === 'contain' ? 'contain' : 'cover';
    setInlineStyle(img, {
      width: '100%',
      height: '100%',
      display: 'block',
      'object-fit': objectFit,
      'object-position': objectPosition,
    });
    img.dataset.editorImageModified = '1';
    img.dataset.exportSrc = img.getAttribute('src') || img.dataset.exportSrc || '';
    slot.dataset.editorModified = '1';
    modifiedSlots.add(slot.dataset.nodeUid);
    emitState();
    emitMutation(`preset-${preset}`);
    return { ok: true, message: `이미지 프리셋 적용: ${preset}` };
  }

  function removeImageFromSelected() {
    const slot = getSelectedSlotElement();
    if (!slot) return { ok: false, message: '먼저 이미지 슬롯을 선택해 주세요.' };
    if (isLockedElement(slot)) return { ok: false, message: '잠긴 레이어는 이미지를 복구/제거할 수 없습니다.' };
    const uid = slot.dataset.nodeUid;
    const backup = getPersistedBackup(slot);
    if (!backup) return { ok: false, message: '복구할 원본 상태가 없습니다.' };
    slot.innerHTML = backup.innerHTML;
    if (backup.style) slot.setAttribute('style', backup.style);
    else slot.removeAttribute('style');
    slot.removeAttribute('data-export-style');
    slot.removeAttribute('data-editor-modified');
    slot.removeAttribute('data-last-applied-file-name');
    modifiedSlots.delete(uid);
    selectElements([slot], { silent: true });
    redetect({ preserveSelectionUids: [uid] });
    emitMutation('remove-image');
    return { ok: true, message: '슬롯 이미지를 원래 상태로 복구했습니다.' };
  }

  function markSelectedAsSlot() {
    if (!selectedElement) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
    if (isLockedElement(selectedElement)) return { ok: false, message: '잠긴 레이어는 슬롯 지정할 수 없습니다.' };
    selectedElement.dataset.manualSlot = '1';
    selectedElement.removeAttribute('data-slot-ignore');
    if (!selectedElement.getAttribute('data-image-slot')) selectedElement.setAttribute('data-image-slot', slugify(buildLabel(selectedElement) || selectedElement.dataset.nodeUid || 'slot'));
    if (!selectedElement.getAttribute('data-slot-label')) selectedElement.setAttribute('data-slot-label', buildLabel(selectedElement));
    redetect({ preserveSelectionUids: [selectedElement.dataset.nodeUid] });
    emitMutation('mark-manual-slot');
    return { ok: true, message: '선택 요소를 수동 이미지 슬롯으로 지정했습니다.' };
  }

  function demoteSelectedSlot() {
    if (!selectedElement) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
    if (isLockedElement(selectedElement)) return { ok: false, message: '잠긴 레이어는 슬롯 해제할 수 없습니다.' };
    selectedElement.dataset.slotIgnore = '1';
    selectedElement.removeAttribute('data-manual-slot');
    redetect({ preserveSelectionUids: [selectedElement.dataset.nodeUid] });
    emitMutation('ignore-slot');
    return { ok: true, message: '선택 요소를 슬롯 감지 대상에서 제외했습니다.' };
  }

  function placeCaretAtEnd(element) {
    const range = doc.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const selection = win.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function isTextEditableTarget(element) {
    return !!element && selectionTypeOf(element) === 'text';
  }

  function startTextEdit(element = selectedElement) {
    if (!isTextEditableTarget(element)) return { ok: false, message: '텍스트 요소를 먼저 선택해 주세요.' };
    if (isLockedElement(element)) return { ok: false, message: '잠긴 레이어는 텍스트 편집할 수 없습니다.' };
    if (imageCropRuntime) finishImageCropMode({ apply: true, emit: false });
    if (editingTextElement && editingTextElement !== element) finishTextEdit({ commit: true, emit: false });
    if (editingTextElement === element) return { ok: true, message: '이미 텍스트 편집 중입니다.' };
    editingTextElement = element;
    editingTextOriginalHtml = element.innerHTML;
    element.contentEditable = 'true';
    element.spellcheck = false;
    element.classList.add('__phase5_text_editing');
    selectElements([element], { silent: true });
    element.focus({ preventScroll: true });
    placeCaretAtEnd(element);
    emitState();
    return { ok: true, message: '텍스트 편집을 시작했습니다. Ctrl/Cmd+Enter로 저장, Esc로 취소합니다.' };
  }

  function finishTextEdit({ commit = true, emit = true } = {}) {
    if (!editingTextElement) return { ok: false, message: '현재 텍스트 편집 중이 아닙니다.' };
    const element = editingTextElement;
    const changed = element.innerHTML !== editingTextOriginalHtml;
    if (!commit) element.innerHTML = editingTextOriginalHtml;
    element.removeAttribute('contenteditable');
    element.removeAttribute('spellcheck');
    element.classList.remove('__phase5_text_editing');
    editingTextElement = null;
    editingTextOriginalHtml = '';
    if (element.dataset.nodeUid) modifiedSlots.add(element.dataset.nodeUid);
    selectElements([element], { silent: true });
    emitState();
    if (emit && commit && changed) emitMutation('text-edit');
    return { ok: true, message: !commit ? '텍스트 편집을 취소했습니다.' : changed ? '텍스트 수정을 저장했습니다.' : '텍스트 변경사항이 없습니다.' };
  }

  function toggleTextEdit() {
    if (editingTextElement) return finishTextEdit({ commit: true });
    return startTextEdit(selectedElement);
  }

  function updateImageCropRuntimeDataset(state) {
    if (!state?.slot || !state?.img) return;
    state.slot.dataset.editorCropActive = '1';
    state.img.dataset.editorCropActive = '1';
    state.slot.dataset.editorCropZoom = String(Number(state.zoom.toFixed(3)));
    state.slot.dataset.editorCropOffsetX = String(Number(state.offsetX.toFixed(3)));
    state.slot.dataset.editorCropOffsetY = String(Number(state.offsetY.toFixed(3)));
  }

  function updateImageCropRuntimeStyles(state) {
    if (!state?.img || !state?.slot) return;
    updateImageCropRuntimeDataset(state);
    setInlineStyle(state.slot, { overflow: 'hidden' });
    setInlineStyle(state.img, {
      transformOrigin: 'center center',
      transform: `translate(${Number(state.offsetX.toFixed(3))}px, ${Number(state.offsetY.toFixed(3))}px) scale(${Number(state.zoom.toFixed(3))})`,
    });
  }

  function resetImageCropRuntime({ emit = true } = {}) {
    if (!imageCropRuntime) return { ok: false, message: '현재 이미지 크롭 편집 중이 아닙니다.' };
    imageCropRuntime.zoom = 1;
    imageCropRuntime.offsetX = 0;
    imageCropRuntime.offsetY = 0;
    updateImageCropRuntimeStyles(imageCropRuntime);
    if (emit) emitState();
    return { ok: true, message: '이미지 크롭 위치/확대를 초기화했습니다.' };
  }

  function finishImageCropMode({ apply = true, emit = true } = {}) {
    if (!imageCropRuntime) return { ok: false, message: '현재 이미지 크롭 편집 중이 아닙니다.' };
    const state = imageCropRuntime;
    const { slot, img } = state;
    if (apply) {
      setInlineStyle(img, {
        transformOrigin: 'center center',
        transform: `translate(${Number(state.offsetX.toFixed(3))}px, ${Number(state.offsetY.toFixed(3))}px) scale(${Number(state.zoom.toFixed(3))})`,
      });
      img.dataset.editorImageModified = '1';
      slot.dataset.editorModified = '1';
      if (slot.dataset.nodeUid) modifiedSlots.add(slot.dataset.nodeUid);
    } else if (state.initialStyle) {
      img.setAttribute('style', state.initialStyle);
    } else {
      img.removeAttribute('style');
    }
    if (state.initialExportStyle) img.dataset.exportStyle = state.initialExportStyle;
    else img.removeAttribute('data-export-style');
    slot.removeAttribute('data-editor-crop-active');
    slot.removeAttribute('data-editor-crop-zoom');
    slot.removeAttribute('data-editor-crop-offset-x');
    slot.removeAttribute('data-editor-crop-offset-y');
    img.removeAttribute('data-editor-crop-active');
    imageCropRuntime = null;
    if (emit) {
      emitState();
      if (apply) emitMutation('image-crop-apply');
    }
    return { ok: true, message: apply ? '이미지 크롭 편집을 적용했습니다.' : '이미지 크롭 편집을 취소했습니다.' };
  }

  function enterImageCropMode(element = selectedElement) {
    const slot = selectionTypeOf(element) === 'slot' ? element : getSelectedSlotElement();
    if (!slot) return { ok: false, message: '먼저 이미지 슬롯을 선택해 주세요.' };
    if (isLockedElement(slot)) return { ok: false, message: '잠긴 레이어는 이미지 크롭 편집할 수 없습니다.' };
    const img = slot.querySelector('img');
    if (!img) return { ok: false, message: '슬롯 안에 이미지가 없습니다.' };
    if (editingTextElement) finishTextEdit({ commit: true, emit: false });
    if (imageCropRuntime?.slot === slot) return { ok: true, message: '이미 이미지 크롭 편집 중입니다. Enter=적용, Esc=취소.' };
    if (imageCropRuntime) finishImageCropMode({ apply: true, emit: false });
    imageCropRuntime = {
      slot,
      img,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
      initialStyle: img.getAttribute('style') || '',
      initialExportStyle: img.dataset.exportStyle || '',
    };
    selectElements([slot], { silent: true });
    updateImageCropRuntimeStyles(imageCropRuntime);
    emitState();
    return { ok: true, message: '이미지 크롭 편집 시작: 화살표 이동, +/- 확대, 0 초기화, Enter 적용, Esc 취소.' };
  }

  function readTransformState(element) {
    if (!element.dataset.editorBaseTransform) {
      const current = element.style.transform || '';
      const parsed = parseTranslateFromTransform(current);
      element.dataset.editorBaseTransform = encodeData(parsed.base);
      element.dataset.editorTx = String(parsed.tx);
      element.dataset.editorTy = String(parsed.ty);
    }
    return {
      base: decodeData(element.dataset.editorBaseTransform || ''),
      tx: Number.parseFloat(element.dataset.editorTx || '0') || 0,
      ty: Number.parseFloat(element.dataset.editorTy || '0') || 0,
    };
  }

  function parseTranslateFromTransform(transformText) {
    const value = String(transformText || '').trim();
    if (!value || value === 'none') return { base: '', tx: 0, ty: 0 };
    const match = value.match(/translate\(\s*([-+]?\d*\.?\d+)px\s*,\s*([-+]?\d*\.?\d+)px\s*\)\s*$/i);
    if (!match) return { base: value, tx: 0, ty: 0 };
    const tx = Number.parseFloat(match[1]) || 0;
    const ty = Number.parseFloat(match[2]) || 0;
    const base = value.slice(0, match.index).trim();
    return { base, tx, ty };
  }

  function writeTransformState(element, tx, ty) {
    const state = readTransformState(element);
    element.dataset.editorTx = String(Number(tx.toFixed(3)));
    element.dataset.editorTy = String(Number(ty.toFixed(3)));
    const translate = (tx || ty) ? `translate(${Number(tx.toFixed(3))}px, ${Number(ty.toFixed(3))}px)` : '';
    const base = state.base && state.base !== 'none' ? state.base : '';
    const nextTransform = [base, translate].filter(Boolean).join(' ').trim();
    const uid = element.dataset.nodeUid || nextId('node');
    element.dataset.nodeUid = uid;
    patchModelNode(editorModel, uid, {
      bounds: { x: Number(tx.toFixed(3)), y: Number(ty.toFixed(3)) },
      style: { transform: nextTransform || null },
    });
    applyModelNodesToDom(doc, editorModel, [uid]);
    element.dataset.editorModified = '1';
  }

  function shiftElementBy(element, dx, dy) {
    const state = readTransformState(element);
    writeTransformState(element, state.tx + dx, state.ty + dy);
    if (element.dataset.nodeUid) modifiedSlots.add(element.dataset.nodeUid);
  }

  function elementGeometry(element) {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    const state = readTransformState(element);
    const scrollX = Number(win.scrollX || win.pageXOffset || 0);
    const scrollY = Number(win.scrollY || win.pageYOffset || 0);
    return {
      relative: {
        x: Math.round(state.tx),
        y: Math.round(state.ty),
      },
      absolute: {
        x: Math.round(rect.left + scrollX),
        y: Math.round(rect.top + scrollY),
      },
      w: Math.max(1, Math.round(rect.width)),
      h: Math.max(1, Math.round(rect.height)),
    };
  }

  function summarizeGeometryForSelection(elements) {
    const rows = uniqueConnectedElements(elements).map((element) => elementGeometry(element)).filter(Boolean);
    if (!rows.length) return null;
    const same = (getter) => rows.every((row) => getter(row) === getter(rows[0]));
    const pick = (getter) => (same(getter) ? getter(rows[0]) : null);
    const buildMode = (mode) => ({
      x: pick((row) => row[mode].x),
      y: pick((row) => row[mode].y),
      w: pick((row) => row.w),
      h: pick((row) => row.h),
      mixed: {
        x: !same((row) => row[mode].x),
        y: !same((row) => row[mode].y),
        w: !same((row) => row.w),
        h: !same((row) => row.h),
      },
    });
    return {
      count: rows.length,
      relative: buildMode('relative'),
      absolute: buildMode('absolute'),
    };
  }

  function applyGeometryPatch(patch = {}, { coordinateSpace = 'relative' } = {}) {
    const targets = uniqueConnectedElements(selectedElements).filter((element) => !isLockedElement(element));
    if (!targets.length) return { ok: false, message: '먼저 잠기지 않은 요소를 선택해 주세요.' };
    const scrollX = Number(win.scrollX || win.pageXOffset || 0);
    const scrollY = Number(win.scrollY || win.pageYOffset || 0);
    let changed = 0;

    for (const target of targets) {
      if (Number.isFinite(patch.w) || Number.isFinite(patch.h)) {
        const stylePatch = {};
        if (Number.isFinite(patch.w)) stylePatch.width = `${Math.max(8, patch.w)}px`;
        if (Number.isFinite(patch.h)) stylePatch.height = `${Math.max(8, patch.h)}px`;
        setInlineStyle(target, stylePatch);
      }
      const state = readTransformState(target);
      let nextX = state.tx;
      let nextY = state.ty;
      if (coordinateSpace === 'absolute') {
        const rect = target.getBoundingClientRect();
        const absX = rect.left + scrollX;
        const absY = rect.top + scrollY;
        if (Number.isFinite(patch.x)) nextX = state.tx + (patch.x - absX);
        if (Number.isFinite(patch.y)) nextY = state.ty + (patch.y - absY);
      } else {
        if (Number.isFinite(patch.x)) nextX = patch.x;
        if (Number.isFinite(patch.y)) nextY = patch.y;
      }
      writeTransformState(target, nextX, nextY);
      target.dataset.editorModified = '1';
      if (target.dataset.nodeUid) modifiedSlots.add(target.dataset.nodeUid);
      changed += 1;
    }

    emitState();
    emitMutation('geometry-patch');
    return { ok: true, message: `선택 요소 ${changed}개에 XYWH를 적용했습니다.` };
  }

  function nudgeSelectedElements(dx = 0, dy = 0) {
    const targets = uniqueConnectedElements(selectedElements).filter((element) => !isLockedElement(element));
    if (!targets.length) return { ok: false, message: '먼저 잠기지 않은 요소를 선택해 주세요.' };
    for (const element of targets) shiftElementBy(element, dx, dy);
    emitState();
    emitMutation('nudge');
    return { ok: true, message: `선택 요소 ${targets.length}개를 (${dx}, ${dy})만큼 이동했습니다.` };
  }

  function duplicateSelected() {
    const targets = uniqueConnectedElements(selectedElements);
    if (!targets.length) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
    const createdUids = [];
    for (const target of targets) {
      if (!target.isConnected || target === doc.body || target.tagName === 'HTML' || target.tagName === 'BODY') continue;
      const clone = target.cloneNode(true);
      clone.dataset.nodeUid = nextId('node');
      clone.removeAttribute('id');
      target.after(clone);
      const state = readTransformState(target);
      writeTransformState(clone, state.tx + 10, state.ty + 10);
      clone.dataset.editorModified = '1';
      modifiedSlots.add(clone.dataset.nodeUid);
      createdUids.push(clone.dataset.nodeUid);
    }
    if (!createdUids.length) return { ok: false, message: '복제할 수 있는 요소가 없습니다.' };
    redetect({ preserveSelectionUids: createdUids });
    emitMutation('duplicate');
    return {
      ok: true,
      message: createdUids.length > 1
        ? `선택 요소 ${createdUids.length}개를 복제했습니다.`
        : '선택 요소를 복제했습니다.',
    };
  }

  function groupSelected() {
    const scope = resolveGroupScope(selectedElements);
    if (!scope.ok) return { ok: false, message: scope.message };
    const { parent, targets } = scope;
    const siblingOrder = Array.from(parent.children || []);
    const orderedTargets = targets.slice().sort((a, b) => {
      const aAnchor = resolveDirectChildUnderParent(a, parent);
      const bAnchor = resolveDirectChildUnderParent(b, parent);
      const ai = siblingOrder.indexOf(aAnchor);
      const bi = siblingOrder.indexOf(bAnchor);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return -1;
      if (bi === -1) return 1;
      return ai - bi;
    });
    const beforeRects = new Map(orderedTargets.map((target) => [target, target.getBoundingClientRect()]));
    const restoreMeta = orderedTargets.map((target) => {
      if (!target.dataset.nodeUid) target.dataset.nodeUid = nextId('node');
      const sourceParent = target.parentElement;
      if (sourceParent && !sourceParent.dataset.nodeUid) sourceParent.dataset.nodeUid = nextId('node');
      const nextSibling = target.nextElementSibling;
      if (nextSibling && !nextSibling.dataset.nodeUid) nextSibling.dataset.nodeUid = nextId('node');
      return {
        uid: target.dataset.nodeUid || '',
        parentUid: sourceParent?.dataset?.nodeUid || '',
        nextSiblingUid: nextSibling?.dataset?.nodeUid || '',
        index: Array.from(sourceParent?.children || []).indexOf(target),
      };
    });
    const group = doc.createElement('div');
    group.dataset.nodeRole = 'group';
    group.dataset.nodeUid = nextId('node');
    group.dataset.groupLabel = `그룹 ${orderedTargets.length}`;
    group.dataset.groupRestoreMeta = buildGroupRestoreMeta(restoreMeta);
    group.setAttribute('aria-label', group.dataset.groupLabel);
    const anchorForInsert = resolveDirectChildUnderParent(orderedTargets[0], parent);
    if (anchorForInsert && anchorForInsert.parentElement === parent) parent.insertBefore(group, anchorForInsert);
    else parent.appendChild(group);
    for (const target of orderedTargets) {
      group.appendChild(target);
      stabilizeGroupedChildLayout(target, beforeRects.get(target));
    }
    setInlineStyle(group, { position: 'relative', minHeight: '1px' });
    group.dataset.editorModified = '1';
    modifiedSlots.add(group.dataset.nodeUid);
    redetect({ preserveSelectionUids: [group.dataset.nodeUid] });
    runGroupLayerSyncValidation({ action: 'group', expectedSelectionUids: [group.dataset.nodeUid] });
    emitMutation('group-selection');
    return { ok: true, message: `선택 요소 ${orderedTargets.length}개를 그룹으로 묶었습니다.` };
  }

  function ungroupSelected() {
    const targets = filterTopLevelSelection(selectedElements);
    if (!targets.length) return { ok: false, message: '먼저 그룹(또는 그룹 안 요소)을 선택해 주세요.' };
    const groups = [];
    const seen = new Set();
    const pushGroup = (group) => {
      if (!isGroupElement(group) || !group.isConnected || isLockedElement(group)) return;
      const uid = group.dataset.nodeUid || nextId('node');
      group.dataset.nodeUid = uid;
      if (seen.has(uid)) return;
      seen.add(uid);
      groups.push(group);
    };
    for (const target of targets) {
      if (isGroupElement(target)) pushGroup(target);
      else pushGroup(target.parentElement);
    }
    if (!groups.length) return { ok: false, message: '해제할 그룹을 찾지 못했습니다.' };
    const keepSelectionUids = [];
    for (const group of groups) {
      const parent = group.parentElement;
      if (!parent) continue;
      const children = Array.from(group.children || []).filter((child) => isElement(child));
      const restoreMetaRows = readGroupRestoreMeta(group);
      const restoreMetaByUid = new Map(restoreMetaRows.map((row) => [String(row.uid || ''), row]));
      for (const child of children) {
        const childUid = child.dataset.nodeUid || '';
        const restoreMeta = restoreMetaByUid.get(childUid);
        const restoreParent = getElementByUid(restoreMeta?.parentUid || '') || parent;
        const restoreRef = getElementByUid(restoreMeta?.nextSiblingUid || '');
        if (restoreParent && restoreRef && restoreRef.parentElement === restoreParent) {
          restoreParent.insertBefore(child, restoreRef);
        } else if (restoreParent) {
          const restoreIndex = Number(restoreMeta?.index);
          const siblingAtIndex = Number.isFinite(restoreIndex) ? (restoreParent.children?.[restoreIndex] || null) : null;
          if (siblingAtIndex) restoreParent.insertBefore(child, siblingAtIndex);
          else restoreParent.appendChild(child);
        } else {
          parent.insertBefore(child, group);
        }
        if (child.dataset.nodeUid) keepSelectionUids.push(child.dataset.nodeUid);
      }
      group.remove();
    }
    redetect({ preserveSelectionUids: keepSelectionUids });
    runGroupLayerSyncValidation({ action: 'ungroup', expectedSelectionUids: keepSelectionUids });
    emitMutation('ungroup-selection');
    return { ok: true, message: `그룹 ${groups.length}개를 해제했습니다.` };
  }

  function deleteSelected() {
    return deleteSelection({
      selectedElements: () => uniqueConnectedElements(selectedElements),
      doc,
      redetect,
      emitMutation,
    });
  }

  function addElement(kind) {
    const preset = ADD_ELEMENT_PRESETS[kind];
    if (!preset) return { ok: false, message: '지원하지 않는 추가 요소 타입입니다.' };
    const parent = selectedElement?.parentElement || doc.querySelector('.page') || doc.body;
    if (!parent) return { ok: false, message: '요소를 추가할 위치를 찾지 못했습니다.' };
    const element = doc.createElement(preset.tagName || 'div');
    element.dataset.nodeUid = nextId('node');
    element.className = preset.className || '';
    if (preset.textContent) element.textContent = preset.textContent;
    for (const [key, value] of Object.entries(preset.dataset || {})) element.dataset[key] = value;
    setInlineStyle(element, preset.style || {});
    parent.appendChild(element);
    writeTransformState(element, 24, 24);
    element.dataset.editorModified = '1';
    modifiedSlots.add(element.dataset.nodeUid);
    redetect({ preserveSelectionUids: [element.dataset.nodeUid] });
    emitMutation(`add-${kind}`);
    return { ok: true, message: `${kind === 'text' ? '텍스트' : kind === 'box' ? '박스' : '이미지 슬롯'}를 추가했습니다.` };
  }

  function moveElementToLayerIndex(element, nextIndex) {
    if (!element?.parentElement) return false;
    const parent = element.parentElement;
    const siblings = Array.from(parent.children);
    const currentIndex = siblings.indexOf(element);
    if (currentIndex < 0) return false;
    const clampedIndex = Math.max(0, Math.min(siblings.length - 1, nextIndex));
    if (clampedIndex === currentIndex) return false;
    siblings.splice(currentIndex, 1);
    siblings.splice(clampedIndex, 0, element);
    for (const child of siblings) parent.appendChild(child);
    return true;
  }

  function applyLayerIndexCommand(command = 'forward') {
    const target = selectedElement;
    if (!target || !target.parentElement) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
    const siblings = Array.from(target.parentElement.children);
    const currentIndex = siblings.indexOf(target);
    if (currentIndex < 0) return { ok: false, message: '레이어 순서를 계산하지 못했습니다.' };
    const directionToIndex = {
      forward: currentIndex + 1,
      backward: currentIndex - 1,
      front: siblings.length - 1,
      back: 0,
    };
    if (!Object.prototype.hasOwnProperty.call(directionToIndex, command)) {
      return { ok: false, message: '지원하지 않는 레이어 명령입니다.' };
    }
    const moved = moveElementToLayerIndex(target, directionToIndex[command]);
    if (!moved) {
      const isFront = currentIndex === siblings.length - 1;
      const blockedByEdge = (command === 'forward' || command === 'front') ? isFront : currentIndex === 0;
      return { ok: false, message: blockedByEdge ? ((command === 'forward' || command === 'front') ? '이미 가장 앞 레이어입니다.' : '이미 가장 뒤 레이어입니다.') : '레이어 순서를 변경하지 못했습니다.' };
    }
    target.dataset.editorModified = '1';
    if (target.dataset.nodeUid) modifiedSlots.add(target.dataset.nodeUid);
    emitState();
    emitMutation(`layer-index-${command}`);
    const messageMap = {
      forward: '선택 요소를 한 단계 앞으로 보냈습니다.',
      backward: '선택 요소를 한 단계 뒤로 보냈습니다.',
      front: '선택 요소를 맨 앞으로 보냈습니다.',
      back: '선택 요소를 맨 뒤로 보냈습니다.',
    };
    return { ok: true, message: messageMap[command] || '레이어 순서를 변경했습니다.' };
  }

  function bringSelectedForward() {
    return applyLayerIndexCommand('forward');
  }

  function sendSelectedBackward() {
    return applyLayerIndexCommand('backward');
  }

  function bringSelectedToFront() {
    return applyLayerIndexCommand('front');
  }

  function sendSelectedToBack() {
    return applyLayerIndexCommand('back');
  }

  function nudgeSelectedElements(dx = 0, dy = 0) {
    const targets = uniqueConnectedElements(selectedElements).filter((element) => !isLockedElement(element));
    if (!targets.length) return { ok: false, message: '먼저 잠기지 않은 요소를 선택해 주세요.' };
    for (const element of targets) shiftElementBy(element, dx, dy);
    emitState();
    emitMutation('nudge-selection');
    return { ok: true, message: `선택 요소 ${targets.length}개를 ${dx}, ${dy}만큼 이동했습니다.` };
  }

  function nudgeImagePosition(dx = 0, dy = 0) {
    if (imageCropRuntime) {
      imageCropRuntime.offsetX += dx;
      imageCropRuntime.offsetY += dy;
      updateImageCropRuntimeStyles(imageCropRuntime);
      emitState();
      return { ok: true, message: `크롭 프리뷰를 ${dx || 0}, ${dy || 0}만큼 이동했습니다.` };
    }
    const slot = getSelectedSlotElement();
    if (!slot) return { ok: false, message: '먼저 이미지 슬롯을 선택해 주세요.' };
    const img = slot.querySelector('img');
    if (!img) return { ok: false, message: '슬롯 안에 이미지가 없습니다.' };
    const style = win.getComputedStyle(img);
    const [oxRaw = '50%', oyRaw = '50%'] = String(style.objectPosition || '50% 50%').split(/\s+/);
    const ox = Number.parseFloat(oxRaw) || 50;
    const oy = Number.parseFloat(oyRaw) || 50;
    const nextX = Math.max(0, Math.min(100, ox + dx));
    const nextY = Math.max(0, Math.min(100, oy + dy));
    setInlineStyle(img, { objectPosition: `${nextX}% ${nextY}%` });
    if (img.dataset.nodeUid) modifiedSlots.add(img.dataset.nodeUid);
    emitState();
    emitMutation('image-nudge');
    return { ok: true, message: `이미지 위치를 ${dx || 0}, ${dy || 0}만큼 미세 조정했습니다.` };
  }

  function applyBatchLayout(action) {
    const targets = uniqueConnectedElements(selectedElements).filter((element) => !isLockedElement(element));
    if (!targets.length) return { ok: false, message: '먼저 잠기지 않은 요소를 선택해 주세요.' };
    if (action !== 'reset-transform' && targets.length < 2) return { ok: false, message: '정렬/간격 작업은 2개 이상 선택해야 합니다.' };
    const records = targets.map((element) => ({ element, rect: element.getBoundingClientRect() }));
    const anchor = records[0];

    if (action === 'same-width' || action === 'same-height' || action === 'same-size') {
      for (const record of records.slice(1)) {
        const patch = {};
        if (action === 'same-width' || action === 'same-size') patch.width = `${Math.round(anchor.rect.width)}px`;
        if (action === 'same-height' || action === 'same-size') patch.height = `${Math.round(anchor.rect.height)}px`;
        setInlineStyle(record.element, patch);
        record.element.dataset.editorModified = '1';
        if (record.element.dataset.nodeUid) modifiedSlots.add(record.element.dataset.nodeUid);
      }
      emitState();
      emitMutation(action);
      return { ok: true, message: `선택 요소 ${records.length}개에 ${action} 작업을 적용했습니다.` };
    }

    if (action === 'reset-transform') {
      for (const record of records) {
        writeTransformState(record.element, 0, 0);
      }
      emitState();
      emitMutation(action);
      return { ok: true, message: '선택 요소의 배치 이동을 초기화했습니다.' };
    }

    if (action.startsWith('align-')) {
      const anchorRect = anchor.rect;
      for (const record of records.slice(1)) {
        let dx = 0;
        let dy = 0;
        if (action === 'align-left') dx = anchorRect.left - record.rect.left;
        if (action === 'align-center') dx = (anchorRect.left + anchorRect.width / 2) - (record.rect.left + record.rect.width / 2);
        if (action === 'align-right') dx = (anchorRect.left + anchorRect.width) - (record.rect.left + record.rect.width);
        if (action === 'align-top') dy = anchorRect.top - record.rect.top;
        if (action === 'align-middle') dy = (anchorRect.top + anchorRect.height / 2) - (record.rect.top + record.rect.height / 2);
        if (action === 'align-bottom') dy = (anchorRect.top + anchorRect.height) - (record.rect.top + record.rect.height);
        shiftElementBy(record.element, dx, dy);
      }
      emitState();
      emitMutation(action);
      return { ok: true, message: `선택 요소 ${records.length}개를 정렬했습니다.` };
    }

    if (action === 'distribute-horizontal' || action === 'distribute-vertical') {
      if (records.length < 3) return { ok: false, message: '분배는 3개 이상 선택해야 합니다.' };
      const sorted = [...records].sort((a, b) => action === 'distribute-horizontal' ? a.rect.left - b.rect.left : a.rect.top - b.rect.top);
      if (action === 'distribute-horizontal') {
        const span = (sorted.at(-1).rect.left + sorted.at(-1).rect.width) - sorted[0].rect.left;
        const totalWidth = sorted.reduce((sum, record) => sum + record.rect.width, 0);
        const gap = (span - totalWidth) / (sorted.length - 1);
        let cursor = sorted[0].rect.left;
        for (const record of sorted) {
          const dx = cursor - record.rect.left;
          shiftElementBy(record.element, dx, 0);
          cursor += record.rect.width + gap;
        }
      } else {
        const span = (sorted.at(-1).rect.top + sorted.at(-1).rect.height) - sorted[0].rect.top;
        const totalHeight = sorted.reduce((sum, record) => sum + record.rect.height, 0);
        const gap = (span - totalHeight) / (sorted.length - 1);
        let cursor = sorted[0].rect.top;
        for (const record of sorted) {
          const dy = cursor - record.rect.top;
          shiftElementBy(record.element, 0, dy);
          cursor += record.rect.height + gap;
        }
      }
      emitState();
      emitMutation(action);
      return { ok: true, message: `선택 요소 ${records.length}개를 균등 분배했습니다.` };
    }

    return { ok: false, message: '지원하지 않는 정렬 액션입니다.' };
  }

  function applyStackLayout({ direction = 'vertical', gap = 24, align = 'start' } = {}) {
    const axis = direction === 'horizontal' ? 'x' : 'y';
    const crossAxis = axis === 'x' ? 'y' : 'x';
    const normalizedGap = Number.isFinite(gap) ? Math.max(0, gap) : 24;
    const targets = uniqueConnectedElements(selectedElements).filter((element) => !isLockedElement(element));
    if (targets.length < 2) return { ok: false, message: '스택 정렬은 2개 이상 선택해야 합니다.' };
    const records = targets.map((element) => ({ element, rect: element.getBoundingClientRect() }));
    const sorted = [...records].sort((a, b) => axis === 'x' ? a.rect.left - b.rect.left : a.rect.top - b.rect.top);
    const anchor = sorted[0].rect;
    let cursor = axis === 'x' ? anchor.left : anchor.top;
    for (const record of sorted) {
      const primary = axis === 'x' ? record.rect.left : record.rect.top;
      const secondary = axis === 'x' ? record.rect.top : record.rect.left;
      const size = axis === 'x' ? record.rect.width : record.rect.height;
      const crossSize = axis === 'x' ? record.rect.height : record.rect.width;
      let targetCross = axis === 'x' ? anchor.top : anchor.left;
      if (align === 'center') {
        targetCross = (axis === 'x' ? anchor.top + (anchor.height - crossSize) / 2 : anchor.left + (anchor.width - crossSize) / 2);
      } else if (align === 'end') {
        targetCross = axis === 'x' ? anchor.bottom - crossSize : anchor.right - crossSize;
      }
      const deltaPrimary = cursor - primary;
      const deltaCross = targetCross - secondary;
      shiftElementBy(record.element, axis === 'x' ? deltaPrimary : deltaCross, axis === 'x' ? deltaCross : deltaPrimary);
      cursor += size + normalizedGap;
    }
    emitState();
    emitMutation(axis === 'x' ? 'stack-horizontal' : 'stack-vertical');
    return { ok: true, message: `선택 요소 ${records.length}개를 ${direction === 'horizontal' ? '가로' : '세로'} 스택으로 정렬했습니다.` };
  }

  function tidySelection({ axis = 'x' } = {}) {
    const normalizedAxis = axis === 'y' ? 'y' : 'x';
    const targets = uniqueConnectedElements(selectedElements).filter((element) => !isLockedElement(element));
    if (targets.length < 3) return { ok: false, message: '간격 맞춤은 3개 이상 선택해야 합니다.' };
    const records = targets.map((element) => ({ element, rect: element.getBoundingClientRect() }));
    const sorted = [...records].sort((a, b) => normalizedAxis === 'x' ? a.rect.left - b.rect.left : a.rect.top - b.rect.top);
    const first = sorted[0].rect;
    const last = sorted.at(-1).rect;
    const totalSize = sorted.reduce((sum, record) => sum + (normalizedAxis === 'x' ? record.rect.width : record.rect.height), 0);
    const span = normalizedAxis === 'x'
      ? (last.left + last.width) - first.left
      : (last.top + last.height) - first.top;
    const gap = (span - totalSize) / (sorted.length - 1);
    let cursor = normalizedAxis === 'x' ? first.left : first.top;
    for (const record of sorted) {
      const position = normalizedAxis === 'x' ? record.rect.left : record.rect.top;
      const size = normalizedAxis === 'x' ? record.rect.width : record.rect.height;
      const delta = cursor - position;
      shiftElementBy(record.element, normalizedAxis === 'x' ? delta : 0, normalizedAxis === 'x' ? 0 : delta);
      cursor += size + gap;
    }
    emitState();
    emitMutation(normalizedAxis === 'x' ? 'tidy-horizontal' : 'tidy-vertical');
    return { ok: true, message: `선택 요소 ${records.length}개의 ${normalizedAxis === 'x' ? '가로' : '세로'} 간격을 균등화했습니다.` };
  }

  function applyTextStyle(patch = {}, { clear = false } = {}) {
    const targets = getTextTargets().filter((element) => !isLockedElement(element));
    if (!targets.length) return { ok: false, message: '텍스트 요소를 먼저 선택해 주세요.' };
    for (const element of targets) {
      const stylePatch = {};
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'fontSize')) stylePatch['font-size'] = clear ? null : (patch.fontSize ? `${patch.fontSize}px` : null);
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'lineHeight')) stylePatch['line-height'] = clear ? null : (patch.lineHeight ? String(patch.lineHeight) : null);
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'letterSpacing')) stylePatch['letter-spacing'] = clear ? null : (patch.letterSpacing ? `${patch.letterSpacing}em` : null);
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'fontWeight')) stylePatch['font-weight'] = clear ? null : (patch.fontWeight || null);
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'color')) stylePatch.color = clear ? null : (patch.color || null);
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'textAlign')) stylePatch['text-align'] = clear ? null : (patch.textAlign || null);
      setInlineStyle(element, stylePatch);
      element.dataset.editorModified = '1';
      if (element.dataset.nodeUid) modifiedSlots.add(element.dataset.nodeUid);
    }
    emitState();
    emitMutation(clear ? 'clear-text-style' : 'apply-text-style');
    return { ok: true, message: clear ? `텍스트 ${targets.length}개의 인라인 스타일을 비웠습니다.` : `텍스트 ${targets.length}개에 스타일을 적용했습니다.` };
  }

  function inspectSlot(slot, slotRecord) {
    const target = findSlotMediaTarget(slot);
    let hasMedia = false;
    let unresolved = false;
    if (target.kind === 'background') {
      const styleValue = (target.element || slot).getAttribute('style') || '';
      hasMedia = /url\(/i.test(styleValue);
      unresolved = !!(target.element || slot).dataset.normalizedUnresolvedImage || /%EB%AF%B8%ED%95%B4%EA%B2%B0|미해결/i.test(styleValue);
    } else {
      const img = target.element || slot.querySelector('img');
      const src = img?.getAttribute('src') || '';
      hasMedia = !!src;
      unresolved = !!img?.dataset?.normalizedUnresolvedImage || /%EB%AF%B8%ED%95%B4%EA%B2%B0|미해결/i.test(src);
    }
    const placeholder = PLACEHOLDER_TEXT_RE.test(placeholderTextValue(slot));
    const explicitEmpty = ['explicit', 'manual'].includes(slotRecord?.type || '') && !hasMedia;
    return { hasMedia, unresolved, placeholder, explicitEmpty };
  }

  function classifyAssetPath(value) {
    const text = String(value || '').trim();
    if (!text) return 'empty';
    if (text.startsWith('uploaded:')) return 'uploaded';
    if (text.startsWith('blob:')) return 'blob';
    if (text.startsWith('data:')) return 'data';
    if (/^https?:\/\//i.test(text) || text.startsWith('//')) return 'remote';
    if (text.startsWith('#')) return 'fragment';
    if (/^[a-z][a-z0-9+.-]*:/i.test(text)) return 'custom';
    if (text.startsWith('/')) return 'absolute';
    return 'relative';
  }

  function buildPathPreservationSignals() {
    const images = Array.from(doc.querySelectorAll('img'));
    let preservedCount = 0;
    let driftCount = 0;
    let trackedCount = 0;
    let editedBlobCount = 0;
    const exportKinds = new Set();

    for (const img of images) {
      const originalRef = img.dataset.originalSrc || img.getAttribute('src') || '';
      const editedRef = img.dataset.exportSrc || img.dataset.originalSrc || img.getAttribute('src') || '';
      const originalKind = classifyAssetPath(originalRef);
      const editedKind = classifyAssetPath(editedRef);
      exportKinds.add(editedKind);
      if (editedKind === 'blob') editedBlobCount += 1;
      if (!['uploaded', 'relative'].includes(originalKind)) continue;
      trackedCount += 1;
      if (originalKind === editedKind || editedKind === 'data') preservedCount += 1;
      else driftCount += 1;
    }

    return {
      trackedCount,
      preservedCount,
      driftCount,
      editedBlobCount,
      exportKinds: Array.from(exportKinds).sort(),
    };
  }

  function buildPreflightReport() {
    const checks = [];
    const addCheck = (level, code, title, message, count = 0) => checks.push({ level, code, title, message, count });
    const emptySlots = [];
    for (const slotRecord of detection.candidates) {
      const slot = getElementByUid(slotRecord.uid);
      if (!slot || slot.dataset.slotIgnore === '1' || isHiddenElement(slot)) continue;
      const result = inspectSlot(slot, slotRecord);
      if (result.unresolved) {
        // handled below via project assets, keep slot-level info implicit
      }
      if ((result.placeholder && !result.hasMedia) || result.explicitEmpty) {
        emptySlots.push(slotRecord);
      }
    }

    if (emptySlots.length) {
      addCheck('warning', 'EMPTY_SLOT', '빈 슬롯', `플레이스홀더만 남아 있거나 실제 이미지가 없는 슬롯이 ${emptySlots.length}개 있습니다. 필요하면 [빈 슬롯만 보기]에서 빠르게 채울 수 있습니다.`, emptySlots.length);
    }
    if (project?.summary?.assetsUnresolved) {
      addCheck('warning', 'UNRESOLVED_ASSET', '미해결 자산', `정규화 단계에서 연결하지 못한 자산이 ${project.summary.assetsUnresolved}개 있습니다. 폴더 import로 다시 연결하면 자동 복구됩니다.`, project.summary.assetsUnresolved);
    }
    if (project?.remoteStylesheets?.length) {
      addCheck('warning', 'REMOTE_STYLESHEET', '원격 폰트/스타일', `원격 stylesheet ${project.remoteStylesheets.length}개가 포함되어 있어 PNG export에서 폰트가 달라질 수 있습니다.`, project.remoteStylesheets.length);
    }
    if (editingTextElement) {
      addCheck('warning', 'TEXT_EDITING', '텍스트 편집 중', '아직 저장되지 않은 텍스트 편집이 열려 있습니다. Enter 또는 텍스트 편집 버튼으로 저장 후 export하는 편이 안전합니다.', 1);
    }
    if (detection.nearMisses?.length) {
      addCheck('info', 'NEAR_MISS', '근접 후보', `자동 슬롯 감지 근접 후보가 ${detection.nearMisses.length}개 있습니다. 수동 슬롯 지정으로 보정할 수 있습니다.`, detection.nearMisses.length);
    }
    const pathSignals = buildPathPreservationSignals();
    if (pathSignals.trackedCount > 0) {
      if (pathSignals.driftCount > 0) {
        addCheck('error', 'PATH_SAVE_REOPEN_DRIFT', '경로 보존 실패(저장/재오픈)', `uploaded: 또는 상대경로 이미지 ${pathSignals.driftCount}개가 저장 경로에서 다른 스킴으로 바뀔 수 있습니다.`, pathSignals.driftCount);
      } else {
        addCheck('info', 'PATH_SAVE_REOPEN_OK', '경로 보존 확인(저장/재오픈)', `uploaded:·상대경로 추적 대상 ${pathSignals.trackedCount}개가 현재 저장 규칙과 충돌하지 않습니다.`, pathSignals.trackedCount);
      }
    }
    if (pathSignals.editedBlobCount > 0) {
      addCheck('warning', 'PATH_EXPORT_BLOB', 'export 전 blob 경로 감지', `현재 편집 상태에 blob URL ${pathSignals.editedBlobCount}개가 있습니다. export 시 data URL 치환 경로를 점검하세요.`, pathSignals.editedBlobCount);
    } else {
      addCheck('info', 'PATH_EXPORT_READY', 'export 경로 준비', `현재 export 대상 경로 스킴: ${pathSignals.exportKinds.join(', ') || 'none'}.`, pathSignals.exportKinds.length);
    }
    const fixtureContract = project?.fixtureMeta?.slot_contract || null;
    if (fixtureContract?.required_exact_count != null && detection.summary.totalCount !== fixtureContract.required_exact_count) {
      addCheck('warning', 'FIXTURE_SLOT_COUNT', 'Fixture 슬롯 수 차이', `현재 슬롯 수 ${detection.summary.totalCount}개가 fixture 기준 ${fixtureContract.required_exact_count}개와 다릅니다.`, Math.abs(detection.summary.totalCount - fixtureContract.required_exact_count));
    } else if (fixtureContract?.required_min_count != null && detection.summary.totalCount < fixtureContract.required_min_count) {
      addCheck('warning', 'FIXTURE_SLOT_MIN', 'Fixture 최소 슬롯 미달', `현재 슬롯 수 ${detection.summary.totalCount}개가 fixture 최소 ${fixtureContract.required_min_count}개보다 적습니다.`, fixtureContract.required_min_count - detection.summary.totalCount);
    }

    return {
      generatedAt: new Date().toISOString(),
      emptySlots,
      checks,
      blockingErrors: checks.filter((item) => item.level === 'error').length,
      warningCount: checks.filter((item) => item.level === 'warning').length,
      infoCount: checks.filter((item) => item.level === 'info').length,
    };
  }

  function buildReport() {
    const sections = listEditableSections().map((section) => ({ uid: section.uid, name: section.name, index: section.index }));
    return {
      selected: selectedInfo,
      selectedItems: selectedElements.map((element) => buildSelectionInfo(element)).filter(Boolean),
      selectionCount: selectedElements.length,
      sections,
      slotSummary: detection.summary,
      slots: detection.candidates,
      nearMisses: detection.nearMisses,
      modifiedSlotCount: modifiedSlots.size,
      sourceName: project?.sourceName || '',
      sourceType: project?.sourceType || '',
      selectionMode: currentSelectionMode,
      textEditing: !!editingTextElement,
      hiddenCount: buildLayerTree().filter((item) => item.hidden).length,
      lockedCount: buildLayerTree().filter((item) => item.locked).length,
      layerTree: buildLayerTree(),
      textStyle: getTextStyleState(),
      preflight: buildPreflightReport(),
      canGroupSelection: canGroupSelection(),
      canUngroupSelection: canUngroupSelection(),
      generatedAt: new Date().toISOString(),
    };
  }

  function persistSlotLabels(exportDoc) {
    for (const slot of detection.candidates) {
      const element = exportDoc.querySelector(`[data-node-uid="${slot.uid}"]`);
      if (!element || element.dataset.slotIgnore === '1') continue;
      if (!element.getAttribute('data-image-slot')) element.setAttribute('data-image-slot', slugify(slot.label || slot.uid));
      if (!element.getAttribute('data-slot-label')) element.setAttribute('data-slot-label', slot.label || slot.uid);
    }
  }

  function serializeEditedHtml({ persistDetectedSlots = true } = {}) {
    const parser = new DOMParser();
    const currentHtml = createDoctypeHtml(doc);
    const exportDoc = parser.parseFromString(currentHtml, 'text/html');
    restoreSerializedAssetRefs(exportDoc, { keepEditedAssets: true });
    if (persistDetectedSlots) persistSlotLabels(exportDoc);
    stripFinalEditorRuntime(exportDoc);
    return createDoctypeHtml(exportDoc);
  }

  function buildCurrentExportDoc({ persistDetectedSlots = true } = {}) {
    const parser = new DOMParser();
    const currentHtml = createDoctypeHtml(doc);
    const exportDoc = parser.parseFromString(currentHtml, 'text/html');
    restoreSerializedAssetRefs(exportDoc, { keepEditedAssets: true });
    if (persistDetectedSlots) persistSlotLabels(exportDoc);
    stripFinalEditorRuntime(exportDoc);
    return exportDoc;
  }

  async function resolvePortableUrl(url, cache) {
    const value = String(url || '').trim();
    if (!value || value.startsWith('data:') || /^https?:\/\//i.test(value) || value.startsWith('//') || value.startsWith('#')) return value;
    if (!value.startsWith('blob:')) return value;
    if (!cache.has(value)) {
      cache.set(value, (async () => {
        try {
          const response = await fetch(value);
          const blob = await response.blob();
          return await readBlobAsDataUrl(blob);
        } catch {
          return value;
        }
      })());
    }
    return await cache.get(value);
  }

  async function rewriteBlobRefsToPortableUrls(exportDoc) {
    const cache = new Map();
    const stats = {
      blobConvertedToDataUrl: 0,
      blobConversionFailed: 0,
      touchedImgSrc: 0,
      touchedSrcset: 0,
      touchedInlineStyleUrl: 0,
      touchedStyleBlockUrl: 0,
    };

    function trackBlobRewrite(original, replacement, key) {
      if (!String(original || '').startsWith('blob:')) return;
      if (String(replacement || '').startsWith('data:')) stats.blobConvertedToDataUrl += 1;
      else stats.blobConversionFailed += 1;
      if (key && Object.prototype.hasOwnProperty.call(stats, key)) stats[key] += 1;
    }

    for (const img of Array.from(exportDoc.querySelectorAll('img'))) {
      const src = img.getAttribute('src') || '';
      if (src) {
        const replacement = await resolvePortableUrl(src, cache);
        trackBlobRewrite(src, replacement, 'touchedImgSrc');
        img.setAttribute('src', replacement);
      }
      const srcset = img.getAttribute('srcset') || '';
      if (srcset) {
        const rewritten = [];
        for (const item of parseSrcsetCandidates(srcset)) {
          const replacement = await resolvePortableUrl(item.url, cache);
          trackBlobRewrite(item.url, replacement, 'touchedSrcset');
          rewritten.push({ ...item, url: replacement });
        }
        img.setAttribute('srcset', serializeSrcsetCandidates(rewritten));
      }
    }

    for (const source of Array.from(exportDoc.querySelectorAll('source[srcset]'))) {
      const items = [];
      for (const item of parseSrcsetCandidates(source.getAttribute('srcset') || '')) {
        const replacement = await resolvePortableUrl(item.url, cache);
        trackBlobRewrite(item.url, replacement, 'touchedSrcset');
        items.push({ ...item, url: replacement });
      }
      source.setAttribute('srcset', serializeSrcsetCandidates(items));
    }

    for (const element of Array.from(exportDoc.querySelectorAll('[style]'))) {
      const styleValue = element.getAttribute('style') || '';
      if (!styleValue.includes('url(')) continue;
      const matches = Array.from(styleValue.matchAll(FRAME_CSS_URL_RE));
      let nextStyle = styleValue;
      for (const match of matches) {
        const replacement = await resolvePortableUrl(match[2], cache);
        trackBlobRewrite(match[2], replacement, 'touchedInlineStyleUrl');
        nextStyle = nextStyle.replace(match[2], replacement);
      }
      element.setAttribute('style', nextStyle);
    }

    for (const styleBlock of Array.from(exportDoc.querySelectorAll('style'))) {
      const css = styleBlock.textContent || '';
      if (!css.includes('url(')) continue;
      const matches = Array.from(css.matchAll(FRAME_CSS_URL_RE));
      let nextCss = css;
      for (const match of matches) {
        const replacement = await resolvePortableUrl(match[2], cache);
        trackBlobRewrite(match[2], replacement, 'touchedStyleBlockUrl');
        nextCss = nextCss.replace(match[2], replacement);
      }
      styleBlock.textContent = nextCss;
    }
    return stats;
  }

  function collectLinkedPathWarnings(exportDoc) {
    const warnings = [];
    const unresolvedTokenRe = /%EB%AF%B8%ED%95%B4%EA%B2%B0|미해결/i;
    for (const img of Array.from(exportDoc.querySelectorAll('img'))) {
      const src = img.getAttribute('src') || '';
      const kind = classifyAssetPath(src);
      if (!['relative', 'uploaded'].includes(kind)) continue;
      const unresolved = img.dataset.normalizedUnresolvedImage === '1' || unresolvedTokenRe.test(src);
      if (!unresolved) continue;
      warnings.push({
        code: 'BROKEN_LINKED_PATH',
        kind,
        uid: img.dataset.nodeUid || '',
        ref: src,
      });
    }
    return warnings;
  }

  function measureExportRoot() {
    const root = doc.querySelector('.page') || doc.body.firstElementChild || doc.body;
    const docRect = doc.documentElement.getBoundingClientRect();
    const rect = root.getBoundingClientRect();
    return {
      root,
      x: Math.max(0, Math.round(rect.left - docRect.left)),
      y: Math.max(0, Math.round(rect.top - docRect.top)),
      width: Math.max(1, Math.ceil(rect.width)),
      height: Math.max(1, Math.ceil(rect.height)),
      fullWidth: Math.max(Math.ceil(doc.documentElement.scrollWidth || rect.width), Math.ceil(rect.left - docRect.left + rect.width)),
      fullHeight: Math.max(Math.ceil(doc.documentElement.scrollHeight || rect.height), Math.ceil(rect.top - docRect.top + rect.height)),
    };
  }

  function normalizeExportScale(scale = 1) {
    const value = Number.parseFloat(String(scale));
    if (!Number.isFinite(value) || value <= 0) return 1;
    if (value >= 2.5) return 3;
    if (value >= 1.5) return 2;
    return 1;
  }

  function elementRectToCrop(rect, docRect) {
    return {
      x: Math.max(0, Math.round(rect.left - docRect.left)),
      y: Math.max(0, Math.round(rect.top - docRect.top)),
      width: Math.max(1, Math.ceil(rect.width)),
      height: Math.max(1, Math.ceil(rect.height)),
    };
  }

  function selectionExportPolicy() {
    return {
      excludeHidden: true,
      excludeLocked: true,
    };
  }

  function resolveSelectionTargetsByUid({ selectedNodeUids = [], includeHidden = false, includeLocked = false } = {}) {
    const uidList = Array.isArray(selectedNodeUids) ? selectedNodeUids.filter(Boolean) : [];
    const uidSet = new Set(uidList);
    const seedTargets = uidSet.size
      ? Array.from(uidSet).map((uid) => getElementByUid(uid)).filter(Boolean)
      : uniqueConnectedElements(selectedElements);
    const targets = uniqueConnectedElements(seedTargets).filter((element) => isElement(element) && element.isConnected);
    const filtered = [];
    let skippedHidden = 0;
    let skippedLocked = 0;
    for (const element of targets) {
      if (!includeHidden && isHiddenElement(element)) {
        skippedHidden += 1;
        continue;
      }
      if (!includeLocked && isLockedElement(element)) {
        skippedLocked += 1;
        continue;
      }
      filtered.push(element);
    }
    return {
      requestedUids: uidList,
      allTargets: targets,
      targets: filtered,
      skippedHidden,
      skippedLocked,
    };
  }

  function computeUnionBoundingBoxFromSelectedNodeUids({ selectedNodeUids = [], includeHidden = false, includeLocked = false } = {}) {
    const resolved = resolveSelectionTargetsByUid({ selectedNodeUids, includeHidden, includeLocked });
    const rects = resolved.targets
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0);
    const bounds = unionRect(rects);
    return {
      ...resolved,
      rects,
      bounds,
    };
  }

  function resolveCropFromBoundingBox({ bounds, metrics, padding = 0 }) {
    if (!bounds || !metrics) return null;
    const safePadding = Math.max(0, Number.parseFloat(String(padding)) || 0);
    const docRect = doc.documentElement.getBoundingClientRect();
    const base = {
      left: bounds.left - docRect.left,
      top: bounds.top - docRect.top,
      right: bounds.right - docRect.left,
      bottom: bounds.bottom - docRect.top,
    };
    const expanded = {
      left: base.left - safePadding,
      top: base.top - safePadding,
      right: base.right + safePadding,
      bottom: base.bottom + safePadding,
    };
    const clamped = {
      left: Math.max(0, expanded.left),
      top: Math.max(0, expanded.top),
      right: Math.min(metrics.fullWidth, expanded.right),
      bottom: Math.min(metrics.fullHeight, expanded.bottom),
    };
    return {
      x: Math.max(0, clamped.left),
      y: Math.max(0, clamped.top),
      width: Math.max(1, clamped.right - clamped.left),
      height: Math.max(1, clamped.bottom - clamped.top),
    };
  }

  async function renderHtmlToCanvas(html, { fullWidth, fullHeight, crop, scale = 1, background = 'transparent' }) {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    parsed.documentElement.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    const serialized = new XMLSerializer().serializeToString(parsed.documentElement);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${crop.width}" height="${crop.height}" viewBox="0 0 ${crop.width} ${crop.height}">
        <foreignObject x="${-crop.x}" y="${-crop.y}" width="${fullWidth}" height="${fullHeight}">${serialized}</foreignObject>
      </svg>`;
    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('SVG 렌더 이미지 생성 실패'));
      img.src = svgUrl;
    });
    const canvas = doc.createElement('canvas');
    canvas.width = Math.max(1, Math.round(crop.width * scale));
    canvas.height = Math.max(1, Math.round(crop.height * scale));
    const context = canvas.getContext('2d');
    if (background === 'opaque') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  async function buildExportRenderContext() {
    const exportDoc = buildCurrentExportDoc({ persistDetectedSlots: false });
    await rewriteBlobRefsToPortableUrls(exportDoc);
    return {
      html: createDoctypeHtml(exportDoc),
      metrics: measureExportRoot(),
      exportDoc,
    };
  }

  async function renderExportBlob({ area = null, scale = 1, format = 'png', quality = 0.92, background = 'transparent', context = null } = {}) {
    const renderContext = context || (await buildExportRenderContext());
    const resolvedArea = area || {
      x: renderContext.metrics.x,
      y: renderContext.metrics.y,
      width: renderContext.metrics.width,
      height: renderContext.metrics.height,
    };
    const canvas = await renderHtmlToCanvas(renderContext.html, {
      fullWidth: renderContext.metrics.fullWidth,
      fullHeight: renderContext.metrics.fullHeight,
      crop: resolvedArea,
      scale: normalizeExportScale(scale),
      background,
    });
    const mime = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return await canvasToBlob(canvas, mime, mime === 'image/jpeg' ? quality : undefined);
  }

  async function exportFullPngBlob(scale = 1.5) {
    return await renderExportBlob({ format: 'png', scale });
  }

  async function exportFullJpgBlob(scale = 1.5, quality = 0.92) {
    return await renderExportBlob({ format: 'jpg', scale, quality });
  }

  async function exportSelectionPngBlob(scale = 1.5, options = {}) {
    const policy = selectionExportPolicy();
    const selectedNodeUids = uniqueConnectedElements(selectedElements).map((element) => element.dataset.nodeUid).filter(Boolean);
    if (!selectedNodeUids.length) throw new Error('선택 PNG 정책: 선택 없음(빈 선택은 export하지 않습니다).');
    const context = await buildExportRenderContext();
    const resolvedBounds = computeUnionBoundingBoxFromSelectedNodeUids({
      selectedNodeUids,
      includeHidden: !policy.excludeHidden,
      includeLocked: !policy.excludeLocked,
    });
    if (!resolvedBounds.targets.length) {
      throw new Error(`선택 PNG 정책: 선택 ${resolvedBounds.allTargets.length}개가 모두 제외되었습니다. (숨김 제외 ${policy.excludeHidden ? 'ON' : 'OFF'}, 잠금 제외 ${policy.excludeLocked ? 'ON' : 'OFF'})`);
    }
    if (!resolvedBounds.bounds) throw new Error('선택 PNG 정책: 선택 요소의 유효 크기를 찾지 못했습니다.');
    const padding = Math.max(0, Math.round(Number.parseFloat(String(options?.padding ?? 0)) || 0));
    const crop = resolveCropFromBoundingBox({ bounds: resolvedBounds.bounds, metrics: context.metrics, padding });
    const background = options?.background === 'opaque' ? 'opaque' : 'transparent';
    const blob = await renderExportBlob({ format: 'png', area: crop, scale, background, context });
    return {
      blob,
      meta: {
        mode: resolvedBounds.targets.length > 1 ? 'multi-union' : 'single',
        selectedNodeUids,
        targetCount: resolvedBounds.targets.length,
        crop,
        scale: normalizeExportScale(scale),
        policy: {
          excludeHidden: policy.excludeHidden,
          excludeLocked: policy.excludeLocked,
          skippedHidden: resolvedBounds.skippedHidden,
          skippedLocked: resolvedBounds.skippedLocked,
        },
      },
    };
  }

  function collectSectionElements({ includeDescendants = true } = {}) {
    const metrics = measureExportRoot();
    const root = metrics.root;
    const directChildren = Array.from(root.children || []).filter((element) => {
      if (!isElement(element)) return false;
      const rect = element.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return false;
      return isSectionLike(element) || element.hasAttribute('data-export-section');
    });
    if (directChildren.length || !includeDescendants) return directChildren;
    return Array.from(root.querySelectorAll('section, .hb-info-wrap, [data-export-section]')).filter((element) => {
      if (!isElement(element)) return false;
      const rect = element.getBoundingClientRect();
      return rect.width >= 20 && rect.height >= 20;
    });
  }

  function listEditableSections() {
    return collectSectionElements().map((element, index) => {
      const uid = element.dataset.nodeUid || nextId('node');
      element.dataset.nodeUid = uid;
      const rawName = buildLabel(element) || element.getAttribute('data-builder-section') || element.id || element.className || element.tagName.toLowerCase();
      return {
        uid,
        name: rawName || `섹션 ${index + 1}`,
        element,
        index,
      };
    });
  }

  function resolveSectionByUid(uid) {
    if (!uid) return null;
    return listEditableSections().find((section) => section.uid === uid) || null;
  }

  function assignNodeUidDeep(rootElement) {
    if (!isElement(rootElement)) return;
    rootElement.dataset.nodeUid = nextId('node');
    const descendants = Array.from(rootElement.querySelectorAll('*'));
    descendants.forEach((element) => {
      if (!isElement(element)) return;
      element.dataset.nodeUid = nextId('node');
    });
  }

  function duplicateSectionByUid(uid) {
    const section = resolveSectionByUid(uid);
    if (!section) return { ok: false, message: '복제할 섹션을 찾지 못했습니다.' };
    const clone = section.element.cloneNode(true);
    assignNodeUidDeep(clone);
    section.element.insertAdjacentElement('afterend', clone);
    const keepUid = clone.dataset.nodeUid || '';
    redetect({ preserveSelectionUids: keepUid ? [keepUid] : [] });
    emitMutation('section-duplicate');
    return { ok: true, message: '섹션을 복제했습니다.', uid: keepUid };
  }

  function moveSectionByUid(uid, direction = 'up') {
    const section = resolveSectionByUid(uid);
    if (!section) return { ok: false, message: '이동할 섹션을 찾지 못했습니다.' };
    const sections = listEditableSections();
    const index = sections.findIndex((item) => item.uid === uid);
    if (index < 0) return { ok: false, message: '이동할 섹션 인덱스를 찾지 못했습니다.' };
    if (direction === 'up') {
      if (index < 1) return { ok: false, message: '이미 맨 위 섹션입니다.' };
      sections[index - 1].element.insertAdjacentElement('beforebegin', section.element);
    } else {
      if (index >= sections.length - 1) return { ok: false, message: '이미 맨 아래 섹션입니다.' };
      sections[index + 1].element.insertAdjacentElement('afterend', section.element);
    }
    redetect({ preserveSelectionUids: [uid] });
    emitMutation(direction === 'up' ? 'section-move-up' : 'section-move-down');
    return { ok: true, message: direction === 'up' ? '섹션을 위로 이동했습니다.' : '섹션을 아래로 이동했습니다.' };
  }

  function deleteSectionByUid(uid) {
    const section = resolveSectionByUid(uid);
    if (!section) return { ok: false, message: '삭제할 섹션을 찾지 못했습니다.' };
    section.element.remove();
    redetect({ preserveSelectionUids: [] });
    emitMutation('section-delete');
    return { ok: true, message: '섹션을 삭제했습니다.' };
  }

  function addSectionAfterUid(uid = '') {
    const sections = listEditableSections();
    const root = measureExportRoot().root;
    const section = doc.createElement('section');
    const sectionUid = nextId('node');
    section.dataset.nodeUid = sectionUid;
    section.dataset.editableBox = '새 섹션';
    section.style.position = 'relative';
    section.style.minHeight = '360px';
    section.style.width = '100%';
    section.style.borderTop = '1px dashed #e2e8f0';
    const marker = doc.createElement('div');
    marker.dataset.nodeUid = nextId('node');
    marker.dataset.editableBox = '새 섹션 안내';
    marker.dataset.editableText = '새 섹션 안내';
    marker.textContent = '새 섹션 (내용을 추가하세요)';
    marker.style.position = 'absolute';
    marker.style.left = '32px';
    marker.style.top = '32px';
    marker.style.fontSize = '20px';
    marker.style.fontWeight = '700';
    marker.style.color = '#64748b';
    section.appendChild(marker);
    const target = uid ? sections.find((item) => item.uid === uid)?.element : null;
    if (target?.parentElement) target.insertAdjacentElement('afterend', section);
    else root.appendChild(section);
    redetect({ preserveSelectionUids: [sectionUid] });
    emitMutation('section-add');
    return { ok: true, message: '새 섹션을 추가했습니다.', uid: sectionUid };
  }

  function collectSectionRects() {
    const docRect = doc.documentElement.getBoundingClientRect();
    const candidates = collectSectionElements();
    return candidates.map((element, index) => {
      const rect = element.getBoundingClientRect();
      const crop = elementRectToCrop(rect, docRect);
      const rawName = buildLabel(element) || element.id || element.className || element.tagName.toLowerCase();
      return {
        crop,
        name: `${String(index + 1).padStart(3, '0')}_${sanitizeFilename(slugify(rawName) || 'section')}.png`,
      };
    });
  }

  async function exportSectionPngEntries(scale = 1.5) {
    const context = await buildExportRenderContext();
    const sections = collectSectionRects();
    const entries = [];
    for (const section of sections) {
      // eslint-disable-next-line no-await-in-loop
      const blob = await renderExportBlob({ format: 'png', area: section.crop, scale, context });
      // eslint-disable-next-line no-await-in-loop
      entries.push({ name: section.name, data: new Uint8Array(await blob.arrayBuffer()) });
    }
    return entries;
  }

  async function exportFixtureIntegrityReport() {
    const exportDoc = buildCurrentExportDoc({ persistDetectedSlots: false });
    const fixtureContract = project?.fixtureMeta?.slot_contract || null;
    let placeholderOnlySlots = 0;
    let unresolvedImages = 0;
    for (const slotRecord of detection.candidates) {
      const slot = exportDoc.querySelector(`[data-node-uid="${slotRecord.uid}"]`);
      if (!slot || slot.dataset.slotIgnore === '1') continue;
      const hasPlaceholder = PLACEHOLDER_TEXT_RE.test(placeholderTextValue(slot));
      const target = findSlotMediaTarget(slot);
      let hasMedia = false;
      let unresolved = false;
      if (target.kind === 'background') {
        const styleValue = (target.element || slot).getAttribute('style') || '';
        hasMedia = /url\(/i.test(styleValue);
        unresolved = /%EB%AF%B8%ED%95%B4%EA%B2%B0|미해결/i.test(styleValue);
      } else {
        const img = target.element || slot.querySelector('img');
        const src = img?.getAttribute('src') || '';
        hasMedia = !!src;
        unresolved = /%EB%AF%B8%ED%95%B4%EA%B2%B0|미해결/i.test(src);
      }
      if (hasPlaceholder && !hasMedia) placeholderOnlySlots += 1;
      if (unresolved) unresolvedImages += 1;
    }
    const issues = [];
    if (placeholderOnlySlots > 0) issues.push(`placeholder-only 슬롯 ${placeholderOnlySlots}개`);
    if (unresolvedImages > 0) issues.push(`미해결 이미지 ${unresolvedImages}개`);
    if (fixtureContract?.required_exact_count != null && detection.summary.totalCount !== fixtureContract.required_exact_count) {
      issues.push(`fixture 슬롯 수 불일치(${detection.summary.totalCount}/${fixtureContract.required_exact_count})`);
    }
    return {
      ok: issues.length === 0,
      fixtureId: project?.fixtureId || '',
      placeholderOnlySlots,
      unresolvedImages,
      issues,
    };
  }

  async function convertEmbeddedToLinked(exportDoc) {
    const assetEntries = [];
    const assetPathMap = new Map();
    const stats = {
      format: 'linked',
      convertedDataUrlCount: 0,
      generatedAssetCount: 0,
      brokenLinkedPathWarnings: [],
    };

    async function materializeUrl(url, hint = 'asset') {
      const value = String(url || '').trim();
      if (!value || !value.startsWith('data:')) return value;
      if (assetPathMap.has(value)) return assetPathMap.get(value);
      const response = await fetch(value);
      const blob = await response.blob();
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const ext = guessExtensionFromMime(blob.type, '.bin');
      const name = `assets/${String(assetEntries.length + 1).padStart(3, '0')}_${sanitizeFilename(slugify(hint) || 'asset')}${ext}`;
      assetEntries.push({ name, data: bytes });
      assetPathMap.set(value, name);
      stats.convertedDataUrlCount += 1;
      return name;
    }

    for (const img of Array.from(exportDoc.querySelectorAll('img'))) {
      const hint = buildLabel(img.parentElement || img);
      const src = img.getAttribute('src') || '';
      if (src.startsWith('data:')) img.setAttribute('src', await materializeUrl(src, hint));
      const srcset = img.getAttribute('srcset') || '';
      if (srcset) {
        const rewritten = [];
        for (const item of parseSrcsetCandidates(srcset)) {
          rewritten.push({ ...item, url: await materializeUrl(item.url, hint) });
        }
        img.setAttribute('srcset', serializeSrcsetCandidates(rewritten));
      }
    }

    for (const source of Array.from(exportDoc.querySelectorAll('source[srcset]'))) {
      const hint = buildLabel(source.parentElement || source);
      const rewritten = [];
      for (const item of parseSrcsetCandidates(source.getAttribute('srcset') || '')) {
        rewritten.push({ ...item, url: await materializeUrl(item.url, hint) });
      }
      source.setAttribute('srcset', serializeSrcsetCandidates(rewritten));
    }

    for (const element of Array.from(exportDoc.querySelectorAll('[style]'))) {
      const styleValue = element.getAttribute('style') || '';
      if (!styleValue.includes('url(')) continue;
      const matches = Array.from(styleValue.matchAll(FRAME_CSS_URL_RE));
      let nextStyle = styleValue;
      for (const match of matches) {
        const replacement = await materializeUrl(match[2], buildLabel(element));
        nextStyle = nextStyle.replace(match[2], replacement);
      }
      element.setAttribute('style', nextStyle);
    }

    for (const styleBlock of Array.from(exportDoc.querySelectorAll('style'))) {
      const css = styleBlock.textContent || '';
      if (!css.includes('url(')) continue;
      const matches = Array.from(css.matchAll(FRAME_CSS_URL_RE));
      let nextCss = css;
      for (const match of matches) {
        const replacement = await materializeUrl(match[2], 'style');
        nextCss = nextCss.replace(match[2], replacement);
      }
      styleBlock.textContent = nextCss;
    }

    stats.generatedAssetCount = assetEntries.length;
    stats.brokenLinkedPathWarnings = collectLinkedPathWarnings(exportDoc);
    return { exportDoc, assetEntries, stats };
  }

  async function buildSavePackageEntries(format = 'linked') {
    const saveFormat = format === 'embedded' ? 'embedded' : 'linked';
    const baseName = sanitizeFilename(project?.sourceName?.replace(/\.html?$/i, '') || 'detail-page');
    if (saveFormat === 'embedded') {
      const exportDoc = buildCurrentExportDoc({ persistDetectedSlots: true });
      const rewriteStats = await rewriteBlobRefsToPortableUrls(exportDoc);
      const html = createDoctypeHtml(exportDoc);
      return {
        format: 'embedded',
        entries: [{ name: `${baseName}__embedded.html`, data: new TextEncoder().encode(html) }],
        conversion: {
          format: 'embedded',
          portableRewrite: rewriteStats,
          generatedAssetCount: 0,
          brokenLinkedPathWarnings: [],
        },
      };
    }
    const exportDoc = buildCurrentExportDoc({ persistDetectedSlots: true });
    const rewriteStats = await rewriteBlobRefsToPortableUrls(exportDoc);
    const converted = await convertEmbeddedToLinked(exportDoc);
    const html = createDoctypeHtml(converted.exportDoc);
    return {
      format: 'linked',
      entries: [
        { name: `${baseName}__linked.html`, data: new TextEncoder().encode(html) },
        ...converted.assetEntries,
      ],
      conversion: {
        ...converted.stats,
        portableRewrite: rewriteStats,
      },
    };
  }

  function captureSnapshot(label = 'snapshot') {
    const parser = new DOMParser();
    const currentHtml = createDoctypeHtml(doc);
    const snapshotDoc = parser.parseFromString(currentHtml, 'text/html');
    stripTransientRuntime(snapshotDoc);
    return {
      label,
      html: createDoctypeHtml(snapshotDoc),
      selectedUid: selectedInfo?.uid || '',
      selectedUids: selectedElements.map((element) => element.dataset.nodeUid).filter(Boolean),
      selectionMode: currentSelectionMode,
      savedAt: new Date().toISOString(),
    };
  }

  function beginMoveDrag(target, event) {
    const nextState = beginMoveInteraction({
      target,
      event,
      isLockedElement,
      selectedElements: () => selectedElements,
      selectElements,
      uniqueConnectedElements,
      readTransformState,
      unionRect,
      buildSnapCandidates,
    });
    if (!nextState) return false;
    dragState = nextState;
    return true;
  }

  function beginMarqueeDrag(event) {
    dragState = beginMarqueeInteraction({
      event,
      selectedElements: () => selectedElements,
      uniqueConnectedElements,
    });
    return true;
  }

  function updateMarqueeSelection(endX, endY) {
    applyMarqueeInteraction({
      dragState,
      endX,
      endY,
      showMarqueeRect,
      collectInteractiveLayers,
      isLockedElement,
      isHiddenElement,
      rectIntersects,
      uniqueConnectedElements,
      selectElements,
    });
  }

  function updateMoveDrag(clientX, clientY) {
    applyMoveInteraction({
      dragState,
      clientX,
      clientY,
      computeSnapAdjustment,
      writeTransformState,
      showSnapLines,
      doc,
    });
  }

  function beginResizeDrag(event, corner) {
    const nextState = beginResizeInteraction({
      event,
      corner,
      selectedElement: () => selectedElement,
      isLockedElement,
      readTransformState,
      win,
    });
    if (!nextState) return false;
    resizeState = nextState;
    return true;
  }

  function updateResizeDrag(event) {
    if (!resizeState || resizeState.pointerId !== event.pointerId) return;
    const dx = event.clientX - resizeState.startX;
    const dy = event.clientY - resizeState.startY;
    if (!resizeState.moved && Math.hypot(dx, dy) < 2) return;
    resizeState.moved = true;
    const { corner, target } = resizeState;
    let width = resizeState.startWidth;
    let height = resizeState.startHeight;
    let tx = resizeState.startTx;
    let ty = resizeState.startTy;
    if (corner.includes('e')) width += dx;
    if (corner.includes('s')) height += dy;
    if (corner.includes('w')) {
      width -= dx;
      tx += dx;
    }
    if (corner.includes('n')) {
      height -= dy;
      ty += dy;
    }
    width = Math.max(8, width);
    height = Math.max(8, height);
    const uid = target.dataset.nodeUid || nextId('node');
    target.dataset.nodeUid = uid;
    patchModelNode(editorModel, uid, {
      bounds: { width, height },
      style: { width: `${Math.round(width)}px`, height: `${Math.round(height)}px` },
    });
    applyModelNodesToDom(doc, editorModel, [uid]);
    writeTransformState(target, tx, ty);
    target.dataset.editorModified = '1';
    if (target.dataset.nodeUid) modifiedSlots.add(target.dataset.nodeUid);
    updateResizeOverlay();
  }

  function finishResizeDrag(event) {
    if (!resizeState || (event && resizeState.pointerId !== event.pointerId)) return;
    const done = resizeState;
    resizeState = null;
    if (!done.moved) return;
    emitState();
    emitMutation('resize-drag');
    onStatus('선택 요소 크기를 조절했습니다.');
  }

  function handlePointerDown(event) {
    if (event.button !== 0 || editingTextElement) return;
    const resizeHandle = closestElement(event.target)?.closest?.('[data-resize-corner]');
    if (resizeHandle) {
      event.preventDefault();
      event.stopPropagation();
      beginResizeDrag(event, resizeHandle.dataset.resizeCorner || 'se');
      return;
    }
    const target = resolveSelectionTarget(event.target);
    if (event.shiftKey && !target) {
      beginMarqueeDrag(event);
      return;
    }
    if (event.shiftKey && target) {
      beginMarqueeDrag(event);
      return;
    }
    if (!target) return;
    if (isLockedElement(target)) {
      onStatus('잠긴 레이어는 캔버스에서 직접 편집할 수 없습니다. 레이어 패널에서 잠금을 해제해 주세요.');
      return;
    }
    beginMoveDrag(target, event);
  }

  function handlePointerMove(event) {
    if (resizeState && resizeState.pointerId === event.pointerId) {
      event.preventDefault();
      updateResizeDrag(event);
      return;
    }
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    if (!dragState.moved && Math.hypot(dx, dy) < 3) return;
    dragState.moved = true;
    event.preventDefault();
    if (dragState.mode === 'marquee') updateMarqueeSelection(event.clientX, event.clientY);
    else if (dragState.mode === 'move') updateMoveDrag(event.clientX, event.clientY);
  }

  function finishPointerDrag(event) {
    if (resizeState && (!event || resizeState.pointerId === event.pointerId)) {
      finishResizeDrag(event);
      return;
    }
    if (!dragState || (event && dragState.pointerId !== event.pointerId)) return;
    const finished = dragState;
    dragState = null;
    hideInteractionOverlay();
    if (!finished.moved) return;
    suppressClickUntil = Date.now() + 220;
    if (finished.mode === 'move') {
      emitState();
      emitMutation('drag-move');
      onStatus(`선택 요소 ${finished.snapshots.length}개를 드래그 이동했습니다.`);
    } else if (finished.mode === 'marquee') {
      emitState();
      onStatus(`드래그로 ${selectedElements.length}개 레이어를 선택했습니다.`);
    }
  }

  function handleDocClick(event) {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (editingTextElement && !editingTextElement.contains(event.target)) {
      finishTextEdit({ commit: true, emit: true });
    }
    const target = resolveSelectionTarget(event.target);
    if (!target) return;
    if (imageCropRuntime && target !== imageCropRuntime.slot) {
      const cropResult = finishImageCropMode({ apply: true, emit: true });
      onStatus(cropResult.message);
    }
    const anchor = closestElement(event.target)?.closest?.('a[href]');
    if (anchor) event.preventDefault();
    selectElement(target, {
      additive: event.ctrlKey || event.metaKey || event.shiftKey,
      toggle: event.ctrlKey || event.metaKey,
    });
  }

  function handleDocDoubleClick(event) {
    const target = resolveSelectionTarget(event.target);
    if (!target) return;
    const targetType = selectionTypeOf(target);
    const result = targetType === 'text'
      ? startTextEdit(target)
      : targetType === 'slot'
        ? enterImageCropMode(target)
        : { ok: false, message: '' };
    if (result.ok) {
      event.preventDefault();
      onStatus(result.message);
    }
  }

  function executeCommand(command, payload = {}) {
    if (command === 'duplicate') return duplicateSelected();
    if (command === 'delete') return deleteSelected();
    if (command === 'group-selection') return groupSelected();
    if (command === 'ungroup-selection') return ungroupSelected();
    if (command === 'nudge-selection') return nudgeSelectedElements(payload.dx || 0, payload.dy || 0);
    if (command === 'add-element-text') return addElement('text');
    if (command === 'add-element-box') return addElement('box');
    if (command === 'add-element-slot') return addElement('slot');
    if (command === 'toggle-text-edit') return toggleTextEdit();
    if (command === 'image-crop-enter') return enterImageCropMode(selectedElement);
    if (command === 'image-crop-apply') return finishImageCropMode({ apply: true });
    if (command === 'image-crop-cancel') return finishImageCropMode({ apply: false });
    if (command === 'image-crop-reset') return resetImageCropRuntime();
    if (command === 'layer-index-forward') return applyLayerIndexCommand('forward');
    if (command === 'layer-index-backward') return applyLayerIndexCommand('backward');
    if (command === 'layer-index-front') return applyLayerIndexCommand('front');
    if (command === 'layer-index-back') return applyLayerIndexCommand('back');
    if (command === 'stack-horizontal') return applyStackLayout({ ...payload, direction: 'horizontal' });
    if (command === 'stack-vertical') return applyStackLayout({ ...payload, direction: 'vertical' });
    if (command === 'tidy-horizontal') return tidySelection({ axis: 'x' });
    if (command === 'tidy-vertical') return tidySelection({ axis: 'y' });
    if (command === 'undo' || command === 'redo' || command === 'save-edited') {
      onShortcut(command);
      return { ok: true, message: command };
    }
    return unsupportedCommandResult(command);
  }

  function handleKeydown(event) {
    if (imageCropRuntime) {
      const step = resolveNudgeStep(event);
      if (event.key === 'Escape') {
        event.preventDefault();
        onStatus(finishImageCropMode({ apply: false }).message);
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        onStatus(finishImageCropMode({ apply: true }).message);
        return;
      }
      if (event.key === '0') {
        event.preventDefault();
        onStatus(resetImageCropRuntime().message);
        return;
      }
      if (event.key === '+' || event.key === '=') {
        event.preventDefault();
        imageCropRuntime.zoom = Math.min(4, imageCropRuntime.zoom + 0.05);
        updateImageCropRuntimeStyles(imageCropRuntime);
        emitState();
        return;
      }
      if (event.key === '-') {
        event.preventDefault();
        imageCropRuntime.zoom = Math.max(0.5, imageCropRuntime.zoom - 0.05);
        updateImageCropRuntimeStyles(imageCropRuntime);
        emitState();
        return;
      }
      if (event.key === 'ArrowLeft') { event.preventDefault(); onStatus(nudgeImagePosition(-step, 0).message); return; }
      if (event.key === 'ArrowRight') { event.preventDefault(); onStatus(nudgeImagePosition(step, 0).message); return; }
      if (event.key === 'ArrowUp') { event.preventDefault(); onStatus(nudgeImagePosition(0, -step).message); return; }
      if (event.key === 'ArrowDown') { event.preventDefault(); onStatus(nudgeImagePosition(0, step).message); return; }
    }
    const withModifier = event.ctrlKey || event.metaKey;
    const typingInput = isTypingInputTarget(closestElement(event.target));
    if (typingInput && !editingTextElement) return;

    if (!withModifier && !event.altKey && !event.shiftKey && !editingTextElement) {
      const plainKey = String(event.key || '').toLowerCase();
      if (plainKey === 'v') {
        event.preventDefault();
        setSelectionMode('smart');
        onStatus('선택 도구(V)로 전환했습니다.');
        return;
      }
      if (plainKey === 't') {
        event.preventDefault();
        setSelectionMode('text');
        onStatus('텍스트 도구(T)로 전환했습니다.');
        return;
      }
      if (plainKey === 'r') {
        event.preventDefault();
        setSelectionMode('box');
        onStatus('박스 도구(R)로 전환했습니다.');
        return;
      }
      if (plainKey === '?') {
        event.preventDefault();
        onShortcut('toggle-shortcut-help');
        return;
      }
    }
    if (!withModifier && event.shiftKey && String(event.key || '') === '/' && !editingTextElement) {
      event.preventDefault();
      onShortcut('toggle-shortcut-help');
      return;
    }
    if (withModifier && !event.altKey) {
      const key = String(event.key || '').toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        executeCommand(event.shiftKey ? 'redo' : 'undo');
        return;
      }
      if (key === 'y') {
        event.preventDefault();
        executeCommand('redo');
        return;
      }
      if (key === 's') {
        event.preventDefault();
        executeCommand('save-edited');
        return;
      }
      if (key === 'd') {
        event.preventDefault();
        onStatus(executeCommand('duplicate').message);
        return;
      }
      if (key === 'g') {
        event.preventDefault();
        onStatus(executeCommand(event.shiftKey ? 'ungroup-selection' : 'group-selection').message);
        return;
      }
    }
    if (!withModifier && !editingTextElement && (event.key === 'Delete' || event.key === 'Backspace')) {
      event.preventDefault();
      onStatus(executeCommand('delete').message);
      return;
    }
    if (!withModifier && !editingTextElement && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const unit = resolveNudgeStep(event);
      const dx = event.key === 'ArrowLeft' ? -unit : event.key === 'ArrowRight' ? unit : 0;
      const dy = event.key === 'ArrowUp' ? -unit : event.key === 'ArrowDown' ? unit : 0;
      onStatus(executeCommand('nudge-selection', { dx, dy }).message);
      return;
    }
    if (!editingTextElement) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      onStatus(finishTextEdit({ commit: false }).message);
      return;
    }
    if (withModifier && event.key === 'Enter') {
      event.preventDefault();
      onStatus(finishTextEdit({ commit: true }).message);
    }
  }

  function handleDragOver(event) {
    if (!event.dataTransfer?.types) return;
    const hasFiles = Array.from(event.dataTransfer.types).includes('Files');
    if (!hasFiles) return;
    const slot = (closestElement(event.target)?.closest?.('[data-detected-slot], [data-image-slot], .image-slot, .drop-slot')) || getSelectedSlotElement();
    if (!slot || isLockedElement(slot)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    if (hoverSlot !== slot) {
      clearHover();
      hoverSlot = slot;
      hoverSlot.classList.add('__phase5_drop_hover');
    }
  }

  async function handleDrop(event) {
    if (!event.dataTransfer?.files?.length) return;
    const slot = (closestElement(event.target)?.closest?.('[data-detected-slot], [data-image-slot], .image-slot, .drop-slot')) || getSelectedSlotElement();
    if (!slot || isLockedElement(slot)) return;
    event.preventDefault();
    clearHover();
    try {
      await applyFilesStartingAtSlot(slot, Array.from(event.dataTransfer.files));
    } catch (error) {
      onStatus(`드롭 이미지 적용 중 오류: ${error?.message || error}`);
    }
  }

  function handleDragLeave() {
    clearHover();
  }

  doc.addEventListener('click', handleDocClick, true);
  doc.addEventListener('dblclick', handleDocDoubleClick, true);
  doc.addEventListener('keydown', handleKeydown, true);
  doc.addEventListener('pointerdown', handlePointerDown, true);
  doc.addEventListener('pointermove', handlePointerMove, true);
  doc.addEventListener('pointerup', finishPointerDrag, true);
  doc.addEventListener('pointercancel', finishPointerDrag, true);
  doc.addEventListener('dragover', handleDragOver, true);
  doc.addEventListener('drop', handleDrop, true);
  doc.addEventListener('dragleave', handleDragLeave, true);

  rehydratePersistentState();
  hideInteractionOverlay();
  hideResizeOverlay();
  redetect({ preserveSelectionUids: initialSnapshot?.selectedUids || [] });

  return {
    setSelectionMode,
    redetect,
    refreshDerivedMeta,
    selectNodeByUid(uid, { additive = false, toggle = false, scroll = false } = {}) {
      const element = getElementByUid(uid);
      if (!element) return false;
      selectElement(element, { additive, toggle });
      if (scroll) element.scrollIntoView?.({ block: 'center', inline: 'nearest', behavior: 'smooth' });
      return true;
    },
    selectSlotByUid(uid) {
      return this.selectNodeByUid(uid, { additive: false, toggle: false, scroll: true });
    },
    async applyFiles(files) {
      const slot = getSelectedSlotElement();
      if (!slot) {
        onStatus('먼저 이미지 슬롯을 선택해 주세요.');
        return 0;
      }
      return await applyFilesStartingAtSlot(slot, files);
    },
    async applyFilesStartingAtSlotByUid(uid, files) {
      const slot = getElementByUid(uid);
      if (!slot) {
        onStatus('대상 슬롯을 찾지 못했습니다.');
        return 0;
      }
      return await applyFilesStartingAtSlot(slot, files);
    },
    applyImagePreset,
    removeImageFromSelected,
    markSelectedAsSlot,
    demoteSelectedSlot,
    toggleSelectedHidden,
    toggleSelectedLocked,
    toggleLayerHiddenByUid,
    toggleLayerLockedByUid,
    toggleTextEdit,
    applyTextStyle,
    applyBatchLayout,
    applyStackLayout,
    tidySelection,
    duplicateSelected,
    deleteSelected,
    groupSelected,
    ungroupSelected,
    addTextElement: () => executeCommand('add-element-text'),
    addBoxElement: () => executeCommand('add-element-box'),
    addSlotElement: () => executeCommand('add-element-slot'),
    applyGeometryPatch,
    nudgeSelectedElements: (dx = 0, dy = 0) => executeCommand('nudge-selection', { dx, dy }),
    getSelectionGeometry: () => summarizeGeometryForSelection(selectedElements),
    bringSelectedForward: () => executeCommand('layer-index-forward'),
    sendSelectedBackward: () => executeCommand('layer-index-backward'),
    bringSelectedToFront: () => executeCommand('layer-index-front'),
    sendSelectedToBack: () => executeCommand('layer-index-back'),
    nudgeSelectedImage: ({ dx = 0, dy = 0 } = {}) => nudgeImagePosition(dx, dy),
    executeCommand,
    getEditedHtml: serializeEditedHtml,
    getCurrentPortableHtml: async () => {
      const exportDoc = buildCurrentExportDoc({ persistDetectedSlots: true });
      await rewriteBlobRefsToPortableUrls(exportDoc);
      return createDoctypeHtml(exportDoc);
    },
    async getLinkedPackageEntries() {
      const result = await buildSavePackageEntries('linked');
      return result.entries;
    },
    async getSavePackageEntries(format = 'linked') {
      return await buildSavePackageEntries(format);
    },
    async convertEmbeddedToLinked() {
      const exportDoc = buildCurrentExportDoc({ persistDetectedSlots: true });
      await rewriteBlobRefsToPortableUrls(exportDoc);
      return await convertEmbeddedToLinked(exportDoc);
    },
    async exportFullPngBlob(scale = 1.5) {
      return await exportFullPngBlob(scale);
    },
    async exportFullJpgBlob(scale = 1.5, quality = 0.92) {
      return await exportFullJpgBlob(scale, quality);
    },
    async exportSelectionPngBlob(scale = 1.5, options = {}) {
      return await exportSelectionPngBlob(scale, options);
    },
    async exportSectionPngEntries(scale = 1.5) {
      return await exportSectionPngEntries(scale);
    },
    listEditableSections,
    duplicateSectionByUid,
    moveSectionByUid,
    deleteSectionByUid,
    addSectionAfterUid,
    async getExportFixtureIntegrityReport() {
      return await exportFixtureIntegrityReport();
    },
    captureSnapshot,
    getReport: buildReport,
    getPreflightReport: buildPreflightReport,
    getMeta() {
      return { ...getDerivedMeta(), modelVersion: editorModel.version };
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (editingTextElement) finishTextEdit({ commit: false, emit: false });
      if (imageCropRuntime) finishImageCropMode({ apply: false, emit: false });
      doc.removeEventListener('click', handleDocClick, true);
      doc.removeEventListener('dblclick', handleDocDoubleClick, true);
      doc.removeEventListener('keydown', handleKeydown, true);
      doc.removeEventListener('pointerdown', handlePointerDown, true);
      doc.removeEventListener('pointermove', handlePointerMove, true);
      doc.removeEventListener('pointerup', finishPointerDrag, true);
      doc.removeEventListener('pointercancel', finishPointerDrag, true);
      doc.removeEventListener('dragover', handleDragOver, true);
      doc.removeEventListener('drop', handleDrop, true);
      doc.removeEventListener('dragleave', handleDragLeave, true);
      clearHover();
      hideInteractionOverlay();
      hideResizeOverlay();
      clearSelectionClasses();
    },
  };
}


/* ===== src/ui/object-inspector-schema.js ===== */

const OBJECT_INSPECTOR_SCHEMA = Object.freeze({
  sections: Object.freeze([
    Object.freeze({
      id: 'transform',
      title: 'Transform',
      fields: Object.freeze([
        Object.freeze({ key: 'x', label: 'X' }),
        Object.freeze({ key: 'y', label: 'Y' }),
        Object.freeze({ key: 'w', label: 'W' }),
        Object.freeze({ key: 'h', label: 'H' }),
      ]),
    }),
    Object.freeze({
      id: 'appearance',
      title: 'Appearance',
      fields: Object.freeze([
        Object.freeze({ key: 'opacity', label: 'Opacity' }),
        Object.freeze({ key: 'display', label: 'Display' }),
        Object.freeze({ key: 'visibility', label: 'Visibility' }),
      ]),
    }),
    Object.freeze({
      id: 'layout',
      title: 'Layout',
      fields: Object.freeze([
        Object.freeze({ key: 'position', label: 'Position' }),
        Object.freeze({ key: 'zIndex', label: 'z-index' }),
      ]),
    }),
  ]),
  plugins: Object.freeze({
    text: Object.freeze({
      title: 'Text Plugin',
      fields: Object.freeze([
        Object.freeze({ key: 'fontSize', label: 'Font size' }),
        Object.freeze({ key: 'lineHeight', label: 'Line height' }),
        Object.freeze({ key: 'letterSpacing', label: 'Letter spacing' }),
        Object.freeze({ key: 'fontWeight', label: 'Weight' }),
        Object.freeze({ key: 'color', label: 'Color' }),
        Object.freeze({ key: 'textAlign', label: 'Align' }),
      ]),
    }),
    image: Object.freeze({
      title: 'Image Plugin',
      fields: Object.freeze([
        Object.freeze({ key: 'fit', label: 'Fit' }),
        Object.freeze({ key: 'position', label: 'Position' }),
      ]),
    }),
    vector: Object.freeze({
      title: 'Vector Plugin',
      fields: Object.freeze([
        Object.freeze({ key: 'borderRadius', label: 'Radius' }),
        Object.freeze({ key: 'background', label: 'Background' }),
        Object.freeze({ key: 'border', label: 'Border' }),
      ]),
    }),
  }),
});


/* ===== src/ui/renderers.js ===== */

const LEFT_TAB_STEP_GUIDES = Object.freeze({
  'left-start': Object.freeze({
    title: '이번 단계에서 할 일',
    todos: Object.freeze([
      'HTML 파일/폴더를 불러와 편집할 문서를 준비하세요.',
      '불러온 뒤 깨진 자산이 있는지 빠르게 확인하세요.',
    ]),
  }),
  'left-image': Object.freeze({
    title: '이번 단계에서 할 일',
    todos: Object.freeze([
      '이미지 슬롯/섹션을 선택하고 필요한 컷을 채우세요.',
      '순서가 어색하면 섹션을 위/아래로 이동하세요.',
    ]),
  }),
  'left-text': Object.freeze({
    title: '이번 단계에서 할 일',
    todos: Object.freeze([
      '캔버스에서 텍스트를 선택한 뒤 내용을 수정하세요.',
      '오른쪽 텍스트 탭에서 글꼴/크기를 맞춰 통일감을 만드세요.',
    ]),
  }),
  'left-layers': Object.freeze({
    title: '이번 단계에서 할 일',
    todos: Object.freeze([
      '레이어 겹침 순서(앞/뒤)를 확인하세요.',
      '실수 방지를 위해 필요한 레이어만 잠그거나 숨기세요.',
    ]),
  }),
  'left-export': Object.freeze({
    title: '이번 단계에서 할 일',
    todos: Object.freeze([
      '저장 형식(HTML/PNG/JPG/ZIP)을 먼저 고르세요.',
      '내보내기 전에 최종 미리보기와 검수 상태를 확인하세요.',
    ]),
  }),
});
function renderLeftTabStepGuide(container, tabId) {
  if (!container) return;
  const guide = LEFT_TAB_STEP_GUIDES[String(tabId || '')];
  if (!guide) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = `
    <article class="workflow-step-card">
      <strong>${escapeHtml(guide.title)}</strong>
      <ol>
        ${guide.todos.map((todo) => `<li>${escapeHtml(todo)}</li>`).join('')}
      </ol>
    </article>
  `;
}
function renderSummaryCards(container, project, editorMeta = null) {
  if (!container) return;
  if (!project) {
    container.innerHTML = '<div class="asset-empty">아직 불러온 프로젝트가 없습니다.</div>';
    return;
  }
  const slotSummary = editorMeta?.slotSummary || project.slotDetection?.summary || { totalCount: 0, explicitCount: 0, heuristicCount: 0, nearMissCount: 0 };
  const cards = [
    ['자산 수', project.summary.assetsTotal, `resolved ${project.summary.assetsResolved} · unresolved ${project.summary.assetsUnresolved}`],
    ['섹션 수', project.summary.sectionCount, `elements ${project.summary.elementCount}`],
    ['슬롯 후보', slotSummary.totalCount, `explicit ${slotSummary.explicitCount} · heuristic ${slotSummary.heuristicCount}`],
    ['기존 IMG', project.summary.existingImageCount, `blob URL ${project.fileContext.blobUrlCount}`],
    ['근접 후보', slotSummary.nearMissCount ?? project.summary.nearMissCount ?? 0, '수동 보정 후보'],
    ['편집 수정', editorMeta?.modifiedSlotCount ?? 0, editorMeta?.selectionCount ? `선택 ${editorMeta.selectionCount}개` : '아직 없음'],
  ];
  container.innerHTML = cards.map(([label, value, sub]) => `
    <article class="metric-card">
      <div class="metric-card__label">${escapeHtml(label)}</div>
      <div class="metric-card__value">${formatNumber(value)}</div>
      <div class="metric-card__sub">${escapeHtml(sub)}</div>
    </article>
  `).join('');
}
function renderIssueList(container, project) {
  if (!container) return;
  if (!project?.issues?.length) {
    container.innerHTML = '<li class="asset-empty">현재 감지된 이슈가 없습니다.</li>';
    return;
  }
  container.innerHTML = project.issues.map((issue) => `
    <li class="issue" data-level="${escapeHtml(issue.level)}">
      <div class="issue__meta">
        <span class="issue__badge">${escapeHtml(issue.level)}</span>
        <span class="issue__code">${escapeHtml(issue.code)}</span>
      </div>
      <div class="issue__message">${escapeHtml(issue.message)}</div>
    </li>
  `).join('');
}
function renderNormalizeStats(container, project) {
  if (!container) return;
  if (!project) {
    container.innerHTML = '<div class="asset-empty">프로젝트를 먼저 불러와 주세요.</div>';
    return;
  }
  const rows = [
    ['소스 이름', project.sourceName],
    ['소스 타입', project.sourceType],
    ['정규화 시각', formatDateTime(project.summary.normalizedAt)],
    ['원격 stylesheet', `${formatNumber(project.summary.remoteStylesheetCount)}개`],
    ['미해결 자산', `${formatNumber(project.summary.assetsUnresolved)}개`],
    ['blob URL', `${formatNumber(project.fileContext.blobUrlCount)}개`],
  ];
  container.innerHTML = rows.map(([label, value]) => `
    <div class="stat-row"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>
  `).join('');
}
function renderSelectionInspector(container, editorMeta, imageDiagnostic = null) {
  if (!container) return;
  if (!editorMeta) {
    container.innerHTML = '<div class="asset-empty">미리보기를 로드하면 선택/슬롯 진단이 표시됩니다.</div>';
    return;
  }
  const selected = editorMeta.selected;
  const summary = editorMeta.slotSummary || { totalCount: 0, nearMissCount: 0 };
  const objectInspector = editorMeta?.objectInspector || null;
  const renderFieldRows = (source, fields, mixedMap = {}) => fields.map((field) => {
    const mixed = !!mixedMap?.[field.key];
    const raw = source?.[field.key];
    const value = mixed ? '혼합' : (raw === '' || raw == null ? '-' : String(raw));
    return `<div class="inspector-kv"><strong>${escapeHtml(field.label)}</strong><span>${escapeHtml(value)}</span></div>`;
  }).join('');
  const commonSectionsHtml = objectInspector
    ? OBJECT_INSPECTOR_SCHEMA.sections.map((section) => {
      const source = objectInspector.common?.[section.id] || {};
      return `
        <article class="inspector-card">
          <h4>${escapeHtml(section.title)}</h4>
          ${renderFieldRows(source, section.fields, source.mixed)}
        </article>
      `;
    }).join('')
    : '<div class="asset-empty">선택하면 공통 속성을 계산해 표시합니다.</div>';
  const pluginSectionsHtml = objectInspector
    ? Object.entries(OBJECT_INSPECTOR_SCHEMA.plugins).map(([pluginKey, schema]) => {
      const source = objectInspector.plugins?.[pluginKey];
      if (!source) return '';
      return `
        <article class="inspector-card">
          <h4>${escapeHtml(schema.title)}</h4>
          ${renderFieldRows(source, schema.fields)}
        </article>
      `;
    }).join('') || '<div class="asset-empty">선택 타입 전용 플러그인이 없습니다.</div>'
    : '';
  const selectedItemsHtml = editorMeta.selectedItems?.length
    ? `<div class="selected-pill-list">${editorMeta.selectedItems.slice(0, 8).map((item) => `<span class="selected-pill">${escapeHtml(truncate(item.label || item.uid || '-', 24))}</span>`).join('')}</div>`
    : '';
  const selectionHtml = !selected
    ? '<div class="asset-empty">현재 선택된 요소가 없습니다.</div>'
    : `
      <div class="inspector-card">
        <div class="inspector-kv"><strong>선택 타입</strong><span>${escapeHtml(selected.type || '-')}</span></div>
        <div class="inspector-kv"><strong>라벨</strong><span>${escapeHtml(selected.label || '-')}</span></div>
        <div class="inspector-kv"><strong>UID</strong><span>${escapeHtml(selected.uid || '-')}</span></div>
        <div class="inspector-kv"><strong>감지</strong><span>${escapeHtml(selected.detectedType || '-')}</span></div>
        <div class="inspector-kv"><strong>점수</strong><span>${escapeHtml(String(selected.score ?? '-'))}</span></div>
        <div class="inspector-kv"><strong>선택 개수</strong><span>${formatNumber(editorMeta.selectionCount || 0)}개</span></div>
        <div class="inspector-kv"><strong>숨김</strong><span>${selected.hidden ? '예' : '아니오'}</span></div>
        <div class="inspector-kv"><strong>잠금</strong><span>${selected.locked ? '예' : '아니오'}</span></div>
        <div class="inspector-kv"><strong>텍스트 편집</strong><span>${selected.textEditing ? '진행 중' : '아님'}</span></div>
        ${selectedItemsHtml}
        <div class="inspector-reasons">${(selected.reasons || []).length ? selected.reasons.map((item) => `<div>${escapeHtml(item)}</div>`).join('') : '감지 이유가 없습니다.'}</div>
      </div>`;
  const failure = imageDiagnostic?.status === 'failed' ? imageDiagnostic : null;
  const hasFailure = !!failure;
  const diagnosticItems = [
    {
      key: 'slotUnselected',
      label: '슬롯 미선택',
      action: 'select-first-slot',
      actionLabel: '첫 슬롯 선택',
      active: !!failure?.reasons?.slotUnselected,
      detail: failure?.details?.slotUnselected || '이미지를 넣으려면 슬롯을 먼저 선택해야 합니다.',
    },
    {
      key: 'filenameMismatch',
      label: '파일명 미매칭',
      action: 'show-filename-rule',
      actionLabel: '파일명 규칙 보기',
      active: !!failure?.reasons?.filenameMismatch,
      detail: failure?.details?.filenameMismatch || '파일명에 슬롯 이름(또는 uid) 일부를 포함하면 자동 매칭이 쉬워집니다.',
    },
    {
      key: 'unsupportedFormat',
      label: '지원 형식 아님',
      action: 'show-supported-extensions',
      actionLabel: '지원 확장자 보기',
      active: !!failure?.reasons?.unsupportedFormat,
      detail: failure?.details?.unsupportedFormat || '이미지 파일만 업로드할 수 있습니다.',
    },
  ];
  const diagnosticListHtml = diagnosticItems.map((item) => `
    <li class="${item.active ? 'is-active' : ''}">
      <div><strong>${escapeHtml(item.label)}</strong><div class="asset-ref">${escapeHtml(item.detail)}</div></div>
      <button type="button" data-image-diagnostic-action="${escapeHtml(item.action)}">${escapeHtml(item.actionLabel)}</button>
    </li>
  `).join('');
  const diagnosticHtml = `
    <article class="slot-card">
      <h3>이미지 진단</h3>
      ${hasFailure ? `<div class="asset-ref" style="margin-bottom:8px;">${escapeHtml(failure.message || '이미지 적용 실패 원인을 확인해 주세요.')}</div>` : '<div class="asset-empty">최근 이미지 적용 실패가 없습니다.</div>'}
      <ul class="upload-list">${diagnosticListHtml}</ul>
    </article>
  `;
  container.innerHTML = `
    <article class="slot-card">
      <h3>현재 선택</h3>
      ${selectionHtml}
    </article>
    <article class="slot-card">
      <h3>전체 진단</h3>
      <ul>
        <li>slots ${formatNumber(summary.totalCount)}개</li>
        <li>near miss ${formatNumber(summary.nearMissCount || 0)}개</li>
        <li>modified ${formatNumber(editorMeta.modifiedSlotCount || 0)}개</li>
        <li>hidden ${formatNumber(editorMeta.hiddenCount || 0)}개 · locked ${formatNumber(editorMeta.lockedCount || 0)}개</li>
        <li>selection mode ${escapeHtml(editorMeta.selectionMode || 'smart')}</li>
      </ul>
    </article>
    <article class="slot-card">
      <h3>Object Inspector (Schema 기반)</h3>
      ${commonSectionsHtml}
    </article>
    <article class="slot-card">
      <h3>Type Plugins</h3>
      ${pluginSectionsHtml}
    </article>
    ${diagnosticHtml}
  `;
}
function renderSlotList(container, editorMeta) {
  if (!container) return;
  if (!editorMeta?.slots?.length) {
    container.innerHTML = '<div class="asset-empty">감지된 슬롯이 없습니다.</div>';
    return;
  }
  const selectedUids = new Set((editorMeta.selectedItems || []).map((item) => item.uid));
  container.innerHTML = editorMeta.slots.map((slot, index) => `
    <button class="slot-list-item ${(selectedUids.has(slot.uid) || editorMeta.selected?.uid === slot.uid) ? 'is-active' : ''}" data-slot-uid="${escapeHtml(slot.uid)}">
      <div class="slot-list-item__top">
        <strong>#${index + 1} ${escapeHtml(truncate(slot.label, 42))}</strong>
        <span class="slot-badge" data-kind="${escapeHtml(slot.type)}">${escapeHtml(slot.type)}</span>
      </div>
      <div class="slot-list-item__meta">score ${escapeHtml(String(slot.score ?? '-'))} · ${escapeHtml(truncate(slot.groupKey || '', 48))}</div>
    </button>
  `).join('');
}
function renderSectionFilmstrip(container, editorMeta) {
  if (!container) return;
  if (!editorMeta?.sections?.length) {
    container.innerHTML = '<div class="asset-empty">감지된 섹션이 없습니다.</div>';
    return;
  }
  const selectedUids = new Set((editorMeta.selectedItems || []).map((item) => item.uid));
  container.innerHTML = editorMeta.sections.map((section, index) => `
    <button class="slot-list-item section-film-item ${(selectedUids.has(section.uid) || editorMeta.selected?.uid === section.uid) ? 'is-active' : ''}" data-section-uid="${escapeHtml(section.uid)}">
      <div class="slot-list-item__top">
        <strong>#${index + 1} ${escapeHtml(truncate(section.name || section.uid, 42))}</strong>
        <span class="slot-badge" data-kind="section">section</span>
      </div>
      <div class="slot-list-item__meta">uid ${escapeHtml(section.uid)}</div>
    </button>
  `).join('');
}
function renderLayerTree(container, editorMeta, filterText = '') {
  if (!container) return;
  if (!editorMeta?.layerTree?.length) {
    container.innerHTML = '<div class="asset-empty">레이어 정보가 아직 없습니다.</div>';
    return;
  }
  const needle = String(filterText || '').trim().toLowerCase();
  const selectedUids = new Set((editorMeta.selectedItems || []).map((item) => item.uid));
  const rows = editorMeta.layerTree.filter((node) => {
    if (!needle) return true;
    const haystack = [node.label, node.type, node.tagName, node.uid].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(needle);
  });
  if (!rows.length) {
    container.innerHTML = '<div class="asset-empty">필터에 맞는 레이어가 없습니다.</div>';
    return;
  }
  container.innerHTML = rows.map((node) => `
    <div class="layer-item ${(selectedUids.has(node.uid) || node.selectedViaGroup) ? 'is-active' : ''} ${node.hidden ? 'is-hidden' : ''} ${node.locked ? 'is-locked' : ''} ${node.type === 'group' ? 'is-group' : ''}" data-layer-uid="${escapeHtml(node.uid)}" style="--depth:${Math.max(0, Number(node.depth || 0))}" role="button" tabindex="0">
      <span class="layer-item__indent" aria-hidden="true"></span>
      <span class="layer-item__body">
        <strong>${node.type === 'group' ? '🗂️ ' : ''}${escapeHtml(truncate(node.label || node.uid, 40))}</strong>
        <span class="layer-item__meta">${escapeHtml(node.type)} · ${escapeHtml(node.tagName || '')}${node.childCount ? ` · child ${escapeHtml(String(node.childCount))}` : ''}</span>
        <span class="layer-item__status">
          ${node.hidden ? '<span class="status-chip" data-status="hidden">숨김</span>' : ''}
          ${node.locked ? '<span class="status-chip" data-status="locked">잠금</span>' : ''}
          ${node.selectedViaGroup ? '<span class="status-chip" data-status="selected">그룹선택</span>' : ''}
        </span>
      </span>
      <span class="layer-item__actions">
        <button class="layer-item__action ${node.hidden ? 'is-on' : ''}" data-layer-action="hide" data-layer-uid="${escapeHtml(node.uid)}">숨김</button>
        <button class="layer-item__action ${node.locked ? 'is-on' : ''}" data-layer-action="lock" data-layer-uid="${escapeHtml(node.uid)}">잠금</button>
        <span class="slot-badge" data-kind="${escapeHtml(node.type)}">${escapeHtml(node.type)}</span>
      </span>
    </div>
  `).join('');
}
function renderPreflight(container, editorMeta) {
  if (!container) return;
  const report = editorMeta?.preflight;
  if (!report) {
    container.innerHTML = '<div class="asset-empty">프로젝트를 열면 출력 전 검수 결과가 표시됩니다.</div>';
    return;
  }
  const checks = report.checks || [];
  const summaryHtml = `
    <div class="preflight-summary">
      <div class="preflight-pill ${report.blockingErrors ? 'is-error' : report.warningCount ? 'is-warn' : 'is-ok'}">
        ${report.blockingErrors ? `오류 ${formatNumber(report.blockingErrors)}개` : report.warningCount ? `경고 ${formatNumber(report.warningCount)}개` : '저장 가능'}
      </div>
      <div class="preflight-summary__meta">경고 ${formatNumber(report.warningCount || 0)} · 정보 ${formatNumber(report.infoCount || 0)} · 마지막 검사 ${escapeHtml(formatDateTime(report.generatedAt))}</div>
    </div>`;
  const listHtml = checks.length
    ? `<div class="preflight-list">${checks.map((item) => `
        <article class="preflight-item" data-level="${escapeHtml(item.level || 'info')}">
          <div class="preflight-item__head">
            <span class="issue__badge">${escapeHtml(item.level || 'info')}</span>
            <strong>${escapeHtml(item.title || item.code || '검수')}</strong>
            ${item.count ? `<span class="preflight-item__count">${escapeHtml(String(item.count))}</span>` : ''}
          </div>
          <div class="preflight-item__message">${escapeHtml(item.message || '')}</div>
        </article>`).join('')}</div>`
    : '<div class="asset-empty">현재 검수 이슈가 없습니다.</div>';
  container.innerHTML = `${summaryHtml}${listHtml}`;
}
function renderAssetTable(container, project, filterText = '') {
  if (!container) return;
  if (!project?.assets?.length) {
    container.innerHTML = '<div class="asset-empty">감지된 자산이 없습니다.</div>';
    return;
  }
  const needle = String(filterText || '').trim().toLowerCase();
  const visible = !needle
    ? project.assets
    : project.assets.filter((asset) => {
        const haystack = [asset.kind, asset.attribute, asset.originalRef, asset.previewRef, asset.scheme, asset.status, asset.matchedPath, asset.ownerLabel]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(needle);
      });

  if (!visible.length) {
    container.innerHTML = '<div class="asset-empty">필터에 맞는 자산이 없습니다.</div>';
    return;
  }

  container.innerHTML = `
    <table class="asset-table">
      <thead>
        <tr>
          <th>상태</th>
          <th>종류</th>
          <th>원본 ref</th>
          <th>해결 경로</th>
        </tr>
      </thead>
      <tbody>
        ${visible.map((asset) => `
          <tr>
            <td>
              <span class="asset-status" data-status="${escapeHtml(asset.status)}">${escapeHtml(asset.status)}</span>
              <div class="asset-ref">${escapeHtml(asset.scheme || '')}</div>
            </td>
            <td>
              <strong>${escapeHtml(asset.kind)}</strong>
              <div class="asset-ref">${escapeHtml(asset.ownerLabel || asset.ownerTag || '')}</div>
              <div class="asset-ref">${escapeHtml(asset.attribute || '')}</div>
            </td>
            <td><div class="asset-ref">${escapeHtml(truncate(asset.originalRef, 220))}</div></td>
            <td>
              <div class="asset-ref">${escapeHtml(truncate(asset.matchedPath || asset.previewRef || '', 220))}</div>
              <div class="asset-ref">${escapeHtml(asset.resolutionMethod || '')}</div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
function renderProjectMeta(container, project, meta = {}) {
  if (!container) return;
  if (!project) {
    container.innerHTML = '';
    return;
  }
  const chips = [
    ['source', project.sourceType],
    ['fixture', project.fixtureId || 'none'],
    ['file', project.sourceName],
    ['slots', `${project.summary.totalSlotCandidates} candidates`],
    ['select', meta.selectionMode || 'smart'],
    ['history', `undo ${meta.undoDepth || 0} · redo ${meta.redoDepth || 0}`],
  ];
  if (meta.selectionCount) chips.push(['picked', `${meta.selectionCount}개`]);
  if (meta.hiddenCount) chips.push(['hidden', `${meta.hiddenCount}개`]);
  if (meta.lockedCount) chips.push(['locked', `${meta.lockedCount}개`]);
  if (meta.exportPresetLabel) chips.push(['export', meta.exportPresetLabel]);
  if (meta.autosaveSavedAt) chips.push(['autosave', formatDateTime(meta.autosaveSavedAt)]);
  if (meta.textEditing) chips.push(['text', 'editing']);
  if (meta.preflightBlockingErrors) chips.push(['preflight', `error ${meta.preflightBlockingErrors}`]);
  container.innerHTML = chips.map(([label, value]) => `
    <span class="meta-chip"><strong>${escapeHtml(label)}</strong>${escapeHtml(value)}</span>
  `).join('');
}
function renderLocalModeNotice(container, envReport = null) {
  if (!container) return;
  const checks = envReport?.checks || [];
  const checksHtml = checks.length
    ? `<div class="preflight-list">${checks.map((item) => `
        <article class="preflight-item" data-level="${escapeHtml(item.level || 'info')}">
          <div class="preflight-item__head">
            <span class="issue__badge">${escapeHtml(item.level || 'info')}</span>
            <strong>${escapeHtml(item.code || 'ENV_CHECK')}</strong>
          </div>
          <div class="preflight-item__message">${escapeHtml(item.message || '')}</div>
        </article>
      `).join('')}</div>`
    : '<div class="asset-empty">환경 점검 결과: 금지 조건 없음 (기본 로컬 모드 정책 통과).</div>';
  container.innerHTML = `
    <div class="local-notice">
      <strong>로컬 전용 모드</strong>
      <div>이 버전은 서버 없이 <code>index.html</code>을 바로 열어도 동작하도록 구성했습니다.</div>
      <div>HTML/폴더 가져오기, Blob URL 미리보기, drag &amp; drop, autosave 복구, PNG/ZIP 저장을 모두 브라우저 안에서 처리합니다.</div>
      <div>직접 덮어쓰기 대신 브라우저 다운로드와 localStorage autosave를 기본 저장 흐름으로 사용합니다.</div>
      <div style="margin-top:8px;"><strong>앱 시작 환경 점검</strong></div>
      ${checksHtml}
    </div>
  `;
}


/* ===== src/main.js ===== */

const store = createProjectStore();
let activeEditor = null;
let mountedProjectId = '';
let pendingMountOptions = null;
let currentExportPresetId = 'market';
let currentCodeSource = 'edited';
let codeEditorDirty = false;
let geometryCoordMode = 'relative';
let currentSaveFormat = 'linked';
let lastSaveConversion = null;
let advancedSettingsDirty = false;
let lastFocusedBeforeShortcutHelp = null;
let lastFocusedBeforeDownloadModal = null;
let importRequestSequence = 0;
const zoomState = { mode: 'fit', value: 1 };
const viewFeatureFlags = {
  snap: true,
  guide: true,
  ruler: false,
};
const OPEN_DOWNLOAD_MODAL_BUTTON_LABEL = '저장/출력 열기';
const DEFAULT_JPG_QUALITY = 0.92;
const NUDGE_STEP_RULE = Object.freeze({
  base: 2,
  shift: 10,
  alt: 1,
});
const WORKFLOW_STEP_GUIDES = Object.freeze({
  load: 'HTML 파일이나 폴더를 먼저 불러오세요.',
  edit: '요소를 클릭한 뒤 드래그하세요.',
  save: `결과를 확인한 뒤 [${OPEN_DOWNLOAD_MODAL_BUTTON_LABEL}] 버튼을 눌러 실행하세요.`,
});
const LEFT_TAB_TO_WORKFLOW_STEP = Object.freeze({
  'left-start': 'load',
  'left-image': 'edit',
  'left-text': 'edit',
  'left-layers': 'edit',
  'left-export': 'save',
});
const WORKFLOW_STEP_TO_LEFT_TAB = Object.freeze({
  load: 'left-start',
  edit: 'left-image',
  save: 'left-export',
});
const SHORTCUT_TOOLTIP_MAP = Object.freeze({});
const BOOT_LOCAL_POLICY = Object.freeze({
  requiresStartupFetch: false,
  requiresFileSystemAccessApi: false,
  requiresServerEndpoint: false,
});
const SUPPORTED_IMAGE_EXTENSIONS = Object.freeze(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.avif']);
const SUPPORTED_IMAGE_EXTENSIONS_TEXT = SUPPORTED_IMAGE_EXTENSIONS.join(', ');
const APP_STATES = Object.freeze({
  launch: 'launch',
  editor: 'editor',
});
let currentAppState = APP_STATES.launch;
const BEGINNER_MODE_STORAGE_KEY = 'detail_editor_beginner_mode_v1';
const ONBOARDING_COMPLETED_STORAGE_KEY = 'detail_editor_onboarding_completed_v1';
const ONBOARDING_SAMPLE_CHECKED_STORAGE_KEY = 'detail_editor_onboarding_sample_checked_v1';
const COMMAND_REGISTRY = Object.freeze([
  { id: 'tool-select', label: '선택 도구', shortcut: 'V', keywords: ['선택', '화살표', 'v'], run: () => { setSelectionMode('smart'); return { ok: true, message: '선택 도구(V)로 전환했습니다.' }; } },
  { id: 'tool-text', label: '텍스트 도구', shortcut: 'T', keywords: ['텍스트', '글자', 't'], run: () => { setSelectionMode('text'); return { ok: true, message: '텍스트 도구(T)로 전환했습니다.' }; } },
  { id: 'tool-box', label: '박스 도구', shortcut: 'R', keywords: ['박스', '사각형', 'r'], run: () => { setSelectionMode('box'); return { ok: true, message: '박스 도구(R)로 전환했습니다.' }; } },
  { id: 'duplicate', label: '선택 복제', shortcut: 'Ctrl/Cmd + D', keywords: ['복제', '복사', 'duplicate'], run: () => executeEditorCommand('duplicate') },
  { id: 'delete', label: '선택 삭제', shortcut: 'Delete', keywords: ['삭제', '지우기', 'remove'], run: () => executeEditorCommand('delete') },
  { id: 'group', label: '그룹 묶기', shortcut: 'Ctrl/Cmd + G', keywords: ['그룹', '묶기'], run: () => executeEditorCommand('group-selection') },
  { id: 'ungroup', label: '그룹 해제', shortcut: 'Shift + Ctrl/Cmd + G', keywords: ['그룹해제', '해제', 'ungroup'], run: () => executeEditorCommand('ungroup-selection') },
  { id: 'save-edited', label: '문서 저장', shortcut: 'Ctrl/Cmd + S', keywords: ['저장', '세이브', 'save'], run: () => { downloadEditedHtml().catch((error) => setStatus(`문서 저장 중 오류: ${error?.message || error}`)); return { ok: true, message: '문서 저장을 실행했습니다.' }; } },
  { id: 'export-png', label: '전체 PNG 내보내기', shortcut: '-', keywords: ['png', '내보내기', '이미지'], run: () => { exportFullPng().catch((error) => setStatus(`PNG 내보내기 오류: ${error?.message || error}`)); return { ok: true, message: '전체 PNG 내보내기를 실행했습니다.' }; } },
  { id: 'section-add', label: '섹션 추가', shortcut: '-', keywords: ['섹션 추가', 'section', '블록 추가'], run: () => {
    if (!activeEditor) return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
    const uid = store.getState().editorMeta?.selectedSectionUid || '';
    return activeEditor.addSectionAfterUid(uid);
  } },
  { id: 'stack-horizontal', label: '가로 스택 정렬', shortcut: '-', keywords: ['가로', 'stack', '정렬'], run: () => applyStackCommand('horizontal') },
  { id: 'stack-vertical', label: '세로 스택 정렬', shortcut: '-', keywords: ['세로', 'stack', '정렬'], run: () => applyStackCommand('vertical') },
  { id: 'tidy-horizontal', label: '가로 간격 맞춤', shortcut: '-', keywords: ['가로 간격', 'tidy', '균등'], run: () => applyTidyCommand('x') },
  { id: 'tidy-vertical', label: '세로 간격 맞춤', shortcut: '-', keywords: ['세로 간격', 'tidy', '균등'], run: () => applyTidyCommand('y') },
  { id: 'toggle-shortcut-help', label: '단축키 치트시트 열기/닫기', shortcut: '?', keywords: ['도움말', '단축키', '치트시트'], run: () => ({ ok: true, message: toggleShortcutHelp() ? '단축키 치트시트를 열었습니다.' : '단축키 치트시트를 닫았습니다.' }) },
]);
const BEGINNER_TUTORIAL_STEPS = Object.freeze([
  {
    id: 'slot-select',
    title: '1) 슬롯 선택',
    body: '먼저 [슬롯 지정] 버튼을 눌러 선택한 요소를 슬롯으로 지정하세요.',
    targetElementKey: 'manualSlotButton',
  },
  {
    id: 'replace-image',
    title: '2) 이미지 교체',
    body: '이제 [이미지 넣기] 버튼을 눌러 이미지를 교체하세요.',
    targetElementKey: 'replaceImageButton',
  },
  {
    id: 'save-png',
    title: '3) PNG 저장',
    body: '마지막으로 상단 [PNG] 버튼을 눌러 저장하면 온보딩이 끝나요.',
    targetElementKey: 'exportPngButton',
  },
]);
let isBeginnerMode = false;
let beginnerTutorialStepIndex = 0;
let onboardingCompleted = false;
let lastFocusedBeforeCommandPalette = null;
let commandPaletteResults = [];
let commandPaletteActiveIndex = 0;

const historyState = {
  baseSnapshot: null,
  undoStack: [],
  redoStack: [],
};
const HISTORY_MERGE_WINDOW_MS = 700;
const LIVE_HISTORY_LABELS = new Set(['geometry-patch', 'apply-text-style', 'clear-text-style']);

const advancedSettings = {
  geometryCoordMode: 'relative',
  exportScale: 1,
  exportJpgQuality: DEFAULT_JPG_QUALITY,
  selectionExportPadding: 16,
  selectionExportBackground: 'transparent',
};

const EXPORT_SCALE_OPTIONS = Object.freeze([1, 2, 3]);
const EXPORT_NEXT_ACTION_HINTS = Object.freeze({
  'export-full-png': '다음: 업로드 화면에서 비율(권장 860px 기준)을 확인해 주세요.',
  'export-full-jpg': '다음: 톤/압축 품질을 확인한 뒤 공유하세요.',
  'export-selection-png': '다음: 선택 범위 경계가 맞는지 바로 확인해 주세요.',
  'export-sections-zip': '다음: ZIP을 풀어 섹션 파일 순서와 누락 여부를 확인해 주세요.',
  'download-export-preset-package': '다음: ZIP을 풀고 목적(업로드/검수/보관)에 맞게 전달해 주세요.',
});
const IMPORT_FAILURE_GUIDES = Object.freeze({
  htmlOpen: '안내: HTML 파일(.html/.htm)인지 확인하고 다시 선택해 주세요.',
  folderNoHtml: '안내: 폴더 안에 대표 HTML 파일(예: index.html)을 넣어 주세요.',
  folderImport: '안내: HTML과 assets 폴더를 같은 루트에서 다시 선택해 주세요.',
  pasteMalformed: '안내: 닫히지 않은 태그(예: </div>)를 확인한 뒤 다시 붙여넣어 주세요.',
});

const elements = {
  appLauncher: document.getElementById('appLauncher'),
  appShell: document.getElementById('appShell'),
  appStatusbar: document.getElementById('appStatusbar'),
  launcherNewButton: document.getElementById('launcherNewButton'),
  launcherUploadButton: document.getElementById('launcherUploadButton'),
  launcherRecentButton: document.getElementById('launcherRecentButton'),
  launcherFixtureButtons: Array.from(document.querySelectorAll('[data-launch-fixture]')),
  fixtureSelect: document.getElementById('fixtureSelect'),
  openHtmlButton: document.getElementById('openHtmlButton'),
  openFolderButton: document.getElementById('openFolderButton'),
  loadFixtureButton: document.getElementById('loadFixtureButton'),
  applyPasteButton: document.getElementById('applyPasteButton'),
  replaceImageButton: document.getElementById('replaceImageButton'),
  manualSlotButton: document.getElementById('manualSlotButton'),
  demoteSlotButton: document.getElementById('demoteSlotButton'),
  toggleHideButton: document.getElementById('toggleHideButton'),
  toggleLockButton: document.getElementById('toggleLockButton'),
  redetectButton: document.getElementById('redetectButton'),
  textEditButton: document.getElementById('textEditButton'),
  duplicateButton: document.getElementById('duplicateButton'),
  deleteButton: document.getElementById('deleteButton'),
  addTextButton: document.getElementById('addTextButton'),
  addBoxButton: document.getElementById('addBoxButton'),
  addSlotButton: document.getElementById('addSlotButton'),
  selectionSmartButton: document.getElementById('selectionSmartButton'),
  groupButton: document.getElementById('groupButton'),
  ungroupButton: document.getElementById('ungroupButton'),
  undoButton: document.getElementById('undoButton'),
  redoButton: document.getElementById('redoButton'),
  restoreAutosaveButton: document.getElementById('restoreAutosaveButton'),
  saveProjectSnapshotButton: document.getElementById('saveProjectSnapshotButton'),
  openDownloadModalButton: document.getElementById('openDownloadModalButton'),
  downloadModal: document.getElementById('downloadModal'),
  closeDownloadModalButton: document.getElementById('closeDownloadModalButton'),
  downloadChoiceSelect: document.getElementById('downloadChoiceSelect'),
  runDownloadChoiceButton: document.getElementById('runDownloadChoiceButton'),
  downloadPresetButtons: Array.from(document.querySelectorAll('[data-download-preset]')),
  saveFormatSelect: document.getElementById('saveFormatSelect'),
  saveFormatStatus: document.getElementById('saveFormatStatus'),
  saveFormatGuide: document.getElementById('saveFormatGuide'),
  saveFormatPreview: document.getElementById('saveFormatPreview'),
  saveMetaSummary: document.getElementById('saveMetaSummary'),
  modalDownloadEditedButton: document.getElementById('modalDownloadEditedButton'),
  downloadEditedButtons: Array.from(document.querySelectorAll('[data-download-action="save-edited"]')),
  downloadNormalizedButton: document.getElementById('downloadNormalizedButton'),
  downloadLinkedZipButton: document.getElementById('downloadLinkedZipButton'),
  modalExportPngButton: document.getElementById('modalExportPngButton'),
  exportPngButton: document.getElementById('exportPngButton'),
  exportPngButtons: Array.from(document.querySelectorAll('[data-download-action="export-full-png"]')),
  modalExportJpgButton: document.getElementById('modalExportJpgButton'),
  exportJpgButtons: Array.from(document.querySelectorAll('[data-download-action="export-full-jpg"]')),
  exportSectionsZipButton: document.getElementById('exportSectionsZipButton'),
  exportSelectionPngButton: document.getElementById('exportSelectionPngButton'),
  exportPresetPackageButton: document.getElementById('exportPresetPackageButton'),
  selectionExportPaddingInput: document.getElementById('selectionExportPaddingInput'),
  selectionExportBackgroundSelect: document.getElementById('selectionExportBackgroundSelect'),
  exportPresetSelect: document.getElementById('exportPresetSelect'),
  exportScaleSelectMain: document.getElementById('exportScaleSelectMain'),
  exportScaleSelectControls: Array.from(document.querySelectorAll('[data-export-scale-control]')),
  exportJpgQualityInputMain: document.getElementById('exportJpgQualityInputMain'),
  exportJpgQualityInputs: Array.from(document.querySelectorAll('[data-export-jpg-quality-control]')),
  downloadReportButton: document.getElementById('downloadReportButton'),
  htmlFileInput: document.getElementById('htmlFileInput'),
  folderInput: document.getElementById('folderInput'),
  replaceImageInput: document.getElementById('replaceImageInput'),
  htmlPasteInput: document.getElementById('htmlPasteInput'),
  summaryCards: document.getElementById('summaryCards'),
  issueList: document.getElementById('issueList'),
  uploadRecentList: document.getElementById('uploadRecentList'),
  uploadDocumentList: document.getElementById('uploadDocumentList'),
  uploadUnassignedList: document.getElementById('uploadUnassignedList'),
  uploadBrokenList: document.getElementById('uploadBrokenList'),
  snapshotNameInput: document.getElementById('snapshotNameInput'),
  saveSnapshotFromPanelButton: document.getElementById('saveSnapshotFromPanelButton'),
  snapshotList: document.getElementById('snapshotList'),
  normalizeStats: document.getElementById('normalizeStats'),
  selectionInspector: document.getElementById('selectionInspector'),
  slotList: document.getElementById('slotList'),
  sectionList: document.getElementById('sectionList'),
  sectionDuplicateButton: document.getElementById('sectionDuplicateButton'),
  sectionMoveUpButton: document.getElementById('sectionMoveUpButton'),
  sectionMoveDownButton: document.getElementById('sectionMoveDownButton'),
  sectionDeleteButton: document.getElementById('sectionDeleteButton'),
  sectionAddButton: document.getElementById('sectionAddButton'),
  selectionEmptyState: document.getElementById('selectionEmptyState'),
  layerTree: document.getElementById('layerTree'),
  layerFilterInput: document.getElementById('layerFilterInput'),
  preflightContainer: document.getElementById('preflightContainer'),
  preflightRefreshButton: document.getElementById('preflightRefreshButton'),
  assetTableWrap: document.getElementById('assetTableWrap'),
  assetFilterInput: document.getElementById('assetFilterInput'),
  previewFrame: document.getElementById('previewFrame'),
  editedCodeView: document.getElementById('editedCodeView'),
  normalizedCodeView: document.getElementById('normalizedCodeView'),
  originalCodeView: document.getElementById('originalCodeView'),
  jsonReportView: document.getElementById('jsonReportView'),
  projectMeta: document.getElementById('projectMeta'),
  documentStatusChip: document.getElementById('documentStatusChip'),
  statusText: document.getElementById('statusText'),
  localModeNotice: document.getElementById('localModeNotice'),
  textStyleSummary: document.getElementById('textStyleSummary'),
  textFontSizeInput: document.getElementById('textFontSizeInput'),
  textLineHeightInput: document.getElementById('textLineHeightInput'),
  textLetterSpacingInput: document.getElementById('textLetterSpacingInput'),
  textWeightSelect: document.getElementById('textWeightSelect'),
  textColorInput: document.getElementById('textColorInput'),
  applyTextStyleButton: document.getElementById('applyTextStyleButton'),
  clearTextStyleButton: document.getElementById('clearTextStyleButton'),
  batchSelectionSummary: document.getElementById('batchSelectionSummary'),
  geometryXInput: document.getElementById('geometryXInput'),
  geometryYInput: document.getElementById('geometryYInput'),
  geometryWInput: document.getElementById('geometryWInput'),
  geometryHInput: document.getElementById('geometryHInput'),
  geometryCoordModeSelect: document.getElementById('geometryCoordModeSelect'),
  geometryRuleHint: document.getElementById('geometryRuleHint'),
  applyGeometryButton: document.getElementById('applyGeometryButton'),
  arrangeToggleHideButton: document.getElementById('arrangeToggleHideButton'),
  arrangeToggleLockButton: document.getElementById('arrangeToggleLockButton'),
  basicAttributeSection: document.getElementById('basicAttributeSection'),
  advancedAttributeSection: document.getElementById('advancedAttributeSection'),
  applyAdvancedSettingsButton: document.getElementById('applyAdvancedSettingsButton'),
  advancedSettingsState: document.getElementById('advancedSettingsState'),
  bringForwardButton: document.getElementById('bringForwardButton'),
  sendBackwardButton: document.getElementById('sendBackwardButton'),
  bringToFrontButton: document.getElementById('bringToFrontButton'),
  sendToBackButton: document.getElementById('sendToBackButton'),
  imageNudgeLeftButton: document.getElementById('imageNudgeLeftButton'),
  imageNudgeRightButton: document.getElementById('imageNudgeRightButton'),
  imageNudgeUpButton: document.getElementById('imageNudgeUpButton'),
  imageNudgeDownButton: document.getElementById('imageNudgeDownButton'),
  toggleLeftSidebarButton: document.getElementById('toggleLeftSidebarButton'),
  toggleRightSidebarButton: document.getElementById('toggleRightSidebarButton'),
  focusModeButton: document.getElementById('focusModeButton'),
  workflowGuideSelect: document.getElementById('workflowGuideSelect'),
  workflowGuideLine: document.getElementById('workflowGuideLine'),
  zoomOutButton: document.getElementById('zoomOutButton'),
  zoomInButton: document.getElementById('zoomInButton'),
  zoomResetButton: document.getElementById('zoomResetButton'),
  zoomFitButton: document.getElementById('zoomFitButton'),
  zoomLabel: document.getElementById('zoomLabel'),
  previewViewport: document.getElementById('previewViewport'),
  previewScaler: document.getElementById('previewScaler'),
  canvasContextBar: document.getElementById('canvasContextBar'),
  miniHud: document.getElementById('miniHud'),
  miniHudPos: document.getElementById('miniHudPos'),
  miniHudSize: document.getElementById('miniHudSize'),
  miniHudLayer: document.getElementById('miniHudLayer'),
  canvasGeometryXInput: document.getElementById('canvasGeometryXInput'),
  canvasGeometryYInput: document.getElementById('canvasGeometryYInput'),
  canvasGeometryWInput: document.getElementById('canvasGeometryWInput'),
  canvasGeometryHInput: document.getElementById('canvasGeometryHInput'),
  applyCanvasGeometryButton: document.getElementById('applyCanvasGeometryButton'),
  codeEditorTextarea: document.getElementById('codeEditorTextarea'),
  codeSearchInput: document.getElementById('codeSearchInput'),
  codeSearchNextButton: document.getElementById('codeSearchNextButton'),
  reloadCodeFromEditorButton: document.getElementById('reloadCodeFromEditorButton'),
  applyCodeToEditorButton: document.getElementById('applyCodeToEditorButton'),
  codeSourceButtons: Array.from(document.querySelectorAll('[data-code-source]')),
  sidebarTabButtons: Array.from(document.querySelectorAll('[data-sidebar-tab]')),
  sidebarPanels: Array.from(document.querySelectorAll('[data-sidebar-panel]')),
  viewSnapToggleButton: document.getElementById('viewSnapToggleButton'),
  viewGuideToggleButton: document.getElementById('viewGuideToggleButton'),
  viewRulerToggleButton: document.getElementById('viewRulerToggleButton'),
  selectionModeButtons: Array.from(document.querySelectorAll('[data-selection-mode]')),
  presetButtons: Array.from(document.querySelectorAll('[data-preset]')),
  actionButtons: Array.from(document.querySelectorAll('[data-action]')),
  batchActionButtons: Array.from(document.querySelectorAll('[data-batch-action]')),
  textAlignButtons: Array.from(document.querySelectorAll('[data-text-align]')),
  canvasActionButtons: Array.from(document.querySelectorAll('[data-canvas-action]')),
  shortcutHelpOverlay: document.getElementById('shortcutHelpOverlay'),
  shortcutHelpList: document.getElementById('shortcutHelpList'),
  shortcutHelpCloseButton: document.getElementById('shortcutHelpCloseButton'),
  commandPaletteOverlay: document.getElementById('commandPaletteOverlay'),
  commandPaletteCloseButton: document.getElementById('commandPaletteCloseButton'),
  commandPaletteInput: document.getElementById('commandPaletteInput'),
  commandPaletteList: document.getElementById('commandPaletteList'),
  commandPaletteRunButton: document.getElementById('commandPaletteRunButton'),
  stackDirectionSelect: document.getElementById('stackDirectionSelect'),
  stackGapInput: document.getElementById('stackGapInput'),
  stackAlignSelect: document.getElementById('stackAlignSelect'),
  stackHorizontalButton: document.getElementById('stackHorizontalButton'),
  stackVerticalButton: document.getElementById('stackVerticalButton'),
  tidyHorizontalButton: document.getElementById('tidyHorizontalButton'),
  tidyVerticalButton: document.getElementById('tidyVerticalButton'),
  beginnerMoreItems: Array.from(document.querySelectorAll('[data-beginner-more-item]')),
  beginnerModeToggle: document.getElementById('beginnerModeToggle'),
  beginnerMoreItems: Array.from(document.querySelectorAll('[data-beginner-more-item]')),
  advancedTopbarPanel: document.getElementById('advancedTopbarPanel'),
  beginnerTutorialTooltip: document.getElementById('beginnerTutorialTooltip'),
  beginnerTutorialTitle: document.getElementById('beginnerTutorialTitle'),
  beginnerTutorialBody: document.getElementById('beginnerTutorialBody'),
  beginnerTutorialStep: document.getElementById('beginnerTutorialStep'),
  beginnerTutorialPrevButton: document.getElementById('beginnerTutorialPrevButton'),
  beginnerTutorialNextButton: document.getElementById('beginnerTutorialNextButton'),
  beginnerTutorialCloseButton: document.getElementById('beginnerTutorialCloseButton'),
  onboardingReplayButton: document.getElementById('onboardingReplayButton'),
  onboardingChecklist: document.getElementById('onboardingChecklist'),
  onboardingChecklistItem: document.getElementById('onboardingChecklistItem'),
  onboardingChecklistDoneButton: document.getElementById('onboardingChecklistDoneButton'),
  beginnerMoreItems: Array.from(document.querySelectorAll('[data-beginner-more-item]')),
};

const beginnerMoreItemAnchors = new WeakMap();

for (const item of elements.beginnerMoreItems || []) {
  beginnerMoreItemAnchors.set(item, {
    parent: item.parentElement,
    nextSibling: item.nextSibling,
  });
}

function readFromLocalStorage(key, fallback = null) {
  try {
    const value = window.localStorage.getItem(key);
    return value == null ? fallback : value;
  } catch {
    return fallback;
  }
}

function writeToLocalStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

function hasCompletedOnboarding() {
  return readFromLocalStorage(ONBOARDING_COMPLETED_STORAGE_KEY, '') === '1';
}

function hasCompletedOnboardingSampleTask() {
  return readFromLocalStorage(ONBOARDING_SAMPLE_CHECKED_STORAGE_KEY, '') === '1';
}

function markOnboardingCompleted() {
  onboardingCompleted = true;
  writeToLocalStorage(ONBOARDING_COMPLETED_STORAGE_KEY, '1');
}

function clearOnboardingHighlights() {
  document.querySelectorAll('.onboarding-highlight').forEach((target) => target.classList.remove('onboarding-highlight'));
}

function applyOnboardingHighlightForCurrentStep() {
  clearOnboardingHighlights();
  if (onboardingCompleted) return;
  const step = BEGINNER_TUTORIAL_STEPS[beginnerTutorialStepIndex] || null;
  const target = step?.targetElementKey ? elements[step.targetElementKey] : null;
  target?.classList.add('onboarding-highlight');
}

function closeBeginnerTutorial() {
  if (elements.beginnerTutorialTooltip) elements.beginnerTutorialTooltip.hidden = true;
  clearOnboardingHighlights();
}

function renderOnboardingChecklist() {
  if (!elements.onboardingChecklist) return;
  const done = hasCompletedOnboardingSampleTask();
  elements.onboardingChecklist.hidden = !onboardingCompleted;
  if (elements.onboardingChecklistItem) {
    elements.onboardingChecklistItem.textContent = done
      ? '✅ 샘플 작업 1회 실행 완료'
      : '⬜ 샘플(F05)에서 슬롯 선택 → 이미지 교체 → PNG 저장을 1회 실행해 보세요.';
  }
  if (elements.onboardingChecklistDoneButton) {
    elements.onboardingChecklistDoneButton.disabled = done;
    elements.onboardingChecklistDoneButton.textContent = done ? '체크 완료' : '완료 체크';
  }
}

function renderBeginnerTutorialStep() {
  const step = BEGINNER_TUTORIAL_STEPS[beginnerTutorialStepIndex] || BEGINNER_TUTORIAL_STEPS[0];
  if (elements.beginnerTutorialTitle) elements.beginnerTutorialTitle.textContent = step.title;
  if (elements.beginnerTutorialBody) elements.beginnerTutorialBody.textContent = step.body;
  if (elements.beginnerTutorialStep) elements.beginnerTutorialStep.textContent = `${beginnerTutorialStepIndex + 1} / ${BEGINNER_TUTORIAL_STEPS.length}`;
  if (elements.beginnerTutorialPrevButton) elements.beginnerTutorialPrevButton.disabled = beginnerTutorialStepIndex < 1;
  if (elements.beginnerTutorialNextButton) {
    const isLast = beginnerTutorialStepIndex >= BEGINNER_TUTORIAL_STEPS.length - 1;
    elements.beginnerTutorialNextButton.textContent = isLast ? '완료' : '다음';
  }
  applyOnboardingHighlightForCurrentStep();
}

function openBeginnerTutorial({ force = false } = {}) {
  if (!force && onboardingCompleted) return;
  beginnerTutorialStepIndex = 0;
  renderBeginnerTutorialStep();
  if (elements.beginnerTutorialTooltip) elements.beginnerTutorialTooltip.hidden = false;
}

function openBeginnerTutorialIfNeeded() {
  if (onboardingCompleted) return;
  openBeginnerTutorial();
}

function completeOnboardingTutorial() {
  markOnboardingCompleted();
  closeBeginnerTutorial();
  renderOnboardingChecklist();
  setStatus('온보딩을 완료했습니다. 아래 체크리스트로 샘플 작업을 1회 실행해 보세요.');
}

function advanceOnboardingByAction(actionId) {
  if (onboardingCompleted || elements.beginnerTutorialTooltip?.hidden) return;
  const step = BEGINNER_TUTORIAL_STEPS[beginnerTutorialStepIndex] || null;
  if (!step || step.id !== actionId) return;
  if (beginnerTutorialStepIndex >= BEGINNER_TUTORIAL_STEPS.length - 1) {
    completeOnboardingTutorial();
    return;
  }
  beginnerTutorialStepIndex += 1;
  renderBeginnerTutorialStep();
}

function applyBeginnerModeUi() {
  document.body.classList.toggle('beginner-mode', isBeginnerMode);
  if (elements.beginnerModeToggle) {
    elements.beginnerModeToggle.textContent = `초보 모드: ${isBeginnerMode ? 'ON' : 'OFF'}`;
    elements.beginnerModeToggle.setAttribute('aria-pressed', isBeginnerMode ? 'true' : 'false');
  }
  if (isBeginnerMode && elements.advancedTopbarPanel) elements.advancedTopbarPanel.open = false;
}

function setBeginnerMode(next, { silent = false } = {}) {
  isBeginnerMode = !!next;
  applyBeginnerModeUi();
  writeToLocalStorage(BEGINNER_MODE_STORAGE_KEY, isBeginnerMode ? '1' : '0');
  if (!silent) setStatus(`초보 모드를 ${isBeginnerMode ? '켰습니다' : '껐습니다'}.`);
}

function evaluateWorkflowStepReadiness(step, state) {
  const hasProject = !!state?.project;
  const hasEditor = !!activeEditor;
  const selectionCount = Number(state?.editorMeta?.selectionCount || 0);
  if (step === 'edit' && !hasProject) {
    return { ok: false, message: '[단계 안내] 2) 편집으로 가기 전, 1) 불러오기에서 HTML/폴더를 먼저 열어 주세요.' };
  }
  if (step === 'save' && (!hasProject || !hasEditor)) {
    return { ok: false, message: '[단계 안내] 3) 저장/출력 전, 1) 불러오기와 2) 편집 준비가 필요합니다.' };
  }
  if (step === 'save' && selectionCount < 1) {
    return { ok: true, message: '[단계 안내] 선택 요소가 없습니다. 전체 저장/출력은 가능하며, 선택 PNG는 요소를 선택한 뒤 사용하세요.' };
  }
  return { ok: true, message: '' };
}

function syncWorkflowGuide(state, { announce = false } = {}) {
  const selectedStep = elements.workflowGuideSelect?.value || 'load';
  if (elements.workflowGuideLine) {
    elements.workflowGuideLine.textContent = WORKFLOW_STEP_GUIDES[selectedStep] || WORKFLOW_STEP_GUIDES.load;
  }
  if (announce) {
    const check = evaluateWorkflowStepReadiness(selectedStep, state);
    if (check.message) setStatus(check.message);
  }
}

function syncWorkflowGuideStepByLeftTab(leftTabId, { announce = false } = {}) {
  const mappedStep = LEFT_TAB_TO_WORKFLOW_STEP[String(leftTabId || '')];
  if (!mappedStep) return;
  if (elements.workflowGuideSelect && elements.workflowGuideSelect.value !== mappedStep) {
    elements.workflowGuideSelect.value = mappedStep;
  }
  syncWorkflowGuide(store.getState(), { announce });
}

function resolveDocumentStatus(state) {
  if (!state?.project || !activeEditor) return { status: 'idle', text: '문서 없음' };
  if (state.lastError) return { status: 'error', text: '오류 있음' };
  if (codeEditorDirty || advancedSettingsDirty || historyState.undoStack.length > 0) return { status: 'dirty', text: '편집 중' };
  return { status: 'ready', text: '저장 가능' };
}

function projectBaseName(project) {
  return sanitizeFilename((project?.sourceName || 'detail-page').replace(/\.html?$/i, '') || 'detail-page');
}

function exportScale() {
  const value = Number.parseFloat(String(advancedSettings.exportScale || 1));
  if (!Number.isFinite(value)) return 1;
  if (value >= 2.5) return 3;
  if (value >= 1.5) return 2;
  return 1;
}

function exportJpgQuality() {
  const raw = Number.parseFloat(String(advancedSettings.exportJpgQuality || DEFAULT_JPG_QUALITY));
  if (!Number.isFinite(raw)) return DEFAULT_JPG_QUALITY;
  return Math.min(1, Math.max(0.1, raw));
}

function selectionExportPadding() {
  const raw = Number.parseFloat(String(advancedSettings.selectionExportPadding || 16));
  if (!Number.isFinite(raw)) return 0;
  return Math.max(0, Math.min(240, Math.round(raw)));
}

function selectionExportBackground() {
  const raw = String(advancedSettings.selectionExportBackground || 'transparent');
  return raw === 'opaque' ? 'opaque' : 'transparent';
}

function setStatus(text, options = undefined) {
  store.setStatus(text, options);
}

function setImageApplyDiagnostic(diagnostic) {
  store.setImageApplyDiagnostic(diagnostic || null);
}

function buildImageFailureDiagnostic({ files = [], editorMeta = null, statusMessage = '' } = {}) {
  const firstFile = files[0] || null;
  const fileName = firstFile?.name || '';
  const selected = editorMeta?.selected || null;
  const selectedSlotLabel = selected?.label || selected?.uid || '';
  const extension = fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')).toLowerCase() : '';
  const unsupportedFormat = !!extension && !SUPPORTED_IMAGE_EXTENSIONS.includes(extension);
  const filenameMismatch = !!fileName && !!selectedSlotLabel && !fileName.toLowerCase().includes(String(selectedSlotLabel).toLowerCase());
  const slotUnselected = !selected || selected.type !== 'slot';

  return {
    status: 'failed',
    message: statusMessage || '이미지 적용 실패 원인을 확인해 주세요.',
    reasons: {
      slotUnselected,
      filenameMismatch,
      unsupportedFormat,
    },
    details: {
      slotUnselected: slotUnselected ? '슬롯을 먼저 선택한 뒤 이미지를 넣어 주세요.' : '',
      filenameMismatch: filenameMismatch ? `선택 슬롯(${selectedSlotLabel})과 파일명(${fileName})이 다릅니다.` : '',
      unsupportedFormat: unsupportedFormat ? `지원하지 않는 확장자입니다: ${extension}` : '',
    },
  };
}

function setAppState(nextState) {
  const normalized = nextState === APP_STATES.editor ? APP_STATES.editor : APP_STATES.launch;
  currentAppState = normalized;
  const isEditor = normalized === APP_STATES.editor;
  if (elements.appLauncher) elements.appLauncher.hidden = isEditor;
  if (elements.appShell) elements.appShell.hidden = !isEditor;
  if (elements.appStatusbar) elements.appStatusbar.hidden = !isEditor;
}

function refreshLauncherRecentButton() {
  if (!elements.launcherRecentButton) return;
  const payload = readAutosavePayload();
  const hasSnapshot = !!payload?.snapshot?.html;
  elements.launcherRecentButton.disabled = false;
  elements.launcherRecentButton.dataset.available = hasSnapshot ? 'true' : 'false';
}

function extractErrorMessage(error) {
  if (!error) return '';
  if (typeof error.message === 'string' && error.message.trim()) return error.message.trim();
  if (typeof error === 'string' && error.trim()) return error.trim();
  return '';
}

function setStatusWithError(prefix, error, { logTag = 'APP_ERROR' } = {}) {
  const detail = extractErrorMessage(error);
  if (logTag) console.error(`[${logTag}]`, error);
  store.setLastError(detail);
  setStatus(prefix, { preserveLastError: true });
}

function buildImageFailureDiagnostic({ files = [], editorMeta = null, statusMessage = '' } = {}) {
  const firstFile = files[0] || null;
  const selected = editorMeta?.selected || null;
  const selectedSlotLike = !!selected && (selected.type === 'slot' || selected.detectedType === 'slot');
  const reasons = {
    slotUnselected: !selectedSlotLike,
    filenameMismatch: false,
    unsupportedFormat: !!firstFile && !String(firstFile.type || '').startsWith('image/'),
  };
  const details = {
    slotUnselected: selectedSlotLike ? '선택된 슬롯이 있습니다.' : '이미지를 적용할 슬롯을 먼저 선택해 주세요.',
    filenameMismatch: '필요하면 파일명에 슬롯 이름 일부를 포함해 자동 매칭 정확도를 높이세요.',
    unsupportedFormat: reasons.unsupportedFormat ? `현재 파일 형식: ${firstFile.type || 'unknown'}` : '이미지 파일 형식입니다.',
  };
  return {
    status: 'failed',
    message: statusMessage || '이미지 적용 실패 원인을 확인해 주세요.',
    reasons,
    details,
  };
}

function isTypingInputTarget(target) {
  if (!target || !(target instanceof Element)) return false;
  if (target.closest('[contenteditable="true"]')) return true;
  const tagName = target.tagName;
  if (tagName === 'TEXTAREA' || tagName === 'SELECT') return true;
  if (tagName !== 'INPUT') return false;
  const inputType = String(target.getAttribute('type') || 'text').toLowerCase();
  return inputType !== 'checkbox' && inputType !== 'radio' && inputType !== 'button' && inputType !== 'submit' && inputType !== 'reset';
}

function toggleShortcutHelp(forceOpen = null) {
  const overlay = elements.shortcutHelpOverlay;
  if (!overlay) return false;
  const shouldOpen = forceOpen == null ? overlay.hidden : !!forceOpen;
  overlay.hidden = !shouldOpen;
  if (shouldOpen) {
    lastFocusedBeforeShortcutHelp = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    elements.shortcutHelpCloseButton?.focus();
    setStatus('단축키 치트시트를 열었습니다.');
  } else if (lastFocusedBeforeShortcutHelp && typeof lastFocusedBeforeShortcutHelp.focus === 'function') {
    lastFocusedBeforeShortcutHelp.focus();
  }
  return shouldOpen;
}

function getDownloadModalFocusable() {
  if (!elements.downloadModal) return [];
  return Array.from(elements.downloadModal.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'))
    .filter((node) => node instanceof HTMLElement && !node.disabled && !node.hidden && node.tabIndex >= 0);
}

function toggleDownloadModal(forceOpen = null) {
  const overlay = elements.downloadModal;
  if (!overlay) return false;
  const shouldOpen = forceOpen == null ? overlay.hidden : !!forceOpen;
  overlay.hidden = !shouldOpen;
  if (shouldOpen) {
    lastFocusedBeforeDownloadModal = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    elements.downloadChoiceSelect?.focus();
    setStatus('저장/출력 모달을 열었습니다.');
  } else if (lastFocusedBeforeDownloadModal && typeof lastFocusedBeforeDownloadModal.focus === 'function') {
    lastFocusedBeforeDownloadModal.focus();
  }
  return shouldOpen;
}

function handleDownloadModalFocusTrap(event) {
  if (!elements.downloadModal || elements.downloadModal.hidden || event.key !== 'Tab') return;
  const focusable = getDownloadModalFocusable();
  if (focusable.length < 1) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function applyShortcutTooltips() {
  for (const [selector, label] of Object.entries(SHORTCUT_TOOLTIP_MAP)) {
    for (const node of Array.from(document.querySelectorAll(selector))) {
      node.title = label;
      const originalAria = node.getAttribute('aria-label') || node.textContent?.trim() || '';
      if (!originalAria.includes('(')) node.setAttribute('aria-label', `${originalAria} ${label.match(/\(.+\)/)?.[0] || ''}`.trim());
    }
  }
}

function renderShortcutHelpList() {
  if (!elements.shortcutHelpList) return;
  elements.shortcutHelpList.innerHTML = '';
  for (const item of COMMAND_REGISTRY) {
    if (!item.shortcut || item.shortcut === '-') continue;
    const li = document.createElement('li');
    const kbd = document.createElement('kbd');
    kbd.textContent = item.shortcut;
    const label = document.createElement('span');
    label.textContent = item.label;
    li.append(kbd, label);
    elements.shortcutHelpList.append(li);
  }
}

function getCommandPaletteFocusable() {
  if (!elements.commandPaletteOverlay) return [];
  return Array.from(elements.commandPaletteOverlay.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'))
    .filter((node) => node instanceof HTMLElement && !node.disabled && !node.hidden && node.tabIndex >= 0);
}

function handleCommandPaletteFocusTrap(event) {
  if (!elements.commandPaletteOverlay || elements.commandPaletteOverlay.hidden || event.key !== 'Tab') return;
  const focusable = getCommandPaletteFocusable();
  if (focusable.length < 1) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function performCommandAction(commandId) {
  const command = COMMAND_REGISTRY.find((item) => item.id === commandId);
  if (!command) return { ok: false, message: '명령을 찾지 못했습니다.' };
  const result = command.run?.() || { ok: false, message: '명령 실행기를 찾지 못했습니다.' };
  if (result?.message) setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  return result;
}

function filterCommandPalette(query) {
  const normalized = String(query || '').trim().toLowerCase();
  if (!normalized) return [...COMMAND_REGISTRY];
  return COMMAND_REGISTRY.filter((item) => {
    const target = [item.label, item.shortcut, ...(item.keywords || [])].join(' ').toLowerCase();
    return target.includes(normalized);
  });
}

function renderCommandPaletteResults() {
  if (!elements.commandPaletteList) return;
  elements.commandPaletteList.innerHTML = '';
  if (!commandPaletteResults.length) {
    const li = document.createElement('li');
    li.className = 'command-palette__item';
    li.textContent = '검색 결과가 없습니다.';
    elements.commandPaletteList.append(li);
    return;
  }
  commandPaletteActiveIndex = Math.max(0, Math.min(commandPaletteActiveIndex, commandPaletteResults.length - 1));
  commandPaletteResults.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `command-palette__item${index === commandPaletteActiveIndex ? ' is-active' : ''}`;
    li.setAttribute('role', 'option');
    li.setAttribute('aria-selected', index === commandPaletteActiveIndex ? 'true' : 'false');
    li.dataset.commandId = item.id;
    li.innerHTML = `<strong>${item.label}</strong><span class="topbar__sub">${item.shortcut || '-'}</span>`;
    li.addEventListener('click', () => {
      commandPaletteActiveIndex = index;
      runActiveCommandPaletteItem();
    });
    elements.commandPaletteList.append(li);
  });
}

function runActiveCommandPaletteItem() {
  const selected = commandPaletteResults[commandPaletteActiveIndex];
  if (!selected) return;
  const result = performCommandAction(selected.id);
  if (result?.ok) toggleCommandPalette(false);
}

function updateCommandPaletteResults() {
  commandPaletteResults = filterCommandPalette(elements.commandPaletteInput?.value || '');
  commandPaletteActiveIndex = 0;
  renderCommandPaletteResults();
}

function toggleCommandPalette(forceOpen = null) {
  const overlay = elements.commandPaletteOverlay;
  if (!overlay) return false;
  const shouldOpen = forceOpen == null ? overlay.hidden : !!forceOpen;
  overlay.hidden = !shouldOpen;
  if (shouldOpen) {
    lastFocusedBeforeCommandPalette = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (elements.commandPaletteInput) {
      elements.commandPaletteInput.value = '';
      updateCommandPaletteResults();
      elements.commandPaletteInput.focus();
    }
    setStatus('명령 팔레트를 열었습니다. 검색 후 Enter를 누르세요.');
  } else if (lastFocusedBeforeCommandPalette && typeof lastFocusedBeforeCommandPalette.focus === 'function') {
    lastFocusedBeforeCommandPalette.focus();
  }
  return shouldOpen;
}

function evaluateLocalBootEnvironment() {
  const checks = [];
  const add = (level, code, message) => checks.push({ level, code, message });
  const protocol = window.location?.protocol || '';

  if (protocol !== 'file:') {
    add('warning', 'NOT_FILE_PROTOCOL', `현재 실행 경로가 ${protocol || '(알 수 없음)'} 입니다. 필수 기준은 file:// 직접 실행입니다.`);
  }
  if (BOOT_LOCAL_POLICY.requiresStartupFetch) {
    add('error', 'POLICY_BOOT_FETCH', '초기 부팅 경로가 fetch/network를 필수로 요구하도록 설정되어 있습니다.');
  }
  if (BOOT_LOCAL_POLICY.requiresFileSystemAccessApi) {
    add('error', 'POLICY_FS_ACCESS_REQUIRED', 'File System Access API를 필수 경로로 요구하도록 설정되어 있습니다.');
  }
  if (BOOT_LOCAL_POLICY.requiresServerEndpoint) {
    add('error', 'POLICY_SERVER_REQUIRED', '서버/도메인 의존 경로가 필수로 설정되어 있습니다.');
  }
  if (typeof window.FileReader !== 'function') {
    add('error', 'MISSING_FILE_READER', '이 브라우저는 FileReader를 지원하지 않아 로컬 파일 import가 동작하지 않습니다.');
  }
  if (typeof URL?.createObjectURL !== 'function') {
    add('error', 'MISSING_BLOB_URL', '이 브라우저는 Blob URL 미리보기를 지원하지 않습니다.');
  }
  if (typeof window.DOMParser !== 'function') {
    add('error', 'MISSING_DOM_PARSER', '이 브라우저는 DOMParser를 지원하지 않아 HTML 파싱 기능이 제한됩니다.');
  }
  if (!('localStorage' in window)) {
    add('warning', 'NO_LOCAL_STORAGE', 'localStorage를 사용할 수 없어 autosave 복구 기능이 제한될 수 있습니다.');
  }

  return {
    generatedAt: new Date().toISOString(),
    checks,
    errorCount: checks.filter((item) => item.level === 'error').length,
    warningCount: checks.filter((item) => item.level === 'warning').length,
  };
}

function populateFixtureSelect() {
  elements.fixtureSelect.innerHTML = FIXTURE_MANIFEST.fixtures
    .map((fixture) => `<option value="${fixture.id}">${fixture.id} · ${fixture.name}</option>`)
    .join('');
  elements.fixtureSelect.value = 'F05';
}

function populateExportPresetSelect() {
  elements.exportPresetSelect.innerHTML = EXPORT_PRESETS
    .map((preset) => `<option value="${preset.id}">${preset.label}</option>`)
    .join('');
  elements.exportPresetSelect.value = currentExportPresetId;
}

function currentExportPreset() {
  return getExportPresetById(currentExportPresetId);
}

function normalizeSaveFormat(value) {
  return value === 'embedded' ? 'embedded' : 'linked';
}

function formatByteSize(bytes) {
  const safeBytes = Number(bytes);
  if (!Number.isFinite(safeBytes) || safeBytes <= 0) return '0 B';
  if (safeBytes < 1024) return `${Math.round(safeBytes)} B`;
  if (safeBytes < 1024 * 1024) return `${(safeBytes / 1024).toFixed(1)} KB`;
  return `${(safeBytes / (1024 * 1024)).toFixed(2)} MB`;
}

function nextActionHint(kind) {
  return EXPORT_NEXT_ACTION_HINTS[kind] || '다음: 결과물을 열어 품질과 경로를 확인해 주세요.';
}

function notifySavedWithGuide(kind, fileName, detail = '') {
  const detailText = detail ? ` (${detail})` : '';
  setStatus(`저장 완료: ${fileName}${detailText} · ${nextActionHint(kind)}`);
}

function estimateSavePreview(project, format) {
  const sourceHtml = String(activeEditor?.getEditedHtml?.({ persistDetectedSlots: true }) || project?.normalizedHtml || '');
  const htmlBytes = new TextEncoder().encode(sourceHtml).length;
  const resolvedAssets = Number(project?.summary?.assetsResolved || 0);
  const unresolvedAssets = Number(project?.summary?.assetsUnresolved || 0);
  if (format === 'embedded') {
    return {
      fileCountLabel: '1개 (HTML 단일 파일)',
      sizeLabel: `예상 용량: ${formatByteSize(Math.round(htmlBytes * 1.3))} 내외`,
      pathPolicy: '경로 유지: 아니요 (이미지 data URL 내장)',
    };
  }
  return {
    fileCountLabel: `${1 + resolvedAssets}개 내외 (HTML 1 + 자산 ${resolvedAssets})`,
    sizeLabel: `예상 용량: ${formatByteSize(htmlBytes)} + 이미지 원본 합계`,
    pathPolicy: unresolvedAssets > 0 ? `경로 유지: 예 (단, 미해결 ${unresolvedAssets}개 경고 가능)` : '경로 유지: 예',
  };
}

function buildSaveMetaSummary() {
  if (!lastSaveConversion) return `리포트 save 메타: selectedFormat=${currentSaveFormat}, lastConversion=아직 없음`;
  const convertedCount = Number(lastSaveConversion.convertedDataUrlCount || 0);
  const generatedCount = Number(lastSaveConversion.generatedAssetCount || 0);
  const warningCount = Number(lastSaveConversion.brokenLinkedPathWarnings?.length || 0);
  const savedAt = lastSaveConversion.savedAt ? new Date(lastSaveConversion.savedAt).toLocaleString() : '시간 없음';
  return `리포트 save 메타: selectedFormat=${currentSaveFormat}, lastConversion=${lastSaveConversion.format || '-'} · dataURL→file ${convertedCount} · 생성자산 ${generatedCount} · 경고 ${warningCount} · ${savedAt}`;
}

function syncSaveFormatUi() {
  currentSaveFormat = normalizeSaveFormat(elements.saveFormatSelect?.value || currentSaveFormat);
  if (elements.saveFormatSelect && elements.saveFormatSelect.value !== currentSaveFormat) {
    elements.saveFormatSelect.value = currentSaveFormat;
  }
  if (elements.saveFormatStatus) {
    const modeLabel = currentSaveFormat === 'embedded' ? 'embedded (data URL 내장)' : 'linked (경로 유지)';
    elements.saveFormatStatus.textContent = `현재 저장 포맷: ${modeLabel}`;
  }
  if (elements.saveFormatGuide) {
    const purposeGuide = currentSaveFormat === 'embedded'
      ? '추천 안내: 1파일 전달/메신저 공유는 embedded가 편합니다.'
      : '추천 안내: 내 PC에서 재편집(이미지 교체 포함)할 땐 linked가 안전합니다.';
    elements.saveFormatGuide.textContent = purposeGuide;
  }
  if (elements.saveFormatPreview) {
    const preview = estimateSavePreview(store.getState().project, currentSaveFormat);
    elements.saveFormatPreview.textContent = `저장 결과 미리보기 → 파일 수: ${preview.fileCountLabel} · ${preview.sizeLabel} · ${preview.pathPolicy}`;
  }
  if (elements.saveMetaSummary) {
    elements.saveMetaSummary.textContent = buildSaveMetaSummary();
  }
}

function markAdvancedSettingsDirty(isDirty) {
  advancedSettingsDirty = !!isDirty;
  if (!elements.advancedSettingsState) return;
  elements.advancedSettingsState.textContent = advancedSettingsDirty ? '고급값 변경됨 · 적용 필요' : '고급값 대기 없음';
}

function getFirstControlValue(controlList, fallbackValue) {
  const controls = Array.isArray(controlList) ? controlList : [];
  const firstControl = controls.find((control) => control);
  if (!firstControl) return fallbackValue;
  return firstControl.value;
}

function syncMirroredControls(controlList, nextValue, sourceControl = null) {
  const controls = Array.isArray(controlList) ? controlList : [];
  for (const control of controls) {
    if (!control || control === sourceControl) continue;
    if (control.value !== nextValue) control.value = nextValue;
  }
}

function syncAdvancedFormFromState() {
  if (elements.geometryCoordModeSelect) elements.geometryCoordModeSelect.value = advancedSettings.geometryCoordMode;
  for (const control of elements.exportScaleSelectControls) {
    if (control) control.value = String(advancedSettings.exportScale);
  }
  for (const control of elements.exportJpgQualityInputs) {
    if (control) control.value = String(advancedSettings.exportJpgQuality);
  }
  if (elements.selectionExportPaddingInput) elements.selectionExportPaddingInput.value = String(advancedSettings.selectionExportPadding);
  if (elements.selectionExportBackgroundSelect) elements.selectionExportBackgroundSelect.value = advancedSettings.selectionExportBackground;
  markAdvancedSettingsDirty(false);
}

function applyAdvancedSettingsFromForm() {
  const nextCoordMode = elements.geometryCoordModeSelect?.value === 'absolute' ? 'absolute' : 'relative';
  const nextScaleRaw = Number.parseFloat(getFirstControlValue(elements.exportScaleSelectControls, '1'));
  const nextScale = nextScaleRaw >= 2.5 ? 3 : (nextScaleRaw >= 1.5 ? 2 : 1);
  const nextJpgRaw = Number.parseFloat(getFirstControlValue(elements.exportJpgQualityInputs, String(DEFAULT_JPG_QUALITY)));
  const nextJpgQuality = Number.isFinite(nextJpgRaw) ? Math.min(1, Math.max(0.1, nextJpgRaw)) : DEFAULT_JPG_QUALITY;
  const nextPaddingRaw = Number.parseFloat(elements.selectionExportPaddingInput?.value || '16');
  const nextPadding = Number.isFinite(nextPaddingRaw) ? Math.max(0, Math.min(240, Math.round(nextPaddingRaw))) : 16;
  const nextBackground = elements.selectionExportBackgroundSelect?.value === 'opaque' ? 'opaque' : 'transparent';

  advancedSettings.geometryCoordMode = nextCoordMode;
  advancedSettings.exportScale = nextScale;
  advancedSettings.exportJpgQuality = nextJpgQuality;
  advancedSettings.selectionExportPadding = nextPadding;
  advancedSettings.selectionExportBackground = nextBackground;
  geometryCoordMode = nextCoordMode;
  syncGeometryControls();
  syncAdvancedFormFromState();
  return {
    ok: true,
    message: `고급값 적용 완료 (좌표 ${nextCoordMode}, 배율 ${nextScale}x, JPG ${nextJpgQuality.toFixed(2)})`,
  };
}

function applyAdvancedSettingsIfDirty() {
  if (!advancedSettingsDirty) return false;
  applyAdvancedSettingsFromForm();
  return true;
}

function readPanelLayoutState() {
  try {
    const raw = window.localStorage.getItem(PANEL_LAYOUT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      basicOpen: parsed.basicOpen !== false,
      advancedOpen: parsed.advancedOpen === true,
    };
  } catch {
    return null;
  }
}

function persistPanelLayoutState() {
  try {
    window.localStorage.setItem(PANEL_LAYOUT_STORAGE_KEY, JSON.stringify({
      basicOpen: !!elements.basicAttributeSection?.open,
      advancedOpen: !!elements.advancedAttributeSection?.open,
    }));
  } catch {}
}

function restorePanelLayoutState() {
  const saved = readPanelLayoutState();
  if (!saved) return;
  if (elements.basicAttributeSection) elements.basicAttributeSection.open = saved.basicOpen;
  if (elements.advancedAttributeSection) elements.advancedAttributeSection.open = saved.advancedOpen;
}

function resolveSidebarTab(panelId) {
  const requested = String(panelId || '');
  const scope = requested.startsWith('left-')
    ? 'left'
    : (requested.startsWith('right-') ? 'right' : '');
  if (!scope) return '';
  const scopedButtons = elements.sidebarTabButtons.filter((button) => String(button.dataset.sidebarTab || '').startsWith(`${scope}-`));
  const scopedPanels = elements.sidebarPanels.filter((panel) => String(panel.dataset.sidebarPanel || '').startsWith(`${scope}-`));
  const hasRequestedButton = scopedButtons.some((button) => button.dataset.sidebarTab === requested);
  const hasRequestedPanel = scopedPanels.some((panel) => panel.dataset.sidebarPanel === requested);
  if (hasRequestedButton && hasRequestedPanel) return requested;
  const fallback = scopedButtons.find((button) => scopedPanels.some((panel) => panel.dataset.sidebarPanel === button.dataset.sidebarTab));
  return fallback?.dataset.sidebarTab || '';
}

function setSidebarTab(panelId, { syncWorkflow = true } = {}) {
  const targetPanelId = resolveSidebarTab(panelId);
  const scope = String(targetPanelId || '').startsWith('left-')
    ? 'left'
    : (String(targetPanelId || '').startsWith('right-') ? 'right' : '');
  if (!scope) return;
  for (const button of elements.sidebarTabButtons) {
    const buttonScope = String(button.dataset.sidebarTab || '').startsWith('left-')
      ? 'left'
      : (String(button.dataset.sidebarTab || '').startsWith('right-') ? 'right' : '');
    if (buttonScope !== scope) continue;
    button.classList.toggle('is-active', button.dataset.sidebarTab === targetPanelId);
  }
  for (const panel of elements.sidebarPanels) {
    const panelScope = String(panel.dataset.sidebarPanel || '').startsWith('left-')
      ? 'left'
      : (String(panel.dataset.sidebarPanel || '').startsWith('right-') ? 'right' : '');
    if (panelScope !== scope) continue;
    panel.classList.toggle('is-active', panel.dataset.sidebarPanel === targetPanelId);
  }
  if (scope === 'left' && syncWorkflow) syncWorkflowGuideStepByLeftTab(targetPanelId);
}

function getSlotRuntimeMeta(slotUid) {
  const doc = elements.previewFrame?.contentDocument;
  const slot = doc?.querySelector?.(`[data-node-uid="${slotUid}"]`);
  if (!slot) return { lastAppliedFileName: '', hasMedia: false };
  const img = slot.querySelector('img');
  const src = String(img?.getAttribute('src') || '').trim();
  const backgroundImage = String(slot.style?.backgroundImage || '').trim();
  const hasMedia = Boolean(
    (src && !src.startsWith('data:image/svg+xml') && !/placeholder/i.test(src))
    || (backgroundImage && backgroundImage !== 'none'),
  );
  return {
    lastAppliedFileName: String(slot.dataset.lastAppliedFileName || ''),
    hasMedia,
  };
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderUploadBucket(container, items, selectedUidSet = new Set(), emptyMessage = '항목이 없습니다.') {
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<div class="upload-slot-empty">${emptyMessage}</div>`;
    return;
  }
  container.innerHTML = items.map((item) => `
    <button class="upload-slot-item ${selectedUidSet.has(item.uid) ? 'is-active' : ''}" data-upload-slot-uid="${escapeHtml(item.uid)}">
      <div class="upload-slot-item__title">${escapeHtml(item.label || item.uid)}</div>
      <div class="upload-slot-item__meta">${escapeHtml(item.meta || '슬롯')}</div>
    </button>
  `).join('');
}

function renderUploadLists(state) {
  const editorMeta = state?.editorMeta || {};
  const slots = Array.isArray(editorMeta.slots) ? editorMeta.slots : [];
  const selectedUidSet = new Set((editorMeta.selectedItems || []).map((item) => item.uid));
  const emptySlotUidSet = new Set((editorMeta.preflight?.emptySlots || []).map((slot) => slot.uid));
  const brokenSlotUidSet = new Set((state?.project?.assets || [])
    .filter((asset) => asset.status === 'unresolved' && asset.ownerUid)
    .map((asset) => asset.ownerUid));

  const recent = [];
  const documentUse = [];
  const unassigned = [];
  const broken = [];

  for (const slot of slots) {
    const runtime = getSlotRuntimeMeta(slot.uid);
    const baseItem = {
      uid: slot.uid,
      label: slot.label || slot.uid,
      meta: runtime.lastAppliedFileName || `score ${slot.score ?? '-'}`,
    };
    if (runtime.lastAppliedFileName) recent.push(baseItem);
    if (runtime.hasMedia && !runtime.lastAppliedFileName) documentUse.push(baseItem);
    if (emptySlotUidSet.has(slot.uid)) unassigned.push({ ...baseItem, meta: '빈 슬롯' });
    if (brokenSlotUidSet.has(slot.uid)) broken.push({ ...baseItem, meta: '미해결 자산 연결' });
  }

  renderUploadBucket(elements.uploadRecentList, recent, selectedUidSet, '최근 업로드가 없습니다.');
  renderUploadBucket(elements.uploadDocumentList, documentUse, selectedUidSet, '문서 기본 이미지만 사용 중입니다.');
  renderUploadBucket(elements.uploadUnassignedList, unassigned, selectedUidSet, '미할당 슬롯이 없습니다.');
  renderUploadBucket(elements.uploadBrokenList, broken, selectedUidSet, '깨진 자산 슬롯이 없습니다.');
}

function renderProjectSnapshotList(state) {
  if (!elements.snapshotList) return;
  const entries = getSnapshotEntriesForProject(state?.project || null);
  if (!entries.length) {
    elements.snapshotList.innerHTML = '<div class="upload-slot-empty">저장된 스냅샷이 없습니다.</div>';
    return;
  }
  elements.snapshotList.innerHTML = entries.map((entry) => {
    const createdText = entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '-';
    const previewText = escapeHtml(entry.thumbnail?.text || '미리보기 없음');
    const imageSrc = String(entry.thumbnail?.imageSrc || '').trim();
    const thumb = imageSrc
      ? `<img src="${escapeHtml(imageSrc)}" alt="스냅샷 썸네일" loading="lazy" />`
      : `<span>${previewText}</span>`;
    return `
      <article class="snapshot-item" data-snapshot-id="${escapeHtml(entry.id)}">
        <div class="snapshot-item__top">
          <strong class="snapshot-item__title">${escapeHtml(entry.title || '이름 없음')}</strong>
          <span class="snapshot-item__time">${escapeHtml(createdText)}</span>
        </div>
        <div class="snapshot-item__thumb">${thumb}</div>
        <p class="snapshot-item__desc">${escapeHtml(entry.note || previewText)}</p>
        <div class="snapshot-item__actions">
          <button class="button button--small button--secondary" type="button" data-snapshot-action="restore">복원</button>
          <button class="button button--small button--ghost" type="button" data-snapshot-action="delete">삭제</button>
        </div>
      </article>
    `;
  }).join('');
}

function setCodeSource(nextSource, { preserveDraft = true } = {}) {
  currentCodeSource = nextSource || 'edited';
  for (const button of elements.codeSourceButtons) {
    button.classList.toggle('is-active', button.dataset.codeSource === currentCodeSource);
  }
  if (!preserveDraft) codeEditorDirty = false;
  refreshCodeEditorFromState({ force: !preserveDraft });
}

function currentProjectHtmlText(state) {
  const project = state?.project || null;
  if (!project) return '';
  if (currentCodeSource === 'normalized') return project.normalizedHtml || '';
  if (currentCodeSource === 'original') return project.originalHtml || '';
  if (currentCodeSource === 'report') return JSON.stringify(buildReportPayload(project, getEditorReport(project)), null, 2);
  return elements.editedCodeView?.textContent || '';
}

function refreshCodeEditorFromState({ force = false } = {}) {
  if (!elements.codeEditorTextarea) return;
  const textarea = elements.codeEditorTextarea;
  if (codeEditorDirty && !force && document.activeElement === textarea) return;
  const nextValue = currentProjectHtmlText(store.getState());
  textarea.value = nextValue;
  textarea.readOnly = currentCodeSource === 'report';
  codeEditorDirty = false;
}

function getCanvasIntrinsicWidth() {
  const doc = elements.previewFrame?.contentDocument;
  return Math.max(860, doc?.documentElement?.scrollWidth || 0, doc?.body?.scrollWidth || 0);
}

function applyPreviewZoom() {
  const viewport = elements.previewViewport;
  const scaler = elements.previewScaler;
  if (!viewport || !scaler) return;
  const intrinsic = getCanvasIntrinsicWidth();
  scaler.style.width = `${intrinsic}px`;
  const fitScale = Math.max(0.35, Math.min(2.25, (viewport.clientWidth - 32) / intrinsic));
  const scale = zoomState.mode === 'fit' ? fitScale : zoomState.value;
  scaler.style.setProperty('--preview-scale', String(scale));
  if (elements.zoomLabel) elements.zoomLabel.textContent = `${Math.round(scale * 100)}%`;
  if (elements.zoomFitButton) elements.zoomFitButton.classList.toggle('is-active', zoomState.mode === 'fit');
}

function setZoom(mode, value = null) {
  if (mode === 'fit') {
    zoomState.mode = 'fit';
  } else {
    zoomState.mode = 'manual';
    const next = Number.isFinite(value) ? value : zoomState.value;
    zoomState.value = Math.max(0.35, Math.min(2.25, next));
  }
  applyPreviewZoom();
}

function nudgeZoom(delta) {
  const current = zoomState.mode === 'fit' ? Number.parseFloat((elements.zoomLabel?.textContent || '100').replace('%', '')) / 100 : zoomState.value;
  setZoom('manual', current + delta);
}

function syncWorkspaceButtons() {
  document.body.classList.toggle('layout--left-collapsed', document.body.classList.contains('layout--left-collapsed'));
  document.body.classList.toggle('layout--right-collapsed', document.body.classList.contains('layout--right-collapsed'));
  if (elements.toggleLeftSidebarButton) elements.toggleLeftSidebarButton.classList.toggle('is-active', !document.body.classList.contains('layout--left-collapsed'));
  if (elements.toggleRightSidebarButton) elements.toggleRightSidebarButton.classList.toggle('is-active', !document.body.classList.contains('layout--right-collapsed'));
  if (elements.focusModeButton) elements.focusModeButton.classList.toggle('is-active', document.body.classList.contains('layout--focus-stage'));
}

function syncExportPresetUi({ forceScale = false } = {}) {
  const preset = currentExportPreset();
  if (elements.exportPresetSelect.value !== preset.id) elements.exportPresetSelect.value = preset.id;
  const shouldSyncScale = forceScale;
  const presetScale = Number.parseFloat(String(preset.scale));
  const normalizedScale = presetScale >= 2.5 ? '3' : presetScale >= 1.5 ? '2' : '1';
  if (shouldSyncScale && EXPORT_SCALE_OPTIONS.includes(Number.parseFloat(normalizedScale))) {
    syncMirroredControls(elements.exportScaleSelectControls, normalizedScale);
    markAdvancedSettingsDirty(true);
  }
  if (elements.exportPresetSelect) elements.exportPresetSelect.title = preset.description || '';
  for (const button of elements.downloadPresetButtons) {
    button?.classList.toggle('is-active', (button?.dataset?.downloadPreset || '') === preset.id);
  }
}

function setSelectionMode(nextMode) {
  store.setSelectionMode(nextMode);
  activeEditor?.setSelectionMode(nextMode);
}

function syncViewFeatureButtons() {
  const mapping = [
    ['snap', elements.viewSnapToggleButton, '스냅'],
    ['guide', elements.viewGuideToggleButton, '가이드'],
    ['ruler', elements.viewRulerToggleButton, '눈금자'],
  ];
  for (const [key, button, label] of mapping) {
    if (!button) continue;
    const isOn = !!viewFeatureFlags[key];
    button.classList.toggle('is-active', isOn);
    button.setAttribute('aria-pressed', isOn ? 'true' : 'false');
    button.textContent = `${label}: ${isOn ? 'ON' : 'OFF'}`;
  }
}

function toggleViewFeatureFlag(key, label) {
  if (!(key in viewFeatureFlags)) return;
  viewFeatureFlags[key] = !viewFeatureFlags[key];
  syncViewFeatureButtons();
  setStatus(`${label} 표시를 ${viewFeatureFlags[key] ? '켰습니다' : '껐습니다'} (기능 플래그 유지)`);
}

function renderSelectionModeButtons(currentMode) {
  for (const button of elements.selectionModeButtons) {
    button.classList.toggle('is-active', button.dataset.selectionMode === currentMode);
  }
}

function renderTextAlignButtons(currentAlign, enabled) {
  for (const button of elements.textAlignButtons) {
    button.classList.toggle('is-active', enabled && button.dataset.textAlign === currentAlign);
    button.disabled = !enabled;
  }
}

function readAutosavePayload() {
  try {
    const raw = localStorage.getItem(AUTOSAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function persistAutosave(snapshot) {
  const project = store.getState().project;
  if (!project || !snapshot) return;
  const payload = {
    savedAt: new Date().toISOString(),
    sourceName: project.sourceName,
    sourceType: project.sourceType,
    fixtureId: project.fixtureId || '',
    snapshot,
  };
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(payload));
  } catch {}
}

function resolveSnapshotProjectKey(project) {
  if (!project) return '';
  return [project.fixtureId || '', project.sourceType || '', project.sourceName || ''].join('::');
}

function readProjectSnapshotPayload() {
  try {
    const raw = localStorage.getItem(PROJECT_SNAPSHOT_KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed?.entries)) return { entries: [] };
    return { entries: parsed.entries.filter((entry) => entry?.snapshot?.html) };
  } catch {
    return { entries: [] };
  }
}

function writeProjectSnapshotPayload(payload) {
  try {
    localStorage.setItem(PROJECT_SNAPSHOT_KEY, JSON.stringify(payload));
  } catch {}
}

function buildSnapshotThumbnail(snapshotHtml = '') {
  try {
    const doc = new DOMParser().parseFromString(snapshotHtml, 'text/html');
    const img = doc.querySelector('img[src]');
    const text = (doc.body?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    return {
      imageSrc: String(img?.getAttribute('src') || '').trim(),
      text: text || '텍스트 미리보기가 없습니다.',
    };
  } catch {
    return { imageSrc: '', text: '미리보기를 읽을 수 없습니다.' };
  }
}

function getSnapshotEntriesForProject(project) {
  const key = resolveSnapshotProjectKey(project);
  if (!key) return [];
  return readProjectSnapshotPayload().entries.filter((entry) => entry.projectKey === key);
}

function createProjectSnapshot({
  title = '',
  note = '',
  auto = false,
  statusMessage = '스냅샷을 저장했습니다.',
} = {}) {
  const project = store.getState().project;
  if (!project || !activeEditor) {
    setStatus('먼저 프로젝트를 불러와 주세요.');
    return null;
  }
  const snapshot = activeEditor.captureSnapshot(auto ? 'snapshot-auto' : 'snapshot-manual');
  if (!snapshot?.html) {
    setStatus('스냅샷 저장에 실패했습니다. 다시 시도해 주세요.');
    return null;
  }
  const now = new Date();
  const thumbnail = buildSnapshotThumbnail(snapshot.html);
  const entry = {
    id: `snap_${Math.random().toString(36).slice(2, 10)}`,
    projectKey: resolveSnapshotProjectKey(project),
    sourceName: project.sourceName || '',
    createdAt: now.toISOString(),
    title: (title || '').trim() || (auto ? `자동백업 ${now.toLocaleString()}` : `수동 스냅샷 ${now.toLocaleString()}`),
    note: (note || '').trim(),
    auto: !!auto,
    thumbnail,
    snapshot,
  };
  const payload = readProjectSnapshotPayload();
  payload.entries = [entry, ...payload.entries].slice(0, PROJECT_SNAPSHOT_LIMIT);
  writeProjectSnapshotPayload(payload);
  renderProjectSnapshotList(store.getState());
  setStatus(statusMessage);
  return entry;
}

function restoreProjectSnapshotById(snapshotId) {
  const state = store.getState();
  const project = state.project;
  if (!project) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const entry = getSnapshotEntriesForProject(project).find((item) => item.id === snapshotId);
  if (!entry?.snapshot?.html) return setStatus('복원할 스냅샷을 찾지 못했습니다.');
  createProjectSnapshot({
    auto: true,
    title: `복원 전 자동백업 (${entry.title || '스냅샷'})`,
    statusMessage: '복원 전 자동백업을 저장했습니다.',
  });
  mountProject(project, { snapshot: entry.snapshot, preserveHistory: false, force: true });
  setStatus(`스냅샷 "${entry.title || '이름 없음'}" 상태로 복원했습니다.`);
}

function deleteProjectSnapshotById(snapshotId) {
  const payload = readProjectSnapshotPayload();
  const nextEntries = payload.entries.filter((entry) => entry.id !== snapshotId);
  if (nextEntries.length === payload.entries.length) return;
  payload.entries = nextEntries;
  writeProjectSnapshotPayload(payload);
  renderProjectSnapshotList(store.getState());
  setStatus('스냅샷을 삭제했습니다.');
}

function refreshHistoryButtons() {
  const hasProject = !!store.getState().project;
  if (elements.undoButton) elements.undoButton.disabled = !hasProject || historyState.undoStack.length === 0;
  if (elements.redoButton) elements.redoButton.disabled = !hasProject || historyState.redoStack.length === 0;
  if (elements.restoreAutosaveButton) elements.restoreAutosaveButton.disabled = !readAutosavePayload();
  refreshLauncherRecentButton();
}

function resetHistory(baseSnapshot = null) {
  historyState.baseSnapshot = baseSnapshot?.html ? baseSnapshot : null;
  historyState.undoStack = [];
  historyState.redoStack = [];
  refreshHistoryButtons();
}

function latestHistorySnapshot() {
  return historyState.undoStack.at(-1)?.after || historyState.baseSnapshot;
}

function shouldMergeHistoryCommand(previous, next) {
  if (!previous || !next) return false;
  if (previous.label !== next.label) return false;
  if (!LIVE_HISTORY_LABELS.has(next.label)) return false;
  const prevAt = new Date(previous.at || 0).getTime();
  const nextAt = new Date(next.at || 0).getTime();
  if (!Number.isFinite(prevAt) || !Number.isFinite(nextAt)) return false;
  return Math.max(0, nextAt - prevAt) <= HISTORY_MERGE_WINDOW_MS;
}

function recordHistoryCommand(command, { clearRedo = true } = {}) {
  if (!command?.after?.html || !command?.before?.html) return;
  const last = historyState.undoStack.at(-1);
  if (shouldMergeHistoryCommand(last, command)) {
    last.after = command.after;
    last.at = command.at;
    persistAutosave(command.after);
    refreshHistoryButtons();
    return;
  }
  if (last?.after?.html === command.after.html) {
    persistAutosave(command.after);
    refreshHistoryButtons();
    return;
  }
  historyState.undoStack.push(command);
  if (historyState.undoStack.length > HISTORY_LIMIT) historyState.undoStack.shift();
  if (clearRedo) historyState.redoStack = [];
  persistAutosave(command.after);
  refreshHistoryButtons();
}

function restoreHistorySnapshot(snapshot, label) {
  const project = store.getState().project;
  if (!project || !snapshot) return;
  mountProject(project, { snapshot, preserveHistory: true, force: true });
  setStatus(label);
}

function undoHistory() {
  if (!historyState.undoStack.length) {
    setStatus('되돌릴 작업이 없습니다.');
    return;
  }
  const current = historyState.undoStack.pop();
  historyState.redoStack.push(current);
  refreshHistoryButtons();
  restoreHistorySnapshot(current.before, '이전 작업으로 되돌렸습니다.');
}

function redoHistory() {
  if (!historyState.redoStack.length) {
    setStatus('다시 적용할 작업이 없습니다.');
    return;
  }
  const next = historyState.redoStack.pop();
  historyState.undoStack.push(next);
  refreshHistoryButtons();
  restoreHistorySnapshot(next.after, '되돌린 작업을 다시 적용했습니다.');
}

function buildReportPayload(project, report) {
  return {
    project: {
      id: project.id,
      fixtureId: project.fixtureId,
      sourceName: project.sourceName,
      sourceType: project.sourceType,
    },
    report,
    history: {
      undoDepth: historyState.undoStack.length,
      redoDepth: historyState.redoStack.length,
      autosaveSavedAt: readAutosavePayload()?.savedAt || '',
    },
    summary: project.summary,
    issues: project.issues,
    assets: project.assets,
    preflight: report.preflight || null,
    save: {
      selectedFormat: currentSaveFormat,
      lastConversion: lastSaveConversion,
    },
  };
}

function getEditorReport(project) {
  if (activeEditor) return activeEditor.getReport();
  return {
    sourceName: project.sourceName,
    sourceType: project.sourceType,
    slotSummary: project.slotDetection?.summary || project.summary,
    slots: project.slotDetection?.candidates || [],
    sections: [],
    selectedSectionUid: '',
    nearMisses: project.slotDetection?.nearMisses || [],
    modifiedSlotCount: 0,
    layerTree: [],
    selectedItems: [],
    selectionCount: 0,
    generatedAt: new Date().toISOString(),
  };
}

function refreshComputedViews(state) {
  const project = state.project;
  if (elements.normalizedCodeView) elements.normalizedCodeView.textContent = project?.normalizedHtml || '';
  if (elements.originalCodeView) elements.originalCodeView.textContent = project?.originalHtml || '';

  if (!project) {
    if (elements.editedCodeView) elements.editedCodeView.textContent = '';
    if (elements.jsonReportView) elements.jsonReportView.textContent = '';
    refreshCodeEditorFromState({ force: true });
    return;
  }

  const editedHtml = activeEditor ? activeEditor.getEditedHtml({ persistDetectedSlots: true }) : project.normalizedHtml;
  if (elements.editedCodeView) elements.editedCodeView.textContent = editedHtml;
  const report = getEditorReport(project);
  if (elements.jsonReportView) elements.jsonReportView.textContent = JSON.stringify(buildReportPayload(project, report), null, 2);
  refreshCodeEditorFromState();
}

function syncTextStyleControls(editorMeta) {
  const style = editorMeta?.textStyle || null;
  const enabled = !!style?.enabled;
  const inputs = [
    elements.textFontSizeInput,
    elements.textLineHeightInput,
    elements.textLetterSpacingInput,
    elements.textWeightSelect,
    elements.textColorInput,
    elements.applyTextStyleButton,
    elements.clearTextStyleButton,
  ];
  for (const input of inputs) {
    if (!input) continue;
    input.disabled = !enabled;
  }
  renderTextAlignButtons(style?.textAlign || '', enabled);
  elements.textStyleSummary.textContent = enabled
    ? `텍스트 ${style.targetCount || 1}개 선택`
    : '텍스트 미선택';

  elements.textFontSizeInput.value = enabled && style.fontSize ? String(style.fontSize) : '';
  elements.textLineHeightInput.value = enabled && style.lineHeight ? String(style.lineHeight) : '';
  elements.textLetterSpacingInput.value = enabled && style.letterSpacing ? String(style.letterSpacing) : '';
  elements.textWeightSelect.value = enabled && style.fontWeight ? String(style.fontWeight) : '';
  elements.textColorInput.value = enabled && style.color ? style.color : '#333333';
}

function syncBatchSummary(editorMeta) {
  const count = Number(editorMeta?.selectionCount || 0);
  elements.batchSelectionSummary.textContent = count > 1 ? `${count}개 동시 선택` : '1개 이하 선택';
}

function resolvePrimarySelectionType(editorMeta) {
  const count = Number(editorMeta?.selectionCount || 0);
  if (count !== 1) return '';
  const selectedType = editorMeta?.selectedItems?.[0]?.type || editorMeta?.selected?.type || '';
  if (selectedType === 'slot') return 'image';
  if (selectedType === 'text') return 'text';
  if (selectedType === 'box') return 'box';
  return '';
}

function syncRightPanelBySelection(editorMeta) {
  const count = Number(editorMeta?.selectionCount || 0);
  const hasSelection = count > 0;
  if (elements.selectionEmptyState) elements.selectionEmptyState.hidden = hasSelection;
  if (!hasSelection) {
    if (elements.basicAttributeSection) elements.basicAttributeSection.open = false;
    if (elements.advancedAttributeSection) elements.advancedAttributeSection.open = false;
    return;
  }
  const type = resolvePrimarySelectionType(editorMeta);
  if (type === 'text') {
    setSidebarTab('right-text');
    if (elements.basicAttributeSection) elements.basicAttributeSection.open = false;
    if (elements.advancedAttributeSection) elements.advancedAttributeSection.open = false;
    return;
  }
  setSidebarTab('right-arrange');
  if (elements.basicAttributeSection) elements.basicAttributeSection.open = true;
  if (elements.advancedAttributeSection) {
    elements.advancedAttributeSection.open = type === 'image';
  }
}

function syncGeometryControls() {
  const geometry = activeEditor?.getSelectionGeometry?.() || null;
  const enabled = !!geometry;
  const controls = [
    elements.geometryCoordModeSelect,
    elements.geometryXInput,
    elements.geometryYInput,
    elements.geometryWInput,
    elements.geometryHInput,
    elements.applyGeometryButton,
    elements.bringForwardButton,
    elements.sendBackwardButton,
    elements.bringToFrontButton,
    elements.sendToBackButton,
    elements.imageNudgeLeftButton,
    elements.imageNudgeRightButton,
    elements.imageNudgeUpButton,
    elements.imageNudgeDownButton,
  ];
  for (const control of controls) {
    if (!control) continue;
    control.disabled = !enabled;
  }
  if (!enabled) {
    for (const input of [elements.geometryXInput, elements.geometryYInput, elements.geometryWInput, elements.geometryHInput]) {
      if (!input) continue;
      input.value = '';
      input.placeholder = '';
      input.dataset.mixed = '0';
    }
    if (elements.geometryRuleHint) elements.geometryRuleHint.textContent = '요소를 선택하면 좌표/크기를 표시합니다.';
    return;
  }
  const mode = geometryCoordMode === 'absolute' ? 'absolute' : 'relative';
  const group = geometry[mode] || geometry.relative;
  const mapping = [
    [elements.geometryXInput, 'x'],
    [elements.geometryYInput, 'y'],
    [elements.geometryWInput, 'w'],
    [elements.geometryHInput, 'h'],
  ];
  for (const [input, key] of mapping) {
    if (!input) continue;
    const mixed = !!group?.mixed?.[key];
    input.dataset.mixed = mixed ? '1' : '0';
    input.placeholder = mixed ? '혼합' : '';
    input.value = mixed ? '' : String(group?.[key] ?? '');
  }
  const modeText = mode === 'absolute'
    ? '절대 좌표: 문서의 왼쪽/위(0,0) 기준'
    : '상대 좌표: 각 요소의 transform 이동값 기준';
  if (elements.geometryRuleHint) {
    elements.geometryRuleHint.textContent = `${modeText} · Shift=10px, Alt=1px, 기본=2px`;
  }
}

function resolveCanvasContextScope(editorMeta) {
  const count = Number(editorMeta?.selectionCount || 0);
  if (count > 1) return 'multi';
  if (count < 1) return '';
  const selectedType = editorMeta?.selectedItems?.[0]?.type || editorMeta?.selected?.type || '';
  if (selectedType === 'slot') return 'image';
  if (selectedType === 'text') return 'text';
  return '';
}

function executeCanvasContextAction(action) {
  if (!activeEditor) return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
  if (action === 'duplicate' || action === 'delete') return executeEditorCommand(action);
  if (action === 'layer-index-forward') return executeEditorCommand('layer-index-forward');
  if (action === 'layer-index-backward') return executeEditorCommand('layer-index-backward');
  if (action === 'layer-index-front') return executeEditorCommand('layer-index-front');
  if (action === 'layer-index-back') return executeEditorCommand('layer-index-back');
  if (action === 'toggle-text-edit') return executeEditorCommand('toggle-text-edit');
  if (action === 'image-crop-enter') return executeEditorCommand('image-crop-enter');
  if (action === 'image-cover') return activeEditor.applyImagePreset('cover');
  if (action === 'image-contain') return activeEditor.applyImagePreset('contain');
  if (action === 'image-nudge-left') return activeEditor.nudgeSelectedImage({ dx: -2, dy: 0 });
  if (action === 'image-nudge-right') return activeEditor.nudgeSelectedImage({ dx: 2, dy: 0 });
  if (action === 'image-nudge-up') return activeEditor.nudgeSelectedImage({ dx: 0, dy: -2 });
  if (action === 'image-nudge-down') return activeEditor.nudgeSelectedImage({ dx: 0, dy: 2 });
  if ([
    'same-width',
    'same-height',
    'same-size',
    'align-left',
    'align-center',
    'align-right',
    'align-top',
    'align-middle',
    'align-bottom',
    'distribute-horizontal',
    'distribute-vertical',
  ].includes(action)) return activeEditor.applyBatchLayout(action);
  return { ok: false, message: `지원하지 않는 명령입니다: ${action}` };
}

function syncCanvasDirectUi(editorMeta) {
  const selectionCount = Number(editorMeta?.selectionCount || 0);
  const hasSelection = selectionCount > 0;
  if (elements.canvasContextBar) elements.canvasContextBar.hidden = !hasSelection;
  if (!hasSelection) return;

  const scope = resolveCanvasContextScope(editorMeta);
  for (const button of elements.canvasActionButtons) {
    const buttonScope = button.dataset.canvasScope || 'common';
    const visible = buttonScope === 'common' || (scope && buttonScope === scope);
    button.hidden = !visible;
    button.disabled = !visible || !activeEditor;
  }

  const geometryEnabled = !!activeEditor?.getSelectionGeometry?.();
  const mirrorPairs = [
    [elements.canvasGeometryXInput, elements.geometryXInput],
    [elements.canvasGeometryYInput, elements.geometryYInput],
    [elements.canvasGeometryWInput, elements.geometryWInput],
    [elements.canvasGeometryHInput, elements.geometryHInput],
  ];
  for (const [canvasInput, sourceInput] of mirrorPairs) {
    if (!canvasInput || !sourceInput) continue;
    canvasInput.value = sourceInput.value;
    canvasInput.placeholder = sourceInput.placeholder || '';
    canvasInput.dataset.mixed = sourceInput.dataset.mixed || '0';
    canvasInput.disabled = !geometryEnabled;
  }
  if (elements.applyCanvasGeometryButton) elements.applyCanvasGeometryButton.disabled = !geometryEnabled;
}

function applyGeometryFromInputs() {
  if (!activeEditor) return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
  const values = {
    x: Number.parseFloat(elements.geometryXInput.value),
    y: Number.parseFloat(elements.geometryYInput.value),
    w: Number.parseFloat(elements.geometryWInput.value),
    h: Number.parseFloat(elements.geometryHInput.value),
  };
  const patch = {};
  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value)) continue;
    patch[key] = value;
  }
  if (!Object.keys(patch).length) return { ok: false, message: '적용할 숫자 값을 입력해 주세요.' };
  return activeEditor.applyGeometryPatch(patch, { coordinateSpace: geometryCoordMode });
}

function renderShell(state) {
  renderSelectionModeButtons(state.selectionMode);
  renderSummaryCards(elements.summaryCards, state.project, state.editorMeta);
  renderIssueList(elements.issueList, state.project);
  if (elements.normalizeStats) {
    renderNormalizeStats(elements.normalizeStats, state.project);
  }
  renderPreflight(elements.preflightContainer, state.editorMeta);
  if (elements.selectionInspector) {
    renderSelectionInspector(elements.selectionInspector, state.editorMeta, state.imageApplyDiagnostic);
  }
  renderSectionFilmstrip(elements.sectionList, state.editorMeta);
  renderSlotList(elements.slotList, state.editorMeta);
  renderUploadLists(state);
  renderProjectSnapshotList(state);
  renderLayerTree(elements.layerTree, state.editorMeta, elements.layerFilterInput?.value || '');
  renderProjectMeta(elements.projectMeta, state.project, {
    selectionMode: state.selectionMode,
    undoDepth: historyState.undoStack.length,
    redoDepth: historyState.redoStack.length,
    autosaveSavedAt: readAutosavePayload()?.savedAt || '',
    textEditing: !!state.editorMeta?.textEditing,
    selectionCount: state.editorMeta?.selectionCount || 0,
    hiddenCount: state.editorMeta?.hiddenCount || 0,
    lockedCount: state.editorMeta?.lockedCount || 0,
    exportPresetLabel: currentExportPreset().label,
    preflightBlockingErrors: state.editorMeta?.preflight?.blockingErrors || 0,
  });
  if (elements.assetTableWrap) {
    renderAssetTable(elements.assetTableWrap, state.project, elements.assetFilterInput?.value || '');
  }
  syncTextStyleControls(state.editorMeta);
  syncBatchSummary(state.editorMeta);
  syncRightPanelBySelection(state.editorMeta);
  syncGeometryControls();
  syncCanvasDirectUi(state.editorMeta);
  const errorSuffix = state.lastError ? ` · 최근 오류: ${state.lastError}` : '';
  elements.statusText.textContent = `${state.statusText}${errorSuffix}`;
  if (elements.documentStatusChip) {
    const docStatus = resolveDocumentStatus(state);
    elements.documentStatusChip.dataset.status = docStatus.status;
    elements.documentStatusChip.textContent = docStatus.text;
  }
  refreshComputedViews(state);

  const hasProject = !!state.project;
  const hasEditor = !!activeEditor;
  elements.replaceImageButton.disabled = !hasEditor;
  elements.manualSlotButton.disabled = !hasEditor;
  elements.demoteSlotButton.disabled = !hasEditor;
  elements.redetectButton.disabled = !hasEditor;
  elements.toggleHideButton.disabled = !hasEditor || (state.editorMeta?.selectionCount || 0) < 1;
  elements.toggleLockButton.disabled = !hasEditor || (state.editorMeta?.selectionCount || 0) < 1;
  if (elements.arrangeToggleHideButton) elements.arrangeToggleHideButton.disabled = elements.toggleHideButton.disabled;
  if (elements.arrangeToggleLockButton) elements.arrangeToggleLockButton.disabled = elements.toggleLockButton.disabled;
  if (elements.textEditButton) elements.textEditButton.disabled = !hasEditor;
  elements.groupButton.disabled = !hasEditor || !state.editorMeta?.canGroupSelection;
  elements.ungroupButton.disabled = !hasEditor || !state.editorMeta?.canUngroupSelection;
  elements.preflightRefreshButton.disabled = !hasEditor;
  if (elements.saveProjectSnapshotButton) elements.saveProjectSnapshotButton.disabled = !hasEditor;
  if (elements.saveSnapshotFromPanelButton) elements.saveSnapshotFromPanelButton.disabled = !hasEditor;
  for (const button of elements.batchActionButtons) {
    const requiresMany = button.dataset.batchAction !== 'reset-transform';
    const needed = requiresMany ? 2 : 1;
    button.disabled = !hasEditor || (state.editorMeta?.selectionCount || 0) < needed;
  }
  const selectionCount = Number(state.editorMeta?.selectionCount || 0);
  if (elements.stackHorizontalButton) elements.stackHorizontalButton.disabled = !hasEditor || selectionCount < 2;
  if (elements.stackVerticalButton) elements.stackVerticalButton.disabled = !hasEditor || selectionCount < 2;
  if (elements.tidyHorizontalButton) elements.tidyHorizontalButton.disabled = !hasEditor || selectionCount < 3;
  if (elements.tidyVerticalButton) elements.tidyVerticalButton.disabled = !hasEditor || selectionCount < 3;
  for (const button of elements.downloadEditedButtons) {
    button.disabled = !hasProject;
  }
  elements.downloadNormalizedButton.disabled = !hasProject;
  elements.downloadLinkedZipButton.disabled = !hasEditor;
  for (const button of elements.exportPngButtons) {
    button.disabled = !hasEditor;
  }
  for (const button of elements.exportJpgButtons) {
    button.disabled = !hasEditor;
  }
  elements.exportSectionsZipButton.disabled = !hasEditor;
  elements.exportSelectionPngButton.disabled = !hasEditor || (state.editorMeta?.selectionCount || 0) < 1;
  elements.exportPresetPackageButton.disabled = !hasEditor;
  if (elements.sectionDuplicateButton) elements.sectionDuplicateButton.disabled = !hasEditor || !state.editorMeta?.selectedSectionUid;
  if (elements.sectionMoveUpButton) elements.sectionMoveUpButton.disabled = !hasEditor || !state.editorMeta?.selectedSectionUid;
  if (elements.sectionMoveDownButton) elements.sectionMoveDownButton.disabled = !hasEditor || !state.editorMeta?.selectedSectionUid;
  if (elements.sectionDeleteButton) elements.sectionDeleteButton.disabled = !hasEditor || !state.editorMeta?.selectedSectionUid;
  if (elements.sectionAddButton) elements.sectionAddButton.disabled = !hasEditor;
  if (elements.downloadReportButton) elements.downloadReportButton.disabled = !hasProject;
  if (elements.applyCodeToEditorButton) elements.applyCodeToEditorButton.disabled = !hasProject || currentCodeSource === 'report';
  if (elements.reloadCodeFromEditorButton) elements.reloadCodeFromEditorButton.disabled = !hasProject;
  if (elements.saveFormatSelect) elements.saveFormatSelect.disabled = !hasProject;
  if (elements.applyAdvancedSettingsButton) elements.applyAdvancedSettingsButton.disabled = !hasProject;
  syncExportPresetUi();
  syncSaveFormatUi();
  syncWorkspaceButtons();
  syncWorkflowGuide(state);
  applyPreviewZoom();
  refreshHistoryButtons();
}

function renderEmptyPreview() {
  elements.previewFrame.srcdoc = `
    <div class="empty-stage">
      <div>
        <strong>아직 프로젝트가 없습니다.</strong><br />
        HTML 파일, 프로젝트 폴더, 붙여넣기, fixture 중 하나를 불러와 주세요.
      </div>
    </div>`;
}

function applyNumberStep(input, direction) {
  if (!input || input.disabled) return;
  try {
    if (direction > 0) input.stepUp();
    else input.stepDown();
  } catch {
    const stepRaw = Number.parseFloat(input.step);
    const step = Number.isFinite(stepRaw) && stepRaw > 0 ? stepRaw : 1;
    const current = Number.parseFloat(input.value);
    const base = Number.isFinite(current) ? current : 0;
    input.value = String(base + (direction > 0 ? step : -step));
  }
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

function resolveNudgeStepFromEvent(event) {
  if (event?.shiftKey) return NUDGE_STEP_RULE.shift;
  if (event?.altKey) return NUDGE_STEP_RULE.alt;
  return NUDGE_STEP_RULE.base;
}

function applyKeyboardNudgeToNumberInput(event, input) {
  if (!input || input.disabled) return false;
  if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return false;
  const direction = event.key === 'ArrowUp' ? 1 : -1;
  const step = resolveNudgeStepFromEvent(event);
  const current = Number.parseFloat(input.value);
  const base = Number.isFinite(current) ? current : 0;
  input.value = String(base + (direction * step));
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
  event.preventDefault();
  return true;
}

function attachNumberStepper(input) {
  if (!input || input.dataset.stepperReady === '1') return;
  const wrapper = document.createElement('div');
  wrapper.className = 'number-stepper';
  input.parentNode?.insertBefore(wrapper, input);
  wrapper.appendChild(input);

  const buttonWrap = document.createElement('div');
  buttonWrap.className = 'number-stepper__buttons';
  const plusButton = document.createElement('button');
  plusButton.type = 'button';
  plusButton.className = 'number-stepper__btn';
  plusButton.textContent = '+';
  plusButton.title = '값 증가';
  const minusButton = document.createElement('button');
  minusButton.type = 'button';
  minusButton.className = 'number-stepper__btn';
  minusButton.textContent = '−';
  minusButton.title = '값 감소';

  plusButton.addEventListener('click', () => applyNumberStep(input, 1));
  minusButton.addEventListener('click', () => applyNumberStep(input, -1));
  buttonWrap.append(plusButton, minusButton);
  wrapper.append(buttonWrap);

  input.dataset.stepperReady = '1';
}

function initNumericSteppers() {
  const targets = [
    elements.textFontSizeInput,
    elements.textLineHeightInput,
    elements.textLetterSpacingInput,
    elements.geometryXInput,
    elements.geometryYInput,
    elements.geometryWInput,
    elements.geometryHInput,
    elements.canvasGeometryXInput,
    elements.canvasGeometryYInput,
    elements.canvasGeometryWInput,
    elements.canvasGeometryHInput,
  ];
  for (const input of targets) attachNumberStepper(input);
}

function handleEditorShortcut(action) {
  if (action === 'undo') return undoHistory();
  if (action === 'redo') return redoHistory();
  if (action === 'save-edited') return downloadEditedHtml().catch((error) => setStatus(`문서 저장 중 오류: ${error?.message || error}`));
  if (action === 'toggle-shortcut-help') return toggleShortcutHelp();
}

function executeEditorCommand(command, payload = {}, { refresh = true } = {}) {
  if (!activeEditor) {
    setStatus('먼저 미리보기를 로드해 주세요.');
    return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
  }
  const result = activeEditor.executeCommand ? activeEditor.executeCommand(command, payload) : { ok: false, message: `지원하지 않는 명령입니다: ${command}` };
  setStatus(result.message);
  if (refresh && (store.getState().currentView === 'edited' || store.getState().currentView === 'report')) refreshComputedViews(store.getState());
  return result;
}

function mountProject(project, { snapshot = null, preserveHistory = false, force = false } = {}) {
  if (activeEditor) {
    try { activeEditor.destroy(); } catch {}
    activeEditor = null;
  }

  if (force) mountedProjectId = '';
  mountedProjectId = project?.id || '';
  if (!project) {
    renderEmptyPreview();
    store.setEditorMeta(null);
    return;
  }

  elements.previewFrame.onload = () => {
    const liveProject = store.getState().project;
    if (!liveProject || liveProject.id !== project.id) return;
    activeEditor = createFrameEditor({
      iframe: elements.previewFrame,
      project,
      selectionMode: snapshot?.selectionMode || store.getState().selectionMode,
      initialSnapshot: snapshot,
      onStateChange: (meta) => store.setEditorMeta(meta),
      onStatus: setStatus,
      onMutation: (command) => {
        recordHistoryCommand(command);
        if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
      },
      onShortcut: handleEditorShortcut,
    });
    if (snapshot?.selectionMode) store.setSelectionMode(snapshot.selectionMode);
    store.setEditorMeta(activeEditor.getMeta());
    applyPreviewZoom();
    if (!preserveHistory) {
      resetHistory(activeEditor.captureSnapshot('initial'));
      persistAutosave(historyState.baseSnapshot);
      refreshHistoryButtons();
    } else {
      persistAutosave(latestHistorySnapshot() || activeEditor.captureSnapshot('restore'));
      refreshHistoryButtons();
    }
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  };
  elements.previewFrame.srcdoc = snapshot?.html || project.normalizedHtml;
}

function loadFixture(fixtureId) {
  try {
    const fixtureMeta = getFixtureMeta(fixtureId);
    const html = FIXTURE_SOURCE_MAP[fixtureId] || '';
    if (!fixtureMeta || !html) {
      setStatus(`Fixture ${fixtureId}를 찾지 못했습니다.`);
      return;
    }
    pendingMountOptions = { snapshot: null, preserveHistory: false };
    const project = normalizeProject({ html, sourceName: fixtureMeta.name, sourceType: 'fixture', fixtureMeta });
    store.setProject(project);
    setAppState(APP_STATES.editor);
    setStatus(`Fixture ${fixtureId}를 불러왔습니다. 슬롯 후보 ${project.summary.totalSlotCandidates}개, 자산 ${project.summary.assetsTotal}개입니다.`);
  } catch (error) {
    setStatusWithError('초기 로딩 중 오류가 발생했습니다. 브라우저 콘솔(F12)을 확인해 주세요.', error, { logTag: 'LOAD_FIXTURE_ERROR' });
  }
}

async function openHtmlFile(file) {
  if (!file) return;
  const requestId = importRequestSequence += 1;
  try {
    const html = await file.text();
    if (requestId !== importRequestSequence) return;
    const fileIndex = createImportFileIndex([file], 'html-file');
    pendingMountOptions = { snapshot: null, preserveHistory: false };
    const project = normalizeProject({ html, sourceName: file.name, sourceType: 'html-file', fileIndex, htmlEntryPath: file.name });
    if (requestId !== importRequestSequence) return;
    store.setProject(project);
    setAppState(APP_STATES.editor);
    setStatus(`HTML 파일 ${file.name}을 불러왔습니다. 미해결 자산 ${project.summary.assetsUnresolved}개입니다.`);
  } catch (error) {
    setStatusWithError(`HTML 파일 열기 중 오류가 발생했습니다. ${IMPORT_FAILURE_GUIDES.htmlOpen}`, error, { logTag: 'OPEN_HTML_FILE_ERROR' });
  }
}

async function handleFolderImport(files) {
  const requestId = importRequestSequence += 1;
  try {
    const fileIndex = createImportFileIndex(files, 'folder-import');
    const htmlEntry = choosePrimaryHtmlEntry(fileIndex);
    if (!htmlEntry) {
      setStatus(`선택한 폴더에 HTML 파일이 없습니다. ${IMPORT_FAILURE_GUIDES.folderNoHtml}`);
      return;
    }
    const html = await htmlEntry.file.text();
    if (requestId !== importRequestSequence) return;
    pendingMountOptions = { snapshot: null, preserveHistory: false };
    const project = normalizeProject({
      html,
      sourceName: htmlEntry.relativePath,
      sourceType: 'folder-import',
      fileIndex,
      htmlEntryPath: htmlEntry.relativePath,
    });
    if (fileIndex.htmlEntries.length > 1) {
      project.issues.unshift({
        id: `issue_multi_html_${Date.now()}`,
        level: 'info',
        code: 'MULTI_HTML',
        message: `HTML 파일이 ${fileIndex.htmlEntries.length}개라서 ${htmlEntry.relativePath}를 우선 사용했습니다.`,
      });
    }
    if (requestId !== importRequestSequence) return;
    store.setProject(project);
    setAppState(APP_STATES.editor);
    setStatus(`프로젝트 폴더 import 완료: ${htmlEntry.relativePath}. resolved ${project.summary.assetsResolved}개, unresolved ${project.summary.assetsUnresolved}개입니다.`);
  } catch (error) {
    setStatusWithError(`폴더 import 중 오류가 발생했습니다. ${IMPORT_FAILURE_GUIDES.folderImport}`, error, { logTag: 'FOLDER_IMPORT_ERROR' });
  }
}

function applyPastedHtml() {
  try {
    const html = elements.htmlPasteInput.value.trim();
    if (!html) {
      setStatus('붙여넣기 HTML이 비어 있습니다.');
      return;
    }
    pendingMountOptions = { snapshot: null, preserveHistory: false };
    const project = normalizeProject({ html, sourceName: 'pasted-html', sourceType: 'paste' });
    store.setProject(project);
    setAppState(APP_STATES.editor);
    setStatus(`붙여넣기 HTML을 정규화했습니다. 슬롯 후보 ${project.summary.totalSlotCandidates}개를 찾았습니다.`);
  } catch (error) {
    setStatusWithError(`붙여넣기 적용 중 오류가 발생했습니다. ${IMPORT_FAILURE_GUIDES.pasteMalformed}`, error, { logTag: 'APPLY_PASTED_HTML_ERROR' });
  }
}

async function runDownloadByChoice(choice) {
  if (choice === 'save-edited') return downloadEditedHtml();
  if (choice === 'export-full-png') return exportFullPng();
  if (choice === 'export-full-jpg') return exportFullJpg();
  if (choice === 'export-selection-png') return exportSelectionPng();
  if (choice === 'export-sections-zip') return exportSectionsZip();
  if (choice === 'download-normalized-html') return downloadNormalizedHtml();
  if (choice === 'download-linked-zip') return downloadLinkedZip();
  if (choice === 'download-export-preset-package') return downloadExportPresetPackage();
  throw new Error(`지원하지 않는 저장/출력 선택입니다: ${choice}`);
}

function downloadNormalizedHtml() {
  const project = store.getState().project;
  if (!project) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const fileName = `${projectBaseName(project)}__normalized.html`;
  downloadTextFile(fileName, project.normalizedHtml, 'text/html;charset=utf-8');
  setStatus(`정규화 HTML을 저장했습니다: ${fileName}`);
}

async function downloadEditedHtml() {
  const project = store.getState().project;
  if (!project) return setStatus('먼저 프로젝트를 불러와 주세요.');
  if (!activeEditor) {
    const fileName = `${projectBaseName(project)}__edited_working.html`;
    downloadTextFile(fileName, project.normalizedHtml, 'text/html;charset=utf-8');
    setStatus(`편집 HTML을 저장했습니다: ${fileName} · 다음: 이 파일을 다시 열 때는 상단 "HTML 열기"를 누른 뒤 방금 저장한 파일을 선택하세요.`);
    return;
  }
  await downloadByFormat(currentSaveFormat);
}

function ensurePreflightBeforeExport(kind) {
  if (!activeEditor) return false;
  const preflight = activeEditor.getPreflightReport();
  if (!preflight?.blockingErrors) return true;
  const proceed = window.confirm(`출력 전 검수에서 오류 ${preflight.blockingErrors}개가 감지되었습니다.\n빈 슬롯 또는 미해결 자산이 포함될 수 있습니다.\n그래도 ${kind}을(를) 계속하시겠습니까?`);
  if (!proceed) {
    setStatus(`출력 전 검수 오류 때문에 ${kind}을(를) 중단했습니다.`);
    return false;
  }
  return true;
}

async function ensureFixtureIntegrityBeforeExport(kind) {
  if (!activeEditor) return false;
  const report = await activeEditor.getExportFixtureIntegrityReport?.();
  if (!report || report.ok) return true;
  const preview = (report.issues || []).slice(0, 3).join('\n- ');
  const proceed = window.confirm(`Fixture 기준 export 검증에서 문제를 찾았습니다.\n- ${preview}\n그래도 ${kind}을(를) 계속하시겠습니까?`);
  if (!proceed) {
    setStatus(`Fixture 기준 export 검증 문제 때문에 ${kind}을(를) 중단했습니다.`);
    return false;
  }
  return true;
}

async function downloadLinkedZip() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  if (!ensurePreflightBeforeExport('링크형 ZIP 저장')) return;
  await downloadByFormat('linked', { forceZip: true });
}

async function downloadByFormat(format, { forceZip = false } = {}) {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const saveFormat = normalizeSaveFormat(format);
  const result = await activeEditor.getSavePackageEntries(saveFormat);
  lastSaveConversion = {
    ...result.conversion,
    savedAt: new Date().toISOString(),
  };

  if (saveFormat === 'embedded' && !forceZip) {
    const entry = result.entries[0];
    const text = new TextDecoder().decode(entry.data);
    downloadTextFile(entry.name, text, 'text/html;charset=utf-8');
    setStatus(`embedded HTML을 저장했습니다: ${entry.name} (blob→data ${result.conversion?.portableRewrite?.blobConvertedToDataUrl || 0}개) · 다음: 파일을 더블클릭하거나, 상단 "HTML 열기"로 재오픈하세요.`);
    syncSaveFormatUi();
    return;
  }

  const zipBlob = await buildZipBlob(result.entries);
  const suffix = saveFormat === 'embedded' ? '__embedded_package.zip' : '__linked_package.zip';
  const fileName = `${projectBaseName(project)}${suffix}`;
  downloadBlob(fileName, zipBlob);
  const warningCount = Number(result.conversion?.brokenLinkedPathWarnings?.length || 0);
  const warningText = warningCount > 0 ? ` · 경고 ${warningCount}건(BROKEN_LINKED_PATH)` : '';
  setStatus(`${saveFormat} 패키지를 저장했습니다: ${fileName}${warningText} · 다음: ZIP 압축을 풀고 HTML + assets 폴더를 같은 위치에 둔 뒤 HTML을 다시 여세요.`);
  syncSaveFormatUi();
}

async function exportFullPng() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const autoApplied = applyAdvancedSettingsIfDirty();
  if (!ensurePreflightBeforeExport('전체 PNG 저장')) return;
  if (!(await ensureFixtureIntegrityBeforeExport('전체 PNG 저장'))) return;
  const blob = await activeEditor.exportFullPngBlob(exportScale());
  const fileName = `${projectBaseName(project)}__full.png`;
  downloadBlob(fileName, blob);
  notifySavedWithGuide('export-full-png', fileName, `${exportScale()}x${autoApplied ? ', 고급값 자동 반영' : ''}`);
}

async function exportFullJpg() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const autoApplied = applyAdvancedSettingsIfDirty();
  if (!ensurePreflightBeforeExport('전체 JPG 저장')) return;
  if (!(await ensureFixtureIntegrityBeforeExport('전체 JPG 저장'))) return;
  const quality = exportJpgQuality();
  const blob = await activeEditor.exportFullJpgBlob(exportScale(), quality);
  const fileName = `${projectBaseName(project)}__full.jpg`;
  downloadBlob(fileName, blob);
  notifySavedWithGuide('export-full-jpg', fileName, `${exportScale()}x, 품질 ${quality.toFixed(2)}${autoApplied ? ', 고급값 자동 반영' : ''}`);
}

async function exportSelectionPng() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const autoApplied = applyAdvancedSettingsIfDirty();
  if (!(await ensureFixtureIntegrityBeforeExport('선택 영역 PNG 저장'))) return;
  const options = {
    padding: selectionExportPadding(),
    background: selectionExportBackground(),
  };
  const { blob, meta } = await activeEditor.exportSelectionPngBlob(exportScale(), options);
  const fileName = `${projectBaseName(project)}__selection.png`;
  downloadBlob(fileName, blob);
  const skipped = meta?.policy?.skippedHidden + meta?.policy?.skippedLocked || 0;
  const bgLabel = options.background === 'opaque' ? '불투명(흰색)' : '투명';
  notifySavedWithGuide('export-selection-png', fileName, `${exportScale()}x, 여백 ${options.padding}px, 배경 ${bgLabel}, 포함 ${meta?.targetCount || 0}개, 제외 ${skipped}개${autoApplied ? ', 고급값 자동 반영' : ''}`);
}

async function exportSectionsZip() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const autoApplied = applyAdvancedSettingsIfDirty();
  if (!ensurePreflightBeforeExport('섹션 PNG ZIP 저장')) return;
  if (!(await ensureFixtureIntegrityBeforeExport('섹션 PNG ZIP 저장'))) return;
  const entries = await activeEditor.exportSectionPngEntries(exportScale());
  const zipBlob = await buildZipBlob(entries);
  const fileName = `${projectBaseName(project)}__sections_png.zip`;
  downloadBlob(fileName, zipBlob);
  notifySavedWithGuide('export-sections-zip', fileName, `${exportScale()}x, 섹션 ${entries.length}개${autoApplied ? ', 고급값 자동 반영' : ''}`);
}

function downloadReportJson() {
  const project = store.getState().project;
  if (!project) return setStatus('먼저 프로젝트를 불러와 주세요.');
  const report = getEditorReport(project);
  const fileName = `${projectBaseName(project)}__editor-report.json`;
  downloadTextFile(fileName, JSON.stringify(buildReportPayload(project, report), null, 2), 'application/json;charset=utf-8');
  setStatus(`리포트 JSON을 저장했습니다: ${fileName}`);
}

async function downloadExportPresetPackage() {
  const project = store.getState().project;
  if (!project || !activeEditor) return setStatus('먼저 프로젝트를 불러와 주세요.');
  applyAdvancedSettingsIfDirty();
  const preset = currentExportPreset();
  const baseName = projectBaseName(project);
  const report = getEditorReport(project);
  const entries = [];

  const addBlobEntry = async (name, blob) => {
    if (!blob) return;
    entries.push({ name, data: new Uint8Array(await blob.arrayBuffer()) });
  };

  if (preset.bundleMode === 'basic') {
    entries.push({ name: `${baseName}__edited.html`, data: new TextEncoder().encode(activeEditor.getEditedHtml({ persistDetectedSlots: true })) });
    await addBlobEntry(`${baseName}__full.png`, await activeEditor.exportFullPngBlob(preset.scale));
    entries.push({ name: `${baseName}__report.json`, data: new TextEncoder().encode(JSON.stringify(buildReportPayload(project, report), null, 2)) });
  } else if (preset.bundleMode === 'market') {
    const linked = await activeEditor.getLinkedPackageEntries();
    for (const entry of linked) entries.push({ name: `linked/${entry.name}`, data: entry.data });
    const sections = await activeEditor.exportSectionPngEntries(preset.scale);
    for (const entry of sections) entries.push({ name: `sections/${entry.name}`, data: entry.data });
    entries.push({ name: `${baseName}__report.json`, data: new TextEncoder().encode(JSON.stringify(buildReportPayload(project, report), null, 2)) });
  } else if (preset.bundleMode === 'hires') {
    entries.push({ name: `${baseName}__edited.html`, data: new TextEncoder().encode(activeEditor.getEditedHtml({ persistDetectedSlots: true })) });
    await addBlobEntry(`${baseName}__full@2x.png`, await activeEditor.exportFullPngBlob(preset.scale));
    const sections = await activeEditor.exportSectionPngEntries(preset.scale);
    for (const entry of sections) entries.push({ name: `sections@2x/${entry.name}`, data: entry.data });
  } else if (preset.bundleMode === 'review') {
    entries.push({ name: `${baseName}__normalized.html`, data: new TextEncoder().encode(project.normalizedHtml) });
    await addBlobEntry(`${baseName}__review.png`, await activeEditor.exportFullPngBlob(preset.scale));
    entries.push({ name: `${baseName}__report.json`, data: new TextEncoder().encode(JSON.stringify(buildReportPayload(project, report), null, 2)) });
  }

  const zip = await buildZipBlob(entries);
  const fileName = `${baseName}__${preset.id}-preset.zip`;
  downloadBlob(fileName, zip);
  notifySavedWithGuide('download-export-preset-package', fileName, `${preset.label}, 항목 ${entries.length}개`);
}

function restoreAutosave() {
  const payload = readAutosavePayload();
  if (!payload?.snapshot?.html) return setStatus('복구할 자동저장본이 없습니다.');
  pendingMountOptions = { snapshot: payload.snapshot, preserveHistory: false };
  const project = normalizeProject({
    html: payload.snapshot.html,
    sourceName: payload.sourceName || 'autosave.html',
    sourceType: 'autosave',
  });
  store.setProject(project);
  setAppState(APP_STATES.editor);
  setStatus(`자동저장본을 복구했습니다. 저장 시각: ${payload.savedAt || '-'}`);
}

function applyTextStyleFromControls({ clear = false } = {}) {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const patch = clear ? {
    fontSize: '',
    lineHeight: '',
    letterSpacing: '',
    fontWeight: '',
    color: '',
    textAlign: '',
  } : (() => {
    const next = {};
    const fontSize = elements.textFontSizeInput.value.trim();
    const lineHeight = elements.textLineHeightInput.value.trim();
    const letterSpacing = elements.textLetterSpacingInput.value.trim();
    const fontWeight = elements.textWeightSelect.value;
    if (fontSize) next.fontSize = fontSize;
    if (lineHeight) next.lineHeight = lineHeight;
    if (letterSpacing) next.letterSpacing = letterSpacing;
    if (fontWeight) next.fontWeight = fontWeight;
    if (elements.textColorInput.value) next.color = elements.textColorInput.value;
    return next;
  })();
  const result = activeEditor.applyTextStyle(patch, { clear });
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
}

function applyTextStyleLive(event) {
  if (!activeEditor) return;
  const sourceControl = event?.currentTarget || null;
  const patch = {};
  if (sourceControl === elements.textFontSizeInput) patch.fontSize = elements.textFontSizeInput?.value?.trim() || '';
  if (sourceControl === elements.textLineHeightInput) patch.lineHeight = elements.textLineHeightInput?.value?.trim() || '';
  if (sourceControl === elements.textLetterSpacingInput) patch.letterSpacing = elements.textLetterSpacingInput?.value?.trim() || '';
  if (sourceControl === elements.textWeightSelect) patch.fontWeight = elements.textWeightSelect?.value || '';
  if (sourceControl === elements.textColorInput) patch.color = elements.textColorInput?.value || '';
  if (!Object.keys(patch).length) return;
  const result = activeEditor.applyTextStyle(patch);
  if (result?.ok) setStatus('텍스트 스타일을 실시간 반영했습니다.');
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
}

function applyBatchAction(action) {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.applyBatchLayout(action);
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
}

function applyStackCommand(direction = 'vertical') {
  if (!activeEditor) return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
  const gap = Number.parseFloat(elements.stackGapInput?.value || '24');
  const align = elements.stackAlignSelect?.value || 'start';
  const result = activeEditor.applyStackLayout({
    direction,
    gap: Number.isFinite(gap) ? gap : 24,
    align,
  });
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  return result;
}

function applyTidyCommand(axis = 'x') {
  if (!activeEditor) return { ok: false, message: '먼저 미리보기를 로드해 주세요.' };
  const result = activeEditor.tidySelection({ axis });
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  return result;
}

async function reloadCodeFromEditor() {
  const project = store.getState().project;
  if (!project) return setStatus('먼저 프로젝트를 열어 주세요.');
  if (!activeEditor) return refreshCodeEditorFromState({ force: true });
  if (currentCodeSource === 'edited') {
    const html = await activeEditor.getCurrentPortableHtml();
    elements.editedCodeView.textContent = html;
  }
  refreshCodeEditorFromState({ force: true });
  setStatus('현재 편집 상태를 코드 워크벤치로 다시 불러왔습니다.');
}

function applyCodeToEditor() {
  const project = store.getState().project;
  if (!project) return setStatus('먼저 프로젝트를 열어 주세요.');
  if (currentCodeSource === 'report') return setStatus('리포트 JSON은 편집기에 적용할 수 없습니다.');
  const html = elements.codeEditorTextarea?.value || '';
  if (!html.trim()) return setStatus('적용할 코드가 비어 있습니다.');
  pendingMountOptions = { snapshot: null, preserveHistory: false };
  const nextProject = normalizeProject({ html, sourceName: project.sourceName || 'edited.html', sourceType: 'code-apply' });
  store.setProject(nextProject);
  codeEditorDirty = false;
  setStatus('코드 워크벤치 내용을 다시 편집기에 적용했습니다.');
}

function searchCodeNext() {
  const textarea = elements.codeEditorTextarea;
  const keyword = elements.codeSearchInput?.value || '';
  if (!textarea || !keyword) return setStatus('검색어를 입력해 주세요.');
  const source = textarea.value || '';
  const start = textarea.selectionEnd || 0;
  let index = source.indexOf(keyword, start);
  if (index < 0 && start > 0) index = source.indexOf(keyword, 0);
  if (index < 0) return setStatus('일치하는 코드가 없습니다.');
  textarea.focus();
  textarea.setSelectionRange(index, index + keyword.length);
  const line = source.slice(0, index).split('\n').length;
  setStatus(`코드 검색 결과 ${line}번째 줄로 이동했습니다.`);
}

store.subscribe((state) => {
  const shouldMount = pendingMountOptions || (state.project?.id || '') !== mountedProjectId;
  if (shouldMount) {
    const options = pendingMountOptions || {};
    pendingMountOptions = null;
    mountProject(state.project, options);
  }
  renderShell(store.getState());
});

function safeBoot() {
  try {
    setAppState(APP_STATES.launch);
    populateFixtureSelect();
    populateExportPresetSelect();
    syncExportPresetUi({ forceScale: true });
    refreshLauncherRecentButton();
    const bootEnvironmentReport = evaluateLocalBootEnvironment();
    renderLocalModeNotice(elements.localModeNotice, bootEnvironmentReport);
    renderShortcutHelpList();
    if (bootEnvironmentReport.errorCount || bootEnvironmentReport.warningCount) {
      setStatus(`환경 점검: 오류 ${bootEnvironmentReport.errorCount}개 · 경고 ${bootEnvironmentReport.warningCount}개`);
    }
    renderEmptyPreview();
    syncWorkflowGuide(store.getState());
  } catch (error) {
    console.error('[BOOT_ERROR]', error);
    setStatusWithError('초기 로딩 중 오류가 발생했습니다. 브라우저 콘솔(F12)을 확인해 주세요.', error, { logTag: '' });
  }
}

safeBoot();
onboardingCompleted = hasCompletedOnboarding();
renderOnboardingChecklist();

function bindEvents() {
  initNumericSteppers();
  const logMissingElement = (elementName, context) => {
    console.warn(`[${context}] 필수 요소 누락: #${elementName}`);
  };
  const bindElementEvent = (elementName, eventName, handler, options) => {
    const target = elements[elementName];
    if (!target) {
      logMissingElement(elementName, 'bindEvents');
      return;
    }
    target.addEventListener(eventName, handler, options);
  };
  const requiredElementNames = [
    'openHtmlButton',
    'openFolderButton',
    'loadFixtureButton',
    'applyPasteButton',
    'replaceImageButton',
    'manualSlotButton',
    'toggleHideButton',
    'toggleLockButton',
    'demoteSlotButton',
    'redetectButton',
    'preflightRefreshButton',
    'applyTextStyleButton',
    'clearTextStyleButton',
    'undoButton',
    'redoButton',
    'restoreAutosaveButton',
    'saveProjectSnapshotButton',
    'saveSnapshotFromPanelButton',
    'downloadReportButton',
    'exportPresetSelect',
    'htmlFileInput',
    'folderInput',
    'replaceImageInput',
    'assetFilterInput',
    'layerFilterInput',
    'slotList',
    'layerTree',
    'snapshotList',
  ];
  for (const elementName of requiredElementNames) {
    if (!elements[elementName]) {
      logMissingElement(elementName, 'bindEvents');
    }
  }

for (const button of elements.selectionModeButtons) button.addEventListener('click', () => {
  setSelectionMode(button.dataset.selectionMode);
});
if (elements.workflowGuideSelect) elements.workflowGuideSelect.addEventListener('change', () => syncWorkflowGuide(store.getState(), { announce: true }));
for (const button of elements.presetButtons) {
  button.addEventListener('click', () => {
    if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
    const result = activeEditor.applyImagePreset(button.dataset.preset);
    setStatus(result.message);
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  });
}
for (const button of elements.actionButtons) {
  button.addEventListener('click', () => {
    if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
    if (button.dataset.action === 'remove-image') {
      const result = activeEditor.removeImageFromSelected();
      setStatus(result.message);
      if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
    }
  });
}
for (const button of elements.batchActionButtons) button.addEventListener('click', () => applyBatchAction(button.dataset.batchAction));
elements.stackHorizontalButton?.addEventListener('click', () => applyStackCommand('horizontal'));
elements.stackVerticalButton?.addEventListener('click', () => applyStackCommand('vertical'));
elements.tidyHorizontalButton?.addEventListener('click', () => applyTidyCommand('x'));
elements.tidyVerticalButton?.addEventListener('click', () => applyTidyCommand('y'));
elements.commandPaletteInput?.addEventListener('input', updateCommandPaletteResults);
elements.commandPaletteInput?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    commandPaletteActiveIndex = Math.min(commandPaletteResults.length - 1, commandPaletteActiveIndex + 1);
    renderCommandPaletteResults();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    commandPaletteActiveIndex = Math.max(0, commandPaletteActiveIndex - 1);
    renderCommandPaletteResults();
  } else if (event.key === 'Enter') {
    event.preventDefault();
    runActiveCommandPaletteItem();
  }
});
elements.commandPaletteRunButton?.addEventListener('click', runActiveCommandPaletteItem);
elements.commandPaletteCloseButton?.addEventListener('click', () => toggleCommandPalette(false));
for (const button of elements.canvasActionButtons) {
  button.addEventListener('click', () => {
    const result = executeCanvasContextAction(button.dataset.canvasAction);
    if (result?.message) setStatus(result.message);
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  });
}
for (const button of elements.textAlignButtons) {
  button.addEventListener('click', () => {
    if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
    const result = activeEditor.applyTextStyle({ textAlign: button.dataset.textAlign });
    setStatus(result.message);
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  });
}
for (const control of [
  elements.textFontSizeInput,
  elements.textLineHeightInput,
  elements.textLetterSpacingInput,
  elements.textWeightSelect,
  elements.textColorInput,
]) {
  const eventName = control?.tagName === 'SELECT' ? 'change' : 'input';
  control?.addEventListener(eventName, applyTextStyleLive);
}
elements.applyCanvasGeometryButton?.addEventListener('click', () => {
  if (elements.geometryXInput) elements.geometryXInput.value = elements.canvasGeometryXInput?.value || '';
  if (elements.geometryYInput) elements.geometryYInput.value = elements.canvasGeometryYInput?.value || '';
  if (elements.geometryWInput) elements.geometryWInput.value = elements.canvasGeometryWInput?.value || '';
  if (elements.geometryHInput) elements.geometryHInput.value = elements.canvasGeometryHInput?.value || '';
  const result = applyGeometryFromInputs();
  setStatus(result.message);
});
for (const [canvasInput, sourceInput] of [
  [elements.canvasGeometryXInput, elements.geometryXInput],
  [elements.canvasGeometryYInput, elements.geometryYInput],
  [elements.canvasGeometryWInput, elements.geometryWInput],
  [elements.canvasGeometryHInput, elements.geometryHInput],
]) {
  canvasInput?.addEventListener('input', () => {
    if (!sourceInput) return;
    sourceInput.value = canvasInput.value;
    const result = applyGeometryFromInputs();
    if (result.ok) setStatus(result.message);
  });
  canvasInput?.addEventListener('keydown', (event) => {
    if (!applyKeyboardNudgeToNumberInput(event, canvasInput)) return;
    if (sourceInput) sourceInput.value = canvasInput.value;
  });
}

elements.openHtmlButton?.addEventListener('click', () => elements.htmlFileInput?.click());
elements.launcherUploadButton?.addEventListener('click', () => elements.htmlFileInput?.click());
elements.launcherRecentButton?.addEventListener('click', () => {
  const payload = readAutosavePayload();
  if (!payload?.snapshot?.html) {
    refreshLauncherRecentButton();
    setStatus('복구할 자동저장본이 없습니다.');
    return;
  }
  restoreAutosave();
});
for (const button of elements.launcherFixtureButtons) {
  button.addEventListener('click', () => {
    const fixtureId = button.dataset.launchFixture || '';
    if (!fixtureId) return;
    loadFixture(fixtureId);
  });
}
elements.openFolderButton?.addEventListener('click', () => elements.folderInput?.click());
elements.loadFixtureButton?.addEventListener('click', () => loadFixture(elements.fixtureSelect?.value));
elements.applyPasteButton?.addEventListener('click', applyPastedHtml);
elements.replaceImageButton?.addEventListener('click', () => {
  elements.replaceImageInput?.click();
  advanceOnboardingByAction('replace-image');
});
elements.manualSlotButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.markSelectedAsSlot();
  setStatus(result.message);
  if (result?.ok !== false) advanceOnboardingByAction('slot-select');
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.toggleHideButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.toggleSelectedHidden();
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.arrangeToggleHideButton?.addEventListener('click', () => elements.toggleHideButton?.click());
elements.toggleLockButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.toggleSelectedLocked();
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.arrangeToggleLockButton?.addEventListener('click', () => elements.toggleLockButton?.click());
elements.demoteSlotButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const result = activeEditor.demoteSelectedSlot();
  setStatus(result.message);
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.redetectButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  activeEditor.redetect();
  setStatus('슬롯 자동 감지를 다시 실행했습니다.');
  if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
});
elements.textEditButton?.addEventListener('click', () => {
  executeEditorCommand('toggle-text-edit');
});
elements.duplicateButton?.addEventListener('click', () => { executeEditorCommand('duplicate'); });
elements.deleteButton?.addEventListener('click', () => { executeEditorCommand('delete'); });
elements.groupButton?.addEventListener('click', () => { executeEditorCommand('group-selection'); });
elements.ungroupButton?.addEventListener('click', () => { executeEditorCommand('ungroup-selection'); });
elements.addTextButton?.addEventListener('click', () => {
  executeEditorCommand('add-element-text');
});
elements.addBoxButton?.addEventListener('click', () => {
  executeEditorCommand('add-element-box');
});
elements.addSlotButton?.addEventListener('click', () => {
  executeEditorCommand('add-element-slot');
});
elements.applyGeometryButton?.addEventListener('click', () => {
  const result = applyGeometryFromInputs();
  setStatus(result.message);
});
elements.geometryCoordModeSelect?.addEventListener('change', () => {
  markAdvancedSettingsDirty(true);
  setStatus('좌표 기준 변경 대기 중입니다. "고급값 적용" 버튼을 눌러 반영하세요.');
});
for (const input of [elements.geometryXInput, elements.geometryYInput, elements.geometryWInput, elements.geometryHInput]) {
  input?.addEventListener('input', () => {
    if (!activeEditor) return;
    const result = applyGeometryFromInputs();
    if (result.ok) setStatus(result.message);
  });
  input?.addEventListener('keydown', (event) => {
    applyKeyboardNudgeToNumberInput(event, input);
  });
}
elements.bringForwardButton?.addEventListener('click', () => {
  executeEditorCommand('layer-index-forward');
});
elements.sendBackwardButton?.addEventListener('click', () => {
  executeEditorCommand('layer-index-backward');
});
elements.bringToFrontButton?.addEventListener('click', () => {
  executeEditorCommand('layer-index-front');
});
elements.sendToBackButton?.addEventListener('click', () => {
  executeEditorCommand('layer-index-back');
});
elements.imageNudgeLeftButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: -NUDGE_STEP_RULE.base, dy: 0 })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.imageNudgeRightButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: NUDGE_STEP_RULE.base, dy: 0 })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.imageNudgeUpButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: 0, dy: -NUDGE_STEP_RULE.base })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.imageNudgeDownButton?.addEventListener('click', () => setStatus(activeEditor?.nudgeSelectedImage({ dx: 0, dy: NUDGE_STEP_RULE.base })?.message || '먼저 미리보기를 로드해 주세요.'));
elements.preflightRefreshButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  activeEditor.refreshDerivedMeta();
  setStatus('출력 전 검수를 다시 계산했습니다.');
});
elements.applyTextStyleButton?.addEventListener('click', () => applyTextStyleFromControls({ clear: false }));
elements.clearTextStyleButton?.addEventListener('click', () => applyTextStyleFromControls({ clear: true }));
elements.undoButton?.addEventListener('click', undoHistory);
elements.redoButton?.addEventListener('click', redoHistory);
elements.restoreAutosaveButton?.addEventListener('click', restoreAutosave);
elements.saveProjectSnapshotButton?.addEventListener('click', () => {
  createProjectSnapshot({
    title: elements.snapshotNameInput?.value || '',
    note: '',
    auto: false,
    statusMessage: '작업 시점을 스냅샷으로 저장했습니다.',
  });
});
elements.saveSnapshotFromPanelButton?.addEventListener('click', () => {
  createProjectSnapshot({
    title: elements.snapshotNameInput?.value || '',
    note: '',
    auto: false,
    statusMessage: '스냅샷 목록에 새 시점을 추가했습니다.',
  });
});
elements.snapshotList?.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const action = target?.closest?.('[data-snapshot-action]')?.getAttribute('data-snapshot-action') || '';
  if (!action) return;
  const card = target.closest('[data-snapshot-id]');
  const snapshotId = card?.getAttribute('data-snapshot-id') || '';
  if (!snapshotId) return;
  if (action === 'restore') return restoreProjectSnapshotById(snapshotId);
  if (action === 'delete') return deleteProjectSnapshotById(snapshotId);
});
elements.openDownloadModalButton?.addEventListener('click', () => toggleDownloadModal(true));
elements.closeDownloadModalButton?.addEventListener('click', () => toggleDownloadModal(false));
elements.downloadChoiceSelect?.addEventListener('change', () => renderShell(store.getState()));
elements.runDownloadChoiceButton?.addEventListener('click', async () => {
  const choice = elements.downloadChoiceSelect?.value || 'save-edited';
  try {
    await runDownloadByChoice(choice);
    toggleDownloadModal(false);
  } catch (error) {
    setStatus(`저장/출력 중 오류: ${error?.message || error}`);
  }
});
for (const button of elements.downloadEditedButtons) {
  button?.addEventListener('click', () => { runDownloadByChoice('save-edited').catch((error) => setStatus(`문서 저장 중 오류: ${error?.message || error}`)); });
}
elements.downloadNormalizedButton?.addEventListener('click', () => { runDownloadByChoice('download-normalized-html').catch((error) => setStatus(`정규화 HTML 저장 중 오류: ${error?.message || error}`)); });
elements.downloadLinkedZipButton?.addEventListener('click', () => { runDownloadByChoice('download-linked-zip').catch((error) => setStatus(`ZIP 저장 중 오류: ${error?.message || error}`)); });
for (const button of elements.exportPngButtons) {
  button?.addEventListener('click', () => {
    runDownloadByChoice('export-full-png').catch((error) => setStatus(`PNG 저장 중 오류: ${error?.message || error}`));
    advanceOnboardingByAction('save-png');
  });
}
for (const button of elements.exportJpgButtons) {
  button?.addEventListener('click', () => { runDownloadByChoice('export-full-jpg').catch((error) => setStatus(`JPG 저장 중 오류: ${error?.message || error}`)); });
}
elements.exportSectionsZipButton?.addEventListener('click', () => { runDownloadByChoice('export-sections-zip').catch((error) => setStatus(`섹션 PNG ZIP 저장 중 오류: ${error?.message || error}`)); });
elements.exportSelectionPngButton?.addEventListener('click', () => { runDownloadByChoice('export-selection-png').catch((error) => setStatus(`선택 PNG 저장 중 오류: ${error?.message || error}`)); });
elements.exportPresetPackageButton?.addEventListener('click', () => { runDownloadByChoice('download-export-preset-package').catch((error) => setStatus(`Preset 패키지 저장 중 오류: ${error?.message || error}`)); });
for (const button of elements.downloadPresetButtons) {
  button?.addEventListener('click', () => {
    const presetId = button.dataset.downloadPreset || 'market';
    const recommendedChoice = button.dataset.downloadChoice || '';
    currentExportPresetId = presetId;
    if (recommendedChoice && elements.downloadChoiceSelect) elements.downloadChoiceSelect.value = recommendedChoice;
    syncExportPresetUi({ forceScale: true });
    setStatus(`목적 카드 선택: ${currentExportPreset().label} · 실행할 작업은 ${elements.downloadChoiceSelect?.value || 'save-edited'}로 맞췄습니다.`);
  });
}
elements.saveFormatSelect?.addEventListener('change', () => {
  currentSaveFormat = normalizeSaveFormat(elements.saveFormatSelect.value || 'linked');
  syncSaveFormatUi();
  setStatus(`저장 포맷을 ${currentSaveFormat}로 변경했습니다.`);
});
bindElementEvent('downloadReportButton', 'click', downloadReportJson);
elements.exportPresetSelect?.addEventListener('change', () => {
  currentExportPresetId = elements.exportPresetSelect.value || 'default';
  syncExportPresetUi({ forceScale: true });
  setStatus(`Export preset: ${currentExportPreset().label} (배율은 고급값 적용 버튼으로 반영)`);
});
for (const control of elements.exportScaleSelectControls) {
  control?.addEventListener('change', (event) => {
    const sourceControl = event?.currentTarget || null;
    syncMirroredControls(elements.exportScaleSelectControls, sourceControl?.value || '1', sourceControl);
    markAdvancedSettingsDirty(true);
  });
}
for (const control of elements.exportJpgQualityInputs) {
  control?.addEventListener('input', (event) => {
    const sourceControl = event?.currentTarget || null;
    syncMirroredControls(elements.exportJpgQualityInputs, sourceControl?.value || String(DEFAULT_JPG_QUALITY), sourceControl);
    markAdvancedSettingsDirty(true);
  });
}
elements.selectionExportPaddingInput?.addEventListener('input', () => markAdvancedSettingsDirty(true));
elements.selectionExportBackgroundSelect?.addEventListener('change', () => markAdvancedSettingsDirty(true));
elements.applyAdvancedSettingsButton?.addEventListener('click', () => {
  const result = applyAdvancedSettingsFromForm();
  setStatus(result.message);
});

elements.htmlFileInput?.addEventListener('change', async (event) => {
  const fileList = event.target?.files;
  const file = fileList && fileList.length > 0 ? fileList[0] : null;
  try {
    await openHtmlFile(file);
  } finally {
    event.target.value = '';
  }
});

elements.folderInput?.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files || []);
  try {
    if (files.length) await handleFolderImport(files);
  } finally {
    event.target.value = '';
  }
});

elements.replaceImageInput?.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files || []);
  try {
    if (!files.length) return;
    if (!activeEditor) {
      const message = '먼저 미리보기를 로드해 주세요.';
      setStatus(message);
      store.setImageApplyDiagnostic(buildImageFailureDiagnostic({ files, editorMeta: store.getState().editorMeta, statusMessage: message }));
      return;
    }
    const applied = await activeEditor.applyFiles(files);
    if (applied) {
      setStatus(`${applied}개 이미지를 적용했습니다.`);
      store.setImageApplyDiagnostic(null);
    } else {
      const message = '이미지를 적용하지 못했습니다.';
      setStatus(message);
      store.setImageApplyDiagnostic(buildImageFailureDiagnostic({ files, editorMeta: store.getState().editorMeta, statusMessage: message }));
    }
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
  } catch (error) {
    const message = `이미지 적용 중 오류: ${error?.message || error}`;
    setStatus(message);
    store.setImageApplyDiagnostic(buildImageFailureDiagnostic({ files, editorMeta: store.getState().editorMeta, statusMessage: message }));
  } finally {
    event.target.value = '';
  }
});

bindElementEvent('assetFilterInput', 'input', () => {
  if (!elements.assetTableWrap) {
    logMissingElement('assetTableWrap', 'assetFilterInput');
    return;
  }
  renderAssetTable(elements.assetTableWrap, store.getState().project, elements.assetFilterInput?.value || '');
});
elements.layerFilterInput?.addEventListener('input', () => renderLayerTree(elements.layerTree, store.getState().editorMeta, elements.layerFilterInput?.value || ''));
elements.slotList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-slot-uid]');
  if (!button || !activeEditor) return;
  const ok = activeEditor.selectNodeByUid(button.dataset.slotUid, { additive: event.ctrlKey || event.metaKey || event.shiftKey, toggle: event.ctrlKey || event.metaKey, scroll: true });
  if (ok) setStatus('슬롯을 선택했습니다.');
});
elements.sectionList?.addEventListener('click', (event) => {
  const button = event.target.closest('[data-section-uid]');
  if (!button || !activeEditor) return;
  const ok = activeEditor.selectNodeByUid(button.dataset.sectionUid, { scroll: true });
  if (ok) setStatus('섹션으로 이동했습니다.');
});
elements.selectionInspector?.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-image-diagnostic-action]');
  if (!actionButton) return;
  const action = actionButton.dataset.imageDiagnosticAction || '';
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  if (action === 'select-first-slot') {
    const firstSlotUid = store.getState().editorMeta?.slots?.[0]?.uid || '';
    if (!firstSlotUid) return setStatus('선택할 슬롯이 없습니다.');
    const ok = activeEditor.selectSlotByUid(firstSlotUid);
    return setStatus(ok ? '첫 슬롯을 선택했습니다. 이제 이미지를 다시 넣어보세요.' : '첫 슬롯 선택에 실패했습니다.');
  }
  if (action === 'show-filename-rule') {
    return setStatus('파일명 규칙: 슬롯 라벨(또는 uid) 일부를 파일명에 넣어 주세요. 예) hero-slot.jpg');
  }
  if (action === 'show-supported-extensions') {
    return setStatus(`지원 확장자: ${SUPPORTED_IMAGE_EXTENSIONS_TEXT}`);
  }
});
elements.sectionDuplicateButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const uid = store.getState().editorMeta?.selectedSectionUid || '';
  const result = activeEditor.duplicateSectionByUid(uid);
  setStatus(result.message);
});
elements.sectionMoveUpButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const uid = store.getState().editorMeta?.selectedSectionUid || '';
  const result = activeEditor.moveSectionByUid(uid, 'up');
  setStatus(result.message);
});
elements.sectionMoveDownButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const uid = store.getState().editorMeta?.selectedSectionUid || '';
  const result = activeEditor.moveSectionByUid(uid, 'down');
  setStatus(result.message);
});
elements.sectionDeleteButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const uid = store.getState().editorMeta?.selectedSectionUid || '';
  const result = activeEditor.deleteSectionByUid(uid);
  setStatus(result.message);
});
elements.sectionAddButton?.addEventListener('click', () => {
  if (!activeEditor) return setStatus('먼저 미리보기를 로드해 주세요.');
  const uid = store.getState().editorMeta?.selectedSectionUid || '';
  const result = activeEditor.addSectionAfterUid(uid);
  setStatus(result.message);
});
elements.layerTree?.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-layer-action][data-layer-uid]');
  if (actionButton && activeEditor) {
    event.preventDefault();
    event.stopPropagation();
    const uid = actionButton.dataset.layerUid;
    const result = actionButton.dataset.layerAction === 'hide'
      ? activeEditor.toggleLayerHiddenByUid(uid)
      : activeEditor.toggleLayerLockedByUid(uid);
    setStatus(result.message);
    if (store.getState().currentView === 'edited' || store.getState().currentView === 'report') refreshComputedViews(store.getState());
    return;
  }
  const button = event.target.closest('[data-layer-uid]');
  if (!button || !activeEditor) return;
  const ok = activeEditor.selectNodeByUid(button.dataset.layerUid, { additive: event.ctrlKey || event.metaKey || event.shiftKey, toggle: event.ctrlKey || event.metaKey, scroll: true });
  if (ok) setStatus('레이어를 선택했습니다.');
});
elements.layerTree?.addEventListener('keydown', (event) => {
  const key = String(event.key || '');
  if (key !== 'Enter' && key !== ' ') return;
  const row = event.target.closest?.('[data-layer-uid]');
  if (!row || !activeEditor) return;
  event.preventDefault();
  const ok = activeEditor.selectNodeByUid(row.dataset.layerUid, { additive: event.ctrlKey || event.metaKey || event.shiftKey, toggle: event.ctrlKey || event.metaKey, scroll: true });
  if (ok) setStatus('레이어를 선택했습니다.');
});
for (const button of elements.sidebarTabButtons) {
  button.addEventListener('click', () => setSidebarTab(button.dataset.sidebarTab));
}
for (const button of elements.codeSourceButtons) {
  button.addEventListener('click', () => setCodeSource(button.dataset.codeSource, { preserveDraft: false }));
}
if (elements.codeEditorTextarea) {
  elements.codeEditorTextarea.addEventListener('input', () => { codeEditorDirty = true; });
}
elements.codeSearchNextButton?.addEventListener('click', searchCodeNext);
elements.codeSearchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') { event.preventDefault(); searchCodeNext(); }
});
elements.reloadCodeFromEditorButton?.addEventListener('click', () => { reloadCodeFromEditor().catch((error) => setStatus(`코드 다시 불러오기 오류: ${error?.message || error}`)); });
elements.applyCodeToEditorButton?.addEventListener('click', applyCodeToEditor);
elements.toggleLeftSidebarButton?.addEventListener('click', () => {
  document.body.classList.toggle('layout--left-collapsed');
  document.body.classList.remove('layout--focus-stage');
  syncWorkspaceButtons();
  applyPreviewZoom();
});
elements.toggleRightSidebarButton?.addEventListener('click', () => {
  document.body.classList.toggle('layout--right-collapsed');
  document.body.classList.remove('layout--focus-stage');
  syncWorkspaceButtons();
  applyPreviewZoom();
});
elements.focusModeButton?.addEventListener('click', () => {
  document.body.classList.toggle('layout--focus-stage');
  if (document.body.classList.contains('layout--focus-stage')) {
    document.body.classList.add('layout--left-collapsed', 'layout--right-collapsed');
  }
  syncWorkspaceButtons();
  applyPreviewZoom();
});
elements.zoomOutButton?.addEventListener('click', () => nudgeZoom(-0.1));
elements.zoomInButton?.addEventListener('click', () => nudgeZoom(0.1));
elements.zoomResetButton?.addEventListener('click', () => setZoom('manual', 1));
elements.zoomFitButton?.addEventListener('click', () => setZoom('fit'));
window.addEventListener('resize', applyPreviewZoom);
elements.basicAttributeSection?.addEventListener('toggle', persistPanelLayoutState);
elements.advancedAttributeSection?.addEventListener('toggle', persistPanelLayoutState);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !elements.commandPaletteOverlay?.hidden) {
    event.preventDefault();
    toggleCommandPalette(false);
    return;
  }
  handleCommandPaletteFocusTrap(event);
  if (!elements.commandPaletteOverlay?.hidden) return;

  if (event.key === 'Escape' && !elements.downloadModal?.hidden) {
    event.preventDefault();
    toggleDownloadModal(false);
    return;
  }
  handleDownloadModalFocusTrap(event);
  if (!elements.downloadModal?.hidden) return;

  if (event.key === 'Escape' && !elements.shortcutHelpOverlay?.hidden) {
    event.preventDefault();
    toggleShortcutHelp(false);
    return;
  }
  const questionMarkPressed = event.key === '?' || (event.key === '/' && event.shiftKey);
  if (questionMarkPressed) {
    if (isTypingInputTarget(event.target)) return;
    event.preventDefault();
    toggleShortcutHelp();
    return;
  }
  if (!elements.shortcutHelpOverlay?.hidden && event.key === 'Tab') {
    const focusable = Array.from(elements.shortcutHelpOverlay.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'))
      .filter((node) => node instanceof HTMLElement && !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true');
    if (focusable.length < 1) {
      event.preventDefault();
      elements.shortcutHelpCloseButton?.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
      return;
    }
  }
  if (!elements.shortcutHelpOverlay?.hidden) return;

  const withModifier = event.ctrlKey || event.metaKey;
  if (!withModifier && !isTypingInputTarget(event.target)) {
    const key = String(event.key || '').toLowerCase();
    if (key === 'v') {
      event.preventDefault();
      return performCommandAction('tool-select');
    }
    if (key === 't') {
      event.preventDefault();
      return performCommandAction('tool-text');
    }
    if (key === 'r') {
      event.preventDefault();
      return performCommandAction('tool-box');
    }
  }

  if (!withModifier || event.altKey) return;
  const key = String(event.key || '').toLowerCase();
  if (key === 'k') {
    event.preventDefault();
    toggleCommandPalette(true);
    return;
  }
  if (isTypingInputTarget(event.target)) return;
  if (key === 'd') {
    event.preventDefault();
    return performCommandAction('duplicate');
  }
  if (key === 'g') {
    event.preventDefault();
    return performCommandAction(event.shiftKey ? 'ungroup' : 'group');
  }
  if (key === 'z') {
    event.preventDefault();
    return event.shiftKey ? redoHistory() : undoHistory();
  }
  if (key === 'y') {
    event.preventDefault();
    return redoHistory();
  }
  if (key === 's') {
    event.preventDefault();
    return performCommandAction('save-edited');
  }
  if (key === '=') {
    event.preventDefault();
    return nudgeZoom(0.1);
  }
  if (key === '-') {
    event.preventDefault();
    return nudgeZoom(-0.1);
  }
  if (key === '0') {
    event.preventDefault();
    return setZoom('manual', 1);
  }
  if (key === 'b') {
    event.preventDefault();
    document.body.classList.toggle('layout--left-collapsed');
    syncWorkspaceButtons();
    return applyPreviewZoom();
  }
  if (key === 'i') {
    event.preventDefault();
    document.body.classList.toggle('layout--right-collapsed');
    syncWorkspaceButtons();
    return applyPreviewZoom();
  }
  if (key === 'f') {
    event.preventDefault();
    return setZoom('fit');
  }
});

elements.shortcutHelpOverlay?.addEventListener('click', (event) => {
  if (event.target === elements.shortcutHelpOverlay) toggleShortcutHelp(false);
});
elements.shortcutHelpCloseButton?.addEventListener('click', () => toggleShortcutHelp(false));
elements.commandPaletteOverlay?.addEventListener('click', (event) => {
  if (event.target === elements.commandPaletteOverlay) toggleCommandPalette(false);
});
elements.downloadModal?.addEventListener('click', (event) => {
  if (event.target === elements.downloadModal) toggleDownloadModal(false);
});
elements.beginnerModeToggle?.addEventListener('click', () => setBeginnerMode(!isBeginnerMode));
elements.beginnerTutorialPrevButton?.addEventListener('click', () => {
  beginnerTutorialStepIndex = Math.max(0, beginnerTutorialStepIndex - 1);
  renderBeginnerTutorialStep();
});
elements.beginnerTutorialNextButton?.addEventListener('click', () => {
  if (beginnerTutorialStepIndex >= BEGINNER_TUTORIAL_STEPS.length - 1) {
    completeOnboardingTutorial();
    return;
  }
  beginnerTutorialStepIndex += 1;
  renderBeginnerTutorialStep();
});
elements.beginnerTutorialCloseButton?.addEventListener('click', () => {
  closeBeginnerTutorial();
  setStatus('온보딩을 건너뛰었습니다. 언제든 [온보딩 다시보기] 버튼으로 재시작할 수 있어요.');
});
elements.onboardingReplayButton?.addEventListener('click', () => {
  openBeginnerTutorial({ force: true });
  setStatus('온보딩을 다시 시작했습니다.');
});
elements.onboardingChecklistDoneButton?.addEventListener('click', () => {
  writeToLocalStorage(ONBOARDING_SAMPLE_CHECKED_STORAGE_KEY, '1');
  renderOnboardingChecklist();
  setStatus('샘플 작업 1회 실행 체크리스트를 완료로 기록했습니다.');
});
elements.viewSnapToggleButton?.addEventListener('click', () => toggleViewFeatureFlag('snap', '스냅'));
elements.viewGuideToggleButton?.addEventListener('click', () => toggleViewFeatureFlag('guide', '가이드'));
elements.viewRulerToggleButton?.addEventListener('click', () => toggleViewFeatureFlag('ruler', '눈금자'));
}

bindEvents();

for (const guideContainer of document.querySelectorAll('[data-left-tab-guide-for]')) {
  renderLeftTabStepGuide(guideContainer, guideContainer.getAttribute('data-left-tab-guide-for') || '');
}
setSidebarTab('left-start');
setSidebarTab('right-inspect');
setCodeSource('edited', { preserveDraft: false });
syncSaveFormatUi();
restorePanelLayoutState();
syncAdvancedFormFromState();
syncViewFeatureButtons();
syncWorkspaceButtons();
applyShortcutTooltips();
setBeginnerMode(readFromLocalStorage(BEGINNER_MODE_STORAGE_KEY, '0') === '1', { silent: true });
openBeginnerTutorialIfNeeded();


})();
