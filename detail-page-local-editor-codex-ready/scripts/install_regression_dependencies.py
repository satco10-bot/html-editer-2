from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REQUIREMENTS_FILE = ROOT / 'requirements-regression.txt'


def main() -> None:
    install_cmd = [sys.executable, '-m', 'pip', 'install', '-r', str(REQUIREMENTS_FILE)]
    print(f"[INSTALL] requirements 설치 시작: {' '.join(install_cmd)}")
    subprocess.run(install_cmd, check=True)
    print('[INSTALL] ✅ requirements-regression.txt 설치 완료')
    print(f"[INSTALL] 다음 단계: {sys.executable} scripts/run_phase8_regression_pipeline.py")


if __name__ == '__main__':
    main()
