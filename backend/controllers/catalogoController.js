const models = require("../models"); // Asegúrate de importar correctamente tu modeloç
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

const getModels = async (catalogo) => {
  switch (catalogo) {
    case "actividades":
    case "actividad":
      return {
        modelo: models.Actividades,
        modeloString: "Actividades",
        tabla: "actividades",
        isGetAll: catalogo === "actividades",
      };
    default:
      return null;
  }
};

exports.getData = async (req, res) => {
  try {
    const tabla = req.params.catalogo;
    const dataModels = await getModels(tabla);

    if (!dataModels) {
      return res.json({
        result: false,
        message: `El catálogo '${tabla}' no existe.`,
      });
    }
    const isGetAll = dataModels.isGetAll;

    console.log(
      "Tabla solicitada: ",
      tabla,
      "isGetAll: ",
      isGetAll,
      " dataModels ",
      dataModels,
    );

    if (isGetAll) {
      console.log("Entró a getAll ");
      const response = await handleGetAll(req, dataModels);
      return res.json(response); // Solo se envía una respuesta aquí
    } else {
      const response = await handleCreateOrUpdate(req, dataModels);
      return res.json(response); // Solo se envía una respuesta aquí
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
    return res.status(500).json({
      result: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

const handleGetAll = async (req, dataModels) => {
  const paranoid = false;

  const response = await getAllFromModel({
    model: dataModels.modelo,
    attributes: null, // Selecciona todas las columnas
    pagination: false,
    paranoid,
  });

  return {
    result: true,
    message: "Datos obtenidos con éxito",
    data: response.data,
    pagination: response.pagination,
  };
};

const handleCreateOrUpdate = async (req, dataModels) => {
  const data = req.body;

  const modoCreacion = !data?.id;

  const existeRecord = await validateRecord(dataModels.modeloString, {
    label: data.label,
    ...(!modoCreacion && { id: { [Op.ne]: data.id } }),
  });

  console.log("Validación de existencia de registro:", existeRecord);

  if (!existeRecord.result) {
    return {
      result: false,
      message: `El registro con label '${data.label}' ya existe en el catálogo '${dataModels.modeloString}'.`,
    };
  }

  const record = modoCreacion
    ? await createRecord(dataModels.modeloString, data)
    : await updateRecord(dataModels.modeloString, data);

  return {
    result: true,
    message: data.id
      ? "Registro actualizado con éxito"
      : "Registro creado con éxito",
  };
};

exports.delete = async (req, res) => {
  return handleDelete(req, res);
};

exports.deleteSoftData = async (req, res) => {
  return handleDelete(req, res, true);
};

const handleDelete = async (req, res, softDelete = false) => {
  const tabla = req.params.catalogo;
  console.log(
    "handleDelete llamado con softDelete =",
    softDelete,
    " para tabla =",
    tabla,
  );

  const dataModels = await getModels(tabla);

  if (!dataModels) {
    return res.json({
      result: false,
      message: `El catálogo '${tabla}' no existe.`,
    });
  }

  const id = req.body.id;

  if (!id) {
    return res.json({
      result: false,
      message: "El ID del registro a eliminar es obligatorio.",
    });
  }
  if (softDelete) {
    const result = await processSoftDelete(dataModels.modelo, id);

    return res.json(result);
  } else {
    console.log(
      "Eliminando registro de la tabla:",
      dataModels.modeloString,
      "con ID:",
      id,
    );
    const result = await updateRecord(dataModels.modeloString, {
      id,
      estatus: 0,
    });

    return res.json(result);
  }
};
