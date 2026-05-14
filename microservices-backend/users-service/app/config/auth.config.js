import dotenv from "dotenv";
dotenv.config();

export default {
    secret:    process.env.JWT_SECRET,
    expiresIn: 60 * 60 * 24 * 365, // 1 año
};