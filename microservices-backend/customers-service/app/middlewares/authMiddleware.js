import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.config.js';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: { message: 'Token no proporcionado' } });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, authConfig.secret);

        // Exponer valores individuales
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userEmail = decoded.email;

        next();
    } catch (err) {
        return res.status(401).json({ error: { message: 'Token inválido o expirado' } });
    }
};

export default authMiddleware;
