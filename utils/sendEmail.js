import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"Citas Médicas" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error("Error al enviar el correo:", err);
        throw new Error("Fallo el envío de correo");
    }

};

export default sendEmail;
