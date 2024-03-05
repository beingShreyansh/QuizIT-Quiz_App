const nodemailer = require("nodemailer");
const { SMTP_MAIL, SMTP_PASSWORD } = process.env;

const sendMail = async (email, mailSubject, content) => {
  try {
    if (!email || email.trim() === "") {
      throw new Error("Recipient's email is not defined");
    }


    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: SMTP_MAIL, pass: SMTP_PASSWORD },
    });

    const mailOptions = {
      from: SMTP_MAIL,
      to: email,
      subject: mailSubject,
      html: content,
    };

    // Use async/await directly without a callback
    const info = await transport.sendMail(mailOptions);

  } catch (error) {
    console.error("Error in sendMail function:", error.message);
    throw error;
  }
};

module.exports = sendMail;
