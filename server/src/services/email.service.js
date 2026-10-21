import nodemailer from 'nodemailer'
import { env } from '../config/env.js'
const transport = env.SMTP_HOST ? nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_PORT === 465, auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined }) : null
export const sendAuthEmail = async ({ to, subject, text }) => { if (!transport || env.NODE_ENV === 'development') { console.info(`[auth email] ${to}: ${subject}\n${text}`); return } await transport.sendMail({ from: env.EMAIL_FROM, to, subject, text }) }
