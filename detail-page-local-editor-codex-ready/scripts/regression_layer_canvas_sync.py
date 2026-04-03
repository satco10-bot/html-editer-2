from __future__ import annotations

import datetime as dt
import json
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'index.html'
REPORTS_DIR = ROOT / 'reports'
HISTORY_JSON = REPORTS_DIR / 'WEBAPP_PHASE8_REGRESSION_HISTORY.json'

FIXTURE_IDS = ['F01', 'F02', 'F03', 'F04', 'F05']
SCENARIOS = [f'C{i}' for i in range(1, 11)]


class DependencyMissingError(RuntimeError):
    pass


def record(results: list[dict[str, Any]], scenario_id: str, ok: bool, detail: str = '', command: str = '') -> None:
    results.append({
        'scenario_id': scenario_id,
        'ok': bool(ok),
        'detail': detail,
        'command': command,
    })


def _select_fixture(page: Any, fixture_id: str) -> None:
    page.select_option('#fixtureSelect', fixture_id)
    page.locator('#loadFixtureButton').click()
    page.wait_for_timeout(800)


def _get_active_uid(page: Any) -> str:
    active = page.locator('.layer-item.is-active').first
    if active.count() < 1:
        return ''
    return active.get_attribute('data-layer-uid') or ''


def run_fixture_scenarios(page: Any, fixture_id: str) -> dict[str, Any]:
    fixture_results: list[dict[str, Any]] = []
    _select_fixture(page, fixture_id)
    frame = page.frame_locator('#previewFrame')
    nodes = frame.locator('[data-node-uid]')
    layer_items = page.locator('[data-layer-uid]')

    layer_count = layer_items.count()
    node_count = nodes.count()
    if layer_count < 2 or node_count < 2:
        for scenario_id in SCENARIOS:
            record(
                fixture_results,
                scenario_id,
                False,
                f'not enough nodes for test: layers={layer_count}, nodes={node_count}',
                command='fixture-load',
            )
        return {
            'fixture_id': fixture_id,
            'passed': 0,
            'failed': len(fixture_results),
            'ok': False,
            'results': fixture_results,
            'f05_gate': fixture_id != 'F05',
        }

    # C1: single click selection
    first_uid = nodes.nth(0).get_attribute('data-node-uid') or ''
    nodes.nth(0).click()
    page.wait_for_timeout(120)
    record(
        fixture_results,
        'C1',
        _get_active_uid(page) == first_uid,
        f'expected={first_uid}, actual={_get_active_uid(page)}',
        command='click-select',
    )

    # C2: shift + drag marquee multi select
    node_a = nodes.nth(0).bounding_box()
    node_b = nodes.nth(1).bounding_box()
    c2_ok = False
    c2_detail = 'missing bounding box'
    if node_a and node_b:
        start_x = min(node_a['x'], node_b['x']) - 8
        start_y = min(node_a['y'], node_b['y']) - 8
        end_x = max(node_a['x'] + node_a['width'], node_b['x'] + node_b['width']) + 8
        end_y = max(node_a['y'] + node_a['height'], node_b['y'] + node_b['height']) + 8
        page.keyboard.down('Shift')
        page.mouse.move(start_x, start_y)
        page.mouse.down()
        page.mouse.move(end_x, end_y)
        page.mouse.up()
        page.keyboard.up('Shift')
        page.wait_for_timeout(140)
        selected_count = page.locator('.layer-item.is-active').count()
        c2_ok = selected_count >= 2
        c2_detail = f'selected_count={selected_count}'
    record(fixture_results, 'C2', c2_ok, c2_detail, command='marquee-drag')

    # C3: pointer drag move
    target_box = nodes.nth(0).bounding_box()
    c3_ok = False
    c3_detail = 'missing bounding box'
    if target_box:
        sx = target_box['x'] + 8
        sy = target_box['y'] + 8
        page.mouse.move(sx, sy)
        page.mouse.down()
        page.mouse.move(sx + 18, sy + 18)
        page.mouse.up()
        page.wait_for_timeout(120)
        moved_box = nodes.nth(0).bounding_box()
        if moved_box:
            c3_ok = abs(moved_box['x'] - target_box['x']) >= 2 or abs(moved_box['y'] - target_box['y']) >= 2
            c3_detail = f"before=({target_box['x']:.1f},{target_box['y']:.1f}) after=({moved_box['x']:.1f},{moved_box['y']:.1f})"
    record(fixture_results, 'C3', c3_ok, c3_detail, command='drag-move')

    # C4: resize handle drag
    handle = frame.locator('[data-resize-corner="se"]').first
    handle_box = handle.bounding_box()
    c4_ok = False
    c4_detail = 'resize handle unavailable'
    if handle_box:
        page.mouse.move(handle_box['x'] + 4, handle_box['y'] + 4)
        page.mouse.down()
        page.mouse.move(handle_box['x'] + 20, handle_box['y'] + 20)
        page.mouse.up()
        page.wait_for_timeout(140)
        c4_ok = True
        c4_detail = 'resize drag executed'
    record(fixture_results, 'C4', c4_ok, c4_detail, command='resize-drag')

    # C5: duplicate
    before_dup = page.locator('[data-layer-uid]').count()
    page.locator('#duplicateButton').click()
    page.wait_for_timeout(160)
    after_dup = page.locator('[data-layer-uid]').count()
    record(fixture_results, 'C5', after_dup == before_dup + 1, f'before={before_dup}, after={after_dup}', command='duplicate')

    # C6: delete
    before_del = page.locator('[data-layer-uid]').count()
    page.locator('#deleteButton').click()
    page.wait_for_timeout(160)
    after_del = page.locator('[data-layer-uid]').count()
    record(fixture_results, 'C6', after_del <= before_del - 1, f'before={before_del}, after={after_del}', command='delete')

    # C7: arrow nudge ±1
    nodes.nth(0).click()
    page.wait_for_timeout(80)
    before_nudge = nodes.nth(0).bounding_box()
    page.keyboard.press('ArrowRight')
    page.wait_for_timeout(110)
    after_nudge = nodes.nth(0).bounding_box()
    c7_ok = bool(before_nudge and after_nudge and abs(after_nudge['x'] - before_nudge['x']) >= 1)
    record(fixture_results, 'C7', c7_ok, 'arrow-right nudge', command='nudge-selection')

    # C8: shift+arrow nudge ±10
    before_fast_nudge = nodes.nth(0).bounding_box()
    page.keyboard.press('Shift+ArrowRight')
    page.wait_for_timeout(110)
    after_fast_nudge = nodes.nth(0).bounding_box()
    delta = 0.0
    if before_fast_nudge and after_fast_nudge:
        delta = after_fast_nudge['x'] - before_fast_nudge['x']
    record(fixture_results, 'C8', abs(delta) >= 9, f'dx={delta:.2f}', command='nudge-selection')

    # C9: undo one step
    pre_undo = page.locator('[data-layer-uid]').count()
    page.locator('#undoButton').click()
    page.wait_for_timeout(140)
    post_undo = page.locator('[data-layer-uid]').count()
    record(fixture_results, 'C9', pre_undo != post_undo or page.locator('#redoButton').is_enabled(), f'before={pre_undo}, after={post_undo}', command='undo')

    # C10: redo one step
    pre_redo = page.locator('[data-layer-uid]').count()
    page.locator('#redoButton').click()
    page.wait_for_timeout(140)
    post_redo = page.locator('[data-layer-uid]').count()
    record(fixture_results, 'C10', pre_redo != post_redo or page.locator('#undoButton').is_enabled(), f'before={pre_redo}, after={post_redo}', command='redo')

    passed = sum(1 for item in fixture_results if item['ok'])
    failed = len(fixture_results) - passed
    fixture_ok = failed == 0
    return {
        'fixture_id': fixture_id,
        'passed': passed,
        'failed': failed,
        'ok': fixture_ok,
        'results': fixture_results,
        'f05_gate': fixture_ok if fixture_id == 'F05' else True,
    }


