// app/config/auth.config.js
export default {
    secret: process.env.JWT_SECRET || 'tu_clave_secreta' // ← la misma que en users-service
};