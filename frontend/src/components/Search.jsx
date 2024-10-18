// SearchBar.jsx
import { useState } from "react";

const SearchBar = ({ inputValue, setInputValue, handleSubmit, loading, handleCleanData }) => {
  const formatInputValue = () => {
    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const formatted = lines.join(", ");
    setInputValue(formatted);
  };

  return (
    <div className="flex flex-col w-1/8  p-4 ">
      <textarea
        className="bg-gray-300 p-4 rounded-md text-m resize-none mb-4 h-72"
        placeholder="Expedientes (Ej. 215/2022, 5821/2021)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={formatInputValue}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg text-s px-5 py-3 transition duration-300"
        >
          Acomodar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg text-s px-5 py-3 transition duration-300"
        >
          Buscar
        </button>
        {loading && <p className="text-white">Cargando...</p>}
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-semibold rounded-lg text-s px-5 py-3 transition duration-300"
          onClick={handleCleanData}
        >
          Limpiar Datos
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
