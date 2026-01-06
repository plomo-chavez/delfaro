const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Cache = sequelize.define(
    "Cache",
    {
      key: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      value: {
        type: DataTypes.TEXT("medium"),
        allowNull: false,
      },
      expiration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "cache",
      timestamps: false,
    }
  );

  return Cache;
};
