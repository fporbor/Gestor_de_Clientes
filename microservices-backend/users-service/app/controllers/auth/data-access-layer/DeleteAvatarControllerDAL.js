import db from '../../../models/db.js';

const User = db.users;

export const findUserAvatar = async (userId) => {
    return await User.findByPk(userId, {
        attributes: ['id', 'email', 'avatar']
    });
};

export const removeAvatarFromDB = async (userId) => {
    return await User.update({ avatar: null }, { where: { id: userId } });
};