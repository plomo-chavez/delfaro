const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const FailedJobs = sequelize.define(
    "FailedJobs",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      connection: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      queue: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      payload: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      exception: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      failed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "failed_jobs",
      timestamps: false,
    }
  );

  return FailedJobs;
};
