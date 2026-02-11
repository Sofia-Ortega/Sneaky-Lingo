import { useEffect, useRef, useState } from "react";
import TableRow from "./TableRow";
import type { IWord } from "../functions/types";
import {
  addToLocalStorage,
  disableExtension,
  disableWordInLocalStorage,
  isExtensionDisabledGlobally,
  loadLocalStorage,
  removeFromLocalStorage,
} from "../functions/localStorage";
import ErrorSnackbar from "./shared/ErrorSnackbar";

export default function TableContainer() {
  const [words, setWords] = useState<IWord[]>([]);

  const [originalWord, setOriginalWord] = useState("");
  const [replaceWord, setReplaceWord] = useState("");
  const [extensionDisabled, setExtensionDisabled] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");

  const originalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const wordsFromLocalStorage = await loadLocalStorage();
      setWords(wordsFromLocalStorage);
    })();

    (async () => {
      const disabledState = await isExtensionDisabledGlobally();
      setExtensionDisabled(disabledState);
    })();
  }, []);

  const handleAddWord = async () => {
    if (!originalWord || !replaceWord) return;

    setErrorMsg("");

    const newWord: IWord = {
      originalWord,
      replaceWord,
      disabled: false,
    };

    try {
      await addToLocalStorage(newWord);
      setWords((prev) => [newWord, ...prev]);

      setOriginalWord("");
      setReplaceWord("");
    } catch (e) {
      if (e instanceof Error) {
        setErrorMsg(e.message);
      } else {
        setErrorMsg("Unexpected error occurred");
      }
    }
  };

  const deleteRow = (originalWord: string) => {
    setWords((prev) =>
      prev.filter((word) => word.originalWord !== originalWord),
    );
    removeFromLocalStorage(originalWord);
  };

  const disableRow = (originalWord: string, disabled: boolean) => {
    setWords((prev) =>
      prev.map((word) =>
        word.originalWord === originalWord
          ? { ...word, disabled: disabled }
          : word,
      ),
    );

    disableWordInLocalStorage(originalWord, disabled);
  };

  const toggleDisableAll = () => {
    const newDisabledState = !extensionDisabled;
    setExtensionDisabled(newDisabledState);
    disableExtension(newDisabledState);
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
    <div className="my-6">
      {errorMsg && <ErrorSnackbar errorMsg={errorMsg} />}

      <table
        id="words-table"
        className="my-2 border-separate border-spacing-x-4"
      >
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
              key={w.originalWord}
              extensionDisabled={extensionDisabled}
              disableRow={disableRow}
              deleteRow={deleteRow}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
