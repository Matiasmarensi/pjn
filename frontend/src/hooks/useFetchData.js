// useFetchData.js
import { useState, useEffect } from "react";

const useFetchData = (initialUrl) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [initialData, setInitialData] = useState([]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const response = await fetch(initialUrl);
      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      const data = await response.json();

      setInitialData(data);
      setResult(data);
    } catch (error) {
      console.error("Error al obtener datos iniciales:", error);
    } finally {
      setLoading(false);
    }
  };
  const cleanData = async () => {
    // Remove from database with http route

    try {
      //alerta para confirmar
      const confirmed = window.confirm("¿Seguro que quieres borrar todos los expedientes?");
      if (!confirmed) {
        console.log("Eliminación cancelada");
        return; // Salir de la función si el usuario canceló
      }
      const response = await fetch(initialUrl, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      setResult([]);
    } catch (error) {
      console.log("Error al limpiar datos:", error);
    }
  };
  const handleSearch = async (inputValue) => {
    setLoading(true);

    try {
      const response = await fetch(initialUrl, {
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

      setResult(data ? [...initialData, ...data] : initialData);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [initialUrl]);

  return { loading, result, initialData, handleSearch, cleanData };
};

export default useFetchData;
