const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const catalogoController = require("../controllers/catalogoController");

// Aplica el middleware a todas las rutas del subrouter
// router.use(authMiddleware);

// Clientes
// Clientes
router.post('/catalogo/:catalogo',              (req, res) => catalogoController.getData(req, res, false));
router.post('/catalogo/:catalogo/get',              (req, res) => catalogoController.getData(req, res, true));
router.post('/catalogo/:catalogo/eliminar',         catalogoController.delete);
router.post('/catalogo/:catalogo/eliminar/soft',    catalogoController.deleteSoftData);
module.exports = router;
