const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CompaniaRepresentantes = sequelize.define(
    "CompaniaRepresentantes",
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
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      cargo: {
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
      tableName: "compania_representantes",
      timestamps: false,
    }
  );

  CompaniaRepresentantes.associate = (models) => {
    CompaniaRepresentantes.belongsTo(models.Compania, {
      foreignKey: "compania_id",
      onDelete: "CASCADE",
    });
  };

  return CompaniaRepresentantes;
};
