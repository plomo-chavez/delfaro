const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PersonalAccessTokens = sequelize.define(
    "PersonalAccessTokens",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      tokenable_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tokenable_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
      },
      abilities: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      last_used_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "personal_access_tokens",
      timestamps: false,
    }
  );

  return PersonalAccessTokens;
};
