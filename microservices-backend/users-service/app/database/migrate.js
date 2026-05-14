import { Umzug, SequelizeStorage } from "umzug";
import { sequelize } from "../models/db.js";

const umzug = new Umzug({
  migrations: {
    glob: "migrations/*.js",
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

export const runMigrations = async () => {
  await umzug.up();
};

export const revertLast = async () => {
  await umzug.down();
};
