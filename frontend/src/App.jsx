import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  console.log(result);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: inputValue }),
      });

      // Verificar si la respuesta es válida y tiene contenido
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text(); // Leer la respuesta como texto
      const data = text ? JSON.parse(text) : {}; // Solo parsear si no está vacía
      setResult(data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatInputValue = () => {
    const lines = inputValue
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const formatted = lines.join(",");
    setInputValue(formatted);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <form className="w-50" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="expedientes" className="form-label text-dark  fs-4 underline">
            Ingrese los expedientes:
          </label>

          <textarea
            className="form-control p-3 text-dark"
            id="expedientes"
            rows="5"
            placeholder="Ej. 215/2022, 5821/2021"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="button" onClick={formatInputValue} className="btn btn-outline-primary">
            Acomodar
          </button>
          <button type="submit" className="btn btn-success">
            Buscar
          </button>
        </div>
      </form>
      {loading && <div className="mt-3 text-dark">Cargando...</div>}
      {result && (
        <div className="mt-3 text-dark">
          <strong>Resultado:</strong> {JSON.stringify(result)}
        </div>
      )}
    </div>
  );
}

export default App;
