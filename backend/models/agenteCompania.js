module.exports = (sequelize, DataTypes) => {
  const AgenteCompanias = sequelize.define(
    "AgenteCompanias",
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
      estatus: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      tableName: "agente_companias",
      timestamps: false,
      underscored: true,
    }
  );

  return AgenteCompanias;
};
