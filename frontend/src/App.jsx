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
      const response = await fetch(`/run-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expedientes: inputValue.split(",") }),
      });

      const data = await response.json();
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

  const copyToClipboard = () => {
    if (inputValue) {
      navigator.clipboard
        .writeText(inputValue)
        .then(() => {
          alert("Texto copiado al portapapeles!"); // Mensaje opcional
        })
        .catch((err) => {
          console.error("Error al copiar: ", err);
        });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-blue-900 h-screen">
      <form className="flex flex-col gap-4 w-1/2" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          {/* Input más grande para los expedientes con año */}
          <textarea
            className="bg-slate-200 p-4 rounded-md w-full h-48 text-lg resize-none"
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
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Acomodar
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
            Buscar
          </button>
        </div>
      </form>
      {loading && <p>Cargando...</p>}
      {result && <div>Resultado: {JSON.stringify(result)}</div>}

      <div className="mt-4 text-lg text-white">
        <button
          onClick={copyToClipboard}
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full mt-2"
        >
          Copiar
        </button>
      </div>
    </div>
  );
}

export default App;
