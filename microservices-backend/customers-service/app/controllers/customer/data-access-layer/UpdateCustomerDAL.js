import db from './../../../models/db.js';

const Customer = db.customers;

const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';

const isValidDNI = (dni) => {
    const match = dni.trim().toUpperCase().match(/^(\d{8})([A-Z])$/);
    return match !== null;
};

export const updateCustomer = async (id, userId, data) => {
    const customer = await Customer.findOne({ where: { id, userId } });
    if (!customer) return null;

    if (data.dni) {
        if (!isValidDNI(data.dni)) {
            throw new Error('El DNI no es válido.');
        }

        const existing = await Customer.findOne({ where: { dni: data.dni } });
        if (existing && existing.id !== customer.id) {
            throw new Error('El DNI ya está registrado.');
        }
    }

    return await customer.update(data);
};