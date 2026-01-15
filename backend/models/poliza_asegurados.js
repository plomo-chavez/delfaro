const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  const PolizaAsegurados = sequelize.define(
    "PolizaAsegurados",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      poliza_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      cliente_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      rfc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      edad: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      genero: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      fechaNacimiento: {
        field: "fechaNacimiento",
        type: DataTypes.DATE,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      colonia: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      codigoPostal: {
        field: "codigoPostal",
        type: DataTypes.STRING,
        allowNull: false,
      },
      estado_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      ciudad: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      celular: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      oficina: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      observaciones: {
        type: DataTypes.TEXT,
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
      tableName: "poliza_asegurados",
      timestamps: true,
      underscored: true,
    }
  );

  return PolizaAsegurados;
};
