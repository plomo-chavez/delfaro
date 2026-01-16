const jwt = require("jsonwebtoken");
const { verifyEncryptedJWT } = require("../utils/encryptHelper"); // Importa tu helper

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1]; // Extraer el token después de "Bearer"

  try {
    // Verifica y decodifica el token JWT
    const decoded = verifyEncryptedJWT(token);
    req.user = decoded; // Agregar los datos del usuario al objeto de la solicitud
    next(); // Continuar con la siguiente función
  } catch (error) {
    return res.json({ message: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;
