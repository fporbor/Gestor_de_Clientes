import { updateCustomer } from './data-access-layer/UpdateCustomerDAL.js';

export const updateCustomerController = async (req, res, next) => {
    try {
        const customer = await updateCustomer(req.params.id, req.userId, req.body);

        if (!customer) {
            return res.status(404).json({ error: { message: 'Cliente no encontrado' } });
        }

        fetch("http://audit-service:3600/audit-logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": req.headers.authorization
            },
            body: JSON.stringify({
                userId: req.userId,
                userEmail: req.userEmail,
                action: "CUSTOMER_UPDATED",
                entityType: "Customer",
                entityId: customer.id,
                serviceName: "customers-service",
                description: "Se actualizó un cliente",
                metadata: { ...req.body }
            })
        }).catch(err => {
            console.error("Error enviando auditoría:", err.message);
        });
        res.status(200).json(customer);
    } catch (err) {
        next(err);
    }
};

