const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "TEMPLATE",
  "IFRAME",
]);

const CONTENT_TRANSLATION_KEY = "translations";
const CONTENT_EXTENSION_DISABLED_KEY = "extensionDisabled";

interface ITranslationStorage {
  replace: string;
  disable: boolean;
}

function walkAndReplace(
  node: Node,
  translations: Record<string, ITranslationStorage>,
) {
  // Only process text nodes
  if (
    node.nodeType === Node.TEXT_NODE &&
    SKIP_TAGS.has((node as Element).tagName)
  )
    return;

  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent ?? "";

    for (const [word, data] of Object.entries(translations)) {
      if (data.disable) continue;

      const wordRegex = new RegExp(`\\b${word}\\b`, "gi"); // 'g' + 'i' for global + case-insensitive

      text = text.replace(wordRegex, (match) => {
        const isCapitalized = match[0] === match[0].toUpperCase();
        const replacement = isCapitalized
          ? data.replace[0].toUpperCase() + data.replace.slice(1)
          : data.replace;

        return replacement;
      });
    }

    if (text !== node.textContent) {
      node.textContent = text;
    }
  } else {
    // Recurse through child nodes
    for (const child of Array.from(node.childNodes)) {
      walkAndReplace(child, translations);
    }
  }
}

const loadTranslationsAndRun = () => {
  chrome.storage.local.get(CONTENT_TRANSLATION_KEY, (result) => {
    const translations: Record<string, ITranslationStorage> =
      result[CONTENT_TRANSLATION_KEY] || {};

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
