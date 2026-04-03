import { ensureUniqueNodeUids } from './node-uid.js';

function parseStyle(styleText = '') {
  const map = new Map();
  for (const raw of String(styleText || '').split(';')) {
    const [key, ...rest] = raw.split(':');
    if (!key || !rest.length) continue;
    map.set(key.trim().toLowerCase(), rest.join(':').trim());
  }
  return map;
}

function serializeStyle(map) {
  return Array.from(map.entries()).map(([key, value]) => `${key}: ${value}`).join('; ');
}

function pxValue(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const match = raw.match(/^-?\d+(\.\d+)?/);
  if (!match) return null;
  const num = Number.parseFloat(match[0]);
  return Number.isFinite(num) ? num : null;
}

function readNodeState(element) {
  const uid = element.dataset.nodeUid || '';
  const styleMap = parseStyle(element.getAttribute('style') || '');
  const tx = pxValue(element.dataset.editorTx) || 0;
  const ty = pxValue(element.dataset.editorTy) || 0;
  return {
    uid,
    bounds: {
      x: tx,
      y: ty,
      width: pxValue(styleMap.get('width')),
      height: pxValue(styleMap.get('height')),
    },
    style: Object.fromEntries(styleMap.entries()),
    slotMeta: {
      detectedType: element.getAttribute('data-detected-slot') || '',
      label: element.getAttribute('data-slot-label') || '',
      score: Number.parseFloat(element.getAttribute('data-detected-slot-score') || '0') || 0,
      reasons: (element.getAttribute('data-detected-slot-reasons') || '').split('|').map((item) => item.trim()).filter(Boolean),
    },
  };
}

export function createEditorModel(doc) {
  ensureUniqueNodeUids(doc, { selector: '[data-node-uid]' });
  const nodes = new Map();
  for (const element of Array.from(doc.querySelectorAll('[data-node-uid]'))) {
    const state = readNodeState(element);
    if (state.uid) nodes.set(state.uid, state);
  }
  return { version: 1, nodes };
}

export function patchModelNode(model, uid, patch = {}) {
  if (!model || !uid) return null;
  const current = model.nodes.get(uid) || {
    uid,
    bounds: { x: 0, y: 0, width: null, height: null },
    style: {},
    slotMeta: { detectedType: '', label: '', score: 0, reasons: [] },
  };
  const next = {
    ...current,
    bounds: { ...current.bounds, ...(patch.bounds || {}) },
    style: { ...current.style, ...(patch.style || {}) },
    slotMeta: { ...current.slotMeta, ...(patch.slotMeta || {}) },
  };
  model.nodes.set(uid, next);
  model.version += 1;
  return next;
}

export function applyModelNodesToDom(doc, model, uids = []) {
  if (!model || !doc) return;
  const targets = uids.length ? uids : Array.from(model.nodes.keys());
  for (const uid of targets) {
    const state = model.nodes.get(uid);
    if (!state) continue;
    const element = doc.querySelector(`[data-node-uid="${uid}"]`);
    if (!element) continue;
    const styleMap = parseStyle(element.getAttribute('style') || '');
    if (state.bounds.width != null) styleMap.set('width', `${Math.round(state.bounds.width)}px`);
    if (state.bounds.height != null) styleMap.set('height', `${Math.round(state.bounds.height)}px`);
    for (const [key, value] of Object.entries(state.style || {})) {
      if (value == null || value === '') styleMap.delete(String(key).toLowerCase());
      else styleMap.set(String(key).toLowerCase(), String(value));
    }
    const styleText = serializeStyle(styleMap);
    if (styleText) element.setAttribute('style', styleText);
    else element.removeAttribute('style');
    if (styleText) element.dataset.exportStyle = styleText;
    else element.removeAttribute('data-export-style');
    element.dataset.editorTx = String(Math.round(state.bounds.x || 0));
    element.dataset.editorTy = String(Math.round(state.bounds.y || 0));
    if (state.slotMeta?.label) element.setAttribute('data-slot-label', state.slotMeta.label);
    if (state.slotMeta?.detectedType) element.setAttribute('data-detected-slot', state.slotMeta.detectedType);
  }
}
import { ensureUniqueNodeUids } from './node-uid.js';
