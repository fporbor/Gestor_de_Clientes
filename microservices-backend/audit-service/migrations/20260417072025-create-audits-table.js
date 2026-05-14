"use strict";

/**
 *
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').Sequelize} Sequelize
 */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Audits", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },

    userEmail: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    action: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    entityType: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    entityId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    serviceName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    metadata: {
      type: Sequelize.JSONB,
      allowNull: true,
    },

    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Audits");
}

