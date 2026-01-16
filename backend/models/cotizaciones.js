const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Cotizaciones = sequelize.define(
    "Cotizaciones",
    {
      id: {
        type: DataTypes.SMALLINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaNacimiento: {
        field: "fechaNacimiento",
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      estatus: {
        type: DataTypes.STRING,
        defaultValue: "Borrador",
      },
      configuracion: {
        type: DataTypes.TEXT,
      },
      documentos: {
        type: DataTypes.TEXT,
      },
      ramo: {
        type: DataTypes.STRING,
      },
      ramo_id: {
        type: DataTypes.SMALLINT,
      },
      agente_id: {
        type: DataTypes.SMALLINT,
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
        type: DataTypes.DATE, // Campo para soft delete
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      deletedAt: "deleted_at",
      tableName: "cotizaciones",
    },
  );

  return Cotizaciones;
};
