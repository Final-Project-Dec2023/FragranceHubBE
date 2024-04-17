import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config()

// config nodemailer transporter
const tranporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth:{
        user: process.env.EMAIL_FROM,
        pass: process.env.SMTP_KEY,
    }
})



// create sendEmail function
export const sendEmailFunction = async (to, subject, msg)=>{
    const mailOptions = {
        from: "pausepoint2023@gmail.com",
        to: to,
        subject: subject,
        text: msg,
        html:   `<body><h2>${subject}</h2><p>${msg}!</p><b>Fragrancehub mgt.</b></body>`
    }

    try {
    await tranporter.sendMail(mailOptions)
    console.log(`Email sent to ${to}`);
    } catch (err) {
        console.log("Error sending Email", err.message);
    }
}
