function walkAndReplace(node, translations2) {
  if (node.nodeType === Node.TEXT_NODE) {
    let text = node.textContent ?? "";
    for (const [word, replacement] of Object.entries(translations2)) {
      const wordRegex = new RegExp(`\\b${word}\\b`, "gi");
      text = text.replace(wordRegex, (match) => {
        const isCapitalized = match[0] === match[0].toUpperCase();
        const replaced = isCapitalized ? replacement[0].toUpperCase() + replacement.slice(1) : replacement;
        console.log(`Replacing "${match}" with "${replaced}"`);
        return replaced;
      });
    }
    node.textContent = text;
  } else {
    for (const child of Array.from(node.childNodes)) {
      walkAndReplace(child, translations2);
    }
  }
}
const translations = {
  chrome: "mwhaahah",
  scripts: "swoosh",
  inject: "hiyaaaa"
};
if (document.body) {
  console.log("translations:", translations);
  walkAndReplace(document.body, translations);
}
