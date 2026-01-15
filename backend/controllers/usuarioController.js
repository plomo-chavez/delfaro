const { Usuarios, TiposDeUsuarios } = require("../models"); // Asegúrate de importar correctamente tu modelo
const { toPlain, getAllFromModel } = require("../db/customFunctions");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const {
  createShortToken,
  verifyShortToken,
} = require("../utils/encryptHelper"); // Importa tu helper
const {
  validateRecord,
  createRecord,
  updateRecord,
} = require("../controllers/CRUDController");

/**
 * Validar los datos requeridos para crear o actualizar un usuario.
 */
function validateUserData(data) {
  if (!data.nombre || !data.correo || !data.tipo || !data.tipo.id) {
    return {
      result: false,
      message: "Faltan campos requeridos",
      data: [],
    };
  }
  return { result: true };
}

/**
 * Transformar los datos del usuario antes de guardarlos.
 */
async function transformUserData(data) {
  // Transformar estatus
  data.estatus =
    data.estatus === "Activo" ||
    data.estatus === true ||
    data.estatus === "true"
      ? 1
      : 0;

  // Extraer tipo_id
  data.tipo_id = data.tipo.id;
  delete data.tipo;

  // Encriptar contraseña si existe
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  return data;
}

/**
 * Crear o actualizar un usuario.
 */
async function saveUser(data) {
  try {
    const createUserValidation = data.id ? false : true;
    // Validar datos
    const validation = validateUserData(data);
    if (!validation.result) return validation;

    // Validar correo único
    const existeCorreo = await validateRecord("Usuarios", {
      correo: data.correo,
      ...(data.id && { id: { [Op.ne]: data.id } }), // Si es actualización, excluir el ID actual
    });

    const nextStep = !existeCorreo.result;

    if (nextStep) {
      return {
        result: false,
        message: "El correo ya está en uso",
        data: [],
      };
    }

    // Transformar datos
    data = await transformUserData(data);

    // Crear o actualizar registro
    const usuario = createUserValidation
      ? await createRecord("Usuarios", data)
      : await updateRecord("Usuarios", data);

    return {
      result: true,
      message: data.id
        ? "Registro actualizado con éxito"
        : "Registro creado con éxito",
      data: usuario,
    };
  } catch (e) {
    return {
      result: false,
      message: "Error al guardar el registro: " + e.message,
      data: [],
    };
  }
}

exports.getAll = async (req, res) => {
  try {
    // Recibe filtros, paginación y otros parámetros desde el body
    const paranoid = true; // Habilitar modo paranoid para excluir registros soft-deleted
    const filtros = req.body.filtros || {};
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    // Define los campos y relaciones a incluir
    const attributes = [
      "id",
      "nombre",
      "correo",
      "tipo_id",
      "estatus",
      "created_at",
      "updated_at",
      "deleted_at",
    ];

    const include = [
      {
        model: TiposDeUsuarios,
        as: "tipo",
        attributes: ["id", "label"],
      },
    ];

    // Llama a la función genérica
    const response = await getAllFromModel({
      model: Usuarios,
      filtros,
      attributes,
      include,
      page,
      pageSize,
      paranoid,
    });

    // Devuelve la respuesta
    return res.json(response);
  } catch (error) {
    console.log("Error en getAll:", error);
    return res.json({
      result: false,
      message: "Error al obtener usuarios",
      data: [],
    });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await Usuarios.findOne({
      where: { id },
      attributes: ["id", "nombre", "correo", "tipo_id", "estatus"], // Campos a devolver
      include: [
        {
          model: TiposDeUsuarios,
          as: "tipo",
          attributes: ["id", "label"], // Relación con tipo de usuario
        },
      ],
    });

    if (!usuario) {
      return res.json({
        result: false,
        message: "Usuario no encontrado",
      });
    }

    return res.json({
      result: true,
      message: "Usuario obtenido con éxito",
      data: usuario,
    });
  } catch (error) {
    console.log("Error al obtener usuario:", error);
    return res.json({
      result: false,
      message: "Error al obtener usuario",
    });
  }
};

/**
 * Crear o actualizar un usuario (controlador).
 */
exports.createOrUpdate = async (req, res) => {
  const data = req.body;
  const response = await saveUser(data);

  // Si no quieres devolver el usuario creado/actualizado, elimina el campo `data`
  if (response.data) delete response.data;

  res.json(response);
};

exports.delete = async (req, res) => {
  const { id } = req.body;

  // Validar que se proporcione un ID
  if (!id) {
    return res.json({
      result: false,
      message: "ID de usuario es requerido",
    });
  }

  try {
    // Actualizar el estatus del usuario a 0 (eliminado lógico)
    const response = await updateRecord("Usuarios", { id, estatus: 0 });

    if (!response.result) {
      return res.json({
        result: false,
        message: "Usuario no encontrado o no se pudo eliminar",
      });
    }

    // Respuesta exitosa
    return res.json({
      result: true,
      message: "Usuario eliminado con éxito",
    });
  } catch (error) {
    console.log("Error al eliminar usuario:", error);
    return res.json({
      result: false,
      message: "Error al eliminar usuario: " + error.message,
    });
  }
};

