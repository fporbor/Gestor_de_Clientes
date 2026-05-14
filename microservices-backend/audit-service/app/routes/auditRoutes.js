import { getAuditController }              from '../controllers/getAudit.js';
import { getAuditByIdController } from '../controllers/getAuditById.js';
import { createAuditController } from "../controllers/createAudit.js";
import authMiddleware                from '../middlewares/authMiddleware.js';

const auditRoutes = (app) => {
    app.get('/audit-logs',        authMiddleware, getAuditController);
    app.get('/audit-logs/:id',    authMiddleware, getAuditByIdController);
    app.post('/audit-logs',                              createAuditController);
};

export default auditRoutes;