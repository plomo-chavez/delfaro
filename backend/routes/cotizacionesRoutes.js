const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const cotizacionesController = require("../controllers/cotizacionesController");
const procesosAutomatizadosController   = require('../controllers/procesosAutomatizadosController');


// Cotizaciones
router.post('/cotizaciones',            cotizacionesController.getAll);
router.get('/cotizacion/:id',           cotizacionesController.getRecord);
router.post('/cotizacion',              cotizacionesController.createOrUpdate);
router.post('/cotizacion/eliminar',     cotizacionesController.deleteRecord);
router.post('/cotizaciones/cotizar',    procesosAutomatizadosController.estimarCotizaciones);
router.post('/cotizaciones/emitir',     procesosAutomatizadosController.emitirCotizaciones);
router.post('/cotizaciones/reprocesar', procesosAutomatizadosController.reprocesarPoliza);

module.exports = router;
