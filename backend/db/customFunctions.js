const { findOne, getAllFrom, updateOne } = require("../db/functionsSQL");
const { sanitizeData } = require("../controllers/controller");
const { sequelize } = require("../models"); // Asegúrate de importar correctamente Sequelize

const findOneUser = async (filters = {}) => {
  return await findOne({
    table: "usuarios",
    filters,
    include: {
      tipo: {
        table: "tipos_de_usuarios",
        localKey: "tipo_id",
        foreignKey: "id",
      },
    },
  });
};

function normalizeNullRelations(rows) {
  if (!Array.isArray(rows)) return rows;

  return rows.map((row) => {
    const normalized = { ...row };

    for (const key of Object.keys(normalized)) {
      const value = normalized[key];

      if (
        value &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        "id" in value &&
        value.id === null
      ) {
        normalized[key] = null;
      }
    }

    return normalized;
  });
}

async function getAllFromModel({
  model,
  filtros = {},
  attributes = [],
  include = [],
  page = 1,
  pageSize = 10,
  pagination = true, // Nueva propiedad booleana
  paranoid = false,
}) {
  try {
    // Calcula el offset para la paginación
    const offset = (page - 1) * pageSize;

    // Realiza la consulta con Sequelize
    let { count, rows } = await model.findAndCountAll({
      where: filtros,
      attributes,
      include,
      limit: pagination ? pageSize : null, // Aplica paginación solo si pagination es true
      offset: pagination ? offset : null, // Aplica offset solo si pagination es true
      raw: true,
      nest: true,
      paranoid,
    });

    rows = normalizeNullRelations(rows);

    // Devuelve los resultados con información de paginación
    return {
      result: true,
      message: "Registros obtenidos con éxito",
      data: rows,
      pagination: pagination
        ? {
            total: count,
            page,
            pageSize,
            totalPages: Math.ceil(count / pageSize),
          }
        : null, // Si pagination es false, no incluye información de paginación
    };
  } catch (error) {
    console.error("Error al obtener registros:", error);
    return {
      result: false,
      message: "Error al obtener registros: " + error.message,
      data: [],
      pagination: null, // En caso de error, no incluye información de paginación
    };
  }
}

function toPlain(data) {
  if (Array.isArray(data)) {
    // Si es un array, aplica .toJSON() a cada elemento
    return data.map((item) => (item.toJSON ? item.toJSON() : item));
  } else if (data && typeof data === "object" && data.toJSON) {
    // Si es un objeto con .toJSON(), lo convierte
    return data.toJSON();
  }
  // Si no es ni un array ni un objeto Sequelize, devuelve el dato tal cual
  return data;
}

const getAllFromCustom = async (tabla, filtros = {}) => {
  try {
    let responseData = await getAllFrom(tabla, filtros);
    return {
      result: true,
      message: "Registros obtenidos correctamente",
      data: responseData,
    };
  } catch (error) {
    return {
      result: false,
      message: "Error al obtener los registros: " + error.message,
    };
  }
};

const updateCompania = async (data) => {
  data = await sanitizeData({ ...data });
  delete data["createdAt"];
  const id = Number(data.id);
  // Validar que el ID sea un número
  if (!id || isNaN(Number(id))) {
    return {
      result: false,
      message: "ID de compañía no válido",
    };
  }

  // Validar unicidad de RFC
  if (data.rfc) {
    const existeRFC = await findOne({
      table: "compania",
      filters: { rfc: data.rfc, not_id: Number(id) },
    });

    if (existeRFC) {
      return {
        result: false,
        message: "El RFC ya está en uso por otra compañía",
      };
    }
  }

  // Actualizar la compañía
  await updateOne({
    table: "compania",
    where: { id: Number(id) },
    data,
    include: {
      compania_representantes: {
        table: "compania_representantes",
        localKey: "id",
        foreignKey: "compania_id",
      },
    },
  });

  return {
    result: true,
    message: "Compañía actualizada con éxito",
  };
};

module.exports = {
  toPlain,
  getAllFromModel,
  findOneUser,
  updateCompania,
  getAllFromCustom,
};
