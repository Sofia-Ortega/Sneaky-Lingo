import { useRef, useState } from "react";
import Header from "../components/shared/Header";

export default function ImportPage() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(0);

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
    console.log("Import");
    fileInputRef.current?.click(); // open file explorer
  };

  const onFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("Selected file:", file.name);
    console.log("Type:", file.type);

    // TODO: parse file here
  };

  return (
    <div className="flex flex-col h-100 justify-between items-center">
      <Header>{textContent.header[mode]}</Header>
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
      <div className="text-mutedsand">{textContent.extra[mode]}</div>
    </div>
  );
}
