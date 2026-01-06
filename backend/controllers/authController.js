const { deleteById, getAllFrom, exportData } = require("./controller");
const { toPlain, findOneUser } = require("../db/customFunctions");
const { Usuarios, TiposDeUsuarios } = require("../models"); // Asegúrate de importar correctamente tu modelo

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const {
  createTokenJWT,
  verifyEncryptedJWT,
} = require("../utils/encryptHelper"); // Importa tu helper
const tabla = "cliente";

/**
 * Obtener todos los registros de la tabla clientes.
 */

function segundosAHorasMinutosSegundos(segundos) {
  const hrs = Math.floor(segundos / 3600);
  const mins = Math.floor((segundos % 3600) / 60);
  const secs = segundos % 60;
  return {
    horas: hrs,
    minutos: mins,
    segundos: secs,
  };
}

exports.verificarToken = async (req, res) => {
  let params = req.body || {};
  let token = params.token || req.headers.authorization;
  if (!token) {
    return res.json({
      result: false,
      message: "Token no proporcionado",
    });
  }
  try {
    // Verifica y decodifica el token JWT
    const decoded = verifyEncryptedJWT(token);

    if (!decoded) {
      return res.json({
        result: false,
        message: "Token inválido",
      });
    }

    // Busca al usuario por ID
    // let user = await findOneUser({
    //   id: decoded.id,
    // });

    let user = await Usuarios.findOne({
      where: { id: decoded.id },
      include: [
        {
          model: TiposDeUsuarios,
          as: "tipo",
          attributes: ["id", "label"],
        },
      ],
      raw: true,
      nest: true,
    });

    if (!user) {
      return res.json({
        result: false,
        message: "Usuario no encontrado",
      });
    }

    user = await exportData(user);
    return res.json({
      result: true,
      message: "Usuario verificado",
      data: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        tipo: user.tipo.label,
        tipo_id: user.tipo.id,
      },
    });
  } catch (error) {
    console.log("Error al verificar el token:", error.message);
    return res.json({
      result: false,
      message: "Error al verificar el token",
    });
  }
};

exports.login = async (req, res) => {
  let params = req.body || {};

  if (!params.email || !params.password) {
    return res.json({
      result: false,
      message: "Correo y contraseña son requeridos",
    });
  }

  let user = await Usuarios.findOne({
    where: { correo: params.email, estatus: 1 },
    include: [
      {
        model: TiposDeUsuarios,
        as: "tipo",
        attributes: ["id", "label"],
      },
    ],
    raw: true,
    nest: true,
  });

  if (!user) {
    return res.json({
      result: false,
      message: "Usuario no encontrado o inactivo",
    });
  }

  user = await exportData(user);
  // Aquí deberías validar la contraseña con bcrypt.compare(params.password, user.password)
  const passwordValida = await bcrypt.compare(params.password, user.password);
  if (!passwordValida) {
    return res.json({
      result: false,
      message: "Usuario o contraseña incorrectos",
    });
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || "10s"; // Valor por defecto

  // Genera y cifra el token JWT
  const encryptedToken = createTokenJWT(
    {
      id: user.id,
      correo: user.correo,
      tipo: user.tipo.label,
      tipo_id: user.tipo.id,
    },
    expiresIn
  );

  return res.json({
    result: true,
    message: "Usuario encontrado",
    data: {
      userData: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        tipo: user.tipo.label,
        tipo_id: user.tipo.id,
      },
      token: encryptedToken, // Devuelve el token cifrado
    },
  });
};
