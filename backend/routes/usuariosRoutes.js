const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const usuarioController = require("../controllers/usuarioController");

// Aplica el middleware a todas las rutas del subrouter
router.use(authMiddleware);
router.post('/usuarios',                 usuarioController.getAll);
router.get( '/usuario/:id',              usuarioController.getUser);
router.post('/usuario',                  usuarioController.createOrUpdate);
router.post('/usuario/eliminar',         usuarioController.delete);
router.post('/usuario/eliminar/soft',    usuarioController.softDelete);
router.post('/usuario/cambiar',          usuarioController.cambiarContrasenia);
router.post('/usuario/restablecer',      usuarioController.restablecer);
router.get( '/usuario/confirmar/:token', usuarioController.confirmar);

module.exports = router;
