const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const cobranzaController = require("../controllers/cobranzaController");
const upload = require("../middleware/multerConfig"); 

// Aplica el middleware a todas las rutas del subrouter
router.use(authMiddleware);

// Cobranza
router.post('/recibos',                 cobranzaController.getAll);
router.get('/recibo/:id',               cobranzaController.getRecord);
router.post('/recibo/cancelar',         cobranzaController.cancelarRecibo);
router.post('/recibo/pagar', upload.single("soporte"), cobranzaController.pagarRecibo);

module.exports = router;
