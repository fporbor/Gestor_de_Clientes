import fs   from 'fs';
import path from 'path';
import { findUserAvatar, removeAvatarFromDB } from './data-access-layer/DeleteAvatarControllerDAL.js';

export const deleteAvatar = async (req, res) => {
    try {
        const user = await findUserAvatar(req.userId);

        if (!user || !user.avatar) {
            return res.status(400).json({ error: 'No hay avatar para borrar' });
        }

        const filePath = path.join('public', user.avatar);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await removeAvatarFromDB(req.userId);

        res.json({ message: 'Avatar eliminado' });
        
                fetch("http://audit-service:3600/audit-logs", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": req.headers.authorization
                    },
                    body: JSON.stringify({
                        userId: req.userId,
                        userEmail: user.email,
                        action: "USER_AVATAR_DELETED",
                        entityType: "User",
                        entityId: user.id,
                        serviceName: "users-service",
                        description: "El usuario eliminó su avatar",
                        metadata: { 
                            "Antiguo avatar": user.avatar
                        }
                    })
                }).catch(err => {
                    console.error("Error enviando auditoría:", err.message);
                });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar avatar' });
    }
};