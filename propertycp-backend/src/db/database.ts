import { Database } from 'bun:sqlite';
import { createTables } from './schema';
import * as fs from 'fs';
import * as path from 'path';

const DATABASE_PATH = process.env.DATABASE_PATH || './database/propertycp.db';

// Ensure database directory exists
const dbDir = path.dirname(DATABASE_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
const db = new Database(DATABASE_PATH, { create: true });

// Enable WAL mode for better concurrency
db.run('PRAGMA journal_mode = WAL');

// Initialize tables
export const initDatabase = async () => {
  console.log('Initializing database...');
  db.run(createTables);
  console.log('Database initialized successfully!');

  // Run migrations
  try {
    const { runMigrations } = await import('./migrate');
    await runMigrations();
  } catch (error) {
    console.error('Error running migrations:', error);
    // Don't throw - migrations are optional on first init
  }
};

// Helper to convert snake_case to camelCase
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Helper to convert camelCase to snake_case
const toSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result: any, key: string) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

export { db, toCamelCase, toSnakeCase };
export default db;
