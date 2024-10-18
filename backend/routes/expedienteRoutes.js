import express from "express";
import { obtenerExpedientes, procesarExpedientes, borrarExpedientes } from "../controllers/expedienteController.js";

const router = express.Router();

router.get("/", obtenerExpedientes);
router.post("/", procesarExpedientes);
router.delete("/", borrarExpedientes);

export default router;
