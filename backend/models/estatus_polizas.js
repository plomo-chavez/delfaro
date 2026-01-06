const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const EstatusPolizas = sequelize.define(
    "EstatusPolizas",
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
      tableName: "estatus_polizas",
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  return EstatusPolizas;
};