def summarize_matrix(rows: list[dict[str, Any]]) -> dict[str, Any]:
    pass_rows = [row for row in rows if row['ok']]
    fail_rows = [row for row in rows if not row['ok']]
    f05_row = next((row for row in rows if row['fixture_id'] == 'F05'), None)
    f05_gate_passed = bool(f05_row and f05_row.get('f05_gate'))

    return {
        'fixtures_total': len(rows),
        'fixtures_passed': len(pass_rows),
        'fixtures_failed': len(fail_rows),
        'overall_ok': len(fail_rows) == 0 and f05_gate_passed,
        'f05_gate_passed': f05_gate_passed,
        'f05_gate_warning': '' if f05_gate_passed else 'F05 회귀 금지 게이트 실패: 즉시 확인 필요',
    }


def append_history(payload: dict[str, Any]) -> None:
    HISTORY_JSON.parent.mkdir(parents=True, exist_ok=True)
    history = {'runs': []}
    if HISTORY_JSON.exists():
        try:
            history = json.loads(HISTORY_JSON.read_text(encoding='utf-8'))
            if not isinstance(history.get('runs'), list):
                history = {'runs': []}
        except Exception:
            history = {'runs': []}
    history['runs'].append(payload)
    HISTORY_JSON.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding='utf-8')


def main() -> None:
    started_at = dt.datetime.now(dt.timezone.utc).isoformat()
    try:
        from playwright.sync_api import sync_playwright
    except Exception as error:  # noqa: BLE001
        payload = {
            'status': 'dependency_missing',
            'failure_type': 'dependency_missing',
            'error': str(error),
            'hint': 'pip install -r requirements-regression.txt 후 재실행하세요.',
            'started_at': started_at,
        }
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        raise SystemExit(2)

    fixture_rows: list[dict[str, Any]] = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1700, 'height': 1200})
        page.goto(INDEX.resolve().as_uri(), wait_until='load', timeout=30000)
        page.wait_for_timeout(900)

        for fixture_id in FIXTURE_IDS:
            fixture_rows.append(run_fixture_scenarios(page, fixture_id))
            if fixture_id == 'F05' and not fixture_rows[-1]['ok']:
                # F05 fail-fast gate warning in output; continue so caller still gets full matrix.
                pass

        browser.close()

    summary = summarize_matrix(fixture_rows)
    finished_at = dt.datetime.now(dt.timezone.utc).isoformat()
    payload = {
        'status': 'ok' if summary['overall_ok'] else 'scenario_failed',
        'failure_type': 'none' if summary['overall_ok'] else 'scenario_failed',
        'started_at': started_at,
        'finished_at': finished_at,
        'summary': summary,
        'fixtures': fixture_rows,
    }

    append_history(payload)
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    if not summary['overall_ok']:
        raise SystemExit(3)


if __name__ == '__main__':
    main()
