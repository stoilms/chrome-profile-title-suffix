# Chrome Profile Title Suffix

A tiny Chrome extension that appends a suffix of your choice to every page title — so the **Windows window title** tells you which **Chrome profile** you're in.

```
Inbox - Gmail | Work - Google Chrome
Inbox - Gmail | Personal - Google Chrome
```

![Extension popup](docs/screenshot.png)

## Why?

Lots of desktop software identifies what you're doing by reading the active window's title. Chrome's window title is just the page title, so two Chrome profiles look identical — Gmail in your work profile and Gmail in your personal profile produce the same title.

This extension fixes that. Give each Chrome profile its own suffix, and any tool that matches on window titles can now tell your profiles apart.

### Main use case: automatic time tracking

Time trackers such as **Toggl Track** (and others with window-title rules, e.g. ManicTime, Timing, RescueTime, ActivityWatch) can auto-assign time based on the active window title.

1. Do personal browsing in a **Personal** Chrome profile and work in a **Work** profile.
2. Set the suffix to `Personal` in one profile and `Work` (or your work email) in the other.
3. In your time tracker, create rules that match on the window title:
   - title contains `| Work` → your work project / client
   - title contains `| Personal` → your personal project
4. Your time is now tracked to the right project automatically, based on which Chrome profile you were using.

The same trick works for anything else that targets windows by name — AutoHotkey scripts, window managers, screen recorders, automation tools and so on.

## Installation

The extension isn't on the Chrome Web Store, so you load it unpacked:

1. Download the latest release zip from the [Releases page](../../releases) and extract it (or clone this repo).
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the extracted folder.
5. **Repeat steps 2–4 in every Chrome profile** you want to tag — extensions are installed per profile.

## Usage

1. Click the extension's icon in the toolbar (pin it from the puzzle-piece menu for easy access).
2. Type a suffix, e.g. `Work`, `Personal` or `name@company.com`.
3. Press **Enter** or click **Save**.

Every open tab in that profile updates immediately, and new pages get the suffix as they load. The result is `Page title | Your suffix`. Clear the field and save to turn the suffix off.

Each profile stores its own suffix (in `chrome.storage.local`), so set a different one in each profile.

## How it works

- A content script runs on every `http`/`https` page and appends ` | <suffix>` to `document.title`.
- A `MutationObserver` re-applies the suffix whenever the page changes its own title (single-page apps, unread counters, etc.), without ever doubling it up.
- Changing the suffix in the popup swaps it live in all open tabs.
- The only permission requested is `storage`. Nothing is sent anywhere.

## Limitations

- Chrome doesn't allow extensions to run on internal pages, so `chrome://` pages, the New Tab page, the Chrome Web Store and the built-in PDF viewer won't get a suffix.
- Pages that have no `<title>` aren't modified.
- The suffix is also visible in the tab strip, bookmarks and history, as it is part of the page title.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Extension manifest (Manifest V3) |
| `content.js` | Adds and maintains the suffix on each page |
| `popup.html` / `popup.js` | Toolbar popup to set the suffix |

## License

[MIT](LICENSE)
