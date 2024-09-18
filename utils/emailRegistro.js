import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { email, nombre, token } = datos;

  //Enviar Email
  const info = await transporter.sendMail({
    from: "APV- Administrador de Pacientes de Veterinaria",
    to: email,
    subject: "Comprueba tu cuenta en APV",
    text: "Comprueba tu cuenta en APV",
    html: ` <p> Hola ${nombre}, comprueba tu cuenta en APV. <p/>
            <p>Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:</p> 
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a>

            <p>Si tu no creaste esta cuenta, por favor ignora este mensaje</p>
    
    `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailRegistro;

//Copiamos la funcion de mailtrap que tiene la integracion co node.js {modificamos var por const y transport por transporter para legibilidad} para nodemailer en el cuerpo nuestra funcion. Pasamos a variables de entorno para proteger los datos. Usamos async await porque es un 'servicio externo'
