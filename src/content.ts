function walkAndReplace(node: Node, translations: Record<string, string>) {
  // Only process text nodes
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent ?? "";

    for (const [word, replacement] of Object.entries(translations)) {
      const wordRegex = new RegExp(`\\b${word}\\b`, "gi"); // 'g' + 'i' for global + case-insensitive

      text = text.replace(wordRegex, (match) => {
        const isCapitalized = match[0] === match[0].toUpperCase();
        const replaced = isCapitalized
          ? replacement[0].toUpperCase() + replacement.slice(1)
          : replacement;

        console.log(`Replacing "${match}" with "${replaced}"`);
        return replaced;
      });
    }

    node.textContent = text;
  } else {
    // Recurse through child nodes
    for (const child of Array.from(node.childNodes)) {
      walkAndReplace(child, translations);
    }
  }
}

// Start from the <body> of the document
const translations: Record<string, string> = {
  chrome: "mwhaahah",
  scripts: "swoosh",
  inject: "hiyaaaa",
};

if (document.body) {
  console.log("translations:", translations);
  walkAndReplace(document.body, translations);
}
