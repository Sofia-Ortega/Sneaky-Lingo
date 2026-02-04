const SKIP_TAGS = /* @__PURE__ */ new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEMPLATE",
  "IFRAME",
]);

const CONTENT_TRANSLATION_KEY = "translations";
const CONTENT_EXTENSION_DISABLED_KEY = "extensionDisabled";

function walkAndReplace(node, translations) {
  if (
    node.nodeType === Node.TEXT_NODE &&
    SKIP_TAGS.has((node.parentElement?.tagName ?? "").toUpperCase())
  )
    return;

  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent ?? "";
    for (const word of Object.values(translations)) {
      if (word.disabled) continue;

      const wordRegex = new RegExp(`\\b${word.originalWord}\\b`, "gi");

      text = text.replace(wordRegex, (match) => {
        const isCapitalized = match[0] === match[0].toUpperCase();
        const replacement = isCapitalized
          ? word.replaceWord[0].toUpperCase() + word.replaceWord.slice(1)
          : word.replaceWord;

        return replacement;
      });
    }

    if (text !== node.textContent) {
      node.textContent = text;
    }
  } else {
    for (const child of Array.from(node.childNodes)) {
      walkAndReplace(child, translations);
    }
  }
}

const loadTranslationsAndRun = () => {
  chrome.storage.local.get(CONTENT_TRANSLATION_KEY, (result) => {
    const translations = result[CONTENT_TRANSLATION_KEY] ?? {};
    if (document.body) {
      walkAndReplace(document.body, translations);
    }
  });
};

chrome.storage.local.get(CONTENT_EXTENSION_DISABLED_KEY, (result) => {
  if (result[CONTENT_EXTENSION_DISABLED_KEY]) {
    console.log("Extension is disabled — skipping");
    return;
  }
  loadTranslationsAndRun();
});
