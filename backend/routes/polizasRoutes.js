const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const polizasController = require("../controllers/polizasController");

// Polizas
router.post('/polizas',                 polizasController.getAll);
router.get('/poliza/:id',               polizasController.getRecord);
router.post('/poliza/asegurados',       polizasController.getAsegurados);
router.post('/poliza/archivos',         polizasController.getArchivos);
router.post('/poliza/renovar',          polizasController.renovarPoliza);
router.post('/poliza/corregir',         polizasController.corregirPoliza);
router.post('/poliza/envio/correo',     polizasController.enviarCorreo);
router.post('/poliza/envio/whatsapp',   polizasController.enviarWhatsApp);
router.post('/poliza/historial',        polizasController.getHistorial);
router.post('/poliza/cancelar',         polizasController.cancelarPoliza);
router.post('/poliza/recibos',          polizasController.getRecibos);

module.exports = router;
