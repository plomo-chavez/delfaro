const express = require('express');
const router = express.Router();
const upload = require("../middleware/multerConfig"); 
const authMiddleware = require("../middleware/authMiddleware");

//prettier-ignore
const exampleController = require('../controllers/exampleController');
const authController  = require('../controllers/authController');

const usuariosRoutes = require("./usuariosRoutes");
const agenteRoutes = require("./agentesRoutes");
const clienteRoutes = require("./clientesRoutes");
const cobranzaRoutes = require("./cobranzaRoutes");
const cotizacionesRoutes = require("./cotizacionesRoutes");
const polizasRoutes = require("./polizasRoutes");
const reportesRoutes = require("./reportesRoutes");

router.post('/api/example',   exampleController.example);
router.post('/api/login',     authController.login);
router.post('/api/verificar', authController.verificarToken);

// Ruta dinámica para todos los catálogos
router.post('/api/catalogos/:catalogo', (req, res) => {
  const catalogo = req.params.catalogo; // Captura el valor dinámico de la URL
  catalogosController.getCatalogo(req, res, catalogo);
});

router.use("/api", usuariosRoutes); // Subrouter para usuarios
router.use("/api", agenteRoutes); // Subrouter para agentes
router.use("/api", clienteRoutes); // Subrouter para clientes
router.use("/api", cobranzaRoutes); // Subrouter para cobranza
router.use("/api", cotizacionesRoutes); // Subrouter para cotizaciones
router.use("/api", polizasRoutes); // Subrouter para polizas
router.use("/api", reportesRoutes); // Subrouter para reportes

module.exports = router;
