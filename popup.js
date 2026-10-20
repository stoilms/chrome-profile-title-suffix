const STORAGE_KEY = "suffix";
const SEPARATOR = " | ";

const input = document.getElementById("suffix");
const preview = document.getElementById("preview");
const saveButton = document.getElementById("save");
const status = document.getElementById("status");

function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

function updatePreview() {
  const text = clean(input.value);
  preview.textContent = "Example: Page title" + (text ? SEPARATOR + text : "");
}

function save() {
  chrome.storage.local.set({ [STORAGE_KEY]: clean(input.value) }, () => {
    status.textContent = "Saved";
    setTimeout(() => { status.textContent = ""; }, 1500);
  });
}

chrome.storage.local.get({ [STORAGE_KEY]: "" }, (result) => {
  input.value = result[STORAGE_KEY];
  updatePreview();
  input.focus();
  input.select();
});

input.addEventListener("input", updatePreview);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") save();
});
saveButton.addEventListener("click", save);
