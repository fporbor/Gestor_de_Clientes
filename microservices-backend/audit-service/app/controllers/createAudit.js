import { createAuditDAL } from "./data-access-layer/createAuditDAL.js";

export const createAuditController = async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      action,
      entityType,
      entityId,
      serviceName,
      description,
      metadata
    } = req.body;

    const audit = await createAuditDAL({
      userId,
      userEmail,
      action,
      entityType,
      entityId,
      serviceName,
      description,
      metadata
    });

    res.status(201).json(audit);
  } catch (err) {
    console.error("Error creando auditoría:", err);
    res.status(500).json({ error: "Error creando auditoría" });
  }
};

