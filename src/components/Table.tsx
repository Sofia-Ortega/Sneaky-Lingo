import { useEffect, useRef, useState } from "react";
import TableRow from "./TableRow";
import type { IWord } from "../functions/types";
import {
  addToLocalStorage,
  disableExtension,
  disableWordInLocalStorage,
  loadLocalStorage,
  removeFromLocalStorage,
} from "../functions/localStorage";

export default function Table() {
  const [words, setWords] = useState<IWord[]>([]);

  const [originalWord, setOriginalWord] = useState("");
  const [replaceWord, setReplaceWord] = useState("");
  const [extensionDisabled, setExtensionDisabled] = useState(false);

  const originalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const wordsFromLocalStorage = await loadLocalStorage();
      setWords(wordsFromLocalStorage);
    })();
  });

  const handleAddWord = () => {
    if (!originalWord || !replaceWord) return;
    const id = crypto.randomUUID();
    const newWord: IWord = {
      id,
      originalWord,
      replaceWord,
      disabled: false,
    };

    setWords((prev) => [newWord, ...prev]);

    addToLocalStorage(newWord);

    setOriginalWord("");
    setReplaceWord("");
  };

  const deleteRow = (id: string) => {
    setWords((prev) => prev.filter((word) => word.id !== id));
    removeFromLocalStorage(id);
  };

  const disableRow = (id: string, disabled: boolean) => {
    setWords((prev) =>
      prev.map((word) =>
        word.id === id ? { ...word, disabled: disabled } : word,
      ),
    );

    disableWordInLocalStorage(id, disabled);
  };

  const toggleDisableAll = () => {
    const newDisabledState = !extensionDisabled;
    setExtensionDisabled(newDisabledState);
    disableExtension();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (originalWord && replaceWord) {
        handleAddWord();
        requestAnimationFrame(() => {
          originalInputRef.current?.focus();
        });
      }
    }
  };

  return (
    <table id="words-table" className="my-8 border-separate border-spacing-x-4">
      <thead>
        <tr>
          <th></th>
          <th className="text-xs">ORIGINAL</th>
          <th className="text-xs">REPLACE</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <input
              className="cursor-pointer"
              type="checkbox"
              checked={!extensionDisabled}
              onClick={toggleDisableAll}
              readOnly
            />
          </td>

          <td>
            <input
              ref={originalInputRef}
              type="text"
              value={originalWord}
              onChange={(e) => setOriginalWord(e.target.value)}
              className="border rounded-sm focus:outline-none focus:ring-1 "
              onKeyDown={onKeyDown}
            />
          </td>

          <td>
            <input
              type="text"
              value={replaceWord}
              onChange={(e) => setReplaceWord(e.target.value)}
              className="border rounded-sm focus:outline-none focus:ring-1 "
              onKeyDown={onKeyDown}
            />
          </td>

          <td>
            <button
              onClick={handleAddWord}
              className="cursor-pointer text-3xl font-bold flex items-center justify-center bg-sky-300 rounded-full w-8 h-8"
            >
              <span className="-translate-y-px text-desertnight">+</span>
            </button>
          </td>
        </tr>
        <tr className="h-2"></tr>

        {words.map((w) => (
          <TableRow
            word={w}
            key={w.id}
            extensionDisabled={extensionDisabled}
            disableRow={disableRow}
            deleteRow={deleteRow}
          />
        ))}
      </tbody>
    </table>
  );
}
