import db from '../../../models/db.js';

const User = db.users;

export const LoginControllerDAL = async (email) => {
    // LoginControllerDAL.js
    return await User.findOne({
        where: { email },
        attributes: ['id', 'name', 'email', 'passwordHash', 'role', 'active', 'createdAt']
    });
};