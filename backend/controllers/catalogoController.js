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
      return {
        modelo: models.Actividades,
        modeloString: "Actividades",
        tabla: "actividades",
        isGetAll: catalogo === "actividades",
      };
    case "estatus-clientes":
      return {
        modelo: models.EstatusCliente,
        modeloString: "EstatusCliente",
        tabla: "estatus_cliente",
        isGetAll: catalogo === "estatus-clientes",
      };
    case "metodos-pago":
      return {
        modelo: models.MetodosDePago,
        modeloString: "MetodosDePago",
        tabla: "metodos_de_pago",
        isGetAll: catalogo === "metodos-pago",
      };
    case "ramos":
      return {
        modelo: models.Ramos,
        modeloString: "Ramos",
        tabla: "ramos",
        isGetAll: catalogo === "ramos",
      };
    case "tipos-vencimiento":
      return {
        modelo: models.TiposDeVencimiento,
        modeloString: "TiposDeVencimiento",
        tabla: "tipos_de_vencimiento",
        isGetAll: catalogo === "tipos-vencimiento",
      };
    case "tipos-usuarios":
      return {
        modelo: models.TiposDeUsuarios,
        modeloString: "TiposDeUsuarios",
        tabla: "tipos_de_usuarios",
        isGetAll: catalogo === "tipos-usuarios",
      };
    default:
      return null;
  }

  // EstatusCliente
  // estatus_cliente

  //   MetodosDePago
  // metodos_de_pago

  // Ramos
  // ramos

  // TiposDeVencimiento
  // tipos_de_vencimiento

  // TiposDeUsuarios
  // tipos_de_usuarios
};

exports.getData = async (req, res, isGetAll = false) => {
  try {
    const tabla = req.params.catalogo;
    console.log("  isGetAll =", isGetAll);
    const dataModels = await getModels(tabla);

    if (!dataModels) {
      return res.json({
        result: false,
        message: `El catálogo '${tabla}' no existe.`,
      });
    }

    // prettier-ignore
    console.log( "Tabla solicitada: ", tabla, "isGetAll: ", isGetAll, " dataModels ", dataModels);

    if (isGetAll) {
      const response = await handleGetAll(req, dataModels);
      return res.json(response); // Solo se envía una respuesta aquí
    } else {
      const response = await handleCreateOrUpdate(req, dataModels);
      return res.json(response); // Solo se envía una respuesta aquí
    }
  } catch (error) {
    console.log("Error al obtener datos:", error);
    return res.json({
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
