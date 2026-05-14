import { deleteCustomer } from './data-access-layer/DeleteCustomerDAL.js';
import db from "../../models/db.js";

const { Customer } = db.models;

export const deleteCustomerController = async (req, res, next) => {
    try {
        const customerBeforeDelete = await Customer.findByPk(req.params.id);

        if (!customerBeforeDelete) {
            return res.status(404).json({ error: { message: 'Cliente no encontrado' } });
        }

        const deletedCustomerId = customerBeforeDelete.id;
        const deletedCustomerName = customerBeforeDelete.name;

        await deleteCustomer(req.params.id, req.userId);

        fetch("http://audit-service:3600/audit-logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": req.headers.authorization
            },
            body: JSON.stringify({
                userId: req.userId,
                userEmail: req.userEmail,
                action: "CUSTOMER_DELETED",
                entityType: "Customer",
                entityId: deletedCustomerId,
                serviceName: "customers-service",
                description: "Se eliminó un cliente",
                metadata: {
                    Id: deletedCustomerId,
                    Name: deletedCustomerName
                }
            })
        }).catch(err => {
            console.error("Error enviando auditoría:", err.message);
        });
        res.status(200).json({ message: 'Cliente eliminado' });
    } catch (err) {
        next(err);
    }
};

