const { AgenteClaves, Compania, AgenteCompanias } = require("../models"); // Asegúrate de importar correctamente tu modeloString
const { getAllFromModel } = require("../db/customFunctions");
const { Op } = require("sequelize");
const entidad = "Clave de Agente";
const modeloString = "AgenteClaves";
const model = AgenteClaves;

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

    const companiasObtenidas = await AgenteCompanias.findAll({
      where: {
        agente_id,
      },
    });

    const idsCompanias = companiasObtenidas.map((c) => c.compania_id);

    const companias = await Compania.findAll({
      attributes: ["id", "nombre", "nombreCorto"], // Solo los campos necesarios
    });

    const companiasData = companias.map((compania) => {
      const registroAsociado = companiasObtenidas.find(
        (c) => c.compania_id === compania.id
      );

      return {
        id: compania.id,
        nombre: compania.nombre,
        nombreCorto: compania.nombreCorto,
        isSeleccionada: registroAsociado
          ? registroAsociado.estatus === 1
          : false, // Usar el estatus si existe, de lo contrario false
      };
    });

    return res.json({
      result: true,
      message: "Compañías obtenidas con éxito",
      data: companiasData,
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

exports.updateCompanias = async (req, res) => {
  try {
    const { agente_id, companias } = req.body;

    if (!agente_id || !Array.isArray(companias)) {
      return res.json({
        result: false,
        message: "El ID del agente y la lista de compañías son requeridos",
        data: [],
      });
    }

    // Eliminar asociaciones existentes
    await AgenteCompanias.destroy({
      where: { agente_id },
    });

    // Crear nuevas asociaciones
    const nuevasAsociaciones = companias.map((compania) => ({
      agente_id,
      compania_id: compania.id,
      estatus: compania.isSeleccionada ?? 0,
    }));

    await AgenteCompanias.bulkCreate(nuevasAsociaciones);

    return res.json({
      result: true,
      message: "Compañías actualizadas con éxito",
      data: [],
    });
  } catch (error) {
    console.log("Error en updateCompanias:", error);
    return res.json({
      result: false,
      message: "Error al actualizar las compañías: " + error.message,
      data: [],
    });
  }
};
