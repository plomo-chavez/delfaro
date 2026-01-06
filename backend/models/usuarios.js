module.exports = (sequelize, DataTypes) => {
  const Usuarios = sequelize.define(
    "Usuarios",
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
      correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reset_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo_id: {
        type: DataTypes.BIGINT.UNSIGNED,
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
      tableName: "usuarios",
      timestamps: true,
      underscored: true,
    }
  );

  Usuarios.associate = (models) => {
    Usuarios.belongsTo(models.TiposDeUsuarios, {
      foreignKey: "tipo_id",
      as: "tipo", // Alias para la relación
    });
  };

  return Usuarios;
};
