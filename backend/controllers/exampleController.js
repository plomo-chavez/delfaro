const { Usuarios } = require("../models"); // Asegúrate de importar correctamente tu modelo
const bcrypt = require("bcryptjs");
const { updateRecord } = require("../controllers/CRUDController");

exports.example = async (req, res) => {
  const { password, id } = req.body;

  let user = await Usuarios.findOne({
    where: { id },
  });

  console.log("Usuario encontrado:", user.password);

  const passwordValida = await bcrypt.compare(password, user.password);

  console.log("Password válida:", passwordValida);

  let passwordHash = await bcrypt.hash(password, 10);

  console.log("Password hash:", passwordHash);

  await updateRecord("Usuarios", {
    id,
    password: passwordHash,
  });

  return res.json({
    result: true,
    message: "Ejemplo ejecutado correctamente",
  });
};
