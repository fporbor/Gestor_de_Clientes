import db from './../../../models/db.js';

const User = db.users;

export const GetUserDAL = async (id) => {
    return await User.findByPk(id, {
        attributes: { exclude: ['passwordHash'] }
    });
};