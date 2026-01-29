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

  // Split the createTables SQL into individual statements
  const statements = createTables
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  // Execute table creation statements first (skip index creation for now)
  for (const statement of statements) {
    if (!statement.toUpperCase().includes('CREATE INDEX')) {
      try {
        db.run(statement);
      } catch (error: any) {
        // Ignore errors for existing tables
        if (!error.message?.includes('already exists')) {
          console.error('Error creating table:', error);
        }
      }
    }
  }

  console.log('Database tables initialized!');

  // Run migrations to add new columns
  try {
    const { runMigrations } = await import('./migrate');
    await runMigrations();
  } catch (error) {
    console.error('Error running migrations:', error);
    // Don't throw - migrations are optional on first init
  }

  // Now create indexes after migrations have run
  for (const statement of statements) {
    if (statement.toUpperCase().includes('CREATE INDEX')) {
      try {
        db.run(statement);
      } catch (error: any) {
        // Ignore errors for existing indexes
        if (!error.message?.includes('already exists')) {
          console.error('Error creating index:', error);
        }
      }
    }
  }

  console.log('Database initialized successfully!');
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
