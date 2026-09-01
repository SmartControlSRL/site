# Manual screen-reader review

Status: **pending owner-assisted manual verification**

Prepared: 2026-09-01

Automated DOM, focus, keyboard, resize, label, language, and contrast checks are
blocking in CI. They do not prove how a real screen reader voices a language
switch, so this checklist must be completed by a reviewer using the named
assistive technology before issue #29 is closed.

## Environments

- macOS Safari with current VoiceOver.
- Windows Firefox or Chrome with current NVDA.

Record the OS, browser, screen-reader version, reviewer, date, and result below.
Do not replace the manual result with a browser accessibility-tree snapshot.

## Routes and expected result

1. `/servicii/`: the exposed hub link is announced as the single current page;
   the hidden mobile/desktop copy is not announced.
2. `/servicii/cloud/`: only Cloud is current; the Services parent may be
   visually highlighted but is not announced as current.
3. `/en/solutii/`: only Solutions is current.
4. `/en/solutii/seknet/`: only SEKNET is current.
5. On a Romanian route, the visible `EN` token and Romanian accessible name are
   voiced naturally, with the token pronounced as English because `lang="en"`.
6. On an English route, the visible `RO` token and English accessible name are
   voiced naturally, with the token pronounced as Romanian because `lang="ro"`.
7. Escape closes the mobile menu or desktop submenu and returns focus to the
   control that opened it. Focus never falls back to the document body.

## Result record

| Environment | Reviewer | Date | Result | Notes |
|---|---|---|---|---|
| VoiceOver + Safari | Pending | Pending | Pending | |
| NVDA + Firefox/Chrome | Pending | Pending | Pending | |
