module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "AgenteTeam",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      agente_id: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      team_id: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      tipo_id: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      estatus: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      deleted_at: {
        type: DataTypes.DATE, // Campo para soft delete
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      deletedAt: "deleted_at",
      tableName: "agente_team",
    },
  );

  Model.associate = (models) => {
    Model.belongsTo(models.Agentes, {
      as: "elemento",
      foreignKey: {
        name: "team_id",
        allowNull: true,
      },
      targetKey: "id",
    });

    Model.belongsTo(models.CatTiposAgente, {
      as: "tipo",
      foreignKey: {
        name: "tipo_id",
        allowNull: true,
      },
      targetKey: "id",
    });
  };
  return Model;
};
