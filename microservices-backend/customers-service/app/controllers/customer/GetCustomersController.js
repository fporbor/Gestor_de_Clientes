import { getAllCustomers } from './data-access-layer/GetCustomersDAL.js';

export const getCustomers = async (req, res, next) => {
    try {
        const customers = await getAllCustomers(req.userId);
        res.status(200).json(customers);
    } catch (err) {
        next(err);
    }
};
