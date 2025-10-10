import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { User } from './schema';

let pool: Pool;
try {
  pool = new Pool({
    host: process.env.DB_HOST || process.env.db_Host || '13.201.80.103',
    port: Number(process.env.DB_PORT || process.env.db_port) || 5432,
    user: process.env.DB_USER || process.env.db_Username || 'postgres',
    password: process.env.DB_PASSWORD || process.env.db_password || 'rahul',
    database: process.env.DB_NAME || process.env.db_Databse || 'Bus_Tracking_Management_System',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
} catch (error) {
  throw new Error(
    'Failed to create database pool: ' + (error as Error).message,
  );
}
export const db = drizzle(pool);

// Test database connection
export async function testDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Seed admin user (only in development or when explicitly called)
export async function seedAdmin() {
  try {
    await db
      .insert(User)
      .values({
        fullname: 'rahulmekala',
        phone: '9553026345',
        email: 'rahulmekala22@gmail.com',
        role: 'ADMIN',
      })
      .onConflictDoNothing(); // prevent duplicate admin
    console.log('✅ Admin user created (if not exists)');
  } catch (error) {
    console.error('❌ Failed to seed admin user:', error);
  }
}
