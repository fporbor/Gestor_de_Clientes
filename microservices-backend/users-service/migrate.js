import { runMigrations } from "./app/database/migrate.js";

runMigrations().then(() => {
  console.log("Migrations executed");
  process.exit(0);
});
