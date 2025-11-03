import Knex, { Knex as KnexType } from 'knex';
import dbConfig from './environment';
import knexfile from '../knexfile';  

// Ensure the environment matches keys in knexfile
const environment = dbConfig.environmentStage as keyof typeof knexfile;

// Get config for current environment
const option: KnexType.Config = knexfile[environment];

// Initialize Knex
export const knex = Knex(option);

// Test DB connection
export const dbconnect = async (): Promise<boolean> => {
  try {
    await knex.raw('SELECT 1+1 AS result');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};