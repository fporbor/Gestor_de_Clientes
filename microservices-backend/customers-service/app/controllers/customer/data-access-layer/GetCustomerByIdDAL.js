import db from './../../../models/db.js';

const Customer = db.customers;

export const getCustomerById = async (id, userId) => {
    return await Customer.findOne({ where: { id, userId } });
};