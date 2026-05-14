"use strict";

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('Customers', 'dni', {
    type:      Sequelize.STRING(9),
    allowNull: false,
    unique:    true,
  });

  await queryInterface.addColumn('Customers', 'userId', {
    type:       Sequelize.INTEGER,
    allowNull:  false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('Customers', 'dni');
  await queryInterface.removeColumn('Customers', 'userId');
}
