import { Sequelize, DataTypes } from "sequelize";
import sequelizeInstance from "../database/createDB.js";
import dbUsers from "./User.js";

// Exportamos sequelize como named export
export const sequelize = sequelizeInstance;

// Creamos el objeto db (opcional)
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

const User = dbUsers(sequelize, DataTypes);

db.users = User;
db.models = { User };

export default db;
