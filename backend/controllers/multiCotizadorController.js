const { Ramos, Compania, CompaniasRamos } = require("../models");
const { Op } = require("sequelize");

exports.steps = async (req, res) => {
  try {
    const { step } = req.body;

    // Validar que el paso esté definido
    if (!step) {
      return res.json({
        result: false,
        message: "No se proporcionó el paso del proceso.",
      });
    }

    let data = null;
    // Manejar los diferentes pasos
    switch (step) {
      case 1:
        // Obtener los ramos disponibles

        const ramos = await Ramos.findAll({
          attributes: ["id", "label"],
          where: { estatus: true },
        });

        data = ramos;
        break;

      case 2:
        // Obtener las companias de los ramos seleccionados
        const { ramo_id } = req.body;
        if (!ramo_id) {
          return res.json({
            result: false,
            message: "No se proporcionaron los IDs de los ramos.",
          });
        }

        const companiasRamos = await CompaniasRamos.findAll({
          where: { ramo_id, estatus: 1 },
        });

        const companiasIDs = companiasRamos.map((cr) => cr.compania_id);

        if (!companiasIDs.length) {
          return res.json({
            result: false,
            message: "No se encontraron IDs de compañías asociadas.",
          });
        }

        const companias = await Compania.findAll({
          where: {
            id: { [Op.in]: companiasIDs },
            estatus: true,
          },
        });

        data = companias;
        break;
      default:
        return res.json({
          result: false,
          message: "El paso proporcionado no es válido.",
        });
    }

    return res.json({
      result: true,
      message: `Informacion obtenida con éxito.`,
      data: data,
    });
  } catch (error) {
    // Manejo de errores
    console.log("Error en el controlador steps:", error);
    return res.json({
      result: false,
      message: "Ocurrió un error en el servidor.",
      error: error.message,
    });
  }
};
