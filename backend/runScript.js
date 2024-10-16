import { getAllExpedientes } from "./controllers/getAll.js";
import openBrowser from "./index.js";
import express from "express";

// Crear el router
const router = express.Router();

router.post("/", async (req, res) => {
  const { data } = req.body;

  console.log("body", data);

  // Validar que expediente y año están presentes en el body
  if (!data) {
    return res.status(400).json({ error: "Faltan parámetros: expediente o año." });
  }

  try {
    // Ejecutar Puppeteer con los datos proporcionados
    const result = await openBrowser(data);
    console.log("result de runScript", result);

    res.json(result);
  } catch (error) {
    console.error("Error ejecutando Puppeteer:", error);
    res.status(500).json({ error: "Error ejecutando el script de Puppeteer" });
  }
});

router.get("/", async (req, res) => {
  try {
    const expedientes = await getAllExpedientes();
    console.log("expedientes", expedientes);

    if (expedientes) {
      res.status(200).json(expedientes);
    } else {
      res.status(404).json({ error: "No se encontraron expedientes" });
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
