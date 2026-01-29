import "./App.css";
import Table from "./components/Table";

function App() {
  return (
    <div className="flex flex-col gap-2 justify-center items-center w-150 border border-black p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-sand">Sneaky Lingo</h1>
        <div className="text-sand mt-1">by: Alchemistix</div>
      </div>

      <div className="text-sand mt-1 w-100 text-center">
        Add words to replace your chrome browser history to help learn your
        vocab!
      </div>

      <Table />

      <div className="flex flex-col gap-3">
        <div className="border-3 border-b-sand px-10 py-2 rounded-sm">
          <button className="cursor-pointer text-sand font-bold">IMPORT</button>
        </div>
        <div className="bg-purple-400 px-10 py-2 rounded-sm">
          <button className="cursor-pointer text-desertnight font-bold">
            SUPPORT
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
