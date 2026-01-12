const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Clientes = sequelize.define(
    "Clientes",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      curp: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      rfc: {
        type: DataTypes.STRING,
        unique: true,
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isCliente: {
        field: "isCliente",
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
      data: {
        type: DataTypes.TEXT("long"),
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
      tableName: "clientes",
      timestamps: true,
      underscored: true,
    }
  );

  return Clientes;
};
