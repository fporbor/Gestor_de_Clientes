import db from './../../../models/db.js';

const Customer = db.customers;

export const getAllCustomers = async (userId) => {
    return await Customer.findAll({ where: { userId } });
};
