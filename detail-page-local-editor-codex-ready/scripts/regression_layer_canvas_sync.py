from __future__ import annotations

import datetime as dt
import json
import shutil
import traceback
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'index.html'
MANIFEST = ROOT / 'data' / 'WEBAPP_PHASE1_FIXTURE_MANIFEST.json'
REPORTS_DIR = ROOT / 'reports'

FIXTURE_IDS = ['F01', 'F02', 'F03', 'F04', 'F05']
SCENARIOS = [f'C{i}' for i in range(1, 11)]

def record(results: list[dict[str, Any]], case_id: str, ok: bool, detail: str = '') -> None:
    results.append({'id': case_id, 'ok': bool(ok), 'detail': detail})


def _collect_fixture_ids() -> list[str]:
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    return [item.get('id', '') for item in manifest.get('fixtures', []) if item.get('id')]


def _find_chromium_path() -> str | None:
    for candidate in ('/usr/bin/chromium', '/usr/bin/chromium-browser'):
        if Path(candidate).exists():
            return candidate
    return shutil.which('chromium') or shutil.which('chromium-browser')


def _load_fixture(page: Any, fixture_id: str) -> None:
    page.evaluate(
        """([selectId, fixtureValue]) => {
            const select = document.querySelector(selectId);
            if (select) {
              select.value = fixtureValue;
              select.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }""",
        ['#fixtureSelect', fixture_id],
    )
    page.evaluate(
        """(buttonId) => {
            const button = document.querySelector(buttonId);
            if (button) button.click();
          }""",
        '#loadFixtureButton',
    )
    page.wait_for_timeout(900)


def _first_canvas_node(frame: Any) -> Any:
    nodes = frame.locator('[data-node-uid]')
    if nodes.count() == 0:
        return None
    return nodes.first


def _to_box(locator: Any) -> dict[str, float] | None:
    box = locator.bounding_box()
    if not box:
        return None
    return {
        'x': float(box['x']),
        'y': float(box['y']),
        'width': float(box['width']),
        'height': float(box['height']),
    }


def _box_diff(before: dict[str, float] | None, after: dict[str, float] | None) -> tuple[float, float]:
    if not before or not after:
        return (0.0, 0.0)
    return (after['x'] - before['x'], after['y'] - before['y'])


