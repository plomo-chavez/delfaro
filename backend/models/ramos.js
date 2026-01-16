const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Ramos = sequelize.define(
    "Ramos",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      estatus: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      paranoid: true,
      timestamps: false,
      underscored: true,
      deletedAt: "deleted_at",
      tableName: "ramos",
    },
  );

  return Ramos;
};
