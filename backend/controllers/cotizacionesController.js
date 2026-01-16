const { createOrUpdatedRecord, validateRecord } = require("./CRUDController");
const {
  getAllFromModel,
  processSoftDelete,
  handleIsAdmin,
} = require("../db/customFunctions");
const { enviarCorreo } = require("../utils/emailServiceHelper");
const { Op } = require("sequelize");
const moment = require("moment");
const fs = require("fs");
const {
  Cotizaciones,
  PolizaHistorial,
  Clientes,
  PolizaAsegurados,
  PolizaRecibos,
} = require("../models");
const entidad = "Poliza";
const modelo = Cotizaciones;
const fields = false;

async function processRecord(data) {
  try {
    let payload = { ...data };
    const createUserValidation = data.id ? false : true;

    if (createUserValidation) {
      // proceso de creacion
    } else {
      // proceso de actualizacion
    }

    const response = await createOrUpdatedRecord("Cotizaciones", payload);

    return response;
  } catch (e) {
    return {
      result: false,
      message: "Error al guardar el registro: " + e.message,
      data: [],
    };
  }
}

exports.getAll = async (req, res) => {
  try {
    const isAdmin = handleIsAdmin(req);

    const paranoid = !isAdmin;
    const filtros = req.body.filtros || {};
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    // Define los campos y relaciones a incluir
    const include = [];

    // Llama a la función genérica
    const response = await getAllFromModel({
      attributes: fields,
      model: Cotizaciones,
      pageSize,
      filtros,
      include,
      page,
      paranoid,
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
    const record = await Cotizaciones.findOne({
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

exports.createOrUpdate = async (req, res) => {
  const data = req.body;
  const response = await processRecord(data);

  if (response.data) delete response.data;

  res.json(response);
};

exports.deleteRecord = async (req, res) => {
  const { id } = req.body;

  // Validar que se proporcione un ID
  if (!id) {
    return res.json({
      result: false,
      message: "ID de " + entidad + " es requerido",
    });
  }

  try {
    // Actualizar el estatus del usuario a 0 (eliminado lógico)
    const response = await createOrUpdatedRecord("Cotizaciones", {
      id,
      estatus: "Cancelada",
    });

    if (!response.result) {
      return res.json({
        result: false,
        message: entidad + " no encontrado o no se pudo eliminar",
      });
    }

    // Respuesta exitosa
    return res.json({
      result: true,
      message: entidad + " eliminado con éxito",
    });
  } catch (error) {
    console.log("Error al eliminar " + entidad + ":", error);
    return res.json({
      result: false,
      message: "Error al eliminar " + entidad + ": " + error.message,
    });
  }
};

exports.softDelete = async (req, res) => {
  const { id } = req.body;

  // Validar que se proporcione un ID
  if (!id) {
    return res.json({
      result: false,
      message: "ID del registro es requerido",
    });
  }

  const response = await processSoftDelete(modelo, id);

  return res.json(response);
};

exports.cotizarCotizacion = async (req, res) => {};

exports.emitirCotizacion = async (req, res) => {};
