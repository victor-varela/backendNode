import jwt from 'jsonwebtoken';
const generarJWT = (id)=>{
 return  jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d',
 })
};

//En el payload(informacion del token) no colocar datos sensibles. Recomendable usar un ID que luego es verifica en la DB
//jwt.sign(  ) dentro del parentesis va la informacion que vamos a pasar o almacenar por el token. lo recomendable es pasar info 'encriptada' como Id's y ya con ese Id tenemos acceso a todo el objeto que estamos buscando. Recuerda: este paso es para que el servidor firme (sign) los datos del cliente con la secret_key (que nosotros creamos). En otras palabras, aca nosotros estamos enviando el id con nuestra firma.


// Resumen:
// Generas el JWT cuando el usuario inicia sesión.
// Envías el JWT con cada solicitud que hace el usuario.
// Verificas el JWT en el servidor para asegurarte de que el usuario tiene permiso.

export default generarJWT;