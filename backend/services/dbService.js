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
      existingExpediente.updatedAt = Date.now();
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
