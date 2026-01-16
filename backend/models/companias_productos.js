const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CompaniasProductos = sequelize.define(
    "CompaniasProductos",
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
      nombre: {
        type: DataTypes.STRING,
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
      paranoid: true,
      timestamps: true,
      underscored: true,
      deletedAt: "deleted_at",
      tableName: "companias_productos",
    },
  );

  CompaniasProductos.associate = (models) => {
    CompaniasProductos.belongsTo(models.Compania, {
      foreignKey: "compania_id",
      onDelete: "CASCADE",
    });
    CompaniasProductos.belongsTo(models.Ramos, {
      foreignKey: "ramo_id",
      onDelete: "CASCADE",
    });
  };

  return CompaniasProductos;
};
