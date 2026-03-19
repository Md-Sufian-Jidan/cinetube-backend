import nodemailer from "nodemailer";
import { env } from "../config/env";
import path from "path";
import ejs from "ejs";
import AppError from "../errors/AppError";
import status from "http-status";

const transporter = nodemailer.createTransport({
    host: env.EMAIL_SENDER.SMTP_HOST,
    secure: true,
    auth: {
        user: env.EMAIL_SENDER.SMTP_USER,
        pass: env.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(env.EMAIL_SENDER.SMTP_PORT)
});

export interface ISendEmail {
    to: string;
    subject: string;
    templateName: string;
    templateData: Record<string, any>;
}

export const sendEmail = async ({ to, subject, templateName, templateData }: ISendEmail) => {
    const templatePath = path.resolve(process.cwd(), `src/app/templates/${templateName}.ejs`);

    const html = await ejs.renderFile(templatePath, templateData);
    try {
        await transporter.sendMail({
            from: `"CineTube" <${env.EMAIL_SENDER.SMTP_FROM}>`,
            to,
            subject,
            html,
        });
    } catch (error: any) {
        console.log(error);
        throw new AppError(status.INTERNAL_SERVER_ERROR, error.message || "Failed to send email");
    }
};