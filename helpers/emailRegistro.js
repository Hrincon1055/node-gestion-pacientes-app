import nodemailer from "nodemailer";
const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const { email, nombre, token } = datos;
  const info = await transport.sendMail({
    from: "APV - Administrador de pacinetes.",
    to: email,
    subject: "Comprueba tu cuenta en APV.",
    text: "Comprueba tu cuenta en APV.",
    html: /* html */ `
    <p>Hola: ${nombre}, comprueba tu cuenta en APV</p> <span><a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar</a></span>
    `,
  });
  console.log("Enviado: %s", info.messageId);
};
export default emailRegistro;
