const { Usuarios } = require("../models"); // Asegúrate de importar correctamente tu modelo
const bcrypt = require("bcryptjs");
const { updateRecord } = require("../controllers/CRUDController");
const {
  createTokenJWT,
  verifyEncryptedJWT,
} = require("../utils/encryptHelper"); // Importa tu helper
exports.example = async (req, res) => {
  const { token } = req.body;

  // Verifica y decodifica el token JWT
  const decoded = verifyEncryptedJWT(token);

  console.log("Decoded Token:", decoded);
  return res.json({
    result: true,
    message: "Ejemplo ejecutado correctamente",
  });
};
