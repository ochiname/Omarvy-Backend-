import dotenv from 'dotenv';
import e from 'express';
import { error } from 'node:console';

dotenv.config();

interface DBConfig {
  db_url: string;
  api: string;
  host: string;
  user: string;
  password: string;
  database: string;
  jwtsecret: string;
  port: string;
  environmentStage: 'development' | 'production' | 'staging' | undefined;
}


function getEnvironmentStage(env: string | undefined): 'development' | 'production' | 'staging' | undefined {
  if (env === 'development' || env === 'production' || env === 'staging') {
    return env;
  }
  error('Invalid environment stage');
  return undefined;
}
// Optional: Validate that required variables are defined
const requiredEnvVars = [
  'DATABASE_URL',
  'API_KEY',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'PORT',
];

requiredEnvVars.forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is not set`);
  }
});

const dbConfig: DBConfig = {
  db_url: process.env.DATABASE_URL!,
  api: process.env.API_KEY!,
  host: process.env.DB_HOST!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  jwtsecret: process.env.JWT_SECRET!,
  port: process.env.PORT!,
  environmentStage: getEnvironmentStage(process.env.NODE_ENV),
};

export default dbConfig;
