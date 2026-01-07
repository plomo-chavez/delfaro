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
      rfc: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      curp: {
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
      data: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      isCliente: {
        field: "isCliente",
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: true,
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
