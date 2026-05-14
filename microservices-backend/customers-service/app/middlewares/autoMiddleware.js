import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config.js'; // ← ahora usa authConfig

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: { message: 'Token no proporcionado' } });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, authConfig.secret); // ← misma clave que al firmar
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: { message: 'Token inválido o expirado' } });
    }
};

export default authMiddleware;


