const addButton = document.getElementById("add-word-btn") as HTMLButtonElement;
const originalInput = document.getElementById(
  "original-word",
) as HTMLInputElement;
const replaceInput = document.getElementById(
  "replace-word",
) as HTMLInputElement;
const table = document.getElementById("words-table") as HTMLTableElement;
const rowsPlaceholderTop = document.getElementById(
  "rows-placeholder-top",
) as HTMLTableRowElement;

const rowsPlaceholderBottom = document.getElementById(
  "rows-placeholder-bottom",
) as HTMLTableRowElement;

addButton.addEventListener("click", () => {
  const originalWord: string = originalInput.value.trim();
  const replaceWord: string = replaceInput.value.trim();

  if (!originalWord || !replaceWord) return;

  addToLocalStorage(originalWord, replaceWord);
  addTableRow(originalWord, replaceWord, false, true);

  originalInput.value = "";
  replaceInput.value = "";
});

document.addEventListener("click", (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.classList.contains("remove-btn")) return;

  const row = target.closest("tr");
  if (!row) return;

  // Assumes column order:
  // [checkbox, originalWord, replaceWord, removeBtn]
  const originalWord = row.children[1]?.textContent?.trim();
  if (!originalWord) return;

  removeFromLocalStorage(originalWord);
  row.remove();
});

const addTableRow = (
  originalWord: string,
  replaceWord: string,
  disabled: boolean,
  insertTop: boolean,
) => {
  const row = document.createElement("tr");

  const checkboxCell = document.createElement("td");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = disabled;
  checkboxCell.appendChild(checkbox);

  const originalCell = document.createElement("td");
  originalCell.textContent = originalWord;

  const replaceCell = document.createElement("td");
  replaceCell.textContent = replaceWord;

  const removeCell = document.createElement("td");
  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "-";
  removeCell.appendChild(removeBtn);

  row.append(checkboxCell, originalCell, replaceCell, removeCell);

  if (insertTop) {
    if (rowsPlaceholderTop.parentElement && rowsPlaceholderTop) {
      rowsPlaceholderTop.parentElement.insertBefore(row, rowsPlaceholderTop);
    }
  } else {
    if (rowsPlaceholderBottom.parentElement && rowsPlaceholderBottom) {
      rowsPlaceholderBottom.parentElement.insertBefore(
        row,
        rowsPlaceholderBottom,
      );
    }
  }

  checkbox.addEventListener("change", () => {
    chrome.storage.local.get(TRANSLATION_KEY, (result) => {
      const translations: Record<string, ITranslationStorage> =
        result[TRANSLATION_KEY] || {};
      if (translations[originalWord.toLowerCase()]) {
        translations[originalWord.toLowerCase()].disable = checkbox.checked;
        chrome.storage.local.set({ [TRANSLATION_KEY]: translations });
      }
    });
  });
};

interface ITranslationStorage {
  replace: string;
  disable: boolean;
}

const addToLocalStorage = (original: string, replace: string) => {
  chrome.storage.local.get(TRANSLATION_KEY, (result) => {
    let translations: Record<string, ITranslationStorage> =
      result[TRANSLATION_KEY] || {};

    translations[original.toLowerCase()] = {
      replace,
      disable: false, // default
    };

    chrome.storage.local.set({ [TRANSLATION_KEY]: translations }, () => {});
  });
};

const removeFromLocalStorage = (originalWord: string) => {
  chrome.storage.local.get(TRANSLATION_KEY, (result) => {
    const translations = result[TRANSLATION_KEY] || {};

    delete translations[originalWord.toLowerCase()];

    chrome.storage.local.set({ [TRANSLATION_KEY]: translations }, () => {
      console.log("Removed:", originalWord);
    });
  });
};

const disableWordInLocalStorage = (originalWord: string, disabled: boolean) => {
  chrome.storage.local.get(TRANSLATION_KEY, (result) => {
    const translations: Record<string, ITranslationStorage> =
      result[TRANSLATION_KEY] || {};
    if (translations[originalWord.toLowerCase()]) {
      translations[originalWord.toLowerCase()].disable = disabled;
      chrome.storage.local.set({ [TRANSLATION_KEY]: translations });
    }
  });
};

const loadLocalStorage = () => {
  chrome.storage.local.get(TRANSLATION_KEY, function (result) {
    let translations: Record<string, ITranslationStorage> =
      result[TRANSLATION_KEY] || {};

    Object.entries(translations)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([originalWord, data]) => {
        addTableRow(originalWord, data.replace, data.disable, false);
      });
  });
};

loadLocalStorage();
