import type { ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
};

export default function Header({ children, setPage }: HeaderProps) {
  return (
    <div className="flex flex-row justify-between w-full items-center">
      {setPage ? (
        <button
          onClick={() => setPage(0)}
          className="cursor-pointer border rounded-full h-8 w-8 flex justify-center items-center"
        >
          <div className="font-bold">&lt;</div>
        </button>
      ) : (
        <div></div>
      )}
      <div className="text-center">
        <h1 className="text-6xl font-bold text-sand font-[KirangHaerang]">
          {children}
        </h1>
        <div className="text-sand text-xs">
          by: &nbsp;
          <a
            href="https://www.linkedin.com/in/alchemistix/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Alchemistix
          </a>
        </div>
      </div>
      <div></div>
    </div>
  );
}
