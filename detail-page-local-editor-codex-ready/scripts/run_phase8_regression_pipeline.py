from __future__ import annotations

import datetime as dt
import json
import subprocess
import sys
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
REPORTS_DIR = ROOT / 'reports'
HISTORY_PATH = REPORTS_DIR / 'WEBAPP_PHASE8_PIPELINE_HISTORY.json'

STEPS = [
    ('validate_phase6', ROOT / 'scripts' / 'validate_phase6.py'),
    ('regression_layer_canvas_sync', ROOT / 'scripts' / 'regression_layer_canvas_sync.py'),
]


def run_step(name: str, script_path: Path) -> dict[str, Any]:
    started_at = dt.datetime.now(dt.timezone.utc).isoformat()
    completed = subprocess.run(
        [sys.executable, str(script_path)],
        capture_output=True,
        text=True,
    )
    finished_at = dt.datetime.now(dt.timezone.utc).isoformat()

    payload: dict[str, Any] = {}
    raw_stdout = (completed.stdout or '').strip()
    if raw_stdout:
        try:
            payload = json.loads(raw_stdout)
        except Exception:
            payload = {}

    failure_type = 'none'
    if completed.returncode == 2:
        failure_type = 'dependency_missing'
    elif completed.returncode != 0:
        failure_type = 'scenario_failed'

    step_result = {
        'name': name,
        'script': str(script_path.relative_to(ROOT)),
        'started_at': started_at,
        'finished_at': finished_at,
        'returncode': completed.returncode,
        'failure_type': failure_type,
        'ok': completed.returncode == 0,
        'stdout_tail': (completed.stdout or '').strip()[-1000:],
        'stderr_tail': (completed.stderr or '').strip()[-1000:],
        'payload': payload,
    }
    return step_result


def upsert_history(run_payload: dict[str, Any]) -> None:
    HISTORY_PATH.parent.mkdir(parents=True, exist_ok=True)
    history = {'runs': []}
    if HISTORY_PATH.exists():
        try:
            history = json.loads(HISTORY_PATH.read_text(encoding='utf-8'))
            if not isinstance(history.get('runs'), list):
                history = {'runs': []}
        except Exception:
            history = {'runs': []}
    history['runs'].append(run_payload)
    HISTORY_PATH.write_text(json.dumps(history, ensure_ascii=False, indent=2), encoding='utf-8')


def make_dashboard(summary: dict[str, Any], step_results: list[dict[str, Any]]) -> str:
    lines = [
        '# Phase 8 Regression Pipeline Summary',
        '',
        f"- run_date: {summary['run_date']}",
        f"- overall_status: {'PASS' if summary['ok'] else 'FAIL'}",
        f"- dependency_failures: {summary['dependency_failures']}",
        f"- scenario_failures: {summary['scenario_failures']}",
        f"- f05_gate_passed: {summary['f05_gate_passed']}",
        '',
        '| step | status | failure_type |',
        '|---|---|---|',
    ]
    for step in step_results:
        lines.append(f"| {step['name']} | {'PASS' if step['ok'] else 'FAIL'} | {step['failure_type']} |")

    if not summary['f05_gate_passed']:
        lines.extend(['', '## ⚠️ F05 Gate Alert', '- F05(회귀 금지 fixture)에서 실패가 발생했습니다. 즉시 확인이 필요합니다.'])

    return '\n'.join(lines) + '\n'


def main() -> None:
    run_started_at = dt.datetime.now(dt.timezone.utc)
    step_results: list[dict[str, Any]] = []
    for name, script_path in STEPS:
        result = run_step(name, script_path)
        step_results.append(result)

    regression_payload = next((step.get('payload') for step in step_results if step['name'] == 'regression_layer_canvas_sync'), {}) or {}
    f05_gate_passed = bool(regression_payload.get('summary', {}).get('f05_gate_passed', False))

    dependency_failures = sum(1 for step in step_results if step['failure_type'] == 'dependency_missing')
    scenario_failures = sum(1 for step in step_results if step['failure_type'] == 'scenario_failed')
    overall_ok = all(step['ok'] for step in step_results) and f05_gate_passed

    summary = {
        'run_date': run_started_at.date().isoformat(),
        'started_at': run_started_at.isoformat(),
        'finished_at': dt.datetime.now(dt.timezone.utc).isoformat(),
        'ok': overall_ok,
        'dependency_failures': dependency_failures,
        'scenario_failures': scenario_failures,
        'f05_gate_passed': f05_gate_passed,
    }

    run_payload = {
        'summary': summary,
        'steps': step_results,
    }
    upsert_history(run_payload)

    report_name = f"WEBAPP_PHASE8_PIPELINE_RESULT_{summary['run_date']}.json"
    (REPORTS_DIR / report_name).write_text(json.dumps(run_payload, ensure_ascii=False, indent=2), encoding='utf-8')
    (REPORTS_DIR / 'WEBAPP_PHASE8_PIPELINE_DASHBOARD.md').write_text(make_dashboard(summary, step_results), encoding='utf-8')

    print(json.dumps(run_payload, ensure_ascii=False, indent=2))
    if dependency_failures > 0:
        raise SystemExit(2)
    if not overall_ok:
        raise SystemExit(3)


if __name__ == '__main__':
    main()
