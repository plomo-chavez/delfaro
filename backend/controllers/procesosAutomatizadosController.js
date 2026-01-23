const { Cotizaciones } = require("../models");
const { ejecutarCotizacion } = require("../bots/planSeguroCotizacion");
const {
  handleEstimarCotizaciones,
  handleEmitirPolizas,
  handleReprocesarPolizas,
} = require("../controllers/robotController");

const {
  procesoActualizacionEstadoCotizaciones,
} = require("../controllers/cotizacionesController");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.emitirCotizaciones = async (req, res) => {
  try {
    let data = req.body;

    // prettier-ignore
    const responsePrimerProceso = await procesoActualizacionEstadoCotizaciones(data);

    if (!responsePrimerProceso.result) {
      return res.json(responsePrimerProceso);
    }
    const cotizacionInBD = responsePrimerProceso.data.cotizacion.toJSON();
    const configuracion = JSON.parse(cotizacionInBD.configuracion);
    console.log(
      "responsePrimerProceso:",
      configuracion.cotizacionesSeleccionadas[0],
    );

    // const resultado = await handleEmitirPolizas(configuracion.cotizacionesSeleccionadas);
    // res.json({
    //   result: true,
    //   message: "Cotizaciones emitidas con éxito",
    //   data: resultado,
    // });

    const cotizacion = await Cotizaciones.findByPk(
      responsePrimerProceso.data.cotizacion_id,
    );

    return res.json({
      ...responsePrimerProceso,
      data: cotizacion,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    res.json({
      result: false,
      message: error.message || "Error al emitir la póliza",
    });
  }
};

exports.reprocesarPoliza = async (req, res) => {
  try {
    let data = req.body; // Obtener los datos del cuerpo de la solicitud
    if (!data.compania) {
      res.json({
        result: true,
        message: "No se proporcionó una compañía para emitir la póliza",
      });
    }
    const resultado = await handleReprocesarPolizas(data);
    res.json({
      result: true,
      message: "Cotizaciones emitidas con éxito",
      data: resultado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    res.json({
      result: false,
      message: error.message || "Error al emitir la póliza",
    });
  }
};

exports.estimarCotizaciones = async (req, res) => {
  try {
    let data = req.body; // Obtener los datos del cuerpo de la solicitud
    let bot = data.bot || null; // Nombre del bot a ejecutar
    const resultado = [];

    const cotizaciones = data.configuracion.cotizaciones || [];

    await Promise.all(
      cotizaciones.map(async (cotizacion, idx) => {
        //pretty-ignore
        if (bot) {
          cotizacion = { bot: data.bot, ...cotizacion };
        }

        await delay(idx * 5000);

        const detalle = await handleEstimarCotizaciones(cotizacion);

        if (detalle.msgError) {
          console.log("");
          console.log("");
          console.log("-------------------");
          console.log("Error en la cotización:", detalle.msgError);
          console.log("-------------------");
          console.log("");
          console.log("");
        }

        resultado.push(detalle);
      }),
    );

    res.json({
      result: true,
      message: "Cotizaciones estimadas con éxito",
      data: resultado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
