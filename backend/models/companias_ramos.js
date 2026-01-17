const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CompaniasRamos = sequelize.define(
    "CompaniasRamos",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      compania_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      ramo_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      estatus: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
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
      timestamps: true,
      underscored: true,
      tableName: "companias_ramos",
    },
  );

  CompaniasRamos.associate = (models) => {
    CompaniasRamos.belongsTo(models.Compania, {
      foreignKey: "compania_id",
    });

    // Relación uno a uno con Ramos
    CompaniasRamos.belongsTo(models.Ramos, {
      foreignKey: "ramo_id",
      as: "ramo",
    });

    // Si necesitas que también sea bidireccional:
    models.Ramos.hasOne(CompaniasRamos, {
      foreignKey: "ramo_id",
      as: "companiaRamo",
    });
  };

  return CompaniasRamos;
};
