require('dotenv').config();
const path = require('path');

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

if (!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_PORT || !DB_NAME) {
  console.error('Missing database environment variables');
  process.exit(1);
}

console.log('Running migrations...');
console.log(`
Running migrations on:
  Host: ${DB_HOST}
  Port: ${DB_PORT}
  Database: ${DB_NAME}
`);

require('./init');
