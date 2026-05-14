import db from "../../models/db.js";
import { updateUserName } from './data-access-layer/UpdateUserDAL.js';

const { User } = db.models;

export const updateUser = async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: { message: 'El nombre es obligatorio' } });
        }

        const newName = name.trim();

        const userBefore = await User.findByPk(req.userId);
        if (!userBefore) {
            return res.status(404).json({ error: { message: 'Usuario no encontrado' } });
        }

        if (userBefore.name === newName) {
            return res.status(200).json({ message: 'Nombre actualizado correctamente' });
        }

        const user = await updateUserName(req.userId, newName);

        fetch("http://audit-service:3600/audit-logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": req.headers.authorization
            },
            body: JSON.stringify({
                userId: req.userId,
                userEmail: user.email,
                action: "USER_UPDATED",
                entityType: "User",
                entityId: user.id,
                serviceName: "users-service",
                description: "El usuario actualizó su nombre",
                metadata: { 
                    "Antiguo nombre": userBefore.name,
                    "Nuevo nombre": newName
                }
            })
        }).catch(err => {
            console.error("Error enviando auditoría:", err.message);
        });

        res.status(200).json({ message: 'Nombre actualizado correctamente' });

    } catch (err) {
        next(err);
    }
};


