const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const companiaController = require("../controllers/companiaController");

// Aplica el middleware a todas las rutas del subrouter
router.use(authMiddleware);

router.post('/companias',                companiaController.getAll);
router.post('/compania',                 companiaController.createOrUpdate);
router.get('/compania/:id',              companiaController.getRecord);
router.post('/compania/eliminar',        companiaController.delete);
router.post('/compania/eliminar/soft',   companiaController.softDelete);

router.get('/compania/ramos/:id',   companiaController.getRamos);
router.post('/compania/ramos',   companiaController.updateRamos);

module.exports = router;
