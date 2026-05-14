import { getCustomerById } from './data-access-layer/GetCustomerByIdDAL.js';

export const getCustomerByIdController = async (req, res, next) => {
    try {
        const customer = await getCustomerById(req.params.id, req.userId);
        if (!customer) return res.status(404).json({ error: { message: 'Cliente no encontrado' } });
        res.status(200).json(customer);
    } catch (err) {
        next(err);
    }
};