import express from "express";
import { obtenerExpedientes, procesarExpedientes } from "../controllers/expedienteController.js";

const router = express.Router();

router.get("/", obtenerExpedientes);
router.post("/", procesarExpedientes);

export default router;
