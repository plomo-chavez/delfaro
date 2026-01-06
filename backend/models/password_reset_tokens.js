const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const PasswordResetTokens = sequelize.define(
    "PasswordResetTokens",
    {
      email: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "password_reset_tokens",
      timestamps: false,
    }
  );

  return PasswordResetTokens;
};
