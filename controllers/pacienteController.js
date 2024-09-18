import Paciente from "../models/Paciente.js";
import mongoose from "mongoose";

const obtenerPacientes = async (req, res) => {
  const pacientes = await Paciente.find()
    .where("veterinario") //nombre textual de la columna en la DB- Si vemos el schema del model Paciente, 'veterinario':ObjectId..
    .equals(req.veterinario); //aca esta el valor de la variable veterinario que retorna checkAuth (req.veterinario = await Veterinario.findById(decoded.id).select("-password -confirmado -token")- Aca se almacena el objeto veterinario excepto los campos passw, confr,tokn)

  return res.json(pacientes);
};

const agregarPaciente = async (req, res) => {
  const paciente = new Paciente(req.body);
  paciente.veterinario = req.veterinario._id; // Agregamos el veterinario para completar los campos requeridos en el modelo Paciente. la sesion de veterinario esta en req.veterianrio, esto lo retorna la funcion checkAuth. En el modelo paciente necesitamos el id del veterinario por ello el ._id {asi lo coloca mongoDB}

  //Interaccion con la Db-- Try catch / async - await

  try {
    const pacaienteAlmacenado = await paciente.save();
    res.json(pacaienteAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerPaciente = async (req, res) => {
  const { id } = req.params;

  // Validar si el id es un ObjectId válido. Usamos el metodo de mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID no válido" });
  }

  try {
    const paciente = await Paciente.findById(id);

    if (!paciente) {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    // Comprobar que el veterinario esté autenticado
    if (
      paciente.veterinario._id.toString() !== req.veterinario._id.toString()
    ) {
      return res.status(403).json({ msg: "Acción no válida" });
    }

    //Mostramos el Paciente
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

const actualizarPaciente = async (req, res) => {
  const { id } = req.params;

  // Validar si el id es un ObjectId válido. Usamos el metodo de mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID no válido" });
  }

  try {
    const paciente = await Paciente.findById(id);

    if (!paciente) {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    // Comprobar que el veterinario esté autenticado
    if (
      paciente.veterinario._id.toString() !== req.veterinario._id.toString()
    ) {
      return res.status(403).json({ msg: "Acción no válida" });
    }

    //Actualizar Paciente
    try {
      const pacienteActualizado = await Paciente.findByIdAndUpdate(id, req.body, { new: true });//Este metodo previene tener que pasar manualmente los datos del paciente si no han sido modificados.
      res.json(pacienteActualizado);
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
const eliminarPaciente = async (req, res) => {
  const { id } = req.params;

  // Validar si el id es un ObjectId válido. Usamos el metodo de mongoose
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "ID no válido" });
  }

  try {
    const paciente = await Paciente.findById(id);

    if (!paciente) {
      return res.status(404).json({ msg: "Paciente no encontrado" });
    }

    // Comprobar que el veterinario esté autenticado
    if (
      paciente.veterinario._id.toString() !== req.veterinario._id.toString()
    ) {
      return res.status(403).json({ msg: "Acción no válida" });
    }

    //Eliminar Paciente
    try {
      await Paciente.deleteOne();
      res.json({msg:'Paciente eliminado correctamente'});
    } catch (error) {
      console.log(error);
    }

  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export {
  obtenerPacientes,
  agregarPaciente,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
