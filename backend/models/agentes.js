module.exports = (sequelize, DataTypes) => {
  const Schema = sequelize.define(
    "Agentes",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      segundo_nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      primer_apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      segundo_apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      curp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rfc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isAgente: {
        field: "isAgente",
        type: DataTypes.TINYINT,
        defaultValue: 1,
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
      paranoid: true, // Habilitar soft delete
      deletedAt: "deleted_at", // Nombre de la columna para soft delete
      tableName: "agentes",
    },
  );

  return Schema;
};
