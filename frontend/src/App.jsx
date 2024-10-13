import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  const [numero, setNumero] = useState("");
  const [anio, setAnio] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/run-search?numero=${numero}&anio=${anio}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center bg-blue-900 h-screen ">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          {/* Input de Número */}
          <input
            className="bg-slate-200 p-2 rounded-md"
            type="text"
            placeholder="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          {/* Input de Año */}
          <input
            className="bg-slate-200 p-2 rounded-md"
            type="text"
            placeholder="Año"
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
          />
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" type="submit">
          Buscar
        </button>
      </form>
      {loading && <p>Cargando...</p>}
      {result && <div>Resultado: {JSON.stringify(result)}</div>}
    </div>
  );
}

export default App;
