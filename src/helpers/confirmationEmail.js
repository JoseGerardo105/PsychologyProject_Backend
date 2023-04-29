import nodemailer from "nodemailer";
// import dotenv from "dotenv";

const confirmationEmail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: process.env.PORT_EMAIL,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASSWORD_EMAIL,
    },
  });

  //Enviar correo de confirmación de cuenta
  const {name, email, token} = data;

  const mailInformation = await transporter.sendMail({
    from: 'Plataforma para la gestión de pacientes de tu consultorio psicológico',
    to:email,
    subject:'Comprobar cuenta de registro',
    text:'Comprueba tu cuenta en nuestro para la gestión de pacientes de su consultorio psicológico',
    html:`
        <p>Buen día ${name}, comprueba tu cuenta para la gestión de pacientes.</p>
        <p>Tu cuenta ya se encuentra lista, ahora el último paso es confirmarla mediante el siguiente enlace:
        </p>
        <p>
        </p>
        <p>
        <a href="${process.env.FRONTEND_URL}/confirm-account/${token}">Comprobar cuenta</a>
        </p>
        <p>Si no has creado esta cuenta, te pedimos que ignores este mensaje</p>`,
  });
  console.log("Mensaje enviado %s",mailInformation.messageId);
};

export default confirmationEmail;
