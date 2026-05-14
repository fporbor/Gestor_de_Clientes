import db from './../../../models/db.js';

const Customer = db.customers;

export const deleteCustomer = async (id, userId) => {
    const customer = await Customer.findOne({ where: { id, userId } });
    if (!customer) return null;
    return await customer.destroy();
};