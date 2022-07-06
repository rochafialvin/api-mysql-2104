require("dotenv").config();
const nodemailer = require("nodemailer");

const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env;

const courier = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "rochafi.teach@gmail.com",
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    refreshToken: REFRESH_TOKEN,
  },
});

const sendMail = async ({ email, token }) => {
  const mail = {
    from: "DEVELOPER PURWADHIKA <rochafi.teach@gmail.com>",
    to: email,
    subject: "Kirim - kirim salam",
    html: `<h1>Halo, anda mendapatkan salam dari yang pernah ada</h1>`,
  };

  try {
    await courier.sendMail(mail);
    console.log("email berhasil dikirim");
  } catch (error) {
    throw error;
  }
};

module.exports = { sendMail };
