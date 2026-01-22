const express = require('express');
const router = express.Router();

//prettier-ignore
const catalogosController  = require('../controllers/catalogosController');
const exampleController = require('../controllers/exampleController');
const authController  = require('../controllers/authController');

const usuariosRoutes = require("./usuariosRoutes");
const companiasRoutes = require("./companiasRoutes");
const agenteRoutes = require("./agentesRoutes");
const clienteRoutes = require("./clientesRoutes");
const cobranzaRoutes = require("./cobranzaRoutes");
const cotizacionesRoutes = require("./cotizacionesRoutes");
const polizasRoutes = require("./polizasRoutes");
const reportesRoutes = require("./reportesRoutes");
const catalogosRoutes = require("./catalogosRoutes");
const multiCotizadorRoutes = require("./multiCotizadorRoutes");
const cotizadorRoutes = require("./cotizadorRoutes");

router.post('/api/example',   exampleController.example);
router.post('/api/login',     authController.login);
router.post('/api/verificar', authController.verificarToken);

// Ruta dinámica para todos los catálogos
router.post('/api/catalogos/:catalogo', (req, res) => {
  const catalogo = req.params.catalogo; // Captura el valor dinámico de la URL
  catalogosController.getCatalogo(req, res, catalogo);
});

router.use("/api/", cotizadorRoutes); 
router.use("/api", usuariosRoutes); 
router.use("/api", agenteRoutes); 
router.use("/api", clienteRoutes); 
router.use("/api", cobranzaRoutes); 
router.use("/api", polizasRoutes); 
router.use("/api", reportesRoutes); 
router.use("/api", companiasRoutes); 
router.use("/api", catalogosRoutes); 
router.use("/api", cotizacionesRoutes); 
router.use("/api/wizard", multiCotizadorRoutes); 

module.exports = router;
