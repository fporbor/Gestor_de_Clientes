import db from '../../../models/db.js';
const User = db.users;

export const LogoutControllerDAL = async (id) => {
    return await User.findOne({
        where: { id },
        attributes: ['id', 'active'] 
    });
};