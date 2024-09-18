import express from "express"; //para usar esta sintaxis debemos agregar manualmente "type":"module" en el package-json
import dotenv from "dotenv";
import cors from "cors"; //para permitir los dominios que acceden al server
import conectarDb from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();
app.use(express.json()); //esto reemplaza el body parser y permite leer lo que se envia {request} al servidor
dotenv.config(); //instanciamos dotenv- automaticamente busca los archivos dentro de .env y los reconoce

conectarDb();

//configuramos Cors
const dominiosPermitidos = [process.env.FRONTEND_URL];

//Esto es configuracion de cors
const corsOptions = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      // Si el dominio existe - El origin esta permitido
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions)); //middelware para uso de cors

app.use("/api/veterinarios", veterinarioRoutes); //esta es la ruta BASE para el backend de Veterinario
app.use("/api/pacientes", pacienteRoutes); //esta es la ruta BASE para el backend de Paciente

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto: ${PORT}`);
});
