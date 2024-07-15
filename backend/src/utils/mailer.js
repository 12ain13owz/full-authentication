const config = require("config");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const smtp = config.get("smtp");
const log = require("./logger");
const { newError } = require("./helper");
const { encrypt } = require("./crypto");

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: smtp.secure,
  auth: {
    user: smtp.auth.user,
    pass: smtp.auth.pass,
  },
});

const verificationEmail = async (id, fullname, email, verificationCode) => {
  try {
    const data = JSON.stringify({ id, email, verificationCode });
    const encryptData = encrypt(data);
    const encodeURI = encodeURIComponent(encryptData);

    const templatePath = path.join(
      __dirname,
      "../templates/verify-email.template.html"
    );
    const href = `http://localhost:3000/api/v1/auth/verify/${encodeURI}`;
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
    htmlTemplate = htmlTemplate.replace("{{ fullname }}", fullname);
    htmlTemplate = htmlTemplate.replace("{{ href }}", href);

    const mailOptions = {
      from: smtp.auth.user,
      to: email,
      subject: "Full Authentication: Verify your email address",
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    log.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    log.debug(`Encode  URI: ${encodeURI}`);
  } catch (error) {
    console.log(error);
    throw newError(400, error.message);
  }
};

const forgotPasswordEmail = async (email, fullname, passwordResetCode) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates/forgot-email.template.html"
    );
    let htmlTemplate = fs.readFileSync(templatePath, "utf-8");
    htmlTemplate = htmlTemplate.replace("{{ fullname }}", fullname);
    htmlTemplate = htmlTemplate.replace(
      "{{ passwordResetCode }}",
      passwordResetCode
    );

    const mailOptions = {
      from: smtp.auth.user,
      to: email,
      subject: "Full Authentication: Password Reset Code",
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);
    log.debug(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (error) {
    throw newError(400, error.message);
  }
};

module.exports = { verificationEmail, forgotPasswordEmail };
