import { LogoutControllerDAL } from './data-access-layer/LogoutControllerDAL.js';

export const logout = async (req, res, next) => {
    try {
        const user = await LogoutControllerDAL(req.userId);
        if (!user) {
            return res.status(404).json({ error: { message: 'Usuario no encontrado' } });
        }

        await user.update({ active: false });

        fetch("http://audit-service:3600/audit-logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": req.headers.authorization
            },
            body: JSON.stringify({
                userId: req.userId,
                userEmail: req.userEmail,
                action: "USER_LOGOUT",
                entityType: "User",
                entityId: req.userId,
                serviceName: "users-service",
                description: "El usuario ha cerrado sesión",
                metadata: {
                    id: req.userId,
                    email: req.userEmail
                }
            })
        }).catch(err => {
            console.error("Error enviando auditoría:", err.message);
        });

        res.status(200).json({ message: 'Sesión cerrada correctamente' });

    } catch (err) {
        console.error("Error en logout:", err.message);
        next(err);
    }
};
