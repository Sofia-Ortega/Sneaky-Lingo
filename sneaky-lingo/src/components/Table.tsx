import { useState } from "react";
import TableRow from "./TableRow";
import type { IWord } from "../types";

export default function Table() {
  const [words, setWords] = useState<IWord[]>([
    {
      id: "1",
      originalWord: "orange",
      replaceWord: "pumpkin",
      disabled: false,
    },
  ]);
  const [originalWord, setOriginalWord] = useState("");
  const [replaceWord, setReplaceWord] = useState("");

  const handleAddWord = () => {
    if (!originalWord || !replaceWord) return;

    setWords((prev) => [
      {
        id: `${Date.now()}-${Math.random()}`,
        originalWord,
        replaceWord,
        disabled: false,
      },
      ...prev,
    ]);

    setOriginalWord("");
    setReplaceWord("");
  };

  const deleteRow = (id: string) => {
    setWords((prev) => prev.filter((word) => word.id !== id));
  };

  const disableRow = (id: string) => {
    setWords((prev) =>
      prev.map((word) =>
        word.id === id ? { ...word, disabled: !word.disabled } : word,
      ),
    );
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
          <td></td>
          <td>
            <input
              type="text"
              value={originalWord}
              onChange={(e) => setOriginalWord(e.target.value)}
              className="border rounded-sm"
            />
          </td>
          <td>
            <input
              type="text"
              value={replaceWord}
              onChange={(e) => setReplaceWord(e.target.value)}
              className="border rounded-sm"
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
            disableRow={disableRow}
            deleteRow={deleteRow}
          />
        ))}
      </tbody>
    </table>
  );
}
