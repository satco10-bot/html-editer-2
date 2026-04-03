from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = ROOT / 'reports'
DAILY_PIPELINE_REPORT = REPORTS_DIR / f"WEBAPP_PHASE8_PIPELINE_RESULTS_{datetime.now(timezone.utc).date().isoformat()}.json"
REQUIREMENTS_FILE = ROOT / 'requirements-regression.txt'


DEPENDENCY_MODULES = [
    ('beautifulsoup4', 'bs4'),
    ('lxml', 'lxml'),
    ('playwright', 'playwright'),
]


def check_dependencies() -> dict[str, Any]:
    missing: list[str] = []
    details: list[dict[str, str]] = []
    for package_name, module_name in DEPENDENCY_MODULES:
        probe = subprocess.run(
            [sys.executable, '-c', f'import {module_name}'],
            capture_output=True,
            text=True,
        )
        ok = probe.returncode == 0
        if not ok:
            missing.append(package_name)
        details.append({
            'package': package_name,
            'module': module_name,
            'ok': 'true' if ok else 'false',
            'error': (probe.stderr or '').strip(),
        })
    return {
        'ok': len(missing) == 0,
        'missing': missing,
        'details': details,
    }


def classify_script_failure(stdout: str, stderr: str, returncode: int) -> str:
    combined = f"{stdout}\n{stderr}".lower()
    if 'modulenotfounderror' in combined or 'dependency_missing' in combined or returncode == 2:
        return 'dependency_missing'
    if 'scenario_failed' in combined or returncode in (1, 4):
        return 'scenario_failed'
    return 'runtime_error'


def run_json_script(script_rel_path: str) -> dict[str, Any]:
    script_path = ROOT / script_rel_path
    proc = subprocess.run([sys.executable, str(script_path)], capture_output=True, text=True)
    stdout = (proc.stdout or '').strip()
    stderr = (proc.stderr or '').strip()

    payload: dict[str, Any] = {
        'script': script_rel_path,
        'returncode': proc.returncode,
        'stdout_tail': stdout[-1200:],
        'stderr_tail': stderr[-1200:],
    }

    parsed = None
    if stdout:
        for line in reversed(stdout.splitlines()):
            line = line.strip()
            if not line:
                continue
            try:
                parsed = json.loads(line)
                break
            except json.JSONDecodeError:
                continue
    if parsed is None and stdout.startswith('{'):
        try:
            parsed = json.loads(stdout)
        except json.JSONDecodeError:
            parsed = None

    if isinstance(parsed, dict):
        payload['json'] = parsed

    if proc.returncode == 0:
        payload['status'] = 'ok'
        payload['error_type'] = 'none'
    else:
        payload['status'] = 'failed'
        payload['error_type'] = classify_script_failure(stdout, stderr, proc.returncode)

    return payload


def compact_script_result(result: dict[str, Any]) -> dict[str, Any]:
    compact = {
        'script': result.get('script'),
        'returncode': result.get('returncode'),
        'status': result.get('status'),
        'error_type': result.get('error_type'),
        'stdout_tail': result.get('stdout_tail'),
        'stderr_tail': result.get('stderr_tail'),
    }
    parsed = result.get('json')
    if isinstance(parsed, dict):
        compact['json_summary'] = {
            'status': parsed.get('status'),
            'error_type': parsed.get('error_type'),
            'summary': parsed.get('summary'),
            'report_path': parsed.get('report_path'),
        }
        if isinstance(parsed.get('f05_gate'), dict):
            compact['json_summary']['f05_gate'] = parsed.get('f05_gate')
    return compact


def save_daily_report(run_payload: dict[str, Any]) -> None:
    existing: dict[str, Any] = {'date': datetime.now(timezone.utc).date().isoformat(), 'runs': []}
    if DAILY_PIPELINE_REPORT.exists():
        try:
            existing = json.loads(DAILY_PIPELINE_REPORT.read_text(encoding='utf-8'))
        except Exception:
            existing = {'date': datetime.now(timezone.utc).date().isoformat(), 'runs': []}
    if not isinstance(existing.get('runs'), list):
        existing['runs'] = []
    existing['runs'].append(run_payload)
    DAILY_PIPELINE_REPORT.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding='utf-8')


def main() -> None:
    started_at = datetime.now(timezone.utc).isoformat()

    dependency = check_dependencies()
    steps: list[dict[str, Any]] = []
    if dependency['ok']:
        steps.append({'name': 'dependency_check', 'status': 'PASS'})
    else:
        steps.append({'name': 'dependency_check', 'status': 'FAIL', 'missing': dependency['missing']})

    validate_result = run_json_script('scripts/validate_phase6.py')
    steps.append({'name': 'validate_phase6', 'status': 'PASS' if validate_result['status'] == 'ok' else 'FAIL', 'error_type': validate_result['error_type']})

    regression_result = run_json_script('scripts/regression_layer_canvas_sync.py')
    steps.append({'name': 'regression_layer_canvas_sync', 'status': 'PASS' if regression_result['status'] == 'ok' else 'FAIL', 'error_type': regression_result['error_type']})

    regression_json = regression_result.get('json', {}) if isinstance(regression_result.get('json'), dict) else {}
    f05_gate = regression_json.get('f05_gate', {'ok': False, 'message': 'F05 결과를 찾을 수 없습니다.'})

    overall_ok = dependency['ok'] and validate_result['status'] == 'ok' and regression_result['status'] == 'ok' and bool(f05_gate.get('ok'))

    pipeline_payload = {
        'started_at': started_at,
        'finished_at': datetime.now(timezone.utc).isoformat(),
        'requirements_file': str(REQUIREMENTS_FILE.relative_to(ROOT)),
        'dependency': dependency,
        'steps': steps,
        'f05_gate': f05_gate,
        'validate_phase6': compact_script_result(validate_result),
        'regression_layer_canvas_sync': compact_script_result(regression_result),
        'summary': {
            'overall_status': 'PASS' if overall_ok else 'FAIL',
            'step_pass': sum(1 for step in steps if step['status'] == 'PASS'),
            'step_fail': sum(1 for step in steps if step['status'] != 'PASS'),
        },
    }

    save_daily_report(pipeline_payload)

    pass_fail_line = f"[PIPELINE] overall={pipeline_payload['summary']['overall_status']} pass={pipeline_payload['summary']['step_pass']} fail={pipeline_payload['summary']['step_fail']}"
    print(pass_fail_line)
    print(f"[F05_GATE] {'PASS' if f05_gate.get('ok') else 'FAIL'} :: {f05_gate.get('message', '')}")
    print(json.dumps(pipeline_payload, ensure_ascii=False, indent=2))

    if not dependency['ok']:
        raise SystemExit(2)
    if not f05_gate.get('ok'):
        raise SystemExit(4)
    if not overall_ok:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
