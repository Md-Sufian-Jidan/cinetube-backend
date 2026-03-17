import dotenv from 'dotenv';
import AppError from '../errors/AppError';
import status from 'http-status';

dotenv.config()

interface EnvConfig {
  port: string;
  database_url: string;
  NODE_ENV: string;
}

const loadEnvVar = (): EnvConfig => {
  const envVariables = [
    'PORT',
    'DATABASE_URL',
    'NODE_ENV'
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
  };
};

export const env = loadEnvVar();
