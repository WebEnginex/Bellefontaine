import sgMail from '@sendgrid/mail';
if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not defined');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export const sendEmail = async (to, subject, text, html) => {
    try {
        await sgMail.send({
            to,
            from: 'contact@circuitdebellefontaine.fr', // Utilisez votre domaine vérifié SendGrid
            subject,
            text,
            html: html || text,
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};
