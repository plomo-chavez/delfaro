const express = require('express');
const router = express.Router();
const upload = require("./multerConfig"); 

const companiaRepresentantesController = require('../controllers/companiaRepresentantesController');
const procesosAutomatizadosController = require('../controllers/procesosAutomatizadosController');
const polizaAseguradosController = require('../controllers/polizaAseguradosController');
const cotizacionesController = require('../controllers/cotizacionesController');
const dashboardController = require('../controllers/dashboardController');
const catalogosController = require('../controllers/catalogosController');
const historicoController = require('../controllers/historicoController');
const catalogoController = require('../controllers/catalogoController');
const companiaController = require('../controllers/companiaController');
const clienteController = require('../controllers/clienteController');
const usuarioController = require('../controllers/usuarioController');
const polizasController = require('../controllers/polizasController');
const reciboController = require('../controllers/reciboController');
const robotController = require('../controllers/robotController');
const authController = require('../controllers/authController');
const exampleController = require('../controllers/exampleController');

router.post('/api/example', exampleController.example);
router.post('/api/login', authController.login);
router.post('/api/verificar', authController.verificarToken);

// Usuarios
//prettier-ignore
router.get('/api/usuario/:id',          usuarioController.getUser);
router.post('/api/usuarios',            usuarioController.getAll);
router.post('/api/usuario',             usuarioController.createOrUpdate);
router.post('/api/usuario/eliminar',    usuarioController.delete);
router.post('/api/usuario/cambiar',     usuarioController.cambiarContrasenia);
router.post('/api/usuario/restablecer', usuarioController.restablecer);
router.get('/api/usuario/confirmar/:token',   usuarioController.confirmar);
module.exports = router;
