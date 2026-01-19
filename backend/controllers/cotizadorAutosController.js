const { Cotizaciones } = require("../models");
const {
  handleEstimarCotizaciones,
  handleEmitirPolizas,
  handleReprocesarPolizas,
} = require("../controllers/robotController");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

exports.cotizar = async (req, res) => {
  try {
    let { cotizaciones, cotizacion_id } = req.body; // Obtener los datos del cuerpo de la solicitud

    const resultado = [];

    await Promise.all(
      cotizaciones.map(async (cotizacion, idx) => {
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

    if (cotizacion_id) {
      Cotizaciones.findByPk(cotizacion_id).then(async (cotizacion) => {
        let configuracion = JSON.parse(cotizacion.configuracion);
        let cotizacionesBD = [];
        let nuevasCotizaciones = [];

        if (!configuracion.cotizaciones) {
          configuracion.cotizaciones = [];
        }
        configuracion.cotizaciones.forEach((cotizacion) => {
          if (cotizacion.num) {
            cotizacionesBD.push(cotizacion);
          }
        });

        resultado.forEach((resCotizacion, index) => {
          let existe = cotizacionesBD.find(
            (cot) => cot.num == resCotizacion.num,
          );
          nuevasCotizaciones.push(resCotizacion);
          if (existe) {
          }
        });

        if (nuevasCotizaciones.length != 0) {
          configuracion.cotizaciones = nuevasCotizaciones;
          cotizacion.configuracion = JSON.stringify(configuracion);
          await cotizacion.save();
        }
      });
    }

    res.json({
      result: true,
      message: "Cotizaciones estimadas con éxito",
      data: resultado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
