require("dotenv").config();
const config = require("config");
const dbName = config.get("db")?.name;
if (!dbName) return;

const { Client } = require("pg");

// Database configuration
const client = new Client({
  host: "localhost",
  user: "user_postgres",
  password: "pass_postgres",
  port: 5432,
});

// Function to check if a database exists
async function databaseExists(dbName) {
  try {
    const query = `SELECT 1 FROM pg_database WHERE datname = $1;`;
    const result = await client.query(query, [dbName]);
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error checking database existence", err.stack);
    throw err;
  }
}

// Function to create a new database if it does not exist
async function createDatabase() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // Check if the database already exists
    const exists = await databaseExists(dbName);
    if (exists) {
      console.log(`Database "${dbName}" already exists`);
    } else {
      // Create the database if it does not exist
      const createDbQuery = `CREATE DATABASE ${dbName};`;
      await client.query(createDbQuery);
      console.log(`Database "${dbName}" created successfully`);
    }
  } catch (err) {
    console.error("Error creating database", err.stack);
  } finally {
    await client.end();
    console.log("Connection closed");
  }
}

createDatabase();
