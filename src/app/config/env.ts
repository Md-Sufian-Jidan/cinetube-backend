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
    'ADMIN_EMAIL'
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
  };
};

export const env = loadEnvVar();
