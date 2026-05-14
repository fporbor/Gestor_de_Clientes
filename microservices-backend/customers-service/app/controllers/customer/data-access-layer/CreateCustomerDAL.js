import db from './../../../models/db.js';

const Customer = db.customers;

export const createCustomer = async (data) => {
    const cleanedData = {
        ...data,
        name: data.name?.trim(),
    };

    if (!cleanedData.name) {
        throw new Error('El nombre es obligatorio.');
    }

    return Customer.create(cleanedData);
};
