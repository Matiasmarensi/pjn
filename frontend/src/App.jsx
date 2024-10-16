// App.jsx
import { useState } from "react";
import SearchBar from "./components/Search";
import ResultsTable from "./components/ResultsTable";
import useFetchData from "./hooks/useFetchData"; // Asegúrate de ajustar la ruta según tu estructura
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const { loading, result, initialData, handleSearch } = useFetchData("http://localhost:3000/run");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(inputValue);
  };

  return (
    <div className="flex h-screen bg-gray-800">
      <SearchBar inputValue={inputValue} setInputValue={setInputValue} handleSubmit={handleSubmit} loading={loading} />
      <ResultsTable result={result} />
    </div>
  );
}

export default App;
