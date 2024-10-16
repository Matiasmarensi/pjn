import { useState } from "react";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: inputValue }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      setResult(data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatInputValue = () => {
    // Separar las líneas por comas
    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const formatted = lines.join(", ");
    setInputValue(formatted); // Actualiza el textarea con el texto acomodado
  };

  return (
    <div className="flex flex-col justify-center items-center bg-gray-800 h-screen">
      <form className="flex flex-col gap-4 w-1/2" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          {/* Input más grande para los expedientes con año */}
          <textarea
            className="bg-gray-300 p-4 rounded-md w-full h-48 text-lg resize-none"
            type="text"
            placeholder="Expedientes (Ej. 215/2022, 5821/2021)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={formatInputValue}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg text-lg px-5 py-3 transition duration-300"
          >
            Acomodar
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg px-5 py-3 transition duration-300">
            Buscar
          </button>
        </div>
      </form>
      {loading && <p className="text-white">Cargando...</p>}
      {result && <div className="text-white">Resultado: {JSON.stringify(result)}</div>}
    </div>
  );
}

export default App;
