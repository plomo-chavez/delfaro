const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Polizas = sequelize.define(
    "Polizas",
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      numeroPoliza: {
        field: "numeroPoliza",
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      cliente_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      subAgente_id: {
        field: "subAgente_id",
        type: DataTypes.BIGINT,
      },
      compania_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      ramo_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      producto_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      frecuenciaPago_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        field: "frecuenciaPago_id",
        defaultValue: 1,
        allowNull: true,
      },
      metodoPago_id: {
        field: "metodoPago_id",
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 1,
      },
      inicioVigencia: {
        field: "inicioVigencia",
        type: DataTypes.DATE,
        allowNull: true,
      },
      finVigencia: {
        field: "finVigencia",
        type: DataTypes.DATE,
        allowNull: true,
      },
      moneda_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 1,
      },
      comisionAgente: {
        field: "comisionAgente",
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      primaNeta: {
        field: "primaNeta",
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      proximoPagoFecha: {
        field: "proximoPagoFecha",
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      proximoPagoMonto: {
        field: "proximoPagoMonto",
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      estatus_id: {
        type: DataTypes.BIGINT,
        defaultValue: 1,
      },
      primaTotal: {
        field: "primaTotal",
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      pagoInicial: {
        field: "pagoInicial",
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      pagoSubsecuente: {
        field: "pagoSubsecuente",
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      financiamiento: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
      tipoVencimiento_id: {
        field: "tipoVencimiento_id",
        type: DataTypes.BIGINT.UNSIGNED,
        defaultValue: 1,
      },
      archivos: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      data: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      frecuencia: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      asegurado_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      cotizacion_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      recibo_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      renovacion: {
        type: DataTypes.SMALLINT,
        defaultValue: 0,
      },
      motivoCancelacion: {
        field: "motivoCancelacion",
        type: DataTypes.STRING,
        allowNull: true,
      },
      fechaCancelado: {
        field: "fechaCancelado",
        type: DataTypes.STRING(100),
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
      tableName: "polizas",
      timestamps: true,
      underscored: true,
    }
  );

  Polizas.associate = (models) => {
    Polizas.belongsTo(models.Clientes, {
      foreignKey: "cliente_id",
      as: "cliente", // Alias para la relación
    });
  };

  return Polizas;
};
