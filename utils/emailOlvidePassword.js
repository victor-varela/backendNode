import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
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
    subject: "Reestablece tu password en APV",
    text: "Reestablece tu password en APV",
    html: ` <p> Hola ${nombre}, has solicitado reestablecer tu password. <p/>

            <p>Sigue el siguiente enlace:</p> 
            <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>

            <p>Si tu no creaste esta cuenta, por favor ignora este mensaje</p>
    
    `,
  });

  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailOlvidePassword;

//Copiamos la funcion de mailtrap {modificamos var por const y transport por transporter para legibilidad} para nodemailer en el cuerpo nuestra funcion. Pasamos a variables de entorno para proteger los datos. Usamos async await porque es un 'servicio externo'
