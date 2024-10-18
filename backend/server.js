import express from "express";
import cors from "cors";
import expedienteRoutes from "./routes/expedienteRoutes.js";
import { connectDB } from "./db/connectDB.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/run", expedienteRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Servidor corriendo en puerto ${port}`);
});
