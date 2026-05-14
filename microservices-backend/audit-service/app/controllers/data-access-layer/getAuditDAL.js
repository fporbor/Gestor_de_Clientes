// app/controllers/data-access-layer/getAuditDAL.js
import db from "../../models/db.js";
const { Audit } = db.models;

export const getAuditDAL = async (filters) => {
  const where = {};

  if (filters.userId) where.userId = filters.userId;    // Sacamos los valores para el get si existen
  if (filters.email) where.userEmail = filters.email;   // Sacamos los valores para el get si existen
  if (filters.action) where.action = filters.action;    // Sacamos los valores para el get si existen

  const logs = await Audit.findAll({
    where,
    order: [["createdAt", "DESC"]],
  });

  return logs;
};