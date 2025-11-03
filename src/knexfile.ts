import type { Knex } from 'knex';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') })


// Validate .env presence
if (!process.env.DATABASE_URL && (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME)) {
  throw new Error('❌ Missing database configuration. Ensure DATABASE_URL or DB_HOST, DB_USER, and DB_NAME are defined in your .env');
}

// Fallback connection object if DATABASE_URL is not present
const connection =
  process.env.DATABASE_URL ||
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection,
    migrations: {
      directory:  path.resolve(__dirname, "./db/migrations"),
      extension: 'ts',
    },
    seeds: {
      directory:  path.resolve(__dirname, "./db/seeds"),
      stub:  path.resolve(__dirname, "./db/stubs/seed.ts.stub"),
      extension: 'ts'
    },
  },

  staging: {
    client: 'pg',
    connection,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './dist/db/migrations',
      extension: 'js',
    },
  },

  production: {
    client: 'pg',
    connection,
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      directory: './db/migrations',
      extension: 'ts',
    },
  },
};

console.log('✅ Using Knex config for:', process.env.NODE_ENV || 'development');

export default config;
