const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UsuarioClaves = sequelize.define(
    "UsuarioClaves",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      usuario_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      clave: {
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
    },
    {
      tableName: "usuario_claves",
      timestamps: true,
      underscored: true,
    }
  );

  return UsuarioClaves;
};
