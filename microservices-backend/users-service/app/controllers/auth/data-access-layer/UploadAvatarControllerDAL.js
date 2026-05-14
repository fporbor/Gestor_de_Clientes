import db from '../../../models/db.js';

const User = db.users;

export const updateAvatarInDB = async (userId, avatarPath) => {
    return await User.update({ avatar: avatarPath }, { where: { id: userId } });
};
