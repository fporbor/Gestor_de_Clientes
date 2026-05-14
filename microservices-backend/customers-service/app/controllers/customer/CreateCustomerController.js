import { createCustomer } from './data-access-layer/CreateCustomerDAL.js';

export const createCustomerController = async (req, res, next) => {
    try {
        const customer = await createCustomer({
            ...req.body,
            userId: req.userId  
        });

        fetch("http://audit-service:3600/audit-logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": req.headers.authorization
            },
            body: JSON.stringify({
                userId: req.userId,
                userEmail: req.userEmail,
                action: "CUSTOMER_CREATED",
                entityType: "Customer",
                entityId: customer.id,
                serviceName: "customers-service",
                description: "Se creó un nuevo cliente",
                metadata: { ...req.body }
            })
        }).catch(err => {
            console.error("Error enviando auditoría:", err.message);
        });
        
        res.status(201).json(customer);
    } catch (err) {
        next(err);
    }
};

