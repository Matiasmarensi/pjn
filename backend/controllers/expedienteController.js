import { getAllExpedientes } from "../services/dbService.js";
import openBrowser from "../services/puppeteerService.js";

export const obtenerExpedientes = async (req, res) => {
  try {
    const expedientes = await getAllExpedientes();
    console.log(expedientes);
    if (expedientes) {
      res.status(200).json(expedientes);
    } else {
      res.status(404).json({ error: "No se encontraron expedientes" });
    }
  } catch (error) {
    console.error("Error al obtener expedientes:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

export const procesarExpedientes = async (req, res) => {
  const { data } = req.body;
  if (!data) {
    return res.status(400).json({ error: "Faltan parámetros: expediente o año." });
  }

  try {
    const result = await openBrowser(data);
    res.json(result);
  } catch (error) {
    console.error("Error ejecutando Puppeteer:", error);
    res.status(500).json({ error: "Error ejecutando el script de Puppeteer" });
  }
};
