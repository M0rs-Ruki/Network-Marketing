import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const router = express.Router();

router.get('', (req, res) => {
  res.render('contact'); 
});

router.post('', async (req, res) => {
  const { name, email, phoneNumber, subject, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).render('contact', {
        error: 'Name, email and message are required'
      });
    }
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, 
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS  
      }
    });

    const mailOptions = {
      from: `"Website Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL,
      subject: subject,
      text: `
You have a new contact form submission:

Name: ${name}
Email: ${email}
Phone Number: ${phoneNumber}
Subject: ${subject}

Message:
${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.render('contact', { success: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).render('contact', { error: 'Failed to send message. Please try again later.' });
  }
});

export default router;
