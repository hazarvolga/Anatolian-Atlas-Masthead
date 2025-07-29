import fs from 'fs';
import path from 'path';
import { pool } from '../config/database.js';

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...');
    
    const migrationFile = path.join(process.cwd(), 'migrations', '001_initial_schema.sql');
    
    if (fs.existsSync(migrationFile)) {
      const sql = fs.readFileSync(migrationFile, 'utf8');
      await pool.query(sql);
      console.log('✅ Migrations completed successfully');
    } else {
      console.log('⚠️  No migration file found');
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
