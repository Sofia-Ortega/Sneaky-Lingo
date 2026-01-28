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
  addTableRow(originalWord, replaceWord, true);

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
  insertTop: boolean,
) => {
  const row = document.createElement("tr");

  const checkboxCell = document.createElement("td");
  checkboxCell.innerHTML = `<input type="checkbox" />`;

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

  // const inputRow = table.querySelector("#input-row");

  // if (inputRow && inputRow.nextElementSibling) {
  //   table.insertBefore(row, inputRow.nextElementSibling);
  // } else {
  //   table.appendChild(row);
  // }
};

const addToLocalStorage = (original: string, replace: string) => {
  chrome.storage.local.get(TRANSLATION_KEY, function (result) {
    let translations = result[TRANSLATION_KEY] || {};

    translations[original] = replace;

    // Save the updated array back to chrome storage
    chrome.storage.local.set(
      { [TRANSLATION_KEY]: translations },
      function () {},
    );
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

const loadLocalStorage = () => {
  chrome.storage.local.get(TRANSLATION_KEY, function (result) {
    let translations: Record<string, string> = result[TRANSLATION_KEY] || {};

    Object.entries(translations)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([originalWord, replaceWord]) => {
        addTableRow(originalWord, replaceWord, false);
      });
  });
};

loadLocalStorage();
