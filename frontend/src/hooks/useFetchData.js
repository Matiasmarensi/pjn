import { useState, useEffect } from "react";

const useFetchData = (initialUrl) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const [initialData, setInitialData] = useState([]);

  const getAuthHeader = () => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    return `Basic ${btoa(`${email}:${password}`)}`;
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: getAuthHeader(),
      };
      console.log("Headers en fetchInitialData:", headers);

      const response = await fetch(initialUrl, { headers });

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
    try {
      const confirmed = window.confirm("¿Seguro que quieres borrar todos los expedientes?");
      if (!confirmed) {
        console.log("Eliminación cancelada");
        return;
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
      const headers = {
        "Content-Type": "application/json",
        Authorization: getAuthHeader(),
      };
      console.log("Headers en handleSearch:", headers);

      const response = await fetch(initialUrl, {
        method: "POST",
        headers,
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
