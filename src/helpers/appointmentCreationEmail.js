import nodemailer from "nodemailer";
//import dotenv from "dotenv";

const appointmenteCreationEmail = async (data) => {

  const transporter = nodemailer.createTransport({
    host: process.env.HOST_EMAIL,
    port: process.env.PORT_EMAIL,
    sequre: true,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.PASSWORD_EMAIL,
    },

  });

  //Enviar correo de creación de cita
  const {psychologistName, patientName, startDateAndTime,finishDateAndTime,email} = data;


  const mailInformation = await transporter.sendMail({
    from: 'Plataforma para la gestión de pacientes de consultorio psicológico',
    to:email,
    subject:'Notificación creación de cita',
    text:'Notificación creación de cita',
    html:`
        <p>Buen día, a continuación enviamos los detalles de la cita psicológica programada
        </p>
        <p>
        Nombre paciente: ${patientName}, Nombre del psicólogo: ${psychologistName}
        </p>
        <p>
        Fecha y hora de inicio: ${startDateAndTime}, Fecha y hora de finalización: ${finishDateAndTime}
        </p>
        
        <p>
        Si usted no es el psicólogo o paciente mencionado en este correo, le pedimos que ignore este mensaje</p>`,
  });

  console.log("Mensaje enviado %s",mailInformation.messageId);
};

export default appointmenteCreationEmail;