from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from importlib import metadata
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = ROOT / 'reports'
DAILY_PIPELINE_REPORT = REPORTS_DIR / f"WEBAPP_PHASE8_PIPELINE_RESULTS_{datetime.now(timezone.utc).date().isoformat()}.json"
REQUIREMENTS_FILE = ROOT / 'requirements-regression.txt'
INSTALL_SCRIPT = ROOT / 'scripts' / 'install_regression_dependencies.py'
PIPELINE_SCRIPT = ROOT / 'scripts' / 'run_phase8_regression_pipeline.py'
DAILY_RESULT_FILE = REPORTS_DIR / f"WEBAPP_PHASE8_PIPELINE_RESULT_{datetime.now(timezone.utc).date().isoformat()}.json"
HISTORY_FILE = REPORTS_DIR / 'WEBAPP_PHASE8_PIPELINE_HISTORY.json'
DASHBOARD_FILE = REPORTS_DIR / 'WEBAPP_PHASE8_PIPELINE_DASHBOARD.md'


DEPENDENCY_MODULES = [
    ('beautifulsoup4', 'bs4'),
    ('lxml', 'lxml'),
    ('playwright', 'playwright'),
]


def get_single_install_command() -> str:
    return f"{sys.executable} {INSTALL_SCRIPT.relative_to(ROOT)}"


def get_retry_command() -> str:
    return f"{sys.executable} {PIPELINE_SCRIPT.relative_to(ROOT)}"


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
    if f05_gate.get('status') == 'not_run':
        return 'low'
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
    print('[DEPENDENCY] ❌ dependency precheck 실패')
    print(f"[DEPENDENCY] missing_packages: {', '.join(missing) if missing else 'unknown'}")
    print('[DEPENDENCY] 아래 순서대로 실행하세요:')
    print(f"[DEPENDENCY] 1) 설치: {get_single_install_command()}")
    print(f"[DEPENDENCY] 2) 재시도: {get_retry_command()}")


