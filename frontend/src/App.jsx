import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [initialData, setInitialData] = useState([]); // Estado para datos iniciales

  // Función para obtener datos de la base de datos al cargar el componente
  const fetchInitialData = async () => {
    try {
      const response = await fetch("http://localhost:3000/run");
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      const data = await response.json();
      setInitialData(data); // Guarda los datos en el estado
      setResult(data); // También establece los resultados iniciales
    } catch (error) {
      console.error("Error al obtener datos iniciales:", error);
    }
  };

  useEffect(() => {
    fetchInitialData(); // Llama a la función al montar el componente
  }, []);

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

      // Actualiza el resultado combinando los datos de la búsqueda y los datos iniciales
      setResult(data ? [...initialData, ...data] : initialData);
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
    const formatted = lines.join(", ");
    setInputValue(formatted);
  };

  return (
    <div className="flex h-screen bg-gray-800">
      {/* Barra de navegación lateral */}
      <div className="flex flex-col w-1/4 p-4">
        <textarea
          className="bg-gray-300 p-4 rounded-md text-lg resize-none mb-4 h-72" // Aumenta la altura aquí
          placeholder="Expedientes (Ej. 215/2022, 5821/2021)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={formatInputValue}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg text-lg px-5 py-3 transition duration-300"
          >
            Acomodar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg px-5 py-3 transition duration-300"
          >
            Buscar
          </button>
        </div>
        {loading && <p className="text-white">Cargando...</p>}
      </div>

      {/* Contenedor central para mostrar los resultados */}
      <div className="flex-1 p-4 overflow-y-auto">
        {result.length > 0 && (
          <table className="min-w-full bg-gray-800 text-white rounded-lg shadow-md">
            <thead className="bg-blue-600">
              <tr>
                <th className="py-2 px-4 border-b border-gray-700">N°</th>
                <th className="py-2 px-4 border-b border-gray-700">Expediente</th>
                <th className="py-2 px-4 border-b border-gray-700">Jurisdicción</th>
                <th className="py-2 px-4 border-b border-gray-700">Dependencia</th>
                <th className="py-2 px-4 border-b border-gray-700">Situación Actual</th>
                <th className="py-2 px-4 border-b border-gray-700">Carátula</th>
                <th className="py-2 px-4 border-b border-gray-700">Datos de Origen</th>
              </tr>
            </thead>
            <tbody className="bg-gray-700">
              {result.map((item, index) => (
                <tr key={index} className="hover:bg-gray-600 transition duration-200">
                  <td className="py-2 px-4 border-b border-gray-600">{index + 1}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{item.expediente}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{item.jurisdiccion}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{item.dependencia}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{item.situacionActual}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{item.caratula}</td>
                  <td className="py-2 px-4 border-b border-gray-600">{item.datosDeOrigen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
