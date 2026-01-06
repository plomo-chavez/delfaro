const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CacheLocks = sequelize.define(
    "CacheLocks",
    {
      key: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      owner: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "cache_locks",
      timestamps: false,
    }
  );

  return CacheLocks;
};
