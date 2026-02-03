import type { ReactNode } from "react";

type HeaderProps = {
  children: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-sand font-[KirangHaerang]">
        {children}
      </h1>{" "}
      <div className="text-sand text-xs">
        by: <span className="underline">Alchemistix</span>
      </div>
    </div>
  );
}
