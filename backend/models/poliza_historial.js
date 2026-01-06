const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PolizaHistorial = sequelize.define(
    "PolizaHistorial",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      poliza_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      accion: {
        type: DataTypes.STRING,
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
      tableName: "poliza_historial",
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  return PolizaHistorial;
};
