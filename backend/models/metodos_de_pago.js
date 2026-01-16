const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MetodosDePago = sequelize.define(
    "MetodosDePago",
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
      paranoid: true,
      timestamps: true,
      underscored: true,
      deletedAt: "deleted_at",
      tableName: "metodos_de_pago",
    },
  );

  return MetodosDePago;
};
