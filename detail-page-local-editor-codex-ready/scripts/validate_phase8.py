from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

try:
    from bs4 import BeautifulSoup
except Exception:  # pragma: no cover - optional dependency fallback
    BeautifulSoup = None

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'index.html'
BUNDLE = ROOT / 'app.bundle.js'
README = ROOT / 'README.md'
PACKAGE = ROOT / 'package.json'
MANIFEST = ROOT / 'data' / 'WEBAPP_PHASE1_FIXTURE_MANIFEST.json'
FIXTURE_DIR = ROOT / 'data' / 'fixtures'
MAIN_SRC = ROOT / 'src' / 'main.js'
FRAME_SRC = ROOT / 'src' / 'editor' / 'frame-editor.js'
RENDERERS_SRC = ROOT / 'src' / 'ui' / 'renderers.js'
CONFIG_SRC = ROOT / 'src' / 'config.js'
SLOT_DETECTOR_SRC = ROOT / 'src' / 'core' / 'slot-detector.js'
REPORT = ROOT / 'reports' / 'WEBAPP_PHASE8_VALIDATION_RESULTS.json'
SPEC_COMPARE_REPORT = ROOT / 'reports' / 'WEBAPP_PHASE8_SPEC_COMPARE.md'
SLOT_MATRIX_SCRIPT = ROOT / 'scripts' / 'test_slot_detection_matrix.mjs'
SLOT_MATRIX_REPORT = ROOT / 'reports' / 'SLOT_DETECTION_MATRIX_RESULTS.json'

CHECK_VERSIONS = {
    'selection_png': 'v2_computeUnionBoundingBoxFromSelectedNodeUids+selectionExportPolicy',
    'z_order': 'v2_applyLayerIndexCommand+front_back_method_exposure',
    'phase8_runtime_tokens': 'v2_behavior_first_min_token_dependency',
}

REQUIRED_BUTTON_IDS = [
    'openHtmlButton', 'openFolderButton', 'loadFixtureButton', 'applyPasteButton',
    'replaceImageButton', 'manualSlotButton', 'demoteSlotButton', 'toggleHideButton', 'toggleLockButton', 'redetectButton', 'textEditButton',
    'undoButton', 'redoButton', 'restoreAutosaveButton',
    'downloadEditedButton', 'downloadNormalizedButton', 'downloadLinkedZipButton',
    'exportPresetSelect', 'exportPngButton', 'exportJpgButton', 'exportSectionsZipButton', 'exportSelectionPngButton', 'exportPresetPackageButton', 'downloadReportButton',
    'replaceImageInput', 'previewFrame', 'slotList', 'selectionInspector', 'assetFilterInput',
    'preflightContainer', 'preflightRefreshButton', 'layerTree', 'layerFilterInput',
    'textFontSizeInput', 'textLineHeightInput', 'textLetterSpacingInput', 'textWeightSelect', 'textColorInput',
    'applyTextStyleButton', 'clearTextStyleButton', 'batchSelectionSummary',
    'duplicateButton', 'deleteButton', 'addTextButton', 'addBoxButton', 'addSlotButton',
    'geometryXInput', 'geometryYInput', 'geometryWInput', 'geometryHInput', 'applyGeometryButton',
    'bringForwardButton', 'sendBackwardButton', 'bringToFrontButton', 'sendToBackButton',
    'imageNudgeLeftButton', 'imageNudgeRightButton', 'imageNudgeUpButton', 'imageNudgeDownButton',
]

REQUIRED_ID_ALIASES = {
    'exportScaleSelect': {'exportScaleSelect', 'exportScaleSelectMain', 'exportScaleSelectSelection'},
    'exportJpgQualityInput': {'exportJpgQualityInput', 'exportJpgQualityInputMain', 'exportJpgQualityInputSelection'},
}

