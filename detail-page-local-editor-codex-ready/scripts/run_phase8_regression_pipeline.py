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
DAILY_RESULT_FILE = REPORTS_DIR / f"WEBAPP_PHASE8_PIPELINE_RESULT_{datetime.now(timezone.utc).date().isoformat()}.json"
HISTORY_FILE = REPORTS_DIR / 'WEBAPP_PHASE8_PIPELINE_HISTORY.json'
DASHBOARD_FILE = REPORTS_DIR / 'WEBAPP_PHASE8_PIPELINE_DASHBOARD.md'


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


def classify_quality_confidence(dependency: dict[str, Any], steps: list[dict[str, Any]], f05_gate: dict[str, Any]) -> str:
    if not dependency.get('ok'):
        return 'low'
    has_runtime_error = any(step.get('error_type') == 'runtime_error' for step in steps if step.get('status') != 'PASS')
    if has_runtime_error:
        return 'medium'
    if all(step.get('status') == 'PASS' for step in steps) and f05_gate.get('ok'):
        return 'high'
    return 'medium'


def explain_install_guide(dependency: dict[str, Any]) -> None:
    if dependency.get('ok'):
        print('[DEPENDENCY] ✅ 필요한 Python 패키지가 모두 준비되었습니다.')
        return
    missing = dependency.get('missing', [])
    print(f"[DEPENDENCY] ❌ 누락된 패키지: {', '.join(missing) if missing else 'unknown'}")
    print('[DEPENDENCY] 설치 가이드:')
    print(f"  1) python3 -m pip install -r {REQUIREMENTS_FILE.relative_to(ROOT)}")
    print('  2) python3 -m playwright install chromium')
    print('  3) 설치 후 파이프라인을 다시 실행하세요.')


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


def save_result_snapshot(run_payload: dict[str, Any]) -> None:
    snapshot = {
        'summary': run_payload['summary'],
        'quality_confidence': run_payload['quality_confidence'],
        'f05_gate': run_payload['f05_gate'],
        'steps': run_payload['steps'],
    }
    DAILY_RESULT_FILE.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2), encoding='utf-8')


def save_history(run_payload: dict[str, Any]) -> None:
    history: dict[str, Any] = {'runs': []}
    if HISTORY_FILE.exists():
        try:
            history = json.loads(HISTORY_FILE.read_text(encoding='utf-8'))
        except Exception:
            history = {'runs': []}
    if not isinstance(history.get('runs'), list):
        history['runs'] = []
    history['runs'].append(run_payload)
    HISTORY_FILE.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding='utf-8')


def _step_failure_label(step: dict[str, Any]) -> str:
    failure_type = step.get('error_type', 'none')
    if step.get('status') == 'PASS':
        return '🟢 PASS'
    if failure_type == 'dependency_missing':
        return '🟠 DEPENDENCY'
    if failure_type == 'scenario_failed':
        return '🔴 SCENARIO'
    return '🟣 RUNTIME'


def generate_dashboard(run_payload: dict[str, Any]) -> None:
    run_date = datetime.now(timezone.utc).date().isoformat()
    dependency_failures = sum(1 for step in run_payload['steps'] if step.get('error_type') == 'dependency_missing')
    scenario_failures = sum(1 for step in run_payload['steps'] if step.get('error_type') == 'scenario_failed')
    runtime_failures = sum(1 for step in run_payload['steps'] if step.get('error_type') == 'runtime_error')
    f05_gate = run_payload.get('f05_gate', {})
    f05_gate_ok = bool(f05_gate.get('ok'))
    f05_cause = f05_gate.get('failure_cause', 'none')
    f05_cause_label = {'none': '없음', 'dependency': '의존성', 'scenario': '시나리오', 'runtime': '런타임'}.get(f05_cause, f05_cause)
    lines = [
        '# Phase 8 Regression Pipeline Summary',
        '',
        f'- run_date: {run_date}',
        f"- overall_status: {run_payload['summary']['overall_status']}",
        f"- quality_confidence: {run_payload['quality_confidence']}",
        f'- dependency_failures: {dependency_failures} (🟠)',
        f'- scenario_failures: {scenario_failures} (🔴)',
        f'- runtime_failures: {runtime_failures} (🟣)',
        f'- f05_gate_passed: {f05_gate_ok}',
        '',
        '| step | status | failure_label | failure_type |',
        '|---|---|---|---|',
    ]
    for step in run_payload['steps']:
        lines.append(
            f"| {step.get('name')} | {step.get('status')} | {_step_failure_label(step)} | {step.get('error_type', 'none')} |",
        )

    if f05_gate_ok:
        lines.extend(
            [
                '',
                '## ✅ F05 Gate',
                f"- 상태: PASS ({f05_gate.get('message', '')})",
            ],
        )
    else:
        lines.extend(
            [
                '',
                '## ⚠️ F05 Gate Alert',
                f"- 원인 분류: {f05_cause_label}",
                f"- 메시지: {f05_gate.get('message', 'F05 결과를 찾을 수 없습니다.')}",
            ],
        )

    DASHBOARD_FILE.write_text('\n'.join(lines).strip() + '\n', encoding='utf-8')


