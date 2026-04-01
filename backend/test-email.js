require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const runTest = async () => {
    try {
        console.log('Testing SMTP connection with Gmail...');
        console.log('Using EMAIL:', process.env.SMTP_EMAIL);
        
        await sendEmail({
            email: process.env.SMTP_EMAIL, // Send test email to themselves
            subject: 'Hodama Deals: Test SMTP Configuration',
            html: '<h1>Success!</h1><p>Your Gmail SMTP setup works perfectly.</p>'
        });
        console.log('SUCCESS! Test email sent successfully.');
    } catch (error) {
        console.error('FAILED to send test email:');
        console.error(error.message);
    }
};

runTest();
