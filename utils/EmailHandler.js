const nodemailer = require('nodemailer');

const EmailHandler = async (email,link, number) => {
    try {

        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        const message = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: number === 1 ? "Account verification" : "Password Reset",
            text: "Welcome",
            html : `
            <div>
            <a href=${link}>Click here to ${number === 1 ? `activate your account` : `reset your password`}</a>
            </div>`
        }
        const info = await transporter.sendMail(message);

        console.log("message is sending 99%")
        console.log('Message sent: %s', info.messageId);

    } catch (error) {
        console.log("Email Not Sent");
        console.log(error)
    }



}

module.exports = EmailHandler;