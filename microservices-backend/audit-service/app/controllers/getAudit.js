// app/controllers/getAuditController.js
import { getAuditDAL } from "./data-access-layer/getAuditDAL.js";

export const getAuditController = async (req, res) => {
  try {
    const { userId, email, action } = req.query;

    const logs = await getAuditDAL({
      userId,
      email,
      action
    });

    res.json(logs);
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ error: "Error fetching audit logs" });
  }
};



