const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util'); //convierte promises a async await
const emailConfig = require ('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    //secure: false, // true for 465, false for other ports
    auth: {
      user: emailConfig.user, // generated ethereal user
      pass: emailConfig.pass, // generated ethereal password
    },
  });

  //generar html mail
  const generarHTML = (archivo, opciones={}) => {
      const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
      return juice(html);
  }
exports.enviar = async (opciones) => {
    const html = generarHTML(opciones.archivo, opciones); // html body
    const text = htmlToText.fromString(html)

    let opcionesEmail = {
      from: '"app dsi 👻" <no-reply@uptask.com>', // sender address
      to: opciones.usuario.email, // list of receivers
      subject: opciones.subject, //"Password Reset ✔", // Subject line
      text: text,
      html:html //"Hola", // plain text body
    };
    const enviarEmail = util.promisify(transport.sendMail, transport);
    return enviarEmail.call(transport, opcionesEmail)
    //transport.sendMail(mailOptions);
}
// send mail with defined transport object
