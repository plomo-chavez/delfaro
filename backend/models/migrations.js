const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Migrations = sequelize.define(
    "Migrations",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      migration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      batch: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "migrations",
      timestamps: false,
    }
  );

  return Migrations;
};
