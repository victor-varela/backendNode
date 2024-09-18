import mongoose from "mongoose"; //importamos el ODM (objet data model) de esta manera ya nuestro MODELO tiene los metodos de mongoose que seran utilizados en el CONTROLADOR
import bcrypt from "bcrypt";
import generarId from "../utils/generarID.js";

//En el modelo tambien es donde se hashean los passwords- Esto se hace con una dependencia, hay muchas, en este caso usamos bcrypt

const veterinarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  telefono: {
    type: String,
    default: null,
    trim: true,
  },
  web: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: generarId,
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
});

//Gracias a mongoose se pueden realizar acciones {pre, post, etc} antes de almacenar el registro- En este caso vamos a hashear el password

veterinarioSchema.pre("save", async function (next) {
  //Prevenimos que no vuelva a hashear el password cuando el usuario modifique los datos del schema..

  if (!this.isModified("password")) {
    //sintaxis de mongoose
    next(); //Manda a ejecutar el siguiente middelware y se salta la ejecucion de las siguientes lineas, en este caso el hasheo del password lo cual evita que se haga una vez mas
  }

  const salt = await bcrypt.genSalt(10); // genera un salt de password.
  this.password = await bcrypt.hash(this.password, salt); // Se usa this para tener la referencia del objeto actual (VeterinarioSchema)unimos el hash con el salt : )
});

//Tambien podemos crear metodos que se ejecuten en nuestro schema accediendo al objeto methods de nuestro schema schema.methods.nuevoMetodo
//Comprobaremos el password con bcrypt.compare()

veterinarioSchema.methods.comprobarPassword = async function (
  passwordFormulario
) {
  return await bcrypt.compare(passwordFormulario, this.password);
};

//this.password accede al password del schema, es decir, al que se guardo en la base de datos hasheado {gracias al metodo .pre anterior el password se hashea ANTES-PRE de guardarlo}

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);

export default Veterinario;
