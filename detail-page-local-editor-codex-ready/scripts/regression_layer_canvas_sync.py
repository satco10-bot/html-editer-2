from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / 'index.html'


def record(results: list[dict], name: str, ok: bool, detail: str = '') -> None:
    results.append({'name': name, 'ok': bool(ok), 'detail': detail})


def main() -> None:
    results: list[dict] = []
    try:
        from playwright.sync_api import sync_playwright
    except Exception as error:  # noqa: BLE001
        payload = {'status': 'unavailable', 'error': str(error), 'results': results}
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        page = browser.new_page(viewport={'width': 1700, 'height': 1200})
        page.goto(INDEX.resolve().as_uri(), wait_until='load', timeout=30000)
        page.wait_for_timeout(700)
        page.locator('#loadFixtureButton').click()
        page.wait_for_timeout(1200)

        layer_items = page.locator('[data-layer-uid]')
        layer_count = layer_items.count()
        record(results, 'fixture_loaded_layers_exist', layer_count > 0, f'layer_count={layer_count}')
        if layer_count > 0:
            first_uid = layer_items.nth(0).get_attribute('data-layer-uid') or ''
            layer_items.nth(0).click()
            page.wait_for_timeout(150)
            active_uid = page.locator('.layer-item.is-active').first.get_attribute('data-layer-uid') or ''
            record(results, 'layer_click_keeps_active_uid', active_uid == first_uid, f'expected={first_uid}, actual={active_uid}')

        frame = page.frame_locator('#previewFrame')
        canvas_nodes = frame.locator('[data-node-uid]')
        canvas_count = canvas_nodes.count()
        record(results, 'canvas_nodes_exist', canvas_count > 0, f'canvas_nodes={canvas_count}')
        if canvas_count > 0:
            canvas_uid = canvas_nodes.first.get_attribute('data-node-uid') or ''
            canvas_nodes.first.click()
            page.wait_for_timeout(250)
            active_uid = page.locator('.layer-item.is-active').first.get_attribute('data-layer-uid') or ''
            record(results, 'canvas_click_syncs_layer_panel', active_uid == canvas_uid, f'expected={canvas_uid}, actual={active_uid}')

        if layer_count > 0:
            layer_items.nth(0).click()
            page.wait_for_timeout(100)
            page.locator('#duplicateButton').click()
            page.wait_for_timeout(250)
            duplicated_count = page.locator('.layer-item.is-active').count()
            record(results, 'duplicate_keeps_layer_sync', duplicated_count >= 1, f'active_count={duplicated_count}')

            page.locator('#deleteButton').click()
            page.wait_for_timeout(200)
            page.locator('#undoButton').click()
            page.wait_for_timeout(250)
            restored_count = page.locator('[data-layer-uid]').count()
            record(results, 'delete_then_undo_restores_layers', restored_count >= layer_count, f'before={layer_count}, after_undo={restored_count}')

        browser.close()

    payload = {
        'status': 'ok',
        'results': results,
        'passed': sum(1 for item in results if item['ok']),
        'failed': sum(1 for item in results if not item['ok']),
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
