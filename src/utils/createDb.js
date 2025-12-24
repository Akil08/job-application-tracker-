import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const createDb = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: 'postgres', // Connect to default 'postgres' db to create new db
  });

  try {
    await client.connect();
    
    // Check if database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'job_tracker'");
    if (res.rows.length === 0) {
      console.log("Creating database 'job_tracker'...");
      await client.query('CREATE DATABASE job_tracker');
      console.log("Database 'job_tracker' created successfully.");
    } else {
      console.log("Database 'job_tracker' already exists.");
    }
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    await client.end();
  }
};

createDb();