def main() -> None:
    started_at = datetime.now(timezone.utc).isoformat()

    dependency = check_dependencies()
    steps: list[dict[str, Any]] = []
    explain_install_guide(dependency)
    if dependency['ok']:
        steps.append({'name': 'dependency_check', 'status': 'PASS', 'error_type': 'none'})
        validate_result = run_json_script('scripts/validate_phase6.py')
        steps.append({'name': 'validate_phase6', 'status': 'PASS' if validate_result['status'] == 'ok' else 'FAIL', 'error_type': validate_result['error_type']})

        regression_result = run_json_script('scripts/regression_layer_canvas_sync.py')
        steps.append({'name': 'regression_layer_canvas_sync', 'status': 'PASS' if regression_result['status'] == 'ok' else 'FAIL', 'error_type': regression_result['error_type']})
        regression_json = regression_result.get('json', {}) if isinstance(regression_result.get('json'), dict) else {}
        f05_gate = regression_json.get('f05_gate', {'ok': False, 'message': 'F05 결과를 찾을 수 없습니다.'})
    else:
        steps.append({'name': 'dependency_check', 'status': 'FAIL', 'missing': dependency['missing'], 'error_type': 'dependency_missing'})
        validate_result = {
            'script': 'scripts/validate_phase6.py',
            'returncode': None,
            'status': 'skipped',
            'error_type': 'dependency_missing',
            'stdout_tail': '',
            'stderr_tail': '',
        }
        regression_result = {
            'script': 'scripts/regression_layer_canvas_sync.py',
            'returncode': None,
            'status': 'skipped',
            'error_type': 'dependency_missing',
            'stdout_tail': '',
            'stderr_tail': '',
        }
        steps.append({'name': 'validate_phase6', 'status': 'SKIP', 'error_type': 'dependency_missing'})
        steps.append({'name': 'regression_layer_canvas_sync', 'status': 'SKIP', 'error_type': 'dependency_missing'})
        f05_gate = {'ok': False, 'message': '의존성 부족으로 F05 게이트를 실행하지 못했습니다.'}

    dependency_failures = sum(1 for step in steps if step.get('error_type') == 'dependency_missing')
    scenario_failures = sum(1 for step in steps if step.get('error_type') == 'scenario_failed')
    runtime_failures = sum(1 for step in steps if step.get('error_type') == 'runtime_error')
    if dependency_failures > 0:
        f05_gate['failure_cause'] = 'dependency'
    elif scenario_failures > 0:
        f05_gate['failure_cause'] = 'scenario'
    elif runtime_failures > 0:
        f05_gate['failure_cause'] = 'runtime'
    else:
        f05_gate['failure_cause'] = 'none'

    overall_ok = dependency['ok'] and validate_result['status'] == 'ok' and regression_result['status'] == 'ok' and bool(f05_gate.get('ok'))
    quality_confidence = classify_quality_confidence(dependency, steps, f05_gate)

    pipeline_payload = {
        'started_at': started_at,
        'finished_at': datetime.now(timezone.utc).isoformat(),
        'requirements_file': str(REQUIREMENTS_FILE.relative_to(ROOT)),
        'dependency': dependency,
        'quality_confidence': quality_confidence,
        'steps': steps,
        'f05_gate': f05_gate,
        'validate_phase6': compact_script_result(validate_result),
        'regression_layer_canvas_sync': compact_script_result(regression_result),
        'summary': {
            'overall_status': 'PASS' if overall_ok else 'FAIL',
            'step_pass': sum(1 for step in steps if step['status'] == 'PASS'),
            'step_fail': sum(1 for step in steps if step['status'] != 'PASS'),
            'dependency_failures': dependency_failures,
            'scenario_failures': scenario_failures,
            'runtime_failures': runtime_failures,
        },
    }

    save_daily_report(pipeline_payload)
    save_result_snapshot(pipeline_payload)
    save_history(pipeline_payload)
    generate_dashboard(pipeline_payload)

    pass_fail_line = f"[PIPELINE] overall={pipeline_payload['summary']['overall_status']} pass={pipeline_payload['summary']['step_pass']} fail={pipeline_payload['summary']['step_fail']}"
    print(pass_fail_line)
    print(f"[F05_GATE] {'PASS' if f05_gate.get('ok') else 'FAIL'} :: 원인={f05_gate.get('failure_cause', 'none')} :: {f05_gate.get('message', '')}")
    print(json.dumps(pipeline_payload, ensure_ascii=False, indent=2))

    if not dependency['ok']:
        raise SystemExit(2)
    if not f05_gate.get('ok'):
        raise SystemExit(4)
    if not overall_ok:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
