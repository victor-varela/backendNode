import express from "express";
import {
  obtenerPacientes,
  agregarPaciente,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente
} from "../controllers/pacienteController.js";
import checkAuth from "../middelware/authMiddelware.js";
const router = express.Router();

//Completamos CRUD

//1.Create-Read
router
  .route("/")
  .get(checkAuth, obtenerPacientes)
  .post(checkAuth, agregarPaciente);

//Obtener {Read} 1 paciente- Update -Delete {los verbos html son similares al CRUD}
router
  .route("/:id")
  .get(checkAuth, obtenerPaciente)
  .put(checkAuth, actualizarPaciente)
  .delete(checkAuth, eliminarPaciente);

export default router;

//Ambos routers {veterinaro y pacientes} tienen el mismo nombre {router} en sus archivos pero cuando lo importamos en el index le cambiamos el nombre y ya que son export default da igual el nombre que tienen en el archivo original, es el unico export que hay por eso discrimina en el index cual es la ruta de cada modelo.
