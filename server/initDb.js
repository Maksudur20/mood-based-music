import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// Supabase PostgreSQL direct pooler URI with password provided by user
const connectionString = "postgresql://postgres.daeyvqdmmatklkfmvjho:Sium%40%232000%40%23@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

async function runMigration() {
  console.log("Connecting to Supabase PostgreSQL database...");
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected successfully!");

    const sqlPath = path.join(process.cwd(), '../database_schema.sql');
    console.log("Reading database_schema.sql from:", sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log("Executing SQL migration script...");
    await client.query(sql);
    console.log("✅ Database schema and seed data created successfully!");

  } catch (err) {
    console.error("❌ Migration error:", err.message);
  } finally {
    await client.end();
  }
}

runMigration();
