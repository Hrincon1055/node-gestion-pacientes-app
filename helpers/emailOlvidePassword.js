import nodemailer from "nodemailer";
const emailOlvidePassword = async (datos) => {
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
    subject: "Restablece tu password.",
    text: "Restablece tu password.",
    html: /* html */ `
    <p>Hola: ${nombre}, Has solicitado restablecer tu password</p> <span><a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Recuperar</a></span>
    `,
  });
  console.log("Enviado: %s", info.messageId);
};
export default emailOlvidePassword;
