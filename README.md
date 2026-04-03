# Reddit Comment Cleaner

A Chrome extension that removes Reddit's auto-injected search links from comment threads, leaving your feed clean and distraction free.

![License](https://img.shields.io/badge/license-GPL--3.0-blue)
![Manifest](https://img.shields.io/badge/manifest-v3-green)
![Platform](https://img.shields.io/badge/platform-Chrome-yellow)

---

## What It Does

Reddit quietly injects hyperlinked keywords into comment threads, turning ordinary words into search links nobody asked for. They come with a small spyglass icon and redirect to Reddit's search page when clicked. This is part of an experimental A/B test Reddit has been rolling out across subreddits.

Reddit Comment Cleaner makes them disappear.

Every time you open a Reddit page, the extension scans comment threads and strips out the injected search links, leaving behind the original clean text. No spyglasses, no surprise redirects. Just comments, the way they were written and meant to be read. Open the extension popup and you will see exactly how many links were removed from your current page. We will not spoil what happens to those pesky links, but the extension has a vocabulary, and none of the words are gentle.

---

## How It Works

Reddit wraps injected search links in a custom element called `<search-telemetry-tracker>`. Inside it sits an `<a href="/search/...">` anchor with an SVG spyglass icon. The extension targets both patterns:

```
<search-telemetry-tracker>
  <a href="/search/?q=keyword">
    keyword
    <svg icon-name="search">...</svg>
  </a>
</search-telemetry-tracker>
```

**On page load:** `cleanse(document)` runs two `querySelectorAll` calls across the full document, finds all matching elements, extracts the plain text content, and replaces the entire element with a plain text node. Native browser operations. Sub-millisecond on any page.

**On scroll / dynamic content:** A `MutationObserver` watches for newly added DOM nodes and runs the same cleanse function on each addition. Reddit is a single-page app that loads comments dynamically — the observer catches everything that arrives after the initial page load.

**Toggle:** The popup communicates with the content script via `chrome.runtime.sendMessage`. Pause state is persisted in `sessionStorage` (per-tab, cleared on tab close) so a paused tab stays paused across reloads without affecting any other tab.

---

## Features

- Removes Reddit's auto-injected search links from all comment threads
- Works instantly on page load, plus catches links added dynamically as you scroll
- One-click pause and resume from the popup
- Live count of links removed on the current page
- Per-tab pause state — pausing one tab does not affect others
- Zero data collection. No analytics. No tracking. Nothing leaves your browser. Ever.
- Lightweight. No background service worker. No network requests. No dependencies.

---

## Installation

### Chrome Web Store
Coming soon.

### Manual (Developer Mode)
1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the `extension` folder
5. Navigate to any Reddit thread and open the extension popup

---

## Security Review

### Permissions
| Permission | Purpose | Scope |
|---|---|---|
| `tabs` | Read active tab URL to detect reddit.com pages | Read-only, active tab only |
| Content script on `https://www.reddit.com/*` | Remove injected search link elements | reddit.com pages only |

No other permissions are requested. No `webRequest`, no `cookies`, no `storage`, no `activeTab`, no `scripting`, no host permissions beyond reddit.com.

### Code Safety
- **No XSS risk.** The content script only creates `document.createTextNode()` nodes. No `innerHTML`, no `eval()`, no `Function()`, no dynamic code execution.
- **No data exfiltration.** Zero `fetch()`, `XMLHttpRequest`, or any network calls. Nothing leaves the browser.
- **No remote code.** All JavaScript ships in the extension package. No CDN imports, no external scripts.
- **Message passing is locked down.** Only two message types are accepted: `getStatus` and `toggle`. Both are validated before execution. Responses contain only a boolean and an integer.
- **sessionStorage only.** One boolean value (`'true'` or `'false'`) is written to sessionStorage per tab. Never transmitted. Cleared automatically when the tab closes.
- **Supply chain is clean.** Zero npm dependencies. Zero bundler. Zero third-party code. The entire extension is four hand-written files.

### Popup Safety
The popup uses `innerHTML` in one place to update the headline. The only dynamic values inserted are a verb picked from a hardcoded array and an integer from the content script. Neither is user-controlled input. No XSS risk.

### External Links
The popup contains links to GitHub and Buy Me a Coffee. Both use `rel="noopener"`. The extension makes no requests to these or any other external service.

---

## Performance Review

### Page Load Impact
`cleanse(document)` runs two native `querySelectorAll` calls on the full document at page load. These are C++ browser operations. On a Reddit page with 500+ comments the operation completes in under 5ms. Invisible to the user.

### MutationObserver
The observer watches `childList` and `subtree` on `document.body`. This is the standard pattern used by every content-modifying extension including uBlock Origin and Dark Reader.

- When a new node is added, the callback fires and runs `cleanse()` scoped to that node only — not the whole document.
- When the extension is paused, the callback returns immediately on line 1. Zero work performed.
- Only `ELEMENT_NODE` types are processed. Text nodes, comment nodes, and other node types are skipped.

### Memory
Two global variables, two functions, one observer. Approximately 2KB of heap. Unmeasurable impact.

### Extension Size
| File | Size |
|---|---|
| content.js | 2.3KB |
| popup.js | 2.6KB |
| popup.html | 6.4KB |
| manifest.json | 0.7KB |
| Icons + assets | ~1.1MB |

Total package size: ~1.2MB. The bulk is two image assets (logo and coffee GIF). All code is under 12KB.

### Summary

| Category | Result | Notes |
|---|---|---|
| XSS / code injection | Clean | Only creates text nodes, no dynamic HTML from user input |
| Data exfiltration | Clean | Zero network requests, zero data collection |
| Permission scope | Minimal | `tabs` only, content script on reddit.com only |
| Supply chain | Clean | Zero dependencies, no external code |
| Performance impact | Negligible | Sub-millisecond operations, ~2KB memory |

---

## License

GPL-3.0. See [LICENSE](https://raw.githubusercontent.com/2xNeil/reddit-comment-cleaner/refs/heads/main/LICENSE) for details.

---

## Support

If you find this extension useful, you can [buy me a coffee](https://buymeacoffee.com/2xneil).
