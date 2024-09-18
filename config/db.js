//Ya conectamos la db con Compass-Atlas (esto nos permitira visualizar los cambios en la db) ahora lo haremos con mongoose que es el ODM- lo instalamos via npm i mongoose. Mongoose es el intermediario entre la app y la DB

import mongoose from "mongoose";

//Conectar DB
const conectarDb = async ()=>{
    try {
        const db = await mongoose.connect(process.env.MONGO_URI);
    
        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
        
    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);//este codigo permite imprimir un mensaje de error
    }
};

export default conectarDb;

//process.env es sintaxis de node MONGO_URI es la variable que creamos para ocultar las credenciales de la DB y se lee gracias a la dependencia dotenv que esta instanciada en index.js como dotenv.config() 