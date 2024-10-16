import { Expediente } from "../models/expediente.js";
export const getAllExpedientes = async () => {
  try {
    const expedientes = await Expediente.find();

    return expedientes;
  } catch (error) {
    console.error("Error al obtener los expedientes:", error);
    return null;
  }
};
export const checkLastUpdate = async (data) => {
  try {
    //busca si el expediente fue actualizado en la base de datos hace mas de una semana, en caso de que no, verdadero
    const existingExpediente = await Expediente.findOne({ expediente: data.expediente });
    if (existingExpediente) {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      if (existingExpediente.updatedAt < oneWeekAgo) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error checking last update:", error);
    return null;
  }
};
