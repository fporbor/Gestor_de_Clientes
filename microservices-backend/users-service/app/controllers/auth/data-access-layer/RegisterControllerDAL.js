// fichero: authDAL.js

import db from '../../../models/db.js';

const User = db.users;


export const RegisterEmailDAL = async (email) => {
    return await User.findOne({ where: { email } });
};

// Crea un usuario nuevo
export const RegisterUserDAL = async ({ name, email, passwordHash }) => {
    return await User.create({ name, email, passwordHash });
};
