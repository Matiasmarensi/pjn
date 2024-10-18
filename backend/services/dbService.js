import { Expediente } from "../models/expediente.js";

export const getAllExpedientes = async () => {
  try {
    return await Expediente.find();
  } catch (error) {
    console.error("Error al obtener los expedientes:", error);
    return null;
  }
};

export const saveExpedienteToDB = async (data) => {
  try {
    const existingExpediente = await Expediente.findOne({ expediente: data.expediente });
    if (existingExpediente) {
      existingExpediente.set(data);
      const fecha = new Date();
      const dia = String(fecha.getUTCDate()).padStart(2, "0");
      const mes = String(fecha.getUTCMonth() + 1).padStart(2, "0");
      const anio = fecha.getUTCFullYear();
      const updatedAt = `${dia}/${mes}/${anio}`; // Formato dd/mm/aaaa
      existingExpediente.actualizado = updatedAt;
      await existingExpediente.save();
      console.log(`Expediente ${data.expediente} actualizado.`);
    } else {
      const newExpediente = new Expediente(data);
      await newExpediente.save();
      console.log(`Expediente ${data.expediente} guardado.`);
    }
  } catch (error) {
    console.error("Error guardando el expediente:", error);
  }
};
