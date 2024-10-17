import mongoose from "mongoose";

const expedienteSchema = new mongoose.Schema(
  {
    expediente: {
      type: String,
      required: true,
    },
    jurisdiccion: {
      type: String,
      required: true,
    },
    dependencia: {
      type: String,
      required: true,
    },
    situacionActual: {
      type: String,
    },
    caratula: { type: String },
    datosDeOrigen: { type: String },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: String,
      default: Date.now,
    },
    ultimoMovimiento: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Expediente = mongoose.model("Expediente", expedienteSchema);
