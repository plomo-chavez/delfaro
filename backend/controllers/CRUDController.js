const { sequelize } = require("../models"); // Asegúrate de importar correctamente Sequelize

const { sanitizeData } = require("../controllers/controller");

const createOrUpdatedRecord = async (tabla, data) => {
  try {
    const isCreate = !data.id;

    if (isCreate) {
      return await createRecord(tabla, data);
    } else {
      return await updateRecord(tabla, data);
    }
  } catch (error) {
    console.error("Error en createOrUpdatedRecord:", error);
    return {
      result: false,
      message: "Error en createOrUpdatedRecord: " + error.message,
    };
  }
};

const createRecord = async (tabla, data) => {
  try {
    const sanitizedData = await sanitizeData(data); // Limpia los datos si es necesario
    const nuevoRegistro = await sequelize.models[tabla].create(sanitizedData);

    return {
      result: true,
      message: "Registro creado con éxito",
      data: nuevoRegistro,
    };
  } catch (error) {
    console.error("Error al crear registro:", error);
    return {
      result: false,
      message: "Error al crear registro: " + error.message,
    };
  }
};

const updateRecord = async (tabla, data) => {
  try {
    let id = data.id ?? null;

    console.log("ID para actualizar:", data);

    if (!id) {
      return {
        result: false,
        message: "Error al actualizar registro: " + error.message,
      };
    }

    const sanitizedData = await sanitizeData(data); // Limpia los datos si es necesario
    const registro = await sequelize.models[tabla].findByPk(id);

    if (!registro) {
      return {
        result: false,
        message: "Registro no encontrado",
      };
    }

    await registro.update(sanitizedData);

    return {
      result: true,
      message: "Registro actualizado con éxito",
      data: registro,
    };
  } catch (error) {
    console.error("Error al actualizar registro:", error);
    return {
      result: false,
      message: "Error al actualizar registro: " + error.message,
    };
  }
};

const validateRecord = async (tabla, filters) => {
  try {
    const registro = await sequelize.models[tabla].findOne({ where: filters });

    if (registro) {
      return {
        result: false,
        message: "El registro ya existe",
      };
    }

    return {
      result: true,
      message: "Validación exitosa",
    };
  } catch (error) {
    console.error("Error al validar registro:", error);
    return {
      result: false,
      message: "Error al validar registro: " + error.message,
    };
  }
};

const deleteRecord = async (tabla, id) => {
  try {
    const registro = await sequelize.models[tabla].findByPk(id);

    if (!registro) {
      return {
        result: false,
        message: "Registro no encontrado",
      };
    }

    await registro.destroy();

    return {
      result: true,
      message: "Registro eliminado con éxito",
    };
  } catch (error) {
    console.error("Error al eliminar registro:", error);
    return {
      result: false,
      message: "Error al eliminar registro: " + error.message,
    };
  }
};

module.exports = {
  createOrUpdatedRecord,
  createRecord,
  updateRecord,
  validateRecord,
  deleteRecord,
};
