const { Compania, CompaniasRamos, Ramos } = require("../models"); // Asegúrate de importar correctamente tu modelo
const {
  toPlain,
  getAllFromModel,
  processSoftDelete,
  handleIsAdmin,
} = require("../db/customFunctions");
const { Op } = require("sequelize");
const {
  validateRecord,
  createRecord,
  updateRecord,
} = require("../controllers/CRUDController");

const modelo = Compania;
const modeloString = "Compania";
const entidad = "Compañía";

async function validateRecordData(data) {
  console.log("Validando datos para:", data);
  if (!data.nombreCorto || !data.nombre || !data.rfc) {
    return {
      result: false,
      message: "Faltan campos requeridos",
      data: [],
    };
  }

  // Validar correo único
  const existeRFC = await validateRecord(modeloString, {
    rfc: data.rfc,
    ...(data.id && { id: { [Op.ne]: data.id } }), // Si es actualización, excluir el ID actual
  });

  if (!existeRFC.result) {
    return {
      result: false,
      message: "El RFC ya está en uso",
      data: [],
    };
  }

  const existeNombre = await validateRecord(modeloString, {
    nombreCorto: data.nombreCorto,
    ...(data.id && { id: { [Op.ne]: data.id } }), // Si es actualización, excluir el ID actual
  });

  if (!existeNombre.result) {
    return {
      result: false,
      message: "El nombre ya está en uso",
      data: [],
    };
  }

  return { result: true };
}

async function processRecord(data) {
  try {
    const modoCreacion = (data?.id ?? false) ? false : true;

    // Validar datos
    const validation = await validateRecordData(data);

    if (!validation.result) return validation;

    // Crear o actualizar registro
    const response = modoCreacion
      ? await createRecord(modeloString, data)
      : await updateRecord(modeloString, data);

    return {
      result: true,
      message: modoCreacion
        ? "Registro actualizado con éxito"
        : "Registro creado con éxito",
      data: response,
    };
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
    const attributes = [
      "id",
      "nombre",
      "nombreCorto",
      "estatus",
      "created_at",
      "updated_at",
      "deleted_at",
    ];

    const include = [];

    // Llama a la función genérica
    const response = await getAllFromModel({
      model: modelo,
      filtros,
      attributes,
      page,
      pageSize,
      paranoid,
    });

    // Devuelve la respuesta
    return res.json(response);
  } catch (error) {
    console.log("Error en getAll:", error);
    return res.json({
      result: false,
      message: "Error al obtener " + entidad + "s: " + error.message,
      data: [],
    });
  }
};

exports.getRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await modelo.findOne({
      where: { id },
    });

    if (!record) {
      return res.json({
        result: false,
        message: "Registro no encontrado",
      });
    }

    return res.json({
      result: true,
      message: "Registro obtenido con éxito",
      data: record,
    });
  } catch (error) {
    console.log("Error al obtener registro:", error);
    return res.json({
      result: false,
      message: "Error al obtener registro",
    });
  }
};

exports.createOrUpdate = async (req, res) => {
  const data = req.body;
  const response = await processRecord(data);

  if (response.data) delete response.data;

  res.json(response);
};

exports.delete = async (req, res) => {
  const { id } = req.body;

  // Validar que se proporcione un ID
  if (!id) {
    return res.json({
      result: false,
      message: "ID de registro es requerido",
    });
  }

  try {
    // Actualizar el estatus del registro a 0 (eliminado lógico)
    const response = await updateRecord(entidad, { id, estatus: 0 });

    if (!response.result) {
      return res.json({
        result: false,
        message: "Registro no encontrado o no se pudo eliminar",
      });
    }

    // Respuesta exitosa
    return res.json({
      result: true,
      message: "Registro eliminado con éxito",
    });
  } catch (error) {
    console.log("Error al eliminar registro:", error);
    return res.json({
      result: false,
      message: "Error al eliminar registro: " + error.message,
    });
  }
};

exports.softDelete = async (req, res) => {
  const { id } = req.body;

  // Validar que se proporcione un ID
  if (!id) {
    return res.json({
      result: false,
      message: "ID de registro es requerido",
    });
  }

  const response = await processSoftDelete(modelo, id);

  return res.json(response);
};

exports.getRamos = async (req, res) => {
  const { id } = req.params; // Obtener el ID desde los parámetros de la URL
  // Validar que se proporcione un ID
  if (!id) {
    return res.json({
      result: false,
      message: "ID de registro es requerido",
    });
  }

  const registroRelacionRamos = await CompaniasRamos.findAll({
    where: { compania_id: id },
  });

  const ramos = await Ramos.findAll();

  const ramosConEstatus = ramos.map((ramo) => {
    const relacion = registroRelacionRamos.find(
      (rel) => rel.ramo_id === ramo.id,
    );
    return {
      ...toPlain(ramo),
      isActivo: relacion ? relacion.estatus === 1 : false,
    };
  });

  return res.json({
    result: true,
    message: "Ramos obtenidos con éxito",
    data: ramosConEstatus,
  });
};

exports.updateRamos = async (req, res) => {
  const { id, ramos } = req.body;

  // Validar que se proporcione un ID
  if (!id || !ramos) {
    return res.json({
      result: false,
      message: "ID de registro es requerido",
    });
  }
  // Validar que se proporcione un ID
  if (Array.isArray(ramos) === false) {
    return res.json({
      result: false,
      message: "Se requiere un arreglo de ramos",
    });
  }
  // Eliminar asociaciones existentes
  await CompaniasRamos.destroy({
    where: { compania_id: id },
  });

  // Crear nuevas asociaciones
  const nuevasAsociaciones = ramos.map((ramo) => ({
    compania_id: id,
    ramo_id: ramo.id,
    estatus: ramo.isActivo ? 1 : 0,
  }));

  await CompaniasRamos.bulkCreate(nuevasAsociaciones);

  return res.json({
    result: true,
    message: "Ramos actualizados con éxito",
  });
};
