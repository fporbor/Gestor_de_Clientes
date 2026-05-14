// Archivo: ./praticas-2026/microservices-backend/user-service/app/routes/index.js
import userRoutes from "./user-routes.js"; // Importa las rutas de usuarios

// Función que registra todas las rutas en la aplicación Express
const setRoutes = (app) => {
  userRoutes(app); // Añade las rutas de usuarios al servidor
};

export default setRoutes;