def run_fixture_cases(page: Any, fixture_id: str) -> dict[str, Any]:
    fixture_results: list[dict[str, Any]] = []
    _load_fixture(page, fixture_id)
    layer_items = page.locator('[data-layer-uid]')
    frame = page.frame_locator('#previewFrame')
    canvas_nodes = frame.locator('[data-node-uid]')

    layer_count = layer_items.count()
    node_count = canvas_nodes.count()
    if layer_count == 0 or node_count == 0:
        record(fixture_results, 'C1', False, f'fixture={fixture_id}, layer_count={layer_count}, node_count={node_count}')
        for case_id in ['C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10']:
            record(fixture_results, case_id, False, '선행 조건 실패: 레이어/노드 없음')
        return {'fixture_id': fixture_id, 'results': fixture_results}

    # C1: 단일 선택 (클릭)
    first_node = canvas_nodes.first
    first_uid = first_node.get_attribute('data-node-uid') or ''
    first_node.click()
    page.wait_for_timeout(150)
    active_uid = page.locator('.layer-item.is-active').first.get_attribute('data-layer-uid') or ''
    handles = frame.locator('.__phase7_resize_handle')
    record(fixture_results, 'C1', active_uid == first_uid and handles.count() == 4, f'active={active_uid}, expected={first_uid}, handles={handles.count()}')

    # C2: 다중 선택 (최소 자동화 버전: Shift+클릭)
    second_node = canvas_nodes.nth(1)
    second_uid = second_node.get_attribute('data-node-uid') or ''
    second_node.click(modifiers=['Shift'])
    page.wait_for_timeout(150)
    selected_multi = frame.locator('.__phase5_selected_multi').count()
    summary_text = (page.locator('#batchSelectionSummary').inner_text() or '').strip()
    c2_ok = selected_multi >= 1 or '동시 선택' in summary_text
    record(fixture_results, 'C2', c2_ok, f'second={second_uid}, selected_multi={selected_multi}, summary={summary_text}')

    # C3: 포인터 드래그 이동
    before_move = _to_box(first_node)
    box_for_move = _to_box(first_node)
    if box_for_move:
        page.mouse.move(box_for_move['x'] + box_for_move['width'] / 2, box_for_move['y'] + box_for_move['height'] / 2)
        page.mouse.down()
        page.mouse.move(box_for_move['x'] + box_for_move['width'] / 2 + 30, box_for_move['y'] + box_for_move['height'] / 2 + 20)
        page.mouse.up()
    page.wait_for_timeout(160)
    after_move = _to_box(first_node)
    dx_move, dy_move = _box_diff(before_move, after_move)
    moved = abs(dx_move) >= 2 or abs(dy_move) >= 2
    record(fixture_results, 'C3', moved, f'dx={dx_move:.2f}, dy={dy_move:.2f}')

    # C4: 리사이즈 핸들 드래그
    before_resize = _to_box(first_node)
    se_handle = frame.locator('[data-resize-corner="se"]')
    if se_handle.count() > 0:
        handle_box = _to_box(se_handle.first)
        if handle_box:
            page.mouse.move(handle_box['x'] + handle_box['width'] / 2, handle_box['y'] + handle_box['height'] / 2)
            page.mouse.down()
            page.mouse.move(handle_box['x'] + handle_box['width'] / 2 + 20, handle_box['y'] + handle_box['height'] / 2 + 20)
            page.mouse.up()
    page.wait_for_timeout(160)
    after_resize = _to_box(first_node)
    resized = False
    if before_resize and after_resize:
        resized = abs(after_resize['width'] - before_resize['width']) >= 1 or abs(after_resize['height'] - before_resize['height']) >= 1
    record(fixture_results, 'C4', resized, f'before={before_resize}, after={after_resize}')

    # C5: 복제
    before_duplicate = canvas_nodes.count()
    page.keyboard.press('ControlOrMeta+d')
    page.wait_for_timeout(180)
    after_duplicate = frame.locator('[data-node-uid]').count()
    record(fixture_results, 'C5', after_duplicate == before_duplicate + 1, f'before={before_duplicate}, after={after_duplicate}')

    # C6: 삭제
    before_delete = frame.locator('[data-node-uid]').count()
    page.keyboard.press('Delete')
    page.wait_for_timeout(180)
    after_delete = frame.locator('[data-node-uid]').count()
    record(fixture_results, 'C6', after_delete == max(0, before_delete - 1), f'before={before_delete}, after={after_delete}')

    # C7: 방향키 Nudge (1px: Alt+Arrow)
    target = _first_canvas_node(frame)
    before_nudge_1 = _to_box(target) if target else None
    page.keyboard.press('Alt+ArrowRight')
    page.wait_for_timeout(120)
    after_nudge_1 = _to_box(target) if target else None
    dx_1, dy_1 = _box_diff(before_nudge_1, after_nudge_1)
    record(fixture_results, 'C7', abs(dx_1 - 1) <= 0.6 and abs(dy_1) <= 0.6, f'dx={dx_1:.2f}, dy={dy_1:.2f}')

    # C8: Shift+방향키 Nudge (10px)
    before_nudge_10 = _to_box(target) if target else None
    page.keyboard.press('Shift+ArrowRight')
    page.wait_for_timeout(120)
    after_nudge_10 = _to_box(target) if target else None
    dx_10, dy_10 = _box_diff(before_nudge_10, after_nudge_10)
    record(fixture_results, 'C8', abs(dx_10 - 10) <= 1.0 and abs(dy_10) <= 1.0, f'dx={dx_10:.2f}, dy={dy_10:.2f}')

    # C9/C10: Undo/Redo
    before_undo = _to_box(target) if target else None
    page.keyboard.press('ControlOrMeta+z')
    page.wait_for_timeout(140)
    after_undo = _to_box(target) if target else None
    undo_dx, undo_dy = _box_diff(before_undo, after_undo)
    undo_ok = abs(undo_dx) >= 1 or abs(undo_dy) >= 1
    record(fixture_results, 'C9', undo_ok, f'dx={undo_dx:.2f}, dy={undo_dy:.2f}')

    before_redo = _to_box(target) if target else None
    page.keyboard.press('ControlOrMeta+y')
    page.wait_for_timeout(140)
    after_redo = _to_box(target) if target else None
    redo_dx, redo_dy = _box_diff(before_redo, after_redo)
    redo_ok = abs(redo_dx) >= 1 or abs(redo_dy) >= 1
    record(fixture_results, 'C10', redo_ok, f'dx={redo_dx:.2f}, dy={redo_dy:.2f}')

    return {'fixture_id': fixture_id, 'results': fixture_results}


