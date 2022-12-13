import nodemailer, { SendMailOptions } from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST!,
    port: +process.env.MAIL_PORT!,
    secure: process.env.MAIL_ENCRYPTION! === 'ssl',
    auth: {
        user: process.env.MAIL_USERNAME!,
        pass: process.env.MAIL_PASSWORD!
    }
});

const sendMail = async (mailOptions: SendMailOptions) => {
    const defaultOptions = {
        from: `"${process.env.COMPANY_NAME}" <${process.env.MAIL_USERNAME!}>`,
    };

    try {
        const info = await transporter.sendMail({ ...defaultOptions, ...mailOptions });
        console.log(`Email sent: ${info.response}`);
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}

export default sendMail