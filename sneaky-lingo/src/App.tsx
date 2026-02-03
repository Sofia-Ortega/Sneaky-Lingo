import { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import ImportPage from "./pages/ImportPage";

function App() {
  const [page, setPage] = useState(0);

  return (
    <div className=" w-150 border border-black p-4">
      {page == 0 && <HomePage setPage={setPage} />}
      {page == 1 && <ImportPage setPage={setPage} />}
    </div>
  );
}

export default App;
