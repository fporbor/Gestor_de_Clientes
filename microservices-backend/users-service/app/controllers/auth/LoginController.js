import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.config.js';
import { LoginControllerDAL } from './data-access-layer/LoginControllerDAL.js';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await LoginControllerDAL(email);
        if (!user) {
            return res.status(401).json({ error: { message: 'Credenciales incorrectas' } });
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(401).json({ error: { message: 'Credenciales incorrectas' } });
        }

        await user.update({ active: true });

        const payload = { 
            id: user.id, 
            role: user.role, 
            email: user.email 
        };

        const token = jwt.sign(payload, authConfig.secret, { 
            expiresIn: authConfig.expiresIn 
        });

        fetch("http://audit-service:3600/audit-logs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: user.id,
                userEmail: user.email,
                action: "USER_LOGIN",
                entityType: "User",
                entityId: user.id,
                serviceName: "users-service",
                description: "El usuario ha iniciado sesión",
                metadata: {
                    email: user.email,
                    id: user.id
                }
            })
        }).catch(err => {
            console.error("Error enviando auditoría:", err.message);
        });

        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};

