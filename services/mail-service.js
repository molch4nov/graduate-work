import nodemailer from "nodemailer";
import UserModel from '../models/User.js';

const fromEmail = 'shirley40@ethereal.email';
const fromEmailPass = '16VybmQX9sV38RXuBE';
const host = 'smtp.ethereal.email';
const port = 587;

export const sendOneEmail = async (toEmail, subject, text) => {
    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        auth: {
            user: fromEmail,
            pass: fromEmailPass
        }
    });

    const info = await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: text
    });

    console.log("Message sent: %s", info.messageId);
}

export const startSendingEmails = async (subject, text) => {
    try {
        const users = await UserModel.find({ subscription: true });
        users.forEach(async (user) => {
            await sendOneEmail(user['email'], subject, text);
        })
    } catch (e) {
        console.log(e)
    }
}

export const createAnnouncement = async (req, res) => {
    try {
        const text = req.body.text;
        const title = req.body.title;

        const users = await UserModel.find({ subscription: true });
        users.forEach(async (user) => {
            await sendOneEmail(user['email'], title, text);
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'Не удалось сделать анонс.'
        })
    }
}