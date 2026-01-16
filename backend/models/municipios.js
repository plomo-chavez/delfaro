const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Municipios = sequelize.define(
    "Municipios",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      estado_id: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
    },
    {
      paranoid: true,
      timestamps: false,
      underscored: true,
      deletedAt: "deleted_at",
      tableName: "municipios",
    },
  );

  return Municipios;
};
