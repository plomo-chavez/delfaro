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
        field: "numeroRecibo",
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaInicio: {
        field: "fechaInicio",
        type: DataTypes.STRING,
        allowNull: true,
      },
      fechaFin: {
        field: "fechaFin",
        type: DataTypes.STRING,
        allowNull: true,
      },
      vencimiento: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaPago: {
        field: "fechaPago",
        type: DataTypes.STRING,
        allowNull: true,
      },
      fechaCancelado: {
        field: "fechaCancelado",
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
        field: "formaPago",
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
