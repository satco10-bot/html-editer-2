import { BOX_CLASS_RE, EXPLICIT_SLOT_SELECTOR, FRAME_STYLE_ID, PLACEHOLDER_TEXT_RE, TEXTISH_TAGS, TEXT_CLASS_RE } from '../config.js';
import {
  canvasToBlob,
  createDoctypeHtml,
  guessExtensionFromMime,
  nextId,
  parseSrcsetCandidates,
  readBlobAsDataUrl,
  readFileAsDataUrl,
  removeEditorCssClasses,
  sanitizeFilename,
  serializeSrcsetCandidates,
  slugify,
  truncate,
} from '../utils.js';
import { collectSlotCandidates } from '../core/slot-detector.js';
import { createEditorModel, patchModelNode, applyModelNodesToDom } from '../core/editor-model.js';
import { restoreSerializedAssetRefs } from '../core/serialize-layer.js';

const FRAME_CSS_URL_RE = /url\((['"]?)([^"'()]+)\1\)/gi;
const ADD_ELEMENT_PRESETS = {
  text: {
    tagName: 'p',
    className: 'editor-added-text',
    textContent: '새 텍스트',
    style: {
      minHeight: '32px',
      padding: '6px 8px',
      color: '#111827',
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.5',
      background: 'rgba(255,255,255,0.5)',
    },
  },
  box: {
    tagName: 'div',
    className: 'editor-added-box',
    style: {
      width: '220px',
      height: '120px',
      border: '2px solid #93c5fd',
      borderRadius: '12px',
      background: 'rgba(147,197,253,0.2)',
      boxSizing: 'border-box',
    },
  },
  slot: {
    tagName: 'div',
    className: 'editor-added-slot',
    textContent: '[이미지 삽입부]',
    dataset: {
      manualSlot: '1',
      imageSlot: 'new-slot',
      slotLabel: '새 슬롯',
    },
    style: {
      width: '240px',
      height: '160px',
      border: '2px dashed #22c55e',
      borderRadius: '12px',
      color: '#14532d',
      background: 'rgba(220,252,231,0.48)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
    },
  },
};

function isElement(node) {
  return !!node && node.nodeType === Node.ELEMENT_NODE;
}

function closestElement(node) {
  if (isElement(node)) return node;
  return node?.parentElement || null;
}

function buildLabel(element) {
  return (
    element?.getAttribute?.('data-slot-label') ||
    element?.getAttribute?.('data-image-slot') ||
    element?.getAttribute?.('aria-label') ||
    element?.getAttribute?.('alt') ||
    element?.id ||
    (typeof element?.className === 'string' ? element.className : '') ||
    truncate(element?.textContent?.replace(/\s+/g, ' ').trim() || '', 48) ||
    element?.tagName?.toLowerCase?.() ||
    'element'
  );
}

function isTextyElement(element) {
  if (!element || !isElement(element)) return false;
  if (TEXTISH_TAGS.has(element.tagName)) return true;
  const className = typeof element.className === 'string' ? element.className : '';
  const text = (element.textContent || '').replace(/\s+/g, ' ').trim();
  return TEXT_CLASS_RE.test(className) && text.length > 0 && text.length < 240;
}

function isBoxyElement(element) {
  if (!element || !isElement(element)) return false;
  if (element.matches(EXPLICIT_SLOT_SELECTOR) || element.hasAttribute('data-detected-slot')) return false;
  const className = typeof element.className === 'string' ? element.className : '';
  return BOX_CLASS_RE.test(className) || ['DIV', 'SECTION', 'ARTICLE', 'LI'].includes(element.tagName);
}

function shallowDescendantMedia(element) {
  const queue = [{ node: element, depth: 0 }];
  while (queue.length) {
    const { node, depth } = queue.shift();
    if (depth > 2) continue;
    for (const child of Array.from(node.children || [])) {
      if (child.tagName === 'IMG' || child.tagName === 'PICTURE') return { kind: 'img', element: child.tagName === 'IMG' ? child : child.querySelector('img') };
      const style = (child.getAttribute('style') || '').toLowerCase();
      if (style.includes('background-image')) return { kind: 'background', element: child };
      queue.push({ node: child, depth: depth + 1 });
    }
  }
  return null;
}

function hasBackgroundImage(element) {
  const style = (element.getAttribute('style') || '').toLowerCase();
  return style.includes('background-image') || style.includes('background:url(') || style.includes('background: url(');
}

function isSimpleSlotContainer(element) {
  const children = Array.from(element.children || []);
  if (!children.length) return true;
  return children.every((child) => ['BR', 'IMG'].includes(child.tagName));
}

function setInlineStyle(element, patch) {
  const styleMap = new Map();
  const current = element.getAttribute('style') || '';
  for (const raw of current.split(';')) {
    const [key, ...rest] = raw.split(':');
    if (!key || !rest.length) continue;
    styleMap.set(key.trim().toLowerCase(), rest.join(':').trim());
  }
  for (const [key, value] of Object.entries(patch)) {
    if (value == null || value === '') styleMap.delete(String(key).toLowerCase());
    else styleMap.set(String(key).toLowerCase(), String(value));
  }
  const next = Array.from(styleMap.entries()).map(([key, value]) => `${key}: ${value}`).join('; ');
  if (next) element.setAttribute('style', next);
  else element.removeAttribute('style');
  if (element?.dataset) {
    if (next) element.dataset.exportStyle = next;
    else element.removeAttribute('data-export-style');
  }
  return next;
}

function encodeData(value) {
  return encodeURIComponent(String(value ?? ''));
}

function decodeData(value) {
  try {
    return decodeURIComponent(String(value || ''));
  } catch {
    return String(value || '');
  }
}

function stripTransientRuntime(doc) {
  doc.getElementById(FRAME_STYLE_ID)?.remove();
  for (const runtimeNode of Array.from(doc.querySelectorAll('[data-editor-runtime="1"]'))) runtimeNode.remove();
  for (const element of Array.from(doc.querySelectorAll('*'))) {
    const nextClass = removeEditorCssClasses(element.getAttribute('class') || '');
    if (nextClass) element.setAttribute('class', nextClass);
    else element.removeAttribute('class');
    element.removeAttribute('contenteditable');
    element.removeAttribute('spellcheck');
    element.removeAttribute('data-detected-slot');
    element.removeAttribute('data-detected-slot-label');
    element.removeAttribute('data-detected-slot-score');
    element.removeAttribute('data-detected-slot-reasons');
    element.removeAttribute('data-slot-near-miss');
  }
}

function stripFinalEditorRuntime(doc) {
  stripTransientRuntime(doc);
  for (const element of Array.from(doc.querySelectorAll('*'))) {
    for (const attr of Array.from(element.attributes)) {
      const name = attr.name;
      if (name.startsWith('data-export-')) element.removeAttribute(name);
      if (name.startsWith('data-editor-')) element.removeAttribute(name);
      if (name.startsWith('data-normalized-')) element.removeAttribute(name);
      if (name.startsWith('data-original-')) element.removeAttribute(name);
      if (name === 'data-last-applied-file-name') element.removeAttribute(name);
    }
  }
}