def save_daily_report(payload: dict[str, Any]) -> Path:
    today = datetime.now(timezone.utc).date().isoformat()
    report_path = REPORTS_DIR / f'WEBAPP_PHASE8_REGRESSION_RESULTS_{today}.json'
    existing: dict[str, Any] = {'date': today, 'runs': []}
    if report_path.exists():
        try:
            existing = json.loads(report_path.read_text(encoding='utf-8'))
        except Exception:
            existing = {'date': today, 'runs': []}
    if not isinstance(existing.get('runs'), list):
        existing['runs'] = []
    existing['date'] = today
    existing['runs'].append(payload)
    report_path.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding='utf-8')
    return report_path


def main() -> None:
    started_at = datetime.now(timezone.utc).isoformat()
    fixture_ids = _collect_fixture_ids()
    all_fixture_results: list[dict[str, Any]] = []

    try:
        from playwright.sync_api import sync_playwright
    except Exception as error:  # noqa: BLE001
        payload = {
            'status': 'dependency_missing',
            'error_type': 'dependency_missing',
            'error': str(error),
            'missing_dependency': 'playwright',
            'started_at': started_at,
            'fixture_results': [],
            'summary': {'passed': 0, 'failed': 0, 'total': 0},
        }
        report_path = save_daily_report(payload)
        payload['report_path'] = str(report_path.relative_to(ROOT))
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        raise SystemExit(2)

    try:
        with sync_playwright() as p:
            launch_options: dict[str, Any] = {'headless': True, 'args': ['--no-sandbox']}
            chromium_path = _find_chromium_path()
            if chromium_path:
                launch_options['executable_path'] = chromium_path
            browser = p.chromium.launch(**launch_options)
            page = browser.new_page(viewport={'width': 1700, 'height': 1200})
            page.goto(INDEX.resolve().as_uri(), wait_until='load', timeout=30000)
            page.wait_for_timeout(700)

            for fixture_id in fixture_ids:
                fixture_payload = run_fixture_cases(page, fixture_id)
                all_fixture_results.append(fixture_payload)

            browser.close()
    except Exception as error:  # noqa: BLE001
        payload = {
            'status': 'runtime_error',
            'error_type': 'runtime_error',
            'error': str(error),
            'traceback': traceback.format_exc(),
            'started_at': started_at,
            'fixture_results': all_fixture_results,
            'summary': {'passed': 0, 'failed': 1, 'total': 1},
        }
        report_path = save_daily_report(payload)
        payload['report_path'] = str(report_path.relative_to(ROOT))
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        raise SystemExit(3)

    flat_results = [item for fixture in all_fixture_results for item in fixture['results']]
    passed = sum(1 for item in flat_results if item['ok'])
    failed = sum(1 for item in flat_results if not item['ok'])

    fixture_summary: dict[str, str] = {}
    for fixture in all_fixture_results:
        fixture_ok = all(case['ok'] for case in fixture['results'])
        fixture_summary[fixture['fixture_id']] = 'PASS' if fixture_ok else 'FAIL'

    f05_item = next((fixture for fixture in all_fixture_results if fixture['fixture_id'] == 'F05'), None)
    f05_gate_ok = bool(f05_item and all(case['ok'] for case in f05_item['results']))
    f05_failed_cases = [case['id'] for case in (f05_item or {}).get('results', []) if not case['ok']]

    overall_ok = (failed == 0) and f05_gate_ok
    finished_at = dt.datetime.now(dt.timezone.utc).isoformat()
    payload = {
        'status': 'ok' if failed == 0 else 'scenario_failed',
        'error_type': 'none' if failed == 0 else 'scenario_failed',
        'started_at': started_at,
        'finished_at': datetime.now(timezone.utc).isoformat(),
        'fixture_results': all_fixture_results,
        'fixture_summary': fixture_summary,
        'f05_gate': {
            'ok': f05_gate_ok,
            'failed_cases': f05_failed_cases,
            'message': 'F05 회귀 금지 게이트 통과' if f05_gate_ok else f'⚠️ F05 회귀 금지 게이트 실패: {", ".join(f05_failed_cases) or "unknown"}',
        },
        'summary': {
            'passed': passed,
            'failed': failed,
            'total': len(flat_results),
        },
    }
    report_path = save_daily_report(payload)
    payload['report_path'] = str(report_path.relative_to(ROOT))

    if not f05_gate_ok:
        print('⚠️ [F05 GATE] 회귀 금지 fixture(F05)에서 실패가 감지되었습니다.', flush=True)
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    if not overall_ok:
        raise SystemExit(3)

    if not f05_gate_ok:
        raise SystemExit(4)
    if failed > 0:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
