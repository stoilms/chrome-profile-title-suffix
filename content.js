const SEPARATOR = " | ";
const STORAGE_KEY = "suffix";

// The full string appended to titles (separator + user text), or "" when no suffix is set
let fullSuffix = "";

// Watch for any dynamic modifications to the title tag
const observer = new MutationObserver(applySuffix);

function startObserving() {
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });
}

// Run a title change with the observer paused to prevent an infinite loop
function withObserverPaused(fn) {
  observer.disconnect();
  try {
    fn();
  } finally {
    startObserving();
  }
}

function buildSuffix(text) {
  // document.title collapses whitespace, so normalise to keep the endsWith check reliable
  const clean = (text || "").replace(/\s+/g, " ").trim();
  return clean ? SEPARATOR + clean : "";
}

function applySuffix() {
  if (!fullSuffix || !document.title || document.title.endsWith(fullSuffix)) return;
  withObserverPaused(() => {
    document.title = document.title + fullSuffix;
  });
}

// Swap the suffix live: strip the old one, then apply the new one
function setSuffix(text) {
  const next = buildSuffix(text);
  if (next === fullSuffix) return;

  if (fullSuffix && document.title.endsWith(fullSuffix)) {
    withObserverPaused(() => {
      document.title = document.title.slice(0, -fullSuffix.length);
    });
  }

  fullSuffix = next;
  applySuffix();
}

// Load the saved suffix, then start tracking title changes
chrome.storage.local.get({ [STORAGE_KEY]: "" }, (result) => {
  fullSuffix = buildSuffix(result[STORAGE_KEY]);
  startObserving();
  applySuffix();
});

// Update every open tab as soon as the suffix is saved in the popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes[STORAGE_KEY]) {
    setSuffix(changes[STORAGE_KEY].newValue);
  }
});

// Safety net in case the title is not yet available at document_start
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", applySuffix);
}
