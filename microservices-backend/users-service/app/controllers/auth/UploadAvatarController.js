import fs   from 'fs';
import path from 'path';
import { updateAvatarInDB } from './data-access-layer/UploadAvatarControllerDAL.js';
import { findUserAvatar } from './data-access-layer/DeleteAvatarControllerDAL.js';

export const uploadAvatar = async (req, res) => {
    try {
        let body = Buffer.alloc(0);

        req.on('data', chunk => {
            body = Buffer.concat([body, chunk]);
        });

        req.on('end', async () => {
            const contentType = req.headers['content-type'];
            const boundary    = contentType.split('boundary=')[1];
            const parts       = body.toString('binary').split(`--${boundary}`);
            const filePart    = parts.find(p => p.includes('filename='));

            if (!filePart) {
                return res.status(400).json({ error: 'No se envió archivo' });
            }

            const match    = filePart.match(/filename="(.+?)"/);
            const filename = match[1];
            const ext      = path.extname(filename).toLowerCase();
            const allowed  = ['.jpg', '.jpeg', '.png', '.webp'];

            if (!allowed.includes(ext)) {
                return res.status(400).json({ error: 'Formato no permitido' });
            }

            const start      = filePart.indexOf('\r\n\r\n') + 4;
            const end        = filePart.lastIndexOf('\r\n');
            const raw        = filePart.slice(start, end);
            const fileBuffer = Buffer.from(raw, 'binary');

            const userId  = req.userId;
            const userDir = path.join('public', 'usuarios', String(userId));

            if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

            const finalPath  = path.join(userDir, `avatar${ext}`);
            fs.writeFileSync(finalPath, fileBuffer);

            const avatarPath = `/usuarios/${userId}/avatar${ext}`;
            await updateAvatarInDB(userId, avatarPath);

            const user = await findUserAvatar(req.userId);
            
                    fetch("http://audit-service:3600/audit-logs", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": req.headers.authorization
                        },
                        body: JSON.stringify({
                            userId: req.userId,
                            userEmail: user.email,
                            action: "USER_AVATAR_UPDATED",
                            entityType: "User",
                            entityId: user.id,
                            serviceName: "users-service",
                            description: "El usuario actualizó su avatar",
                            metadata: { 
                                "Nuevo avatar": avatarPath
                            }
                        })
                    }).catch(err => {
                        console.error("Error enviando auditoría:", err.message);
                    });
            
            res.json({ message: 'Avatar actualizado', avatar: avatarPath });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al subir avatar' });
    }
};