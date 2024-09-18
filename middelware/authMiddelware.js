import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

//Este custom middelware o funcion toma como parametros req, res y next para poder pasar el control del codigo al siguiente middelware. Es similar a los parametros del controlador
const checkAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // verifica si el encabezado authorization comienza con 'Bearer', pero no se valida el token en sí, es un primer filtro del tipo de auth {Bearer} que nosotros implementamos para evitar token incorrectos

    try {
      // Intenta decode el token, para ello cortamos la palabra Bearer que tiene el token en req.headers.authorization

      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // metodo verify toma el token que queremos decodificar y la key secret y detecta si fue modificado. Si hay un error se va por el catch

      req.veterinario = await Veterinario.findById(decoded.id).select(
        "-password -confirmado -token"
      ); // cuando usamos los metodos {finOne, findById, etc..} del modelo usamos AWAIT por ende ASYNC en la funcion ya que sino el codigo devuelve la variable sin los valores ya que no tiene el tiempo de consultar la DB. .select('-campo' para eliminar campos en la consulta)

      return next(); //pasa al siguiente middelware {depende de donde se llame a esta funcion puede ser : perfil, agregarPaciente}
    } catch (error) {
      const err = new Error("Token no valido");
      return res.status(403).json({ msg: err.message });
    }
  }

  if (!token) {
    const e = new Error("Token invalido o inexistente");
    res.status(403).json({ msg: e.message });
  }

  next();
};

//En POSTMAN el token se guarda como variable de entorno, en la pestaña Auth-- y el tipo de autenticacion es Bearer token, es una convencion.

export default checkAuth;

// No se trata de un almacenamiento interno en el sentido tradicional, como una base de datos o almacenamiento en disco. En su lugar, req.veterinario es una propiedad temporal que se agrega al objeto de solicitud (req) durante el ciclo de vida de una sola solicitud HTTP.

// Dónde se almacena:

// Memoria del servidor: La propiedad req.veterinario se almacena en la memoria del servidor solo mientras se procesa la solicitud actual. Cada vez que el servidor recibe una solicitud, crea un nuevo objeto de solicitud (req) y un nuevo objeto de respuesta (res). Las propiedades agregadas a req (como req.veterinario) existen solo durante el tiempo de vida de esa solicitud específica.
// Propósito:

// Pasar datos entre middleware y controladores: El objetivo principal de agregar propiedades al objeto de solicitud es facilitar el paso de datos entre diferentes middleware y controladores en el ciclo de vida de la solicitud. En este caso, req.veterinario se utiliza para que los middleware o controladores que se ejecuten después puedan acceder al objeto veterinario autenticado sin necesidad de volver a buscarlo en la base de datos.
// Por lo tanto, req.veterinario actúa como un mecanismo temporal de almacenamiento en memoria que facilita el paso de información entre las distintas partes de la lógica de manejo de la solicitud en el servidor. Una vez que se envía la respuesta y se completa el ciclo de vida de la solicitud, el objeto req y cualquier propiedad agregada a él, como req.veterinario, se eliminan de la memoria.


//IMPORTANTE: esta funcion guarda en el servidor la sesion del veterinario en req.veterinario y luego se puede usar en cualquier lugar de la app