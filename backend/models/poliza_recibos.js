const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PolizaRecibos = sequelize.define(
    "PolizaRecibos",
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
      numeroRecibo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaInicio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fechaFin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      vencimiento: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaPago: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fechaCancelado: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estatus: {
        type: DataTypes.STRING(100),
        defaultValue: "Pendiente",
      },
      importe: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      evidencia: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      formaPago: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "poliza_recibos",
      timestamps: true,
      underscored: true,
    }
  );

  return PolizaRecibos;
};
