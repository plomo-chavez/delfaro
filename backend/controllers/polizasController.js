const { createOrUpdatedRecord, validateRecord } = require("./CRUDController");
const { getAllFromModel } = require("../db/customFunctions");
const { enviarCorreo } = require("../utils/emailServiceHelper");
const { Op } = require("sequelize");
const moment = require("moment");
const fs = require("fs");
const {
  Clientes,
  Polizas,
  PolizaHistorial,
  PolizaAsegurados,
  PolizaRecibos,
  EstatusPolizas,
  Compania,
  CompaniasProductos,
  Monedas,
  Ramos,
  Agentes,
} = require("../models");
const entidad = "Poliza";
const fields = [
  "id",
  "numeroPoliza",
  "compania_id",
  "ramo_id",
  "subAgente_id",
  "cliente_id",
  "estatus_id",
  "created_at",
  "updated_at",
];
function registrarAccion({ polizaID, accion }) {
  return PolizaHistorial.create({
    poliza_id: polizaID,
    accion,
  });
}

exports.getAll = async (req, res) => {
  try {
    // Recibe filtros, paginación y otros parámetros desde el body
    const filtros = req.body.filtros || {};
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    // Define los campos y relaciones a incluir
    const include = [
      {
        required: false,
        attributes: ["id", "nombre", "nombreCorto"],
        model: Compania,
        as: "compania",
      },
      {
        required: false,
        attributes: ["id", "label"],
        model: Ramos,
        as: "ramo",
      },
      {
        required: false,
        attributes: [
          "id",
          "nombre",
          "segundo_nombre",
          "primer_apellido",
          "segundo_apellido",
        ],
        model: Agentes,
        as: "agente",
      },
      {
        required: false,
        attributes: ["id", "nombre", "curp"],
        model: Clientes,
        as: "cliente",
      },
      {
        required: false,
        attributes: ["id", "label"],
        model: EstatusPolizas,
        as: "estatus",
      },
    ];

    // Llama a la función genérica
    const response = await getAllFromModel({
      attributes: fields,
      model: Polizas,
      pageSize,
      filtros,
      include,
      page,
    });

    // Devuelve la respuesta
    return res.json(response);
  } catch (error) {
    console.log("Error en getAll:", error);
    return res.json({
      result: false,
      message: "Error al obtener los registros: " + error.message,
      data: [],
    });
  }
};

exports.getRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Polizas.findOne({
      where: { id },
      include: [
        {
          model: PolizaRecibos,
          as: "recibo",
        },
        {
          model: Clientes,
          as: "cliente",
          attributes: ["id", "nombre", "curp", "rfc", "correo"],
        },
        {
          model: Compania,
          as: "compania",
          attributes: ["id", "nombre", "nombreCorto"],
        },
        {
          model: Ramos,
          as: "ramo",
          attributes: ["id", "label"],
        },
        {
          model: CompaniasProductos,
          as: "producto",
        },
        {
          model: Agentes,
          as: "agente",
          attributes: [
            "id",
            "nombre",
            "segundo_nombre",
            "primer_apellido",
            "segundo_apellido",
          ],
        },
        {
          model: EstatusPolizas,
          as: "estatus",
          attributes: ["id", "label"],
        },
        {
          required: false,
          attributes: ["id", "label"],
          model: Monedas,
          as: "moneda",
        },
      ],
    });

    if (!record) {
      return res.json({
        result: false,
        message: entidad + " no encontrado",
      });
    }

    return res.json({
      result: true,
      message: entidad + " obtenido con éxito",
      data: record,
    });
  } catch (error) {
    console.log("Error al obtener " + entidad + ":", error);
    return res.json({
      result: false,
      message: "Error al obtener " + entidad,
    });
  }
};

exports.getAsegurados = async (req, res) => {
  const { poliza_id } = req.body;

  try {
    const record = await PolizaAsegurados.findAll({
      where: { poliza_id },
    });

    if (!record) {
      return res.json({
        result: false,
        message: "Poliza no encontrada",
      });
    }

    return res.json({
      result: true,
      message: "Información obtenida con éxito",
      data: record,
    });
  } catch (error) {
    console.log("Error al obtener la información:", error);
    return res.json({
      result: false,
      message: "Error al obtener la información",
    });
  }
};

exports.getArchivos = async (req, res) => {};
exports.renovarPoliza = async (req, res) => {};

exports.corregirPoliza = async (req, res) => {
  const { poliza_id, numeroPoliza, motivoCambioNumero } = req.body;

  try {
    if (!poliza_id || !numeroPoliza || !motivoCambioNumero) {
      return res.json({
        result: false,
        message: "Faltan datos obligatorios",
      });
    }

    const existePoliza = await validateRecord("Polizas", {
      numeroPoliza,
      id: { [Op.ne]: poliza_id },
    });

    if (!existePoliza.result) {
      return res.json({
        result: false,
        message: "El número de póliza ya existe",
      });
    }
    const polizaActual = await Polizas.findOne({
      where: { id: poliza_id },
      attributes: ["numeroPoliza"], // Solo necesitamos el número de póliza actual
    });

    const numeroPolizaAnterior = polizaActual.numeroPoliza;

    const response = await createOrUpdatedRecord("Polizas", {
      id: poliza_id,
      numeroPoliza,
      motivoCambioNumero,
    });

    await registrarAccion({
      polizaID: poliza_id,
      accion: `Número de póliza cambiado de ${numeroPolizaAnterior} a ${numeroPoliza}. Motivo: ${motivoCambioNumero}`,
    });

    return res.json({
      result: true,
      message: response.result
        ? "Información actualizada con éxito"
        : response.message,
    });
  } catch (error) {
    console.log("Error al obtener la información:", error);
    return res.json({
      result: false,
      message: "Error al obtener la información",
    });
  }
};

