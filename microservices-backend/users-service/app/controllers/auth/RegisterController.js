import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.config.js';
import { RegisterEmailDAL, RegisterUserDAL } from './data-access-layer/RegisterControllerDAL.js';

export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existing = await RegisterEmailDAL(email);
        if (existing) {
            return res.status(400).json({ error: { message: 'El email ya está registrado' } });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await RegisterUserDAL({ name, email, passwordHash });

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
                action: "USER_REGISTER",
                entityType: "User",
                entityId: user.id,
                serviceName: "users-service",
                description: "El usuario se ha registrado",
                metadata: {
                    id: user.id,
                    email: user.email
                }
            })
        }).catch(err => {
            console.error("Error enviando auditoría:", err.message);
        });

        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
};