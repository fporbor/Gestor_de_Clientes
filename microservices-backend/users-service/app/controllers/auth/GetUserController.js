import { GetUserDAL } from './data-access-layer/GetUserDAL.js';

export const getUser = async (req, res, next) => {
    try {
        const user = await GetUserDAL(req.userId);

        if (!user) {
            return res.status(404).json({ error: { message: 'Usuario no encontrado' } });
        }

        // Si el usuario tiene avatar en BD → usarlo
        // Si NO tiene → generar avatar por defecto con iniciales
        const avatar = user.avatar
            ? `${process.env.BASE_URL || `${import.meta.env.VITE_API_URL_USERS}`}/${user.avatar}`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random`;



        return res.status(200).json({
            id: user.id,
            name: user.name,          // <-- NECESARIO
            username: user.username,
            email: user.email,
            role: user.role,          // <-- NECESARIO
            active: user.active,      // <-- si lo usas en UserCard
            status: user.status,
            avatar,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });

    } catch (err) {
        next(err);
    }
};
