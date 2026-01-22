const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const cotizacionesController = require("../controllers/cotizacionesController");

// Aplica el middleware a todas las rutas del subrouter
router.use(authMiddleware);

// Cotizaciones
router.post('/cotizaciones',                cotizacionesController.getAll);
router.get('/cotizacion/:id',               cotizacionesController.getRecord);
router.post('/cotizacion',                  cotizacionesController.createOrUpdate);
router.post('/cotizacion/eliminar',         cotizacionesController.deleteRecord);
router.post('/cotizacion/eliminar/soft',    cotizacionesController.softDelete);

module.exports = router;
