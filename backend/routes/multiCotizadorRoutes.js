const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multiCotizadorController = require("../controllers/multiCotizadorController");

// Aplica el middleware a todas las rutas del subrouter
router.use(authMiddleware);

router.post('/multicotizador/steps',    multiCotizadorController.steps);

module.exports = router;
