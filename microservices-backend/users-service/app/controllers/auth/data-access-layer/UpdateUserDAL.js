import db from "./../../../models/db.js";

const User = db.users;

export const updateUserName = async (id, name) => {
    const user = await User.findByPk(id);
    if (!user) return null;
    return await user.update({ name });
};