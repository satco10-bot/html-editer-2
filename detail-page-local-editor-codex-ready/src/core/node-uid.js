import { nextId } from '../utils.js';

function normalizeUid(value) {
  return String(value || '').trim();
}

export function ensureUniqueNodeUids(doc, { selector = '*', attribute = 'data-node-uid' } = {}) {
  if (!doc?.querySelectorAll) {
    return {
      scanned: 0,
      assigned: 0,
      deduped: 0,
      unchanged: 0,
      duplicateGroups: 0,
    };
  }

  const elements = Array.from(doc.querySelectorAll(selector));
  const used = new Set();
  const duplicateCounter = new Map();
  let assigned = 0;
  let deduped = 0;
  let unchanged = 0;

  for (const element of elements) {
    const rawUid = normalizeUid(element.getAttribute(attribute));
    if (!rawUid) {
      const nextUid = nextId('node');
      element.setAttribute(attribute, nextUid);
      used.add(nextUid);
      assigned += 1;
      continue;
    }
    if (!used.has(rawUid)) {
      used.add(rawUid);
      unchanged += 1;
      continue;
    }
    duplicateCounter.set(rawUid, (duplicateCounter.get(rawUid) || 0) + 1);
    const nextUid = nextId('node');
    element.setAttribute(attribute, nextUid);
    used.add(nextUid);
    deduped += 1;
  }

  return {
    scanned: elements.length,
    assigned,
    deduped,
    unchanged,
    duplicateGroups: duplicateCounter.size,
  };
}