exports.softDelete = async (req, res) => {
  const { id } = req.body;

  // Validar que se proporcione un ID
  if (!id) {
    return res.json({
      result: false,
      message: "ID de usuario es requerido",
    });
  }

  try {
    // Eliminar el usuario completamente de la base de datos
    const response = await Usuarios.destroy({
      where: { id },
    });

    if (!response.result) {
      return res.json({
        result: false,
        message: "Usuario no encontrado o no se pudo eliminar",
      });
    }

    // Respuesta exitosa
    return res.json({
      result: true,
      message: "Usuario eliminado con éxito",
    });
  } catch (error) {
    console.log("Error al eliminar usuario:", error);
    return res.json({
      result: false,
      message: "Error al eliminar usuario: " + error.message,
    });
  }
};

exports.cambiarContrasenia = async (req, res) => {
  const { id, contrasenia } = req.body;
  if (!id || !contrasenia) {
    return res.json({
      result: false,
      message: "ID de usuario y nueva contraseña son requeridos",
    });
  }

  try {
    //prettier-ignore
    let user = await Usuarios.findOne({ where: { id } });

    if (!user) {
      return res.json({
        result: false,
        message: "Usuario no encontrado",
      });
    }

    const hashedPassword = await bcrypt.hash(contrasenia, 10);

    const response = await updateRecord("Usuarios", {
      id,
      password: hashedPassword,
    });

    if (!response.result) {
      return res.json({
        result: false,
        message: "Usuario no encontrado o no se pudo actualizar la contraseña",
      });
    }

    return res.json({
      result: true,
      message: "Contraseña actualizada con éxito",
    });
  } catch (error) {
    console.log("Error al cambiar la contraseña:", error);

    return res.json({
      result: false,
      message: "Error al cambiar la contraseña: " + error.message,
    });
  }
};

exports.restablecer = async (req, res) => {
  const { correo, password, token } = req.body;
  if (!password) {
    // Proceso de solicitud de restablecimiento de contraseña
    if (!correo) {
      return res.json({
        result: false,
        message: "El correo es requerido para restablecer la contraseña",
      });
    }

    try {
      const usuario = await Usuarios.findOne({ where: { correo } });

      if (!usuario) {
        return res.json({
          result: false,
          message: "No se encontró un usuario con ese correo",
        });
      }

      let reset_token = createShortToken(2);

      reset_token = reset_token.toUpperCase();

      await updateRecord("Usuarios", {
        id: usuario.id,
        reset_token,
      });

      // Aquí iría la lógica para enviar un correo con el enlace de restablecimiento

      return res.json({
        result: true,
        message:
          "Se ha enviado un enlace de restablecimiento de contraseña al correo proporcionado",
      });
    } catch (error) {
      console.log("Error al solicitar restablecimiento de contraseña:", error);
      return res.json({
        result: false,
        message:
          "Error al solicitar restablecimiento de contraseña: " + error.message,
      });
    }
  } else {
    // Proceso de restablecimiento de contraseña
    if (!correo || !password) {
      return res.json({
        result: false,
        message: "Correo son requeridos para restablecer la contraseña",
      });
    }
    try {
      console.log(token);
      const isValidToken = verifyShortToken(token); // Aquí deberías validar el token recibido
      console.log(isValidToken);
      if (!isValidToken.result) {
        return res.json({
          result: false,
          message: "Token inválido o expirado",
        });
      }

      const usuario = await Usuarios.findOne({ where: { correo } });

      if (!usuario) {
        return res.json({
          result: false,
          message: "No se encontró un usuario con ese correo",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await updateRecord("Usuarios", {
        id: usuario.id,
        password: hashedPassword,
        reset_token: "", // Limpia el token después de usarlo
      });

      return res.json({
        result: true,
        message: "Contraseña restablecida con éxito",
      });
    } catch (error) {
      console.log("Error al restablecer la contraseña:", error);
      return res.json({
        result: false,
        message: "Error al restablecer la contraseña: " + error.message,
      });
    }
  }
};

exports.confirmar = async (req, res) => {
  const { token } = req.params;
  if (!token) {
    return res.json({
      result: false,
      message: "El token es requerido para confirmar el usuario",
    });
  }

  try {
    console.log(token);
    const isValidToken = verifyShortToken(token); // Aquí deberías validar el token recibido
    console.log(isValidToken);
    if (!isValidToken.result) {
      return res.json({
        result: false,
        message: "Token inválido o expirado",
      });
    }
    const expiresAt = isValidToken.expiresAt;
    const now = Math.floor(Date.now() / 1000);

    console.log("Ahora:", now);
    console.log("Expira en:", expiresAt);

    console.log(expiresAt < now ? "EXPIRADO" : "VIGENTE");

    const usuario = await Usuarios.findOne({ where: { reset_token: token } });

    if (!usuario) {
      return res.json({
        result: false,
        message: "Token inválido o usuario no encontrado",
      });
    }
    return res.json({
      result: true,
      message: "Usuario confirmado con éxito",
      data: toPlain(usuario),
    });
  } catch (error) {
    console.log("Error al confirmar usuario:", error);
    return res.json({
      result: false,
      message: "Error al confirmar usuario: " + error.message,
    });
  }
};
