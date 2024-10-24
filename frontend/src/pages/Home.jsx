// App.jsx
import { useState } from "react";
import SearchBar from "../components/Search";
import ResultsTable from "../components/ResultsTable";
import useFetchData from "../hooks/useFetchData"; // Asegúrate de ajustar la ruta según tu estructura
import { Router, Route } from "react-router-dom";
import "../App.css";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const { loading, result, initialData, handleSearch, cleanData } = useFetchData(
    "https://pjn-production.up.railway.app/run"
    //localhost
    // "http://localhost:3000/run"
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(inputValue);
    setInputValue("");
  };
  const handleCleanData = (e) => {
    e.preventDefault();
    cleanData();
  };
  //make it responsive
  return (
    <div className="flex h-screen bg-gray-800">
      <SearchBar
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        loading={loading}
        handleCleanData={handleCleanData}
      />
      <ResultsTable result={result} />
    </div>
  );
}

export default Home;
