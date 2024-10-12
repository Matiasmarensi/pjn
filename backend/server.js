import express from "express";
import openBrowser from "./index.js"; // Importar el script de Puppeteer
import runScript from "./runScript.js";

const app = express();
const port = process.env.PORT || 3000;

// Ruta para ejecutar el script de Puppeteer

app.use(express.json());

app.use("/run", runScript);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
