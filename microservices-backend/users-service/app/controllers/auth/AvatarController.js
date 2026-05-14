import fs from "fs";
import path from "path";
import db from "../../models/db.js";

const User = db.users;

export const uploadAvatar = async (req, res) => {
    try {
        let body = Buffer.alloc(0);

        req.on("data", chunk => {
            body = Buffer.concat([body, chunk]);
        });

        req.on("end", async () => {
            const contentType = req.headers["content-type"];
            const boundary = contentType.split("boundary=")[1];

            const parts = body.toString("binary").split(`--${boundary}`);

            const filePart = parts.find(p => p.includes("filename="));
            if (!filePart) return res.status(400).json({ error: "No se envió archivo" });

            const match = filePart.match(/filename="(.+?)"/);
            const filename = match[1];

            const ext = path.extname(filename).toLowerCase();
            const allowed = [".jpg", ".jpeg", ".png", ".webp"];

            if (!allowed.includes(ext)) {
                return res.status(400).json({ error: "Formato no permitido" });
            }

            // EXTRAER BYTES REALES (NO substring)
            const start = filePart.indexOf("\r\n\r\n") + 4;
            const end = filePart.lastIndexOf("\r\n");

            const raw = filePart.slice(start, end);
            const fileBuffer = Buffer.from(raw, "binary");

            const userId = req.userId;
            const userDir = path.join("public", "usuarios", String(userId));

            if (!fs.existsSync(userDir)) fs.mkdirSync(userDir, { recursive: true });

            const finalPath = path.join(userDir, `avatar${ext}`);

            fs.writeFileSync(finalPath, fileBuffer);

            const avatarPath = `/usuarios/${userId}/avatar${ext}`;

            await User.update({ avatar: avatarPath }, { where: { id: userId } });

            res.json({ message: "Avatar actualizado", avatar: avatarPath });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al subir avatar" });
    }
};
export const deleteAvatar = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId);

        if (!user || !user.avatar) {
            return res.status(400).json({ error: "No hay avatar para borrar" });
        }

        const filePath = path.join("public", user.avatar);

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        await User.update({ avatar: null }, { where: { id: req.userId } });

        res.json({ message: "Avatar eliminado" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al eliminar avatar" });
    }
};
