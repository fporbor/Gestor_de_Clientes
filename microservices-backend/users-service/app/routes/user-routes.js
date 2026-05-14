import { getUser }    from '../controllers/auth/GetUserController.js';
import { login }      from '../controllers/auth/LoginController.js';
import { register }   from '../controllers/auth/RegisterController.js';
import { logout }     from '../controllers/auth/LogoutController.js';
import { updateUser } from '../controllers/auth/UpdateUserController.js';
import verifyToken    from '../middlewares/autorizeJWT.js';
import { uploadAvatar } from "../controllers/auth/UploadAvatarController.js";
import { deleteAvatar } from "../controllers/auth/DeleteAvatarController.js";

const userRoutes = (app) => {
    app.post('/auth/register', register);
    app.post('/auth/login',    login);
    app.get('/auth/me',        verifyToken, getUser);
    app.put('/auth/me',        verifyToken, updateUser); 
    app.post('/auth/logout',   verifyToken, logout);
    app.put('/auth/avatar',   verifyToken, uploadAvatar);
    app.delete('/auth/avatar', verifyToken, deleteAvatar);
};

export default userRoutes;