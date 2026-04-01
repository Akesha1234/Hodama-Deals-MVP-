const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Note: To make this "Real World", these should ideally come from process.env
    // Here we use a generic fallback, but it's configured for typical SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL || 'your_smtp_user',
            pass: process.env.SMTP_PASSWORD || 'your_smtp_password',
        },
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Hodama Deals'} <${process.env.FROM_EMAIL || 'noreply@hodamadeals.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments || [],
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
