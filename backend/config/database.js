import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

console.log('🔧 Database config:', {
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/nextstopturkey'
});

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/nextstopturkey',
  max: 20, // max number of connections in the pool
  idleTimeoutMillis: 30000, // close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
});

// Test connection
pool.on('connect', () => {
  console.log('🐘 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('💥 PostgreSQL connection error:', err);
});

export default pool;
