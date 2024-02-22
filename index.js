import nodemailer from "nodemailer";
import express from "express";
import 'dotenv/config';
import { config } from 'dotenv';

config({path: './config.env'});

const app = express()
const port = 5007

console.log(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASSWORD,
    process.env.FROM_EMAIL,

)
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false // Use only during development, not recommended for production
    }
});

app.use(express.json()); // Add this line to parse JSON requests

app.post('/send-email', async (req, res) => {
    try {
        const { username, recipientEmail, otp } = req.body;
        console.log(req.body);
        if (!username || !recipientEmail || !otp) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const subject = `One-Time Password (OTP) for Exam Management Software Verification`;
        const body = `Dear ${username},\n\nWe hope this email finds you well. As part of our commitment to ensuring the security of your account and maintaining the integrity of our exam management software, we require you to verify your email address.\n\nTo proceed with the verification process, please use the following One-Time Password (OTP):\n\nOTP: ${otp}\n\nPlease enter this code within the next [2 minutes] to confirm your email address and complete the verification.\n\nThank you for your cooperation and commitment to maintaining a secure exam environment.\n\nBest regards,\n\nExam Management Software`;

        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: recipientEmail,
            subject: subject,
            text: body,
        });

        console.log('Email sent:', info);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
});

app.post('/send-email-v2', async (req, res) => {
    try {
        const { recipientEmail, subject, body } = req.body;
        console.log(req.body);
        if (!body || !recipientEmail || !subject) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        for(let i = 0; i < 2; i++) {
            const info = await transporter.sendMail({
                from: process.env.FROM_EMAIL,
                to: recipientEmail,
                subject: subject,
                text: body,
            });
            console.log('Email sent:', info);
        }

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
});

app.listen(port, () => {
    console.log(`Email api is listening on http://localhost:${port}`);
});
