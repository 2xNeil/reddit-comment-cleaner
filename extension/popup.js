// Reddit Comment Cleaner
// Copyright (C) 2026 Neil Mate
// Licensed under GPL-3.0 — see LICENSE file for details

const VERBS = [
  'Zapped', 'Nuked', 'Yeeted', 'Vaporized', 'Obliterated',
  'Ghosted', 'Evicted', 'Defenestrated', 'Fumigated', 'Torched',
  'Yoinked', 'Annihilated', 'Swatted', 'Booted', 'Banished', 
  'Pulverized',
];

const ZERO_VERBS = [
  'zap', 'nuke', 'yeet', 'vaporize', 'obliterate',
  'ghost', 'evict', 'defenestrate', 'fumigate', 'torch',
  'yoink', 'annihilate', 'swat', 'boot', 'banish', 
  'pulverize',
];

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const headlineEl = document.getElementById('headline');
const verbEl     = document.getElementById('verb');
const countEl    = document.getElementById('count');
const toggleEl   = document.getElementById('toggleSwitch');
const pauseIcon  = document.getElementById('pauseIcon');
const playIcon   = document.getElementById('playIcon');
const label      = document.getElementById('statusText');

const mainVerb = pick(VERBS);
verbEl.textContent = mainVerb;

function updateHeadline(count) {
  if (count > 0) {
    headlineEl.innerHTML = `<span id="verb">${mainVerb}</span> <span id="count">${count}</span> injected<span class="orange"> search links from your feed.</span>`;
  } else {
    headlineEl.innerHTML = `Feed clean,<span class="orange"> nothing to ${pick(ZERO_VERBS)}.</span>`;
  }
}

updateHeadline(0);

function setState(enabled) {
  if (enabled) {
    pauseIcon.style.display = 'block';
    playIcon.style.display  = 'none';
    label.textContent       = 'Active';
  } else {
    pauseIcon.style.display = 'none';
    playIcon.style.display  = 'block';
    label.textContent       = 'Paused';
  }
}

setState(true);

let currentTabId = null;

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const tab = tabs[0];
  if (!tab) return;
  currentTabId = tab.id;

  if (tab.url && tab.url.includes('reddit.com')) {
    chrome.tabs.sendMessage(tab.id, { type: 'getStatus' }, res => {
      if (chrome.runtime.lastError || !res) return;
      setState(res.isEnabled);
      updateHeadline(res.removedCount ?? 0);
    });
  }
});

toggleEl.addEventListener('click', () => {
  const isActive = pauseIcon.style.display !== 'none';
  setState(!isActive);

  if (currentTabId === null) return;
  chrome.tabs.sendMessage(currentTabId, { type: 'toggle' }, res => {
    if (chrome.runtime.lastError || !res) return;
    if (!res.isEnabled) {
      updateHeadline(0);
      chrome.tabs.reload(currentTabId);
    } else {
      updateHeadline(res.removedCount ?? 0);
    }
  });
});
