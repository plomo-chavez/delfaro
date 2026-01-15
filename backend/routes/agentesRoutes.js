const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const agenteController = require("../controllers/agenteController");
const agenteCompaniasController         = require('../controllers/agenteCompaniasController');
const agenteClavesController            = require('../controllers/agenteClavesController');
const agenteSubAgentesController        = require('../controllers/agenteSubAgentesController');
const agenteAsistentesController        = require('../controllers/agenteAsistentesController');
// Aplica el middleware a todas las rutas del subrouter
router.use(authMiddleware);

// Agentes
router.post('/agentes',                     agenteController.getAll);
router.get( '/agente/:id',                  agenteController.getRecord);
router.post('/agente',                      agenteController.createOrUpdate);
router.post('/agente/eliminar',             agenteController.deleteRecord);

// AgenteClaves
router.post('/agente/companias',            agenteCompaniasController.getCompanias);
router.post('/agente/companias/actualizar', agenteCompaniasController.updateCompanias);
router.post('/agente/claves',               agenteClavesController.getAll);
router.post('/agente/clave',                agenteClavesController.createOrUpdate);
router.post('/agente/clave/eliminar',       agenteClavesController.deleteRecord);

// AgenteSubAgentes
router.post('/agente/subagentes',           agenteSubAgentesController.getAll);
router.post('/agente/subagente',            agenteSubAgentesController.createOrUpdate);
router.post('/agente/subagente/eliminar',   agenteSubAgentesController.deleteRecord);

// AgenteAsistentes
router.post('/agente/asistentes',           agenteAsistentesController.getAll);
router.post('/agente/asistente',            agenteAsistentesController.createOrUpdate);
router.post('/agente/asistente/eliminar',   agenteAsistentesController.deleteRecord);

module.exports = router;
