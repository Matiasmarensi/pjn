import { Expediente } from "./models/expediente.js";

export const saveExpedienteToDB = async (data) => {
  try {
    const existingExpediente = await Expediente.findOne({ expediente: data.expediente });

    if (existingExpediente) {
      // Actualiza si ya existe
      existingExpediente.jurisdiccion = data.jurisdiccion;
      existingExpediente.dependencia = data.dependencia;
      existingExpediente.situacionActual = data.situacionActual;
      existingExpediente.caratula = data.caratula;
      existingExpediente.datosDeOrigen = data.datosDeOrigen;
      existingExpediente.updatedAt = Date.now(); // Actualiza la fecha de actualización
      await existingExpediente.save();
      console.log(`Expediente ${data.expediente} actualizado en la base de datos.`);
    } else {
      // Inserta un nuevo expediente si no existe
      const newExpediente = new Expediente(data);
      await newExpediente.save();
      console.log(`Expediente ${data.expediente} guardado en la base de datos.`);
    }
  } catch (error) {
    console.error("Error guardando en la base de datos:", error);
  }
};
