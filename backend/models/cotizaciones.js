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
    },
    {
      tableName: "cotizaciones",
      timestamps: false,
    }
  );

  return Cotizaciones;
};
