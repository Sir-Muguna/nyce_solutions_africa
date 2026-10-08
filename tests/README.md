# Acceptance tests

`acceptance.py` runs ~138 checks in headless Chromium (Playwright). It needs a URL and a label:

```bash
pip install playwright && python3 -m playwright install chromium
# modular build, served under a project subpath (serve the PARENT folder):
cd .. && python3 -m http.server 8000 &
python3 tests/acceptance.py http://localhost:8000/nyce-solutions-africa/ repo
# standalone build:
python3 tests/acceptance.py file://$PWD/standalone/nycesolutionssafrica-refactored.html standalone
```

Results and screenshots are written to `./test-output/<label>/`. Latest results: `../docs/TESTING-REPORT.md`.
