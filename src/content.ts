// const SKIP_TAGS = new Set([
//   "SCRIPT",
//   "STYLE",
//   "NOSCRIPT",
//   "TEMPLATE",
//   "IFRAME",
// ]);

// function walkAndReplace(node: Node, translations: Record<string, string>) {
//   // Only process text nodes
//   if (
//     node.nodeType === Node.TEXT_NODE &&
//     SKIP_TAGS.has((node as Element).tagName)
//   )
//     return;

//   if (node.nodeType === Node.TEXT_NODE) {
//     let text = node.textContent ?? "";

//     for (const [word, replacement] of Object.entries(translations)) {
//       const wordRegex = new RegExp(`\\b${word}\\b`, "gi"); // 'g' + 'i' for global + case-insensitive

//       text = text.replace(wordRegex, (match) => {
//         const isCapitalized = match[0] === match[0].toUpperCase();
//         const replaced = isCapitalized
//           ? replacement[0].toUpperCase() + replacement.slice(1)
//           : replacement;

//         console.log(`Replacing "${match}" with "${replaced}"`);
//         return replaced;
//       });
//     }

//     if (text !== node.textContent) {
//       node.textContent = text;
//     }
//   } else {
//     // Recurse through child nodes
//     for (const child of Array.from(node.childNodes)) {
//       walkAndReplace(child, translations);
//     }
//   }
// }

// // Start from the <body> of the document
// const translations: Record<string, string> = {
//   chrome: "mwhaahah",
//   scripts: "swoosh",
//   inject: "hiyaaaa",
// };

// if (document.body) {
//   console.log("translations:", translations);
//   chrome.storage.local.get("userInputs", function (result: StorageData) {
//     console.log(result);
//   });

//   walkAndReplace(document.body, translations);
// }
function renderReadingTime(article) {
  // If we weren't provided an article, we don't need to render anything.
  if (!article) {
    return;
  }

  const text = article.textContent;
  const wordMatchRegExp = /[^\s]+/g; // Regular expression
  const words = text.matchAll(wordMatchRegExp);
  // matchAll returns an iterator, convert to array to get word count
  const wordCount = [...words].length;
  const readingTime = Math.round(wordCount / 200);
  const badge = document.createElement("p");
  // Use the same styling as the publish information in an article's header
  badge.classList.add("color-secondary-text", "type--caption");
  badge.textContent = `⏱️ ${readingTime} min read`;

  // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}

renderReadingTime(document.querySelector("article"));

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    // If a new article was added.
    for (const node of mutation.addedNodes) {
      if (node instanceof Element && node.tagName === "ARTICLE") {
        // Render the reading time for this particular article.
        renderReadingTime(node);
      }
    }
  }
});

// https://developer.chrome.com/ is a SPA (Single Page Application) so can
// update the address bar and render new content without reloading. Our content
// script won't be reinjected when this happens, so we need to watch for
// changes to the content.
observer.observe(document.querySelector("devsite-content"), {
  childList: true,
});
