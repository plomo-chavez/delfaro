const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const companiaController = require("../controllers/companiaController");

// Aplica el middleware a todas las rutas del subrouter
router.use(authMiddleware);

router.post('/companias',               companiaController.getAll);
router.post('/compania',                companiaController.createOrUpdate);
router.get('/compania/:id',             companiaController.getRecord);
router.post('/compania/eliminar',       companiaController.delete);
router.post('/compania/eliminar/soft',  companiaController.softDelete);

router.get('/compania/ramos/:id',       companiaController.getRamos);
router.post('/compania/ramos',          companiaController.updateRamos);

router.post('/compania/representantes',                 companiaController.getRepresentantes);
router.post('/compania/representante',                  companiaController.createOrUpdateRepresentante);
router.post('/compania/representante/eliminar',         companiaController.deleteRepresentante);
router.post('/compania/representante/eliminar/soft',    companiaController.softDeleteRepresentante);

router.post('/compania/productos',                 companiaController.getProductos);
router.post('/compania/producto',                  companiaController.createOrUpdateProducto);
router.post('/compania/producto/eliminar',         companiaController.deleteProducto);
router.post('/compania/producto/eliminar/soft',    companiaController.softDeleteProducto);

module.exports = router;
