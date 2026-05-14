// app/controllers/data-access-layer/getAuditByIdDAL.js
import db from "../../models/db.js";
const { Audit } = db.models;

export const getAuditByIdDAL = async (id) => {

  if (!id) {
    throw new Error("No se recibió un ID válido");
  }
  const log = await Audit.findByPk(id);

  if (!log) {
    throw new Error("No existe un registro con ese ID");
  }
  return log;
};
