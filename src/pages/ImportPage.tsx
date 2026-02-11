import { useRef, useState } from "react";
import Header from "../components/shared/Header";
import type { IWord } from "../functions/types";
import ErrorSnackbar from "../components/shared/ErrorSnackbar";
import TableRow from "../components/TableRow";
import { addToLocalStorage } from "../functions/localStorage";

interface Props {
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function ImportPage({ setPage }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [words, setWords] = useState<IWord[] | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const textContent = {
    header: ["Import ANKI", "Import CSV"],
    body: [
      <div>
        In Anki, go to Exports &gt; Select{" "}
        <span className="font-bold">Cards in Plain Text (.txt) </span>&gt;
        Export
      </div>,
      <div>
        Column A should have the original word. <br /> Column B should have the
        word to replace <br /> Separator should be comma
      </div>,
    ],
    extension: [".txt", ".csv"],
    extra: ["", "Pssst, you can use ChatGPT to help you create a word list!"],
  };

  const importFile = () => {
    setErrorMsg("");
    fileInputRef.current?.click(); // open file explorer
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("yo");
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", file.name);
    console.log("Type:", file.type);

    try {
      const ext = file.name.split(".").pop();
      let results: IWord[] | null = null;

      if (ext == "txt") {
        results = await parseTxt(file);
      } else if (ext == "csv") {
        results = await parseCsv(file);
      } else {
        console.log("invalid extension");
        throw new Error("Invalid Extension");
      }

      setWords(results);
    } catch (e) {
      if (e instanceof Error) {
        setErrorMsg(e.message);
      } else {
        setErrorMsg("An unknown error occurred");
        console.error("An unknown error occured", e);
      }
    }
  };

  const parseTxt = async (file: File): Promise<IWord[]> => {
    const text = await file.text();

    const separator = text.includes("#separator:tab") ? "\t" : ",";

    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"))
      .map((line) => {
        const [originalWord, replaceWord] = line.split(separator);

        return {
          id: crypto.randomUUID(),
          originalWord: originalWord?.trim() ?? "",
          replaceWord: replaceWord?.trim() ?? "",
          disabled: false,
        };
      })
      .filter((word) => word.originalWord && word.replaceWord);
  };

  const parseCsv = async (file: File): Promise<IWord[]> => {
    const text = await file.text();

    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#")) // ignore empty or metadata lines
      .map((line) => {
        const [originalWord, replaceWord] = line.split(","); // CSV separator

        return {
          id: crypto.randomUUID(),
          originalWord: originalWord?.trim() ?? "",
          replaceWord: replaceWord?.trim() ?? "",
          disabled: false,
        };
      })
      .filter((word) => word.originalWord && word.replaceWord); // skip incomplete rows
  };

  const deleteRow = (originalWord: string) => {
    setWords((prev) =>
      prev ? prev.filter((word) => word.originalWord !== originalWord) : prev,
    );
  };

  const confirmImport = async () => {
    try {
      if (words) {
        for (const word of words) {
          await addToLocalStorage(word);
        }
      }
      setPage(0);
    } catch (e) {
      if (e instanceof Error) {
        setErrorMsg(e.message);
      } else {
        setErrorMsg("Unknown Error occurred while storing imported words");
      }
    }
  };

  return (
    <div className="flex flex-col h-100 justify-between items-center">
      <Header setPage={setPage}>{textContent.header[mode]}</Header>
      <div className="text-sand">
        <div className="text-center">{textContent.body[mode]}</div>
        <div
          className="text-center text-sky-300 underline cursor-pointer text-sm"
          onClick={() => {
            const link = document.createElement("a");
            link.href = `/example/example${textContent.extension[mode]}`;
            link.download = `example${textContent.extension[mode]}`;
            link.click();
          }}
        >
          example{textContent.extension[mode]}
        </div>
      </div>

      {words ? (
        <>
          <div className="overflow-y-auto max-h-80">
            <table className="border-collapse border-spacing-x-4 min-w-sm">
              <thead></thead>
              <tbody>
                {words.map((w) => (
                  <TableRow
                    word={w}
                    key={w.originalWord}
                    extensionDisabled={false}
                    deleteRow={deleteRow}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <button
              className="cursor-pointer bg-sky-300 hover:bg-sky-400 text-desertnight font-extrabold px-10 py-2 rounded-sm"
              onClick={confirmImport}
            >
              IMPORT
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2">
          {errorMsg && <ErrorSnackbar errorMsg={errorMsg} />}

          <div className="relative inline-flex">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={onFileSelected}
              className="hidden"
            />
            <button
              onClick={importFile}
              className="cursor-pointer bg-sky-300 hover:bg-sky-400 px-6 py-2 rounded-l-sm text-desertnight font-bold"
            >
              IMPORT
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              className="cursor-pointer bg-sky-300 hover:bg-sky-400 px-3 py-2 border-l border-sky-400 rounded-r-sm text-desertnight font-bold"
            >
              {textContent.extension[mode]} ▾
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-1 w-full bg-gray-800 shadow-lg z-10 border-0">
                <button
                  onClick={() => {
                    setMode((mode + 1) % 2);
                    setOpen(false);
                  }}
                  className="cursor-pointer block w-full px-4 py-2 text-left hover:bg-gray-950"
                >
                  {textContent.extension[(mode + 1) % 2]}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-mutedsand">{textContent.extra[mode]}</div>
    </div>
  );
}
