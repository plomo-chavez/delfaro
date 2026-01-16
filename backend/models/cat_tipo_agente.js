module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define(
    "CatTiposAgente",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      deletedAt: "deleted_at",
      tableName: "cat_tipo_agente",
    },
  );

  return Model;
};
