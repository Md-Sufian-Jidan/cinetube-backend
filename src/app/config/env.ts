import dotenv from 'dotenv';
import AppError from '../errors/AppError';
import status from 'http-status';

dotenv.config()

interface EnvConfig {
  port: string;
  database_url: string;
  NODE_ENV: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ADMIN_PASSWORD: string;
  ADMIN_EMAIL: string;
  FRONTEND_URL: string;
  EMAIL_SENDER: {
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM: string;
  };
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

const loadEnvVar = (): EnvConfig => {
  const envVariables = [
    'PORT',
    'DATABASE_URL',
    'NODE_ENV',
    'BETTER_AUTH_SECRET',
    'BETTER_AUTH_URL',
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET',
    'ADMIN_PASSWORD',
    'ADMIN_EMAIL',
    'FRONTEND_URL',
    'EMAIL_SENDER_SMTP_HOST',
    'EMAIL_SENDER_SMTP_PORT',
    'EMAIL_SENDER_SMTP_USER',
    'EMAIL_SENDER_SMTP_PASS',
    'EMAIL_SENDER_SMTP_FROM',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ]

  envVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      throw new AppError(status.INTERNAL_SERVER_ERROR, `Environment variable ${envVar} is not defined`);
    }
  });

  return {
    port: process.env.PORT!,
    database_url: process.env.DATABASE_URL!,
    NODE_ENV: process.env.NODE_ENV!,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    EMAIL_SENDER: {
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST!,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT!,
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER!,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS!,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM!,
    },
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
  };
};

export const env = loadEnvVar();