exports.enviarCorreo = async (req, res) => {
  try {
    const { poliza_id: id, correo } = req.body;

    if (!correo || !id) {
      return res.json({
        result: false,
        message: "Faltan campos requeridos para enviar el correo",
      });
    }

    const record = await Polizas.findOne({
      where: { id },
      include: [
        {
          model: Clientes,
          as: "cliente",
          attributes: ["id", "nombre"], // Relación con cliente
        },
      ],
    });

    if (!record) {
      return res.json({
        result: false,
        message: entidad + " no encontrado",
      });
    }

    const poliza = record.get({ plain: true });
    const archivos = JSON.parse(record.archivos || "[]");
    const attachments = [];

    archivos.forEach((archivo) => {
      const filePath = archivo.ruta;
      if (fs.existsSync(filePath)) {
        attachments.push({
          filename: archivo.nombre,
          path: filePath,
        });
      } else {
        console.error(`El archivo no existe: ${filePath}`);
      }
    });

    if (attachments.length === 0) {
      return res.json({
        result: false,
        message: "No se encontraron archivos adjuntos válidos para enviar.",
      });
    }

    const mailOptions = {
      to: correo,
      subject: `Envío de Póliza: ${poliza.numeroPoliza || "Sin número"}`,
      text: `Estimado/a ${
        poliza.cliente?.nombre || "Cliente"
      },\n\nAdjunto encontrará la información de su póliza.`,
      html: `<p>Estimado/a ${poliza.cliente?.nombre || "Cliente"},</p>
             <p>Adjunto encontrará la información de su póliza.</p>`,
      attachments,
    };

    const result = await enviarCorreo(mailOptions);

    if (!result.result) {
      return res.status(500).json({
        result: false,
        message: "Error al enviar el correo: " + result.message,
      });
    }

    return res.status(200).json({
      result: true,
      message: "Correo enviado con éxito",
    });
  } catch (error) {
    console.error("Error interno al enviar la póliza:", error);
    return res.status(500).json({
      result: false,
      message: "Error interno al enviar la póliza: " + error.message,
    });
  }
};

exports.enviarWhatsApp = async (req, res) => {};

exports.getHistorial = async (req, res) => {
  const { poliza_id } = req.body;

  try {
    const records = await PolizaHistorial.findAll({
      where: { poliza_id },
    });

    if (!records) {
      return res.json({
        result: false,
        message: "Poliza no encontrada",
      });
    }

    return res.json({
      result: true,
      message: "Información obtenida con éxito",
      data: records,
    });
  } catch (error) {
    console.log("Error al obtener la información:", error);
    return res.json({
      result: false,
      message: "Error al obtener la información",
    });
  }
};

exports.cancelarPoliza = async (req, res) => {
  const id = req.body.poliza_id;
  const motivoCancelacion = req.body.motivo || "";

  try {
    if (!id || !motivoCancelacion) {
      return res.json({
        result: false,
        message: "Faltan datos obligatorios",
      });
    }

    const record = await Polizas.findOne({ where: { id } });
    const fechaCancelacion = moment().format("DD/MM/YYYY"); // Fecha actual en formato "DD/MM/YYYY"

    const response = await createOrUpdatedRecord("Polizas", {
      id,
      estatus_id: 3,
      fechaCancelado: fechaCancelacion,
      motivoCancelacion,
    });

    const recibos = await PolizaRecibos.findAll({
      where: { poliza_id: id },
    });

    for (let recibo of recibos) {
      await createOrUpdatedRecord("PolizaRecibos", {
        id: recibo.id,
        estatus: "Cancelado0000",
        fechaCancelado: fechaCancelacion,
      });
    }

    await createOrUpdatedRecord("PolizaRecibos", {
      id: record.recibo_id,
      estatus: "Vencido0000",
    });

    await registrarAccion({
      polizaID: id,
      accion: `Póliza cancelada. Motivo: ${motivoCancelacion}`,
    });

    return res.json({
      result: true,
      message: response.result
        ? "Poliza cancelada con éxito"
        : response.message,
    });
  } catch (error) {
    console.log("Error al cancelar la póliza:", error);
    return res.json({
      result: false,
      message: "Error al cancelar la póliza",
    });
  }
};

exports.getRecibos = async (req, res) => {
  const { poliza_id } = req.body;

  try {
    const records = await PolizaRecibos.findAll({
      where: { poliza_id },
    });

    if (!records) {
      return res.json({
        result: false,
        message: "Poliza no encontrada",
      });
    }

    return res.json({
      result: true,
      message: "Información obtenida con éxito",
      data: records,
    });
  } catch (error) {
    console.log("Error al obtener la información:", error);
    return res.json({
      result: false,
      message: "Error al obtener la información",
    });
  }
};
