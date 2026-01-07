const { createOrUpdatedRecord, validateRecord } = require("./CRUDController");
const { getAllFromModel } = require("../db/customFunctions");
const { enviarCorreo } = require("../utils/emailServiceHelper");
const { Op } = require("sequelize");
const moment = require("moment");
const fs = require("fs");
const { PolizaRecibos } = require("../models");
const entidad = "Poliza";
const fields = false;

async function procesarRecibo({ id, estatus, motivoCancelacion }) {
  const isPagar = estatus === "Pagado";
  if (estatus === "Cancelado" && !motivoCancelacion) {
    return {
      result: false,
      message: "Debe proporcionar un motivo de cancelación",
    };
  }
  try {
    const record = await PolizaRecibos.findOne({
      where: { id },
    });

    if (!record) {
      return {
        result: false,
        message: entidad + " no encontrado",
      };
    }

    let payload = {
      id: record.id,
      estatus,
      fechaPago: moment().format("YYYY-MM-DD"),
    };

    if (!isPagar) {
      payload.motivoCancelacion = motivoCancelacion;
    }

    await createOrUpdatedRecord("PolizaRecibos", payload);

    return {
      result: true,
      message: entidad + (isPagar ? " pagado" : " cancelado") + " con éxito",
    };
  } catch (error) {
    console.log(
      "Error al " + (isPagar ? "pagar" : "cancelar") + " " + entidad + ":",
      error
    );
    return {
      result: false,
      message: "Error al " + (isPagar ? "pagar" : "cancelar") + " " + entidad,
    };
  }
}

exports.getAll = async (req, res) => {
  try {
    // Recibe filtros, paginación y otros parámetros desde el body
    const filtros = req.body.filtros || {};
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    // Define los campos y relaciones a incluir
    const include = [];

    // Llama a la función genérica
    const response = await getAllFromModel({
      attributes: fields,
      model: PolizaRecibos,
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
    const record = await PolizaRecibos.findOne({
      where: { id },
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

exports.pagarRecibo = async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.json({
      result: false,
      message: entidad + " no encontrado",
    });
  }

  return res.json(await procesarRecibo({ id, estatus: "Pagado" }));
};

exports.cancelarRecibo = async (req, res) => {
  const { id, motivoCancelacion } = req.body;
  if (!id) {
    return res.json({
      result: false,
      message: entidad + " no encontrado",
    });
  }

  return res.json(
    await procesarRecibo({ id, estatus: "Cancelado", motivoCancelacion })
  );
};
