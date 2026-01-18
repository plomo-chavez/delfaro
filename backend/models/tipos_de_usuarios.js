module.exports = (sequelize, DataTypes) => {
  const TiposDeUsuarios = sequelize.define(
    "TiposDeUsuarios",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
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
      tableName: "tipos_de_usuarios",
    },
  );

  TiposDeUsuarios.associate = (models) => {
    TiposDeUsuarios.hasMany(models.Usuarios, {
      foreignKey: "tipo_id",
      as: "usuarios",
    });
  };

  return TiposDeUsuarios;
};
