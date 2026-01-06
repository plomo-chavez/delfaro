const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const JobBatches = sequelize.define(
    "JobBatches",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_jobs: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pending_jobs: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      failed_jobs: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      failed_job_ids: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      options: {
        type: DataTypes.TEXT("medium"),
      },
      cancelled_at: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      finished_at: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "job_batches",
      timestamps: false,
    }
  );

  return JobBatches;
};
