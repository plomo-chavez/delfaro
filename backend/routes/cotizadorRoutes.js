const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const cotizadorAutosController = require("../controllers/cotizadorAutosController");

// Aplica el middleware a todas las rutas del subrouter
// router.use(authMiddleware);
router.post('/cotizador/autos/cotizar', cotizadorAutosController.cotizar);


module.exports = router;
