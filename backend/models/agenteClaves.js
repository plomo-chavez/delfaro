module.exports = (sequelize, DataTypes) => {
  const AgenteClaves = sequelize.define(
    "AgenteClaves",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      compania_id: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      agente_id: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      clave: {
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
      tableName: "agente_claves",
    },
  );

  AgenteClaves.associate = (models) => {
    AgenteClaves.belongsTo(models.Compania, {
      foreignKey: "compania_id",
      as: "compania", // Alias para la relación
    });
  };

  return AgenteClaves;
};
