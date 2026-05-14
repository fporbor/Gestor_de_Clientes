// app/controllers/getAuditByIdController.js
import { getAuditByIdDAL } from "./data-access-layer/getAuditByIdDAL.js";

export const getAuditByIdController = async (req, res) => {
  try {
    const log = await getAuditByIdDAL(req.params.id);

    if (!log) {
      return res.status(404).json({ message: "Registro no encontrado" });
    }

    res.json(log);
  } catch (error) {
    console.error("Error al obtener el registro:", error);
    res.status(500).json({ message: "Error al obtener el registro" });
  }
};

