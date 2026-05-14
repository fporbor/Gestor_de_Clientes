import authConfig from "../config/auth.config.js";
import jwt from "jsonwebtoken";

/**
 * Middleware para verificar el token JWT
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new Error("No token provided"));
    }

    const token = authHeader.split(" ")[1];
    const secret = authConfig.secret;

    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return next(new Error("Unauthorized"));
      }

      // Extraemos los valores que necesitamos del token
      req.userId    = decoded.id;
      req.userRole  = decoded.role;
      req.userEmail = decoded.email;

      next();
    });
  } catch (error) {
    next(error);
  }
};

export default verifyToken;