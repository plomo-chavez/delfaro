const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UsuarioTeam = sequelize.define(
    "UsuarioTeam",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      usuario_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      team_id: {
        type: DataTypes.BIGINT.UNSIGNED,
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
    },
    {
      tableName: "usuario_team",
      timestamps: true,
      underscored: true,
    }
  );

  return UsuarioTeam;
};
