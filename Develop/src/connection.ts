import dotenv from 'dotenv';
dotenv.config();

// Import Pool from 'pg' for connection pooling
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432,
});

// Asynchronous function to establish database connection
const connectToDb = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to the database.');
    return client; // Return the client for executing queries
  } catch (err) {
    console.error('❌ Error connecting to database:', err);
    process.exit(1); // Exit if connection fails
  }
};

export { pool, connectToDb };
