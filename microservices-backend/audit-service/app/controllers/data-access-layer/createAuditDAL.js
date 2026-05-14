// app/controllers/data-access-layer/createAuditDAL.js
import db from "../../models/db.js";

const { Audit } = db.models;

export const createAuditDAL = async (auditData) => {
  if (!auditData) {
    throw new Error("No se recibió información para crear la auditoría");
  }

  const newAudit = await Audit.create(auditData);

  return newAudit;
};
