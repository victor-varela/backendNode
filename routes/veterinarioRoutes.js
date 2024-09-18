import express from "express";
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword
} from "../controllers/veterinarioController.js";
import checkAuth from "../middelware/authMiddelware.js";

const router = express.Router();

//Consideramos las rutas publicas y las que se necesitan haber pasado una autenticacion para poder mostrar una informacion:

//Las siguientes son rutas publicas ya que cualquier persona tiene acceso:
router.post("/", registrar);

router.get("/confirmar/:token", confirmar); //Debemos pasar el token generado en la url para poderlo leer. Para ello express permite '/:' despues de :viene una variable dinamica en este caso token-- similar a VUE cuando tiene : quiere decir que lo siguiente es un parametro dinamico y se define en el controlador con req.params.'nombreVariable'-- en este caso req.params.token

router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword); //es post porque el user nos va a ENVIAR/POST su email y verificamos si esta registrado

// router.get("/olvide-password/:token", comprobarToken);
// router.post("/olvide-password/:token", nuevoPassword);

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);//Equivalente a las 2 rutas anteriores concatena los verbos http ya que la ruta es igual. /:token se almacena en req.params.nombreVariable{token}

// Rutas Privadas: estas rutas deben pasar primero un filtro por ello son privadas, ese filtro es un custom middelware o una funcion que escribimos nosotros eje: checkAuth
router.get("/perfil", checkAuth, perfil);
router.put("/perfil/:id", checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword)

export default router;
