import express from "express";
import { obtenerExpedientes, procesarExpedientes, borrarExpedientes } from "../controllers/expedienteController.js";
import { verificarSesion } from "../Middleware/verifySession.js";

const router = express.Router();

router.get("/", obtenerExpedientes);
router.post("/", procesarExpedientes);
router.delete("/", borrarExpedientes);
router.delete("/:_id", borrarExpedientes);

export default router;
