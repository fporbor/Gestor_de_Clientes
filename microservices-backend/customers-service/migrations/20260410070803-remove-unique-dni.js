"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.removeConstraint("Customers", "Customers_dni_key");
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.addConstraint("Customers", {
    fields: ["dni"],
    type: "unique",
    name: "Customers_dni_key"
  });
}

