import openBrowser from "./index.js";
import express from "express";

// Crear el router
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("hola");
  const { expediente, anio } = req.body;

  // Validar que expediente y año están presentes en el body
  if (!expediente || !anio) {
    return res.status(400).json({ error: "Faltan parámetros: expediente o año." });
  }

  try {
    // Ejecutar Puppeteer con los datos proporcionados
    const result = await openBrowser(expediente, anio);
    res.json({ message: "Script ejecutado correctamente", result });
  } catch (error) {
    console.error("Error ejecutando Puppeteer:", error);
    res.status(500).json({ error: "Error ejecutando el script de Puppeteer" });
  }
});

export default router;
