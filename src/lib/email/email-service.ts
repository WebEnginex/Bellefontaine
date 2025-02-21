import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: process.env.ZOHO_EMAIL,
      to,
      subject,
      text,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
