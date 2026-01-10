const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Compania = sequelize.define(
    "Compania",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      rfc: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nombreCorto: {
        field: "nombreCorto",
        type: DataTypes.STRING,
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      estado: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      codigoPostal: {
        field: "codigoPostal",
        type: DataTypes.STRING,
        allowNull: true,
      },
      ciudad: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      limitePrimerPago: {
        field: "limitePrimerPago",
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      limitePrimerSubsecuente: {
        field: "limitePrimerSubsecuente",
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      estatus: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      colonia: {
        type: DataTypes.STRING(45),
        allowNull: true,
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
      tableName: "compania",
      timestamps: true,
      underscored: true,
    }
  );

  return Compania;
};
