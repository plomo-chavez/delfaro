module.exports = (sequelize, DataTypes) => {
  const AgenteCompaniaRamos = sequelize.define(
    "AgenteCompaniaRamos",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      agente_id: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      compania_id: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      ramo_id: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      estatus: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      underscored: true,
      deletedAt: "deleted_at",
      tableName: "agente_companias_ramos",
    },
  );

  return AgenteCompaniaRamos;
};
