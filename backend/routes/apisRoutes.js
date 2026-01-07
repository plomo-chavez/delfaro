const express = require('express');
const router = express.Router();
const upload = require("./multerConfig"); 

//prettier-ignore
const exampleController             = require('../controllers/exampleController');
const authController                = require('../controllers/authController');
const usuarioController             = require('../controllers/usuarioController');
const agenteController              = require('../controllers/agenteController');
const agenteClavesController        = require('../controllers/agenteClavesController');
const agenteSubAgentesController    = require('../controllers/agenteSubAgentesController');
const agenteAsistentesController    = require('../controllers/agenteAsistentesController');
const polizasController             = require('../controllers/polizasController');

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
const reciboController = require('../controllers/reciboController');
const robotController = require('../controllers/robotController');

router.post('/api/example', exampleController.example);
router.post('/api/login', authController.login);
router.post('/api/verificar', authController.verificarToken);

// Usuarios
router.get( '/api/usuario/:id',                 usuarioController.getUser);
router.post('/api/usuarios',                    usuarioController.getAll);
router.post('/api/usuario',                     usuarioController.createOrUpdate);
router.post('/api/usuario/eliminar',            usuarioController.delete);
router.post('/api/usuario/cambiar',             usuarioController.cambiarContrasenia);
router.post('/api/usuario/restablecer',         usuarioController.restablecer);
router.get( '/api/usuario/confirmar/:token',    usuarioController.confirmar);

// Agentes
router.post('/api/agentes',                     agenteController.getAll);
router.get( '/api/agente/:id',                  agenteController.getRecord);
router.post('/api/agente',                      agenteController.createOrUpdate);
router.post('/api/agente/eliminar',             agenteController.deleteRecord);

// AgenteClaves
router.post('/api/agente/claves',               agenteClavesController.getAll);
router.post('/api/agente/clave',                agenteClavesController.createOrUpdate);
router.post('/api/agente/clave/eliminar',       agenteClavesController.deleteRecord);

// AgenteSubAgentes
router.post('/api/agente/subagentes',           agenteSubAgentesController.getAll);
router.post('/api/agente/subagente',            agenteSubAgentesController.createOrUpdate);
router.post('/api/agente/subagente/eliminar',   agenteSubAgentesController.deleteRecord);

// AgenteAsistentes
router.post('/api/agente/asistentes',           agenteAsistentesController.getAll);
router.post('/api/agente/asistente',            agenteAsistentesController.createOrUpdate);
router.post('/api/agente/asistente/eliminar',   agenteAsistentesController.deleteRecord);

// Polizas
router.post('/api/polizas',                 polizasController.getAll);
router.get('/api/poliza/:id',               polizasController.getRecord);
router.post('/api/poliza/asegurados',       polizasController.getAsegurados);
router.post('/api/poliza/archivos',         polizasController.getArchivos);
router.post('/api/poliza/renovar',          polizasController.renovarPoliza);
router.post('/api/poliza/corregir',         polizasController.corregirPoliza);
router.post('/api/poliza/envio/correo',     polizasController.enviarCorreo);
router.post('/api/poliza/envio/whatsapp',   polizasController.enviarWhatsApp);
router.post('/api/poliza/historial',        polizasController.getHistorial);
router.post('/api/poliza/cancelar',         polizasController.cancelarPoliza);
router.post('/api/poliza/recibos',          polizasController.getRecibos);



module.exports = router;
