import mongoose from "mongoose";


const pacientesSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  propietario: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  sintomas: {
    type: String,
    required: true,
  },
  //Almacenamos una referencia de quien es el veterinario que lo trata- Definimos la relacion Paciente - Veterinario con ref:'Veterinario' nombre del MODELO. type: mongoose.Schema.Types.ObjectId obtiene el id del veterinario en la DB
  veterinario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Veterinario",
  },


},{
    timestamps: true, //crea las columnas de fecha creacion y editado
});

const Paciente = mongoose.model('Paciente', pacientesSchema);

export default Paciente;
