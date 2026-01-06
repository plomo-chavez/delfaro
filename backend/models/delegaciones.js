const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Delegaciones = sequelize.define(
    "Delegaciones",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING,
      },
      municipio_id: {
        type: DataTypes.BIGINT,
      },
      estado_id: {
        type: DataTypes.BIGINT,
      },
    },
    {
      tableName: "delegaciones",
      timestamps: false,
    }
  );

  return Delegaciones;
};
