const { createOrUpdatedRecord, validateRecord } = require("./CRUDController");
const { getAllFromModel } = require("../db/customFunctions");
const { enviarCorreo } = require("../utils/emailServiceHelper");
const { Op } = require("sequelize");
const moment = require("moment");
const fs = require("fs");
const { Clientes, Polizas } = require("../models");
const entidad = "Cliente";
const fields = [
  "id",
  "nombre",
  "rfc",
  "telefono",
  "correo",
  "curp",
  "created_at",
  "updated_at",
];

async function processRecord(data) {
  try {
    let payload = { ...data };
    const createUserValidation = data.id ? false : true;

    if (createUserValidation) {
      // proceso de creacion
      payload.isCliente = 1;
    } else {
      // proceso de actualizacion
      let dataTmp = payload;
      delete dataTmp.created_at;
      delete dataTmp.updated_at;
      delete dataTmp.isCliente;
      delete dataTmp.createdAt;
      delete dataTmp.updatedAt;
      delete dataTmp.data;
      delete dataTmp.id;

      payload = {
        id: data.id,
        rfc: data.rfc,
        curp: data.curp,
        correo: data.correo,
        telefono: data.telefonoFijo,
        data: JSON.stringify(dataTmp),
        nombre: `${data.nombre} ${data?.segundoNombre ?? ""} ${
          data?.apellidoPaterno ?? ""
        } ${data?.apellidoMaterno ?? ""}`,
      };
    }

    const response = await createOrUpdatedRecord("Clientes", payload);

    return response;
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
    const filtros = req.body.filtros || {};
    const page = parseInt(req.body.page) || 1;
    const pageSize = parseInt(req.body.pageSize) || 10;

    filtros.isCliente = 1;

    // Define los campos y relaciones a incluir
    const include = [];

    // Llama a la función genérica
    const response = await getAllFromModel({
      attributes: fields,
      model: Clientes,
      pageSize,
      filtros,
      include,
      page,
    });

    // Devuelve la respuesta
    return res.json(response);
  } catch (error) {
    console.log("Error en getAll:", error);
    return res.json({
      result: false,
      message: "Error al obtener los registros: " + error.message,
      data: [],
    });
  }
};

exports.getRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Clientes.findOne({
      where: { id, isCliente: 1 },
    });

    if (!record) {
      return res.json({
        result: false,
        message: entidad + " no encontrado",
      });
    }

    return res.json({
      result: true,
      message: entidad + " obtenido con éxito",
      data: record,
    });
  } catch (error) {
    console.log("Error al obtener " + entidad + ":", error);
    return res.json({
      result: false,
      message: "Error al obtener " + entidad,
    });
  }
};

exports.createOrUpdate = async (req, res) => {
  const data = req.body;
  const response = await processRecord(data);

  if (response.data) delete response.data;

  res.json(response);
};

exports.deleteRecord = async (req, res) => {
  const { id } = req.body;

  // Validar que se proporcione un ID
  if (!id) {
    return res.json({
      result: false,
      message: "ID de " + entidad + " es requerido",
    });
  }

  try {
    // Actualizar el estatus del usuario a 0 (eliminado lógico)
    const response = await createOrUpdatedRecord("Clientes", {
      id,
      isCliente: 1,
      estatus: 0,
    });

    if (!response.result) {
      return res.json({
        result: false,
        message: entidad + " no encontrado o no se pudo eliminar",
      });
    }

    // Respuesta exitosa
    return res.json({
      result: true,
      message: entidad + " eliminado con éxito",
    });
  } catch (error) {
    console.log("Error al eliminar " + entidad + ":", error);
    return res.json({
      result: false,
      message: "Error al eliminar " + entidad + ": " + error.message,
    });
  }
};

exports.obtenerPolizasCliente = async (req, res) => {
  const { cliente_id } = req.body;

  // Validar que se proporcione un ID
  if (!cliente_id) {
    return res.json({
      result: false,
      message: "ID del cliente es requerido",
    });
  }

  try {
    const polizasConsulta = await Polizas.findAll({
      where: { cliente_id },
    });

    // Respuesta exitosa
    return res.json({
      result: true,
      message: entidad + " eliminado con éxito",
      data: polizasConsulta,
    });
  } catch (error) {
    console.log("Error al eliminar " + entidad + ":", error);
    return res.json({
      result: false,
      message: "Error al eliminar " + entidad + ": " + error.message,
    });
  }
};
