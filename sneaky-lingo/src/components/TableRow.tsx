import type { IWord } from "../functions/types";
import deleteIcon from "../assets/deleteIcon.png";

interface Props {
  word: IWord;
  deleteRow: (id: string) => void;
  disableRow: (id: string) => void;
}

export default function TableRow({ word, deleteRow, disableRow }: Props) {
  return (
    <tr>
      <td>
        <input
          className="cursor-pointer"
          type="checkbox"
          checked={!word.disabled}
          onClick={() => disableRow(word.id)}
          readOnly
        />
      </td>
      <td className={word.disabled ? "line-through text-gray-400" : ""}>
        {word.originalWord}
      </td>
      <td className={word.disabled ? "line-through text-gray-400" : ""}>
        {word.replaceWord}
      </td>
      <td className="flex justify-center items-center">
        <button onClick={() => deleteRow(word.id)} className="cursor-pointer">
          <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
