import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const detectorModule = await import(pathToFileURL(path.join(rootDir, 'src/core/slot-detector.js')).href);
const configModule = await import(pathToFileURL(path.join(rootDir, 'src/config.js')).href);

const { collectSlotCandidates, evaluateCandidate } = detectorModule;
const { SLOT_SCORE_THRESHOLD, SLOT_NEAR_MISS_MIN } = configModule;

function setupDom(html) {
  const dom = new JSDOM(html);
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.Node = dom.window.Node;
  globalThis.HTMLElement = dom.window.HTMLElement;
  return dom;
}

function runDetection(html) {
  const dom = setupDom(html);
  const detection = collectSlotCandidates(dom.window.document, { markDom: false });
  return {
    summary: {
      explicitCount: detection.summary.explicitCount,
      heuristicCount: detection.summary.heuristicCount,
      nearMissCount: detection.summary.nearMissCount,
    },
    detection,
    dom,
  };
}

const matrix = [];

// 1) Explicit selector must be detected 100%
{
  const html = `<!doctype html><body>
    <div data-image-slot="hero"></div>
    <div class="image-slot"></div>
    <section class="drop-slot"></section>
  </body>`;
  const { summary, detection } = runDetection(html);
  const explicitDomCount = detection.candidates.filter((item) => item.type === 'explicit' || item.type === 'manual').length;
  const pass = explicitDomCount === 3 && summary.explicitCount === 3;
  assert.equal(pass, true, 'EXPLICIT_SLOT_SELECTOR target must be detected 100%');
  matrix.push({
    id: 'explicit_selector_100pct',
    pass,
    required: true,
    expected: { explicitCount: 3, heuristicCount: 0, nearMissCount: 0 },
    actual: summary,
  });
}

// 2) Heuristic candidate must pass threshold rule
{
  const html = `<!doctype html><body>
    <div id="hero-candidate" class="hero-media" style="height:320px;border-style: solid;">메인 이미지 삽입부</div>
  </body>`;
  const { summary, dom } = runDetection(html);
  const candidate = dom.window.document.querySelector('#hero-candidate');
  const evalResult = evaluateCandidate(candidate);
  const pass = evalResult.score >= SLOT_SCORE_THRESHOLD && evalResult.qualified && summary.heuristicCount >= 1;
  assert.equal(pass, true, 'Heuristic candidate should be promoted when score >= SLOT_SCORE_THRESHOLD');
  matrix.push({
    id: 'heuristic_threshold_gate',
    pass,
    required: true,
    threshold: SLOT_SCORE_THRESHOLD,
    evaluateCandidate: { score: evalResult.score, qualified: evalResult.qualified },
    actual: summary,
  });
}

// 3) Near miss should stay candidate-only and not promoted
{
  const html = `<!doctype html><body>
    <div id="near-miss" class="layout-shell" style="background-image:url('x.png')">텍스트 영역</div>
  </body>`;
  const { summary, detection, dom } = runDetection(html);
  const candidate = dom.window.document.querySelector('#near-miss');
  const evalResult = evaluateCandidate(candidate);
  const promoted = detection.candidates.some((item) => item.uid === candidate.dataset.nodeUid);
  const listedAsNearMiss = detection.nearMisses.some((item) => item.uid === candidate.dataset.nodeUid);
  const pass = evalResult.nearMiss && !promoted && listedAsNearMiss && summary.nearMissCount >= 1 && summary.heuristicCount === 0;
  assert.equal(pass, true, 'Near miss must appear only in nearMisses list');
  matrix.push({
    id: 'near_miss_not_promoted',
    pass,
    required: true,
    nearMissMin: SLOT_NEAR_MISS_MIN,
    evaluateCandidate: { score: evalResult.score, nearMiss: evalResult.nearMiss },
    actual: summary,
  });
}

// 4) fixture_05 regression gate (required)
{
  const fixturePath = path.join(rootDir, 'data/fixtures/fixture_05_user_melting_cheese_compact.html');
  const html = fs.readFileSync(fixturePath, 'utf-8');
  const { summary } = runDetection(html);
  const expected = { explicitCount: 0, heuristicCount: 13, nearMissCount: 2 };
  const pass = summary.explicitCount === expected.explicitCount
    && summary.heuristicCount === expected.heuristicCount
    && summary.nearMissCount === expected.nearMissCount;
  assert.equal(pass, true, 'fixture_05 regression gate failed');
  matrix.push({
    id: 'fixture_05_regression_gate',
    pass,
    required: true,
    fixture: 'fixture_05_user_melting_cheese_compact.html',
    expected,
    actual: summary,
  });
}

const output = {
  generatedAt: new Date().toISOString(),
  matrix,
  summary: {
    total: matrix.length,
    passed: matrix.filter((item) => item.pass).length,
    failed: matrix.filter((item) => !item.pass).length,
  },
};

const reportPath = path.join(rootDir, 'reports/SLOT_DETECTION_MATRIX_RESULTS.json');
fs.writeFileSync(reportPath, `${JSON.stringify(output, null, 2)}\n`, 'utf-8');
console.log(JSON.stringify(output, null, 2));
