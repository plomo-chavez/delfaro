const { createOrUpdatedRecord, validateRecord } = require("./CRUDController");
const {
  existeCarpeta,
  escribirArchivo,
  filePathToPublicUrl,
  getPathFolderFiles,
} = require("../utils/filesHelper");
const { PolizaRecibos, Polizas, Compania } = require("../models");
const { enviarCorreo } = require("../utils/emailServiceHelper");
const { getAllFromModel } = require("../db/customFunctions");
const { Op } = require("sequelize");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const entidad = "Poliza";
const fields = false;

async function procesarRecibo(data) {
  const isPagar = data.estatus == "Pagado";
  if (data.estatus === "Cancelado" && !data.motivoCancelacion) {
    return {
      result: false,
      message: "Debe proporcionar un motivo de cancelación",
    };
  }
  try {
    // prettier-ignore
    const record = await PolizaRecibos.findOne({ where: { id: data.id } });

    if (!record) {
      return {
        result: false,
        message: entidad + " no encontrado",
      };
    }

    await createOrUpdatedRecord("PolizaRecibos", data);

    return {
      result: true,
      message: entidad + (isPagar ? " pagado" : " cancelado") + " con éxito",
    };
  } catch (error) {
    console.log(
      "Error al " + (isPagar ? "pagar" : "cancelar") + " " + entidad + ":",
      error
    );
    return {
      result: false,
      message: "Error al " + (isPagar ? "pagar" : "cancelar") + " " + entidad,
    };
  }
}

async function validarRecibo(reciboID, modoPago = true) {
  const reciboHaValidar = await PolizaRecibos.findOne({
    where: { id: reciboID },
  });

  if (!reciboHaValidar) {
    return {
      result: false,
      message: "Recibo no encontrado",
    };
  }

  if (
    reciboHaValidar.estatus == "Pagado" ||
    reciboHaValidar.estatus == "Cancelado"
  ) {
    // prettier-ignore
    let extraMessage = modoPago ? "No puede ser pagado" : "No puede ser cancelado";

    // prettier-ignore
    return ({
      result: false,
      message: extraMessage+ ", ya que el recibo se encuentra " + reciboHaValidar.estatus.toLowerCase() 
    });
  } else {
    return {
      result: true,
      message: "Recibo válido para pago",
      data: reciboHaValidar,
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
    const include = [];

    // Llama a la función genérica
    const response = await getAllFromModel({
      attributes: fields,
      model: PolizaRecibos,
      pageSize,
      filtros,
      include,
      page,
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

exports.getRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await PolizaRecibos.findOne({
      where: { id },
    });

    if (!record) {
      return res.json({
        result: false,
        message: entidad + " no encontrado",
      });
    }

    return res.json({
      result: true,
      message: entidad + " obtenido con éxito",
      data: record,
    });
  } catch (error) {
    console.log("Error al obtener " + entidad + ":", error);
    return res.json({
      result: false,
      message: "Error al obtener " + entidad,
    });
  }
};

exports.pagarRecibo = async (req, res) => {
  const { reciboID, formaPago, fechaPago, comentarios } = req.body;
  let fileResponse = null;

  // Verificar si se envió el ID
  if (!reciboID) {
    return res.json({
      result: false,
      message: "Falta el ID del recibo a pagar",
    });
  }

  let validacionRecibo = await validarRecibo(reciboID);

  if (validacionRecibo.result === false) {
    return res.json(validacionRecibo);
  }

  const recibohaPagar = validacionRecibo.data;

  // Verificar si se cargó un archivo
  const archivoSoporte = req.file; // El archivo cargado estará aquí gracias a upload.single("soporte")
  if (archivoSoporte) {
    // prettier-ignore
    const poliza = await Polizas.findOne({
      where: { id: recibohaPagar.poliza_id },
      include: [
        {
          model: Compania,
          as: "compania",
          attributes: ["id", "nombre", "nombreCorto"],
        },
      ],
    });
    // Construir la ruta base
    const basePath = await getPathFolderFiles();
    const companiaFolder = path.join(basePath, poliza.compania.nombreCorto);
    const polizaFolder = path.join(companiaFolder, poliza.numeroPoliza);
    const recibosFolder = path.join(polizaFolder, "recibos");

    // Crear las carpetas si no existen
    existeCarpeta(companiaFolder, { crearSiNoExiste: true });
    existeCarpeta(polizaFolder, { crearSiNoExiste: true });
    existeCarpeta(recibosFolder, { crearSiNoExiste: true });

    // Copiar el archivo al destino
    // prettier-ignore
    const nuevoNombreArchivo = `recibo_${poliza.numeroPoliza}_${recibohaPagar.numeroRecibo}${path.extname(archivoSoporte.originalname)}`;
    const rutaDestino = path.join(recibosFolder, nuevoNombreArchivo);

    const contenidoArchivo = fs.readFileSync(archivoSoporte.path);
    let responseFile = escribirArchivo(rutaDestino, contenidoArchivo);
    let fileUrl = await filePathToPublicUrl(responseFile.rutaArchivo);

    fileResponse = {
      url: fileUrl,
      nombre: nuevoNombreArchivo,
      ruta: responseFile.rutaArchivo,
    };
  }

  try {
    let payload = {
      id: recibohaPagar.id,
      estatus: "Pagado",
      formaPago,
      fechaPago,
      comentarios,
      fechaCancelado: null,
      motivoCancelacion: null,
    };

    if (fileResponse != null) {
      payload.evidencia = JSON.stringify(fileResponse);
    }

    const resultado = await procesarRecibo(payload);

    return res.json({
      result: true,
      message: "Recibo pagado con éxito",
    });
  } catch (error) {
    console.error("Error al procesar el recibo:", error);
    return res.status(500).json({
      result: false,
      message: "Error interno al procesar el recibo.",
    });
  }
};

exports.cancelarRecibo = async (req, res) => {
  let { reciboID, motivoCancelacion, fechaCancelado } = req.body;
  const id = reciboID;
  if (!id) {
    return res.json({
      result: false,
      message: entidad + " no encontrado",
    });
  }
  let validacionRecibo = await validarRecibo(reciboID, false);

  if (validacionRecibo.result === false) {
    return res.json(validacionRecibo);
  }

  fechaCancelado = fechaCancelado || moment().format("DD/MM/YYYY");

  return res.json(
    await procesarRecibo({
      id,
      estatus: "Cancelado",
      motivoCancelacion,
      fechaCancelado,
      evidencia: null,
      fechaPago: null,
      formaPago: null,
    })
  );
};
