const { AgenteCompanias, Compania } = require("../models"); // Asegúrate de importar correctamente tu modelo
const { Op } = require("sequelize");
const models = require("../models");

const { PrismaClient } = require("@prisma/client");
const { exportData } = require("./controller");
const {
  findOne,
  getAllFrom,
  deleteById,
  createOrUpdate,
} = require("../db/functionsSQL");

const prisma = new PrismaClient();

let tablaMap = {
  "tipos-usuarios": {
    tabla: "TiposDeUsuarios",
    filtros: {
      estatus: 1,
    },
  },
  "estatus-clientes": "estatus_cliente",
  "formas-pagos": "formas_de_pago",
  "metodos-pago": "metodos_de_pago",
  ramos: "ramos",
  estados: "estados",
  "tipos-vencimiento": "tipos_de_vencimiento",
  companias: "compania",
  monedas: "monedas",
  "estatus-poliza": "estatus_polizas",
};

exports.getCatalogo = async (req, res, tabla) => {
  try {
    let filtros = req.body || {};

    // Caso especial: ramosByCompania
    if (tabla === "ramosByCompania") {
      let companiaId = req.body.compania_id;
      if (!companiaId) {
        return res.json({
          result: false,
          message: "compania_id es requerido",
          data: [],
        });
      }

      let rows = await getAllFrom(
        "companias_ramos",
        { compania_id: companiaId, estatus: 1 },
        [
          {
            tabla: "ramos",
            foreignKey: "ramo_id", // campo en companias_ramos
            localKey: "id", // campo en ramos
            labelKey: "ramo", // cómo quieres llamar al objeto relacionado en el resultado (opcional)
            tipo: "one", // tipo de relación (por defecto "one")
            integrado: false,
            customName: false, // o false, o "relacion_"
          },
        ]
      );

      return res.json({
        result: true,
        message: "Registros obtenidos con éxito",
        data: rows,
      });
    }
    // Caso especial: companiaByAgente
    if (tabla === "companiaByAgente") {
      let agenteID = req.body.agente_id;
      console.log("Agente ID recibido:", agenteID);
      if (!agenteID) {
        return res.json({
          result: false,
          message: "El id del agente es requerido",
          data: [],
        });
      }

      let RowsIDsCompanias = await AgenteCompanias.findAll({
        where: { agente_id: agenteID, estatus: 1 },
        attributes: ["compania_id"],
      });

      const idsCompanias = RowsIDsCompanias.map((c) => c.compania_id);

      console.log("IDs de compañías encontradas:", idsCompanias);

      const rows = await Compania.findAll({
        where: {
          id: {
            [Op.in]: idsCompanias,
          },
          estatus: 1,
        },
        attributes: ["id", "nombre", "nombreCorto"],
      });

      // const data = rows.map((compania) => ({
      //   id: compania.id,
      //   nombre: compania.nombre,
      //   label: compania.nombreCorto,
      // }));

      const data = rows;
      return res.json({
        result: true,
        message: "Registros obtenidos con éxito",
        data,
      });
    }

    // Mapear tabla si es necesario
    let tablaReal = tablaMap[tabla];

    if (!tablaReal) {
      return res.json({
        result: false,
        message: "Tabla no válida",
        data: [],
      });
    }

    // let resultado = await getAllFrom(tablaReal, filtros);
    filtros = { ...tablaReal.filtros, ...filtros };

    let resultado = await models[tablaReal.tabla].findAll({
      where: filtros,
    });

    return res.json({
      result: true,
      message: "Registros obtenidos con éxito",
      data: resultado,
    });
  } catch (e) {
    return res.json({
      result: false,
      message: "Error al obtener los registros: " + e.message,
      data: [],
    });
  }
};
