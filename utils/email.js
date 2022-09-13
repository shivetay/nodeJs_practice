const nodemailer = require("nodemailer");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Mieszko ${process.env.EMAIL_FROM}`;
  }

  createTransport() {
    if (process.env.NODE_ENC === "production") {
      //SENDGRID

      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  send(template, subject) {
    //send actual email
  }

  sendWelcome() {
    this.send("welcome", "welcome test email");
  }
};

const sendEmail = async (options) => {
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD,
  //   },
  // });
  // const mailOptions = {
  //   from: "Mieszko Admin <mieszkoAdmin@test.com>",
  //   to: options.email,
  //   subject: options.subject,
  //   text: options.message,
  // };
  // await transporter.sendMail(mailOptions);
  console.log(options);
};

module.exports = sendEmail;
