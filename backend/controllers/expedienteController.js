import { deleteAllExpedientes, getAllExpedientes } from "../services/dbService.js";
import openBrowser from "../services/puppeteerService.js";

export const obtenerExpedientes = async (req, res) => {
  try {
    const expedientes = await getAllExpedientes();

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
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    // Decodificar Base64 para obtener email y password
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf8");
    const [email, password] = credentials.split(":");

    console.log("Email:", email);
    console.log("Password:", password);
  }

  try {
    const result = await openBrowser(data);
    res.json(result);
  } catch (error) {
    console.error("Error ejecutando Puppeteer:", error);
    res.status(500).json({ error: "Error ejecutando el script de Puppeteer" });
  }
};

export const borrarExpedientes = async (req, res) => {
  try {
    await deleteAllExpedientes();
    res.status(200).json({ message: "Expedientes borrados correctamente" });
  } catch (error) {
    console.error("Error ejecutando Puppeteer:", error);
    res.status(500).json(error);
  }
};