REQUIRED_EDITOR_METHODS = [
    'toggleTextEdit', 'captureSnapshot', 'exportFullPngBlob', 'exportSectionPngEntries',
    'getLinkedPackageEntries', 'applyFiles', 'removeImageFromSelected',
    'markSelectedAsSlot', 'demoteSelectedSlot', 'getCurrentPortableHtml',
    'applyTextStyle', 'applyBatchLayout', 'getPreflightReport', 'selectNodeByUid', 'refreshDerivedMeta',
    'toggleSelectedHidden', 'toggleSelectedLocked', 'toggleLayerHiddenByUid', 'toggleLayerLockedByUid',
    'duplicateSelected', 'deleteSelected', 'addTextElement', 'addBoxElement', 'addSlotElement',
    'applyGeometryPatch', 'bringSelectedForward', 'sendSelectedBackward', 'bringSelectedToFront', 'sendSelectedToBack',
    'nudgeSelectedImage', 'exportFullJpgBlob', 'exportSelectionPngBlob',
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def count_selector(html_path: Path, selector: str) -> int:
    html = html_path.read_text(encoding='utf-8')
    if BeautifulSoup is not None:
        soup = BeautifulSoup(html, 'lxml')
        return len(soup.select(selector))
    return count_selector_without_bs4(html, selector)


class _MiniDomParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.nodes: list[dict[str, Any]] = []
        self.stack: list[int] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {key: (value or '') for key, value in attrs}
        node = {
            'tag': tag.lower(),
            'attrs': attr_map,
            'classes': set(filter(None, attr_map.get('class', '').split())),
            'parent': self.stack[-1] if self.stack else -1,
        }
        self.nodes.append(node)
        self.stack.append(len(self.nodes) - 1)

    def handle_endtag(self, _tag: str) -> None:
        if self.stack:
            self.stack.pop()


def _split_selector(selector: str) -> tuple[list[str], list[str]]:
    parts = selector.replace('>', ' > ').split()
    simples: list[str] = []
    combinators: list[str] = []
    pending = ' '
    for part in parts:
        if part == '>':
            pending = '>'
            continue
        simples.append(part)
        if len(simples) >= 2:
            combinators.append(pending)
            pending = ' '
    return simples, combinators


def _match_simple(node: dict[str, Any], simple: str) -> bool:
    if simple.startswith('[') and simple.endswith(']'):
        match = re.fullmatch(r"\[([a-zA-Z0-9_-]+)=['\"]([^'\"]+)['\"]\]", simple)
        if not match:
            return False
        attr_name, attr_value = match.groups()
        return node['attrs'].get(attr_name) == attr_value

    if simple.startswith('.'):
        tag = ''
        classes = simple[1:].split('.')
    else:
        chunks = simple.split('.')
        tag = chunks[0].lower()
        classes = chunks[1:]

    if tag and node['tag'] != tag:
        return False
    return all(class_name in node['classes'] for class_name in classes if class_name)


def count_selector_without_bs4(html: str, selector: str) -> int:
    parser = _MiniDomParser()
    parser.feed(html)
    nodes = parser.nodes
    simples, combinators = _split_selector(selector)
    if not simples:
        return 0

    def matches_chain(node_index: int, simple_index: int) -> bool:
        node = nodes[node_index]
        if not _match_simple(node, simples[simple_index]):
            return False
        if simple_index == 0:
            return True
        parent = node['parent']
        combinator = combinators[simple_index - 1]
        if combinator == '>':
            return parent >= 0 and matches_chain(parent, simple_index - 1)
        while parent >= 0:
            if matches_chain(parent, simple_index - 1):
                return True
            parent = nodes[parent]['parent']
        return False

    return sum(1 for index in range(len(nodes)) if matches_chain(index, len(simples) - 1))


def add_check(checks: list[dict[str, Any]], name: str, ok: bool, detail: str = '') -> None:
    checks.append({'name': name, 'ok': bool(ok), 'detail': detail})


def add_dual_mode_check(
    checks: list[dict[str, Any]],
    *,
    name: str,
    implemented: bool,
    modern_ok: bool,
    missing_detail: str,
    outdated_detail: str,
) -> None:
    if implemented and modern_ok:
        add_check(checks, name, True, f'[{CHECK_VERSIONS.get(name.split("_", 1)[-1], "v2")}] modern check passed')
        return
    reason = missing_detail if not implemented else outdated_detail
    status_prefix = '구현 없음' if not implemented else '체크 기준 구식'
    add_check(checks, name, False, f'{status_prefix}: {reason}')


def explain_missing_id(element_id: str) -> str:
    export_ids = {'exportPresetSelect', 'exportScaleSelect', 'exportJpgQualityInput', 'exportPngButton', 'exportJpgButton', 'exportSectionsZipButton', 'exportSelectionPngButton', 'exportPresetPackageButton', 'downloadReportButton'}
    if element_id in {'duplicateButton', 'deleteButton'}:
        return f'ID `{element_id}`를 찾지 못했습니다. index.html의 상단 퀵 액션(복제/삭제) 버튼 구역을 확인하세요.'
    if element_id in {'bringForwardButton', 'sendBackwardButton', 'bringToFrontButton', 'sendToBackButton'}:
        return f'ID `{element_id}`를 찾지 못했습니다. index.html의 정렬/레이어 순서(앞/뒤) 버튼 구역을 확인하세요.'
    if element_id in export_ids:
        return f'ID `{element_id}`를 찾지 못했습니다. index.html의 저장/출력(Export) 패널을 확인하세요.'
    return f'ID `{element_id}`를 찾지 못했습니다. index.html에서 같은 id 속성이 있는지 확인하세요.'


def explain_missing_method(method: str) -> str:
    if method in {'bringSelectedForward', 'sendSelectedBackward', 'bringSelectedToFront', 'sendSelectedToBack'}:
        return f'`{method}` 메서드를 찾지 못했습니다. src/editor/frame-editor.js의 z-order 명령(앞/뒤 이동) 노출부를 확인하세요.'
    if method in {'duplicateSelected', 'deleteSelected'}:
        return f'`{method}` 메서드를 찾지 못했습니다. src/editor/frame-editor.js의 복제/삭제 명령 구현과 return 객체 노출을 확인하세요.'
    return f'`{method}` 메서드를 찾지 못했습니다. src/editor/frame-editor.js에서 메서드명 또는 return 객체 노출명을 확인하세요.'


def write_spec_compare_report(
    expected_ids: list[str],
    html_ids: set[str],
    main_ids: set[str],
    expected_methods: list[str],
    frame_js: str,
) -> None:
    lines = [
        '# WEBAPP PHASE8 스펙 비교표',
        '',
        '## 1) validate 스크립트 기준 버튼 ID vs 실제 코드',
        '',
        '| 버튼 ID | validate 기대 | index.html | src/main.js(getElementById) | 상태 |',
        '|---|---:|---:|---:|---|',
    ]
    for element_id in expected_ids:
        in_html = element_id in html_ids
        in_main = element_id in main_ids
        status = '✅ 일치' if in_html and in_main else ('⚠️ 부분 일치' if in_html or in_main else '❌ 불일치')
        lines.append(f'| `{element_id}` | Y | {"Y" if in_html else "N"} | {"Y" if in_main else "N"} | {status} |')

    lines.extend([
        '',
        '## 2) validate 스크립트 기준 editor 메서드 vs 실제 코드',
        '',
        '| 메서드명 | validate 기대 | src/editor/frame-editor.js 문자열 존재 | 상태 |',
        '|---|---:|---:|---|',
    ])
    for method in expected_methods:
        exists = method in frame_js
        lines.append(f'| `{method}` | Y | {"Y" if exists else "N"} | {"✅ 일치" if exists else "❌ 불일치"} |')
    SPEC_COMPARE_REPORT.write_text('\n'.join(lines).strip() + '\n', encoding='utf-8')


def try_browser_smoke() -> dict[str, Any]:
    script = f"""
from pathlib import Path
import json
import shutil
try:
    from playwright.sync_api import sync_playwright
except Exception as error:
    print(json.dumps({{'status': 'unavailable', 'error': str(error)}}, ensure_ascii=False))
    raise SystemExit(0)
URL = Path(r'{INDEX}').resolve().as_uri()
CHROMIUM_PATH = shutil.which('chromium') or shutil.which('chromium-browser')
try:
    with sync_playwright() as p:
        launch_options = {{'headless': True, 'args': ['--no-sandbox']}}
        if CHROMIUM_PATH:
            launch_options['executable_path'] = CHROMIUM_PATH
        browser = p.chromium.launch(**launch_options)
        page = browser.new_page(viewport={{'width': 1700, 'height': 1200}})
        page.goto(URL, wait_until='load', timeout=10000)
        page.wait_for_timeout(1200)
        payload = {{
            'status': 'ok',
            'title': page.title(),
            'status_text': page.locator('#statusText').inner_text(),
            'layer_count': page.locator('[data-layer-uid]').count(),
            'slot_count': page.locator('[data-slot-uid]').count(),
            'preset_value': page.locator('#exportPresetSelect').input_value(),
        }}
        browser.close()
        print(json.dumps(payload, ensure_ascii=False))
except Exception as error:
    print(json.dumps({{'status': 'blocked', 'error': str(error)}}, ensure_ascii=False))
"""
    completed = subprocess.run([sys.executable, '-c', script], capture_output=True, text=True, timeout=40)
    raw = (completed.stdout or '').strip().splitlines()
    if raw:
        try:
            return json.loads(raw[-1])
        except Exception:
            pass
    return {
        'status': 'error',
        'returncode': completed.returncode,
        'stdout': completed.stdout.strip()[-500:],
        'stderr': completed.stderr.strip()[-500:],
    }


def main() -> None:
    index_html = INDEX.read_text(encoding='utf-8')
    bundle_js = BUNDLE.read_text(encoding='utf-8')
    main_js = MAIN_SRC.read_text(encoding='utf-8')
    frame_js = FRAME_SRC.read_text(encoding='utf-8')
    renderers_js = RENDERERS_SRC.read_text(encoding='utf-8')
    config_js = CONFIG_SRC.read_text(encoding='utf-8')
    slot_detector_js = SLOT_DETECTOR_SRC.read_text(encoding='utf-8')
    readme = README.read_text(encoding='utf-8')
    readme_app = ROOT.joinpath('README_APP.md').read_text(encoding='utf-8')
    package = json.loads(PACKAGE.read_text(encoding='utf-8'))
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))

    checks: list[dict[str, Any]] = []

    try:
        node_check = subprocess.run(['node', '--check', str(BUNDLE)], capture_output=True, text=True)
        add_check(checks, 'bundle_node_syntax_check', node_check.returncode == 0, (node_check.stderr or '').strip())
        node_missing = False
    except FileNotFoundError as error:
        add_check(checks, 'bundle_node_syntax_check', False, f'node dependency missing: {error}')
        node_missing = True

    slot_matrix_payload: dict[str, Any] = {}
    try:
        matrix_run = subprocess.run(['node', str(SLOT_MATRIX_SCRIPT)], capture_output=True, text=True)
        matrix_stdout = (matrix_run.stdout or '').strip()
        if matrix_stdout:
            try:
                slot_matrix_payload = json.loads(matrix_stdout)
            except Exception:
                slot_matrix_payload = {}
        if not slot_matrix_payload and SLOT_MATRIX_REPORT.exists():
            slot_matrix_payload = json.loads(SLOT_MATRIX_REPORT.read_text(encoding='utf-8'))
        add_check(checks, 'slot_detection_matrix_script', matrix_run.returncode == 0, (matrix_run.stderr or matrix_stdout)[-500:])
    except FileNotFoundError as error:
        add_check(checks, 'slot_detection_matrix_script', False, f'node dependency missing: {error}')
        slot_matrix_payload = {}

    add_check(checks, 'index_has_bundle_script', 'app.bundle.js' in index_html, 'index.html should load app.bundle.js')
    add_check(checks, 'index_no_module_script', 'type="module"' not in index_html and "type='module'" not in index_html, 'local mode avoids ESM requirement')
    add_check(checks, 'bundle_has_no_es_import', re.search(r'^\s*import\s', bundle_js, re.M) is None, 'bundle should be plain script')
    add_check(checks, 'bundle_has_no_export_keyword', re.search(r'^\s*export\s', bundle_js, re.M) is None, 'bundle should not expose ESM export statements')
    add_check(checks, 'bundle_uses_srcdoc_preview', 'srcdoc' in bundle_js or 'srcdoc' in index_html, 'preview should be iframe srcdoc based')
    add_check(checks, 'main_boot_has_no_fetch', 'fetch(' not in main_js, 'startup flow should not require network fetch')
    add_check(checks, 'bundle_has_no_file_system_access_api', all(token not in bundle_js for token in ['showOpenFilePicker', 'showSaveFilePicker', 'showDirectoryPicker']), 'local file:// mode should not depend on secure-context file picker APIs')
    add_check(checks, 'main_has_boot_environment_guard', 'evaluateLocalBootEnvironment' in main_js and 'BOOT_LOCAL_POLICY' in main_js, 'startup should expose local-mode guard checks')
    add_check(checks, 'bundle_has_autosave_key_v6', 'detail-local-webapp-autosave-v6' in bundle_js or 'detail-local-webapp-autosave-v6' in config_js, 'autosave key should be updated to v6')
    add_check(checks, 'package_is_phase8', package.get('version') == '0.8.0', json.dumps(package, ensure_ascii=False))
    add_check(checks, 'readme_mentions_phase8', all(word in readme for word in ['리부트', '숨김', '잠금', '스냅', 'Preset']), 'README should document reboot/phase8 capabilities')
    add_check(checks, 'readme_app_has_forbidden_api_policy', (
        '금지 API/의존 목록' in readme_app
        and 'fetch()' in readme_app
        and 'showOpenFilePicker' in readme_app
        and ('file:// 직접 실행' in readme_app or '`file://` 직접 실행' in readme_app)
    ), 'README_APP should include policy + file gate checklist')

    html_ids = set(re.findall(r'id="([^"]+)"', index_html))
    js_ids = sorted(set(re.findall(r"document\.getElementById\('([^']+)'\)", main_js)))
    js_id_set = set(js_ids)

    for element_id in REQUIRED_BUTTON_IDS:
        exists = element_id in html_ids
        add_check(checks, f'index_has_{element_id}', exists, 'ok' if exists else explain_missing_id(element_id))

    for canonical_id, alias_ids in REQUIRED_ID_ALIASES.items():
        exists = any(alias_id in html_ids for alias_id in alias_ids)
        detail = 'ok' if exists else explain_missing_id(canonical_id)
        add_check(checks, f'index_has_{canonical_id}', exists, detail)

    missing_ids = [element_id for element_id in js_ids if element_id not in html_ids]
    missing_detail = 'ok' if not missing_ids else '; '.join(explain_missing_id(element_id) for element_id in missing_ids)
    add_check(checks, 'all_main_js_ids_exist_in_index', not missing_ids, missing_detail)

    for method in REQUIRED_EDITOR_METHODS:
        exists = method in frame_js
        add_check(checks, f'frame_editor_has_{method}', exists, 'ok' if exists else explain_missing_method(method))

    write_spec_compare_report(
        expected_ids=REQUIRED_BUTTON_IDS,
        html_ids=html_ids,
        main_ids=js_id_set,
        expected_methods=REQUIRED_EDITOR_METHODS,
        frame_js=frame_js,
    )

    required_renderer_functions = ['renderLayerTree', 'renderPreflight', 'renderSelectionInspector']
    for name in required_renderer_functions:
        add_check(checks, f'renderer_has_{name}', f'function {name}' in renderers_js, name)

    add_check(checks, 'index_has_stage_hint', 'Shift+드래그' in index_html and '스냅 가이드' in index_html, 'canvas interaction hint should exist')
    add_check(checks, 'index_has_export_preset_label', ('Export preset' in index_html or '<span>Preset</span>' in index_html), 'export preset selector should be visible')
    add_check(checks, 'index_has_3x_scale_option', '<option value="3">3x</option>' in index_html, '3x export scale option should exist')
    add_check(
        checks,
        'index_has_jpg_quality_input',
        any(token in index_html for token in ['id="exportJpgQualityInput"', 'id="exportJpgQualityInputMain"', 'id="exportJpgQualityInputSelection"']),
        'JPG quality input should exist',
    )
    add_check(
        checks,
        'frame_has_marquee_runtime',
        all(token in frame_js for token in ['ensureOverlayNodes', 'showMarqueeRect', 'updateMarqueeSelection', 'handlePointerDown']),
        f'[{CHECK_VERSIONS["phase8_runtime_tokens"]}] marquee drag selection runtime should exist',
    )
    add_check(
        checks,
        'frame_has_snap_runtime',
        all(token in frame_js for token in ['computeSnapAdjustment', 'showSnapLines', 'buildSnapCandidates']),
        f'[{CHECK_VERSIONS["phase8_runtime_tokens"]}] snap guide runtime should exist',
    )
    add_check(checks, 'frame_has_lock_hide_runtime', 'data-editor-hidden' in frame_js and 'data-editor-locked' in frame_js, 'hide/lock data attributes should exist')
    add_check(checks, 'slot_detector_skips_runtime_nodes', 'editorRuntime' in slot_detector_js or 'data-editor-runtime' in slot_detector_js, 'slot detector should skip overlay runtime nodes')
    add_check(checks, 'renderers_have_layer_actions', 'data-layer-action="hide"' in renderers_js and 'data-layer-action="lock"' in renderers_js, 'layer action buttons should exist')
    add_check(
        checks,
        'frame_layer_index_command_unified',
        'applyLayerIndexCommand' in frame_js and all(token in frame_js for token in ['forward:', 'backward:', 'front:', 'back:', "layer-index-front", "layer-index-back"]),
        f'[{CHECK_VERSIONS["z_order"]}] z-order should use layer-index command family',
    )
    add_check(checks, 'main_layer_and_canvas_sync_hook', 'selectNodeByUid' in main_js and 'renderLayerTree(elements.layerTree' in main_js and 'renderSelectionInspector(elements.selectionInspector' in main_js, 'layer panel/canvas sync rendering hooks should exist together')

    add_check(checks, 'index_has_batch_buttons', index_html.count('data-batch-action=') >= 8, 'expect batch layout actions in UI')
    add_check(checks, 'index_has_text_align_buttons', index_html.count('data-text-align=') == 3, 'left / center / right buttons')
    add_check(checks, 'frame_has_pointer_listeners', all(token in frame_js for token in ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']), 'drag interactions should use pointer events')
    add_check(checks, 'frame_has_shared_export_renderer', 'renderExportBlob({' in frame_js and 'normalizeExportScale' in frame_js, 'export pipeline should use shared renderer and normalized scales')
    selection_impl_exists = 'exportSelectionPngBlob' in frame_js
    selection_modern_ok = 'selectionExportPolicy' in frame_js and 'computeUnionBoundingBoxFromSelectedNodeUids' in frame_js
    add_dual_mode_check(
        checks,
        name='frame_selection_png_policy_and_bounds_selection_png',
        implemented=selection_impl_exists,
        modern_ok=selection_modern_ok,
        missing_detail='exportSelectionPngBlob 메서드를 찾지 못했습니다.',
        outdated_detail=(
            f'[{CHECK_VERSIONS["selection_png"]}] '
            'computeUnionBoundingBoxFromSelectedNodeUids/selectionExportPolicy 기반 구현이 필요합니다.'
        ),
    )

    z_order_impl_exists = any(token in frame_js for token in ['bringSelectedToFront', 'sendSelectedToBack'])
    z_order_modern_ok = 'applyLayerIndexCommand' in frame_js and all(token in frame_js for token in ['front:', 'back:'])
    add_dual_mode_check(
        checks,
        name='frame_z_order_front_back_api_z_order',
        implemented=z_order_impl_exists,
        modern_ok=z_order_modern_ok,
        missing_detail='front/back 메서드 노출(bringSelectedToFront/sendSelectedToBack)을 찾지 못했습니다.',
        outdated_detail=(
            f'[{CHECK_VERSIONS["z_order"]}] '
            'applyLayerIndexCommand + front/back 명령 경로를 기준으로 업데이트가 필요합니다.'
        ),
    )
    add_check(checks, 'main_uses_jpg_quality_option', 'exportJpgQualityInput' in main_js and 'exportJpgQuality()' in main_js, 'JPG quality option should be wired in main export flow')
    add_check(checks, 'main_has_fixture_integrity_gate', 'ensureFixtureIntegrityBeforeExport' in main_js and 'getExportFixtureIntegrityReport' in frame_js, 'fixture-based export integrity check should guard exports')

    add_check(checks, 'fixture_count_is_5', len(manifest.get('fixtures', [])) == 5, f"fixtures={len(manifest.get('fixtures', []))}")
    for fixture in manifest.get('fixtures', []):
        html_path = FIXTURE_DIR / Path(fixture['file']).name
        add_check(checks, f'fixture_exists_{fixture["id"]}', html_path.exists(), str(html_path))
        slot_contract = fixture.get('slot_contract', {})
        if slot_contract.get('required_selectors'):
            total = 0
            for selector in slot_contract['required_selectors']:
                count = count_selector(html_path, selector)
                total += count
                add_check(checks, f'{fixture["id"]}_selector_{selector}', count >= 1, f'count={count}')
            expected = slot_contract.get('required_exact_count')
            if expected is not None:
                add_check(checks, f'{fixture["id"]}_required_exact_count', total == expected, f'expected={expected}, actual={total}')
        if slot_contract.get('required_pattern_groups'):
            total = 0
            for selector, expected_count in slot_contract['required_pattern_groups'].items():
                actual = count_selector(html_path, selector)
                total += actual
                add_check(checks, f'{fixture["id"]}_pattern_{selector}', actual == expected_count, f'expected={expected_count}, actual={actual}')
            if slot_contract.get('required_exact_count') is not None:
                add_check(checks, f'{fixture["id"]}_required_exact_from_groups', total == slot_contract['required_exact_count'], f'expected={slot_contract["required_exact_count"]}, actual={total}')
            if slot_contract.get('required_min_count') is not None:
                add_check(checks, f'{fixture["id"]}_required_min_from_groups', total >= slot_contract['required_min_count'], f'min={slot_contract["required_min_count"]}, actual={total}')

    f05_path = FIXTURE_DIR / 'fixture_05_user_melting_cheese_compact.html'
    f05_html = f05_path.read_text(encoding='utf-8')
    add_check(checks, 'F05_has_two_uploaded_img_refs', f05_html.count('uploaded:') >= 2, f"uploaded_count={f05_html.count('uploaded:')}")
    add_check(checks, 'F05_has_media_shells', all(token in f05_html for token in ['media-shell', 'hero-shot', 'opt-thumb', 'visual']), 'expected real-world slot patterns')
    matrix_rows = {item.get('id'): item for item in slot_matrix_payload.get('matrix', []) if isinstance(item, dict)}
    add_check(checks, 'slot_matrix_has_required_cases', all(key in matrix_rows for key in [
        'explicit_selector_100pct',
        'heuristic_threshold_gate',
        'near_miss_not_promoted',
        'fixture_05_regression_gate',
    ]), json.dumps(sorted(matrix_rows.keys()), ensure_ascii=False))
    for required_case in ['explicit_selector_100pct', 'heuristic_threshold_gate', 'near_miss_not_promoted', 'fixture_05_regression_gate']:
        row = matrix_rows.get(required_case, {})
        add_check(checks, f'slot_matrix_case_{required_case}', bool(row.get('pass')), json.dumps(row, ensure_ascii=False))
    f05_row = matrix_rows.get('fixture_05_regression_gate', {})
    f05_actual = f05_row.get('actual', {}) if isinstance(f05_row, dict) else {}
    add_check(
        checks,
        'F05_slot_detection_summary_standardized',
        all(key in f05_actual for key in ['explicitCount', 'heuristicCount', 'nearMissCount']),
        json.dumps(f05_actual, ensure_ascii=False),
    )

    browser_smoke = try_browser_smoke()
    add_check(checks, 'playwright_smoke_uses_file_protocol', INDEX.resolve().as_uri().startswith('file://'), INDEX.resolve().as_uri())
    add_check(checks, 'file_protocol_smoke_gate', browser_smoke.get('status') == 'ok', json.dumps(browser_smoke, ensure_ascii=False))

    dependency_missing_checks = [item for item in checks if (not item['ok']) and ('dependency missing' in item.get('detail', '') or 'No module named' in item.get('detail', ''))]
    if node_missing:
        dependency_missing_checks.append({'name': 'bundle_node_syntax_check'})
    browser_status = browser_smoke.get('status', 'unknown')
    if browser_status == 'unavailable':
        dependency_missing_checks.append({'name': 'file_protocol_smoke_gate'})

    failure_type = 'none'
    if any(not item['ok'] for item in checks):
        failure_type = 'dependency_missing' if dependency_missing_checks else 'scenario_failed'

    summary = {
        'ok': all(item['ok'] for item in checks),
        'check_count': len(checks),
        'passed': sum(1 for item in checks if item['ok']),
        'failed': sum(1 for item in checks if not item['ok']),
        'bundle_bytes': BUNDLE.stat().st_size,
        'bundle_sha256': sha256(BUNDLE),
        'browser_smoke_status': browser_status,
        'failure_type': failure_type,
    }
    payload = {
        'summary': summary,
        'check_versions': CHECK_VERSIONS,
        'checks': checks,
        'browser_smoke': browser_smoke,
    }
    REPORT.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding='utf-8')
    print(json.dumps(payload, indent=2, ensure_ascii=False))
    if failure_type == 'dependency_missing':
        raise SystemExit(2)
    if failure_type == 'scenario_failed':
        raise SystemExit(3)


if __name__ == '__main__':
    main()
