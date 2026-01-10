const { AgenteTeam, Agentes, CatTiposAgente } = require("../models"); // Asegúrate de importar correctamente tu modeloString
const { getAllFromModel } = require("../db/customFunctions");
const { Op } = require("sequelize");
const entidad = "Subagente de Agente";
const modeloString = "AgenteTeam";
const model = AgenteTeam;
const tipoIDDefault = 2; // Subagente

const { validateRecord, createOrUpdatedRecord } = require("./CRUDController");
// prettier-ignore
const fields = ["id", "agente_id", "team_id", "tipo_id","estatus"];

async function processRecord(data) {
  try {
    let payload = { ...data };
    let registroRelacionID = payload.id;
    delete payload.filtros;
    const createValidation = data.id ? false : true;

    if (createValidation) {
      // proceso de creacion
    } else {
      // proceso de actualizacion
      payload.id = payload.team_id;
    }
    payload.isAgente = 0;

    const response = await createOrUpdatedRecord("Agentes", payload);

    let tmp = {
      agente_id: payload.agente_id,
      team_id: response.data.id,
      tipo_id: tipoIDDefault, // Subagente
      estatus: payload.estatus,
    };

    if (!createValidation) {
      tmp.team_id = payload.team_id;
      tmp.id = registroRelacionID;
    }

    await createOrUpdatedRecord("AgenteTeam", tmp);

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
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;
    let filtros = req.body.filtros || {};
    filtros.tipo_id = tipoIDDefault; // Subagente

    // Define los campos y relaciones a incluir
    const include = [
      {
        required: false,
        model: Agentes,
        as: "elemento",
      },
      {
        attributes: ["id", "label"],
        model: CatTiposAgente,
        required: false,
        as: "tipo",
      },
    ];

    // Llama a la función genérica
    const response = await getAllFromModel({
      model,
      filtros,
      attributes: fields,
      include,
      pagination: false,
    });

    let data = response.data.map((item) => {
      let elemento = item.elemento || {};
      let estatus = item.estatus;
      delete item.elemento;
      delete item.estatus;
      return {
        ...item,
        ...elemento,
        id: item.id,
        estatus,
      };
    });

    response.data = data;

    // Devuelve la respuesta
    return res.json({
      ...response,
      data,
    });
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
