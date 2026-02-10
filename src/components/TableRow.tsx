import type { IWord } from "../functions/types";
import deleteIcon from "../assets/deleteIcon.png";

interface Props {
  word: IWord;
  extensionDisabled: boolean;
  deleteRow: (originalWord: string) => void;
  disableRow?: (originalWord: string, disabled: boolean) => void;
}

export default function TableRow({
  word,
  extensionDisabled,
  deleteRow,
  disableRow,
}: Props) {
  const handleCheckboxClick = () => {
    if (!disableRow) return;
    disableRow(word.originalWord, !word.disabled);
  };

  return (
    <tr
      className={disableRow ? "" : " border-b last:border-b-0 border-gray-900"}
    >
      {disableRow && (
        <td>
          <input
            className={extensionDisabled ? "" : "cursor-pointer"}
            type="checkbox"
            disabled={extensionDisabled}
            checked={!word.disabled}
            onClick={handleCheckboxClick}
            readOnly
          />
        </td>
      )}
      <td
        className={`
          py-3
          px-2
          ${word.disabled || extensionDisabled ? "line-through text-gray-400" : ""}`}
      >
        {word.originalWord}
      </td>
      <td
        className={`
          px-2
          ${word.disabled || extensionDisabled ? "line-through text-gray-400" : ""}`}
      >
        {word.replaceWord}
      </td>
      <td>
        <button
          onClick={() => deleteRow(word.originalWord)}
          className="cursor-pointer"
        >
          <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
