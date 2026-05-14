import { Sequelize } from "sequelize";
import dbconfig from "./config.js";

const sequelizeOptions = {
  dialect: "postgres",
  host: dbconfig.host,
  username: dbconfig.username,
  password: dbconfig.password,
};

const dataBase = async () => {
  try {
    await new Sequelize(sequelizeOptions).getQueryInterface().createDatabase(dbconfig.database);
  } catch {
    // La base de datos si ya existe, continuamos
  }

  return new Sequelize({
    dialect: "postgres",
    host: dbconfig.host,
    username: dbconfig.username,
    password: dbconfig.password,
    database: dbconfig.database,
    logging: false,
  });
};

const sequelize = await dataBase();


export default sequelize;
