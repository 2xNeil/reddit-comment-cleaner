// Reddit Comment Cleaner
// Copyright (C) 2026 Neil Mate
// Licensed under GPL-3.0 — see LICENSE file for details

let isEnabled = true;
let removedCount = 0;

function stripAnchor(anchor) {
  const text = Array.from(anchor.childNodes)
    .filter(n => n.nodeType === Node.TEXT_NODE)
    .map(n => n.textContent)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
  if (text) { anchor.replaceWith(document.createTextNode(text)); removedCount++; }
}

function stripTracker(tracker) {
  let root = tracker;
  while (root.parentElement && root.parentElement.tagName === 'SEARCH-TELEMETRY-TRACKER') {
    root = root.parentElement;
  }
  const anchor = root.querySelector('a[href^="/search/"]');
  if (!anchor) return;
  const text = Array.from(anchor.childNodes)
    .filter(n => n.nodeType === Node.TEXT_NODE)
    .map(n => n.textContent)
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
  if (text) { root.replaceWith(document.createTextNode(text)); removedCount++; }
}

function cleanse(root) {
  root.querySelectorAll('search-telemetry-tracker').forEach(tracker => {
    if (tracker.querySelector('a[href^="/search/"]')) stripTracker(tracker);
  });
  root.querySelectorAll('a[href^="/search/"] svg[icon-name="search"]').forEach(svg => {
    const anchor = svg.closest('a[href^="/search/"]');
    if (anchor) stripAnchor(anchor);
  });
}

function init() {
  // sessionStorage is per-tab and survives reloads — no cross-tab bleed
  isEnabled = sessionStorage.getItem('rpcEnabled') !== 'false';

  if (isEnabled) cleanse(document);

  const observer = new MutationObserver(mutations => {
    if (!isEnabled) return;
    for (const m of mutations)
      for (const node of m.addedNodes)
        if (node.nodeType === Node.ELEMENT_NODE) cleanse(node);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

chrome.runtime.onMessage.addListener((msg, _sender, respond) => {
  if (msg.type === 'getStatus') {
    respond({ isEnabled, removedCount });
    return true;
  }
  if (msg.type === 'toggle') {
    isEnabled = !isEnabled;
    sessionStorage.setItem('rpcEnabled', isEnabled);
    if (isEnabled) cleanse(document);
    respond({ isEnabled, removedCount });
    return true;
  }
});

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
