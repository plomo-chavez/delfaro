const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const clienteController = require("../controllers/clienteController");

// Aplica el middleware a todas las rutas del subrouter
router.use(authMiddleware);

// Clientes
router.post('/clientes',                clienteController.getAll);
router.get('/cliente/:id',              clienteController.getRecord);
router.post('/cliente',                 clienteController.createOrUpdate);
router.post('/cliente/eliminar',        clienteController.deleteRecord);
router.post('/cliente/polizas',         clienteController.obtenerPolizasCliente);

module.exports = router;
