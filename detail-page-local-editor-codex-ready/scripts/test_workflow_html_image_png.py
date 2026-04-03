from __future__ import annotations

import base64
import importlib
import json
import shutil
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP_URL = (ROOT / 'index.html').resolve().as_uri()

PNG_BASE64 = (
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9gN8sAAAAASUVORK5CYII='
)


def emit_dependency_error(reason: str) -> None:
    payload = {
        'status': 'failed',
        'error_type': 'dependency_missing',
        'reason': reason,
        'how_to_fix': [
            'python3 scripts/install_regression_dependencies.py',
            'python3 -m playwright install chromium',
            'python3 scripts/test_workflow_html_image_png.py',
        ],
    }
    print(json.dumps(payload, ensure_ascii=False))


def load_playwright_sync_api():
    try:
        module = importlib.import_module('playwright.sync_api')
    except ModuleNotFoundError:
        emit_dependency_error('python 패키지 playwright가 설치되어 있지 않습니다.')
        raise SystemExit(2)
    return module


def find_chromium_path() -> str | None:
    for candidate in ('/usr/bin/chromium', '/usr/bin/chromium-browser'):
        if Path(candidate).exists():
            return candidate
    return shutil.which('chromium') or shutil.which('chromium-browser')


def build_minimal_fixture(tmp_dir: Path) -> tuple[Path, Path]:
    html_path = tmp_dir / 'workflow_sample.html'
    image_path = tmp_dir / 'test.png'

    html_path.write_text(
        '\n'.join([
            '<!doctype html>',
            '<html lang="ko">',
            '<head><meta charset="utf-8"><title>workflow sample</title></head>',
            '<body>',
            '<div style="width:860px;margin:0 auto">',
            '<h1>워크플로우 점검 샘플</h1>',
            '<img src="uploaded:test.png" alt="샘플 이미지" style="display:block;width:860px;height:auto;" />',
            '</div>',
            '</body>',
            '</html>',
        ]),
        encoding='utf-8',
    )
    image_path.write_bytes(base64.b64decode(PNG_BASE64))
    return html_path, image_path


def wait_status_contains(page, phrase: str, timeout_ms: int, stage: str) -> None:
    try:
        page.wait_for_function(
            "(target) => document.querySelector('#statusText')?.textContent?.includes(target)",
            arg=phrase,
            timeout=timeout_ms,
        )
    except Exception as error:
        current = page.locator('#statusText').inner_text() if page.locator('#statusText').count() else ''
        raise RuntimeError(f"{stage} 단계 대기 실패: phrase={phrase!r}, statusText={current!r}, error={error}") from error


def ensure_editor_shell_ready(page) -> None:
    open_html_button = page.locator('#openHtmlButton')
    if open_html_button.count() and open_html_button.first.is_visible():
        return
    launcher_upload = page.locator('#launcherUploadButton')
    if launcher_upload.count() and launcher_upload.first.is_visible():
        return

    launcher_new = page.locator('#launcherNewButton')
    if launcher_new.count():
        launcher_new.first.click()
        page.wait_for_timeout(500)


def click_html_upload_entry(page):
    open_html_button = page.locator('#openHtmlButton')
    if open_html_button.count() and open_html_button.first.is_visible():
        open_html_button.first.click()
        return
    launcher_upload = page.locator('#launcherUploadButton')
    if launcher_upload.count() and launcher_upload.first.is_visible():
        launcher_upload.first.click()
        return
    raise RuntimeError('HTML 업로드 버튼을 찾지 못했습니다. (#openHtmlButton / #launcherUploadButton)')


def run() -> dict[str, object]:
    sync_api = load_playwright_sync_api()
    TimeoutErrorType = sync_api.TimeoutError
    sync_playwright = sync_api.sync_playwright

    chromium_path = find_chromium_path()
    with tempfile.TemporaryDirectory(prefix='workflow_smoke_') as tmp:
        tmp_dir = Path(tmp)
        html_path, image_path = build_minimal_fixture(tmp_dir)

        try:
            with sync_playwright() as p:
                launch_options = {'headless': True, 'args': ['--no-sandbox']}
                if chromium_path:
                    launch_options['executable_path'] = chromium_path
                browser = p.chromium.launch(**launch_options)
                page = browser.new_page(viewport={'width': 1600, 'height': 1200})
                page.goto(APP_URL, wait_until='load', timeout=30000)
                ensure_editor_shell_ready(page)
                page.wait_for_selector('#htmlFileInput', state='attached', timeout=10000)
                page.wait_for_selector('#replaceImageInput', state='attached', timeout=10000)

                with page.expect_file_chooser(timeout=10000) as html_chooser_info:
                    click_html_upload_entry(page)
                html_chooser_info.value.set_files(str(html_path))
                wait_status_contains(page, 'HTML 파일', 30000, 'HTML 업로드')

                set_file_with_fallback(page, '#replaceImageButton', '#replaceImageInput', image_path)
                wait_status_contains(page, '이미지를 적용', 30000, '이미지 적용')

                try:
                    with page.expect_download(timeout=10000) as download_info:
                        page.click('#exportPngButton')
                    download = download_info.value
                    suggested_name = download.suggested_filename
                    saved_path = tmp_dir / suggested_name
                    download.save_as(str(saved_path))
                    wait_status_contains(page, '저장 완료:', 10000, 'PNG 저장 토스트')

                    page.click('#openDownloadModalButton')
                    page.select_option('#exportPresetSelect', 'default')
                    page.select_option('#downloadChoiceSelect', 'download-export-preset-package')

                    with page.expect_download(timeout=15000) as preset_download_info:
                        page.click('#runDownloadChoiceButton')
                    preset_download = preset_download_info.value
                    preset_name = preset_download.suggested_filename
                    preset_path = tmp_dir / preset_name
                    preset_download.save_as(str(preset_path))
                    wait_status_contains(page, '저장 완료:', 10000, '기본 프리셋 ZIP 저장 토스트')

                    final_status = page.locator('#statusText').inner_text()
                    browser.close()

                    return {
                        'status': 'ok',
                        'downloaded_file': suggested_name,
                        'download_exists': saved_path.exists(),
                        'download_size': saved_path.stat().st_size if saved_path.exists() else 0,
                        'preset_downloaded_file': preset_name,
                        'preset_download_exists': preset_path.exists(),
                        'preset_download_size': preset_path.stat().st_size if preset_path.exists() else 0,
                        'final_status': final_status,
                    }
                except TimeoutErrorType as error:
                    final_status = page.locator('#statusText').inner_text() if page.locator('#statusText').count() else ''
                    browser.close()
                    return {
                        'status': 'failed',
                        'error_type': 'download_timeout',
                        'error': str(error),
                        'final_status': final_status,
                        'hint': 'export 버튼 클릭 후 다운로드 이벤트가 발생하지 않았습니다.',
                    }
        except TimeoutErrorType as error:
            return {'status': 'failed', 'error_type': 'timeout', 'error': str(error)}
        except Exception as error:  # pragma: no cover
            return {'status': 'failed', 'error_type': 'runtime', 'error': str(error)}


def main() -> None:
    payload = run()
    print(json.dumps(payload, ensure_ascii=False))
    if payload.get('status') != 'ok':
        raise SystemExit(1)


if __name__ == '__main__':
    main()
