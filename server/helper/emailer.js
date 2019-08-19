const nodemailer = require("nodemailer");

exports.sendEMail = (from, to, subject, bodyText, bodyHtml) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      // service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    let mailOptions = {
      from: `"Esign"<${from}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text: bodyText && bodyText, // plain text body
      html: bodyHtml && bodyHtml // html body
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject({
          status: false,
          message: 'Mail can not sent.',
          details: error,
        })
      } else {
        resolve({
          status: true,
          message: 'Mail Sent.',
          details: info.response,
        })
      }
    });
  });
}