def collect_environment_info() -> dict[str, Any]:
    packages: dict[str, str] = {}
    for package_name, _module_name in DEPENDENCY_MODULES:
        try:
            packages[package_name] = metadata.version(package_name)
        except metadata.PackageNotFoundError:
            packages[package_name] = 'not_installed'
    return {
        'python_version': sys.version.replace('\n', ' ').strip(),
        'python_executable': sys.executable,
        'platform': sys.platform,
        'packages': packages,
    }


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
    fail_steps = sum(1 for step in run_payload['steps'] if step.get('status') == 'FAIL')
    not_run_steps = sum(1 for step in run_payload['steps'] if step.get('status') == 'NOT_RUN')
    dependency_failures = sum(1 for step in run_payload['steps'] if step.get('error_type') == 'dependency_missing')
    scenario_failures = sum(1 for step in run_payload['steps'] if step.get('error_type') == 'scenario_failed')
    runtime_failures = sum(1 for step in run_payload['steps'] if step.get('error_type') == 'runtime_error')
    f05_gate = run_payload.get('f05_gate', {})
    f05_gate_status = f05_gate.get('status', 'failed')
    f05_gate_ok = f05_gate_status == 'passed'
    f05_cause = f05_gate.get('failure_cause', 'none')
    f05_cause_label = {'none': '없음', 'dependency': '의존성', 'scenario': '시나리오', 'runtime': '런타임'}.get(f05_cause, f05_cause)
    quality_low_reasons = run_payload.get('quality_low_reasons', [])
    lines = [
        '# Phase 8 Regression Pipeline Summary',
        '',
        f'- run_date: {run_date}',
        f"- overall_status: {run_payload['summary']['overall_status']}",
        f"- quality_confidence: {run_payload['quality_confidence']}",
        f'- fail_steps: {fail_steps} (실패)',
        f'- not_run_steps: {not_run_steps} (미실행)',
        f'- dependency_failures: {dependency_failures} (🟠)',
        f'- scenario_failures: {scenario_failures} (🔴)',
        f'- runtime_failures: {runtime_failures} (🟣)',
        f'- f05_gate_status: {f05_gate_status}',
        '',
        '| step | status | failure_label | failure_type |',
        '|---|---|---|---|',
    ]
    for step in run_payload['steps']:
        lines.append(
            f"| {step.get('name')} | {step.get('status')} | {_step_failure_label(step)} | {step.get('error_type', 'none')} |",
        )

    if f05_gate_status == 'passed':
        lines.extend(
            [
                '',
                '## ✅ F05 Gate',
                f"- 상태: PASS ({f05_gate.get('message', '')})",
            ],
        )
    elif f05_gate_status == 'not_run':
        lines.extend(
            [
                '',
                '## ⏸️ F05 Gate 미실행',
                f"- 원인 분류: {f05_cause_label}",
                f"- 메시지: {f05_gate.get('message', 'F05 게이트가 실행되지 않았습니다.')}",
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

    lines.extend(
        [
            '',
            '## quality_confidence = low 조건',
            '- dependency precheck 실패(필수 패키지 누락)',
            '- F05 gate 미실행(not_run)',
        ],
    )
    if quality_low_reasons:
        lines.append(f"- 이번 실행 low 사유: {', '.join(quality_low_reasons)}")

    DASHBOARD_FILE.write_text('\n'.join(lines).strip() + '\n', encoding='utf-8')


def main() -> None:
    started_at = datetime.now(timezone.utc).isoformat()

    dependency = check_dependencies()
    environment = collect_environment_info()
    steps: list[dict[str, Any]] = []
    explain_install_guide(dependency)
    dependency_section = {
        'status': 'pass' if dependency['ok'] else 'fail',
        'missing_packages': dependency.get('missing', []),
        'install_command': get_single_install_command(),
        'retry_command': get_retry_command(),
    }
    scenario_section: dict[str, Any]

    if dependency['ok']:
        steps.append({'name': 'dependency_check', 'status': 'PASS', 'error_type': 'none'})
        validate_result = run_json_script('scripts/validate_phase8.py')
        steps.append({'name': 'validate_phase8', 'status': 'PASS' if validate_result['status'] == 'ok' else 'FAIL', 'error_type': validate_result['error_type']})

        regression_result = run_json_script('scripts/regression_layer_canvas_sync.py')
        steps.append({'name': 'regression_layer_canvas_sync', 'status': 'PASS' if regression_result['status'] == 'ok' else 'FAIL', 'error_type': regression_result['error_type']})
        regression_json = regression_result.get('json', {}) if isinstance(regression_result.get('json'), dict) else {}
        f05_gate = regression_json.get(
            'f05_gate',
            {
                'ok': False,
                'status': 'failed',
                'message': 'F05 결과를 찾을 수 없습니다.',
            },
        )
        scenario_section = {
            'status': 'executed',
            'validate_phase8': validate_result['status'],
            'regression_layer_canvas_sync': regression_result['status'],
        }
    else:
        steps.append({'name': 'dependency_check', 'status': 'FAIL', 'missing': dependency['missing'], 'error_type': 'dependency_missing'})
        validate_result = {
            'script': 'scripts/validate_phase8.py',
            'returncode': None,
            'status': 'skipped',
            'error_type': 'not_run',
            'stdout_tail': '',
            'stderr_tail': '',
        }
        regression_result = {
            'script': 'scripts/regression_layer_canvas_sync.py',
            'returncode': None,
            'status': 'skipped',
            'error_type': 'not_run',
            'stdout_tail': '',
            'stderr_tail': '',
        }
        steps.append({'name': 'validate_phase8', 'status': 'NOT_RUN', 'error_type': 'not_run'})
        steps.append({'name': 'regression_layer_canvas_sync', 'status': 'NOT_RUN', 'error_type': 'not_run'})
        f05_gate = {'ok': False, 'status': 'not_run', 'message': '의존성 부족으로 F05 게이트를 실행하지 못했습니다.'}
        scenario_section = {
            'status': 'not_run',
            'reason': 'dependency_precheck_failed',
        }

    if 'status' not in f05_gate:
        f05_gate['status'] = 'passed' if f05_gate.get('ok') else 'failed'

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
    quality_low_reasons: list[str] = []
    if not dependency.get('ok'):
        quality_low_reasons.append('dependency_precheck_failed')
    if f05_gate.get('status') == 'not_run':
        quality_low_reasons.append('f05_gate_not_run')

    pipeline_payload = {
        'started_at': started_at,
        'finished_at': datetime.now(timezone.utc).isoformat(),
        'requirements_file': str(REQUIREMENTS_FILE.relative_to(ROOT)),
        'environment': environment,
        'dependency': dependency,
        'dependency_precheck': dependency_section,
        'scenario_execution': scenario_section,
        'quality_confidence': quality_confidence,
        'quality_low_reasons': quality_low_reasons,
        'steps': steps,
        'f05_gate': f05_gate,
        'validate_phase8': compact_script_result(validate_result),
        'regression_layer_canvas_sync': compact_script_result(regression_result),
        'summary': {
            'overall_status': 'PASS' if overall_ok else 'FAIL',
            'step_pass': sum(1 for step in steps if step['status'] == 'PASS'),
            'step_fail': sum(1 for step in steps if step['status'] == 'FAIL'),
            'step_not_run': sum(1 for step in steps if step['status'] == 'NOT_RUN'),
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
    f05_terminal_status = {'passed': 'PASS', 'failed': 'FAIL', 'not_run': 'NOT_RUN'}.get(f05_gate.get('status', 'failed'), 'FAIL')
    print(f"[F05_GATE] {f05_terminal_status} :: 원인={f05_gate.get('failure_cause', 'none')} :: {f05_gate.get('message', '')}")
    print(json.dumps(pipeline_payload, ensure_ascii=False, indent=2))

    if not dependency['ok']:
        raise SystemExit(2)
    if not f05_gate.get('ok'):
        raise SystemExit(4)
    if not overall_ok:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
