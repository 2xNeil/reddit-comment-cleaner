# Privacy Policy: Reddit Comment Cleaner

*Effective date: April 3, 2026*
*Last updated: April 3, 2026*

## 1. Introduction

Reddit Comment Cleaner ("the Extension") is a Chrome browser extension developed by Neil Mate ("we", "us", "our"). This privacy policy explains how the Extension handles information when you use it. We are committed to protecting your privacy. The Extension is designed to function entirely on your device with no data collection whatsoever.

## 2. Information We Collect

We do not collect any information. Specifically:

- No personal information (name, email, address, phone number)
- No browsing history or browsing activity
- No authentication credentials or financial information
- No website content or user-generated content
- No health, location, or communication data
- No analytics, telemetry, or crash reports

The Extension does not transmit any data from your browser to us, to any third party, or to any server anywhere.

## 3. How the Extension Works

The Extension performs all operations locally within your browser tab:

- **Tab URL reading:** The Extension uses the `tabs` permission solely to read the URL of your currently active tab to determine whether you are on reddit.com. This URL is checked locally and is never stored, logged, or transmitted.
- **DOM modification:** On reddit.com pages, the Extension identifies and removes auto-injected search links from comment threads. This is a local operation performed entirely within your browser's rendering engine.
- **Session state:** The Extension stores a single on/off preference in your browser's `sessionStorage`. This value exists only within the individual browser tab, is never transmitted, and is automatically deleted when the tab is closed.
- **In-memory counter:** The Extension counts the number of links removed during the current page session. This count is held in JavaScript memory only, is never written to disk or transmitted, and is discarded when the page is navigated away from or closed.

## 4. Permissions Justification

| Permission | Purpose | Scope |
|---|---|---|
| `tabs` | Read the active tab's URL to detect reddit.com pages and enable the popup's status display | Read-only, active tab only |
| Content script on `https://www.reddit.com/*` | Remove injected search link elements from comment threads | reddit.com pages only |

No other permissions are requested. The Extension does not request access to browsing history, cookies, downloads, bookmarks, clipboard, or any other browser data.

## 5. Third-Party Services

The Extension itself makes zero network requests. No API calls, no analytics pings, no update checks beyond Chrome's standard extension update mechanism.

The Extension's popup contains two optional links that open in a new tab when clicked by the user:

- **GitHub** (github.com): Links to the Extension's open-source repository
- **Buy Me a Coffee** (buymeacoffee.com): Links to a voluntary support page

These are standard hyperlinks. Clicking them is entirely voluntary and navigates you to third-party websites governed by their own privacy policies. The Extension does not pre-fetch, ping, or communicate with these sites in any way unless you explicitly click the link.

## 6. Data Sharing

We do not share any data with any third party because we do not collect any data. There is nothing to share.

## 7. Data Retention

No data is retained. The Extension's `sessionStorage` value and in-memory counter are automatically cleared by the browser when the tab is closed. No data is written to local storage, IndexedDB, cookies, or any other persistent mechanism.

## 8. Children's Privacy

The Extension does not collect any information from anyone, including children under the age of 13. It is compliant with the Children's Online Privacy Protection Act (COPPA).

## 9. Security

Because the Extension does not collect, store, or transmit any data, there is no user data at risk. The Extension's source code is open source and available for review at https://github.com/2xNeil/reddit-comment-cleaner.

## 10. Your Rights

Since we collect no data, there is no personal data to access, correct, delete, or export. You may uninstall the Extension at any time through your browser's extension management page, which will immediately remove all Extension code and the temporary session data from your browser.

## 11. Changes to This Policy

If we update this privacy policy, the revised version will be published with the Extension update and the "Last updated" date above will be changed. Continued use of the Extension after changes constitutes acceptance of the updated policy.

## 12. Open Source

The Extension's complete source code is publicly available at https://github.com/2xNeil/reddit-comment-cleaner. You may audit exactly what the Extension does at any time.

## 13. Contact

If you have questions about this privacy policy, you can reach us through:

- GitHub Issues: https://github.com/2xNeil/reddit-comment-cleaner/issues
