const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Sessions = sequelize.define(
    "Sessions",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      user_agent: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      payload: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      last_activity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "sessions",
      timestamps: false,
    }
  );

  return Sessions;
};