function ensureFrameStyle(doc) {
  if (doc.getElementById(FRAME_STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = FRAME_STYLE_ID;
  style.textContent = `
    [data-detected-slot] { position: relative; }
    [data-detected-slot="explicit"], [data-detected-slot="manual"] {
      outline: 2px solid rgba(47, 109, 246, 0.92);
      outline-offset: -2px;
    }
    [data-detected-slot="heuristic"] {
      outline: 2px dashed rgba(15, 159, 110, 0.92);
      outline-offset: -2px;
    }
    [data-slot-near-miss] {
      box-shadow: inset 0 0 0 2px rgba(217, 119, 6, 0.32);
    }
    [data-detected-slot]::after {
      content: attr(data-detected-slot) ' · ' attr(data-detected-slot-label);
      position: absolute;
      left: 8px;
      top: 8px;
      z-index: 999999;
      max-width: calc(100% - 16px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 999px;
      background: rgba(255,255,255,0.95);
      color: #10213a;
      border: 1px solid rgba(16,33,58,0.18);
      box-shadow: 0 8px 20px rgba(16,33,58,0.12);
      padding: 4px 8px;
      font: 700 11px/1.35 Pretendard, Noto Sans KR, sans-serif;
      pointer-events: none;
    }
    .__phase5_selected_slot {
      outline: 3px solid rgba(220, 38, 38, 0.96) !important;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.14) inset;
    }
    .__phase5_selected_text {
      outline: 3px solid rgba(16, 185, 129, 0.96) !important;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.14) inset;
    }
    .__phase5_selected_box {
      outline: 3px solid rgba(37, 99, 235, 0.96) !important;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.14) inset;
    }
    .__phase5_selected_multi {
      outline: 2px dashed rgba(139, 92, 246, 0.96) !important;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12) inset;
    }
    .__phase5_drop_hover {
      outline: 3px dashed rgba(37, 99, 235, 0.98) !important;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12) inset;
    }
    .__phase5_runtime_image {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: 50% 50%;
      user-select: none;
      -webkit-user-drag: none;
    }
    .__phase5_text_editing {
      outline: 3px solid rgba(245, 158, 11, 0.96) !important;
      box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.16) inset;
      caret-color: #111827;
      background: rgba(255,255,255,0.02);
    }
    .__phase6_locked_outline {
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.24) inset;
    }
    .__phase6_marquee_box {
      position: fixed;
      left: 0;
      top: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 999997;
      border: 1px dashed rgba(37, 99, 235, 0.94);
      background: rgba(59, 130, 246, 0.12);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.4) inset;
      display: none;
    }
    .__phase6_snap_line_x, .__phase6_snap_line_y {
      position: fixed;
      pointer-events: none;
      z-index: 999996;
      display: none;
      background: rgba(14, 165, 233, 0.92);
      box-shadow: 0 0 0 1px rgba(255,255,255,0.35);
    }
    .__phase6_snap_line_x { width: 1px; top: 0; bottom: 0; }
    .__phase6_snap_line_y { height: 1px; left: 0; right: 0; }
    .__phase6_dragging_cursor, .__phase6_dragging_cursor * {
      cursor: grabbing !important;
      user-select: none !important;
    }
  `;
  doc.head.appendChild(style);
}


export function createFrameEditor({
  iframe,
  project,
  selectionMode = 'smart',
  initialSnapshot = null,
  onStateChange = () => {},
  onStatus = () => {},
  onMutation = () => {},
  onShortcut = () => {},
}) {
  const win = iframe.contentWindow;
  const doc = iframe.contentDocument;
  ensureFrameStyle(doc);

  let destroyed = false;
  let currentSelectionMode = initialSnapshot?.selectionMode || selectionMode;
  let detection = { candidates: [], nearMisses: [], summary: { totalCount: 0, nearMissCount: 0 } };
  let slotMap = new Map();
  let selectedElements = [];
  let selectedElement = null;
  let selectedInfo = null;
  let hoverSlot = null;
  let editingTextElement = null;
  let editingTextOriginalHtml = '';
  let dragState = null;
  let resizeState = null;
  let suppressClickUntil = 0;
  let overlayNodes = null;
  const slotBackupMap = new Map();
  const modifiedSlots = new Set();
  const editorModel = createEditorModel(doc);
  let lastCommittedSnapshot = initialSnapshot?.html ? { ...initialSnapshot } : null;

  function uniqueConnectedElements(items) {
    const seen = new Set();
    const result = [];
    for (const element of items || []) {
      if (!element || !element.isConnected) continue;
      const uid = element.dataset?.nodeUid || nextId('node');
      element.dataset.nodeUid = uid;
      if (seen.has(uid)) continue;
      seen.add(uid);
      result.push(element);
    }
    return result;
  }

  function placeholderTextValue(element) {
    return [
      element?.getAttribute?.('data-slot-label') || '',
      element?.getAttribute?.('aria-label') || '',
      element?.getAttribute?.('title') || '',
      element?.getAttribute?.('alt') || '',
      element?.textContent || '',
    ].join(' ').replace(/\s+/g, ' ').trim();
  }

  function isSectionLike(element) {
    if (!element || !isElement(element)) return false;
    const className = typeof element.className === 'string' ? element.className : '';
    return element.tagName === 'SECTION' || /(^|\s)(hero|section|hb-info-wrap|page)(\s|$)/i.test(className);
  }

  function isHiddenElement(element) {
    return !!element && isElement(element) && (element.dataset.editorHidden === '1' || !!element.closest?.('[data-editor-hidden="1"]'));
  }

  function isLockedElement(element) {
    return !!element && isElement(element) && (element.dataset.editorLocked === '1' || !!element.closest?.('[data-editor-locked="1"]'));
  }

  function ensureOverlayNodes() {
    if (overlayNodes) return overlayNodes;
    const marquee = doc.createElement('div');
    marquee.className = '__phase6_marquee_box';
    marquee.dataset.editorRuntime = '1';
    const lineX = doc.createElement('div');
    lineX.className = '__phase6_snap_line_x';
    lineX.dataset.editorRuntime = '1';
    const lineY = doc.createElement('div');
    lineY.className = '__phase6_snap_line_y';
    lineY.dataset.editorRuntime = '1';
    const resizeBox = doc.createElement('div');
    resizeBox.className = '__phase7_resize_box';
    resizeBox.dataset.editorRuntime = '1';
    resizeBox.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;display:none;z-index:999998;border:1px solid rgba(14,165,233,0.95);pointer-events:none;box-shadow:0 0 0 1px rgba(255,255,255,0.55)';
    const handles = {};
    for (const corner of ['nw', 'ne', 'sw', 'se']) {
      const handle = doc.createElement('button');
      handle.type = 'button';
      handle.className = '__phase7_resize_handle';
      handle.dataset.editorRuntime = '1';
      handle.dataset.resizeCorner = corner;
      handle.style.cssText = 'position:fixed;width:12px;height:12px;border-radius:999px;border:2px solid #fff;background:#0ea5e9;z-index:999999;display:none;padding:0;cursor:nwse-resize';
      if (corner === 'ne' || corner === 'sw') handle.style.cursor = 'nesw-resize';
      handles[corner] = handle;
    }
    doc.body.append(marquee, lineX, lineY, resizeBox, handles.nw, handles.ne, handles.sw, handles.se);
    overlayNodes = { marquee, lineX, lineY, resizeBox, handles };
    return overlayNodes;
  }

  function hideInteractionOverlay() {
    const nodes = ensureOverlayNodes();
    nodes.marquee.style.display = 'none';
    nodes.lineX.style.display = 'none';
    nodes.lineY.style.display = 'none';
    doc.documentElement.classList.remove('__phase6_dragging_cursor');
    doc.body.classList.remove('__phase6_dragging_cursor');
  }

  function hideResizeOverlay() {
    const nodes = ensureOverlayNodes();
    nodes.resizeBox.style.display = 'none';
    for (const handle of Object.values(nodes.handles)) handle.style.display = 'none';
  }

  function updateResizeOverlay() {
    const target = selectedElement;
    if (!target || !target.isConnected || selectedElements.length !== 1 || editingTextElement || isHiddenElement(target)) {
      hideResizeOverlay();
      return;
    }
    const rect = target.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      hideResizeOverlay();
      return;
    }
    const nodes = ensureOverlayNodes();
    const box = nodes.resizeBox;
    box.style.display = 'block';
    box.style.left = `${rect.left}px`;
    box.style.top = `${rect.top}px`;
    box.style.width = `${rect.width}px`;
    box.style.height = `${rect.height}px`;

    const map = {
      nw: { x: rect.left, y: rect.top },
      ne: { x: rect.right, y: rect.top },
      sw: { x: rect.left, y: rect.bottom },
      se: { x: rect.right, y: rect.bottom },
    };
    for (const [corner, handle] of Object.entries(nodes.handles)) {
      const point = map[corner];
      handle.style.display = 'block';
      handle.style.left = `${point.x - 6}px`;
      handle.style.top = `${point.y - 6}px`;
    }
  }

  function showMarqueeRect(rect) {
    const nodes = ensureOverlayNodes();
    nodes.marquee.style.display = 'block';
    nodes.marquee.style.left = `${rect.left}px`;
    nodes.marquee.style.top = `${rect.top}px`;
    nodes.marquee.style.width = `${Math.max(0, rect.width)}px`;
    nodes.marquee.style.height = `${Math.max(0, rect.height)}px`;
  }

  function showSnapLines({ x = null, y = null } = {}) {
    const nodes = ensureOverlayNodes();
    nodes.lineX.style.display = Number.isFinite(x) ? 'block' : 'none';
    nodes.lineY.style.display = Number.isFinite(y) ? 'block' : 'none';
    if (Number.isFinite(x)) nodes.lineX.style.left = `${x}px`;
    if (Number.isFinite(y)) nodes.lineY.style.top = `${y}px`;
  }

  function normalizeClientRect(startX, startY, endX, endY) {
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const right = Math.max(startX, endX);
    const bottom = Math.max(startY, endY);
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }

  function rectIntersects(a, b) {
    return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
  }

  function unionRect(records) {
    if (!records?.length) return null;
    const left = Math.min(...records.map((item) => item.left));
    const top = Math.min(...records.map((item) => item.top));
    const right = Math.max(...records.map((item) => item.right));
    const bottom = Math.max(...records.map((item) => item.bottom));
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }

  function collectInteractiveLayers() {
    const root = doc.querySelector('.page') || doc.body;
    const items = [];
    function walk(parent, depth) {
      for (const child of Array.from(parent.children || [])) {
        if (!child.dataset.nodeUid) child.dataset.nodeUid = nextId('node');
        const expose = shouldExposeLayer(child, depth);
        if (expose && !isHiddenElement(child)) items.push(child);
        if (depth < 4) walk(child, expose ? depth + 1 : depth);
      }
    }
    walk(root, 0);
    return items;
  }

  function buildSnapCandidates(excludedUids = new Set()) {
    return collectInteractiveLayers()
      .filter((element) => !excludedUids.has(element.dataset.nodeUid) && !isLockedElement(element) && !isHiddenElement(element))
      .map((element) => ({ element, rect: element.getBoundingClientRect() }))
      .filter((item) => item.rect.width > 0 && item.rect.height > 0);
  }

  function computeSnapAdjustment(box, dx, dy, candidates) {
    const tolerance = 8;
    const movingX = [box.left + dx, box.left + box.width / 2 + dx, box.right + dx];
    const movingY = [box.top + dy, box.top + box.height / 2 + dy, box.bottom + dy];
    let bestX = { diff: tolerance + 1, guide: null, adjust: 0 };
    let bestY = { diff: tolerance + 1, guide: null, adjust: 0 };

    for (const candidate of candidates) {
      const rect = candidate.rect;
      const targetX = [rect.left, rect.left + rect.width / 2, rect.right];
      const targetY = [rect.top, rect.top + rect.height / 2, rect.bottom];
      for (const line of targetX) {
        for (const current of movingX) {
          const diff = line - current;
          if (Math.abs(diff) < Math.abs(bestX.diff) && Math.abs(diff) <= tolerance) bestX = { diff, guide: line, adjust: diff };
        }
      }
      for (const line of targetY) {
        for (const current of movingY) {
          const diff = line - current;
          if (Math.abs(diff) < Math.abs(bestY.diff) && Math.abs(diff) <= tolerance) bestY = { diff, guide: line, adjust: diff };
        }
      }
    }

    return {
      dx: dx + (Number.isFinite(bestX.adjust) ? bestX.adjust : 0),
      dy: dy + (Number.isFinite(bestY.adjust) ? bestY.adjust : 0),
      guideX: Number.isFinite(bestX.guide) ? bestX.guide : null,
      guideY: Number.isFinite(bestY.guide) ? bestY.guide : null,
      snappedX: Number.isFinite(bestX.guide),
      snappedY: Number.isFinite(bestY.guide),
    };
  }

  function layerTypeOf(element) {
    if (!element || !isElement(element)) return 'box';
    if (element.hasAttribute('data-detected-slot') || element.matches(EXPLICIT_SLOT_SELECTOR) || element.dataset.manualSlot === '1') return 'slot';
    if (isTextyElement(element)) return 'text';
    if (isSectionLike(element)) return 'section';
    return 'box';
  }

  function shouldExposeLayer(element, depth = 0) {
    if (!element || !isElement(element)) return false;
    if (['IMG', 'SOURCE', 'SCRIPT', 'STYLE', 'META', 'LINK'].includes(element.tagName)) return false;
    const type = layerTypeOf(element);
    if (type === 'slot' || type === 'text' || type === 'section') return true;
    const className = typeof element.className === 'string' ? element.className : '';
    if (depth <= 1 && isBoxyElement(element)) return true;
    return depth <= 2 && /(card|wrap|holder|group|item|content|body|box|visual|thumb|media|title|desc|question|answer)/i.test(className);
  }

  function buildLayerTree() {
    const root = doc.querySelector('.page') || doc.body;
    const items = [];
    const selectedUids = new Set(selectedElements.map((element) => element.dataset.nodeUid));

    function walk(parent, depth) {
      for (const child of Array.from(parent.children || [])) {
        if (!child.dataset.nodeUid) child.dataset.nodeUid = nextId('node');
        const expose = shouldExposeLayer(child, depth);
        if (expose) {
          items.push({
            uid: child.dataset.nodeUid,
            label: buildLabel(child),
            type: layerTypeOf(child),
            tagName: child.tagName.toLowerCase(),
            depth,
            childCount: child.children?.length || 0,
            selected: selectedUids.has(child.dataset.nodeUid),
            hidden: child.dataset.editorHidden === '1',
            locked: child.dataset.editorLocked === '1',
          });
        }
        if (depth < 4) walk(child, expose ? depth + 1 : depth);
      }
    }

    walk(root, 0);
    return items.slice(0, 400);
  }

  function rgbToHex(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    if (raw.startsWith('#')) {
      if (raw.length === 4) return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`.toLowerCase();
      return raw.toLowerCase();
    }
    const match = raw.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
    if (!match) return '';
    const toHex = (num) => Number(num).toString(16).padStart(2, '0');
    return `#${toHex(match[1])}${toHex(match[2])}${toHex(match[3])}`;
  }

  function formatNumberString(value, precision = 2) {
    const num = Number.parseFloat(value);
    if (!Number.isFinite(num)) return '';
    const rounded = Number(num.toFixed(precision));
    return String(rounded);
  }

  function getTextTargets() {
    const targets = selectedElements.filter((element) => selectionTypeOf(element) === 'text');
    if (targets.length) return targets;
    if (selectedElement && selectionTypeOf(selectedElement) === 'text') return [selectedElement];
    return [];
  }

  function getTextStyleState() {
    const targets = getTextTargets();
    if (!targets.length) return { enabled: false, targetCount: 0 };
    const styles = targets.map((element) => win.getComputedStyle(element));
    const pick = (getter) => {
      const first = getter(styles[0]);
      return styles.every((style) => getter(style) === first) ? first : '';
    };
    const fontSize = pick((style) => formatNumberString(style.fontSize, 2).replace(/\.0+$/, ''));
    const lineHeight = pick((style) => {
      const fs = Number.parseFloat(style.fontSize || '0');
      const lh = Number.parseFloat(style.lineHeight || '0');
      if (!Number.isFinite(fs) || !Number.isFinite(lh) || !fs) return '';
      return formatNumberString(lh / fs, 2);
    });
    const letterSpacing = pick((style) => {
      const fs = Number.parseFloat(style.fontSize || '0');
      const ls = Number.parseFloat(style.letterSpacing || '0');
      if (!Number.isFinite(fs) || !fs || !Number.isFinite(ls)) return '';
      return formatNumberString(ls / fs, 3);
    });
    return {
      enabled: true,
      targetCount: targets.length,
      fontSize,
      lineHeight,
      letterSpacing,
      fontWeight: pick((style) => String(style.fontWeight || '')),
      color: pick((style) => rgbToHex(style.color || '')),
      textAlign: pick((style) => String(style.textAlign || '')),
    };
  }

  function getDerivedMeta() {
    const selectedItems = selectedElements.map((element) => buildSelectionInfo(element)).filter(Boolean);
    const layerTree = buildLayerTree();
    return {
      selected: selectedInfo,
      selectedItems,
      selectionCount: selectedItems.length,
      slots: detection.candidates,
      nearMisses: detection.nearMisses,
      slotSummary: detection.summary,
      modifiedSlotCount: modifiedSlots.size,
      selectionMode: currentSelectionMode,
      textEditing: !!editingTextElement,
      hiddenCount: layerTree.filter((item) => item.hidden).length,
      lockedCount: layerTree.filter((item) => item.locked).length,
      interaction: dragState ? { mode: dragState.mode, moved: !!dragState.moved } : null,
      layerTree,
      textStyle: getTextStyleState(),
      preflight: buildPreflightReport(),
    };
  }

  function emitState() {
    updateResizeOverlay();
    onStateChange(getDerivedMeta());
  }

  function refreshDerivedMeta() {
    emitState();
  }

  function emitMutation(label) {
    const before = lastCommittedSnapshot || captureSnapshot('before-command');
    const after = captureSnapshot(label);
    lastCommittedSnapshot = after;
    onMutation({ type: 'command', id: nextId('cmd'), label, before, after, modelVersion: editorModel.version, at: new Date().toISOString() });
  }

  function getElementByUid(uid) {
    if (!uid) return null;
    return doc.querySelector(`[data-node-uid="${uid}"]`);
  }

  function getSelectedSlotElement() {
    const current = selectedElement;
    if (current && (current.hasAttribute('data-detected-slot') || current.matches(EXPLICIT_SLOT_SELECTOR))) return current;
    if (current) {
      const match = current.closest?.('[data-detected-slot], [data-image-slot], .image-slot, .drop-slot');
      if (match) return match;
    }
    return selectedElements.find((element) => element.hasAttribute('data-detected-slot') || element.matches(EXPLICIT_SLOT_SELECTOR)) || null;
  }

  function selectionTypeOf(element) {
    if (!element) return '';
    if (element.hasAttribute('data-detected-slot') || element.matches(EXPLICIT_SLOT_SELECTOR) || element.dataset.manualSlot === '1') return 'slot';
    if (isTextyElement(element)) return 'text';
    return 'box';
  }

  function buildSelectionInfo(element) {
    if (!element) return null;
    const detectedType = element.getAttribute('data-detected-slot') || (element.matches(EXPLICIT_SLOT_SELECTOR) ? 'explicit' : '');
    const score = Number(element.getAttribute('data-detected-slot-score') || 0) || (detectedType ? 999 : 0);
    const reasons = (element.getAttribute('data-detected-slot-reasons') || '').split('|').map((item) => item.trim()).filter(Boolean);
    return {
      uid: element.dataset.nodeUid || '',
      type: selectionTypeOf(element),
      label: buildLabel(element),
      detectedType,
      score,
      reasons,
      tagName: element.tagName.toLowerCase(),
      hidden: element.dataset.editorHidden === '1',
      locked: isLockedElement(element),
      textEditing: editingTextElement === element,
    };
  }

  function clearSelectionClasses() {
    for (const element of Array.from(doc.querySelectorAll('.__phase5_selected_slot, .__phase5_selected_text, .__phase5_selected_box, .__phase5_selected_multi'))) {
      element.classList.remove('__phase5_selected_slot', '__phase5_selected_text', '__phase5_selected_box', '__phase5_selected_multi');
    }
  }

  function syncSelectionInfo() {
    selectedElements = uniqueConnectedElements(selectedElements);
    selectedElement = selectedElements[0] || null;
    selectedInfo = buildSelectionInfo(selectedElement);
  }

  function applySelectionClasses() {
    selectedElements.forEach((element, index) => {
      if (!element) return;
      if (index === 0) {
        const type = selectionTypeOf(element);
        element.classList.add(type === 'slot' ? '__phase5_selected_slot' : type === 'text' ? '__phase5_selected_text' : '__phase5_selected_box');
      } else {
        element.classList.add('__phase5_selected_multi');
      }
    });
  }

  function selectElements(nextElements, { silent = false } = {}) {
    clearSelectionClasses();
    selectedElements = uniqueConnectedElements(nextElements);
    syncSelectionInfo();
    applySelectionClasses();
    if (!silent) emitState();
  }

  function selectElement(element, { silent = false, additive = false, toggle = false } = {}) {
    if (!element) {
      if (!additive) selectElements([], { silent });
      return;
    }
    if (!additive) return selectElements([element], { silent });
    const current = uniqueConnectedElements(selectedElements);
    const uid = element.dataset.nodeUid || nextId('node');
    element.dataset.nodeUid = uid;
    const exists = current.some((item) => item.dataset.nodeUid === uid);
    if (exists && toggle) {
      const next = current.filter((item) => item.dataset.nodeUid !== uid);
      return selectElements(next, { silent });
    }
    const next = [element, ...current.filter((item) => item.dataset.nodeUid !== uid)];
    return selectElements(next, { silent });
  }

  function clearHover() {
    if (hoverSlot) hoverSlot.classList.remove('__phase5_drop_hover');
    hoverSlot = null;
  }

  function resolveSelectionTarget(rawTarget) {
    const target = closestElement(rawTarget);
    if (!target || ['HTML', 'BODY'].includes(target.tagName)) return null;
    if (isLockedElement(target)) return null;
    const slotTarget = target.closest?.('[data-detected-slot], [data-image-slot], .image-slot, .drop-slot') || null;
    if (currentSelectionMode === 'image') return slotTarget || target;
    if (currentSelectionMode === 'text') {
      const textTarget = target.closest?.('h1, h2, h3, h4, h5, h6, p, span, small, strong, em, b, i, u, li, td, th, label, a, button, blockquote') || (isTextyElement(target) ? target : null);
      return textTarget || slotTarget || target;
    }
    if (currentSelectionMode === 'box') {
      if (slotTarget) return slotTarget;
      let cursor = target;
      while (cursor && !['BODY', 'HTML'].includes(cursor.tagName)) {
        if (isBoxyElement(cursor)) return cursor;
        cursor = cursor.parentElement;
      }
      return target;
    }
    return slotTarget || (isTextyElement(target) ? target : null) || target;
  }

  function rememberSlotBackup(slot) {
    const uid = slot.dataset.nodeUid || nextId('node');
    slot.dataset.nodeUid = uid;
    if (slotBackupMap.has(uid)) return uid;
    const backup = { innerHTML: slot.innerHTML, style: slot.getAttribute('style') || '' };
    slotBackupMap.set(uid, backup);
    slot.dataset.editorBackupHtml = encodeData(backup.innerHTML);
    slot.dataset.editorBackupStyle = encodeData(backup.style);
    return uid;
  }

  function getPersistedBackup(slot) {
    const uid = slot?.dataset?.nodeUid || '';
    if (!uid) return null;
    if (slotBackupMap.has(uid)) return slotBackupMap.get(uid);
    if (!slot.hasAttribute('data-editor-backup-html') && !slot.hasAttribute('data-editor-backup-style')) return null;
    const backup = {
      innerHTML: decodeData(slot.dataset.editorBackupHtml || ''),
      style: decodeData(slot.dataset.editorBackupStyle || ''),
    };
    slotBackupMap.set(uid, backup);
    return backup;
  }

  function rehydratePersistentState() {
    slotBackupMap.clear();
    modifiedSlots.clear();
    for (const element of Array.from(doc.querySelectorAll('[data-editor-backup-html], [data-editor-backup-style]'))) {
      if (!element.dataset.nodeUid) continue;
      slotBackupMap.set(element.dataset.nodeUid, {
        innerHTML: decodeData(element.dataset.editorBackupHtml || ''),
        style: decodeData(element.dataset.editorBackupStyle || ''),
      });
    }
    for (const element of Array.from(doc.querySelectorAll('[data-editor-modified="1"]'))) {
      if (element.dataset.nodeUid) modifiedSlots.add(element.dataset.nodeUid);
    }
  }

  function redetect({ preserveSelectionUid = '', preserveSelectionUids = null } = {}) {
    const keepUids = preserveSelectionUids || selectedElements.map((element) => element.dataset.nodeUid).filter(Boolean) || [];
    detection = collectSlotCandidates(doc, { markDom: true });
    slotMap = new Map(detection.candidates.map((item) => [item.uid, item]));
    const refreshedModel = createEditorModel(doc);
    editorModel.nodes.clear();
    for (const [uid, node] of refreshedModel.nodes.entries()) editorModel.nodes.set(uid, node);
    editorModel.version = refreshedModel.version;
    const keepElements = uniqueConnectedElements(keepUids.map((uid) => getElementByUid(uid)));
    if (keepElements.length) selectElements(keepElements, { silent: true });
    else if (preserveSelectionUid || initialSnapshot?.selectedUid) {
      const keepElement = getElementByUid(preserveSelectionUid || initialSnapshot?.selectedUid || '');
      if (keepElement) selectElements([keepElement], { silent: true });
      else selectElements([], { silent: true });
    } else {
      syncSelectionInfo();
      applySelectionClasses();
    }
    emitState();
  }

  function setSelectionMode(mode) {
    currentSelectionMode = mode || 'smart';
    emitState();
    onStatus(`선택 우선 모드: ${currentSelectionMode}`);
  }

  function setElementHidden(element, hidden) {
    if (!element) return false;
    const uid = element.dataset.nodeUid || nextId('node');
    element.dataset.nodeUid = uid;
    if (!element.hasAttribute('data-editor-base-display')) element.dataset.editorBaseDisplay = encodeData(element.style.display || '');
    if (hidden) element.dataset.editorHidden = '1';
    else element.removeAttribute('data-editor-hidden');
    const baseDisplay = decodeData(element.dataset.editorBaseDisplay || '');
    patchModelNode(editorModel, uid, { style: { display: hidden ? 'none' : (baseDisplay && baseDisplay !== 'none' ? baseDisplay : null) } });
    applyModelNodesToDom(doc, editorModel, [uid]);
    element.dataset.editorModified = '1';
    modifiedSlots.add(uid);
    return true;
  }

  function setElementLocked(element, locked) {
    if (!element) return false;
    const uid = element.dataset.nodeUid || nextId('node');
    element.dataset.nodeUid = uid;
    if (locked) element.dataset.editorLocked = '1';
    else element.removeAttribute('data-editor-locked');
    patchModelNode(editorModel, uid, {});
    element.dataset.editorModified = '1';
    modifiedSlots.add(uid);
    return true;
  }

  function toggleSelectedHidden() {
    const targets = uniqueConnectedElements(selectedElements);
    if (!targets.length) return { ok: false, message: '먼저 레이어를 선택해 주세요.' };
    const nextHidden = targets.some((element) => element.dataset.editorHidden !== '1');
    targets.forEach((element) => setElementHidden(element, nextHidden));
    emitState();
    emitMutation(nextHidden ? 'hide-layer' : 'show-layer');
    return { ok: true, message: nextHidden ? `선택 레이어 ${targets.length}개를 숨겼습니다.` : `선택 레이어 ${targets.length}개를 다시 표시했습니다.` };
  }

  function toggleSelectedLocked() {
    const targets = uniqueConnectedElements(selectedElements);
    if (!targets.length) return { ok: false, message: '먼저 레이어를 선택해 주세요.' };
    const nextLocked = targets.some((element) => element.dataset.editorLocked !== '1');
    targets.forEach((element) => setElementLocked(element, nextLocked));
    emitState();
    emitMutation(nextLocked ? 'lock-layer' : 'unlock-layer');
    return { ok: true, message: nextLocked ? `선택 레이어 ${targets.length}개를 잠갔습니다.` : `선택 레이어 ${targets.length}개 잠금을 해제했습니다.` };
  }

  function toggleLayerHiddenByUid(uid) {
    const element = getElementByUid(uid);
    if (!element) return { ok: false, message: '레이어를 찾지 못했습니다.' };
    selectElements([element], { silent: true });
    return toggleSelectedHidden();
  }

  function toggleLayerLockedByUid(uid) {
    const element = getElementByUid(uid);
    if (!element) return { ok: false, message: '레이어를 찾지 못했습니다.' };
    selectElements([element], { silent: true });
    return toggleSelectedLocked();
  }

  function findSlotMediaTarget(slot) {
    const shallow = shallowDescendantMedia(slot);
    if (shallow?.kind === 'img' && shallow.element) return shallow;
    if (slot.dataset.slotMode === 'background') return { kind: 'background', element: slot };
    if (hasBackgroundImage(slot) && !isSimpleSlotContainer(slot)) return { kind: 'background', element: slot };
    if (shallow?.kind === 'background' && shallow.element && !isSimpleSlotContainer(slot)) return shallow;
    return { kind: 'img', element: slot.querySelector('img.__phase5_runtime_image, img') || null };
  }

  function clearSimplePlaceholder(slot) {
    if (!isSimpleSlotContainer(slot)) return;
    slot.innerHTML = '';
  }

  async function applyFileToSlot(slot, file, { emit = true } = {}) {
    if (!slot || !file || isLockedElement(slot)) return false;
    rememberSlotBackup(slot);
    const uid = slot.dataset.nodeUid;
    const dataUrl = await readFileAsDataUrl(file);
    const target = findSlotMediaTarget(slot);

    if (target.kind === 'background') {
      const styleTarget = target.element || slot;
      const nextStyle = setInlineStyle(styleTarget, {
        'background-image': `url("${dataUrl}")`,
        'background-size': 'cover',
        'background-position': 'center center',
        'background-repeat': 'no-repeat',
      });
      styleTarget.dataset.editorStyleModified = '1';
      styleTarget.dataset.exportStyle = nextStyle;
      slot.dataset.editorModified = '1';
    } else {
      let img = target.element;
      if (!img || !img.isConnected || img === slot) {
        clearSimplePlaceholder(slot);
        img = doc.createElement('img');
        img.className = '__phase5_runtime_image';
        slot.appendChild(img);
      }
      img.classList.add('__phase5_runtime_image');
      img.setAttribute('src', dataUrl);
      img.dataset.exportSrc = dataUrl;
      img.dataset.editorImageModified = '1';
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      setInlineStyle(img, {
        width: '100%',
        height: '100%',
        display: 'block',
        'object-fit': 'cover',
        'object-position': '50% 50%',
      });
      setInlineStyle(slot, { overflow: 'hidden' });
      slot.dataset.editorModified = '1';
    }

    modifiedSlots.add(uid);
    slot.dataset.lastAppliedFileName = file.name;
    if (emit) {
      selectElements([slot], { silent: true });
      emitState();
      onStatus(`이미지를 적용했습니다: ${file.name}`);
      emitMutation('apply-image');
    }
    return true;
  }

  async function applyFilesStartingAtSlot(slot, files) {
    const imageFiles = Array.from(files || []).filter((file) => /^image\//i.test(file.type || '') || /\.(png|jpe?g|gif|webp|bmp|svg|avif)$/i.test(file.name || ''));
    if (!slot || !imageFiles.length) return 0;
    const slots = detection.candidates.map((item) => getElementByUid(item.uid)).filter(Boolean);
    const start = Math.max(0, slots.indexOf(slot));
    let applied = 0;
    for (let index = 0; index < imageFiles.length && start + index < slots.length; index += 1) {
      // eslint-disable-next-line no-await-in-loop
      await applyFileToSlot(slots[start + index], imageFiles[index], { emit: false });
      applied += 1;
    }
    selectElements([slot], { silent: true });
    emitState();
    onStatus(applied > 1 ? `${applied}개 이미지를 순차 배치했습니다.` : `이미지를 적용했습니다: ${imageFiles[0].name}`);
    emitMutation(applied > 1 ? 'apply-multiple-images' : 'apply-image');
    return applied;
  }

  function applyImagePreset(preset) {
    const slot = getSelectedSlotElement();
    if (!slot) return { ok: false, message: '먼저 이미지 슬롯을 선택해 주세요.' };
    const target = findSlotMediaTarget(slot);
    if (target.kind === 'background') {
      const position = preset === 'top' ? 'center top' : preset === 'bottom' ? 'center bottom' : 'center center';
      const size = preset === 'contain' ? 'contain' : 'cover';
      const nextStyle = setInlineStyle(target.element || slot, {
        'background-size': size,
        'background-position': position,
        'background-repeat': 'no-repeat',
      });
      (target.element || slot).dataset.editorStyleModified = '1';
      (target.element || slot).dataset.exportStyle = nextStyle;
      slot.dataset.editorModified = '1';
      modifiedSlots.add(slot.dataset.nodeUid);
      emitState();
      emitMutation(`preset-${preset}`);
      return { ok: true, message: `배경 이미지 프리셋 적용: ${preset}` };
    }

    const img = target.element || slot.querySelector('img');
    if (!img) return { ok: false, message: '슬롯 안에 이미지가 없습니다.' };
    const objectPosition = preset === 'top' ? '50% 0%' : preset === 'bottom' ? '50% 100%' : '50% 50%';
    const objectFit = preset === 'contain' ? 'contain' : 'cover';
    setInlineStyle(img, {
      width: '100%',
      height: '100%',
      display: 'block',
      'object-fit': objectFit,
      'object-position': objectPosition,
    });
    img.dataset.editorImageModified = '1';
    img.dataset.exportSrc = img.getAttribute('src') || img.dataset.exportSrc || '';
    slot.dataset.editorModified = '1';
    modifiedSlots.add(slot.dataset.nodeUid);
    emitState();
    emitMutation(`preset-${preset}`);
    return { ok: true, message: `이미지 프리셋 적용: ${preset}` };
  }

  function removeImageFromSelected() {
    const slot = getSelectedSlotElement();
    if (!slot) return { ok: false, message: '먼저 이미지 슬롯을 선택해 주세요.' };
    if (isLockedElement(slot)) return { ok: false, message: '잠긴 레이어는 이미지를 복구/제거할 수 없습니다.' };
    const uid = slot.dataset.nodeUid;
    const backup = getPersistedBackup(slot);
    if (!backup) return { ok: false, message: '복구할 원본 상태가 없습니다.' };
    slot.innerHTML = backup.innerHTML;
    if (backup.style) slot.setAttribute('style', backup.style);
    else slot.removeAttribute('style');
    slot.removeAttribute('data-export-style');
    slot.removeAttribute('data-editor-modified');
    slot.removeAttribute('data-last-applied-file-name');
    modifiedSlots.delete(uid);
    selectElements([slot], { silent: true });
    redetect({ preserveSelectionUids: [uid] });
    emitMutation('remove-image');
    return { ok: true, message: '슬롯 이미지를 원래 상태로 복구했습니다.' };
  }

  function markSelectedAsSlot() {
    if (!selectedElement) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
    if (isLockedElement(selectedElement)) return { ok: false, message: '잠긴 레이어는 슬롯 지정할 수 없습니다.' };
    selectedElement.dataset.manualSlot = '1';
    selectedElement.removeAttribute('data-slot-ignore');
    if (!selectedElement.getAttribute('data-image-slot')) selectedElement.setAttribute('data-image-slot', slugify(buildLabel(selectedElement) || selectedElement.dataset.nodeUid || 'slot'));
    if (!selectedElement.getAttribute('data-slot-label')) selectedElement.setAttribute('data-slot-label', buildLabel(selectedElement));
    redetect({ preserveSelectionUids: [selectedElement.dataset.nodeUid] });
    emitMutation('mark-manual-slot');
    return { ok: true, message: '선택 요소를 수동 이미지 슬롯으로 지정했습니다.' };
  }

  function demoteSelectedSlot() {
    if (!selectedElement) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
    if (isLockedElement(selectedElement)) return { ok: false, message: '잠긴 레이어는 슬롯 해제할 수 없습니다.' };
    selectedElement.dataset.slotIgnore = '1';
    selectedElement.removeAttribute('data-manual-slot');
    redetect({ preserveSelectionUids: [selectedElement.dataset.nodeUid] });
    emitMutation('ignore-slot');
    return { ok: true, message: '선택 요소를 슬롯 감지 대상에서 제외했습니다.' };
  }

  function placeCaretAtEnd(element) {
    const range = doc.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const selection = win.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function isTextEditableTarget(element) {
    return !!element && selectionTypeOf(element) === 'text';
  }

  function startTextEdit(element = selectedElement) {
    if (!isTextEditableTarget(element)) return { ok: false, message: '텍스트 요소를 먼저 선택해 주세요.' };
    if (isLockedElement(element)) return { ok: false, message: '잠긴 레이어는 텍스트 편집할 수 없습니다.' };
    if (editingTextElement && editingTextElement !== element) finishTextEdit({ commit: true, emit: false });
    if (editingTextElement === element) return { ok: true, message: '이미 텍스트 편집 중입니다.' };
    editingTextElement = element;
    editingTextOriginalHtml = element.innerHTML;
    element.contentEditable = 'true';
    element.spellcheck = false;
    element.classList.add('__phase5_text_editing');
    selectElements([element], { silent: true });
    element.focus({ preventScroll: true });
    placeCaretAtEnd(element);
    emitState();
    return { ok: true, message: '텍스트 편집을 시작했습니다. Ctrl/Cmd+Enter로 저장, Esc로 취소합니다.' };
  }

  function finishTextEdit({ commit = true, emit = true } = {}) {
    if (!editingTextElement) return { ok: false, message: '현재 텍스트 편집 중이 아닙니다.' };
    const element = editingTextElement;
    const changed = element.innerHTML !== editingTextOriginalHtml;
    if (!commit) element.innerHTML = editingTextOriginalHtml;
    element.removeAttribute('contenteditable');
    element.removeAttribute('spellcheck');
    element.classList.remove('__phase5_text_editing');
    editingTextElement = null;
    editingTextOriginalHtml = '';
    if (element.dataset.nodeUid) modifiedSlots.add(element.dataset.nodeUid);
    selectElements([element], { silent: true });
    emitState();
    if (emit && commit && changed) emitMutation('text-edit');
    return { ok: true, message: !commit ? '텍스트 편집을 취소했습니다.' : changed ? '텍스트 수정을 저장했습니다.' : '텍스트 변경사항이 없습니다.' };
  }

  function toggleTextEdit() {
    if (editingTextElement) return finishTextEdit({ commit: true });
    return startTextEdit(selectedElement);
  }

  function readTransformState(element) {
    if (!element.dataset.editorBaseTransform) {
      const current = element.style.transform || '';
      const parsed = parseTranslateFromTransform(current);
      element.dataset.editorBaseTransform = encodeData(parsed.base);
      element.dataset.editorTx = String(parsed.tx);
      element.dataset.editorTy = String(parsed.ty);
    }
    return {
      base: decodeData(element.dataset.editorBaseTransform || ''),
      tx: Number.parseFloat(element.dataset.editorTx || '0') || 0,
      ty: Number.parseFloat(element.dataset.editorTy || '0') || 0,
    };
  }

  function parseTranslateFromTransform(transformText) {
    const value = String(transformText || '').trim();
    if (!value || value === 'none') return { base: '', tx: 0, ty: 0 };
    const match = value.match(/translate\(\s*([-+]?\d*\.?\d+)px\s*,\s*([-+]?\d*\.?\d+)px\s*\)\s*$/i);
    if (!match) return { base: value, tx: 0, ty: 0 };
    const tx = Number.parseFloat(match[1]) || 0;
    const ty = Number.parseFloat(match[2]) || 0;
    const base = value.slice(0, match.index).trim();
    return { base, tx, ty };
  }

  function writeTransformState(element, tx, ty) {
    const state = readTransformState(element);
    element.dataset.editorTx = String(Number(tx.toFixed(3)));
    element.dataset.editorTy = String(Number(ty.toFixed(3)));
    const translate = (tx || ty) ? `translate(${Number(tx.toFixed(3))}px, ${Number(ty.toFixed(3))}px)` : '';
    const base = state.base && state.base !== 'none' ? state.base : '';
    const nextTransform = [base, translate].filter(Boolean).join(' ').trim();
    const uid = element.dataset.nodeUid || nextId('node');
    element.dataset.nodeUid = uid;
    patchModelNode(editorModel, uid, {
      bounds: { x: Number(tx.toFixed(3)), y: Number(ty.toFixed(3)) },
      style: { transform: nextTransform || null },
    });
    applyModelNodesToDom(doc, editorModel, [uid]);
    element.dataset.editorModified = '1';
  }

  function shiftElementBy(element, dx, dy) {
    const state = readTransformState(element);
    writeTransformState(element, state.tx + dx, state.ty + dy);
    if (element.dataset.nodeUid) modifiedSlots.add(element.dataset.nodeUid);
  }

  function elementGeometry(element) {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    const state = readTransformState(element);
    return {
      x: Math.round(state.tx),
      y: Math.round(state.ty),
      w: Math.max(1, Math.round(rect.width)),
      h: Math.max(1, Math.round(rect.height)),
    };
  }

  function selectionHudState() {
    const geometry = elementGeometry(selectedElement);
    if (!selectedElement || !geometry) return null;
    const siblings = selectedElement.parentElement
      ? Array.from(selectedElement.parentElement.children).filter((node) => node.nodeType === 1)
      : [];
    const index = siblings.indexOf(selectedElement);
    return {
      ...geometry,
      layerIndexFromBack: index >= 0 ? index + 1 : 0,
      layerTotal: siblings.length,
    };
  }

  function applyGeometryPatch(patch = {}) {
    const target = selectedElement;
    if (!target) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
    if (isLockedElement(target)) return { ok: false, message: '잠긴 요소는 편집할 수 없습니다.' };
    if (Number.isFinite(patch.w) || Number.isFinite(patch.h)) {
      const uid = target.dataset.nodeUid || nextId('node');
      target.dataset.nodeUid = uid;
      const boundsPatch = {};
      const stylePatch = {};
      if (Number.isFinite(patch.w)) {
        boundsPatch.width = Math.max(8, patch.w);
        stylePatch.width = `${Math.max(8, patch.w)}px`;
      }
      if (Number.isFinite(patch.h)) {
        boundsPatch.height = Math.max(8, patch.h);
        stylePatch.height = `${Math.max(8, patch.h)}px`;
      }
      patchModelNode(editorModel, uid, {
        bounds: boundsPatch,
        style: stylePatch,
      });
      applyModelNodesToDom(doc, editorModel, [uid]);
    }
    const state = readTransformState(target);
    const nextX = Number.isFinite(patch.x) ? patch.x : state.tx;
    const nextY = Number.isFinite(patch.y) ? patch.y : state.ty;
    writeTransformState(target, nextX, nextY);
    target.dataset.editorModified = '1';
    if (target.dataset.nodeUid) modifiedSlots.add(target.dataset.nodeUid);
    emitState();
    emitMutation('geometry-patch');
    return { ok: true, message: '선택 요소의 XYWH를 적용했습니다.' };
  }

  function duplicateSelected() {
    const targets = uniqueConnectedElements(selectedElements);
    if (!targets.length) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
    const createdUids = [];
    for (const target of targets) {
      if (!target.isConnected || target === doc.body || target.tagName === 'HTML' || target.tagName === 'BODY') continue;
      const clone = target.cloneNode(true);
      clone.dataset.nodeUid = nextId('node');
      clone.removeAttribute('id');
      target.after(clone);
      const state = readTransformState(target);
      writeTransformState(clone, state.tx + 10, state.ty + 10);
      clone.dataset.editorModified = '1';
      modifiedSlots.add(clone.dataset.nodeUid);
      createdUids.push(clone.dataset.nodeUid);
    }
    if (!createdUids.length) return { ok: false, message: '복제할 수 있는 요소가 없습니다.' };
    redetect({ preserveSelectionUids: createdUids });
    emitMutation('duplicate');
    return {
      ok: true,
      message: createdUids.length > 1
        ? `선택 요소 ${createdUids.length}개를 복제했습니다.`
        : '선택 요소를 복제했습니다.',
    };
  }

  function deleteSelected() {
    return deleteSelection({
      selectedElements: () => uniqueConnectedElements(selectedElements),
      doc,
      redetect,
      emitMutation,
    });
  }

  function addElement(kind) {
    const preset = ADD_ELEMENT_PRESETS[kind];
    if (!preset) return { ok: false, message: '지원하지 않는 추가 요소 타입입니다.' };
    const parent = selectedElement?.parentElement || doc.querySelector('.page') || doc.body;
    if (!parent) return { ok: false, message: '요소를 추가할 위치를 찾지 못했습니다.' };
    const element = doc.createElement(preset.tagName || 'div');
    element.dataset.nodeUid = nextId('node');
    element.className = preset.className || '';
    if (preset.textContent) element.textContent = preset.textContent;
    for (const [key, value] of Object.entries(preset.dataset || {})) element.dataset[key] = value;
    setInlineStyle(element, preset.style || {});
    parent.appendChild(element);
    writeTransformState(element, 24, 24);
    element.dataset.editorModified = '1';
    modifiedSlots.add(element.dataset.nodeUid);
    redetect({ preserveSelectionUids: [element.dataset.nodeUid] });
    emitMutation(`add-${kind}`);
    return { ok: true, message: `${kind === 'text' ? '텍스트' : kind === 'box' ? '박스' : '이미지 슬롯'}를 추가했습니다.` };
  }

  function moveElementToLayerIndex(element, nextIndex) {
    if (!element?.parentElement) return false;
    const parent = element.parentElement;
    const siblings = Array.from(parent.children);
    const currentIndex = siblings.indexOf(element);
    if (currentIndex < 0) return false;
    const clampedIndex = Math.max(0, Math.min(siblings.length - 1, nextIndex));
    if (clampedIndex === currentIndex) return false;
    siblings.splice(currentIndex, 1);
    siblings.splice(clampedIndex, 0, element);
    for (const child of siblings) parent.appendChild(child);
    return true;
  }

  function applyLayerIndexCommand(command = 'forward') {
    const target = selectedElement;
    if (!target || !target.parentElement) return { ok: false, message: '먼저 요소를 선택해 주세요.' };
    const siblings = Array.from(target.parentElement.children);
    const currentIndex = siblings.indexOf(target);
    if (currentIndex < 0) return { ok: false, message: '레이어 순서를 계산하지 못했습니다.' };
    const commandToIndex = {
      forward: currentIndex + 1,
      backward: currentIndex - 1,
      front: siblings.length - 1,
      back: 0,
    };
    if (!Object.prototype.hasOwnProperty.call(commandToIndex, command)) {
      return { ok: false, message: '지원하지 않는 레이어 명령입니다.' };
    }
    const moved = moveElementToLayerIndex(target, commandToIndex[command]);
    if (!moved) {
      const isFront = currentIndex === siblings.length - 1;
      const blockedByEdge = (command === 'forward' || command === 'front') ? isFront : currentIndex === 0;
      return { ok: false, message: blockedByEdge ? ((command === 'forward' || command === 'front') ? '이미 가장 앞 레이어입니다.' : '이미 가장 뒤 레이어입니다.') : '레이어 순서를 변경하지 못했습니다.' };
    }
    target.dataset.editorModified = '1';
    if (target.dataset.nodeUid) modifiedSlots.add(target.dataset.nodeUid);
    emitState();
    emitMutation(`layer-index-${command}`);
    const messageMap = {
      forward: '선택 요소를 한 단계 앞으로 보냈습니다.',
      backward: '선택 요소를 한 단계 뒤로 보냈습니다.',
      front: '선택 요소를 맨 앞으로 보냈습니다.',
      back: '선택 요소를 맨 뒤로 보냈습니다.',
    };
    return { ok: true, message: messageMap[command] || '레이어 순서를 변경했습니다.' };
  }

  function nudgeSelectedElements(dx = 0, dy = 0) {
    const targets = uniqueConnectedElements(selectedElements).filter((element) => !isLockedElement(element));
    if (!targets.length) return { ok: false, message: '먼저 잠기지 않은 요소를 선택해 주세요.' };
    for (const element of targets) shiftElementBy(element, dx, dy);
    emitState();
    emitMutation('nudge-selection');
    return { ok: true, message: `선택 요소 ${targets.length}개를 ${dx}, ${dy}만큼 이동했습니다.` };
  }

  function nudgeImagePosition(dx = 0, dy = 0) {
    const slot = getSelectedSlotElement();
    if (!slot) return { ok: false, message: '먼저 이미지 슬롯을 선택해 주세요.' };
    const img = slot.querySelector('img');
    if (!img) return { ok: false, message: '슬롯 안에 이미지가 없습니다.' };
    const style = win.getComputedStyle(img);
    const [oxRaw = '50%', oyRaw = '50%'] = String(style.objectPosition || '50% 50%').split(/\s+/);
    const ox = Number.parseFloat(oxRaw) || 50;
    const oy = Number.parseFloat(oyRaw) || 50;
    const nextX = Math.max(0, Math.min(100, ox + dx));
    const nextY = Math.max(0, Math.min(100, oy + dy));
    setInlineStyle(img, { objectPosition: `${nextX}% ${nextY}%` });
    if (img.dataset.nodeUid) modifiedSlots.add(img.dataset.nodeUid);
    emitState();
    emitMutation('image-nudge');
    return { ok: true, message: `이미지 위치를 ${dx || 0}, ${dy || 0}만큼 미세 조정했습니다.` };
  }

  function applyBatchLayout(action) {
    const targets = uniqueConnectedElements(selectedElements).filter((element) => !isLockedElement(element));
    if (!targets.length) return { ok: false, message: '먼저 잠기지 않은 요소를 선택해 주세요.' };
    if (action !== 'reset-transform' && targets.length < 2) return { ok: false, message: '정렬/간격 작업은 2개 이상 선택해야 합니다.' };
    const records = targets.map((element) => ({ element, rect: element.getBoundingClientRect() }));
    const anchor = records[0];

    if (action === 'same-width' || action === 'same-height' || action === 'same-size') {
      for (const record of records.slice(1)) {
        const patch = {};
        if (action === 'same-width' || action === 'same-size') patch.width = `${Math.round(anchor.rect.width)}px`;
        if (action === 'same-height' || action === 'same-size') patch.height = `${Math.round(anchor.rect.height)}px`;
        setInlineStyle(record.element, patch);
        record.element.dataset.editorModified = '1';
        if (record.element.dataset.nodeUid) modifiedSlots.add(record.element.dataset.nodeUid);
      }
      emitState();
      emitMutation(action);
      return { ok: true, message: `선택 요소 ${records.length}개에 ${action} 작업을 적용했습니다.` };
    }

    if (action === 'reset-transform') {
      for (const record of records) {
        writeTransformState(record.element, 0, 0);
      }
      emitState();
      emitMutation(action);
      return { ok: true, message: '선택 요소의 배치 이동을 초기화했습니다.' };
    }

    if (action.startsWith('align-')) {
      const anchorRect = anchor.rect;
      for (const record of records.slice(1)) {
        let dx = 0;
        let dy = 0;
        if (action === 'align-left') dx = anchorRect.left - record.rect.left;
        if (action === 'align-center') dx = (anchorRect.left + anchorRect.width / 2) - (record.rect.left + record.rect.width / 2);
        if (action === 'align-right') dx = (anchorRect.left + anchorRect.width) - (record.rect.left + record.rect.width);
        if (action === 'align-top') dy = anchorRect.top - record.rect.top;
        if (action === 'align-middle') dy = (anchorRect.top + anchorRect.height / 2) - (record.rect.top + record.rect.height / 2);
        if (action === 'align-bottom') dy = (anchorRect.top + anchorRect.height) - (record.rect.top + record.rect.height);
        shiftElementBy(record.element, dx, dy);
      }
      emitState();
      emitMutation(action);
      return { ok: true, message: `선택 요소 ${records.length}개를 정렬했습니다.` };
    }

    if (action === 'distribute-horizontal' || action === 'distribute-vertical') {
      if (records.length < 3) return { ok: false, message: '분배는 3개 이상 선택해야 합니다.' };
      const sorted = [...records].sort((a, b) => action === 'distribute-horizontal' ? a.rect.left - b.rect.left : a.rect.top - b.rect.top);
      if (action === 'distribute-horizontal') {
        const span = (sorted.at(-1).rect.left + sorted.at(-1).rect.width) - sorted[0].rect.left;
        const totalWidth = sorted.reduce((sum, record) => sum + record.rect.width, 0);
        const gap = (span - totalWidth) / (sorted.length - 1);
        let cursor = sorted[0].rect.left;
        for (const record of sorted) {
          const dx = cursor - record.rect.left;
          shiftElementBy(record.element, dx, 0);
          cursor += record.rect.width + gap;
        }
      } else {
        const span = (sorted.at(-1).rect.top + sorted.at(-1).rect.height) - sorted[0].rect.top;
        const totalHeight = sorted.reduce((sum, record) => sum + record.rect.height, 0);
        const gap = (span - totalHeight) / (sorted.length - 1);
        let cursor = sorted[0].rect.top;
        for (const record of sorted) {
          const dy = cursor - record.rect.top;
          shiftElementBy(record.element, 0, dy);
          cursor += record.rect.height + gap;
        }
      }
      emitState();
      emitMutation(action);
      return { ok: true, message: `선택 요소 ${records.length}개를 균등 분배했습니다.` };
    }

    return { ok: false, message: '지원하지 않는 정렬 액션입니다.' };
  }

  function applyTextStyle(patch = {}, { clear = false } = {}) {
    const targets = getTextTargets().filter((element) => !isLockedElement(element));
    if (!targets.length) return { ok: false, message: '텍스트 요소를 먼저 선택해 주세요.' };
    for (const element of targets) {
      const stylePatch = {};
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'fontSize')) stylePatch['font-size'] = clear ? null : (patch.fontSize ? `${patch.fontSize}px` : null);
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'lineHeight')) stylePatch['line-height'] = clear ? null : (patch.lineHeight ? String(patch.lineHeight) : null);
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'letterSpacing')) stylePatch['letter-spacing'] = clear ? null : (patch.letterSpacing ? `${patch.letterSpacing}em` : null);
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'fontWeight')) stylePatch['font-weight'] = clear ? null : (patch.fontWeight || null);
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'color')) stylePatch.color = clear ? null : (patch.color || null);
      if (clear || Object.prototype.hasOwnProperty.call(patch, 'textAlign')) stylePatch['text-align'] = clear ? null : (patch.textAlign || null);
      setInlineStyle(element, stylePatch);
      element.dataset.editorModified = '1';
      if (element.dataset.nodeUid) modifiedSlots.add(element.dataset.nodeUid);
    }
    emitState();
    emitMutation(clear ? 'clear-text-style' : 'apply-text-style');
    return { ok: true, message: clear ? `텍스트 ${targets.length}개의 인라인 스타일을 비웠습니다.` : `텍스트 ${targets.length}개에 스타일을 적용했습니다.` };
  }

  function inspectSlot(slot, slotRecord) {
    const target = findSlotMediaTarget(slot);
    let hasMedia = false;
    let unresolved = false;
    if (target.kind === 'background') {
      const styleValue = (target.element || slot).getAttribute('style') || '';
      hasMedia = /url\(/i.test(styleValue);
      unresolved = !!(target.element || slot).dataset.normalizedUnresolvedImage || /%EB%AF%B8%ED%95%B4%EA%B2%B0|미해결/i.test(styleValue);
    } else {
      const img = target.element || slot.querySelector('img');
      const src = img?.getAttribute('src') || '';
      hasMedia = !!src;
      unresolved = !!img?.dataset?.normalizedUnresolvedImage || /%EB%AF%B8%ED%95%B4%EA%B2%B0|미해결/i.test(src);
    }
    const placeholder = PLACEHOLDER_TEXT_RE.test(placeholderTextValue(slot));
    const explicitEmpty = ['explicit', 'manual'].includes(slotRecord?.type || '') && !hasMedia;
    return { hasMedia, unresolved, placeholder, explicitEmpty };
  }

  function classifyAssetPath(value) {
    const text = String(value || '').trim();
    if (!text) return 'empty';
    if (text.startsWith('uploaded:')) return 'uploaded';
    if (text.startsWith('blob:')) return 'blob';
    if (text.startsWith('data:')) return 'data';
    if (/^https?:\/\//i.test(text) || text.startsWith('//')) return 'remote';
    if (text.startsWith('#')) return 'fragment';
    if (/^[a-z][a-z0-9+.-]*:/i.test(text)) return 'custom';
    if (text.startsWith('/')) return 'absolute';
    return 'relative';
  }

  function buildPathPreservationSignals() {
    const images = Array.from(doc.querySelectorAll('img'));
    let preservedCount = 0;
    let driftCount = 0;
    let trackedCount = 0;
    let editedBlobCount = 0;
    const exportKinds = new Set();

    for (const img of images) {
      const originalRef = img.dataset.originalSrc || img.getAttribute('src') || '';
      const editedRef = img.dataset.exportSrc || img.dataset.originalSrc || img.getAttribute('src') || '';
      const originalKind = classifyAssetPath(originalRef);
      const editedKind = classifyAssetPath(editedRef);
      exportKinds.add(editedKind);
      if (editedKind === 'blob') editedBlobCount += 1;
      if (!['uploaded', 'relative'].includes(originalKind)) continue;
      trackedCount += 1;
      if (originalKind === editedKind || editedKind === 'data') preservedCount += 1;
      else driftCount += 1;
    }

    return {
      trackedCount,
      preservedCount,
      driftCount,
      editedBlobCount,
      exportKinds: Array.from(exportKinds).sort(),
    };
  }

  function buildPreflightReport() {
    const checks = [];
    const addCheck = (level, code, title, message, count = 0) => checks.push({ level, code, title, message, count });
    const emptySlots = [];
    for (const slotRecord of detection.candidates) {
      const slot = getElementByUid(slotRecord.uid);
      if (!slot || slot.dataset.slotIgnore === '1' || isHiddenElement(slot)) continue;
      const result = inspectSlot(slot, slotRecord);
      if (result.unresolved) {
        // handled below via project assets, keep slot-level info implicit
      }
      if ((result.placeholder && !result.hasMedia) || result.explicitEmpty) {
        emptySlots.push(slotRecord);
      }
    }

    if (emptySlots.length) {
      addCheck('error', 'EMPTY_SLOT', '빈 슬롯', `플레이스홀더만 남아 있거나 실제 이미지가 없는 슬롯이 ${emptySlots.length}개 있습니다.`, emptySlots.length);
    }
    if (project?.summary?.assetsUnresolved) {
      addCheck('error', 'UNRESOLVED_ASSET', '미해결 자산', `정규화 단계에서 연결하지 못한 자산이 ${project.summary.assetsUnresolved}개 있습니다. 폴더 import로 다시 연결하는 편이 안전합니다.`, project.summary.assetsUnresolved);
    }
    if (project?.remoteStylesheets?.length) {
      addCheck('warning', 'REMOTE_STYLESHEET', '원격 폰트/스타일', `원격 stylesheet ${project.remoteStylesheets.length}개가 포함되어 있어 PNG export에서 폰트가 달라질 수 있습니다.`, project.remoteStylesheets.length);
    }
    if (editingTextElement) {
      addCheck('warning', 'TEXT_EDITING', '텍스트 편집 중', '아직 저장되지 않은 텍스트 편집이 열려 있습니다. Enter 또는 텍스트 편집 버튼으로 저장 후 export하는 편이 안전합니다.', 1);
    }
    if (detection.nearMisses?.length) {
      addCheck('info', 'NEAR_MISS', '근접 후보', `자동 슬롯 감지 근접 후보가 ${detection.nearMisses.length}개 있습니다. 수동 슬롯 지정으로 보정할 수 있습니다.`, detection.nearMisses.length);
    }
    const pathSignals = buildPathPreservationSignals();
    if (pathSignals.trackedCount > 0) {
      if (pathSignals.driftCount > 0) {
        addCheck('error', 'PATH_SAVE_REOPEN_DRIFT', '경로 보존 실패(저장/재오픈)', `uploaded: 또는 상대경로 이미지 ${pathSignals.driftCount}개가 저장 경로에서 다른 스킴으로 바뀔 수 있습니다.`, pathSignals.driftCount);
      } else {
        addCheck('info', 'PATH_SAVE_REOPEN_OK', '경로 보존 확인(저장/재오픈)', `uploaded:·상대경로 추적 대상 ${pathSignals.trackedCount}개가 현재 저장 규칙과 충돌하지 않습니다.`, pathSignals.trackedCount);
      }
    }
    if (pathSignals.editedBlobCount > 0) {
      addCheck('warning', 'PATH_EXPORT_BLOB', 'export 전 blob 경로 감지', `현재 편집 상태에 blob URL ${pathSignals.editedBlobCount}개가 있습니다. export 시 data URL 치환 경로를 점검하세요.`, pathSignals.editedBlobCount);
    } else {
      addCheck('info', 'PATH_EXPORT_READY', 'export 경로 준비', `현재 export 대상 경로 스킴: ${pathSignals.exportKinds.join(', ') || 'none'}.`, pathSignals.exportKinds.length);
    }
    const fixtureContract = project?.fixtureMeta?.slot_contract || null;
    if (fixtureContract?.required_exact_count != null && detection.summary.totalCount !== fixtureContract.required_exact_count) {
      addCheck('warning', 'FIXTURE_SLOT_COUNT', 'Fixture 슬롯 수 차이', `현재 슬롯 수 ${detection.summary.totalCount}개가 fixture 기준 ${fixtureContract.required_exact_count}개와 다릅니다.`, Math.abs(detection.summary.totalCount - fixtureContract.required_exact_count));
    } else if (fixtureContract?.required_min_count != null && detection.summary.totalCount < fixtureContract.required_min_count) {
      addCheck('warning', 'FIXTURE_SLOT_MIN', 'Fixture 최소 슬롯 미달', `현재 슬롯 수 ${detection.summary.totalCount}개가 fixture 최소 ${fixtureContract.required_min_count}개보다 적습니다.`, fixtureContract.required_min_count - detection.summary.totalCount);
    }

    return {
      generatedAt: new Date().toISOString(),
      emptySlots,
      checks,
      blockingErrors: checks.filter((item) => item.level === 'error').length,
      warningCount: checks.filter((item) => item.level === 'warning').length,
      infoCount: checks.filter((item) => item.level === 'info').length,
    };
  }

  function buildReport() {
    return {
      selected: selectedInfo,
      selectedItems: selectedElements.map((element) => buildSelectionInfo(element)).filter(Boolean),
      selectionCount: selectedElements.length,
      slotSummary: detection.summary,
      slots: detection.candidates,
      nearMisses: detection.nearMisses,
      modifiedSlotCount: modifiedSlots.size,
      sourceName: project?.sourceName || '',
      sourceType: project?.sourceType || '',
      selectionMode: currentSelectionMode,
      textEditing: !!editingTextElement,
      hiddenCount: buildLayerTree().filter((item) => item.hidden).length,
      lockedCount: buildLayerTree().filter((item) => item.locked).length,
      layerTree: buildLayerTree(),
      textStyle: getTextStyleState(),
      preflight: buildPreflightReport(),
      generatedAt: new Date().toISOString(),
    };
  }

  function persistSlotLabels(exportDoc) {
    for (const slot of detection.candidates) {
      const element = exportDoc.querySelector(`[data-node-uid="${slot.uid}"]`);
      if (!element || element.dataset.slotIgnore === '1') continue;
      if (!element.getAttribute('data-image-slot')) element.setAttribute('data-image-slot', slugify(slot.label || slot.uid));
      if (!element.getAttribute('data-slot-label')) element.setAttribute('data-slot-label', slot.label || slot.uid);
    }
  }

  function serializeEditedHtml({ persistDetectedSlots = true } = {}) {
    const parser = new DOMParser();
    const currentHtml = createDoctypeHtml(doc);
    const exportDoc = parser.parseFromString(currentHtml, 'text/html');
    restoreSerializedAssetRefs(exportDoc, { keepEditedAssets: true });
    if (persistDetectedSlots) persistSlotLabels(exportDoc);
    stripFinalEditorRuntime(exportDoc);
    return createDoctypeHtml(exportDoc);
  }

  function buildCurrentExportDoc({ persistDetectedSlots = true } = {}) {
    const parser = new DOMParser();
    const currentHtml = createDoctypeHtml(doc);
    const exportDoc = parser.parseFromString(currentHtml, 'text/html');
    restoreSerializedAssetRefs(exportDoc, { keepEditedAssets: true });
    if (persistDetectedSlots) persistSlotLabels(exportDoc);
    stripFinalEditorRuntime(exportDoc);
    return exportDoc;
  }

  async function resolvePortableUrl(url, cache) {
    const value = String(url || '').trim();
    if (!value || value.startsWith('data:') || /^https?:\/\//i.test(value) || value.startsWith('//') || value.startsWith('#')) return value;
    if (!value.startsWith('blob:')) return value;
    if (!cache.has(value)) {
      cache.set(value, (async () => {
        try {
          const response = await fetch(value);
          const blob = await response.blob();
          return await readBlobAsDataUrl(blob);
        } catch {
          return value;
        }
      })());
    }
    return await cache.get(value);
  }

  async function rewriteBlobRefsToPortableUrls(exportDoc) {
    const cache = new Map();

    for (const img of Array.from(exportDoc.querySelectorAll('img'))) {
      const src = img.getAttribute('src') || '';
      if (src) img.setAttribute('src', await resolvePortableUrl(src, cache));
      const srcset = img.getAttribute('srcset') || '';
      if (srcset) {
        const rewritten = [];
        for (const item of parseSrcsetCandidates(srcset)) {
          rewritten.push({ ...item, url: await resolvePortableUrl(item.url, cache) });
        }
        img.setAttribute('srcset', serializeSrcsetCandidates(rewritten));
      }
    }

    for (const source of Array.from(exportDoc.querySelectorAll('source[srcset]'))) {
      const items = [];
      for (const item of parseSrcsetCandidates(source.getAttribute('srcset') || '')) {
        items.push({ ...item, url: await resolvePortableUrl(item.url, cache) });
      }
      source.setAttribute('srcset', serializeSrcsetCandidates(items));
    }

    for (const element of Array.from(exportDoc.querySelectorAll('[style]'))) {
      const styleValue = element.getAttribute('style') || '';
      if (!styleValue.includes('url(')) continue;
      const matches = Array.from(styleValue.matchAll(FRAME_CSS_URL_RE));
      let nextStyle = styleValue;
      for (const match of matches) {
        const replacement = await resolvePortableUrl(match[2], cache);
        nextStyle = nextStyle.replace(match[2], replacement);
      }
      element.setAttribute('style', nextStyle);
    }

    for (const styleBlock of Array.from(exportDoc.querySelectorAll('style'))) {
      const css = styleBlock.textContent || '';
      if (!css.includes('url(')) continue;
      const matches = Array.from(css.matchAll(FRAME_CSS_URL_RE));
      let nextCss = css;
      for (const match of matches) {
        const replacement = await resolvePortableUrl(match[2], cache);
        nextCss = nextCss.replace(match[2], replacement);
      }
      styleBlock.textContent = nextCss;
    }
  }

  function measureExportRoot() {
    const root = doc.querySelector('.page') || doc.body.firstElementChild || doc.body;
    const docRect = doc.documentElement.getBoundingClientRect();
    const rect = root.getBoundingClientRect();
    return {
      root,
      x: Math.max(0, Math.round(rect.left - docRect.left)),
      y: Math.max(0, Math.round(rect.top - docRect.top)),
      width: Math.max(1, Math.ceil(rect.width)),
      height: Math.max(1, Math.ceil(rect.height)),
      fullWidth: Math.max(Math.ceil(doc.documentElement.scrollWidth || rect.width), Math.ceil(rect.left - docRect.left + rect.width)),
      fullHeight: Math.max(Math.ceil(doc.documentElement.scrollHeight || rect.height), Math.ceil(rect.top - docRect.top + rect.height)),
    };
  }

  function normalizeExportScale(scale = 1) {
    const value = Number.parseFloat(String(scale));
    if (!Number.isFinite(value) || value <= 0) return 1;
    if (value >= 2.5) return 3;
    if (value >= 1.5) return 2;
    return 1;
  }

  function elementRectToCrop(rect, docRect) {
    return {
      x: Math.max(0, Math.round(rect.left - docRect.left)),
      y: Math.max(0, Math.round(rect.top - docRect.top)),
      width: Math.max(1, Math.ceil(rect.width)),
      height: Math.max(1, Math.ceil(rect.height)),
    };
  }

  function computeSelectionBoundingCrop() {
    const targets = uniqueConnectedElements(selectedElements).filter((element) => isElement(element) && element.isConnected);
    if (!targets.length) return null;
    const rects = targets.map((element) => element.getBoundingClientRect()).filter((rect) => rect.width > 0 && rect.height > 0);
    if (!rects.length) return null;
    const bounds = unionRect(rects);
    if (!bounds) return null;
    const docRect = doc.documentElement.getBoundingClientRect();
    return elementRectToCrop(bounds, docRect);
  }

  async function renderHtmlToCanvas(html, { fullWidth, fullHeight, crop, scale = 1 }) {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    parsed.documentElement.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    const serialized = new XMLSerializer().serializeToString(parsed.documentElement);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${crop.width}" height="${crop.height}" viewBox="0 0 ${crop.width} ${crop.height}">
        <foreignObject x="${-crop.x}" y="${-crop.y}" width="${fullWidth}" height="${fullHeight}">${serialized}</foreignObject>
      </svg>`;
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('SVG 렌더 이미지 생성 실패'));
      img.src = svgUrl;
    });
    const canvas = doc.createElement('canvas');
    canvas.width = Math.max(1, Math.round(crop.width * scale));
    canvas.height = Math.max(1, Math.round(crop.height * scale));
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(svgUrl);
    return canvas;
  }

  async function buildExportRenderContext() {
    const exportDoc = buildCurrentExportDoc({ persistDetectedSlots: false });
    await rewriteBlobRefsToPortableUrls(exportDoc);
    return {
      html: createDoctypeHtml(exportDoc),
      metrics: measureExportRoot(),
      exportDoc,
    };
  }

  async function renderExportBlob({ area = null, scale = 1, format = 'png', quality = 0.92, context = null } = {}) {
    const renderContext = context || (await buildExportRenderContext());
    const resolvedArea = area || {
      x: renderContext.metrics.x,
      y: renderContext.metrics.y,
      width: renderContext.metrics.width,
      height: renderContext.metrics.height,
    };
    const canvas = await renderHtmlToCanvas(renderContext.html, {
      fullWidth: renderContext.metrics.fullWidth,
      fullHeight: renderContext.metrics.fullHeight,
      crop: resolvedArea,
      scale: normalizeExportScale(scale),
    });
    const mime = format === 'jpg' || format === 'jpeg' ? 'image/jpeg' : 'image/png';
    return await canvasToBlob(canvas, mime, mime === 'image/jpeg' ? quality : undefined);
  }

  async function exportFullPngBlob(scale = 1.5) {
    return await renderExportBlob({ format: 'png', scale });
  }

  async function exportFullJpgBlob(scale = 1.5, quality = 0.92) {
    return await renderExportBlob({ format: 'jpg', scale, quality });
  }

  async function exportSelectionPngBlob(scale = 1.5) {
    const crop = computeSelectionBoundingCrop();
    if (!crop) throw new Error('먼저 요소를 선택해 주세요.');
    return await renderExportBlob({ format: 'png', area: crop, scale });
  }

  function collectSectionRects() {
    const metrics = measureExportRoot();
    const docRect = doc.documentElement.getBoundingClientRect();
    let candidates = Array.from(metrics.root.children || []).filter((element) => {
      if (!isElement(element)) return false;
      const rect = element.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return false;
      return element.tagName === 'SECTION' || element.classList.contains('section') || element.classList.contains('hero') || element.classList.contains('hb-info-wrap') || element.hasAttribute('data-export-section');
    });
    if (!candidates.length) {
      candidates = Array.from(metrics.root.querySelectorAll('section, .hb-info-wrap')).filter((element) => isElement(element));
    }
    return candidates.map((element, index) => {
      const rect = element.getBoundingClientRect();
      const crop = elementRectToCrop(rect, docRect);
      const rawName = buildLabel(element) || element.id || element.className || element.tagName.toLowerCase();
      return {
        crop,
        name: `${String(index + 1).padStart(3, '0')}_${sanitizeFilename(slugify(rawName) || 'section')}.png`,
      };
    });
  }

  async function exportSectionPngEntries(scale = 1.5) {
    const context = await buildExportRenderContext();
    const sections = collectSectionRects();
    const entries = [];
    for (const section of sections) {
      // eslint-disable-next-line no-await-in-loop
      const blob = await renderExportBlob({ format: 'png', area: section.crop, scale, context });
      // eslint-disable-next-line no-await-in-loop
      entries.push({ name: section.name, data: new Uint8Array(await blob.arrayBuffer()) });
    }
    return entries;
  }

  async function exportFixtureIntegrityReport() {
    const exportDoc = buildCurrentExportDoc({ persistDetectedSlots: false });
    const fixtureContract = project?.fixtureMeta?.slot_contract || null;
    let placeholderOnlySlots = 0;
    let unresolvedImages = 0;
    for (const slotRecord of detection.candidates) {
      const slot = exportDoc.querySelector(`[data-node-uid="${slotRecord.uid}"]`);
      if (!slot || slot.dataset.slotIgnore === '1') continue;
      const hasPlaceholder = PLACEHOLDER_TEXT_RE.test(placeholderTextValue(slot));
      const target = findSlotMediaTarget(slot);
      let hasMedia = false;
      let unresolved = false;
      if (target.kind === 'background') {
        const styleValue = (target.element || slot).getAttribute('style') || '';
        hasMedia = /url\(/i.test(styleValue);
        unresolved = /%EB%AF%B8%ED%95%B4%EA%B2%B0|미해결/i.test(styleValue);
      } else {
        const img = target.element || slot.querySelector('img');
        const src = img?.getAttribute('src') || '';
        hasMedia = !!src;
        unresolved = /%EB%AF%B8%ED%95%B4%EA%B2%B0|미해결/i.test(src);
      }
      if (hasPlaceholder && !hasMedia) placeholderOnlySlots += 1;
      if (unresolved) unresolvedImages += 1;
    }
    const issues = [];
    if (placeholderOnlySlots > 0) issues.push(`placeholder-only 슬롯 ${placeholderOnlySlots}개`);
    if (unresolvedImages > 0) issues.push(`미해결 이미지 ${unresolvedImages}개`);
    if (fixtureContract?.required_exact_count != null && detection.summary.totalCount !== fixtureContract.required_exact_count) {
      issues.push(`fixture 슬롯 수 불일치(${detection.summary.totalCount}/${fixtureContract.required_exact_count})`);
    }
    return {
      ok: issues.length === 0,
      fixtureId: project?.fixtureId || '',
      placeholderOnlySlots,
      unresolvedImages,
      issues,
    };
  }

  async function buildLinkedPackageEntries() {
    const exportDoc = buildCurrentExportDoc({ persistDetectedSlots: true });
    await rewriteBlobRefsToPortableUrls(exportDoc);
    const assetEntries = [];
    const assetPathMap = new Map();

    async function materializeUrl(url, hint = 'asset') {
      const value = String(url || '').trim();
      if (!value || !value.startsWith('data:')) return value;
      if (assetPathMap.has(value)) return assetPathMap.get(value);
      const response = await fetch(value);
      const blob = await response.blob();
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const ext = guessExtensionFromMime(blob.type, '.bin');
      const name = `assets/${String(assetEntries.length + 1).padStart(3, '0')}_${sanitizeFilename(slugify(hint) || 'asset')}${ext}`;
      assetEntries.push({ name, data: bytes });
      assetPathMap.set(value, name);
      return name;
    }

    for (const img of Array.from(exportDoc.querySelectorAll('img'))) {
      const hint = buildLabel(img.parentElement || img);
      const src = img.getAttribute('src') || '';
      if (src.startsWith('data:')) img.setAttribute('src', await materializeUrl(src, hint));
      const srcset = img.getAttribute('srcset') || '';
      if (srcset) {
        const rewritten = [];
        for (const item of parseSrcsetCandidates(srcset)) {
          rewritten.push({ ...item, url: await materializeUrl(item.url, hint) });
        }
        img.setAttribute('srcset', serializeSrcsetCandidates(rewritten));
      }
    }

    for (const source of Array.from(exportDoc.querySelectorAll('source[srcset]'))) {
      const hint = buildLabel(source.parentElement || source);
      const rewritten = [];
      for (const item of parseSrcsetCandidates(source.getAttribute('srcset') || '')) {
        rewritten.push({ ...item, url: await materializeUrl(item.url, hint) });
      }
      source.setAttribute('srcset', serializeSrcsetCandidates(rewritten));
    }

    for (const element of Array.from(exportDoc.querySelectorAll('[style]'))) {
      const styleValue = element.getAttribute('style') || '';
      if (!styleValue.includes('url(')) continue;
      const matches = Array.from(styleValue.matchAll(FRAME_CSS_URL_RE));
      let nextStyle = styleValue;
      for (const match of matches) {
        const replacement = await materializeUrl(match[2], buildLabel(element));
        nextStyle = nextStyle.replace(match[2], replacement);
      }
      element.setAttribute('style', nextStyle);
    }

    for (const styleBlock of Array.from(exportDoc.querySelectorAll('style'))) {
      const css = styleBlock.textContent || '';
      if (!css.includes('url(')) continue;
      const matches = Array.from(css.matchAll(FRAME_CSS_URL_RE));
      let nextCss = css;
      for (const match of matches) {
        const replacement = await materializeUrl(match[2], 'style');
        nextCss = nextCss.replace(match[2], replacement);
      }
      styleBlock.textContent = nextCss;
    }

    const baseName = sanitizeFilename(project?.sourceName?.replace(/\.html?$/i, '') || 'detail-page');
    const html = createDoctypeHtml(exportDoc);
    return [
      { name: `${baseName}__linked.html`, data: new TextEncoder().encode(html) },
      ...assetEntries,
    ];
  }

  function captureSnapshot(label = 'snapshot') {
    const parser = new DOMParser();
    const currentHtml = createDoctypeHtml(doc);
    const snapshotDoc = parser.parseFromString(currentHtml, 'text/html');
    stripTransientRuntime(snapshotDoc);
    return {
      label,
      html: createDoctypeHtml(snapshotDoc),
      selectedUid: selectedInfo?.uid || '',
      selectedUids: selectedElements.map((element) => element.dataset.nodeUid).filter(Boolean),
      selectionMode: currentSelectionMode,
      savedAt: new Date().toISOString(),
    };
  }

  function beginMoveDrag(target, event) {
    const nextState = beginMoveInteraction({
      target,
      event,
      isLockedElement,
      selectedElements: () => selectedElements,
      selectElements,
      uniqueConnectedElements,
      readTransformState,
      unionRect,
      buildSnapCandidates,
    });
    if (!nextState) return false;
    dragState = nextState;
    return true;
  }

  function beginMarqueeDrag(event) {
    dragState = beginMarqueeInteraction({
      event,
      selectedElements: () => selectedElements,
      uniqueConnectedElements,
    });
    return true;
  }

  function updateMarqueeSelection(endX, endY) {
    applyMarqueeInteraction({
      dragState,
      endX,
      endY,
      showMarqueeRect,
      collectInteractiveLayers,
      isLockedElement,
      isHiddenElement,
      rectIntersects,
      uniqueConnectedElements,
      selectElements,
    });
  }

  function updateMoveDrag(clientX, clientY) {
    applyMoveInteraction({
      dragState,
      clientX,
      clientY,
      computeSnapAdjustment,
      writeTransformState,
      showSnapLines,
      doc,
    });
  }

  function beginResizeDrag(event, corner) {
    const nextState = beginResizeInteraction({
      event,
      corner,
      selectedElement: () => selectedElement,
      isLockedElement,
      readTransformState,
      win,
    });
    if (!nextState) return false;
    resizeState = nextState;
    return true;
  }

  function updateResizeDrag(event) {
    if (!resizeState || resizeState.pointerId !== event.pointerId) return;
    const dx = event.clientX - resizeState.startX;
    const dy = event.clientY - resizeState.startY;
    if (!resizeState.moved && Math.hypot(dx, dy) < 2) return;
    resizeState.moved = true;
    const { corner, target } = resizeState;
    let width = resizeState.startWidth;
    let height = resizeState.startHeight;
    let tx = resizeState.startTx;
    let ty = resizeState.startTy;
    if (corner.includes('e')) width += dx;
    if (corner.includes('s')) height += dy;
    if (corner.includes('w')) {
      width -= dx;
      tx += dx;
    }
    if (corner.includes('n')) {
      height -= dy;
      ty += dy;
    }
    width = Math.max(8, width);
    height = Math.max(8, height);
    const uid = target.dataset.nodeUid || nextId('node');
    target.dataset.nodeUid = uid;
    patchModelNode(editorModel, uid, {
      bounds: { width, height },
      style: { width: `${Math.round(width)}px`, height: `${Math.round(height)}px` },
    });
    applyModelNodesToDom(doc, editorModel, [uid]);
    writeTransformState(target, tx, ty);
    target.dataset.editorModified = '1';
    if (target.dataset.nodeUid) modifiedSlots.add(target.dataset.nodeUid);
    updateResizeOverlay();
  }

  function finishResizeDrag(event) {
    if (!resizeState || (event && resizeState.pointerId !== event.pointerId)) return;
    const done = resizeState;
    resizeState = null;
    if (!done.moved) return;
    emitState();
    emitMutation('resize-drag');
    onStatus('선택 요소 크기를 조절했습니다.');
  }

  function handlePointerDown(event) {
    if (event.button !== 0 || editingTextElement) return;
    const resizeHandle = closestElement(event.target)?.closest?.('[data-resize-corner]');
    if (resizeHandle) {
      event.preventDefault();
      event.stopPropagation();
      beginResizeDrag(event, resizeHandle.dataset.resizeCorner || 'se');
      return;
    }
    const target = resolveSelectionTarget(event.target);
    if (event.shiftKey && !target) {
      beginMarqueeDrag(event);
      return;
    }
    if (event.shiftKey && target) {
      beginMarqueeDrag(event);
      return;
    }
    if (!target) return;
    if (isLockedElement(target)) {
      onStatus('잠긴 레이어는 캔버스에서 직접 편집할 수 없습니다. 레이어 패널에서 잠금을 해제해 주세요.');
      return;
    }
    beginMoveDrag(target, event);
  }

  function handlePointerMove(event) {
    if (resizeState && resizeState.pointerId === event.pointerId) {
      event.preventDefault();
      updateResizeDrag(event);
      return;
    }
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    if (!dragState.moved && Math.hypot(dx, dy) < 3) return;
    dragState.moved = true;
    event.preventDefault();
    if (dragState.mode === 'marquee') updateMarqueeSelection(event.clientX, event.clientY);
    else if (dragState.mode === 'move') updateMoveDrag(event.clientX, event.clientY);
  }

  function finishPointerDrag(event) {
    if (resizeState && (!event || resizeState.pointerId === event.pointerId)) {
      finishResizeDrag(event);
      return;
    }
    if (!dragState || (event && dragState.pointerId !== event.pointerId)) return;
    const finished = dragState;
    dragState = null;
    hideInteractionOverlay();
    if (!finished.moved) return;
    suppressClickUntil = Date.now() + 220;
    if (finished.mode === 'move') {
      emitState();
      emitMutation('drag-move');
      onStatus(`선택 요소 ${finished.snapshots.length}개를 드래그 이동했습니다.`);
    } else if (finished.mode === 'marquee') {
      emitState();
      onStatus(`드래그로 ${selectedElements.length}개 레이어를 선택했습니다.`);
    }
  }

  function handleDocClick(event) {
    if (Date.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (editingTextElement && !editingTextElement.contains(event.target)) {
      finishTextEdit({ commit: true, emit: true });
    }
    const target = resolveSelectionTarget(event.target);
    if (!target) return;
    const anchor = closestElement(event.target)?.closest?.('a[href]');
    if (anchor) event.preventDefault();
    selectElement(target, {
      additive: event.ctrlKey || event.metaKey || event.shiftKey,
      toggle: event.ctrlKey || event.metaKey,
    });
  }

  function handleDocDoubleClick(event) {
    const target = resolveSelectionTarget(event.target);
    if (!target) return;
    const result = startTextEdit(target);
    if (result.ok) {
      event.preventDefault();
      onStatus(result.message);
    }
  }

  function executeCommand(command, payload = {}) {
    if (command === 'duplicate') return duplicateSelected();
    if (command === 'delete') return deleteSelected();
    if (command === 'nudge-selection') return nudgeSelectedElements(payload.dx || 0, payload.dy || 0);
    if (command === 'undo' || command === 'redo' || command === 'save-edited') {
      onShortcut(command);
      return { ok: true, message: command };
    }
    return { ok: false, message: `지원하지 않는 명령: ${command}` };
  }

  function handleKeydown(event) {
    const withModifier = event.ctrlKey || event.metaKey;
    if (withModifier && !event.altKey) {
      const key = String(event.key || '').toLowerCase();
      if (key === 'z') {
        event.preventDefault();
        executeCommand(event.shiftKey ? 'redo' : 'undo');
        return;
      }
      if (key === 'y') {
        event.preventDefault();
        executeCommand('redo');
        return;
      }
      if (key === 's') {
        event.preventDefault();
        executeCommand('save-edited');
        return;
      }
      if (key === 'd') {
        event.preventDefault();
        onStatus(executeCommand('duplicate').message);
        return;
      }
    }
    if (!withModifier && !editingTextElement && (event.key === 'Delete' || event.key === 'Backspace')) {
      event.preventDefault();
      onStatus(executeCommand('delete').message);
      return;
    }
    if (!withModifier && !editingTextElement) {
      const delta = event.shiftKey ? 10 : 1;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onStatus(executeCommand('nudge-selection', { dx: -delta, dy: 0 }).message);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onStatus(executeCommand('nudge-selection', { dx: delta, dy: 0 }).message);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        onStatus(executeCommand('nudge-selection', { dx: 0, dy: -delta }).message);
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        onStatus(executeCommand('nudge-selection', { dx: 0, dy: delta }).message);
        return;
      }
    }
    if (!editingTextElement) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      onStatus(finishTextEdit({ commit: false }).message);
      return;
    }
    if (withModifier && event.key === 'Enter') {
      event.preventDefault();
      onStatus(finishTextEdit({ commit: true }).message);
    }
  }

  function handleDragOver(event) {
    if (!event.dataTransfer?.types) return;
    const hasFiles = Array.from(event.dataTransfer.types).includes('Files');
    if (!hasFiles) return;
    const slot = (closestElement(event.target)?.closest?.('[data-detected-slot], [data-image-slot], .image-slot, .drop-slot')) || getSelectedSlotElement();
    if (!slot || isLockedElement(slot)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    if (hoverSlot !== slot) {
      clearHover();
      hoverSlot = slot;
      hoverSlot.classList.add('__phase5_drop_hover');
    }
  }

  async function handleDrop(event) {
    if (!event.dataTransfer?.files?.length) return;
    const slot = (closestElement(event.target)?.closest?.('[data-detected-slot], [data-image-slot], .image-slot, .drop-slot')) || getSelectedSlotElement();
    if (!slot || isLockedElement(slot)) return;
    event.preventDefault();
    clearHover();
    await applyFilesStartingAtSlot(slot, Array.from(event.dataTransfer.files));
  }

  function handleDragLeave() {
    clearHover();
  }

  doc.addEventListener('click', handleDocClick, true);
  doc.addEventListener('dblclick', handleDocDoubleClick, true);
  doc.addEventListener('keydown', handleKeydown, true);
  doc.addEventListener('pointerdown', handlePointerDown, true);
  doc.addEventListener('pointermove', handlePointerMove, true);
  doc.addEventListener('pointerup', finishPointerDrag, true);
  doc.addEventListener('pointercancel', finishPointerDrag, true);
  doc.addEventListener('dragover', handleDragOver, true);
  doc.addEventListener('drop', handleDrop, true);
  doc.addEventListener('dragleave', handleDragLeave, true);

  rehydratePersistentState();
  hideInteractionOverlay();
  hideResizeOverlay();
  redetect({ preserveSelectionUids: initialSnapshot?.selectedUids || [] });

  return {
    setSelectionMode,
    redetect,
    refreshDerivedMeta,
    selectNodeByUid(uid, { additive = false, toggle = false, scroll = false } = {}) {
      const element = getElementByUid(uid);
      if (!element) return false;
      selectElement(element, { additive, toggle });
      if (scroll) element.scrollIntoView?.({ block: 'center', inline: 'nearest', behavior: 'smooth' });
      return true;
    },
    selectSlotByUid(uid) {
      return this.selectNodeByUid(uid, { additive: false, toggle: false, scroll: true });
    },
    async applyFiles(files) {
      const slot = getSelectedSlotElement();
      if (!slot) {
        onStatus('먼저 이미지 슬롯을 선택해 주세요.');
        return 0;
      }
      return await applyFilesStartingAtSlot(slot, files);
    },
    applyImagePreset,
    removeImageFromSelected,
    markSelectedAsSlot,
    demoteSelectedSlot,
    toggleSelectedHidden,
    toggleSelectedLocked,
    toggleLayerHiddenByUid,
    toggleLayerLockedByUid,
    toggleTextEdit,
    applyTextStyle,
    applyBatchLayout,
    duplicateSelected,
    deleteSelected,
    addTextElement: () => addElement('text'),
    addBoxElement: () => addElement('box'),
    addSlotElement: () => addElement('slot'),
    applyGeometryPatch,
    getSelectionGeometry: () => elementGeometry(selectedElement),
    bringSelectedForward: () => applyLayerIndexCommand('forward'),
    sendSelectedBackward: () => applyLayerIndexCommand('backward'),
    bringSelectedToFront: () => applyLayerIndexCommand('front'),
    sendSelectedToBack: () => applyLayerIndexCommand('back'),
    nudgeSelectedImage: ({ dx = 0, dy = 0 } = {}) => nudgeImagePosition(dx, dy),
    executeCommand,
    getEditedHtml: serializeEditedHtml,
    getCurrentPortableHtml: async () => {
      const exportDoc = buildCurrentExportDoc({ persistDetectedSlots: true });
      await rewriteBlobRefsToPortableUrls(exportDoc);
      return createDoctypeHtml(exportDoc);
    },
    async getLinkedPackageEntries() {
      return await buildLinkedPackageEntries();
    },
    async exportFullPngBlob(scale = 1.5) {
      return await exportFullPngBlob(scale);
    },
    async exportFullJpgBlob(scale = 1.5, quality = 0.92) {
      return await exportFullJpgBlob(scale, quality);
    },
    async exportSelectionPngBlob(scale = 1.5) {
      return await exportSelectionPngBlob(scale);
    },
    async exportSectionPngEntries(scale = 1.5) {
      return await exportSectionPngEntries(scale);
    },
    async getExportFixtureIntegrityReport() {
      return await exportFixtureIntegrityReport();
    },
    captureSnapshot,
    getReport: buildReport,
    getPreflightReport: buildPreflightReport,
    getMeta() {
      return { ...getDerivedMeta(), modelVersion: editorModel.version };
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (editingTextElement) finishTextEdit({ commit: false, emit: false });
      doc.removeEventListener('click', handleDocClick, true);
      doc.removeEventListener('dblclick', handleDocDoubleClick, true);
      doc.removeEventListener('keydown', handleKeydown, true);
      doc.removeEventListener('pointerdown', handlePointerDown, true);
      doc.removeEventListener('pointermove', handlePointerMove, true);
      doc.removeEventListener('pointerup', finishPointerDrag, true);
      doc.removeEventListener('pointercancel', finishPointerDrag, true);
      doc.removeEventListener('dragover', handleDragOver, true);
      doc.removeEventListener('drop', handleDrop, true);
      doc.removeEventListener('dragleave', handleDragLeave, true);
      clearHover();
      hideInteractionOverlay();
      hideResizeOverlay();
      clearSelectionClasses();
    },
  };
}
