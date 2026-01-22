const {
  getAllFromModel,
  processSoftDelete,
  handleIsAdmin,
} = require("../db/customFunctions");
const {
  Cotizaciones,
  PolizaHistorial,
  Clientes,
  PolizaAsegurados,
  PolizaRecibos,
} = require("../models");

const {
  createOrUpdatedRecord,
  validateRecord,
  isReturnDataValid,
  processReturnData,
} = require("./CRUDController");
const { enviarCorreo } = require("../utils/emailServiceHelper");
const { Op } = require("sequelize");
const moment = require("moment");
const modelo = Cotizaciones;
const fs = require("fs");
const { deepPrint } = require("../utils/helper");
const entidad = "Poliza";

const fields = [
  "id",
  "nombre",
  "ramo",
  "estatus",
  "configuracion",
  "created_at",
  "updated_at",
  "deleted_at",
];

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
  const { data, returnData } = isReturnDataValid(req.body);

  if (returnData) delete data.returnData;

  let responseData = await processRecord(data);

  let response = processReturnData(returnData, req.body, responseData);

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

// prettier-ignore
exports.procesoActualizacionEstadoCotizaciones = async (data) => {
  try {
    const { cotizacion_id, cotizaciones } = data;

    // Validar datos de entrada
    if (!cotizacion_id || !cotizaciones || !Array.isArray(cotizaciones)) {
      return {
        result: false,
        message: "Faltan datos necesarios o el formato de los datos es incorrecto",
      };
    }

    // Buscar la cotización en la base de datos
    const cotizacion = await Cotizaciones.findOne({ where: { id: cotizacion_id } });
    if (!cotizacion) {
      return {
        result: false,
        message: "Cotización no encontrada",
      };
    }

    // Actualizar el estatus de la cotización
    cotizacion.estatus = "Emitida";

    // Parsear la configuración de la cotización
    const configuracionActual = JSON.parse(cotizacion.configuracion);
    const cotizacionesInBD = configuracionActual.cotizaciones || [];


    // Filtrar las cotizaciones para emitir y no emitir
    const cotizacionesParaEmitir = cotizacionesInBD.filter((c) => cotizaciones.includes(c.num));
    const cotizacionesParaNoEmitir = cotizacionesInBD.filter((c) => !cotizaciones.includes(c.num));

    // Actualizar la configuración de la cotización
    const nuevaConfiguracion = {
      ...configuracionActual,
      cotizacionesSeleccionadas: cotizacionesParaEmitir,
      cotizacionesOtras: cotizacionesParaNoEmitir,
      timeEmision: new Date().toISOString().replace("T", " ").slice(0, 19),
    };
    
    delete configuracionActual.configuracion;
    delete nuevaConfiguracion.cotizaciones;
    delete nuevaConfiguracion.companias;

    cotizacion.configuracion = JSON.stringify(nuevaConfiguracion);

    // Guardar los cambios en la base de datos
    await cotizacion.save();

    // Retornar la respuesta
    return {
      result: true,
      message: "Estado de cotización actualizado a Emitida",
      data: {
        cotizacion,
        cotizacion_id: cotizacion.id,
        cotizaciones: cotizacionesParaEmitir,
      },
    };
  } catch (error) {
    console.error("Error en procesoActualizacionEstadoCotizaciones:", error);
    return {
      result: false,
      message: "Error en el proceso: " + error.message,
    };
  }
};
