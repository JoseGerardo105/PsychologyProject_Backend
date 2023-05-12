import nodemailer from "nodemailer";
//import dotenv from "dotenv";

const forgetPasswordEmail = async (data) => {

  const transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: process.env.PORT_EMAIL,
    sequre: true,
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
    subject:'Recuperar cuenta',
    text:'Reestablece tu contraseña',
    html:`
        <p>Buen día ${name}, Has pedido reestablecer tu contraseña.</p>
        <p>Para generar una nueva contraseña siga el siguiente enlace
        </p>
        <p>
        </p>
        <p>
        <a href="${process.env.FRONTEND_URL}/restore-account/${token}">Reestablecer contraseña</a>
        </p>
        <p>Si no has creado esta cuenta, te pedimos que ignores este mensaje</p>`,
  });

  console.log("Mensaje enviado %s",mailInformation.messageId);
};

export default forgetPasswordEmail;
