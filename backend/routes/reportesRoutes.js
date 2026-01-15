const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const cobranzaController = require("../controllers/cobranzaController");
const upload = require("../middleware/multerConfig"); 

module.exports = router;
