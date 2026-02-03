import Header from "../components/shared/Header";
import Table from "../components/Table";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center">
      <Header>Sneaky Lingo</Header>

      <div className="text-mutedsand mt-1 w-100 text-center">
        Learn your vocab faster by replacing words as you browse the internet!
      </div>

      <Table />

      <div className="flex flex-col gap-3">
        <div className="border-3 border-b-sand px-10 py-2 rounded-sm">
          <button className="cursor-pointer text-sand font-bold">IMPORT</button>
        </div>
        <a
          href="https://buymeacoffee.com/alchemistix"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-purple-400 px-10 py-2 rounded-sm cursor-pointer text-desertnight font-bold"
        >
          SUPPORT
        </a>
      </div>
    </div>
  );
}
