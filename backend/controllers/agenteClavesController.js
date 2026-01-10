const { AgenteClaves, Companias } = require("../models"); // Asegúrate de importar correctamente tu modeloString
const { getAllFromModel } = require("../db/customFunctions");
const { Op } = require("sequelize");
const entidad = "Clave de Agente";
const modeloString = "AgenteClaves";
const model = AgenteClaves;

const { validateRecord, createOrUpdatedRecord } = require("./CRUDController");
// prettier-ignore
const fields = false;

async function processRecord(data) {
  try {
    let payload = { ...data };
    const createValidation = data.id ? false : true;

    if (createValidation) {
      // proceso de creacion
    } else {
      // proceso de actualizacion
    }

    const response = await createOrUpdatedRecord(modeloString, payload);

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
    // Recibe filtros, paginación y otros parámetros desde el body
    const filtros = req.body.filtros || {};
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    // Define los campos y relaciones a incluir
    // prettier-ignore
    const include = [];

    // Llama a la función genérica
    const response = await getAllFromModel({
      model: AgenteClaves,
      filtros,
      attributes: fields,
      include,
      page,
      pageSize,
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

exports.createOrUpdate = async (req, res) => {
  const data = req.body;

  const createValidation = data.id ? false : true;

  const response = await processRecord(data);

  if (!createValidation) {
  }

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
    const response = await createOrUpdatedRecord(modeloString, {
      id,
      estatus: 0,
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

exports.getCompanias = async (req, res) => {
  try {
    const { agente_id } = req.body;

    if (!agente_id) {
      return res.json({
        result: false,
        message: "El ID del agente es requerido",
        data: [],
      });
    }

    const claves = await AgenteClaves.findAll({
      where: {
        agente_id: agente_id,
        estatus: 1,
      },
    });

    const idsCompanias = companias.map((c) => c.compania_id);

    const companias = await Companias.findAll({
      where: {
        id: {
          [Op.in]: idsCompanias,
        },
        estatus: 1,
      },
    });

    return res.json({
      result: true,
      message: "Compañías obtenidas con éxito",
      data: companias,
    });
  } catch (error) {
    console.log("Error al obtener compañías del agente:", error);
    return res.json({
      result: false,
      message: "Error al obtener compañías del agente: " + error.message,
      data: [],
    });
  }
};
