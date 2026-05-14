// app/models/db.js
import { Sequelize, DataTypes } from "sequelize";
import config from "../database/config.js";
import AuditModel from "./Audit.js";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env] || config;

if (!dbConfig) {
  throw new Error(`Database configuration not found for NODE_ENV='${env}'`);
}

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

const db = {};

db.sequelize = sequelize;
db.models = {};

db.models.Audit = AuditModel(sequelize, DataTypes);

export default db;


