const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const usuarioController = require("../controllers/usuarioController");

// Aplica el middleware a todas las rutas del subrouter
router.use(authMiddleware);
router.post('/usuarios',                    authMiddleware, usuarioController.getAll);
router.get( '/usuario/:id',                 authMiddleware, usuarioController.getUser);
router.post('/usuario',                     authMiddleware, usuarioController.createOrUpdate);
router.post('/usuario/eliminar',            authMiddleware, usuarioController.delete);
router.post('/usuario/eliminar/soft',       authMiddleware, usuarioController.softDelete);
router.post('/usuario/cambiar',             authMiddleware, usuarioController.cambiarContrasenia);
router.post('/usuario/restablecer',         authMiddleware, usuarioController.restablecer);
router.get( '/usuario/confirmar/:token',    authMiddleware, usuarioController.confirmar);

module.exports = router;
