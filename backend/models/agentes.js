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
      tableName: "agentes",
      timestamps: true,
      underscored: true,
    }
  );

  return Schema;
};
