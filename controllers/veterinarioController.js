import Veterinario from "../models/Veterinario.js"; //El metodo registrar y confirmar debe usar el modelo correspondiente {Veterinario.js} para que solamente acepte los datos definidos en el modelo y {Registrar, Confirmar, Autenticar} tengan acceso al documento
import generarId from "../utils/generarID.js";
import generarJWT from "../utils/generarJWT.js";
import emailRegistro from "../utils/emailRegistro.js";
import emailOlvidePassword from "../utils/emailOlvidePassword.js";

const registrar = async (req, res) => {
  // const {nombre, email, password} = req.body;//hay que colocar app.use(express.json()) en el index.js para que lea los datos que se envian al servidor {el body del POST---- req.body = ahi se almacena }

  //Prevenir Usuarios Duplicados
  const { email, nombre } = req.body;

  try {
    const existeUsuario = await Veterinario.findOne({ email }); // .finOne- metodo de mongoose para buscar un campo ( {email: email} ) se deja solo ( {email} ) porque el key y value tiene el mimso nombre

    if (existeUsuario) {
      const error = new Error("Usuario ya registrado");
      return res.status(400).json({ msg: error.message });
    }
  } catch (error) {
    console.log(error);
  }

  //Cuando usamos la DB/APIs lo hacemos con try catch async await
  try {
    //Guardar un nuevo Veterinario

    const veterinario = new Veterinario(req.body); // crea un nuevo objeto de veterinario y enviamos el body de la funcion ya que es un schema de mongoose

    const veterinarioGuardado = await veterinario.save(); // guarda el registro con el .save()--sintaxis de mongoose


    //Enviar Email- Se hace en este punto del codigo despues que se guardo .save() correctamente ya que debemos generar el token hacerlo antes es un error.
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token
    });

    res.json(veterinarioGuardado); //enviamos un objeto como json ya que este va a interactuar con la API, y la API es un JSON. Luego retornamos la variable guardada
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { veterinario } = req; //destructuring de req.veterinario que ya habiamos almacenado en node

  res.json(veterinario);
};

const confirmar = async (req, res) => {
  //Este controlador se encarga de: CONFIRMAR, es decir, debe  1 -buscar el token en la base de datos y si existe entonces 2-elimina el token ya que es un dato sensible, queda en el historial de las url del cliente y solo se usa una vez y luego 3-cambia confirmado a true.
  console.log(req.params);
  const { token } = req.params; //extraemos de req-params-- para VER el token es req-params.token

  //1-Buscar el Usuario

  const usuarioConfirmar = await Veterinario.findOne({ token }); //busca el objeto que tenga el mismo token y trae TODO el objeto

  if (!usuarioConfirmar) {
    const error = new Error("Token no Valido");
    return res.status(404).json({ msg: error.message }); //el codigo 404 es universal para no encontrado
  }

  //Guardar en la DB-- se usa try catch--

  try {
    //2- Elimina el token
    usuarioConfirmar.token = null;

    //3- Cambia confirmado a true
    usuarioConfirmar.confirmado = true;

    // Guardamos en la DB- por eso el await
    await usuarioConfirmar.save();

    res.json({ msg: "Usuario Confirmado Correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const autenticar = async (req, res) => {
  // Pasos para autenticar un usuario:

  //1 Verificar que existe
  const { email, password } = req.body;

  const usuario = await Veterinario.findOne({ email });
  if (!usuario) {
    const error = new Error("El Usuario no existe");
    return res.status(404).json({ msg: error.message }); //el codigo 404 es universal para no encontrado
  }

  //2 Que su cuenta este confirmada
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  //3 Password este bien escrito: usuario = Veterinario = Schema por lo tanto tiene acceso al metodo que definimos en el modelo .comprobarPassword

  if (await usuario.comprobarPassword(password)) {
    //4 Autenticar- generamos token y enviamos datos de usuario(reescribimos el obj con los campos que nos interesan)
    
    res.json({
      _id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token = generarJWT(usuario.id)
    });
   
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body; //req.body es la informacion de un formulario

  const existeVeterinario = await Veterinario.findOne({ email });
  if (!existeVeterinario) {
    const error = new Error("Usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeVeterinario.token = generarId(); //Generamos el id/token nuevo y luego guardamos en la DB-- existeVeterinario = Veterinario(modelo) tenemos acceso a sus metodos y los campos
    await existeVeterinario.save();

    //Enviar Email- Se hace en este punto del codigo despues que se guardo .save() correctamente ya que debemos generar el token. Hacerlo antes es un error.

    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token
    })


    res.json({ msg: "Hemos enviado un email con las instrucciones" }); //vamos a enviar y leer el token por email, cuando el usuario acceda a su mail y de clic en el enlace la URL tendra el token que vamos a validar

  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  //con este codigo nos aseguramos que la persona accedio correcatamente a su email y abrio correctamente el enlace

  const { token } = req.params; //asi se accede a token. req.params es la informacion de una URL

  const tokenValido = await Veterinario.findOne({ token });

  //NO hacemos try catch porque no vamos a cambiar nada en la DB
  if (!tokenValido) {
    const error = new Error("El token no es valido");
    return res.status(400).json({ msg: error.message });
  }

  res.json({ msg: "El token valido y el usuario existe" });
};
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const veterinario = await Veterinario.findOne({ token }); //vamos a cambiar campos del veterinario por eso el nombre de la variable, podria ser tambien veterinarioActualizado

  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  //Paso la validacion- Hacemos la actualizacion. El token a null porque es de un solo uso porque queda en la url y otra persona lo podria usar

  try {
    //Aca si usamos try catch porque cambiamos campos en la DB
    veterinario.token = null;
    veterinario.password = password;
    //Guardamos, pero como tenemos en el modelo el metodo .pre nos va a hashear el nuevo password antes de guardar
    await veterinario.save(); //siempre antes de guardar o consultar la DB va await
    res.json({ msg: "El password se cambio correctamente" });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) =>{
  const veterinario = await Veterinario.findById(req.params.id);
  if(!veterinario){
    const error = new Error('Hubo un error')
    return res.status(400).json({msg: error.message})
  }

  //Validamos email unico
  const {email} = req
  if(veterinario.email !== req.body.email){
    const existeMail = await Veterinario.findOne(email)
    if(existeMail){
      const error = new Error('Email ya esta registrado')
      return res.status(400).json({msg: error.message})
    }
  }
  
  try {
    //Primero Actualizamos
    veterinario.nombre = req.body.nombre
    veterinario.web = req.body.web
    veterinario.telefono = req.body.telefono
    veterinario.email = req.body.email

    //Despues lo guardamos
    const veterinarioActualizado = await veterinario.save()

    res.json(veterinarioActualizado)
  } catch (error) {
    console.log(error);  
  }
  
}

const actualizarPassword = async (req, res)=>{
  //Leer datos
  const {password, new_password} = req.body
  //Comprobar Veterinario
  const {id} = req.veterinario
  const veterinario = await Veterinario.findById(id);
  if(!veterinario){
    const error = new Error('Hubo un error')
    return res.status(400).json({msg: error.message})
  }

  //Comprobar Password
  if(await veterinario.comprobarPassword(password)){
    //Actualizar Password
    veterinario.password = new_password
    await veterinario.save()
    res.json({ 
    msg:'Password Almacenado Correctamente'    
   })
    
  }else{
    const error = new Error('El password actual es incorrecto')
   return res.status(400).json({msg: error.message, error: true})
    
  }
  
}



export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword
};
