const express = require('express');
const router = express.Router();
const upload = require("./multerConfig"); 

//prettier-ignore
const exampleController                 = require('../controllers/exampleController');
const authController                    = require('../controllers/authController');
const usuarioController                 = require('../controllers/usuarioController');
const agenteController                  = require('../controllers/agenteController');
const agenteCompaniasController         = require('../controllers/agenteCompaniasController');
const agenteClavesController            = require('../controllers/agenteClavesController');
const agenteSubAgentesController        = require('../controllers/agenteSubAgentesController');
const agenteAsistentesController        = require('../controllers/agenteAsistentesController');
const polizasController                 = require('../controllers/polizasController');
const cotizacionesController            = require('../controllers/cotizacionesController');
const clienteController                 = require('../controllers/clienteController');
const aseguradoController               = require('../controllers/aseguradoController');
const cobranzaController               = require('../controllers/cobranzaController');
const procesosAutomatizadosController   = require('../controllers/procesosAutomatizadosController');


const companiaRepresentantesController = require('../controllers/companiaRepresentantesController');
const polizaAseguradosController = require('../controllers/polizaAseguradosController');
const dashboardController = require('../controllers/dashboardController');
const catalogosController = require('../controllers/catalogosController');
const historicoController = require('../controllers/historicoController');
const catalogoController = require('../controllers/catalogoController');
const companiaController = require('../controllers/companiaController');
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
router.post('/api/agente/companias',            agenteCompaniasController.getCompanias);
router.post('/api/agente/companias/actualizar', agenteCompaniasController.updateCompanias);
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

// Cotizaciones
router.post('/api/cotizaciones',            cotizacionesController.getAll);
router.get('/api/cotizacion/:id',           cotizacionesController.getRecord);
router.post('/api/cotizacion',              cotizacionesController.createOrUpdate);
router.post('/api/cotizacion/eliminar',     cotizacionesController.deleteRecord);
router.post('/api/cotizaciones/cotizar',    procesosAutomatizadosController.estimarCotizaciones);
router.post('/api/cotizaciones/emitir',     procesosAutomatizadosController.emitirCotizaciones);
router.post('/api/cotizaciones/reprocesar', procesosAutomatizadosController.reprocesarPoliza);

// Clientes
router.post('/api/clientes',                clienteController.getAll);
router.get('/api/cliente/:id',              clienteController.getRecord);
router.post('/api/cliente',                 clienteController.createOrUpdate);
router.post('/api/cliente/eliminar',        clienteController.deleteRecord);
router.post('/api/cliente/polizas',         clienteController.obtenerPolizasCliente);

// Asegurados
router.post('/api/asegurados',              aseguradoController.getAll);
router.get('/api/asegurado/:id',            aseguradoController.getRecord);
router.post('/api/asegurado',               aseguradoController.createOrUpdate);
router.post('/api/asegurado/eliminar',      aseguradoController.deleteRecord);
router.post('/api/asegurado/polizas',       aseguradoController.obtenerPolizasCliente);

// Cobranza
router.post('/api/recibos',                 cobranzaController.getAll);
router.get('/api/recibo/:id',               cobranzaController.getRecord);
router.post('/api/recibo/cancelar',         cobranzaController.cancelarRecibo);
router.post('/api/recibo/pagar', upload.single("soporte"), cobranzaController.pagarRecibo);

// Ruta dinámica para todos los catálogos
router.post('/api/catalogos/:catalogo', (req, res) => {
  const catalogo = req.params.catalogo; // Captura el valor dinámico de la URL
  catalogosController.getCatalogo(req, res, catalogo);
});

module.exports = router;
